[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][int]$ParentPid,
  [Parameter(Mandatory = $true)][int]$Port,
  [Parameter(Mandatory = $true)][string]$ProjectId,
  [Parameter(Mandatory = $true)][string]$RulesPath,
  [Parameter(Mandatory = $true)][string]$StartedUtc,
  [Parameter(Mandatory = $true)][string]$EmulatorPidsFile
)

$ErrorActionPreference = 'Stop'
$started = [DateTimeOffset]::Parse($StartedUtc).UtcDateTime
$jarPattern = 'cloud-firestore-emulator[^\s"]*\.jar'
$hostPattern = '(?:^|\s)--host(?:=|\s+)"?127\.0\.0\.1"?(?:\s|$)'
$portPattern = '--port(?:=|\s+)' + [regex]::Escape([string]$Port) + '(?:\s|$)'
$projectPattern = [regex]::Escape($ProjectId)
$rootProcessIds = @($ParentPid)
if (Test-Path -LiteralPath $EmulatorPidsFile) {
  $recordedProcessIds = @(
    Get-Content -LiteralPath $EmulatorPidsFile |
      Where-Object { $_ -match '^\d+$' } |
      ForEach-Object { [int]$_ } |
      Select-Object -Unique
  )
  $rootProcessIds = @($rootProcessIds + $recordedProcessIds | Select-Object -Unique)
}
$deadline = [DateTime]::UtcNow.AddSeconds(8)

function Get-VerifiedDescendants {
  $processes = Get-CimInstance -ClassName Win32_Process
  return @($processes | Where-Object {
    ($_.ProcessId -in $rootProcessIds -or $_.ParentProcessId -in $rootProcessIds) -and
      $_.Name -ieq 'java.exe' -and
      $_.CommandLine -match $jarPattern -and
      $_.CommandLine -match $hostPattern -and
      $_.CommandLine -match $portPattern -and
      $_.CommandLine -match $projectPattern -and
      $_.CommandLine.IndexOf($RulesPath, [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -and
      ($_.CreationDate -is [DateTime]) -and $_.CreationDate.ToUniversalTime() -ge $started
  })
}

while ([DateTime]::UtcNow -lt $deadline) {
  $candidates = Get-VerifiedDescendants
  if ($candidates.Count -eq 0) {
    Write-Output "No leftover Firestore emulator process remained for CLI PID $ParentPid."
    exit 0
  }
  foreach ($candidate in $candidates) {
    $targetProcessId = [int]$candidate.ProcessId
    $stillExact = Get-CimInstance -ClassName Win32_Process -Filter "ProcessId = $targetProcessId"
    if ($stillExact -and ($stillExact.ProcessId -in $rootProcessIds -or $stillExact.ParentProcessId -in $rootProcessIds) -and $stillExact.Name -ieq 'java.exe' -and $stillExact.CommandLine -match $jarPattern -and $stillExact.CommandLine -match $hostPattern -and $stillExact.CommandLine -match $portPattern -and $stillExact.CommandLine -match $projectPattern -and $stillExact.CommandLine.IndexOf($RulesPath, [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -and ($stillExact.CreationDate -is [DateTime]) -and $stillExact.CreationDate.ToUniversalTime() -ge $started) {
      Stop-Process -Id $targetProcessId -Force
      Write-Output "Stopped verified Firestore emulator process PID $targetProcessId from this CLI run."
    }
  }
  Start-Sleep -Milliseconds 200
}

$remaining = Get-VerifiedDescendants
if ($remaining.Count -gt 0) {
  $ids = ($remaining | ForEach-Object { $_.ProcessId }) -join ', '
  Write-Error "Verified Firestore emulator process cleanup failed for PID(s): $ids."
  exit 1
}
Write-Output "No leftover Firestore emulator process remained for CLI PID $ParentPid."
exit 0

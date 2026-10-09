import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(resolve(root, "firebase.json"), "utf8"));
const port = Number(config.emulators?.firestore?.port);
const projectId = "demo-atlas-cloud-rules";
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("firebase.json must define a valid Firestore emulator port.");
}
const firebaseCli = resolve(root, "node_modules/firebase-tools/lib/bin/firebase.js");
if (!existsSync(firebaseCli)) {
  throw new Error("Pinned Firebase CLI is missing. Run npm ci first.");
}
const cleanupScript = resolve(root, "scripts/cleanup-firestore-emulator.ps1");
const preloader = resolve(root, "scripts/hide-firestore-emulator.cjs");
const rulesPath = resolve(root, "firestore.rules");
const startedUtc = new Date().toISOString();
const environment = { ...process.env };
let emulatorPidsFile = null;
if (process.platform === "win32") {
  emulatorPidsFile = resolve(tmpdir(), `atlas-firestore-emulator-${process.pid}-${randomUUID()}.pids`);
  environment.ATLAS_CLOUD_RULES_PID_FILE = emulatorPidsFile;
  if (process.argv.includes("--trace")) environment.ATLAS_CLOUD_RULES_TRACE = "1";
  const preloadOption = `--require "${preloader.replaceAll("\\", "/")}"`;
  environment.NODE_OPTIONS = [preloadOption, environment.NODE_OPTIONS].filter(Boolean).join(" ");
}

const firebase = spawn(process.execPath, [
  firebaseCli,
  "emulators:exec",
  "--only",
  "firestore",
  "--project",
  projectId,
  "node --test test/cloud-rules.rules.js",
], {
  cwd: root,
  env: environment,
  stdio: "inherit",
  windowsHide: true,
});
const firebasePid = firebase.pid;
if (process.argv.includes("--trace")) {
  console.error(`[cloud rules harness] wrapper PID ${process.pid}; Firebase CLI PID ${firebasePid}; port ${port}.`);
}
let signalSent = false;
const forwardSignal = (signal) => {
  if (!signalSent && firebasePid && firebase.exitCode === null) {
    signalSent = true;
    firebase.kill(signal);
  }
};
const onSigInt = () => forwardSignal("SIGINT");
const onSigTerm = () => forwardSignal("SIGTERM");
process.on("SIGINT", onSigInt);
process.on("SIGTERM", onSigTerm);

firebase.once("error", (error) => {
  console.error(`Could not start the pinned Firebase CLI: ${error.message}`);
  process.exitCode = 1;
});
firebase.once("close", async (code, signal) => {
  process.off("SIGINT", onSigInt);
  process.off("SIGTERM", onSigTerm);
  let cleanupCode = 0;
  if (process.platform === "win32" && firebasePid) {
    cleanupCode = await cleanupWindowsEmulator({ root, cleanupScript, firebasePid, port, projectId, rulesPath, startedUtc, emulatorPidsFile });
    try { rmSync(emulatorPidsFile, { force: true }); } catch (error) {
      console.error(`Could not remove temporary emulator PID file: ${error.message}`);
      cleanupCode = 1;
    }
  }
  process.exitCode = cleanupCode === 0 && code !== null ? code : 1;
  if (signal) console.error(`Firebase emulator runner exited on ${signal}.`);
});

function cleanupWindowsEmulator({ root, cleanupScript, firebasePid, port, projectId, rulesPath, startedUtc, emulatorPidsFile }) {
  return new Promise((resolveCleanup) => {
    const cleanup = spawn("powershell.exe", [
      "-NoLogo",
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      cleanupScript,
      "-ParentPid",
      String(firebasePid),
      "-Port",
      String(port),
      "-ProjectId",
      projectId,
      "-RulesPath",
      rulesPath,
      "-StartedUtc",
      startedUtc,
      "-EmulatorPidsFile",
      emulatorPidsFile,
    ], {
      cwd: root,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    cleanup.stdout.setEncoding("utf8").on("data", (text) => { stdout += text; });
    cleanup.stderr.setEncoding("utf8").on("data", (text) => { stderr += text; });
    cleanup.once("error", (error) => {
      console.error(`Could not verify emulator cleanup: ${error.message}`);
      resolveCleanup(1);
    });
    cleanup.once("close", (code) => {
      if (stdout.trim()) process.stdout.write(`[cleanup] ${stdout.trim()}\n`);
      if (stderr.trim()) process.stderr.write(`[cleanup] ${stderr.trim()}\n`);
      resolveCleanup(code === 0 ? 0 : 1);
    });
  });
}

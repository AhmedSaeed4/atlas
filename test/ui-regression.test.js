import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/workspace.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/src/app.js", import.meta.url), "utf8");
const cloudUi = readFileSync(new URL("../public/src/cloud-ui.js", import.meta.url), "utf8");

test("SVG card entrance preserves each card position", () => {
  const keyframes = [...css.matchAll(/@keyframes\s+atlas-card-in\s*\{([^}]*(?:\}[^}]*)?)\}/g)];
  assert.ok(keyframes.length > 0);
  for (const frame of keyframes) assert.doesNotMatch(frame[1], /transform\s*:/);
});

test("graph SVG exposes interactive descendants as an accessible group", () => {
  assert.match(html, /<svg id="graph"[^>]*role="group"[^>]*aria-label="Interactive software architecture graph"/);
});

test("workspace documents local backups, separate shared snapshots, and the landing link", () => {
  assert.match(html, /href="\.\/" aria-label="Atlas home"/);
  assert.match(html, /Export &gt; Download JSON for a backup/);
  assert.match(html, /Import architecture to restore it elsewhere/);
  assert.match(html, /Clearing this browser's site data removes saved projects/);
  assert.match(html, /snapshot anyone with the link can read/);
  assert.match(html, /separate copy, with no account, live collaboration, or upload/);
  assert.match(html, /A localhost link works only on this computer/);
});

test("invalid shared maps have persistent, accessible JSON import recovery", () => {
  assert.match(html, /id="incoming-share-error"[^>]*role="alert"[^>]*aria-live="assertive"/);
  assert.match(html, /id="incoming-share-title">Could not open this shared map/);
  assert.match(html, /id="incoming-share-message"/);
  assert.match(html, /id="incoming-share-context" class="incoming-share-context"/);
  assert.match(html, /id="recover-share-json"[^>]*>Import JSON instead/);
  assert.match(html, /id="dismiss-share-error"[^>]*>Dismiss/);
  assert.match(css, /\.incoming-share-error\[hidden\]\{display:none\}/);
});

test("sidebar switches libraries in place and exposes a separate scoped settings dialog", () => {
  assert.match(html, /id="project-list" class="project-list"/);
  assert.match(html, /id="workspace-library-select"[^>]*aria-controls="project-list"/);
  assert.match(html, /<option value="local" selected>Local Workspace<\/option>/);
  assert.match(html, /<option value="cloud">Cloud Workspace<\/option>/);
  assert.ok(html.includes('id="storage-heading" class="visually-hidden" for="workspace-library-select">Workspace library</label>'));
  assert.match(html, /id="storage-copy"/);
  assert.doesNotMatch(html, /id="local-workspace-switch"|id="cloud-workspace-switch"/);
  assert.match(html, /id="cloud-workspace-state"[^>]*role="status"/);
  assert.match(html, /id="retry-cloud-workspaces" type="button" hidden/);
  assert.match(html, /id="map-settings-dialog"/);
  for (const id of ["map-settings-title", "map-settings-origin", "map-settings-message", "map-settings-error", "map-settings-name", "map-settings-description", "map-settings-type", "save-map-settings", "map-settings-actions"]) {
    assert.ok(html.includes("id=\"" + id + "\""), "missing " + id);
  }
  assert.doesNotMatch(html, /id="online-library-dialog"|id="online-library-control"/);
  assert.ok(app.includes('settingsButton.dataset.mapSettings = ""'));
  assert.match(app, /settingsButton\.setAttribute\("aria-label", "Settings for " \+ \(name \|\| "Untitled map"\)\)/);
  assert.ok(app.includes("row.append(openButton, settingsButton)"));
  assert.ok(app.includes('if (libraryMode === "cloud") { renderCloudLibrary(); localMapTip.refresh(); return; }'));
  assert.ok(app.includes('list.setAttribute("aria-label", libraryMode === "cloud" ? "Cloud Workspace maps" : "Local Workspace maps")'));
  assert.ok(app.includes('byId("workspace-library-select").addEventListener("change", (event) => selectLibraryMode(event.currentTarget.value, { selectFirst: true }))'));
  assert.ok(app.includes('if (picker && picker.value !== libraryMode) picker.value = libraryMode'));
  assert.doesNotMatch(app, /storageHeading\.textContent\s*=/);
  assert.ok(app.includes('const visibility = onlineStatusVisibility({'));
  assert.ok(app.includes('const showCurrent = visibility.current || retryPending'));
  assert.ok(app.includes('if (current) current.hidden = !showCurrent'));
  assert.ok(app.includes('if (routeBanner) routeBanner.hidden = !visibility.banner'));
  assert.ok(app.includes('if (returnLocal) returnLocal.hidden = !visibility.returnLocal'));
  assert.ok(app.includes('setCloudLibraryState(message, state.status === "error", false)'));
  assert.doesNotMatch(app, /Local maps are hidden while this online link is open/);
  assert.ok(app.includes('byId("share-graph").addEventListener("click", () => runButtonAction(byId("share-graph"), "share", "Preparing…", openShareDialog))'));
  assert.ok(app.includes('openMapSettings({ origin: "cloud", id: state.workspaceId, ownerUid: state.userUid })'));
  assert.ok(app.includes('byId("online-current-status")'));
  assert.ok(app.includes('byId("retry-online-save")'));
  assert.ok(app.includes('onWorkspacePreview: handleOnlineWorkspacePreview'));
  const previewStart = app.indexOf("function handleOnlineWorkspacePreview(preview) {");
  const previewEnd = app.indexOf("function handleOnlineWorkspace(result)", previewStart);
  const previewFlow = app.slice(previewStart, previewEnd);
  assert.ok(previewStart >= 0 && previewEnd > previewStart);
  assert.ok(previewFlow.includes("cachedPreview: true"));
  assert.doesNotMatch(previewFlow, /persist\(|writeLibrary\(|persistOnlineOwnerDraft\(/);
  const cloudSettingsStart = app.indexOf("function openMapSettings(targetInput) {");
  const cloudSettingsEnd = app.indexOf("function readCloudSettingsTarget(target)", cloudSettingsStart);
  const openSettings = app.slice(cloudSettingsStart, cloudSettingsEnd);
  assert.ok(openSettings.includes("workspace: target.item || null"));
  assert.doesNotMatch(openSettings, /loadMapSettingsCloudTarget/);
  assert.ok(app.includes('await readCloudSettingsTarget(current)'));
  assert.ok(app.includes('onlineController.forgetOwnerPreview?.(current.id)'));
  assert.ok(app.includes('active.workspaceId === current.id && active.stalePreview'));
  assert.ok(app.includes('byId("new-project").hidden = libraryMode !== "local" || recoveryMode'));
  assert.match(app, /function createProject\(\)[\s\S]*if \(isOnlineSession\(\)\) \{\s*if \(!preserveDirtyOwnerDraftForNavigation\(\) \|\| !returnToLocalWorkspace\(\)\) return;/);
});

test("local-to-cloud move is explicit and keeps its retry candidate tied to the selected row", () => {
  assert.ok(app.includes('addMapSettingsAction("Move to Cloud Workspace"'));
  const start = app.indexOf("function confirmMoveLocalTarget(target) {");
  const end = app.indexOf("function cloudTargetActionAllowed", start);
  assert.ok(start >= 0 && end > start);
  const flow = app.slice(start, end);
  assert.ok(flow.includes("const currentGraphAtPrompt = JSON.stringify(project.graph)"));
  assert.ok(flow.includes("normalizeGraph(retryAttemptAtPrompt.graph, { allowEmpty: true })"));
  assert.ok(flow.includes("graphFingerprint: fingerprint"));
  assert.ok(flow.includes("graphSnapshot = normalizeGraph(reusable.graph, { allowEmpty: true })"));
  assert.ok(flow.includes("confirmSettingsAction(target"));
  assert.ok(flow.includes("if (!saveCloudAssociations())"));
  assert.ok(flow.includes("service.createWorkspace({"));
  assert.ok(flow.includes("workspaceId: candidateWorkspaceId"));
  assert.ok(flow.includes("expectedOwnerUid: user.uid"));
  assert.ok(flow.includes("mapSettingsController.isCurrent(target)"));
  assert.doesNotMatch(flow, /activeProject\(\)|onlineController\.saveOnline/);
  assert.ok(app.includes('addMapSettingsAction("Open Cloud Workspace"'));
  const linkedStart = app.indexOf('} else if (linkedId && !linkedId.startsWith("pending:")) {');
  const linkedFlow = app.slice(linkedStart, app.indexOf('} else {', linkedStart));
  assert.ok(linkedStart >= 0);
  assert.ok(linkedFlow.includes('checkLocalCloudReference(current.id, linkedId,'));
  assert.ok(linkedFlow.includes('() => mapSettingsController.isCurrent(current)'));
  assert.match(linkedFlow, /result.status === "present"[\s\S]*?openOwnedOnlineWorkspace\(result.workspace\)/);
  assert.doesNotMatch(linkedFlow, /openOwnedOnlineWorkspace\(\{ id: linkedId/);
  assert.ok(app.includes("const unresolvedCandidate = hasUnresolvedLocalCloudCandidate("));
  assert.ok(app.includes("manualMoveAttempts.isActive(target.id)"));
  assert.ok(app.includes("Open local map to retry save"));
  assert.ok(app.includes("if (!session.initialized)"));
  assert.ok(app.includes('if (accountState.status === "initializing" && authInitializingInvalidatesMapSettingsTarget(mapSettingsTarget)) mapSettingsController.invalidate();'));
  assert.ok(flow.includes('pendingLabel: "Checking…"'));
  assert.ok(flow.includes("() => confirmMoveLocalTarget(mapSettingsController.getCurrent())"));
});

test("all local map deletion routes recheck pending cloud candidates", () => {
  assert.ok(app.includes("if (localProjectHasUnresolvedCloudCandidate(project.id))"));
  assert.ok(app.includes("if (localProjectHasUnresolvedCloudCandidate(current.id))"));
  const start = app.indexOf("function confirmProjectDelete() {");
  const end = app.indexOf("function nodeCardElement", start);
  assert.ok(start >= 0 && end > start);
  const activeDelete = app.slice(start, end);
  assert.ok(activeDelete.includes("localProjectHasUnresolvedCloudCandidate(project.id)"));
  assert.ok(activeDelete.includes("localProjectHasUnresolvedCloudCandidate(context.projectId)"));
  assert.ok(app.includes("reusableManualMoveAttempt(previous, user.uid)"));
  assert.ok(app.includes("manualMoveAttempts.begin(current.id)"));
  assert.ok(app.includes("manualMoveAttempts.finish(current.id)"));
  assert.ok(app.includes("const reusable = reusableManualMoveAttempt(previous, user.uid)"));
  assert.ok(app.includes("commitManualMoveAssociation(cloudAssociations, current.id, saveCloudAssociations)"));
  assert.ok(app.includes("previous.ownerUid !== user.uid"));
  assert.ok(app.includes("reusableManualMoveAttempt(previousAtPrompt, currentAccountUid())"));
  assert.ok(app.includes("original version submitted to Cloud Workspace"));
  assert.ok(app.includes("newerLocalEdits"));
  assert.ok(app.includes("if (!reusable || reusable.workspaceId !== retryAttemptAtPrompt.workspaceId || reusable.idempotencyKey !== retryAttemptAtPrompt.idempotencyKey)"));
  assert.ok(app.includes("graphSnapshot = normalizeGraph(reusable.graph, { allowEmpty: true })"));
});
test("cloud row actions use the captured cloud map ID and owner UID", () => {
  assert.ok(app.includes("service.setShared({ workspaceId: current.id, enabled: Boolean(enabled) })"));
  assert.ok(app.includes("service.deleteWorkspace(current.id)"));
  assert.ok(app.includes("workspaceId: current.id,"));
  assert.ok(app.includes("expectedRevision: mapSettingsData?.workspace?.currentRevision"));
  assert.ok(app.includes("currentAccountUid() !== current.ownerUid"));
  assert.ok(app.includes("active.workspaceId === current.id && active.dirty"));
  assert.match(app, /function openOwnedOnlineWorkspace\(item\)[\s\S]*?String\(item\.ownerId \|\| ""\) !== uid/);
});

test("cloud library retry has read-only activation and does not persist online preference", () => {
  assert.ok(app.includes('action === "library"'));
  assert.ok(app.includes("Cloud Workspace maps."));
  assert.match(html, /id="cloud-workspace-state"/);
  assert.ok(app.includes("onlineController.retryLibrary()"));
  const start = cloudUi.indexOf("async browseLibrary() {");
  const end = cloudUi.indexOf("async disableOnline()", start);
  assert.ok(start >= 0 && end > start);
  const browse = cloudUi.slice(start, end);
  assert.ok(browse.includes("enabled = true"));
  assert.ok(browse.includes("subscribeLibrary()"));
  assert.doesNotMatch(browse, /writeOnlineEnabled/);
});

import { canonicalWorkspaceUrl, workspaceBaseUrl } from "./routing.js";
import { normalizeGraph, normalizeEditableGraph, assertGraphJsonWithinLimit, serializeGraphJson, MAX_IMPORT_BYTES, LIMITS, newEdgeId, newNodeId } from "./schema.js";
import { createRandomWorkspaceId } from "./cloud-model.js";
import { traceRoutes } from "./traces.js";
import { layoutGraph } from "./layout.js";
import { edgeGeometry, edgeRoutingLanes, graphBounds } from "./geometry.js";
import { SAMPLE_GRAPHS } from "./samples.js";
import { clearLibrary, createProjectId, readLibrary, writeLibrary } from "./storage.js";
import { buildSvg, copyPng, downloadBlob, downloadText, exportJson, safeFilename, svgToPngBlob } from "./exports.js";
import { buildAgentPrompt } from "./prompt.js";
import { chartCompactReadout, chartDescription, chartGeometry, chartPresentation, chartValueLabel, createChartFigure } from "./charts.js";
import { buildChartFromEditor, chartEditorMatchesChart, resolveNodeType, selectNodeTypeEditor } from "./node-editor.js";
import { renderTimeline } from "./timeline.js";
import { clearEdgeEntranceState, graphMotionAllowed, setEdgeTraceState } from "./edge-motion.js";
import { createShareUrl, decodeShareHash, findSharedProject, isLocalShareHost, shareKey, shouldClearShareFragmentForDeletedProject } from "./share.js";
import { addOrReuseExampleProject, clearLocalDataRoute, clearRejectedShareRoute, consumeFlowExampleQuery, createRevisionGate, createShareLoadTracker, fitScaleForBounds, isFlowExampleRoute, shareFailureContext, readImportSource, removeProjectSnapshot, shouldSaveOnEnter } from "./controller-utils.js";
import { INSPECTOR_DEFAULT_WIDTH, clampInspectorWidth, inspectorWidthLimits, isNamedLinkSnapshotCurrent, namedLinkPayload, readInspectorExpanded, readInspectorWidthPreference, writeInspectorExpanded, writeInspectorWidth, writeNamedLinkClipboard } from "./refinement-ui.js";
import { branchEdgeCandidate, canStartPointerGesture, connectionPreviewPath, nodeContextIsCurrent, screenToWorld } from "./refinement-graph.js";
import { isCurrentTouchEdgeSelection, isTouchClick, scrollTypeFiltersWithWheel, transitionTypeInteractions } from "./filter-interaction.js";
import { workspaceLoadingPresentation } from "./workspace-loading.js";
import { workspaceActionAvailability, workspaceReadSnapshotIsCurrent, isSharedViewer, isCurrentSaveRetry } from "./workspace-actions.js";
import { createCloudUiController, onlineViewIdFromSearch, resetOnlineLibraryForIdentityChange } from "./cloud-ui.js";
import { clearOnlineOwnerDraftIfMatches, readOnlineOwnerDraft, readOnlineOwnerDraftForOwnerEdit, writeOnlineOwnerDraft } from "./online-drafts.js";
import { getSharedAccountSession, hasAccountSessionHint } from "./account-session.js";
import { initAccountPanel, initSettingsPanel } from "./account-ui.js";
import { createMapAdmissionController } from "./map-admission.js";
import { verifyCloudAssociation } from "./cloud-reference-recovery.js";
import { initLocalMapTip } from "./local-map-tip.js";
import { createActionGate, startButtonProgress } from "./action-feedback.js";
import { createChoicePicker } from "./choice-picker.js";
import { createSidebarDrawer } from "./sidebar-drawer.js";
import { createEditHistory, editHistoryShortcut } from "./edit-history.js";
import { canImportArchitecture, createCloudImportController } from "./cloud-import.js";
import { admissionRequiresConfirmation, associationWorkspaceId, findPendingAdmissionAssociation, localProjectForWorkspaceAssociation, workspaceForLocalAssociation, writeOwnerAssociation } from "./cloud-associations.js";
import { authInitializingInvalidatesMapSettingsTarget, createCloudLibraryFirstSelection, createManualMoveAttemptTracker, createMapSettingsTargetController, commitManualMoveAssociation, hasUnresolvedLocalCloudCandidate, onlineStatusVisibility, resolveMapSettingsTarget, reusableManualMoveAttempt, reusableManualMoveCandidate, updateOnlineLibrarySnapshot } from "./sidebar-library.js";

const byId = (id) => document.getElementById(id);
const svgNS = "http://www.w3.org/2000/svg";
const FLOW_EXAMPLE_ID = "request-flow";
const FLOW_EXAMPLE_NAME = "Request flow demo";
const isFlowExample = (project) => project?.exampleId === FLOW_EXAMPLE_ID;
const stored = readLibrary(normalizeGraph);
let recoveryMode = !stored.writable;
let recoveryText = stored.rawBackup || "";
let projects = stored.projects ?? [];
let activeId = projects.some((project) => project.id === stored.activeId) ? stored.activeId : (projects[0]?.id || "");
let selectedNodeId = null;
let focusedType = "";
let lockedType = "";
let excludedTypes = new Set();
let filterPointerActivation = null;
let filterInputModality = "";
let touchInteractionActive = false;
let touchSelectedEdge = null;
let searchTerm = "";
let editingNodeId = null;
let editingEdgeId = null;
let nodeEditContext = null;
let edgeEditContext = null;
let branchEditContext = null;
let projectEditContext = null;
let selectedEdgeId = null;
let edgeMenuContext = null;
let canvasMenuContext = null;
let nodeMenuContext = null;
let menuReturnFocus = null;
const dialogFocusTargets = new Map();
let selectedFile = null;
let importDialogContext = null;
let confirmAction = null;
let dragState = null;
let motionPaused = false;
const shareLoadTracker = createShareLoadTracker();
let incomingShareFailure = null;
let confirmResumeShareLoad = null;
let projectEditResumeShareLoad = null;
let shareDialogSequence = 0;
let shareDialogProjectId = "";
let shareDialogProjectName = "";
let inspectorWidth = INSPECTOR_DEFAULT_WIDTH;
let inspectorPreferredWidth = INSPECTOR_DEFAULT_WIDTH;
let inspectorRestoreWidth = INSPECTOR_DEFAULT_WIDTH;
let inspectorExpanded = false;
let inspectorResizePointer = null;
const importReadGate = createRevisionGate();
const droppedFileGate = createRevisionGate();
let fitAnimationFrame = 0;
let fitAnimationSequence = 0;
let animateStructure = true;
let lastStorageError = "";
let transform = { x: 0, y: 0, scale: 1 };
let viewMode = "graph";
const CLOUD_ASSOCIATIONS_KEY = "atlas.online.associations.v1";
const onlineStorage = (() => { try { return window.localStorage; } catch { return null; } })();
const accountSession = getSharedAccountSession();
const cloudImportController = createCloudImportController({
  account: accountSession, storage: onlineStorage,
  createWorkspace: ({ service, graph, workspaceId, ownerUid }) => service.createWorkspace({
    name: graph.project.name, graph, workspaceId, expectedOwnerUid: ownerUid,
  }),
});
const readCloudAssociations = () => {
  try {
    const value = JSON.parse(onlineStorage?.getItem(CLOUD_ASSOCIATIONS_KEY) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
};
let cloudAssociations = readCloudAssociations();let onlineRoute = new URLSearchParams(location.search).has("view");
let onlineWorkspaceOpen = false;
let workspaceLoadingTarget = "";
let onlineGraphProject = null;
let onlineWorkspace = null;
let onlineState = { enabled: false, mode: "local", canEdit: false, canDelete: false, status: "local", routeUnavailable: false };
const onlineLibraryCache = { snapshot: null, status: "Sign in to load your online map library." };
let libraryMode = onlineRoute ? "cloud" : "local";
const librarySelect = byId("workspace-library-select");
const libraryPicker = createChoicePicker({ value: libraryMode, label: "Workspace library", classPrefix: "workspace-switcher",
  choices: [{ value: "local", label: "Local Workspace" }, { value: "cloud", label: "Cloud Workspace" }],
  onChange(value) { librarySelect.value = value; librarySelect.dispatchEvent(new Event("change", { bubbles: true })); }
});
librarySelect.before(libraryPicker.element); librarySelect.hidden = true;
let mapSettingsTarget = null;
let mapSettingsData = null;
let mapSettingsReadCancel = null;
let mapSettingsEditing = false;
let mapSettingsLocalGraphRef = null;
let mapSettingsLocalFingerprint = "";
let mapSettingsSaveSequence = 0;
let mapSettingsPending = null;
const actionGate = createActionGate();
const editHistory = createEditHistory();
let cloudLibraryRequest = 0;
const cloudLibraryFirstSelection = createCloudLibraryFirstSelection();
const currentAccountUid = () => {
  const state = accountSession.getState();
  return state.status === "ready" ? String(state.user?.uid || "") : "";
};
const manualMoveAttempts = createManualMoveAttemptTracker();
const mapSettingsController = createMapSettingsTargetController({
  getContext: () => ({
    projects,
    workspaces: onlineLibraryCache.snapshot || [],
    currentUid: currentAccountUid(),
  }),
  onChange: (target) => {
    mapSettingsTarget = target;
    if (!target) {
      mapSettingsReadCancel?.();
      mapSettingsReadCancel = null;
      mapSettingsData = null;
      mapSettingsEditing = false;
      mapSettingsLocalGraphRef = null;
      mapSettingsLocalFingerprint = "";
      if (byId("map-settings-dialog")?.open) byId("map-settings-dialog").close("cancel");
    } else if (byId("map-settings-dialog")?.open) renderMapSettings();
  },
});
let ownerDraftStorageWarningShown = false;
let onlineCurrentLink = "";
let onlineTargetWorkspaceId = "";
let onlinePendingUpload = null;
let onlineUiUnavailable = false;
let currentMapAdmissionContext = null;
const saveCloudAssociations = () => {
  try {
    if (!onlineStorage) return false;
    onlineStorage.setItem(CLOUD_ASSOCIATIONS_KEY, JSON.stringify(cloudAssociations));
    return true;
  } catch { return false; }
};
const activeProject = () => onlineRoute || onlineWorkspaceOpen
  ? onlineGraphProject
  : projects.find((project) => project.id === activeId) || null;
const projectById = (id) => onlineGraphProject?.id === id ? onlineGraphProject : projects.find((project) => project.id === id) || null;
const isOnlineSession = () => onlineRoute || onlineWorkspaceOpen;
const canMutateCurrent = () => !isOnlineSession() || onlineState.canEdit === true;
const currentWorkspaceActions = () => workspaceActionAvailability({
  hasProject: Boolean(activeProject()), online: isOnlineSession(), state: onlineState,
  graphWorkspaceId: onlineGraphProject?.onlineWorkspaceId || "", unavailable: onlineUiUnavailable, sharedView: onlineRoute,
});
const canImportCurrent = () => canImportArchitecture({
  destination: libraryMode, canEdit: canMutateCurrent(), ownerUid: currentAccountUid(),
  sharedViewer: isSharedViewer({ sharedView: onlineRoute, state: onlineState }),
});
const requireImport = () => {
  if (canImportCurrent()) return true;
  showToast(libraryMode === "cloud" && !currentAccountUid()
    ? "Sign in to import into Cloud Workspace."
    : "Open your own workspace to import a map.", "error");
  return false;
};
const requireMutation = (action = "change this map") => {
  if (canMutateCurrent()) return true;
  showToast("This online map is read-only. Only its signed-in owner can " + action + ".", "error");
  return false;
};
const effectiveAccountUid = () => String(onlineState.userUid || accountSession.getState()?.user?.uid || "");
const findPendingAdmission = (source, key) =>
  findPendingAdmissionAssociation(cloudAssociations, source, key, effectiveAccountUid());
const associationForWorkspace = (workspaceId) =>
  localProjectForWorkspaceAssociation(cloudAssociations, workspaceId, effectiveAccountUid());
const workspaceForLocalProject = (projectId) => {
  const record = cloudAssociations[projectId];
  const uid = effectiveAccountUid();
  const workspaceId = associationWorkspaceId(record);
  const result = workspaceForLocalAssociation(record, uid, onlineLibraryCache.snapshot);
  if (typeof record === "string" && workspaceId && uid && result === workspaceId) {
    cloudAssociations[projectId] = { workspaceId, ownerUid: uid, pending: false };
    saveCloudAssociations();
  }
  return result;
};
const localProjectHasUnresolvedCloudCandidate = (projectId) => {
  const associationValue = workspaceForLocalProject(projectId);
  return hasUnresolvedLocalCloudCandidate(
    cloudAssociations[projectId], associationValue, manualMoveAttempts.isActive(projectId),
  );
};
const writeWorkspaceAssociation = (projectId, workspaceId, ownerUid = effectiveAccountUid(), details = {}) => {
  if (!writeOwnerAssociation(cloudAssociations, projectId, workspaceId, ownerUid, details)) return;
  saveCloudAssociations();
};
const removeWorkspaceAssociation = (workspaceId, ownerUid = effectiveAccountUid()) => {
  mapAdmissionController.forget({ workspaceId, ownerUid });
  for (const [projectId, record] of Object.entries(cloudAssociations)) {
    if (associationWorkspaceId(record) === workspaceId) delete cloudAssociations[projectId];
  }
  saveCloudAssociations();
};const onlineController = createCloudUiController({
  storage: onlineStorage,
  loadService: () => accountSession.getService(),
  callbacks: {
    onState: handleOnlineState,
    onWorkspaceLoading: handleOnlineWorkspaceLoading,
    onWorkspacePreview: handleOnlineWorkspacePreview,
    onWorkspace: handleOnlineWorkspace,
    onWorkspaceStatus: handleOnlineWorkspaceStatus,
    onUnavailable: handleOnlineUnavailable,
    onWorkspaceCreated: handleOnlineWorkspaceCreated,
    onWorkspaceDeleted: handleOnlineWorkspaceDeleted,
    onWorkspaceClosed: handleOnlineWorkspaceClosed,
    onLibrary: handleOnlineLibrary,
    onSaveStatus: handleOnlineSaveStatus,
    onError: handleOnlineError,
    getCurrentGraph: () => onlineGraphProject?.graph || currentGraph(),
  },
});
const mapAdmissionController = createMapAdmissionController({
  account: accountSession,
  createWorkspace: createAdmittedWorkspace,
});
const localMapTip = initLocalMapTip({
  existingProjectIds: projects.map((project) => project.id),
  element: byId("local-map-tip"),
  messageElement: byId("local-map-tip-message"),
  okayButton: byId("local-map-tip-okay"),
  getAnchor: (projectId) => {
    if (libraryMode !== "local" || isOnlineSession() || activeProject()?.id !== projectId) return null;
    if (innerWidth <= 820 && !byId("sidebar").classList.contains("open")) return null;
    return [...byId("project-list").children].find((row) => row.dataset.workspaceOrigin === "local" && row.dataset.workspaceId === projectId) || null;
  },
});
const sidebarDrawer = createSidebarDrawer({
  sidebar: byId("sidebar"), main: byId("workspace-main"), trigger: byId("mobile-menu"),
  backdrop: byId("sidebar-backdrop"), closeButton: byId("sidebar-close"), onChange: () => localMapTip.refresh(),
});
const emptyGraph = () => ({ schemaVersion: 1, project: { name: "No project selected", description: "", type: "Software project" }, nodes: [], edges: [] });
const currentGraph = () => activeProject()?.graph || emptyGraph();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const truncate = (value, limit) => {
  const text = String(value || "");
  return text.length > limit ? text.slice(0, limit - 1) + "..." : text;
};
const nodeSearchText = (node) => [node.label, node.type, node.description, node.source, node.group, node.chart?.label, node.chart?.evidence, ...(node.chart?.categories || []), ...Object.values(node.details || {}).flat()].filter(Boolean).join(" ").toLowerCase();
const plain = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = String(text);
  return element;
};
const svgElement = (tag, attrs = {}) => {
  const element = document.createElementNS(svgNS, tag);
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, String(value));
  return element;
};
const UI_ICON_PARTS = {
  component: [
    ["rect", { x: 3.5, y: 4.5, width: 13, height: 11, rx: 2 }],
    ["path", { d: "M7 8h6M7 11h4" }],
  ],
  connection: [
    ["path", { d: "M7 10h6m-2.5-2.5L13 10l-2.5 2.5" }],
    ["circle", { cx: 4.5, cy: 10, r: 1.5 }],
    ["circle", { cx: 15.5, cy: 10, r: 1.5 }],
  ],
  trash: [["path", { d: "M4 6h12M8 6V4h4v2m-7 0 .8 10h8.4L15 6M8.5 9v4.5M11.5 9v4.5" }]],
};
const uiIcon = (name) => {
  const icon = svgElement("svg", { class: "ui-icon", viewBox: "0 0 20 20", "aria-hidden": "true", focusable: "false" });
  for (const [tag, attributes] of UI_ICON_PARTS[name] || []) icon.append(svgElement(tag, attributes));
  return icon;
};
function showToast(message, kind = "") {
  const region = byId("toast-region");
  const toast = plain("div", "toast" + (kind ? " " + kind : ""), message);
  region.replaceChildren(toast);
  if (typeof region.showPopover === "function") {
    if (region.matches(":popover-open")) region.hidePopover();
    region.showPopover();
  }
  setTimeout(() => {
    toast.remove();
    if (!region.childElementCount && typeof region.hidePopover === "function") region.hidePopover();
  }, 3600);
}
async function runButtonAction(button, key, label, operation) {
  const ticket = actionGate.begin(key);
  if (!ticket) return;
  const finish = startButtonProgress(button, label, { delayMs: key === "clipboard" ? 160 : 0 });
  try { return await operation(); }
  catch (error) { showToast(error?.message || "This action could not be completed. Try again.", "error"); }
  finally {
    finish();
    actionGate.finish(ticket);
    updateWorkspaceActionAvailability();
    if (button?.id === "retry-autosave") renderAutosaveAdmissionNotice();
  }
}
let onlineSaveRetryPending = null;
async function retryOnlineSaveWithFeedback(button, acceptConflict = false) {
  const state = onlineController.state();
  const record = { workspaceId: state.workspaceId, ownerUid: state.userUid, status: state.status };
  const key = "online-save-retry:" + record.workspaceId;
  if (actionGate.isBusy(key)) return;
  onlineSaveRetryPending = record;
  try {
    await runButtonAction(button, key, "Retrying…", async () => {
      try { await onlineController.retrySave({ acceptConflict }); }
      catch (error) { handleOnlineError(error); }
    });
  } finally {
    if (onlineSaveRetryPending === record) onlineSaveRetryPending = null;
    updateOnlineUi();
  }
}
function updateActionSaveStatus() {
  const admission = currentMapAdmissionContext;
  const creating = Boolean(admission?.pending && activeProject() === admission.project && !isOnlineSession());
  const state = onlineController.state();
  const saving = Boolean(isOnlineSession() && state.mode === "owner" && (state.status === "saving" || (state.status === "ready" && state.dirty)));
  const status = byId("save-status");
  const wasCreating = status.dataset.admissionPending === "true";
  status.dataset.admissionPending = String(creating);
  status.setAttribute("aria-busy", String(creating || saving));
  if (creating) status.textContent = "Creating Cloud Workspace…";
  else if (wasCreating && !isOnlineSession()) status.textContent = recoveryMode ? "Saved data needs attention" : "Saved locally";
  for (const row of byId("project-list").querySelectorAll('[data-workspace-origin="local"]')) {
    const pending = creating && row.dataset.workspaceId === admission.project.id;
    row.classList.toggle("is-workspace-loading", pending);
    row.setAttribute("aria-busy", String(pending));
  }
}
function inspectorWorkspaceWidth() {
  const workspace = document.querySelector(".graph-workspace");
  if (!workspace) return 0;
  const rect = workspace.getBoundingClientRect();
  const style = window.getComputedStyle(workspace);
  return rect.width - (Number.parseFloat(style.paddingLeft) || 0) - (Number.parseFloat(style.paddingRight) || 0);
}
function currentInspectorLimits() {
  return inspectorWidthLimits(inspectorWorkspaceWidth());
}
function applyInspectorWidth(value, { persist = false, expanded = false } = {}) {
  const workspace = document.querySelector(".graph-workspace");
  const limits = currentInspectorLimits();
  inspectorWidth = clampInspectorWidth(value, limits);
  inspectorExpanded = Boolean(expanded);
  if (workspace) workspace.style.setProperty("--inspector-width", inspectorWidth + "px");
  const separator = byId("inspector-resize");
  const expandButton = byId("expand-inspector");
  if (separator) {
    separator.setAttribute("aria-valuemin", String(limits.min));
    separator.setAttribute("aria-valuemax", String(limits.max));
    separator.setAttribute("aria-valuenow", String(inspectorWidth));
    separator.setAttribute("aria-valuetext", inspectorWidth + " pixels");
  }
  if (expandButton) {
    expandButton.setAttribute("aria-label", inspectorExpanded ? "Restore inspector width" : "Expand inspector");
    expandButton.title = inspectorExpanded ? "Restore inspector width" : "Expand inspector";
    expandButton.setAttribute("aria-expanded", String(inspectorExpanded));
    expandButton.disabled = !inspectorExpanded && limits.max <= inspectorWidth;
  }
  if (persist) {
    if (inspectorExpanded) {
      writeInspectorExpanded(() => window.localStorage, true);
    } else {
      writeInspectorWidth(() => window.localStorage, inspectorWidth, inspectorWorkspaceWidth());
      writeInspectorExpanded(() => window.localStorage, false);
      inspectorPreferredWidth = inspectorWidth;
    }
  }
  return inspectorWidth;
}

function bindInspectorResize() {
  const separator = byId("inspector-resize");
  if (!separator) return;
  inspectorPreferredWidth = readInspectorWidthPreference(() => window.localStorage);
  inspectorExpanded = readInspectorExpanded(() => window.localStorage);
  const initialLimits = currentInspectorLimits();
  inspectorRestoreWidth = clampInspectorWidth(inspectorPreferredWidth, initialLimits);
  inspectorWidth = inspectorExpanded ? initialLimits.max : inspectorRestoreWidth;
  applyInspectorWidth(inspectorWidth, { expanded: inspectorExpanded });
  separator.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    inspectorResizePointer = { id: event.pointerId, start: inspectorWidth, startX: event.clientX, expanded: inspectorExpanded };
    try { separator.setPointerCapture(event.pointerId); } catch {}
  });
  separator.addEventListener("pointermove", (event) => {
    if (!inspectorResizePointer || inspectorResizePointer.id !== event.pointerId) return;
    applyInspectorWidth(inspectorResizePointer.start + inspectorResizePointer.startX - event.clientX, { expanded: false });
  });
  const finishResize = (event, commit) => {
    if (!inspectorResizePointer || inspectorResizePointer.id !== event.pointerId) return;
    const initialWidth = inspectorResizePointer.start;
    const wasExpanded = inspectorResizePointer.expanded;
    inspectorResizePointer = null;
    if (commit) {
      applyInspectorWidth(inspectorWidth, { persist: true, expanded: false });
      fitGraph(false);
    } else {
      applyInspectorWidth(initialWidth, { expanded: wasExpanded });
    }
  };
  separator.addEventListener("pointerup", (event) => finishResize(event, true));
  separator.addEventListener("pointercancel", (event) => finishResize(event, false));
  separator.addEventListener("lostpointercapture", (event) => finishResize(event, false));
  separator.addEventListener("keydown", (event) => {
    const limits = currentInspectorLimits();
    let next = inspectorWidth;
    if (event.key === "ArrowLeft") next += 24;
    else if (event.key === "ArrowRight") next -= 24;
    else if (event.key === "Home") next = limits.min;
    else if (event.key === "End") next = limits.max;
    else return;
    event.preventDefault();
    applyInspectorWidth(next, { persist: true, expanded: false });
    fitGraph(false);
  });
  byId("expand-inspector").addEventListener("click", () => {
    const limits = currentInspectorLimits();
    if (inspectorExpanded) {
      applyInspectorWidth(inspectorRestoreWidth, { persist: true });
    } else {
      inspectorRestoreWidth = inspectorWidth;
      applyInspectorWidth(limits.max, { persist: true, expanded: true });
    }
    fitGraph(false);
  });
  window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      const limits = currentInspectorLimits();
      const preferredWidth = inspectorExpanded ? limits.max : inspectorPreferredWidth;
      applyInspectorWidth(preferredWidth, { expanded: inspectorExpanded });
      fitGraph(false);
    });
  }, { passive: true });
}
function handleOnlineState(state) {
  const previousHistoryScope = editHistoryScope();
  const previousWorkspaceId = onlineState.workspaceId || "";
  const previousUid = onlineState.userUid || "";
  const libraryIdentityChanged = resetOnlineLibraryForIdentityChange(onlineLibraryCache, previousUid, state.userUid);
  const previousCanEdit = onlineState.canEdit;
  const previousMode = onlineState.mode;
  const lostEditAuthority = previousCanEdit && !state.canEdit;
  const modeChanged = previousCanEdit !== state.canEdit || previousMode !== state.mode;
  onlineState = state;
  if (libraryIdentityChanged) editHistory.clear("cloud:");
  else if (lostEditAuthority && state.workspaceId === previousWorkspaceId && !state.stalePreview && state.status !== "loading") {
    editHistory.forget(previousHistoryScope);
  }
  if (libraryIdentityChanged) { mapSettingsController.invalidate(); renderLibrary(); }
  if (state.workspace) onlineWorkspace = state.workspace;
  const lostPrivateWorkspaceAuthority = Boolean(onlineWorkspaceOpen && state.workspace && !state.workspace.shared && state.ownerUid && state.userUid !== state.ownerUid);
  if (lostPrivateWorkspaceAuthority) handleOnlineUnavailable({ status: "permission-denied", message: "This private online map is only available to its owner." });
  const closedOwnerContext = onlineWorkspaceOpen && !onlineRoute && !state.inOnlineRoute && ["signed-out", "disabled"].includes(state.status);
  if (state.inOnlineRoute) onlineWorkspaceOpen = true;
  if (closedOwnerContext) { onlineWorkspaceOpen = false; onlineWorkspace = null; onlineGraphProject = null; onlineCurrentLink = ""; }
  if (lostEditAuthority) {
    cancelActiveGesture();
    for (const id of ["editor-modal", "edge-modal", "branch-modal", "project-modal"]) {
      if (byId(id)?.open) byId(id).close();
    }
    confirmAction = null;
    if (byId("confirm-modal")?.open) byId("confirm-modal").close();
  }
  updateOnlineUi();
  updateWorkspaceActionAvailability();
  if (closedOwnerContext) renderAll();
  else if (modeChanged) { renderInspector(); localRecoveryMode(); }
  if (byId("map-settings-dialog")?.open) renderMapSettings();
}
function handleOnlineWorkspaceLoading(event) {
  workspaceLoadingTarget = String(event.workspaceId || "");
  onlineWorkspaceOpen = true;
  onlineUiUnavailable = false;
  onlineWorkspace = (onlineLibraryCache.snapshot || []).find(item => item.id === event.workspaceId && item.ownerId === currentAccountUid()) || null;
  onlineGraphProject = null;
  onlineCurrentLink = "";
  onlineTargetWorkspaceId = event.workspaceId || "";
  selectedNodeId = null;
  selectedEdgeId = null;
  onlineRoute = onlineRoute || Boolean(event.shared);
  byId("online-route-title").textContent = "Opening online workspace";
  byId("online-route-message").textContent = "Loading the shared map. Your local maps remain separate.";
  renderAll();
}
function handleOnlineWorkspacePreview(preview) {
  const workspace = preview?.workspace;
  if (!preview?.stale || !workspace?.id || currentAccountUid() !== String(workspace.ownerId || workspace.ownerUid || "")) return;
  onlineWorkspaceOpen = true;
  onlineUiUnavailable = false;
  onlineWorkspace = { ...workspace };
  onlineTargetWorkspaceId = workspace.id;
  onlineCurrentLink = "";
  const associationId = preview.localProjectId || associationForWorkspace(workspace.id);
  onlineGraphProject = {
    id: "online-" + workspace.id,
    graph: normalizeGraph(preview.graph, { allowEmpty: true }),
    updatedAt: Date.now(),
    onlineWorkspaceId: workspace.id,
    localProjectId: associationId,
    cachedPreview: true,
  };
  onlineRoute = false;
  selectedNodeId = null;
  selectedEdgeId = null;
  excludedTypes.clear();
  searchTerm = "";
  byId("search").value = "";
  renderAll();
  fitGraph(false);
}
function handleOnlineWorkspace(result) {
  const workspace = result.workspace;
  if (!workspace?.id || !result.graph) return;
  workspaceLoadingTarget = "";
  onlineWorkspaceOpen = true;
  onlineUiUnavailable = false;
  onlineWorkspace = { ...workspace };
  onlineTargetWorkspaceId = workspace.id;
  onlineCurrentLink = workspace.shared ? new URL("./workspace?view=" + encodeURIComponent(workspace.id), location.href).href : "";
  const associationId = result.localProjectId || associationForWorkspace(workspace.id);
  if (associationId && projects.some((project) => project.id === associationId)) writeWorkspaceAssociation(associationId, workspace.id, workspace.ownerId || onlineState.ownerUid || effectiveAccountUid());
  const sameProject = onlineGraphProject?.id === "online-" + workspace.id;
  const graph = result.apply === false && sameProject ? onlineGraphProject.graph : normalizeGraph(result.graph, { allowEmpty: true });
  const firstLoad = !sameProject;
  onlineGraphProject = { id: "online-" + workspace.id, graph, updatedAt: Date.now(), onlineWorkspaceId: workspace.id, localProjectId: associationId };
  if (result.apply !== false) editHistory.sync(editHistoryScope(), graph);
  onlineRoute = onlineRoute || (onlineController.state().inOnlineRoute && Boolean(onlineController.state().sharedId));
  onlineWorkspaceOpen = true;
  if (firstLoad) {
    selectedNodeId = null;
    selectedEdgeId = null;
    excludedTypes.clear();
    searchTerm = "";
    byId("search").value = "";
    viewMode = isFlowExample(onlineGraphProject) ? "timeline" : "graph";
  }
  byId("online-route-title").textContent = result.mode === "owner" ? "Owner workspace" : "Read-only online view";
  byId("online-route-message").textContent = result.mode === "owner"
    ? "This map is open in owner mode. Changes save online after a short delay."
    : "You can inspect, search, filter, pan, and zoom. Editing and exports are disabled.";
  renderAll();
  if (firstLoad) fitGraph(false);
}
function handleOnlineWorkspaceStatus(event) {
  const message = event?.message || (event?.status === "offline" ? "Connection lost. Showing the last received version; updates are unavailable." : "Online workspace status changed.");
  byId("online-route-message").textContent = message;
  const currentStatus = byId("online-current-status");
  if (currentStatus) currentStatus.textContent = message;
  byId("save-status").textContent = event?.status === "offline" ? "Online view offline" : message;
}
function handleOnlineUnavailable(event) {
  editHistory.forget(editHistoryScope());
  workspaceLoadingTarget = "";
  onlineWorkspaceOpen = true;
  onlineUiUnavailable = true;
  onlineWorkspace = null;
  onlineGraphProject = null;
  onlineCurrentLink = "";
  byId("online-route-title").textContent = "Online workspace unavailable";
  byId("online-route-message").textContent = event?.message || "This online workspace could not be opened.";
  selectedNodeId = null;
  selectedEdgeId = null;
  renderAll();
  byId("save-status").textContent = "Online map unavailable";
}
function handleOnlineWorkspaceCreated(event) {
  workspaceLoadingTarget = "";
  onlineUiUnavailable = false;
  const workspace = event.workspace;
  const localProjectId = String(event.localProjectId || "");
  onlineWorkspaceOpen = true;
  onlineWorkspace = { ...workspace };
  onlineTargetWorkspaceId = workspace.id;
  onlineRoute = false;
  onlineGraphProject = {
    id: "online-" + workspace.id,
    graph: event.graph ? normalizeGraph(event.graph, { allowEmpty: true }) : emptyGraph(),
    updatedAt: Date.now(),
    onlineWorkspaceId: workspace.id,
    localProjectId,
  };
  writeWorkspaceAssociation(localProjectId, workspace.id, workspace.ownerId || onlineState.userUid || effectiveAccountUid());
  onlinePendingUpload = null;
  byId("online-route-title").textContent = "Your online workspace";
  byId("online-route-message").textContent = "Owner edits save online after a short delay. Viewers with an active link can read the live map.";
  renderAll();
  fitGraph(true);
}
function createAdmittedWorkspace({ graph, service, projectId, candidateWorkspaceId, idempotencyKey, ownerUid }) {
  return Promise.resolve().then(async () => {
    let created = await service.createWorkspace({
      name: graph.project?.name,
      graph,
      workspaceId: candidateWorkspaceId,
      idempotencyKey,
      expectedOwnerUid: ownerUid,
    });
    let resultGraph = graph;
    let postCreateError = null;
    const project = projects.find((item) => item.id === projectId);
    const latestGraph = project?.graph ? JSON.parse(JSON.stringify(project.graph)) : graph;
    if (JSON.stringify(latestGraph) !== JSON.stringify(graph)) {
      if (accountSession.getState()?.user?.uid === ownerUid && created?.id) {
        try {
          const saved = await service.saveWorkspace({
            workspaceId: created.id,
            graph: latestGraph,
            expectedRevision: created.currentRevision ?? created.revision,
          });
          created = { ...created, ...saved };
          resultGraph = latestGraph;
        } catch (error) {
          postCreateError = error;
          writeOnlineOwnerDraft(onlineStorage, {
            ownerUid,
            workspaceId: created.id,
            graph: latestGraph,
            updatedAt: Date.now(),
          });
        }
      } else {
        postCreateError = new Error("The account changed while the initial map was saving.");
        if (created?.id) {
          writeOnlineOwnerDraft(onlineStorage, {
            ownerUid,
            workspaceId: created.id,
            graph: latestGraph,
            updatedAt: Date.now(),
          });
        }
      }
    }
    return { workspace: created, graph: resultGraph, postCreateError };
  });
}
function autosaveNotice(message, { showRetry = false, retryLabel = "Retry save", localTip = false } = {}) {
  const notice = byId("autosave-notice");
  const text = byId("autosave-notice-message");
  const retry = byId("retry-autosave");
  if (!notice || !text || !retry) return;
  text.textContent = String(message || "");
  notice.hidden = !message || localTip;
  if (message && localTip) localMapTip.show(currentMapAdmissionContext?.project.id, message);
  else localMapTip.hide();
  retry.hidden = !showRetry;
  retry.textContent = retryLabel;
}
function renderAutosaveAdmissionNotice() {
  updateActionSaveStatus();
  const context = currentMapAdmissionContext;
  if (!context || activeProject() !== context.project || isOnlineSession()) {
    autosaveNotice("");
    return;
  }
  if (context.pending) {
    const notice = byId("autosave-notice");
    if (!notice.hidden) { notice.setAttribute("aria-busy", "true"); byId("retry-autosave").disabled = true; }
    return;
  }
  byId("autosave-notice").setAttribute("aria-busy", "false");
  byId("retry-autosave").disabled = false;
  const result = context.result;
  if (!result) { autosaveNotice(""); return; }
  const signedIn = Boolean(accountSession.getState()?.user?.uid);
  if (result.status === "needs-sign-in") {
    autosaveNotice("This map is saved locally. Sign in, then choose Save this map online to upload it.", {
      showRetry: true, retryLabel: signedIn ? "Save this map online" : "Sign in to save",
    });
  } else if (result.status === "needs-confirmation") {
    const preferenceEnabled = accountSession.getPreferenceState()?.saveFutureMaps === true;
    if (!preferenceEnabled) {
      autosaveNotice("This workspace is saved locally in this browser. You can move it to Cloud Workspace from its settings.", { localTip: true });
    } else {
      autosaveNotice("This map is saved locally. Save it online now to confirm this upload.", {
        showRetry: true, retryLabel: "Save this map online",
      });
    }
  } else if (result.status === "failed") {
    autosaveNotice("This map is saved locally, but the account copy could not be completed. " + (result.error?.message || "Retry when you are ready."), {
      showRetry: true, retryLabel: "Retry save",
    });
  } else if (result.status === "saved" && result.accountChanged) {
    autosaveNotice("The map was saved to the account that started this upload. Sign in to that account to open it; this local copy remains here.");
  } else if (result.status === "saved" && result.postCreateError) {
    autosaveNotice("The account copy was created. Edits made while it was saving are kept in this browser and need recovery.", {
      showRetry: true, retryLabel: "Open and recover edits",
    });
  } else if (result.status === "local" && result.reason === "association-storage-unavailable") {
    autosaveNotice("This map stays in this browser. Atlas could not save a safe retry record, so it was not uploaded.");
  } else if (result.status === "local") {
    autosaveNotice("This workspace is saved locally in this browser. You can move it to Cloud Workspace from its settings.", { localTip: true });
  } else {
    autosaveNotice("");
  }
}
function makeAdmissionRouteContext(project) {
  const pathname = location.pathname;
  const search = location.search;
  const hash = location.hash;
  return {
    project,
    url: pathname + search + hash,
    isCurrent: () => projects.includes(project)
      && activeProject() === project
      && !isOnlineSession()
      && location.pathname + location.search + location.hash === pathname + search + hash,
  };
}
async function admitMapProject(source, project, key = project?.id) {
  if (!project || !["new", "import", "fragment"].includes(source)) return null;
  const admissionKey = String(key || project.id);
  const route = makeAdmissionRouteContext(project);
  let preference;
  try { preference = accountSession.getPreferenceState(); } catch { preference = null; }
  const localRecord = cloudAssociations[project.id];
  const matchingRecord = localRecord?.pending === true && localRecord.source === source && String(localRecord.key || "") === admissionKey
    ? localRecord
    : findPendingAdmission(source, admissionKey);
  const currentUid = effectiveAccountUid();
  const candidateWorkspaceId = matchingRecord?.workspaceId || createRandomWorkspaceId();
  if (!candidateWorkspaceId) {
    const failed = { status: "failed", reason: "candidate-id-error", error: new Error("Atlas could not create a secure online workspace ID.") };
    const context = { source, key: admissionKey, project, result: failed, ...route };
    currentMapAdmissionContext = context;
    renderAutosaveAdmissionNotice();
    return failed;
  }
  const expectedOwnerUid = String(matchingRecord?.ownerUid || "");
  const idempotencyKey = String(matchingRecord?.idempotencyKey || source + ":" + admissionKey);
  const pendingOwnerChanged = Boolean(matchingRecord?.ownerUid && currentUid && matchingRecord.ownerUid !== currentUid);
  if (admissionRequiresConfirmation(matchingRecord, currentUid)) {
    const context = {
      source, key: admissionKey, project, candidateWorkspaceId, expectedOwnerUid,
      idempotencyKey, ...route,
      result: { status: "needs-confirmation", reason: pendingOwnerChanged ? "pending-admission-owner-changed" : matchingRecord.admissionStatus || "prior-local-admission" },
    };
    currentMapAdmissionContext = context;
    renderAutosaveAdmissionNotice();
    return context.result;
  }
  if (!preference?.saveFutureMaps || recoveryMode) {
    if (source === "fragment" && !recoveryMode) {
      cloudAssociations[project.id] = {
        ...(matchingRecord || {}),
        workspaceId: candidateWorkspaceId,
        ownerUid: currentUid,
        pending: true,
        committed: false,
        source,
        key: admissionKey,
        idempotencyKey,
        admissionStatus: "local",
        confirmationRequired: true,
        startedAt: matchingRecord?.startedAt || Date.now(),
      };
      saveCloudAssociations();
    }
    const localResult = { status: "local", reason: preference?.saveFutureMaps ? "local-storage-unavailable" : "preference-off" };
    const context = {
      source, key: admissionKey, project, candidateWorkspaceId, expectedOwnerUid,
      idempotencyKey, result: localResult, ...route,
    };
    currentMapAdmissionContext = context;
    renderAutosaveAdmissionNotice();
    return localResult;
  }
  let associationPersisted = true;
  if (!matchingRecord || matchingRecord.pending !== true) {
    cloudAssociations[project.id] = {
      ...(matchingRecord || {}),
      workspaceId: candidateWorkspaceId,
      ownerUid: currentUid,
      pending: true,
      committed: false,
      source,
      key: admissionKey,
      idempotencyKey,
      confirmationRequired: false,
      admissionStatus: "starting",
      startedAt: matchingRecord?.startedAt || Date.now(),
    };
    associationPersisted = saveCloudAssociations();
  }
  const context = {
    source,
    key: admissionKey,
    project,
    candidateWorkspaceId,
    expectedOwnerUid,
    idempotencyKey,
    ...route,
    result: null,
  };
  currentMapAdmissionContext = context;
  if (!associationPersisted) {
    context.result = { status: "local", reason: "association-storage-unavailable" };
    renderAutosaveAdmissionNotice();
    return context.result;
  }
  if (pendingOwnerChanged) {
    context.result = { status: "needs-confirmation", reason: "pending-admission-owner-changed" };
    renderAutosaveAdmissionNotice();
    return context.result;
  }
  renderAutosaveAdmissionNotice();
  const admission = {
    source,
    key: admissionKey,
    projectId: project.id,
    graph: project.graph,
    getGraph: () => project.graph,
    isCurrent: route.isCurrent,
    candidateWorkspaceId,
    idempotencyKey,
    expectedOwnerUid,
    prepareCreate: ({ ownerUid, graph: admittedGraph }) => {
      cloudAssociations[project.id] = {
        workspaceId: candidateWorkspaceId,
        ownerUid,
        pending: true,
        committed: false,
        source,
        key: admissionKey,
        idempotencyKey,
        startedAt: matchingRecord?.startedAt || Date.now(),
        graphFingerprint: JSON.stringify(admittedGraph),
      };
      if (!saveCloudAssociations()) throw new Error("Atlas could not save a safe retry record. The map remains local and was not uploaded.");
    },
  };
  context.pending = true;
  renderAutosaveAdmissionNotice();
  try {
    const result = await mapAdmissionController.admit(admission);
    context.result = result;
    await handleMapAdmissionResult(context, result);
    return result;
  } catch (error) {
    context.result = { status: "failed", error };
    renderAutosaveAdmissionNotice();
    return context.result;
  } finally {
    context.pending = false;
    renderAutosaveAdmissionNotice();
  }
}
function restorePendingAdmissionContext(source, key, project, record) {
  if (!project || !record?.pending || !record.workspaceId) return null;
  const route = makeAdmissionRouteContext(project);
  const context = {
    source,
    key: String(key || record.key || project.id),
    project,
    candidateWorkspaceId: String(record.workspaceId),
    expectedOwnerUid: String(record.ownerUid || ""),
    idempotencyKey: String(record.idempotencyKey || source + ":" + String(key || record.key || project.id)),
    ...route,
    result: record.confirmationRequired === true
      ? { status: "needs-confirmation", reason: record.admissionStatus || "prior-local-admission" }
      : { status: "failed", reason: "pending-reload", error: new Error("The previous account save did not finish. Retry to reconcile it.") },
  };
  currentMapAdmissionContext = context;
  renderAutosaveAdmissionNotice();
  return context;
}
async function handleMapAdmissionResult(context, result) {
  if (!context || !result) return;
  context.result = result;
  const project = projects.find((item) => item.id === context.project.id);
  const existing = project ? cloudAssociations[project.id] : null;
  if (project && existing?.pending === true && result.status !== "saved") {
    cloudAssociations[project.id] = {
      ...existing,
      admissionStatus: String(result.status || "failed"),
      confirmationRequired: ["local", "needs-sign-in", "needs-confirmation"].includes(result.status)
        || existing.confirmationRequired === true,
    };
    saveCloudAssociations();
  }
  if (result.status === "local") {
    renderAutosaveAdmissionNotice();
    return;
  }
  if (result.status !== "saved" || !result.workspace?.id) {
    renderAutosaveAdmissionNotice();
    return;
  }
  const workspace = result.workspace;
  const ownerUid = String(result.ownerUid || workspace.ownerId || "");
  if (project) {
    writeWorkspaceAssociation(project.id, workspace.id, ownerUid, {
      pending: true,
      committed: true,
      source: context.source,
      key: context.key,
      graphFingerprint: JSON.stringify(result.graph || context.project.graph),
      idempotencyKey: context.idempotencyKey || context.source + ":" + context.key,
      postCreateError: result.postCreateError ? String(result.postCreateError.message || "save failed") : "",
    });
  }
  const canReplace = Boolean(project && context.isCurrent?.()
    && accountSession.getState()?.user?.uid === ownerUid && !result.accountChanged);
  if (!canReplace) {
    renderAutosaveAdmissionNotice();
    return;
  }
  try {
    const next = new URL(location.href);
    next.searchParams.set("view", workspace.id);
    next.hash = "";
    history.replaceState(history.state, "", next.pathname + next.search);
  } catch {
    renderAutosaveAdmissionNotice();
    return;
  }
  if (project) {
    writeWorkspaceAssociation(project.id, workspace.id, ownerUid, {
      pending: false,
      committed: true,
      source: context.source,
      key: context.key,
      graphFingerprint: JSON.stringify(result.graph || project.graph),
      idempotencyKey: context.idempotencyKey || context.source + ":" + context.key,
      postCreateError: result.postCreateError ? String(result.postCreateError.message || "save failed") : "",
    });
  }
  onlineRoute = false;
  try {
    await onlineController.enableOnline();
    onlineController.syncAccountUser?.(accountSession.getState()?.user);
    await onlineController.openOwnedWorkspace(workspace.id, { localProjectId: project?.id || "" });
    if (result.postCreateError) setTimeout(offerOnlineOwnerDraftRecovery, 0);
    libraryMode = "cloud";
    renderLibrary();
  } catch (error) {
    handleOnlineError(error, "open");
    return;
  }
  currentMapAdmissionContext = null;
  renderAutosaveAdmissionNotice();
  showToast(result.postCreateError
    ? "The account map was created. Edits made while it was saving were kept locally for recovery."
    : "Saved this map to your account. It stays private until you choose Share live link.");
}
async function retryAutosaveAdmission() {
  const context = currentMapAdmissionContext;
  if (!context || context.pending) return;
  if (context.result?.status === "saved" && context.result.postCreateError) {
    const workspaceId = context.result.workspace?.id;
    if (workspaceId && accountSession.getState()?.user?.uid === context.result.ownerUid) {
      try {
        await onlineController.openOwnedWorkspace(workspaceId, { localProjectId: context.project.id });
        offerOnlineOwnerDraftRecovery();
      } catch (error) { handleOnlineError(error, "open"); }
    } else {
      byId("account-control")?.click();
    }
    return;
  }
  const uid = String(accountSession.getState()?.user?.uid || "");
  if (!uid) {
    byId("account-control")?.click();
    return;
  }
  if (context.expectedOwnerUid && context.expectedOwnerUid !== uid) {
    // A different account cannot take over a candidate that may already belong
    // to the previous owner. This explicit retry creates a separately scoped intent.
    context.candidateWorkspaceId = createRandomWorkspaceId();
    context.expectedOwnerUid = uid;
    context.idempotencyKey = context.source + ":" + context.key + ":" + uid;
  } else if (!context.expectedOwnerUid) {
    context.expectedOwnerUid = uid;
  }
  if (!context.candidateWorkspaceId) {
    context.result = { status: "failed", reason: "candidate-id-error", error: new Error("Atlas could not create a secure online workspace ID.") };
    renderAutosaveAdmissionNotice();
    return;
  }
  cloudAssociations[context.project.id] = {
    workspaceId: context.candidateWorkspaceId,
    ownerUid: uid,
    pending: true,
    committed: false,
    source: context.source,
    key: context.key,
    idempotencyKey: context.idempotencyKey || context.source + ":" + context.key,
    startedAt: cloudAssociations[context.project.id]?.startedAt || Date.now(),
    graphFingerprint: JSON.stringify(context.project.graph),
  };
  if (!saveCloudAssociations()) {
    context.result = { status: "failed", reason: "association-storage-unavailable", error: new Error("Atlas could not save a safe retry record. The map remains local and was not uploaded.") };
    renderAutosaveAdmissionNotice();
    return;
  }
  const args = {
    source: context.source,
    key: context.key,
    projectId: context.project.id,
    graph: context.project.graph,
    getGraph: () => context.project.graph,
    isCurrent: context.isCurrent,
    candidateWorkspaceId: context.candidateWorkspaceId,
    idempotencyKey: context.idempotencyKey || context.source + ":" + context.key,
    expectedOwnerUid: context.expectedOwnerUid,
    prepareCreate: ({ ownerUid, graph }) => {
      cloudAssociations[context.project.id] = {
        workspaceId: context.candidateWorkspaceId,
        ownerUid,
        pending: true,
        committed: false,
        source: context.source,
        key: context.key,
        idempotencyKey: context.idempotencyKey || context.source + ":" + context.key,
        startedAt: cloudAssociations[context.project.id]?.startedAt || Date.now(),
        graphFingerprint: JSON.stringify(graph),
      };
      if (!saveCloudAssociations()) throw new Error("Atlas could not save a safe retry record. The map remains local and was not uploaded.");
    },
  };
  context.pending = true;
  renderAutosaveAdmissionNotice();
  try {
    const first = await mapAdmissionController.retry(args);
    const result = first.status === "missing" ? await mapAdmissionController.admit(args) : first;
    await handleMapAdmissionResult(context, result);
  } catch (error) {
    context.result = { status: "failed", error };
  } finally {
    context.pending = false;
    renderAutosaveAdmissionNotice();
  }
}
function handleOnlineWorkspaceDeleted(event) {
  editHistory.forget(editHistoryScope());
  workspaceLoadingTarget = "";
  onlineUiUnavailable = false;
  removeWorkspaceAssociation(event.id);
  onlineWorkspaceOpen = false;
  onlineWorkspace = null;
  onlineGraphProject = null;
  onlineCurrentLink = "";
  onlineTargetWorkspaceId = "";
  onlineRoute = false;
  byId("online-route-title").textContent = "Online workspace deleted";
  byId("online-route-message").textContent = "The online map and its viewing link have been removed.";
  renderAll();
}
function handleOnlineWorkspaceClosed() {
  workspaceLoadingTarget = "";
  onlineUiUnavailable = false;
  onlineWorkspaceOpen = false;
  onlineWorkspace = null;
  onlineGraphProject = null;
  onlineCurrentLink = "";
  onlinePendingUpload = null;
  renderAll();
}
function handleOnlineLibrary(result) {
  const errorCode = String(result?.error?.code || result?.error?.status || result?.status || "");
  if (["error", "permission-denied"].includes(result?.status)) logOnlineFailure("owner library listener", result?.error || { code: errorCode, status: result?.status });
  const libraryError = result?.error || { code: errorCode, status: result?.status };
  onlineLibraryCache.status = result?.status === "ready" ? ""
    : result?.status === "loading" ? "Loading your online maps."
      : result?.status === "unauthenticated" ? "Sign in to see your online maps."
        : result?.status === "offline" ? "Offline. Showing the last available online map list."
          : onlineErrorMessage(libraryError, "library");
  updateOnlineLibrarySnapshot(onlineLibraryCache, result);
  renderLibrary();
  if (result?.status === "ready") selectFirstCloudWorkspace();
}
function currentOwnerOnlineDraft() {
  const state = onlineController.state();
  if (!state.canEdit || !state.userUid || state.userUid !== state.ownerUid || !state.workspaceId
      || onlineGraphProject?.onlineWorkspaceId !== state.workspaceId) return null;
  return readOnlineOwnerDraft(onlineStorage, state.userUid, state.workspaceId);
}
function persistOnlineOwnerDraft() {
  const state = onlineController.state();
  if (!state.canEdit || !state.userUid || state.userUid !== state.ownerUid || !state.workspaceId
      || onlineGraphProject?.onlineWorkspaceId !== state.workspaceId) return false;
  const saved = writeOnlineOwnerDraft(onlineStorage, {
    ownerUid: state.userUid,
    workspaceId: state.workspaceId,
    graph: onlineGraphProject.graph,
    updatedAt: Date.now(),
  });
  if (!saved && !ownerDraftStorageWarningShown) {
    ownerDraftStorageWarningShown = true;
    showToast("This browser could not keep a local recovery draft. The online save will still be attempted; export a JSON backup if needed.", "error");
  } else if (saved) ownerDraftStorageWarningShown = false;
  return saved;
}
function preserveDirtyOwnerDraftForNavigation() {
  const state = onlineController.state();
  if (!state.canEdit || !state.dirty || !state.workspaceId) return true;
  const saved = persistOnlineOwnerDraft();
  const draft = currentOwnerOnlineDraft();
  if (!saved && !draft) {
    showToast("Atlas could not keep a recovery draft for pending owner edits. Save or export the map before leaving it.", "error");
    return false;
  }
  showToast("Pending owner edits are kept in a local recovery draft while you switch maps.");
  return true;
}
function offerOnlineOwnerDraftRecovery() {
  const state = onlineController.state();
  const draft = readOnlineOwnerDraftForOwnerEdit(onlineStorage, {
    mode: state.mode, userUid: state.userUid, ownerUid: state.ownerUid, workspaceId: state.workspaceId,
  });
  if (!draft || !onlineGraphProject || onlineGraphProject.onlineWorkspaceId !== state.workspaceId) return;
  let recoveredGraph;
  try { recoveredGraph = normalizeGraph(draft.graph, { allowEmpty: true }); }
  catch { showToast("The local recovery draft could not be read. It remains stored in this browser.", "error"); return; }
  const baseFingerprint = JSON.stringify(onlineGraphProject.graph);
  if (JSON.stringify(recoveredGraph) === baseFingerprint) {
    clearOnlineOwnerDraftIfMatches(onlineStorage, { ownerUid: state.userUid, workspaceId: state.workspaceId, confirmedGraph: onlineGraphProject.graph });
    return;
  }
  const context = { userUid: state.userUid, workspaceId: state.workspaceId, graphProject: onlineGraphProject, baseFingerprint };
  const mapName = recoveredGraph.project?.name || onlineWorkspace?.name || "this map";
  openConfirm("Recover local owner edits?",
    "A newer copy of " + mapName + " is stored only in this browser. Restore it over the current online version? Choose Cancel to keep the online version for now; the local draft stays available for a later recovery. Restore queues those edits for online save, and only the matching owner can access them.",
    "Restore local draft", () => {
      const current = onlineController.state();
      const latestDraft = readOnlineOwnerDraftForOwnerEdit(onlineStorage, {
        mode: current.mode, userUid: current.userUid, ownerUid: current.ownerUid, workspaceId: current.workspaceId,
      });
      if (!requireMutation("restore local owner edits") || current.userUid !== context.userUid
          || current.workspaceId !== context.workspaceId || onlineGraphProject !== context.graphProject
          || JSON.stringify(onlineGraphProject.graph) !== context.baseFingerprint
          || !latestDraft || String(latestDraft.updatedAt || 0) !== String(draft.updatedAt || 0)
          || JSON.stringify(latestDraft.graph) !== JSON.stringify(draft.graph)) {
        showToast("The online map or account changed before recovery. The local draft remains stored.", "error");
        return;
      }
      onlineGraphProject.graph = normalizeGraph(latestDraft.graph, { allowEmpty: true });
      onlineGraphProject.updatedAt = Date.now();
      renderAll();
      persist(false);
      showToast("Recovered the local owner draft. Online save is pending.");
    });
}

function handleOnlineSaveStatus(result) {
  const state = onlineController.state();
  const draft = currentOwnerOnlineDraft();
  const draftMatchesCurrent = Boolean(draft && onlineGraphProject
    && JSON.stringify(draft.graph) === JSON.stringify(onlineGraphProject.graph));
  if (result?.status === "saved" && draftMatchesCurrent && state.canEdit
      && state.userUid === state.ownerUid && state.workspaceId === onlineGraphProject.onlineWorkspaceId) {
    clearOnlineOwnerDraftIfMatches(onlineStorage, { ownerUid: state.userUid, workspaceId: state.workspaceId, confirmedGraph: onlineGraphProject.graph });
  }
  const labels = {
    pending: "Online save pending", saving: "Saving online", saved: "Saved online",
    conflict: draft ? "Online conflict; local recovery draft kept" : "Online conflict",
    offline: draft ? "Offline; local recovery draft kept" : "Offline; changes not saved",
    error: draft ? "Online save failed; local recovery draft kept" : "Online save failed",
    cancelled: draft ? "Online send stopped; local recovery draft kept" : "Online send stopped",
    "in-flight": draft ? "Earlier save may finish; local recovery draft kept" : "An online save is still in progress",
  };
  const label = labels[result?.status] || result?.message || "Online status changed";
  const detail = draft && ["conflict", "offline", "error", "cancelled", "in-flight"].includes(result?.status)
    ? " A local recovery draft is kept in this browser for the signed-in owner."
    : "";
  byId("save-status").textContent = label;
  const currentStatus = byId("online-current-status");
  if (currentStatus) currentStatus.textContent = (result?.message || label) + detail;
  updateOnlineUi();
}
function logOnlineFailure(context, error) {
  const code = String(error?.code || error?.status || "unknown");
  const status = String(error?.status || "unknown");
  console.error("[Atlas online] " + context, { code, status });
}
function onlineErrorMessage(error, action = "workspace operation") {
  const code = String(error?.code || error?.status || "");
  if (code.endsWith("permission-denied")) {
    if (action === "library") return "Atlas could not load your online map library (permission denied). Check that you are signed in to the intended Google account. If it is correct, online library access needs review.";
    if (action === "create") return "Atlas could not create the selected online map (permission denied). Your local map is unchanged. Check the signed-in account and online write access.";
    if (action === "open") return "Atlas could not open this online map (permission denied). Check the signed-in Google account and workspace access.";
  }
  return error?.message || "Online workspaces could not be opened.";
}
function handleOnlineError(error, action = "workspace operation") {
  if (error?.code || error?.status) logOnlineFailure(action, error);
  const message = onlineErrorMessage(error, action);
  const settingsError = byId("map-settings-error");
  if (settingsError && byId("map-settings-dialog")?.open) showMapSettingsMessage(message, { error: true });
  else {
    const routeMessage = byId("online-current-status");
    if (routeMessage) routeMessage.textContent = message;
    if (libraryMode === "cloud") setCloudLibraryState(message, true, false);
  }
  updateOnlineUi();
}
function currentWorkspaceLoadingPresentation() {
  return workspaceLoadingPresentation({
    online: isOnlineSession(), status: onlineState.status,
    navigationPending: Boolean(workspaceLoadingTarget && workspaceLoadingTarget === (onlineState.workspaceId || onlineTargetWorkspaceId)),
    unavailable: Boolean(onlineState.routeUnavailable || onlineUiUnavailable),
    workspaceId: onlineState.workspaceId || onlineTargetWorkspaceId,
    graphWorkspaceId: onlineGraphProject?.onlineWorkspaceId,
    hasGraph: Boolean(onlineGraphProject),
  });
}
function updateWorkspaceLoadingUi() {
  const main = byId("workspace-main");
  const presentation = currentWorkspaceLoadingPresentation();
  const wasBusy = main.dataset.workspaceLoading !== "idle";
  const previousTarget = main.dataset.loadingWorkspaceId || "";
  main.dataset.workspaceLoading = presentation.surface;
  main.dataset.loadingWorkspaceId = presentation.rowId;
  main.dataset.workspaceHeadingKnown = String(presentation.surface === "preview"
    || Boolean(onlineWorkspace?.id === presentation.rowId && onlineWorkspace?.name));
  document.documentElement.classList.toggle("workspace-motion-paused", document.hidden);
  for (const id of ["graph-stage", "inspector", "project-description"]) {
    byId(id).setAttribute("aria-busy", String(presentation.busy));
  }
  for (const row of byId("project-list").children) {
    const loading = row.dataset.workspaceOrigin === "cloud" && row.dataset.workspaceId === presentation.rowId && presentation.busy;
    row.classList.toggle("is-workspace-loading", loading);
    row.setAttribute("aria-busy", String(loading));
  }
  const announcement = byId("workspace-loading-announcement");
  if (presentation.busy && (!wasBusy || previousTarget !== presentation.rowId)) announcement.textContent = "Loading workspace.";
  else if (!presentation.busy && wasBusy) announcement.textContent = onlineController.state().status === "ready" ? "Workspace ready." : "Workspace loading stopped.";
  updateActionSaveStatus();
}
function updateOnlineUi() {
  const state = onlineState;
  const openSession = isOnlineSession();
  updateWorkspaceLoadingUi();
  const visibility = onlineStatusVisibility({
    openSession,
    explicitViewRoute: onlineRoute,
    routeUnavailable: Boolean(state.routeUnavailable || onlineUiUnavailable),
    status: state.status,
    hasGraph: Boolean(onlineGraphProject),
    dirty: Boolean(state.dirty),
    pendingUpload: Boolean(onlinePendingUpload && state.canEdit),
  });
  const current = byId("online-current");
  const retryPending = isCurrentSaveRetry(onlineSaveRetryPending, { workspaceId: state.workspaceId, userUid: state.userUid, openSession });
  const showCurrent = visibility.current || retryPending;
  if (current) current.hidden = !showCurrent;
  const recoveryStatus = retryPending ? onlineSaveRetryPending.status : state.status;
  const staleViewerCheck = state.status === "loading" && Boolean(onlineGraphProject) && state.mode === "viewer";
  const currentStatus = recoveryStatus === "delete-incomplete"
    ? "Cloud Workspace deletion is incomplete. Retry cleanup when available."
    : recoveryStatus === "conflict" ? "This map changed elsewhere. Reload it or deliberately save your version."
      : recoveryStatus === "offline" ? "Offline. The last confirmed view is stale; edits and exports are unavailable until reconnected."
        : recoveryStatus === "error" ? "The latest Cloud Workspace save failed. Retry when the service is available."
          : staleViewerCheck ? "Waiting for server confirmation. The displayed view is stale and read-only."
            : recoveryStatus || "Cloud Workspace needs attention.";
  const currentStatusNode = byId("online-current-status");
  if (currentStatusNode && showCurrent) currentStatusNode.textContent = currentStatus;
  const applyLocal = byId("apply-local-online");
  if (applyLocal) applyLocal.hidden = !onlinePendingUpload || !onlineWorkspace || !state.canEdit;
  const retrySave = byId("retry-online-save");
  if (retrySave && !retryPending) retrySave.hidden = !["offline", "error"].includes(state.status) || !state.dirty;
  if (retrySave) retrySave.disabled = Boolean(retryPending);
  const acceptConflict = byId("accept-conflict-online");
  if (acceptConflict && !retryPending) acceptConflict.hidden = state.status !== "conflict" || !state.dirty;
  if (acceptConflict) acceptConflict.disabled = Boolean(retryPending);
  const reloadSave = byId("reload-online-save");
  if (reloadSave && !retryPending) reloadSave.hidden = state.status !== "conflict" && !(state.status === "offline" && state.workspace);
  if (reloadSave) reloadSave.disabled = Boolean(retryPending);
  const reloadOnline = byId("reload-online");
  if (reloadOnline) reloadOnline.hidden = !(openSession && (state.status === "offline" || state.status === "error" || state.routeUnavailable));
  const returnLocal = byId("return-local");
  if (returnLocal) returnLocal.hidden = !visibility.returnLocal;
  const routeBanner = byId("online-route-banner");
  if (routeBanner) routeBanner.hidden = !visibility.banner;
  const routeTitle = byId("online-route-title");
  if (routeTitle && visibility.banner) routeTitle.textContent = state.routeUnavailable || onlineUiUnavailable
    ? "Online workspace unavailable"
    : staleViewerCheck ? "Checking online view"
      : state.status === "loading" ? "Opening Cloud Workspace"
        : "Cloud Workspace needs attention";
  const routeMessage = byId("online-route-message");
  if (routeMessage && visibility.banner) {
    if (state.routeUnavailable || onlineUiUnavailable) {
      if (!routeMessage.textContent.trim()) routeMessage.textContent = "This Cloud Workspace could not be opened.";
    } else if (staleViewerCheck) routeMessage.textContent = "Waiting for server confirmation. The displayed map is the last confirmed version and remains read-only.";
    else if (state.status === "loading") routeMessage.textContent = "Loading the Cloud Workspace map.";
    else if (state.status === "offline") routeMessage.textContent = "Offline. The last confirmed view is stale; reconnect and retry to continue.";
    else if (state.status === "error") routeMessage.textContent = "The latest owner save failed. Retry when the service is available.";
  }
  if (openSession && state.status === "loading") byId("save-status").textContent = onlineGraphProject ? "Checking access · read-only" : "Opening cloud map…";
  const workspaceModeLabel = byId("workspace-mode-label");
  if (workspaceModeLabel) workspaceModeLabel.textContent = openSession ? (state.canEdit ? "Owner - online" : "Read-only - online") : "Local workspace";
  renderLibrary();
  updateActionSaveStatus();
}
function setCloudLibraryState(message = "", retryable = false, loading = false) {
  const host = byId("cloud-workspace-state");
  const messageNode = byId("cloud-workspace-state-message");
  const retry = byId("retry-cloud-workspaces");
  if (messageNode) messageNode.textContent = message;
  if (host) { host.hidden = libraryMode !== "cloud" || !message; host.setAttribute("aria-busy", String(loading)); }
  if (retry) {
    retry.hidden = libraryMode !== "cloud" || !retryable;
    retry.disabled = loading;
  }
}
function makeLibraryRow({ origin, id, ownerUid = "", name, type, count, details, active = false, open }) {
  const row = plain("div", "project-row" + (active ? " active" : ""));
  row.dataset.workspaceId = id;
  row.dataset.workspaceOrigin = origin;
  const loading = currentWorkspaceLoadingPresentation();
  row.classList.toggle("is-workspace-loading", origin === "cloud" && loading.busy && loading.rowId === id);
  row.setAttribute("aria-busy", String(origin === "cloud" && loading.busy && loading.rowId === id));
  const openButton = plain("button", "project-row-open");
  openButton.type = "button";
  openButton.setAttribute("aria-current", active ? "page" : "false");
  openButton.append(plain("span", "project-monogram", String(name || "A").slice(0, 1).toUpperCase()));
  const nameWrap = plain("span", "project-name-wrap");
  nameWrap.append(plain("span", "project-name", name || "Untitled map"));
  nameWrap.append(plain("span", "project-meta", type || details || (origin === "cloud" ? "Cloud Workspace" : "Software project")));
  openButton.append(nameWrap, plain("span", "project-count", String(count ?? "")));
  openButton.addEventListener("click", (event) => { event.stopPropagation(); open(); sidebarDrawer.setOpen(false, { restoreFocus: true }); });
  const settingsButton = plain("button", "project-row-settings");
  settingsButton.type = "button";
  settingsButton.dataset.mapSettings = "";
  settingsButton.dataset.mapOrigin = origin;
  settingsButton.dataset.mapId = id;
  settingsButton.dataset.ownerUid = ownerUid;
  settingsButton.setAttribute("aria-label", "Settings for " + (name || "Untitled map"));
  settingsButton.setAttribute("aria-haspopup", "dialog");
  settingsButton.setAttribute("aria-controls", "map-settings-dialog");
  const moreIcon = svgElement("svg", { class: "ui-icon", viewBox: "0 0 20 20", "aria-hidden": "true", focusable: "false" });
  for (const x of [5, 10, 15]) moreIcon.append(svgElement("circle", { cx: x, cy: 10, r: 1.25, fill: "currentColor" }));
  settingsButton.append(moreIcon, plain("span", "visually-hidden", "Settings"));
  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openMapSettings({ origin, id, ownerUid });
  });
  row.append(openButton, settingsButton);
  return row;
}
function renderCloudLibrary() {
  const list = byId("project-list");
  if (!list || libraryMode !== "cloud") return;
  list.replaceChildren();
  const uid = currentAccountUid();
  if (!uid) {
    const state = accountSession.getState();
    const message = state.status === "error"
      ? "Cloud Workspace could not check your account. Retry to try again."
      : "Sign in with Google to see your Cloud Workspace maps. Signing in does not move local maps.";
    setCloudLibraryState(message, state.status === "error", false);
    mapSettingsController.invalidate();
    return;
  }
  const status = String(onlineLibraryCache.status || "");
  const snapshot = Array.isArray(onlineLibraryCache.snapshot) ? onlineLibraryCache.snapshot : null;
  const filtered = (snapshot || []).filter((item) => String(item?.ownerId || item?.ownerUid || "") === uid);
  const loading = /^(Loading|Retrying|Connecting)/i.test(status);
  if (status && (!loading || !filtered.length)) setCloudLibraryState(status, !loading, loading);
  else if (loading && filtered.length) setCloudLibraryState("");
  else if (!snapshot) setCloudLibraryState("Loading your Cloud Workspace maps.", false, true);
  else if (!filtered.length) setCloudLibraryState("No Cloud Workspace maps yet. Import architecture here, or move a local map from its settings.");
  else setCloudLibraryState("");
  for (const item of filtered) {
    const name = item.name || "Untitled cloud map";
    const details = (item.nodeCount ?? 0) + " components - " + (item.edgeCount ?? 0) + " connections"
      + (item.shared ? " - live link active" : "") + (item.deleting ? " - deletion needs retry" : "");
    list.append(makeLibraryRow({
      origin: "cloud", id: item.id, ownerUid: uid, name, type: details,
      count: item.nodeCount ?? 0, details,
      active: isOnlineSession() && onlineTargetWorkspaceId === item.id,
      open: () => { void openOwnedOnlineWorkspace(item); },
    }));
  }
  mapSettingsController.invalidate();
}
function updateLibraryStatusCopy() {
  const node = byId("storage-copy");
  if (!node) return;
  if (libraryMode === "cloud") {
    const uid = currentAccountUid();
    const account = accountSession.getState();
    const status = String(onlineLibraryCache.status || "");
    const snapshot = Array.isArray(onlineLibraryCache.snapshot) ? onlineLibraryCache.snapshot : null;
    if (!uid) node.textContent = account.status === "error" ? "Account check needs retry" : "Sign in to browse Cloud Workspace";
    else if (/^(Loading|Retrying|Connecting)/i.test(status)) node.textContent = "Loading Cloud Workspace";
    else if (status) node.textContent = "Cloud Workspace needs attention";
    else if (snapshot && !snapshot.some((item) => String(item?.ownerId || item?.ownerUid || "") === uid)) node.textContent = "No Cloud Workspace maps yet";
    else node.textContent = "Cloud Workspace maps";
    return;
  }
  node.textContent = recoveryMode ? "Local saved data needs attention" : "Stored in this browser";
}
function updateExampleFlowVisibility() {
  const uid = currentAccountUid();
  const count = libraryMode === "cloud"
    ? (onlineLibraryCache.snapshot || []).filter((item) => uid && String(item?.ownerId || item?.ownerUid || "") === uid).length
    : projects.length;
  byId("example-flow").hidden = currentWorkspaceActions().hideEditing || count >= 2;
}
function renderLibrary() {
  const list = byId("project-list");
  if (!list) return;
  const picker = byId("workspace-library-select");
  if (picker && picker.value !== libraryMode) picker.value = libraryMode;
  libraryPicker.setValue(libraryMode);
  if (currentWorkspaceActions().hideEditing) libraryPicker.close();
  list.setAttribute("aria-label", libraryMode === "cloud" ? "Cloud Workspace maps" : "Local Workspace maps");
  updateLibraryStatusCopy();
  updateExampleFlowVisibility();
  byId("clear-data").hidden = libraryMode !== "local" || currentWorkspaceActions().hideEditing;
  if (libraryMode === "cloud") { renderCloudLibrary(); localMapTip.refresh(); return; }
  list.replaceChildren();
  setCloudLibraryState("");
  for (const project of projects) {
    const name = project.graph.project.name || "Untitled project";
    list.append(makeLibraryRow({
      origin: "local", id: project.id, name,
      type: project.graph.project.type || "Software project",
      count: project.graph.nodes.length,
      active: !isOnlineSession() && activeId === project.id,
      open: () => selectProject(project.id),
    }));
  }
  mapSettingsController.invalidate();
  localMapTip.refresh();
}
function showMapSettingsMessage(message, { error = false } = {}) {
  const node = byId(error ? "map-settings-error" : "map-settings-message");
  if (!node) return;
  node.textContent = message || "";
  node.hidden = !message;
}
function addMapSettingsAction(label, action, { danger = false, disabled = false } = {}) {
  const button = plain("button", danger ? "button danger" : "button secondary", label);
  button.type = "button";
  button.dataset.actionLabel = label;
  button.disabled = Boolean(disabled);
  button.addEventListener("click", () => action(mapSettingsController.getCurrent()));
  byId("map-settings-actions").append(button);
  return button;
}
function renderMapSettings() {
  const target = mapSettingsController.getCurrent();
  if (!target) return;
  mapSettingsTarget = target;
  if (mapSettingsPending?.token === target.token) return;
  const data = mapSettingsData || {};
  const graph = target.origin === "local" ? target.project.graph : data.graph;
  const metadata = data.workspace || target.item || {};
  const name = graph?.project?.name || metadata.name || "Map settings";
  byId("map-settings-title").textContent = name;
  byId("map-settings-origin").textContent = target.origin === "local" ? "Local Workspace" : "Cloud Workspace";
  byId("map-settings-editor").hidden = !mapSettingsEditing || !graph;
  byId("save-map-settings").disabled = Boolean(data.loading);
  byId("map-settings-actions").replaceChildren();
  byId("map-settings-error").textContent = data.error || "";
  byId("map-settings-error").hidden = !data.error;
  const copyFallback = byId("map-settings-copy-fallback");
  copyFallback.hidden = !data.copyFallbackUrl;
  copyFallback.value = data.copyFallbackUrl || "";
  showMapSettingsMessage(data.loading && !graph ? "Loading this map's details..." : data.message || "");
  if (target.origin === "local") {
    addMapSettingsAction(mapSettingsEditing ? "Cancel editing" : "Edit details", (current) => {
      if (!current) return;
      mapSettingsEditing = !mapSettingsEditing;
      if (mapSettingsEditing) fillMapSettingsEditor(current.project.graph);
      renderMapSettings();
    });
    addMapSettingsAction("Download JSON", (current) => { void exportMapSettingsTarget(current); });
    const association = cloudAssociations[target.id] || null;
    const linkedId = workspaceForLocalProject(target.id);
    const unresolvedCandidate = hasUnresolvedLocalCloudCandidate(
      association, linkedId, manualMoveAttempts.isActive(target.id),
    );
    if (manualMoveAttempts.isActive(target.id)) {
      showMapSettingsMessage("A Cloud Workspace move is already in progress. Wait for it to finish before retrying or deleting this local map.");
      addMapSettingsAction("Moving to Cloud Workspace...", () => {}, { disabled: true });
    } else if (association?.pending === true && association.source === "manual" && association.ownerUid && association.ownerUid !== currentAccountUid()) {
      showMapSettingsMessage("A Cloud Workspace move is unresolved under another account. Sign in as that owner to retry safely; keep this local map until the existing candidate is resolved.");
      addMapSettingsAction("Open Account", () => byId("account-control")?.click());
    } else if (association?.pending === true && association.source === "manual") {
      showMapSettingsMessage("A previous Cloud Workspace move is unresolved. Retry will reuse its same candidate; resolve it before deleting this local map.");
      addMapSettingsAction("Retry move to Cloud Workspace", (current) => confirmMoveLocalTarget(current));
    } else if (unresolvedCandidate && association?.confirmationRequired === true) {
      showMapSettingsMessage("This map stayed local earlier. Choose Move to Cloud Workspace and confirm if you want to upload it now; resolve that candidate before deleting the local copy.");
      addMapSettingsAction("Move to Cloud Workspace", (current) => confirmMoveLocalTarget(current));
    } else if (unresolvedCandidate && !linkedId?.startsWith("verify:")) {
      showMapSettingsMessage("This map already has a Cloud Workspace save pending. Open the local map to use its existing retry action; resolve the save before deleting this local map.");
      addMapSettingsAction("Open local map to retry save", (current) => {
        if (!current || !mapSettingsController.isCurrent(current)) return;
        closeMapSettings();
        selectProject(current.id);
      });
    } else if (linkedId?.startsWith("verify:")) {
      showMapSettingsMessage("Atlas is checking whether this map already has a Cloud Workspace copy. Check Cloud Workspace before moving or deleting it.");
      addMapSettingsAction("Check Cloud Workspace", () => selectLibraryMode("cloud"));
    } else if (linkedId && !linkedId.startsWith("pending:")) {
      addMapSettingsAction("Open Cloud Workspace", (current) => {
        void runMapSettingsAction(current, () => checkLocalCloudReference(current.id, linkedId,
          () => mapSettingsController.isCurrent(current)), (result) => {
          if (result.status === "missing") {
            mapSettingsData.message = "The previous cloud copy is no longer available. Your local map is saved; choose Move to Cloud Workspace to create a new copy.";
          } else if (result.status === "present") {
            closeMapSettings();
            selectLibraryMode("cloud");
            void openOwnedOnlineWorkspace(result.workspace);
          }
        }, { actionLabel: "Open Cloud Workspace", pendingLabel: "Checking…" });
      });
    } else {
      addMapSettingsAction("Move to Cloud Workspace", (current) => confirmMoveLocalTarget(current));
    }
    if (!unresolvedCandidate) addMapSettingsAction("Delete local map", (current) => confirmDeleteLocalTarget(current), { danger: true });
    return;
  }
  const uid = currentAccountUid();
  if (!uid || target.ownerUid !== uid || String(target.item?.ownerId || target.item?.ownerUid || "") !== uid) return;
  const deleting = Boolean(data.workspace?.deleting || target.item?.deleting);
  if (deleting) {
    addMapSettingsAction("Retry cloud deletion", (current) => confirmDeleteCloudTarget(current, true), { danger: true });
    showMapSettingsMessage("This map is being deleted. Retry cleanup when the service is available.");
    return;
  }
  const activeState = onlineController.state();
  const awaitingActiveValidation = activeState.workspaceId === target.id && activeState.stalePreview;
  if (awaitingActiveValidation) showMapSettingsMessage("Waiting for Cloud Workspace to confirm ownership. Editing, sharing, deletion, and downloads are temporarily disabled.");
  if (data.error && !data.graph) addMapSettingsAction("Retry map details", (current) => { void loadMapSettingsCloudTarget(current); }, { disabled: awaitingActiveValidation });
  addMapSettingsAction(mapSettingsEditing ? "Cancel editing" : "Edit details", (current) => {
    if (!current) return;
    if (mapSettingsEditing) {
      mapSettingsEditing = false;
      renderMapSettings();
      return;
    }
    mapSettingsEditing = true;
    if (mapSettingsData?.graph) {
      fillMapSettingsEditor(mapSettingsData.graph);
      renderMapSettings();
    } else void loadMapSettingsCloudTarget(current);
  }, { disabled: Boolean(data.loading || awaitingActiveValidation) });
  addMapSettingsAction("Download JSON", (current) => { void exportMapSettingsTarget(current); }, { disabled: Boolean(data.loading || awaitingActiveValidation) });
  const shared = Boolean(data.workspace?.shared ?? target.item?.shared);
  if (shared) {
    addMapSettingsAction("Copy live link", (current) => { void copyMapSettingsLiveLink(current); }, { disabled: awaitingActiveValidation });
    addMapSettingsAction("Revoke live link", (current) => confirmCloudShareTarget(current, false), { danger: true, disabled: awaitingActiveValidation });
  } else addMapSettingsAction("Share live link", (current) => confirmCloudShareTarget(current, true), { disabled: awaitingActiveValidation });
  addMapSettingsAction("Delete cloud map", (current) => confirmDeleteCloudTarget(current, false), { danger: true, disabled: awaitingActiveValidation });
}
function fillMapSettingsEditor(graph) {
  if (!graph) return;
  byId("map-settings-name").value = graph.project?.name || "";
  byId("map-settings-description").value = graph.project?.description || "";
  byId("map-settings-type").value = graph.project?.type || "";
}
function closeMapSettings() {
  clearMapSettingsProgress();
  mapSettingsReadCancel?.();
  mapSettingsReadCancel = null;
  mapSettingsController.close();
  const dialog = byId("map-settings-dialog");
  if (dialog?.open) dialog.close("cancel");
}
function openMapSettings(targetInput) {
  const target = mapSettingsController.open(targetInput);
  if (!target) { showToast("That map is no longer available in this workspace or account.", "error"); return; }
  mapSettingsEditing = false;
  byId("map-settings-error").hidden = true;
  byId("map-settings-message").hidden = true;
  if (target.origin === "local") {
    mapSettingsData = { loading: false, graph: target.project.graph };
    mapSettingsLocalGraphRef = target.project.graph;
    mapSettingsLocalFingerprint = JSON.stringify(target.project.graph);
  } else {
    mapSettingsData = { loading: false, graph: null, workspace: target.item || null };
  }
  const dialog = byId("map-settings-dialog");
  if (!dialog.open) dialog.showModal();
  renderMapSettings();
}
function readCloudSettingsTarget(target) {
  return new Promise((resolve, reject) => {
    let done = false;
    let unsubscribe = () => {};
    let timer = null;
    const finish = (error, value) => {
      if (done) return;
      done = true;
      if (timer !== null) clearTimeout(timer);
      try { unsubscribe(); } catch {}
      if (mapSettingsReadCancel === cancel) mapSettingsReadCancel = null;
      if (error) reject(error); else resolve(value);
    };
    const cancel = () => finish(null, { cancelled: true });
    mapSettingsReadCancel = cancel;
    timer = setTimeout(() => finish(new Error("Cloud map details timed out. Retry when online.")), 20000);
    Promise.resolve(accountSession.getService()).then((service) => {
      if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== target.ownerUid) {
        finish(null, { cancelled: true });
        return;
      }
      unsubscribe = service.watchWorkspace({ workspaceId: target.id }, (event) => {
        if (done) return;
        if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== target.ownerUid) {
          finish(null, { cancelled: true });
        } else if (event?.status === "ready") {
          if (event.workspace?.id !== target.id || event.workspace?.ownerId !== target.ownerUid) {
            finish(new Error("This Cloud Workspace map is no longer owned by the signed-in account."));
          } else finish(null, { workspace: event.workspace, graph: normalizeGraph(event.graph, { allowEmpty: true }) });
        } else if (["error", "revoked", "deleted", "not-found", "permission-denied", "disabled"].includes(event?.status)) {
          finish(event.error || new Error(event.message || "Cloud map details could not be loaded."));
        }
      });
    }).catch((error) => finish(error));
  });
}
async function loadMapSettingsCloudTarget(target) {
  if (!target || target.origin !== "cloud" || mapSettingsData?.loading) return;
  await runMapSettingsAction(target, (current) => readCloudSettingsTarget(current), (value) => {
    mapSettingsData = { ...value, loading: false };
    if (mapSettingsEditing) fillMapSettingsEditor(mapSettingsData.graph);
  }, { actionLabel: mapSettingsData?.error ? "Retry map details" : "Edit details", pendingLabel: "Loading…" });
}
function clearMapSettingsProgress(record = mapSettingsPending) {
  if (!record || mapSettingsPending !== record) return;
  record.finish();
  for (const [element, disabled] of record.controls) element.disabled = disabled;
  actionGate.finish(record.ticket);
  mapSettingsPending = null;
  byId("map-settings-dialog").setAttribute("aria-busy", "false");
}
async function runMapSettingsAction(target, operation, onSuccess = () => {}, { actionLabel = "", pendingLabel = "Working…" } = {}) {
  if (!target || !mapSettingsController.isCurrent(target)) return;
  const ticket = actionGate.begin("map-settings:" + target.token);
  if (!ticket) return;
  const dialog = byId("map-settings-dialog");
  mapSettingsData = { ...(mapSettingsData || {}), error: "", copyFallbackUrl: "" };
  const buttons = [...dialog.querySelectorAll("button[data-action-label], #save-map-settings")];
  const button = buttons.find((item) => (item.dataset.actionLabel || item.textContent.trim()) === actionLabel)
    || buttons.find((item) => item === document.activeElement) || buttons[0];
  const controls = [...dialog.querySelectorAll(".map-settings-actions button, .map-settings-editor input, .map-settings-editor textarea, #save-map-settings")];
  const record = { token: target.token, ticket, controls: controls.map((item) => [item, item.disabled]), finish: startButtonProgress(button, pendingLabel) };
  mapSettingsPending = record;
  dialog.setAttribute("aria-busy", "true");
  controls.forEach((item) => { item.disabled = true; });
  byId("action-announcement").textContent = pendingLabel;
  try {
    const result = await mapSettingsController.run(target, operation);
    if (result.cancelled || result.value?.cancelled) return;
    onSuccess(result.value, result.target);
  } catch (error) {
    if (!mapSettingsController.isCurrent(target)) return;
    mapSettingsData = { ...(mapSettingsData || {}), loading: false, error: error?.message || "This map action could not be completed." };
  } finally {
    const current = mapSettingsPending === record && mapSettingsController.isCurrent(target);
    clearMapSettingsProgress(record);
    if (current) {
      byId("map-settings-editor").querySelectorAll("input, textarea").forEach((item) => { item.disabled = false; });
      renderMapSettings();
      if (mapSettingsData?.copyFallbackUrl) {
        byId("map-settings-copy-fallback").focus();
        byId("map-settings-copy-fallback").select();
      }
    }
  }
}
function confirmSettingsAction(target, title, copy, confirmLabel, action, onSuccess = () => {}) {
  if (!target || !mapSettingsController.isCurrent(target)) return;
  const feedback = {
    "Move map": ["Move to Cloud Workspace", "Creating…"],
    "Retry move": ["Retry move to Cloud Workspace", "Retrying…"],
    "Enable live link": ["Share live link", "Creating…"],
    "Revoke link": ["Revoke live link", "Revoking…"],
    "Delete cloud map": ["Delete cloud map", "Deleting…"],
    "Retry deletion": ["Retry cloud deletion", "Deleting…"],
    "Delete local map": ["Delete local map", "Deleting…"],
  }[confirmLabel] || [confirmLabel, "Working…"];
  openConfirm(title, copy, confirmLabel, () => {
    void runMapSettingsAction(target, action, onSuccess, { actionLabel: feedback[0], pendingLabel: feedback[1] });
  });
}
async function exportMapSettingsTarget(target) {
  await runMapSettingsAction(target, async (current) => {
    if (current.origin === "cloud" && !cloudTargetActionAllowed(current, { allowDirty: true })) throw new Error("Wait for Cloud Workspace ownership confirmation before exporting this map.");
    let graph = current.origin === "local" ? current.project.graph : mapSettingsData?.graph;
    if (!graph && current.origin === "cloud") {
      mapSettingsData = { ...(mapSettingsData || {}), loading: true, error: "" };
      renderMapSettings();
      try {
        const result = await readCloudSettingsTarget(current);
        if (result?.cancelled) return { cancelled: true };
        if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== current.ownerUid || !cloudTargetActionAllowed(current, { allowDirty: true })) throw new Error("The account or Cloud Workspace changed before the download completed.");
        mapSettingsData = { ...result, loading: false };
        graph = mapSettingsData.graph;
      } finally {
        if (mapSettingsController.isCurrent(target) && mapSettingsData?.loading) {
          mapSettingsData = { ...mapSettingsData, loading: false };
          renderMapSettings();
        }
      }
      renderMapSettings();
    }
    if (!graph) throw new Error("The map data is not available to export.");
    exportJson(graph);
    return graph.project?.name || "map";
  }, () => showToast("Downloaded a JSON copy of this map."), { actionLabel: "Download JSON", pendingLabel: "Preparing…" });
}
async function saveMapSettingsDetails() {
  const target = mapSettingsController.getCurrent();
  if (!target || !mapSettingsEditing) return;
  const name = byId("map-settings-name").value.trim();
  if (!name) { showMapSettingsMessage("Map name is required.", { error: true }); return; }
  const details = {
    name,
    description: byId("map-settings-description").value.trim(),
    type: byId("map-settings-type").value.trim() || "Software project",
  };
  const sequence = ++mapSettingsSaveSequence;
  await runMapSettingsAction(target, async (current) => {
    const active = onlineController.state();
    if (active.workspaceId === current.id && active.stalePreview) throw new Error("Wait for Cloud Workspace ownership confirmation before editing this map.");
    const sourceGraph = current.origin === "local" ? current.project.graph
      : active.workspaceId === current.id && onlineGraphProject?.onlineWorkspaceId === current.id
        ? onlineGraphProject.graph : mapSettingsData?.graph;
    if (!sourceGraph) throw new Error("The map details are no longer available. Reopen settings and try again.");
    if (current.origin === "local" && (sourceGraph !== mapSettingsLocalGraphRef
        || JSON.stringify(sourceGraph) !== mapSettingsLocalFingerprint)) {
      throw new Error("This local map changed while settings were open. Reopen settings before saving.");
    }
    const settingsHistoryScope = current.origin === "local" ? "local:" + current.id : cloudEditHistoryScope(current.ownerUid, current.id);
    const isActiveTarget = current.origin === "local" ? activeProject() === current.project : active.workspaceId === current.id;
    if (isActiveTarget) editHistory.ensure(settingsHistoryScope, sourceGraph);
    else editHistory.sync(settingsHistoryScope, sourceGraph);
    const candidate = normalizeEditableGraph({
      ...sourceGraph,
      project: { name: details.name, description: details.description, type: details.type },
    }, { baselineGraph: sourceGraph });
    if (current.origin === "local") {
      const project = current.project;
      project.graph = candidate;
      project.updatedAt = Date.now();
      const result = writeLibrary(projects, activeId);
      if (!result.ok) {
        project.graph = sourceGraph;
        throw new Error(result.error || "The local map could not be saved.");
      }
      editHistory.record(settingsHistoryScope, candidate);
      mapSettingsLocalGraphRef = candidate;
      mapSettingsLocalFingerprint = JSON.stringify(candidate);
      mapSettingsData = { loading: false, graph: candidate };
      if (activeProject() === project) renderAll(); else renderLibrary();
      return { graph: candidate };
    }
    if (!cloudTargetActionAllowed(current, { allowDirty: true })) throw new Error("Wait for Cloud Workspace ownership confirmation before editing this map.");
    if (active.workspaceId === current.id && onlineGraphProject?.onlineWorkspaceId === current.id && active.canEdit) {
      onlineGraphProject.graph = candidate;
      if (!persistOnlineOwnerDraft()) throw new Error("Atlas could not keep a recovery draft for this online edit. Export a JSON backup before saving details.");
      recordGraphEdit();
      if (!onlineController.queueSave(candidate)) throw new Error("Online changes could not be queued. The recovery draft is still kept in this browser.");
      mapSettingsData.graph = candidate;
      mapSettingsData.workspace = onlineWorkspace || mapSettingsData.workspace;
      return { graph: candidate, queued: true };
    }
    if (active.workspaceId === current.id && active.dirty) {
      throw new Error("This Cloud Workspace has pending edits. Save or resolve them before changing its details here.");
    }
    const service = await accountSession.getService();
    if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== current.ownerUid) throw new Error("The account or target map changed before the save started.");
    const workspace = await service.saveWorkspace({
      workspaceId: current.id,
      graph: candidate,
      expectedRevision: mapSettingsData?.workspace?.currentRevision,
    });
    if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== current.ownerUid) return { cancelled: true };
    editHistory.record(settingsHistoryScope, candidate);
    mapSettingsData = { loading: false, graph: candidate, workspace };
    onlineLibraryCache.snapshot = onlineLibraryCache.snapshot?.map((item) =>
      item.id === current.id && item.ownerId === current.ownerUid
        ? { ...item, name: details.name, projectType: details.type, updatedAt: workspace.updatedAt } : item,
    ) ?? null;
    renderLibrary();
    return { graph: candidate, workspace };
  }, (value) => {
    if (sequence !== mapSettingsSaveSequence || !mapSettingsController.isCurrent(target)) return;
    mapSettingsEditing = false;
    mapSettingsData = { ...(mapSettingsData || {}), ...(value || {}), loading: false, message: "", error: "" };
    showToast(value?.queued ? "Map details queued to save." : "Map details saved.");
  }, { actionLabel: "Save map details", pendingLabel: "Saving…" });
}
function confirmDeleteLocalTarget(target) {
  const project = target?.project;
  if (!project || !mapSettingsController.isCurrent(target)) return;
  if (localProjectHasUnresolvedCloudCandidate(project.id)) {
    showMapSettingsMessage("Resolve the pending Cloud Workspace save before deleting this local map.", { error: true });
    return;
  }
  confirmSettingsAction(target, "Delete this local map?", "Remove " + (project.graph.project.name || "this map") + " from this browser's Local Workspace library? This does not delete any Cloud Workspace copy.", "Delete local map", (current) => {
    if (localProjectHasUnresolvedCloudCandidate(current.id)) throw new Error("Resolve the pending Cloud Workspace save before deleting this local map.");
    const live = resolveMapSettingsTarget(current, { projects, workspaces: onlineLibraryCache.snapshot || [], currentUid: currentAccountUid() });
    if (!live || live.project !== project) throw new Error("This local map changed or was removed before deletion.");
    const deletion = removeProjectSnapshot(projects, { projectId: current.id, projectRef: project, graphRef: project.graph }, activeId);
    if (!deletion) throw new Error("This local map changed before deletion; no map was removed.");
    if (shouldClearShareFragmentForDeletedProject(deletion.project, location.hash)) {
      history.replaceState(history.state, "", location.pathname + location.search);
      cancelPendingShareLoad();
    }
    editHistory.forget("local:" + current.id);
    mapAdmissionController.forget({ projectId: current.id });
    delete cloudAssociations[current.id];
    saveCloudAssociations();
    projects = deletion.projects;
    activeId = deletion.activeId;
    if (deletion.wasActive) {
      viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
      selectedNodeId = null;
      selectedEdgeId = null;
      excludedTypes.clear();
      searchTerm = "";
      byId("search").value = "";
    }
    const saved = writeLibrary(projects, activeId);
    renderAll();
    if (deletion.wasActive) fitGraph(true);
    closeMapSettings();
    if (!saved.ok) showToast(saved.error || "The local map was removed from this session but could not be saved to browser storage.", "error");
    return true;
  });
}
function confirmMoveLocalTarget(target) {
  const project = target?.project;
  if (!project || !mapSettingsController.isCurrent(target)) return;
  if (manualMoveAttempts.isActive(project.id)) {
    showMapSettingsMessage("A Cloud Workspace move is already in progress. Wait for it to finish before retrying.");
    return;
  }
  const session = accountSession.getState();
  if (!session.initialized) {
    void runMapSettingsAction(target, async () => {
      const state = await accountSession.initialize();
      if (state.status === "error") throw state.error || new Error("Your account could not be checked. Try again.");
      return state;
    }, () => confirmMoveLocalTarget(mapSettingsController.getCurrent()), { actionLabel: "Move to Cloud Workspace", pendingLabel: "Checking…" });
    return;
  }
  const currentGraphAtPrompt = JSON.stringify(project.graph);
  const previousAtPrompt = cloudAssociations[project.id];
  const retryAttemptAtPrompt = reusableManualMoveAttempt(previousAtPrompt, currentAccountUid());
  let graphSnapshot = retryAttemptAtPrompt
    ? normalizeGraph(retryAttemptAtPrompt.graph, { allowEmpty: true })
    : JSON.parse(currentGraphAtPrompt);
  let fingerprint = JSON.stringify(graphSnapshot);
  const mapName = graphSnapshot.project.name || "this local map";
  const retryCopy = retryAttemptAtPrompt
    ? "Retry uses the original version submitted to Cloud Workspace. Newer local edits remain saved only in Local Workspace."
    : "Upload only " + mapName + ": its name and details, components, connections, notes, source paths, evidence, chart data, and saved positions. The local copy remains in this browser. The Cloud Workspace stays private until you choose Share live link.";
  confirmSettingsAction(target, retryAttemptAtPrompt ? "Retry this Cloud Workspace move?" : "Move this map to Cloud Workspace?",
    retryCopy,
    retryAttemptAtPrompt ? "Retry move" : "Move map", async (current) => {
      if (!manualMoveAttempts.begin(current.id)) throw new Error("A Cloud Workspace move is already in progress. Wait for it to finish before retrying.");
      renderMapSettings();
      try {
        const state = accountSession.getState();
        if (!state.initialized) throw new Error("Atlas is still checking your account. Retry Move this map after the account check completes.");
        let user = state.user;
        if (!user?.uid) user = await accountSession.signIn();
        if (!user?.uid || currentAccountUid() !== user.uid) throw new Error("Google sign-in did not complete for the account that started this move.");
        if (!mapSettingsController.isCurrent(target)) throw new Error("The map settings or account changed before upload began.");
        const latest = projects.find((entry) => entry.id === current.id);
        if (latest !== project || JSON.stringify(latest.graph) !== currentGraphAtPrompt) throw new Error("This local map changed while the confirmation was open. Reopen settings and try again.");
        const previous = cloudAssociations[current.id];
        if (previous?.pending === true && previous.source === "manual" && previous.ownerUid && previous.ownerUid !== user.uid) {
          throw new Error("A Cloud Workspace move is unresolved under another account. Sign in as that owner to reuse its candidate; a second map was not created.");
        }
        if (retryAttemptAtPrompt) {
          const reusable = reusableManualMoveAttempt(previous, user.uid);
          if (!reusable || reusable.workspaceId !== retryAttemptAtPrompt.workspaceId || reusable.idempotencyKey !== retryAttemptAtPrompt.idempotencyKey) {
            throw new Error("The pending Cloud Workspace candidate changed while confirmation was open. Reopen Settings and verify it before retrying.");
          }
          graphSnapshot = normalizeGraph(reusable.graph, { allowEmpty: true });
          fingerprint = JSON.stringify(graphSnapshot);
        } else if (hasUnresolvedLocalCloudCandidate(previous, workspaceForLocalProject(current.id))) {
          throw new Error("A Cloud Workspace save began while confirmation was open. Resolve its existing candidate before making another move.");
        }
        if (previous?.pending === true && previous.source === "manual" && !retryAttemptAtPrompt) {
          throw new Error("This pending Cloud Workspace move has no reusable original payload. Keep the local map and verify the existing cloud candidate before retrying.");
        }
        const candidateWorkspaceId = retryAttemptAtPrompt?.workspaceId || createRandomWorkspaceId();
        if (!candidateWorkspaceId) throw new Error("Atlas could not create a secure Cloud Workspace ID.");
        const idempotencyKey = retryAttemptAtPrompt?.idempotencyKey || ("manual:" + current.id + ":" + user.uid + ":" + candidateWorkspaceId);
        const nextAssociation = {
          workspaceId: candidateWorkspaceId, ownerUid: user.uid, pending: true, committed: false,
          source: "manual", key: current.id, idempotencyKey, graphFingerprint: fingerprint,
          confirmationRequired: false, admissionStatus: "creating", startedAt: previous?.startedAt || Date.now(),
        };
        cloudAssociations[current.id] = nextAssociation;
        if (!saveCloudAssociations()) {
          if (previous) cloudAssociations[current.id] = previous;
          else delete cloudAssociations[current.id];
          throw new Error("Atlas could not save a safe retry record. The map remains local and was not uploaded.");
        }
        const service = await accountSession.getService();
        if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== user.uid) throw new Error("The account or map changed before upload started. Nothing was uploaded.");
        await service.createWorkspace({ name: graphSnapshot.project.name, graph: graphSnapshot, workspaceId: candidateWorkspaceId, idempotencyKey, expectedOwnerUid: user.uid });
        if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== user.uid) {
          throw new Error("The cloud map may have been created under the starting account. Its saved retry record remains associated with that account.");
        }
        if (!commitManualMoveAssociation(cloudAssociations, current.id, saveCloudAssociations)) {
          throw new Error("The map may have moved, but Atlas could not save its association. The same retry candidate is being kept; keep the local copy and retry or verify Cloud Workspace before deleting it.");
        }
        return { workspaceId: candidateWorkspaceId };
      } finally {
        manualMoveAttempts.finish(current.id);
        if (mapSettingsController.isCurrent(target)) renderMapSettings();
      }
    }, (result) => {
      const newerLocalEdits = JSON.stringify(project.graph) !== fingerprint;
      const message = newerLocalEdits
        ? "The originally submitted version is in Cloud Workspace. Newer local edits remain only in Local Workspace."
        : "Map moved to Cloud Workspace. Your local copy remains saved here.";
      mapSettingsData = { ...(mapSettingsData || {}), message: "", error: "" };
      renderLibrary();
      renderMapSettings();
      showToast(message);
    });
}
function cloudTargetActionAllowed(target, { allowDirty = false } = {}) {
  if (!target || target.origin !== "cloud" || currentAccountUid() !== target.ownerUid
      || String(target.item?.ownerId || target.item?.ownerUid || "") !== target.ownerUid) return false;
  const active = onlineController.state();
  if (active.workspaceId === target.id && active.stalePreview) return false;
  if (!allowDirty && active.workspaceId === target.id && active.dirty) return false;
  return true;
}
function confirmCloudShareTarget(target, enabled) {
  if (!cloudTargetActionAllowed(target, { allowDirty: true })) { showMapSettingsMessage("Only the signed-in owner can change sharing for this map.", { error: true }); return; }
  const url = new URL("./workspace?view=" + encodeURIComponent(target.id), location.href).href;
  const title = enabled ? "Enable live viewing?" : "Turn off live viewing?";
  const copy = enabled
    ? "Anyone with the link can view the current Cloud Workspace map. If sharing is turned off and later enabled again, a saved old link becomes active again."
    : "Turn off live viewing for " + (mapSettingsData?.workspace?.name || target.item?.name || "this map") + "? Existing links will stop opening it.";
  confirmSettingsAction(target, title, copy, enabled ? "Enable live link" : "Revoke link", async (current) => {
    if (!cloudTargetActionAllowed(current, { allowDirty: true })) throw new Error("The account changed before sharing could be updated.");
    const service = await accountSession.getService();
    if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== current.ownerUid) throw new Error("The account or Cloud Workspace changed before sharing could be updated.");
    const result = await service.setShared({ workspaceId: current.id, enabled: Boolean(enabled) });
    if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== current.ownerUid) return { cancelled: true };
    mapSettingsData.workspace = { ...mapSettingsData.workspace, shared: Boolean(enabled) };
    mapSettingsData.liveUrl = enabled ? String(result?.viewUrl || url) : "";
    onlineLibraryCache.snapshot = onlineLibraryCache.snapshot?.map((entry) =>
      entry.id === current.id && entry.ownerId === current.ownerUid
        ? { ...entry, shared: Boolean(enabled) } : entry,
    ) ?? null;
    if (onlineWorkspace?.id === current.id && onlineState.userUid === current.ownerUid) {
      onlineWorkspace = { ...onlineWorkspace, shared: Boolean(enabled) };
      onlineCurrentLink = enabled ? String(result?.viewUrl || url) : "";
    }
    renderLibrary();
    return { shared: enabled };
  }, () => {
    mapSettingsData.message = "";
    mapSettingsData.error = "";
    renderMapSettings();
    showToast(enabled ? "Live viewing is on. Anyone with the short link can read the current map." : "Live viewing is off. Existing links can no longer open this map.");
  });
}
async function copyMapSettingsLiveLink(target) {
  await runMapSettingsAction(target, async (current) => {
    if (!cloudTargetActionAllowed(current, { allowDirty: true }) || !(mapSettingsData?.workspace?.shared ?? current.item?.shared)) {
      throw new Error("Live sharing is not active for this Cloud Workspace map.");
    }
    const url = mapSettingsData?.liveUrl || new URL("./workspace?view=" + encodeURIComponent(current.id), location.href).href;
    try {
      await copyText(url, { container: byId("map-settings-dialog"), isCurrent: () => mapSettingsController.isCurrent(target) && currentAccountUid() === current.ownerUid });
    } catch (error) {
      if (mapSettingsController.isCurrent(target) && currentAccountUid() === current.ownerUid) mapSettingsData.copyFallbackUrl = url;
      throw error;
    }
    return url;
  }, () => { mapSettingsData.error = ""; mapSettingsData.copyFallbackUrl = ""; showToast("Live link copied."); }, { actionLabel: "Copy live link", pendingLabel: "Copying…" });
}
function confirmDeleteCloudTarget(target, retry = false) {
  if (!cloudTargetActionAllowed(target)) {
    showMapSettingsMessage("Save or resolve pending owner edits before deleting this Cloud Workspace map.", { error: true });
    return;
  }
  const name = mapSettingsData?.workspace?.name || target.item?.name || "this map";
  confirmSettingsAction(target, retry ? "Retry cloud deletion?" : "Delete this Cloud Workspace map?",
    retry ? "Finish deleting " + name + ". Its live link is already disabled."
      : "Delete " + name + " from Cloud Workspace? This disables its live link and removes the cloud map. Local copies remain in this browser. Download JSON first if you want a separate backup.",
    retry ? "Retry deletion" : "Delete cloud map", async (current) => {
      if (!cloudTargetActionAllowed(current)) throw new Error("The account changed or this map has pending edits; deletion was stopped.");
      const service = await accountSession.getService();
      if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== current.ownerUid) throw new Error("The account or target map changed before deletion.");
      await service.deleteWorkspace(current.id);
      if (!mapSettingsController.isCurrent(target) || currentAccountUid() !== current.ownerUid) return { cancelled: true };
      onlineLibraryCache.snapshot = (onlineLibraryCache.snapshot || []).filter((item) => item.id !== current.id || item.ownerId !== current.ownerUid);
      onlineController.forgetOwnerPreview?.(current.id);
      removeWorkspaceAssociation(current.id);
      if (onlineController.state().workspaceId === current.id && onlineState.userUid === current.ownerUid) returnToLocalWorkspace();
      else renderLibrary();
      closeMapSettings();
      return true;
    });
}
function selectFirstCloudWorkspace() {
  const item = cloudLibraryFirstSelection.takeFirst({
    mode: libraryMode, currentUid: currentAccountUid(), workspaces: onlineLibraryCache.snapshot,
  });
  if (item) void openOwnedOnlineWorkspace(item);
}
function selectLibraryMode(mode, { selectFirst = false } = {}) {
  if (!["local", "cloud"].includes(mode)) return;
  if (selectFirst && mode === "local" && isOnlineSession() && !returnToLocalWorkspace()) { renderLibrary(); return; }
  const request = ++cloudLibraryRequest;
  cloudLibraryFirstSelection.cancel();
  const selection = selectFirst && mode === "cloud" ? cloudLibraryFirstSelection.begin() : null;
  libraryMode = mode;
  renderLibrary();
  updateWorkspaceActionAvailability();
  if (mode !== "cloud") return;
  if (!Array.isArray(onlineLibraryCache.snapshot)) onlineLibraryCache.status = currentAccountUid() ? "Loading your Cloud Workspace maps." : "Checking your account for Cloud Workspace maps.";
  renderLibrary();
  void (async () => {
    try {
      const state = await accountSession.initialize();
      if (request !== cloudLibraryRequest || libraryMode !== "cloud") return;
      onlineController.syncAccountUser?.(state.user || null);
      if (!state.user?.uid) {
        onlineLibraryCache.snapshot = null;
        onlineLibraryCache.status = "Sign in with Google to see your Cloud Workspace maps. Local maps remain separate.";
        renderLibrary();
        return;
      }
      if (cloudLibraryFirstSelection.bindOwner(selection, state.user.uid)
          && !onlineLibraryCache.status) selectFirstCloudWorkspace();
      await onlineController.browseLibrary();
      if (request === cloudLibraryRequest && libraryMode === "cloud") renderLibrary();
    } catch (error) {
      if (request !== cloudLibraryRequest || libraryMode !== "cloud") return;
      onlineLibraryCache.status = onlineErrorMessage(error, "library");
      renderLibrary();
    }
  })();
}
function retryCloudLibrary() {
  if (libraryMode !== "cloud") return;
  onlineLibraryCache.status = "Retrying your Cloud Workspace maps.";
  renderLibrary();
  void (async () => {
    try {
      const state = await accountSession.initialize();
      onlineController.syncAccountUser?.(state.user || null);
      if (!state.user?.uid) {
        onlineLibraryCache.status = "Sign in with Google to see your Cloud Workspace maps.";
        renderLibrary();
        return;
      }
      if (!onlineController.retryLibrary()) await onlineController.browseLibrary();
    } catch (error) {
      onlineLibraryCache.status = onlineErrorMessage(error, "library");
      renderLibrary();
    }
  })();
}
async function openOwnedOnlineWorkspace(item) {
  cloudLibraryFirstSelection.cancel();
  const uid = currentAccountUid();
  if (!item?.id || !uid || String(item.ownerId || "") !== uid) {
    showToast("Sign in to the map's owner account before opening it.", "error");
    return;
  }
  if (!preserveDirtyOwnerDraftForNavigation()) return;
  closeMapSettings();
  const current = onlineController.state();
  if (current.workspaceId === item.id && !current.routeUnavailable && !["offline", "error"].includes(current.status)) return;
  try {
    onlineRoute = false;
    focusedType = ""; lockedType = ""; touchInteractionActive = false;
    await onlineController.openOwnedWorkspace(item.id, { localProjectId: associationForWorkspace(item.id) });
    onlineWorkspaceOpen = true;
    if (new URLSearchParams(location.search).has("view")) {
      const next = new URL(location.href);
      next.searchParams.delete("view");
      history.replaceState(history.state, "", next.pathname + next.search + next.hash);
    }
  } catch (error) { handleOnlineError(error); }
}
function applyPendingLocalOnline() {
  const pending = onlinePendingUpload;
  if (!pending || !onlineController.state().canEdit || !onlineController.state().canDelete) {
    showToast("Sign in as the creator and open the online map before applying this local copy.", "error");
    return;
  }
  const associated = projects.find((project) => project.id === pending.localProjectId);
  if (!associated) {
    showToast("The selected local map is no longer available. No online changes were made.", "error");
    return;
  }
  onlineGraphProject.graph = normalizeGraph(pending.graph, { allowEmpty: true });
  onlinePendingUpload = null;
  renderAll();
  onlineController.queueSave(onlineGraphProject.graph);
  persist(false);
}
async function checkLocalCloudReference(projectId, workspaceId, isCurrent = () => true) {
  const project = projects.find(item => item.id === projectId);
  if (!project) return { status: "unverified" };
  const uid = currentAccountUid();
  const current = () => projects.includes(project) && currentAccountUid() === uid && isCurrent();
  const result = await verifyCloudAssociation({
    associations: cloudAssociations, projectId, workspaceId, ownerUid: uid,
    getCurrentOwnerUid: currentAccountUid, isCurrent: current,
    listWorkspaces: async () => {
      const service = await accountSession.getService();
      if (!current()) return { status: "stale" };
      return service.listWorkspaces();
    },
    saveAssociations: saveCloudAssociations,
  });
  if (result.status === "missing") {
    mapAdmissionController.forget({ projectId, workspaceId, ownerUid: uid });
    if (currentMapAdmissionContext?.project === project) currentMapAdmissionContext = null;
    renderLibrary();
  }
  return result;
}
async function reloadOnlineWorkspace() {
  const state = onlineController.state();
  try {
    if (onlineRoute) {
      const id = onlineViewIdFromSearch(location.search);
      if (!id) throw new Error("This online link cannot be reloaded.");
      await onlineController.openSharedView(id);
    } else {
      const id = state.workspaceId || onlineTargetWorkspaceId;
      if (!id || !state.userUid) throw new Error("Sign in as the owner to reload this online workspace.");
      const localProjectId = onlineGraphProject?.localProjectId || associationForWorkspace(id);
      if (state.routeUnavailable && localProjectId) {
        const uid = currentAccountUid();
        const current = () => !onlineRoute && currentAccountUid() === uid
          && (onlineController.state().workspaceId || onlineTargetWorkspaceId) === id;
        const result = await checkLocalCloudReference(localProjectId, id, current);
        if (!current() || result.status === "stale") return;
        if (result.status === "missing") {
          if (returnToLocalWorkspace()) {
            selectProject(localProjectId);
            showToast("The previous cloud copy is no longer available. Your saved local map can be moved to Cloud Workspace again.");
          }
          return;
        }
      }
      await onlineController.openOwnedWorkspace(id, { localProjectId });
    }
  } catch (error) { handleOnlineError(error); }
}
function returnToLocalWorkspace() {
  if (!preserveDirtyOwnerDraftForNavigation()) return false;
  cloudLibraryFirstSelection.cancel();
  cloudLibraryRequest += 1;
  focusedType = ""; lockedType = ""; touchInteractionActive = false;
  onlineUiUnavailable = false;
  libraryMode = "local";
  cancelActiveGesture();
  hideGraphContextMenu();
  onlineRoute = false;
  onlineWorkspaceOpen = false;
  try {
    const next = new URL(location.href);
    next.searchParams.delete("view");
    history.replaceState(history.state, "", next.pathname + next.search + next.hash);
  } catch {}
  if (onlineController.state().inOnlineRoute) onlineController.closeWorkspace();
  onlineGraphProject = null;
  onlineWorkspace = null;
  onlineCurrentLink = "";
  onlineTargetWorkspaceId = "";
  selectedNodeId = null;
  selectedEdgeId = null;
  viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
  renderAll();
  fitGraph(true);
  return true;
}
function localRecoveryMode() {
  if (isOnlineSession()) {
    const state = onlineController.state();
    const staleViewerLoading = state.status === "loading" && Boolean(onlineGraphProject) && state.mode === "viewer";
    const label = onlineUiUnavailable || state.routeUnavailable ? "Online map unavailable"
      : staleViewerLoading ? "Checking access · read-only"
        : state.status === "loading" ? "Opening cloud map…"
        : state.status === "offline" ? (onlineGraphProject ? "Online view offline" : "Online map offline")
          : state.status === "saving" ? "Saving online"
            : state.status === "conflict" ? "Online conflict"
              : state.status === "delete-incomplete" ? "Online delete needs retry"
                : state.status === "signed-out" ? "Online sign-in required"
                  : onlineGraphProject && state.mode === "owner" && state.canEdit ? (state.dirty ? "Online save pending" : "Saved online")
                    : onlineGraphProject ? "Read-only online map" : "Online workspace unavailable";
    byId("save-status").textContent = label;
    const statusDot = byId("save-status").querySelector(".status-dot");
    if (statusDot) statusDot.style.background = onlineUiUnavailable || state.routeUnavailable ? "#c59a71" : "";
    updateLibraryStatusCopy();
    return;
  }
  byId("save-status").textContent = recoveryMode ? "Saved data needs attention" : "Saved locally";
  const statusDot = byId("save-status").querySelector(".status-dot");
  if (statusDot) statusDot.style.background = recoveryMode ? "#c59a71" : "";
  updateLibraryStatusCopy();
  byId("download-recovery").hidden = !recoveryText;
}
function cloudEditHistoryScope(ownerUid, workspaceId) {
  return ownerUid && workspaceId ? "cloud:" + JSON.stringify([String(ownerUid), String(workspaceId)]) : "";
}
function editHistoryScope(project = activeProject()) {
  if (!project) return "";
  return project.onlineWorkspaceId
    ? cloudEditHistoryScope(onlineWorkspace?.ownerId || onlineState.ownerUid, project.onlineWorkspaceId)
    : "local:" + project.id;
}
function updateEditHistoryControls() {
  const controls = byId("edit-history-controls");
  if (!controls) return;
  const project = activeProject();
  const available = Boolean(project && canMutateCurrent() && !onlineUiUnavailable);
  const state = editHistory.state(editHistoryScope(project));
  controls.hidden = currentWorkspaceActions().hideEditing || isSharedViewer({ sharedView: onlineRoute, state: onlineState });
  byId("undo-edit").disabled = !available || !state.canUndo;
  byId("redo-edit").disabled = !available || !state.canRedo;
}
function recordGraphEdit(project = activeProject()) {
  if (project) editHistory.record(editHistoryScope(project), project.graph);
  updateEditHistoryControls();
}
function performEditHistory(direction) {
  const project = activeProject();
  if (!project || !canMutateCurrent() || onlineUiUnavailable || dragState || document.querySelector("dialog[open]")) return false;
  const restored = editHistory[direction](editHistoryScope(project), project.graph);
  if (!restored) { updateEditHistoryControls(); return false; }
  hideGraphContextMenu();
  project.graph = restored;
  project.updatedAt = Date.now();
  if (!restored.nodes.some(node => node.id === selectedNodeId)) selectedNodeId = null;
  if (!restored.edges.some(edge => edge.id === selectedEdgeId)) selectedEdgeId = null;
  touchSelectedEdge = null;
  animateStructure = false;
  renderAll();
  persist();
  byId("action-announcement").textContent = direction === "undo" ? "Last edit undone." : "Last edit redone.";
  return true;
}
function persist(showFailure = true) {
  if (canMutateCurrent()) recordGraphEdit();
  if (isOnlineSession()) {
    if (!requireMutation("edit or save this map")) {
      byId("save-status").textContent = "Read-only online view";
      return false;
    }
    if (!onlineGraphProject || !onlineController.state().workspaceId) return false;
    persistOnlineOwnerDraft();
    const localProject = projects.find((project) => project.id === onlineGraphProject.localProjectId);
    if (localProject) {
      localProject.graph = onlineGraphProject.graph;
      localProject.updatedAt = Date.now();
      editHistory.sync(editHistoryScope(localProject), localProject.graph);
      const localResult = writeLibrary(projects, activeId);
      if (!localResult.ok) showToast(localResult.error, "error");
    }
    const queued = onlineController.queueSave(onlineGraphProject.graph);
    if (!queued) byId("save-status").textContent = "Online changes not saved";
    return queued;
  }
  if (recoveryMode) {
    byId("save-status").textContent = "Recovery mode";
    if (showFailure && !lastStorageError) {
      lastStorageError = "The saved library could not be read. Download its backup or deliberately clear local data before saving a replacement.";
      showToast(lastStorageError, "error");
    }
    return false;
  }
  const result = writeLibrary(projects, activeId);
  if (result.ok) {
    byId("save-status").textContent = "Saved locally";
    lastStorageError = "";
    return true;
  }
  byId("save-status").textContent = "Changes not saved";
  if (showFailure && result.error !== lastStorageError) showToast(result.error, "error");
  lastStorageError = result.error;
  return false;
}
function graphChanged({ structure = true, fit = false } = {}) {
  animateStructure = structure;
  renderAll();
  if (fit) fitGraph(true);
  persist();
}
function makeProject(graph, id = createProjectId(), extra = {}) {
  return { id, graph, updatedAt: Date.now(), ...extra };
}
function updateProjectHeader() {
  const project = activeProject();
  const details = project?.graph.project || (isOnlineSession() && onlineState.status === "loading" ? { name: onlineWorkspace?.name || "Cloud Workspace", type: onlineWorkspace?.projectType || "Software architecture", description: "" } : null);
  byId("breadcrumb-project").textContent = details?.name || "No project";
  byId("project-title").textContent = details?.name || "No project selected";
  byId("project-description").textContent = isOnlineSession() && onlineState.status === "loading" && !project ? "" : details?.description || "Import a map or create a project to start exploring.";
  byId("project-type").textContent = (details?.type || "SOFTWARE ARCHITECTURE").toUpperCase();
  byId("node-count").textContent = (project?.graph.nodes.length || 0) + " components";
  byId("graph-count-label").textContent = (project?.graph.nodes.length || 0) + " nodes / " + (project?.graph.edges.length || 0) + " edges";
  byId("status-summary").textContent = isOnlineSession() && onlineState.status === "loading" ? "Opening cloud map…" : project ? "Ready to explore" : "Create a project or import a map";
}
function typeColor() {
  return "var(--atlas-muted)";
}
function graphTypeAccent(type) {
  const token = String(type || "component").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "component";
  return `var(--graph-type-${token}, var(--graph-accent, ${typeColor(type)}))`;
}
function renderFilters() {
  const container = byId("type-filter-content");
  container.replaceChildren();
  const types = [...new Set(currentGraph().nodes.map((node) => node.type))].sort((a, b) => a.localeCompare(b));
  if (focusedType && !types.includes(focusedType)) focusedType = "";
  if (lockedType && !types.includes(lockedType)) lockedType = "";
  if (!types.length) { syncFilterSpotlight(); return; }
  const all = plain("button", "filter-chip" + (excludedTypes.size === 0 ? " active" : ""), "All");
  all.type = "button";
  all.setAttribute("aria-pressed", String(excludedTypes.size === 0));
  all.addEventListener("click", (event) => {
    const pointerDownType = filterPointerActivation?.type === "all" ? filterPointerActivation.pointerType : "";
    filterPointerActivation = null;
    const touchActivation = isTouchClick(event, pointerDownType);
    filterInputModality = touchActivation ? "touch" : (event.pointerType || filterInputModality);
    applyTypeInteraction({
      kind: "activate-all",
      pointerType: event.pointerType || "",
      pointerDownType,
      detail: event.detail,
    });
    byId("type-filter-status").textContent = "All component types are visible and no type highlight is active.";
    renderFilters();
    renderGraph();
  });
  container.append(all);
  for (const type of types) {
    const chip = plain("button", "filter-chip" + (excludedTypes.has(type) ? "" : " active"));
    chip.type = "button";
    chip.dataset.type = type;
    chip.setAttribute("aria-pressed", String(!excludedTypes.has(type)));
    const dot = plain("span", "type-dot");
    dot.style.background = graphTypeAccent(type);
    chip.append(dot, plain("span", "", type), plain("span", "chip-count", String(currentGraph().nodes.filter((node) => node.type === type).length)));
    chip.addEventListener("click", (event) => {
      const pointerDownType = filterPointerActivation?.type === type ? filterPointerActivation.pointerType : "";
      filterPointerActivation = null;
      const action = {
        kind: "activate-type",
        type,
        pointerType: event.pointerType || "",
        pointerDownType,
        detail: event.detail,
      };
      const touchActivation = isTouchClick(action, pointerDownType);
      filterInputModality = touchActivation ? "touch" : (event.pointerType || filterInputModality);
      const wasHidden = excludedTypes.has(type);
      applyTypeInteraction(action);
      if (touchActivation) {
        byId("type-filter-status").textContent = focusedType
          ? "Highlighting " + focusedType + " components. Tap the same type again or choose All to clear."
          : "Component type highlight cleared.";
        return;
      }
      byId("type-filter-status").textContent = excludedTypes.has(type)
        ? type + " components hidden. Click again to restore them."
        : lockedType === type ? type + " highlight locked. Click again to hide this category."
          : type + " components restored. Click again to lock the highlight.";
      if (wasHidden !== excludedTypes.has(type)) {
        renderFilters();
        renderGraph();
      }
    });
    container.append(chip);
  }
  syncFilterSpotlight();
}
function syncFilterSpotlight() {
  const container = byId("type-filters");
  container.classList.toggle("has-spotlight", Boolean(focusedType));
  for (const chip of container.querySelectorAll(".filter-chip[data-type]")) {
    const current = chip.dataset.type === focusedType;
    chip.classList.toggle("spotlight-active", current);
    chip.setAttribute("aria-current", current ? "true" : "false");
    chip.setAttribute("aria-pressed", String(!excludedTypes.has(chip.dataset.type)));
    chip.classList.toggle("active", !excludedTypes.has(chip.dataset.type));
    chip.dataset.highlightLocked = String(lockedType === chip.dataset.type);
    chip.title = excludedTypes.has(chip.dataset.type) ? "Click to restore this category"
      : lockedType === chip.dataset.type ? "Highlight locked. Click to hide this category" : "Click to lock this highlight";
  }
}
function applyTypeInteraction(action) {
  const previousFocus = focusedType;
  const previousLock = lockedType;
  const next = transitionTypeInteractions({ focusedType, lockedType, excludedTypes, touchInteractionActive }, action);
  focusedType = next.focusedType;
  lockedType = next.lockedType;
  excludedTypes = next.excludedTypes;
  touchInteractionActive = next.touchInteractionActive;
  if (focusedType !== previousFocus || lockedType !== previousLock) {
    syncFilterSpotlight();
    refreshTraceStyles();
  }
  return next;
}
function refreshTraceStyles() {
  const graph = currentGraph();
  const trace = traceRoutes(graph, selectedNodeId);
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const matches = new Set(graph.nodes.filter((node) => !searchTerm || nodeSearchText(node).includes(searchTerm)).map((node) => node.id));
  for (const card of byId("nodes-layer").querySelectorAll(".node-card")) {
    const nodeId = card.getAttribute("data-node-id");
    const selected = nodeId === selectedNodeId;
    const matched = matches.has(nodeId);
    const focusDimmed = Boolean(focusedType && nodeById.get(nodeId)?.type !== focusedType);
    card.classList.toggle("selected", selected);
    card.classList.toggle("search-hit", Boolean(searchTerm && matched));
    card.classList.toggle("dimmed", Boolean((searchTerm && !matched) || (selectedNodeId && !trace.nodes.has(nodeId))));
    card.classList.toggle("focus-dimmed", focusDimmed);
  }
  for (const card of byId("timeline-view").querySelectorAll(".timeline-node-card")) {
    card.classList.toggle("focus-dimmed", Boolean(focusedType && card.dataset.nodeType !== focusedType));
  }
  for (const group of byId("edges-layer").querySelectorAll(".edge-group")) {
    const edgeIndex = Number(group.getAttribute("data-edge-index"));
    const edge = graph.edges[edgeIndex];
    const connected = Boolean(selectedNodeId && trace.edges.has(edgeIndex));
    const focused = !focusedType || nodeById.get(edge?.source)?.type === focusedType || nodeById.get(edge?.target)?.type === focusedType;
    group.classList.toggle("dimmed", Boolean(selectedNodeId && !connected));
    group.classList.toggle("focus-dimmed", Boolean(focusedType && !focused));
    group.classList.toggle("selected", group.dataset.edgeId === selectedEdgeId);
    group.setAttribute("aria-pressed", String(group.dataset.edgeId === selectedEdgeId));
    setEdgeTraceState(group, group.querySelector(".edge-path"), group.querySelector(".edge-arrow"), connected);
  }
}
function setViewportTransform() {
  byId("viewport").setAttribute("transform", "translate(" + transform.x + " " + transform.y + ") scale(" + transform.scale + ")");
  const percent = transform.scale * 100;
  byId("zoom-label").textContent = percent < 1 ? percent.toFixed(1) + "%" : Math.round(percent) + "%";
}
function stopFitAnimation() {
  fitAnimationSequence += 1;
  if (fitAnimationFrame) cancelAnimationFrame(fitAnimationFrame);
  fitAnimationFrame = 0;
}
function fitGraph(animate = true) {
  stopFitAnimation();
  const sequence = fitAnimationSequence;
  const graph = currentGraph();
  const layout = layoutGraph(graph);
  const positions = layout.positions;
  const bounds = graphBounds(graph, positions, layout.dimensions);
  const rect = byId("graph-stage").getBoundingClientRect();
  if (!graph.nodes.length || rect.width < 1 || rect.height < 1) {
    transform = { x: rect.width / 2, y: rect.height / 2, scale: 1 };
    setViewportTransform();
    return;
  }
  const scale = fitScaleForBounds(bounds, rect);
  const target = {
    x: (rect.width - bounds.width * scale) / 2 - bounds.x * scale,
    y: (rect.height - bounds.height * scale) / 2 - bounds.y * scale,
    scale,
  };
  if (!animate || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    transform = target;
    setViewportTransform();
    return;
  }
  const start = { ...transform };
  const began = performance.now();
  const duration = 240;
  const step = (now) => {
    if (sequence !== fitAnimationSequence) return;
    const progress = clamp((now - began) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    transform = {
      x: start.x + (target.x - start.x) * eased,
      y: start.y + (target.y - start.y) * eased,
      scale: start.scale + (target.scale - start.scale) * eased,
    };
    setViewportTransform();
    if (progress < 1) fitAnimationFrame = requestAnimationFrame(step);
    else fitAnimationFrame = 0;
  };
  fitAnimationFrame = requestAnimationFrame(step);
}
function zoomAt(nextScale, clientX, clientY) {
  stopFitAnimation();
  const rect = byId("graph-stage").getBoundingClientRect();
  const px = clientX ?? rect.width / 2;
  const py = clientY ?? rect.height / 2;
  const scale = clamp(nextScale, .001, 2.5);
  transform.x = px - (px - transform.x) * (scale / transform.scale);
  transform.y = py - (py - transform.y) * (scale / transform.scale);
  transform.scale = scale;
  setViewportTransform();
}
function cardText(group, value, x, y, className, max) {
  const text = svgElement("text", { x, y, class: className });
  text.textContent = truncate(value, max);
  group.append(text);
}
function renderGraph() {
  const svgTimeline = byId("graph");
  svgTimeline.classList.toggle("read-only-online", isOnlineSession() && !canMutateCurrent());
  const resumeSvgTimeline = viewMode === "graph" && !motionPaused && !document.hidden;
  try { svgTimeline.pauseAnimations(); svgTimeline.setCurrentTime(0); } catch {}
  const graph = currentGraph();
  const layout = layoutGraph(graph);
  const positions = layout.positions;
  const dimensions = layout.dimensions;
  const edgeLayer = byId("edges-layer");
  const nodeLayer = byId("nodes-layer");
  edgeLayer.replaceChildren();
  nodeLayer.replaceChildren();
  const nodeCards = new Map();
  const viewport = byId("viewport");
  const previousDefinitions = viewport.querySelector("defs");
  if (previousDefinitions) previousDefinitions.remove();
  const definitions = svgElement("defs");
  viewport.insertBefore(definitions, edgeLayer);
  const hasProject = Boolean(activeProject());
  const isEmpty = graph.nodes.length === 0;
  byId("empty-state").hidden = (isOnlineSession() && !hasProject) || !isEmpty;
  byId("empty-state-title").textContent = hasProject ? "Your map starts here" : "Start with an empty workspace";
  byId("empty-state-copy").textContent = hasProject
    ? "Add a component to build this architecture, or import an agent-generated map."
    : "Add a project, import an agent-generated map, or copy the agent prompt from the page header.";
  byId("empty-state-create").textContent = hasProject ? "Add component" : "Add project";
  byId("node-count").textContent = isOnlineSession() && onlineState.status === "loading" && !hasProject ? "Opening map…" : graph.nodes.length + (graph.nodes.length === 1 ? " component" : " components");
  byId("graph-count-label").textContent = graph.nodes.length + " nodes / " + graph.edges.length + " edges";
  const trace = traceRoutes(graph, selectedNodeId);
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const visible = new Set(graph.nodes.filter((node) => !excludedTypes.has(node.type)).map((node) => node.id));
  const matches = new Set(graph.nodes.filter((node) => !searchTerm || nodeSearchText(node).includes(searchTerm)).map((node) => node.id));
  const animationAllowed = viewMode === "graph"
    && graphMotionAllowed(graph)
    && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const routingLanes = edgeRoutingLanes(graph.edges);
  for (const node of graph.nodes) {
    const position = positions.get(node.id);
    const size = dimensions.get(node.id);
    const group = svgElement("g", { class: "node-card", "data-node-id": node.id, "data-node-type": node.type, transform: "translate(" + position.x + " " + position.y + ")", tabindex: 0, role: "button", "aria-label": node.junction ? "Branch junction, " + node.label : node.label + ", " + node.type });
    const accent = graphTypeAccent(node.type);
    group.style.setProperty("--node-accent", accent);
    if (node.id === selectedNodeId) group.classList.add("selected");
    if (!visible.has(node.id)) group.classList.add("filtered");
    if (searchTerm && !matches.has(node.id)) group.classList.add("dimmed");
    if (selectedNodeId && !trace.nodes.has(node.id)) group.classList.add("dimmed");
    if (focusedType && node.type !== focusedType) group.classList.add("focus-dimmed");
    if (matches.has(node.id) && searchTerm) group.classList.add("search-hit");
    if (animateStructure && animationAllowed) group.classList.add("entering");
    if (node.junction) {
      group.append(svgElement("circle", { class: "card-bg junction-bg", cx: size.width / 2, cy: size.height / 2, r: 14 }));
      const inputPort = svgElement("circle", { class: "card-port port-input", cx: 1, cy: size.height / 2, r: 5, "data-node-id": node.id, "aria-hidden": "true", tabindex: -1 });
      const outputPort = svgElement("circle", { class: "card-port port-output", cx: size.width - 1, cy: size.height / 2, r: 5, "data-node-id": node.id, "aria-hidden": "true", tabindex: -1 });
      outputPort.addEventListener("pointerdown", (event) => startPortDrag(event, node.id));
      group.append(inputPort, outputPort);
      group.append(svgElement("circle", { class: "junction-core", cx: size.width / 2, cy: size.height / 2, r: 3 }));
      const junctionTitle = svgElement("title");
      junctionTitle.textContent = "Branch junction: " + node.label;
      group.append(junctionTitle);
    } else {
      const bg = svgElement("rect", { class: "card-bg", width: size.width, height: size.height, rx: 18 });
      group.append(bg);
      const inputPort = svgElement("circle", { class: "card-port port-input", cx: 1, cy: size.height / 2, r: 5, "data-node-id": node.id, "aria-hidden": "true", tabindex: -1 });
      const outputPort = svgElement("circle", { class: "card-port port-output", cx: size.width - 1, cy: size.height / 2, r: 5, "data-node-id": node.id, "aria-hidden": "true", tabindex: -1 });
      outputPort.addEventListener("pointerdown", (event) => startPortDrag(event, node.id));
      inputPort.addEventListener("pointerenter", () => { if (dragState?.kind === "connection") updatePortPreview(dragState.lastEvent); });
      group.append(inputPort, outputPort);
      cardText(group, node.type.toUpperCase(), 14, 21, "card-type", 24);
      group.append(svgElement("circle", { class: "card-icon-bg", cx: size.width - 16, cy: 15, r: 7 }));
      group.append(svgElement("path", { class: "card-icon-glyph", d: "M 186 12.5 L 190 15 L 186 17.5 M 186.5 12.5 L 184.5 12.5 M 186.5 17.5 L 184.5 17.5" }));
      group.append(svgElement("circle", { class: "card-icon-node", cx: 184, cy: 12.5, r: 1.2 }));
      group.append(svgElement("circle", { class: "card-icon-node", cx: 191, cy: 15, r: 1.2 }));
      group.append(svgElement("circle", { class: "card-icon-node", cx: 184, cy: 17.5, r: 1.2 }));
      cardText(group, node.label, 14, 45, "card-title", 25);
      cardText(group, node.description || node.source || "No description provided", 14, 66, "card-desc", 34);
      if (node.chart) {
        const chartTitle = svgElement("text", { class: "card-chart-title", x: 14, y: 80 });
        chartTitle.textContent = truncate(node.chart.label, 28);
        group.append(chartTitle);
        const presentation = chartPresentation(node.chart);
        const chartLabel = chartDescription(node.chart);
        const plot = chartGeometry(node.chart.values, { width: size.width - 30, height: 43, padding: 4, kind: presentation.kind });
        const chart = svgElement("svg", { class: "card-chart-svg", x: 14, y: 84, width: size.width - 30, height: 43, viewBox: "0 0 " + plot.width + " " + plot.height, role: "img", "aria-label": chartLabel });
        const chartTitleNode = svgElement("title");
        chartTitleNode.textContent = chartLabel;
        chart.append(chartTitleNode);
        chart.append(svgElement("path", { class: "card-chart-baseline", d: "M 0 " + plot.baselineY + " H " + plot.width }));
        if (presentation.kind === "bar") {
          for (const bar of plot.bars) {
            const rectangle = svgElement("rect", { class: "card-chart-bar", x: bar.x, y: bar.y, width: bar.width, height: bar.height, rx: 1.5 });
            const barTitle = svgElement("title");
            barTitle.textContent = chartValueLabel(node.chart, bar.index);
            rectangle.append(barTitle);
            chart.append(rectangle);
          }
        } else {
          if (presentation.kind === "area") chart.append(svgElement("path", { class: "card-chart-area", d: plot.areaPath }));
          chart.append(svgElement("path", { class: "card-chart-line", d: plot.linePath }));
          for (const point of plot.points) {
            const marker = svgElement("circle", { class: "card-chart-marker", cx: point.x, cy: point.y, r: 2.4, tabindex: 0, "aria-label": chartValueLabel(node.chart, point.index) });
            const markerTitle = svgElement("title");
            markerTitle.textContent = chartValueLabel(node.chart, point.index);
            marker.append(markerTitle);
            chart.append(marker);
          }
        }
        group.append(chart);
        const showCategoryStrip = node.chart.categories?.length === node.chart.values.length && node.chart.values.length <= 5;
        if (showCategoryStrip) {
          const slotWidth = plot.width / node.chart.values.length;
          node.chart.categories.forEach((category, categoryIndex) => {
            const categoryText = svgElement("text", { class: "card-chart-category", x: 14 + (categoryIndex + .5) * slotWidth, y: 139, "text-anchor": "middle" });
            categoryText.textContent = chartCompactReadout(node.chart, categoryIndex, slotWidth);
            const categoryTitle = svgElement("title");
            categoryTitle.textContent = chartValueLabel(node.chart, categoryIndex);
            categoryText.append(categoryTitle);
            group.append(categoryText);
          });
        }
        const contextY = showCategoryStrip ? 154 : 136;
        const evidenceY = showCategoryStrip ? 169 : 148;
        const context = svgElement("text", { class: "card-chart-context", x: 14, y: contextY });
        context.textContent = truncate(presentation.context, 31);
        const contextTitle = svgElement("title");
        contextTitle.textContent = presentation.context;
        context.append(contextTitle);
        group.append(context);
        const evidence = svgElement("text", { class: "card-chart-evidence", x: 14, y: evidenceY });
        evidence.textContent = truncate("Evidence: " + node.chart.evidence, 36);
        const evidenceTitle = svgElement("title");
        evidenceTitle.textContent = node.chart.evidence;
        evidence.append(evidenceTitle);
        group.append(evidence);
        if (node.source) cardText(group, node.source, 14, showCategoryStrip ? 187 : 167, "card-source", 31);
      } else {
        cardText(group, node.source, 14, 90, "card-source", 31);
      }
    }
    if (node.type.toLowerCase() === "agent" && animationAllowed) {
      const agentBeam = svgElement("rect", { class: "agent-beam", x: 1, y: 1, width: size.width - 2, height: size.height - 2, rx: 18, fill: "none", stroke: accent, "stroke-width": 1.2, "stroke-dasharray": "22 78", "pathLength": 100, opacity: animationAllowed ? 0 : .18, "pointer-events": "none" });
      agentBeam.style.stroke = accent;
      if (animationAllowed) {
        const beamDelay = (.7 + Math.random() * 4).toFixed(2) + "s";
        agentBeam.append(
          svgElement("animate", { attributeName: "opacity", from: 0, to: .2, dur: "0.5s", begin: beamDelay, fill: "freeze" }),
          svgElement("animate", { attributeName: "stroke-dashoffset", from: 0, to: -100, dur: "6s", begin: beamDelay, repeatCount: "indefinite" }),
        );
      }
      group.append(agentBeam);
    }    group.addEventListener("click", () => {
      selectedEdgeId = null;
      touchSelectedEdge = null;
      hideGraphContextMenu();
      selectedNodeId = selectedNodeId === node.id ? null : node.id;
      renderInspector();
      refreshTraceStyles();
    });
    group.addEventListener("animationend", (event) => {
      if (event.animationName === "atlas-card-in") group.classList.remove("entering");
    });
    group.addEventListener("dblclick", (event) => { event.stopPropagation(); openNodeEditor(node.id); });
    group.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showNodeContextMenu(node.id, event.clientX, event.clientY, group);
    });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        touchSelectedEdge = null;
        selectedNodeId = selectedNodeId === node.id ? null : node.id;
        renderInspector();
        refreshTraceStyles();
      } else if (event.key === "F2") openNodeEditor(node.id);
      else if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
        event.preventDefault();
        const rect = group.getBoundingClientRect();
        showNodeContextMenu(node.id, rect.left + rect.width / 2, rect.top + rect.height / 2, group);
      }
    });
    group.addEventListener("pointerdown", (event) => beginNodeDrag(event, node.id));
    nodeLayer.append(group);
    nodeCards.set(node.id, group);
  }
  const drawMotion = animateStructure && animationAllowed;
  const minX = graph.nodes.length ? Math.min(...[...positions.values()].map((point) => point.x)) : 0;
  const maxX = graph.nodes.length ? Math.max(...[...positions.values()].map((point) => point.x)) : 1;
  graph.edges.forEach((edge, index) => {
    const geometry = edgeGeometry(edge, index, positions, dimensions, routingLanes.get(index));
    if (!geometry) return;
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    const sourceAccent = graphTypeAccent(sourceNode?.type || "component");
    const fullLabel = geometry.fullLabel || geometry.label;
    const hasLabel = Boolean(String(edge.label || edge.type || "").trim());
    const group = svgElement("g", { class: "edge-group", "data-edge-index": index, "data-edge-id": edge.id, "data-source-type": sourceNode?.type || "component", tabindex: 0, role: "button", "aria-pressed": String(selectedEdgeId === edge.id), "aria-label": (sourceNode?.label || edge.source) + " to " + (targetNode?.label || edge.target) + (hasLabel ? ": " + fullLabel : ", unlabeled connection") });
    if (selectedEdgeId === edge.id) group.classList.add("selected");
    if (!visible.has(edge.source) || !visible.has(edge.target)) group.classList.add("filtered");
    if (selectedNodeId && !trace.edges.has(index)) group.classList.add("dimmed");
    const focused = !focusedType || sourceNode?.type === focusedType || targetNode?.type === focusedType;
    if (focusedType && !focused) group.classList.add("focus-dimmed");
    const connected = Boolean(selectedNodeId && trace.edges.has(index));
    if (connected) group.classList.add("trace-label");
    const path = svgElement("path", { class: "edge-path", d: geometry.path });
    if (connected) path.classList.add("connected");
    const arrow = svgElement("path", { class: "edge-arrow", d: geometry.arrowPath });
    if (connected) arrow.classList.add("connected");
    const explicitLabel = Boolean(String(edge.label || "").trim());
    const hasTypeLabel = !explicitLabel && Boolean(edge.type);
    const labelBg = hasLabel ? svgElement("rect", { class: "edge-label-bg" + (hasTypeLabel ? " type-only-label" : ""), x: geometry.labelX - geometry.labelWidth / 2, y: geometry.labelY - 10, width: geometry.labelWidth, height: 17, rx: 8 }) : null;
    const label = hasLabel ? svgElement("text", { class: "edge-label" + (hasTypeLabel ? " type-only-label" : ""), x: geometry.labelX, y: geometry.labelY + 2 }) : null;
    if (label) label.textContent = geometry.label;
    const relationTitle = svgElement("title");
    relationTitle.textContent = hasLabel ? fullLabel : "Unlabeled connection from " + (sourceNode?.label || edge.source) + " to " + (targetNode?.label || edge.target);
    const hitTarget = svgElement("path", { class: "edge-hit-target", d: geometry.path });
    group.append(relationTitle, hitTarget, path, arrow);
    if (labelBg && label) group.append(labelBg, label);
    path.addEventListener("animationend", (event) => {
      if (event.animationName === "atlas-edge-draw") clearEdgeEntranceState({ path });
    });
    arrow.addEventListener("animationend", (event) => {
      if (event.animationName === "atlas-arrow-in") clearEdgeEntranceState({ arrow });
    });
    group.addEventListener("animationend", (event) => {
      if (event.animationName === "atlas-label-in") clearEdgeEntranceState({ group });
    });
    let edgePointerActivation = null;
    group.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      edgePointerActivation = { pointerId: event.pointerId, pointerType: event.pointerType };
    });
    group.addEventListener("pointercancel", (event) => {
      if (edgePointerActivation?.pointerId === event.pointerId) edgePointerActivation = null;
    });
    group.addEventListener("click", (event) => {
      const pointerDownType = edgePointerActivation?.pointerType || "";
      edgePointerActivation = null;
      const touchActivation = isTouchClick(event, pointerDownType);
      selectedNodeId = null;
      selectedEdgeId = selectedEdgeId === edge.id ? null : edge.id;
      touchSelectedEdge = selectedEdgeId === edge.id && touchActivation ? { id: edge.id, projectId: activeId, graphRef: activeProject()?.graph } : null;
      renderInspector();
      refreshEdgeSelection();
    });
    group.addEventListener("dblclick", (event) => { event.stopPropagation(); openEdgeEditor(edge.id); });
    group.addEventListener("contextmenu", (event) => { event.preventDefault(); event.stopPropagation(); showEdgeContextMenu(edge.id, event.clientX, event.clientY); });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectedNodeId = null; selectedEdgeId = selectedEdgeId === edge.id ? null : edge.id; touchSelectedEdge = null; renderInspector(); refreshEdgeSelection(); }
      else if (event.key === "F2") openEdgeEditor(edge.id);
      else if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) { event.preventDefault(); showEdgeContextMenu(edge.id, event.clientX || null, event.clientY || null); }
    });
    edgeLayer.append(group);
    const sourceX = positions.get(edge.source).x;
    const delay = maxX === minX ? 0 : clamp((sourceX - minX) / Math.max(1, maxX - minX) * 1.3, 0, 1.3);
    if (drawMotion && !connected) {
      group.style.setProperty("--draw-delay", delay.toFixed(2) + "s");
      if (hasLabel && !hasTypeLabel) group.classList.add("label-delayed");
      try {
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
        path.classList.add("draw-in");
        arrow.classList.add("show-after");
      } catch {}
    }
    if (animationAllowed && visible.has(edge.source) && visible.has(edge.target)) {
      let pathLength = 0;
      try {
        pathLength = path.getTotalLength();
      } catch {
        pathLength = geometry.points.slice(1).reduce((sum, point, pointIndex) => {
          const previous = geometry.points[pointIndex];
          return sum + Math.hypot(point.x - previous.x, point.y - previous.y);
        }, 0);
      }
      const travelDuration = clamp(pathLength / 250, 1.6, 5);
      const cycleDuration = travelDuration + 30 + Math.random() * 25;
      const travelFraction = travelDuration / cycleDuration;
      const fadeOutFraction = Math.min(.999, travelFraction + .25 / cycleDuration);
      const begin = delay + .7 + (index % 5) * .18;
      const gradientId = "edge-beam-gradient-" + index;
      const gradient = svgElement("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "0%" });
      gradient.append(
        svgElement("stop", { offset: "0%", "stop-color": sourceAccent, "stop-opacity": 0 }),
        svgElement("stop", { offset: "100%", "stop-color": sourceAccent, "stop-opacity": .95 }),
      );
      definitions.append(gradient);
      const beam = svgElement("rect", { class: "edge-beam", x: -10, y: -1.5, width: 20, height: 3, rx: 1.5, opacity: 0 });
      beam.style.fill = "url(#" + gradientId + ")";
      const animate = svgElement("animateMotion", {
        dur: cycleDuration.toFixed(2) + "s", begin: begin.toFixed(2) + "s", repeatCount: "indefinite", path: geometry.path, rotate: "auto",
        keyPoints: "0;1;1", keyTimes: "0;" + travelFraction.toFixed(5) + ";1", keySplines: "0.42 0 0.58 1;0 0 1 1", calcMode: "spline",
      });
      const opacity = svgElement("animate", {
        attributeName: "opacity", values: "0;1;1;0;0",
        keyTimes: "0;" + (.25 / cycleDuration).toFixed(5) + ";" + travelFraction.toFixed(5) + ";" + fadeOutFraction.toFixed(5) + ";1",
        dur: cycleDuration.toFixed(2) + "s", begin: begin.toFixed(2) + "s", repeatCount: "indefinite",
      });
      beam.append(animate, opacity);
      group.insertBefore(beam, labelBg);
      const targetCard = nodeCards.get(edge.target);
      if (targetCard) {
        const targetSize = dimensions.get(edge.target);
        const arrival = targetNode?.junction
          ? svgElement("circle", { class: "card-arrival junction-arrival", cx: targetSize.width / 2, cy: targetSize.height / 2, r: 16, fill: "none", stroke: sourceAccent, "stroke-width": 1.5, opacity: 0, "pointer-events": "none" })
          : svgElement("rect", { class: "card-arrival", x: 1, y: 1, width: targetSize.width - 2, height: targetSize.height - 2, rx: 18, fill: "none", stroke: sourceAccent, "stroke-width": 1.5, opacity: 0, "pointer-events": "none" });
        arrival.append(svgElement("animate", {
          attributeName: "opacity", values: "0;0.55;0.55;0;0",
          keyTimes: "0;0.001;" + (.6 / cycleDuration).toFixed(5) + ";" + (1.1 / cycleDuration).toFixed(5) + ";1",
          dur: cycleDuration.toFixed(2) + "s", begin: (begin + travelDuration).toFixed(2) + "s", repeatCount: "indefinite",
        }));
        targetCard.append(arrival);
      }
    }
  });
  animateStructure = false;
  setViewportTransform();
  if (resumeSvgTimeline) { try { svgTimeline.unpauseAnimations(); } catch {} }
  if (viewMode === "timeline") renderTimelineView();
}
function inspectorEdgeContext(edge) {
  const project = activeProject();
  if (!project) return null;
  const positions = layoutGraph(project.graph).positions;
  const source = positions.get(edge.source) || { x: 0, y: 0 };
  const target = positions.get(edge.target) || source;
  return {
    projectId: project.id,
    graphRef: project.graph,
    edgeId: edge.id,
    edgeSnapshot: { ...edge },
    position: { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 },
  };
}
function renderTouchEdgeInspector(edge, container) {
  const graph = currentGraph();
  const source = graph.nodes.find((node) => node.id === edge.source);
  const target = graph.nodes.find((node) => node.id === edge.target);
  const type = plain("span", "detail-type");
  const dot = plain("span", "type-dot");
  dot.style.background = typeColor(edge.type || "Connection");
  type.append(dot, document.createTextNode(edge.type || "Connection"));
  const body = plain("div", "inspector-body");
  body.append(type, plain("h3", "detail-title", edge.label || edge.type || "Unlabeled connection"));
  body.append(plain("p", "detail-description", "From " + (source?.label || edge.source) + " to " + (target?.label || edge.target)));
  if (edge.type && edge.label) body.append(plain("p", "detail-description", "Kind: " + edge.type));

  const actions = plain("div", "inspector-actions edge-inspector-actions");
  actions.hidden = !canMutateCurrent();
  actions.setAttribute("role", "group");
  actions.setAttribute("aria-label", "Connection actions");
  const context = inspectorEdgeContext(edge);
  const makeAction = (label, ariaLabel, title, activate, className = "") => {
    const button = plain("button", className, label);
    button.type = "button";
    button.setAttribute("aria-label", ariaLabel);
    button.title = title;
    button.addEventListener("click", (event) => activate(event.currentTarget));
    actions.append(button);
  };
  makeAction("Edit", "Edit connection", "Edit connection", (returnFocus) => openEdgeEditor(edge.id, null, { returnFocus }));
  makeAction("Source", "Reconnect source component", "Reconnect source", (returnFocus) => openEdgeEditor(edge.id, null, { focusField: "edge-source", returnFocus }));
  makeAction("Target", "Reconnect target component", "Reconnect target", (returnFocus) => openEdgeEditor(edge.id, null, { focusField: "edge-target", returnFocus }));
  makeAction("Branch", "Branch from connection", "Branch from connection", (returnFocus) => openBranchEditor(context, { returnFocus }));
  const remove = plain("button", "delete-action");
  remove.append(uiIcon("trash"));
  remove.type = "button";
  remove.setAttribute("aria-label", "Delete connection");
  remove.title = "Delete connection";
  remove.addEventListener("click", (event) => confirmDeleteEdgeSnapshot(context, event.currentTarget));
  actions.append(remove);
  body.append(actions);
  container.append(body);
}
function renderInspector() {
  const container = byId("inspector-content");
  container.replaceChildren();
  const graph = currentGraph();
  const node = graph.nodes.find((item) => item.id === selectedNodeId);
  byId("add-edge").disabled = graph.nodes.length < 1 || !canMutateCurrent();
  if (!node && isCurrentTouchEdgeSelection(touchSelectedEdge, selectedEdgeId, activeId, activeProject()?.graph)) {
    const edge = graph.edges.find((item) => item.id === selectedEdgeId);
    if (edge) {
      renderTouchEdgeInspector(edge, container);
      return;
    }
  }
  if (!node) {
    const empty = plain("div", "inspector-empty");
    const emptyIcon = plain("span", "inspector-empty-icon");
    emptyIcon.append(uiIcon(selectedEdgeId ? "connection" : "component"));
    empty.append(emptyIcon, plain("strong", "", selectedEdgeId ? "Connection selected" : "Select a component"));
    empty.append(plain("p", "", selectedEdgeId ? "Right-click the highlighted line for edit, reconnect, delete, or branch actions. Press F2 to edit its relationship." : "Choose a card on the map to trace its connections and see its details."));
    container.append(empty);
    return;
  }
  const body = plain("div", "inspector-body");
  const type = plain("span", "detail-type");
  const dot = plain("span", "type-dot");
  dot.style.background = typeColor(node.type);
  type.append(dot, document.createTextNode(node.type));
  body.append(type, plain("h3", "detail-title", node.label));
  if (node.description) body.append(plain("p", "detail-description", node.description));
  const details = node.details || {};
  for (const [title, value] of [["Purpose", details.purpose], ["How it works", details.operation]]) {
    if (!value) continue;
    const detailSection = plain("section", "detail-section node-detail-section");
    detailSection.append(plain("h3", "", title), plain("p", "detail-description", value));
    body.append(detailSection);
  }
  for (const [title, values] of [["Inputs", details.inputs], ["Outputs", details.outputs], ["Dependencies", details.dependencies], ["Repository evidence", details.evidence], ["Uncertainty", details.uncertainty]]) {
    if (!values?.length) continue;
    const detailSection = plain("section", "detail-section node-detail-section");
    detailSection.append(plain("h3", "", title));
    const list = plain("ul", "detail-list");
    for (const value of values) list.append(plain("li", "", value));
    detailSection.append(list);
    body.append(detailSection);
  }
  if (node.chart) body.append(createChartFigure(node.chart));
  if (node.source) {
    const section = plain("section", "detail-section");
    section.append(plain("h3", "", "Source"));
    section.append(plain("code", "source-pill", node.source));
    body.append(section);
  }
  if (node.group) {
    const section = plain("section", "detail-section");
    section.append(plain("h3", "", "Subsystem"));
    section.append(plain("p", "detail-description", node.group));
    body.append(section);
  }
  const relations = graph.edges.filter((edge) => edge.source === node.id || edge.target === node.id);
  const section = plain("section", "detail-section");
  section.append(plain("h3", "", "Connections (" + relations.length + ")"));
  if (!relations.length) section.append(plain("p", "detail-description", "No connections in this map yet."));
  const connectionList = plain("div", "connection-list");
  for (const edge of relations) {
    const isOutgoing = edge.source === node.id;
    const otherId = isOutgoing ? edge.target : edge.source;
    const other = graph.nodes.find((item) => item.id === otherId);
    const row = plain("article", "connection-item");
    const head = plain("div", "connection-item-head");
    head.append(plain("span", "connection-arrow", isOutgoing ? "Outgoing" : "Incoming"));
    const name = plain("button", "connection-name", other?.label || otherId);
    name.type = "button";
    name.addEventListener("click", () => { selectedNodeId = otherId; renderInspector(); renderGraph(); });
    head.append(name);
    const relationText = edge.label || edge.type || "Relationship not labeled";
    const relation = plain(canMutateCurrent() ? "button" : "span", "connection-label", relationText);
    if (canMutateCurrent()) {
      relation.type = "button";
      relation.setAttribute("aria-label", "Edit " + (isOutgoing ? "outgoing" : "incoming") + " relationship to " + (other?.label || otherId) + ": " + relationText);
      relation.addEventListener("click", () => openEdgeEditor(edge.id));
    }
    row.append(head, relation);
    if (edge.type && edge.label) row.append(plain("span", "connection-kind", edge.type));
    connectionList.append(row);
  }
  section.append(connectionList);
  body.append(section);
  const actions = plain("div", "inspector-actions");
  actions.hidden = !canMutateCurrent();
  const edit = plain("button", "", "Edit");
  edit.type = "button";
  edit.addEventListener("click", () => openNodeEditor(node.id));
  const connect = plain("button", "", "Connect");
  connect.type = "button";
  connect.addEventListener("click", () => openEdgeEditor(null, node.id));
  const remove = plain("button", "delete-action");
  remove.append(uiIcon("trash"));
  remove.type = "button";
  remove.setAttribute("aria-label", "Delete component");
  remove.addEventListener("click", () => confirmNodeDelete(node.id));
  actions.append(edit, connect, remove);
  body.append(actions);
  container.append(body);
}
function renderTimelineView() {
  const host = byId("timeline-view");
  if (!host) return;
  const oldScroller = host.querySelector(".timeline-scroller");
  const oldOverview = host.querySelector(".timeline-overview");
  const activeElement = document.activeElement;
  const hadTimelineFocus = host.contains(activeElement);
  const focusNodeId = activeElement?.dataset.focusNodeId || "";
  const focusKind = activeElement?.dataset.focusKind || "";
  const focusStep = activeElement?.classList.contains("timeline-step-button") ? activeElement.textContent : "";
  const scrollLeft = oldScroller?.scrollLeft || 0;
  const scrollTop = oldScroller?.scrollTop || 0;
  const overviewScroll = oldOverview?.scrollLeft || 0;
  host.replaceChildren(renderTimeline(currentGraph(), {
    selectedNodeId,
    excludedTypes,
    searchTerm,
    focusedType,
    onSelectNode(nodeId) {
      selectedNodeId = nodeId;
      renderInspector();
      renderGraph();
    },
  }));
  const scroller = host.querySelector(".timeline-scroller");
  const overview = host.querySelector(".timeline-overview");
  if (scroller) { scroller.scrollLeft = scrollLeft; scroller.scrollTop = scrollTop; }
  if (overview) overview.scrollLeft = overviewScroll;
  if (hadTimelineFocus && focusNodeId) {
    const target = [...host.querySelectorAll("[data-focus-node-id]")].find((element) => element.dataset.focusNodeId === focusNodeId && element.dataset.focusKind === focusKind);
    target?.focus({ preventScroll: true });
  } else if (hadTimelineFocus && focusStep) {
    [...host.querySelectorAll(".timeline-step-button")].find((element) => element.textContent === focusStep)?.focus({ preventScroll: true });
  }
}
function updateViewMode() {
  const timeline = viewMode === "timeline";
  byId("graph-stage").classList.toggle("timeline-mode", timeline);
  byId("timeline-view").hidden = !timeline;
  const motionAvailable = graphMotionAllowed(currentGraph()) && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  byId("pause-motion").hidden = timeline || !motionAvailable;
  byId("show-map").setAttribute("aria-pressed", String(!timeline));
  byId("show-timeline").setAttribute("aria-pressed", String(timeline));
}
function setViewMode(mode) {
  viewMode = mode === "timeline" ? "timeline" : "graph";
  updateViewMode();
  renderGraph();
}
function updateViewerSidebar() {
  const viewer = isSharedViewer({ sharedView: onlineRoute, state: onlineState });
  const sidebar = byId("sidebar");
  sidebar.dataset.sharedViewer = String(viewer);
  sidebar.setAttribute("aria-label", viewer ? "About Atlas" : "Workspace library");
  byId("viewer-sidebar-intro").hidden = !viewer;
  byId("viewer-sidebar-status").hidden = !viewer;
  sidebarDrawer.updateLabel();
}
function updateWorkspaceActionAvailability() {
  updateViewerSidebar();
  updateEditHistoryControls();
  const hasProject = Boolean(activeProject());
  const canEdit = canMutateCurrent();
  const actions = currentWorkspaceActions();
  for (const id of ["search", "zoom-in", "zoom-out", "fit-graph", "pause-motion", "show-timeline", "show-map"]) {
    byId(id).disabled = !hasProject;
  }
  for (const id of ["edit-project", "auto-layout", "add-node", "add-edge"]) {
    byId(id).disabled = !hasProject || !canEdit;
    byId(id).hidden = actions.hideEditing;
  }
  byId("share-graph").disabled = !actions.canShare;
  byId("export-menu-button").disabled = !actions.canExport;
  byId("add-edge").closest(".inspector-footer").hidden = actions.hideEditing;
  document.querySelector(".canvas-help span:last-child").hidden = actions.hideEditing;
  byId("new-project").hidden = libraryMode !== "local" || recoveryMode || actions.hideEditing;
  byId("open-import").hidden = actions.hideEditing;
  byId("open-import").disabled = !canImportCurrent();
  byId("clear-data").hidden = libraryMode !== "local" || actions.hideEditing;
  byId("clear-data").disabled = !canEdit;
  byId("example-flow").disabled = !canEdit;
  updateExampleFlowVisibility();
  byId("graph").classList.toggle("read-only-online", isOnlineSession() && !canEdit);
  if (!actions.canExport) byId("export-menu").hidden = true;
  if (isOnlineSession() && !actions.canShare && byId("share-modal").open) byId("share-modal").close();
  byId("graph-context-menu").hidden = true;
  byId("drop-overlay").hidden = true;
  document.querySelectorAll("button.is-action-pending").forEach((button) => { button.disabled = true; });
  document.querySelectorAll("[data-empty-create]").forEach((button) => { button.hidden = !canEdit; });
  document.querySelectorAll("[data-empty-import]").forEach((button) => { button.hidden = !canImportCurrent(); });
  document.querySelectorAll(".inspector-actions, .edge-inspector-actions").forEach((actions) => { actions.hidden = !canEdit; });
  document.querySelectorAll(".connection-label").forEach((button) => {
    button.disabled = !canEdit;
    if (!canEdit) button.removeAttribute("aria-label");
  });
}
function renderAll() {
  const historyProject = activeProject();
  if (historyProject) editHistory.ensure(editHistoryScope(historyProject), historyProject.graph);
  renderLibrary();
  updateProjectHeader();
  updateWorkspaceActionAvailability();
  renderFilters();
  updateViewMode();
  renderGraph();
  renderInspector();
  localRecoveryMode();
  renderAutosaveAdmissionNotice();
  updateWorkspaceLoadingUi();
}

function cancelPendingShareLoad() {
  shareLoadTracker.cancel();
}
function selectProject(id) {
  if (!projects.some((project) => project.id === id)) return;
  cloudLibraryFirstSelection.cancel();
  cloudLibraryRequest += 1;
  if (isOnlineSession()) {
    if (!preserveDirtyOwnerDraftForNavigation()) return;
    if (!returnToLocalWorkspace()) return;
  }
  libraryMode = "local";
  cancelPendingShareLoad();
  cancelActiveGesture();
  hideGraphContextMenu();
  activeId = id;
  focusedType = ""; lockedType = ""; touchInteractionActive = false;
  currentMapAdmissionContext = null;
  const selected = activeProject();
  if (selected) editHistory.sync(editHistoryScope(selected), selected.graph);
  const pending = selected ? cloudAssociations[selected.id] : null;
  if (selected && pending?.pending === true) restorePendingAdmissionContext(pending.source, pending.key, selected, pending);
  viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
  selectedNodeId = null;
  selectedEdgeId = null;
  searchTerm = "";
  byId("search").value = "";
  excludedTypes.clear();
  animateStructure = true;
  renderAll();
  fitGraph(true);
  persist(false);
}
function currentStageWorldPoint(clientX, clientY) {
  return screenToWorld(clientX, clientY, byId("graph-stage").getBoundingClientRect(), transform);
}
function refreshEdgeSelection() {
  document.querySelectorAll(".edge-group[data-edge-id]").forEach((group) => {
    const selected = group.dataset.edgeId === selectedEdgeId;
    group.classList.toggle("selected", selected);
    group.setAttribute("aria-pressed", String(selected));
  });
}
function clearPortTargetHighlight() {
  document.querySelectorAll(".node-card.port-drop-target").forEach((group) => group.classList.remove("port-drop-target"));
}
function clearConnectionPreview() {
  const preview = byId("connection-preview");
  if (preview) {
    preview.setAttribute("d", "");
    preview.classList.remove("valid-target");
    preview.setAttribute("hidden", "");
  }
  clearPortTargetHighlight();
}
function portInputAt(clientX, clientY) {
  const element = document.elementFromPoint?.(clientX, clientY);
  const port = element?.closest?.(".card-port.port-input");
  return port && byId("graph").contains(port) ? port : null;
}
function updatePortPreview(event) {
  if (!dragState || dragState.kind !== "connection" || !event) return;
  const project = projectById(dragState.projectId);
  const graph = project?.graph;
  if (!graph || activeProject() !== project || graph !== dragState.graph) { cancelActiveConnection(); return; }
  const source = graph.nodes.find((node) => node.id === dragState.sourceId);
  const layout = dragState.layout;
  const sourcePoint = layout.positions.get(dragState.sourceId);
  const sourceSize = layout.dimensions.get(dragState.sourceId);
  if (!source || !sourcePoint || !sourceSize) { cancelActiveConnection(); return; }
  const hitPort = portInputAt(event.clientX, event.clientY);
  const targetId = hitPort?.dataset.nodeId || "";
  const target = graph.nodes.find((node) => node.id === targetId);
  const targetPoint = target ? layout.positions.get(target.id) : null;
  const targetSize = target ? layout.dimensions.get(target.id) : null;
  const end = targetPoint && targetSize
    ? { x: targetPoint.x, y: targetPoint.y + targetSize.height / 2 }
    : currentStageWorldPoint(event.clientX, event.clientY);
  const start = { x: sourcePoint.x + sourceSize.width, y: sourcePoint.y + sourceSize.height / 2 };
  const preview = byId("connection-preview");
  preview.setAttribute("d", connectionPreviewPath(start, end));
  preview.removeAttribute("hidden");
  preview.classList.toggle("valid-target", Boolean(hitPort && target));
  clearPortTargetHighlight();
  if (hitPort && target) document.querySelectorAll(".node-card").forEach((group) => {
    if (group.dataset.nodeId === target.id) group.classList.add("port-drop-target");
  });
  dragState.targetId = target?.id || "";
  dragState.lastEvent = event;
}
function startPortDrag(event, nodeId) {
  if (!requireMutation("connect components")) return;
  if (event.button !== 0 || !canStartPointerGesture(dragState) || !currentGraph().nodes.some((node) => node.id === nodeId)) return;
  event.preventDefault();
  event.stopPropagation();
  stopFitAnimation();
  hideGraphContextMenu();
  const project = activeProject();
  const graph = currentGraph();
  dragState = { kind: "connection", projectId: project?.id || "", graph, sourceId: nodeId, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, targetId: "", lastEvent: event, layout: layoutGraph(graph) };
  byId("graph").classList.add("is-connecting");
  try { byId("graph").setPointerCapture(event.pointerId); } catch {}
  updatePortPreview(event);
}
function cancelActiveConnection() {
  if (dragState?.kind !== "connection") return;
  const pointerId = dragState.pointerId;
  dragState = null;
  byId("graph").classList.remove("is-connecting");
  clearConnectionPreview();
  try { byId("graph").releasePointerCapture(pointerId); } catch {}
}
function cancelActiveGesture() {
  const state = dragState;
  if (!state) return;
  dragState = null;
  byId("graph").classList.remove("is-connecting", "is-panning");
  if (state.kind === "connection") {
    clearConnectionPreview();
    clearPortTargetHighlight();
  } else if (state.kind === "node" && state.moved) {
    const node = state.graphRef?.nodes.find((item) => item.id === state.id);
    if (node) {
      if (state.originalPosition) node.position = { ...state.originalPosition };
      else delete node.position;
      const project = projectById(state.projectId);
      if (project?.id === activeId && project.graph === state.graphRef) renderGraph();
    }
  }
  try { byId("graph").releasePointerCapture(state.pointerId); } catch {}
}
function beginNodeDrag(event, nodeId) {
  if (!canMutateCurrent()) return;
  if (event.button !== 0 || !canStartPointerGesture(dragState) || event.target.closest?.(".card-port")) return;
  stopFitAnimation();
  event.stopPropagation();
  const project = activeProject();
  const graph = project?.graph;
  const node = graph?.nodes.find((item) => item.id === nodeId);
  const point = layoutGraph(graph || emptyGraph()).positions.get(nodeId);
  if (!point || !project || !node) return;
  const world = currentStageWorldPoint(event.clientX, event.clientY);
  dragState = { kind: "node", id: nodeId, projectId: project.id, graphRef: graph, originalPosition: node.position ? { ...node.position } : null, baselineText: serializeGraphJson(graph), offsetX: world.x - point.x, offsetY: world.y - point.y, startX: event.clientX, startY: event.clientY, moved: false, pointerId: event.pointerId };
}
function startPan(event) {
  if (event.button !== 0 || !canStartPointerGesture(dragState) || event.target.closest?.(".node-card") || event.target.closest?.(".edge-group") || event.target.closest?.(".graph-context-menu")) return;
  stopFitAnimation();
  dragState = { kind: "pan", startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false, pointerId: event.pointerId };
  byId("graph").classList.add("is-panning");
  try { byId("graph").setPointerCapture(event.pointerId); } catch {}
}
function movePointer(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  if (dragState.kind === "node" && !canMutateCurrent()) { cancelActiveGesture(); return; }
  if (dragState.kind === "connection") { updatePortPreview(event); return; }
  if (dragState.kind === "pan") {
    const dx = event.clientX - dragState.lastX;
    const dy = event.clientY - dragState.lastY;
    transform.x += dx;
    transform.y += dy;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    dragState.moved = dragState.moved || Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY) > 3;
    setViewportTransform();
    return;
  }
  const movement = Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY);
  if (!dragState.moved && movement <= 3) return;
  if (!dragState.moved) {
    dragState.moved = true;
    try { byId("graph").setPointerCapture(event.pointerId); } catch {}
  }
  const state = dragState;
  const project = projectById(state.projectId);
  const node = state.graphRef?.nodes.find((item) => item.id === state.id);
  if (!node || !project || activeProject() !== project || project.graph !== state.graphRef) return;
  const world = currentStageWorldPoint(event.clientX, event.clientY);
  node.position = {
    x: clamp(world.x - dragState.offsetX, -99999, 99999),
    y: clamp(world.y - dragState.offsetY, -99999, 99999),
  };
  dragState.moved = dragState.moved || movement > 3;
  animateStructure = false;
  renderGraph();
}
function endPointer(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  if (dragState.kind === "connection") {
    const state = dragState;
    const targetPort = portInputAt(event.clientX, event.clientY);
    const project = projectById(state.projectId);
    const targetId = targetPort?.dataset.nodeId || "";
    dragState = null;
    byId("graph").classList.remove("is-connecting");
    clearConnectionPreview();
    if (canMutateCurrent() && event.type === "pointerup" && project && activeProject() === project && project.graph === state.graph
      && project.graph.nodes.some((node) => node.id === state.sourceId)
      && project.graph.nodes.some((node) => node.id === targetId)) {
      openEdgeEditor(null, state.sourceId, { targetId, focusField: "edge-label" });
    }
    return;
  }
  const state = dragState;
  const didMove = state.moved;
  const wasNode = state.kind === "node";
  const wasPan = state.kind === "pan";
  dragState = null;
  byId("graph").classList.remove("is-panning");
  if (wasPan && !didMove && event.type === "pointerup") {
    if (focusedType || lockedType) {
      applyTypeInteraction({ kind: "clear-highlight" });
      byId("type-filter-status").textContent = "Component type highlight cleared.";
    }
    if (selectedNodeId || selectedEdgeId) {
      selectedNodeId = null;
      selectedEdgeId = null;
      touchSelectedEdge = null;
      renderInspector();
      refreshTraceStyles();
      refreshEdgeSelection();
    }
  }
  if (wasNode && didMove) {
    const project = projectById(state.projectId);
    if (!canMutateCurrent()) {
      const node = state.graphRef?.nodes.find((item) => item.id === state.id);
      if (node) { if (state.originalPosition) node.position = { ...state.originalPosition }; else delete node.position; renderGraph(); }
      return;
    }
    const node = state.graphRef?.nodes.find((item) => item.id === state.id);
    if (!node || !project || activeProject() !== project || project.graph !== state.graphRef) return;
    const restorePosition = () => {
      if (state.originalPosition) node.position = { ...state.originalPosition };
      else delete node.position;
      renderGraph();
    };
    if (event.type !== "pointerup") { restorePosition(); return; }
    try { assertGraphJsonWithinLimit(project.graph, { baselineText: state.baselineText }); }
    catch (error) {
      restorePosition();
      showToast(error instanceof Error ? error.message : "That position would make this map too large to export and re-import.", "error");
      return;
    }
    project.updatedAt = Date.now();
    renderLibrary();
    persist();
  }
}
function autoLayout() {
  if (!requireMutation("rearrange components")) return;
  const project = activeProject();
  if (!project) return;
  for (const node of project.graph.nodes) delete node.position;
  animateStructure = true;
  renderGraph();
  renderInspector();
  fitGraph(true);
  persist();
}
function bindDialogBackdropClose(dialog, close = () => dialog.close("cancel")) {
  let backdropPress = false;
  const isBackdrop = (event) => {
    const rect = dialog.getBoundingClientRect();
    return event.target === dialog
      && (event.clientX < rect.left || event.clientX > rect.right
        || event.clientY < rect.top || event.clientY > rect.bottom);
  };
  dialog.addEventListener("pointerdown", (event) => {
    backdropPress = event.button === 0 && isBackdrop(event);
  });
  dialog.addEventListener("pointercancel", () => { backdropPress = false; });
  dialog.addEventListener("click", (event) => {
    const dismiss = backdropPress && isBackdrop(event);
    backdropPress = false;
    if (dismiss) close();
  });
  dialog.addEventListener("close", () => { backdropPress = false; });
}
function openProjectEditor() {
  if (!requireMutation("edit project details")) return;
  const project = activeProject();
  if (!project) { showToast("Create or import a project before editing its details.", "error"); return; }
  projectEditContext = { projectId: project.id, graphRef: project.graph };
  projectEditResumeShareLoad = shareLoadTracker.interruptPending();
  byId("project-name-input").value = project.graph.project.name || "";
  byId("project-description-input").value = project.graph.project.description || "";
  byId("project-type-input").value = project.graph.project.type || "";
  byId("project-error").hidden = true;
  const unresolvedCandidate = localProjectHasUnresolvedCloudCandidate(project.id);
  byId("delete-project").hidden = isOnlineSession();
  byId("delete-project").disabled = unresolvedCandidate;
  if (unresolvedCandidate) {
    byId("project-error").textContent = "Resolve the pending Cloud Workspace save before deleting this local map.";
    byId("project-error").hidden = false;
  }
  byId("project-modal-title").textContent = "Project details";
  byId("project-modal").showModal();
}
function saveProjectDetails() {
  if (!requireMutation("edit project details")) return;
  const context = projectEditContext;
  const project = context && projectById(context.projectId);
  const name = byId("project-name-input").value.trim();
  if (!project || activeProject() !== project || project.graph !== context.graphRef) {
    byId("project-error").textContent = "The map changed while this form was open. Reopen project details before saving.";
    byId("project-error").hidden = false;
    return;
  }
  if (!name) {
    byId("project-error").textContent = "Project name is required.";
    byId("project-error").hidden = false;
    return;
  }
  let candidate;
  try {
    candidate = normalizeEditableGraph({
      ...project.graph,
      project: {
        name,
        description: byId("project-description-input").value.trim(),
        type: byId("project-type-input").value.trim() || "Software project",
      },
    }, { baselineGraph: project.graph });
  } catch (error) {
    byId("project-error").textContent = error instanceof Error ? error.message : "The project details would make this map too large to save.";
    byId("project-error").hidden = false;
    return;
  }
  project.graph = candidate;
  project.updatedAt = Date.now();
  projectEditResumeShareLoad = null;
  byId("project-modal").close();
  projectEditContext = null;
  graphChanged({ structure: false });
}
function createProject() {
  if (libraryMode !== "local") { selectLibraryMode("local"); return; }
  if (isOnlineSession()) {
    if (!preserveDirtyOwnerDraftForNavigation() || !returnToLocalWorkspace()) return;
  }
  if (!requireMutation("create a project")) return;
  cancelPendingShareLoad();
  const graph = { schemaVersion: 1, project: { name: "Untitled project", description: "", type: "Software project" }, nodes: [], edges: [] };
  const project = makeProject(graph);
  projects.unshift(project);
  activeId = project.id;
  viewMode = "graph";
  selectedNodeId = null;
  selectedEdgeId = null;
  excludedTypes.clear();
  searchTerm = "";
  byId("search").value = "";
  animateStructure = true;
  renderAll();
  fitGraph(false);
  const savedLocally = persist();
  if (savedLocally) void admitMapProject("new", project, project.id);
  byId("project-title").focus?.();
}
function openFlowExample() {
  if (!requireMutation("add a local example")) return;
  cancelPendingShareLoad();
  const example = SAMPLE_GRAPHS.find((graph) => graph.project.name === FLOW_EXAMPLE_NAME);
  if (!example) { showToast("The request-flow example is unavailable.", "error"); return; }
  const result = addOrReuseExampleProject(projects, FLOW_EXAMPLE_ID, () =>
    makeProject(normalizeGraph(example), createProjectId(), { exampleId: FLOW_EXAMPLE_ID }),
  );
  projects = result.projects;
  const project = result.project;
  const added = result.added;
  activeId = project.id;
  viewMode = "timeline";
  selectedNodeId = null;
  selectedEdgeId = null;
  excludedTypes.clear();
  searchTerm = "";
  byId("search").value = "";
  animateStructure = true;
  renderAll();
  fitGraph(false);
  const saved = persist();
  if (added && saved) showToast("Added the request-flow example as a separate saved project. Your existing maps are unchanged.");
}
function confirmProjectDelete() {
  if (isOnlineSession()) { showToast("Use Delete online map to remove this workspace and disable its live link.", "error"); return; }
  if (!requireMutation("delete a project")) return;
  const project = activeProject();
  if (!project) return;
  if (localProjectHasUnresolvedCloudCandidate(project.id)) {
    byId("project-error").textContent = "Resolve the pending Cloud Workspace save before deleting this local map.";
    byId("project-error").hidden = false;
    return;
  }
  const context = { projectId: project.id, projectRef: project, graphRef: project.graph };
  const name = project.graph.project.name || "this project";
  const resumeShareLoad = projectEditResumeShareLoad;
  projectEditResumeShareLoad = null;
  byId("project-modal").close();
  openConfirm("Delete this project?", "This removes " + name + " and its map from this browser's Project Atlas library.", "Delete project", () => {
    if (!requireMutation("delete a project")) return;
    if (localProjectHasUnresolvedCloudCandidate(context.projectId)) {
      showToast("Resolve the pending Cloud Workspace save before deleting this local map.", "error");
      return;
    }
    const deletion = removeProjectSnapshot(projects, context, activeId);
    if (!deletion) {
      showToast("This project changed before deletion. No project was removed.", "error");
      return;
    }
    if (shouldClearShareFragmentForDeletedProject(deletion.project, location.hash)) {
      try {
        history.replaceState(history.state, "", location.pathname + location.search);
      } catch {
        showToast("The shared map link could not be cleared, so the project was kept. Try again.", "error");
        return;
      }
      cancelPendingShareLoad();
    }
    editHistory.forget("local:" + context.projectId);
    mapAdmissionController.forget({ projectId: context.projectId });
    delete cloudAssociations[context.projectId];
    saveCloudAssociations();
    projects = deletion.projects;
    activeId = deletion.activeId;
    if (deletion.wasActive) {
      viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
      selectedNodeId = null;
      selectedEdgeId = null;
      excludedTypes.clear();
      searchTerm = "";
      byId("search").value = "";
      animateStructure = true;
    }
    renderAll();
    if (deletion.wasActive) fitGraph(true);
    persist();
  }, null, resumeShareLoad);
}
function nodeCardElement(nodeId) {
  return [...byId("nodes-layer").querySelectorAll(".node-card")].find((item) => item.dataset.nodeId === nodeId) || null;
}
function confirmDeleteNodeSnapshot(context, returnFocus = null) {
  if (!requireMutation("delete components")) return;
  const project = context && projectById(context.projectId);
  const node = project?.graph.nodes.find((item) => item.id === context.nodeId);
  const focusElement = returnFocus?.element || returnFocus || nodeCardElement(context?.nodeId);
  const focusTarget = { element: focusElement, fallbackGraph: true };
  if (!project || activeProject() !== project || !nodeContextIsCurrent(project, node, context)) {
    focusGraphTarget(focusTarget);
    showToast("That component changed before it could be deleted. Reopen its context menu and try again.", "error");
    return;
  }
  openConfirm("Delete this component?", "Delete " + node.label + " and its attached connections from this map?", "Delete component", () => {
    if (!requireMutation("delete components")) return;
    const currentProject = projectById(context.projectId);
    const currentNode = currentProject?.graph.nodes.find((item) => item.id === context.nodeId);
    if (!currentProject || activeProject() !== currentProject || !nodeContextIsCurrent(currentProject, currentNode, context)) {
      showToast("That component changed before it could be deleted. No map data was changed.", "error");
      return;
    }
    const removedEdgeIds = new Set(currentProject.graph.edges
      .filter((edge) => edge.source === context.nodeId || edge.target === context.nodeId)
      .map((edge) => edge.id));
    currentProject.graph.nodes = currentProject.graph.nodes.filter((item) => item.id !== context.nodeId);
    currentProject.graph.edges = currentProject.graph.edges.filter((edge) => !removedEdgeIds.has(edge.id));
    if (selectedNodeId === context.nodeId) selectedNodeId = null;
    if (selectedEdgeId && removedEdgeIds.has(selectedEdgeId)) selectedEdgeId = null;
    currentProject.updatedAt = Date.now();
    animateStructure = true;
    renderAll();
    fitGraph(true);
    persist();
  }, focusTarget);
}
function confirmNodeDelete(nodeId) {
  if (!requireMutation("delete components")) return;
  const editorContext = nodeEditContext?.nodeId === nodeId ? nodeEditContext : null;
  const project = editorContext
    ? projectById(editorContext.projectId)
    : activeProject();
  const node = project?.graph.nodes.find((item) => item.id === nodeId);
  if (!project || activeProject() !== project || !node) {
    showToast("That component no longer exists in this map.", "error");
    return;
  }
  const context = editorContext || {
    projectId: project.id,
    graphRef: project.graph,
    nodeId: node.id,
    nodeSnapshot: JSON.stringify(node),
  };
  if (!nodeContextIsCurrent(project, node, context)) {
    showToast("That component changed while the editor was open. Reopen it before deleting.", "error");
    return;
  }
  const returnFocus = { element: nodeCardElement(node.id), fallbackGraph: true };
  if (byId("editor-modal").open) {
    dialogFocusTargets.delete("editor-modal");
    byId("editor-modal").close();
    nodeEditContext = null;
  }
  confirmDeleteNodeSnapshot(context, returnFocus);
}
function openNodeEditor(nodeId = null, { position = null, projectId = null, returnFocus = null, expectedNodeContext = null } = {}) {
  if (!requireMutation("edit components")) return;
  cancelPendingShareLoad();
  const ownerProjectId = projectId || activeProject()?.id;
  const project = projectById(ownerProjectId);
  if (!project || activeProject() !== project) { showToast("Select a project before adding a component.", "error"); return; }
  const node = nodeId ? project.graph.nodes.find((item) => item.id === nodeId) : null;
  if (nodeId && !node) { showToast("That component no longer exists in this map.", "error"); return; }
  if (expectedNodeContext && !nodeContextIsCurrent(project, node, expectedNodeContext)) {
    focusGraphTarget({ element: returnFocus, fallbackGraph: true });
    showToast("That component changed. Reopen its context menu and try again.", "error");
    return;
  }
  editingNodeId = node?.id || null;
  nodeEditContext = { projectId: project.id, graphRef: project.graph, nodeId: node?.id || null, nodeSnapshot: node ? JSON.stringify(node) : null, position: !node && position ? { ...position } : null };
  byId("editor-title").textContent = node ? "Edit component" : "Add component";
  byId("editor-kicker").textContent = node ? node.type.toUpperCase() : "COMPONENT";
  byId("editor-subtitle").textContent = node ? "Update its purpose, category, or source path." : nodeEditContext.position ? "This component will be placed at the chosen canvas point when saved." : "Give this part of the system a name and a purpose.";
  byId("node-label").value = node?.label || "";
  const typeEditor = selectNodeTypeEditor(node?.type || "Service");
  byId("node-type-preset").value = typeEditor.preset;
  byId("node-type-custom").value = typeEditor.custom;
  byId("node-type-custom").hidden = typeEditor.preset !== "Custom";
  byId("node-type-custom").required = typeEditor.preset === "Custom";
  byId("node-type-preset").disabled = Boolean(node?.junction);
  byId("node-type-custom").disabled = Boolean(node?.junction);
  const chart = node?.chart || null;
  byId("node-chart-enabled").checked = Boolean(chart);
  byId("node-chart-fields").hidden = !chart;
  byId("node-chart-label").value = chart?.label || "";
  byId("node-chart-kind").value = chart?.kind || "bar";
  byId("node-chart-unit").value = chart?.unit || "";
  byId("node-chart-order").value = chart?.order || "";
  byId("node-chart-values").value = (chart?.values || []).join("\n");
  byId("node-chart-categories").value = (chart?.categories || []).join("\n");
  byId("node-chart-evidence").value = chart?.evidence || "";
  byId("node-description").value = node?.description || "";
  byId("node-source").value = node?.source || "";
  byId("node-purpose").value = node?.details?.purpose || "";
  byId("node-operation").value = node?.details?.operation || "";
  byId("node-inputs").value = (node?.details?.inputs || []).join("\n");
  byId("node-outputs").value = (node?.details?.outputs || []).join("\n");
  byId("node-dependencies").value = (node?.details?.dependencies || []).join("\n");
  byId("node-evidence").value = (node?.details?.evidence || []).join("\n");
  byId("node-uncertainty").value = (node?.details?.uncertainty || []).join("\n");
  byId("editor-error").hidden = true;
  byId("delete-node").hidden = !node;
  setDialogFocusTarget("editor-modal", returnFocus ? { element: returnFocus, fallbackGraph: true } : { nodeId: node?.id || null, fallbackGraph: true });
  byId("editor-modal").showModal();
  if (!node) byId("node-label").focus();
}
function saveNode() {
  if (!requireMutation("edit components")) return;
  const context = nodeEditContext;
  const project = context && projectById(context.projectId);
  if (!context || !project || activeProject() !== project || project.graph !== context.graphRef) {
    byId("editor-error").textContent = "The map changed while this form was open. Reopen the editor before saving.";
    byId("editor-error").hidden = false;
    return;
  }
  const label = byId("node-label").value.trim();
  let type;
  try { type = resolveNodeType(byId("node-type-preset").value, byId("node-type-custom").value); }
  catch (error) {
    byId("editor-error").textContent = error instanceof Error ? error.message : "Choose a valid component type.";
    byId("editor-error").hidden = false;
    return;
  }
  if (!label) {
    byId("editor-error").textContent = "Component name is required.";
    byId("editor-error").hidden = false;
    return;
  }
  const graph = project.graph;
  const existing = context.nodeId ? graph.nodes.find((node) => node.id === context.nodeId) : null;
  if (context.nodeId && !existing) {
    byId("editor-error").textContent = "This component was removed while the form was open. Reopen the editor before saving.";
    byId("editor-error").hidden = false;
    return;
  }
  if (existing && context.nodeSnapshot && !nodeContextIsCurrent(project, existing, context)) {
    byId("editor-error").textContent = "This component changed while the form was open. Reopen the editor before saving.";
    byId("editor-error").hidden = false;
    return;
  }
  if (!existing && graph.nodes.length >= LIMITS.nodes) {
    byId("editor-error").textContent = "Maps support up to " + LIMITS.nodes + " components.";
    byId("editor-error").hidden = false;
    return;
  }
  const detailList = (id) => byId(id).value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const detailFields = { purpose: byId("node-purpose").value.trim(), operation: byId("node-operation").value.trim(), inputs: detailList("node-inputs"), outputs: detailList("node-outputs"), dependencies: detailList("node-dependencies"), evidence: detailList("node-evidence"), uncertainty: detailList("node-uncertainty") };
  const invalidDetail = Object.entries(detailFields).find(([key, value]) => Array.isArray(value) ? value.length > LIMITS.detailItems || value.some((item) => item.length > LIMITS.detailText) : value.length > (key === "purpose" ? 500 : 1000));
  if (invalidDetail) {
    byId("editor-error").textContent = "Keep each detail field within its character and item limits (8 list items, 240 characters each).";
    byId("editor-error").hidden = false;
    return;
  }
  const hasDetails = detailFields.purpose || detailFields.operation || Object.values(detailFields).some((value) => Array.isArray(value) && value.length);
  const node = {
    ...(existing || {}),
    id: existing?.id || newNodeId(graph.nodes),
    label, type,
    description: byId("node-description").value.trim(),
    source: byId("node-source").value.trim(),
    group: existing?.group || "",
  };
  if (hasDetails) node.details = detailFields;
  else delete node.details;
  const chartInput = {
    enabled: byId("node-chart-enabled").checked,
    label: byId("node-chart-label").value,
    kind: byId("node-chart-kind").value,
    unit: byId("node-chart-unit").value,
    order: byId("node-chart-order").value,
    values: byId("node-chart-values").value,
    categories: byId("node-chart-categories").value,
    evidence: byId("node-chart-evidence").value,
  };
  let chart;
  try { chart = buildChartFromEditor(chartInput); }
  catch (error) {
    if (existing?.chart && chartEditorMatchesChart(existing.chart, chartInput)) chart = existing.chart;
    else {
      byId("editor-error").textContent = error instanceof Error ? error.message : "Check the measured chart values and evidence.";
      byId("editor-error").hidden = false;
      return;
    }
  }
  if (chart) node.chart = chart;
  else delete node.chart;
  if (existing) node.position = existing.position;
  else if (context.position) node.position = { x: clamp(context.position.x, -99999, 99999), y: clamp(context.position.y, -99999, 99999) };
  const nextNodes = existing ? graph.nodes.map((item) => item.id === existing.id ? node : item) : [...graph.nodes, node];
  let candidate;
  try { candidate = normalizeEditableGraph({ ...graph, nodes: nextNodes }, { baselineGraph: graph }); }
  catch (error) {
    byId("editor-error").textContent = error instanceof Error ? error.message : "This edit would make the map too large to save.";
    byId("editor-error").hidden = false;
    return;
  }
  project.graph = candidate;
  const savedNode = candidate.nodes.find((item) => item.id === node.id);
  project.updatedAt = Date.now();
  selectedNodeId = savedNode.id;
  selectedEdgeId = null;
  setDialogFocusTarget("editor-modal", { nodeId: savedNode.id, fallbackGraph: true });
  byId("editor-modal").close();
  nodeEditContext = null;
  animateStructure = true;
  renderAll();
  fitGraph(true);
  persist();
}
function setDialogFocusTarget(dialogId, target) {
  dialogFocusTargets.set(dialogId, target || { fallbackGraph: true });
}
function focusGraphTarget(target) {
  if (!target) return;
  requestAnimationFrame(() => {
    let element = target.element?.isConnected ? target.element : null;
    if (!element && target.nodeId) element = [...byId("nodes-layer").querySelectorAll(".node-card")].find((item) => item.dataset.nodeId === target.nodeId) || null;
    if (!element && target.edgeId) element = [...byId("edges-layer").querySelectorAll(".edge-group")].find((item) => item.dataset.edgeId === target.edgeId) || null;
    if (!element && target.fallbackGraph !== false) element = byId("graph");
    if (element?.isConnected) element.focus?.({ preventScroll: true });
  });
}
function restoreDialogFocus(dialogId) {
  const target = dialogFocusTargets.get(dialogId);
  dialogFocusTargets.delete(dialogId);
  focusGraphTarget(target);
}
function hideGraphContextMenu({ restoreFocus = false } = {}) {
  const menu = byId("graph-context-menu");
  if (menu) menu.hidden = true;
  edgeMenuContext = null;
  canvasMenuContext = null;
  nodeMenuContext = null;
  if (restoreFocus && menuReturnFocus?.isConnected) menuReturnFocus.focus({ preventScroll: true });
  menuReturnFocus = null;
}
function showGraphContextMenu(kind, clientX, clientY) {
  if (!canMutateCurrent()) return;
  const menu = byId("graph-context-menu");
  const stage = byId("graph-stage");
  if (!menu || !stage) return;
  menu.querySelectorAll("[data-canvas-menu]").forEach((item) => { item.hidden = kind !== "canvas"; });
  menu.querySelectorAll("[data-edge-menu]").forEach((item) => { item.hidden = kind !== "edge"; });
  menu.querySelectorAll("[data-node-menu]").forEach((item) => { item.hidden = kind !== "node"; });
  menu.hidden = false;
  const rect = stage.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const left = clamp(clientX - rect.left, 4, Math.max(4, rect.width - menuRect.width - 4));
  const top = clamp(clientY - rect.top, 4, Math.max(4, rect.height - menuRect.height - 4));
  menu.style.left = left + "px";
  menu.style.top = top + "px";
  menu.querySelector('[role="menuitem"]:not([hidden])')?.focus({ preventScroll: true });
}
function showCanvasContextMenu(event) {
  if (!canMutateCurrent()) return;
  const world = currentStageWorldPoint(event.clientX, event.clientY);
  const project = activeProject();
  if (!project) return;
  edgeMenuContext = null;
  nodeMenuContext = null;
  menuReturnFocus = byId("graph");
  canvasMenuContext = { projectId: project.id, graphRef: project.graph, position: { x: clamp(world.x, -99999, 99999), y: clamp(world.y, -99999, 99999) } };
  showGraphContextMenu("canvas", event.clientX, event.clientY);
}
function showEdgeContextMenu(edgeId, clientX, clientY) {
  if (!canMutateCurrent()) return;
  const project = activeProject();
  const edge = project?.graph.edges.find((item) => item.id === edgeId);
  if (!project || !edge) return;
  const group = [...byId("edges-layer").querySelectorAll(".edge-group")].find((item) => item.dataset.edgeId === edgeId);
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY) || (clientX === 0 && clientY === 0)) {
    const rect = group?.getBoundingClientRect();
    clientX = rect ? rect.left + rect.width / 2 : 0;
    clientY = rect ? rect.top + rect.height / 2 : 0;
  }
  selectedNodeId = null;
  selectedEdgeId = edge.id;
  const worldPosition = currentStageWorldPoint(clientX, clientY);
  menuReturnFocus = group || document.activeElement;
  edgeMenuContext = { projectId: project.id, graphRef: project.graph, edgeId: edge.id, edgeSnapshot: { ...edge }, position: { x: clamp(worldPosition.x, -99999, 99999), y: clamp(worldPosition.y, -99999, 99999) } };
  canvasMenuContext = null;
  nodeMenuContext = null;
  renderInspector();
  refreshEdgeSelection();
  group?.focus({ preventScroll: true });
  showGraphContextMenu("edge", clientX, clientY);
}
function showNodeContextMenu(nodeId, clientX, clientY, nodeElement = null) {
  if (!canMutateCurrent()) return;
  const project = activeProject();
  const node = project?.graph.nodes.find((item) => item.id === nodeId);
  if (!project || !node) return;
  edgeMenuContext = null;
  canvasMenuContext = null;
  const group = nodeElement || [...byId("nodes-layer").querySelectorAll(".node-card")].find((item) => item.dataset.nodeId === node.id);
  menuReturnFocus = group || document.activeElement;
  nodeMenuContext = {
    projectId: project.id,
    graphRef: project.graph,
    nodeId: node.id,
    nodeSnapshot: JSON.stringify(node),
  };
  showGraphContextMenu("node", clientX, clientY);
}
function focusableElementsOutsideGraphMenu() {
  return [...document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.closest("#graph-context-menu")
      && !element.closest("[hidden]")
      && !element.matches(":disabled")
      && element.getClientRects().length > 0
      && window.getComputedStyle(element).visibility !== "hidden"
      && (!element.closest("dialog") || element.closest("dialog").open));
}
function handleGraphMenuAction(event) {
  if (!requireMutation("edit the graph")) return;
  const button = event.target.closest?.("[data-graph-action]");
  if (!button) return;
  event.preventDefault();
  const action = button.dataset.graphAction;
  const edgeContext = edgeMenuContext;
  const canvasContext = canvasMenuContext;
  const nodeContext = nodeMenuContext;
  const returnFocus = menuReturnFocus || byId("graph");
  hideGraphContextMenu({ restoreFocus: true });

  if (action === "add-node-here" && canvasContext) {
    const project = projectById(canvasContext.projectId);
    if (!project || activeProject() !== project || project.graph !== canvasContext.graphRef) {
      focusGraphTarget({ element: returnFocus, fallbackGraph: true });
      showToast("The map changed. Reopen the canvas menu to add a component.", "error");
      return;
    }
    openNodeEditor(null, { ...canvasContext, returnFocus });
    return;
  }

  if (["edit-node", "connect-from-node", "delete-node"].includes(action) && nodeContext) {
    const project = projectById(nodeContext.projectId);
    const node = project?.graph.nodes.find((item) => item.id === nodeContext.nodeId);
    if (project?.id !== activeId || !nodeContextIsCurrent(project, node, nodeContext)) {
      focusGraphTarget({ element: returnFocus, fallbackGraph: true });
      showToast("That component changed. Reopen its context menu and try again.", "error");
      return;
    }
    if (action === "edit-node") openNodeEditor(node.id, { returnFocus, expectedNodeContext: nodeContext });
    else if (action === "connect-from-node") openEdgeEditor(null, node.id, { returnFocus, originNodeContext: nodeContext });
    else confirmDeleteNodeSnapshot(nodeContext, { element: returnFocus, fallbackGraph: true });
    return;
  }

  if (!edgeContext) return;
  const project = projectById(edgeContext.projectId);
  const edge = project?.graph.edges.find((item) => item.id === edgeContext.edgeId);
  if (!project || activeProject() !== project || project.graph !== edgeContext.graphRef || !edge || !sameEdgeSnapshot(edge, edgeContext.edgeSnapshot)) {
    focusGraphTarget({ element: returnFocus, fallbackGraph: true });
    showToast("That connection changed. Reopen its context menu and try again.", "error");
    return;
  }
  if (action === "edit-edge") openEdgeEditor(edge.id, null, { returnFocus });
  else if (action === "reconnect-source") openEdgeEditor(edge.id, null, { focusField: "edge-source", returnFocus });
  else if (action === "reconnect-target") openEdgeEditor(edge.id, null, { focusField: "edge-target", returnFocus });
  else if (action === "delete-edge") confirmDeleteEdgeSnapshot(edgeContext, returnFocus);
  else if (action === "branch-edge") openBranchEditor(edgeContext, { returnFocus });
}
function sameNodeSnapshot(node, snapshot) {
  return Boolean(node && snapshot && node.id === snapshot.id && node.label === snapshot.label && node.type === snapshot.type);
}
function openBranchEditor(context, { returnFocus = null } = {}) {
  if (!requireMutation("edit connections")) return;
  const project = projectById(context?.projectId);
  const edge = project?.graph.edges.find((item) => item.id === context.edgeId);
  if (!project || activeProject() !== project || project.graph !== context.graphRef || !sameEdgeSnapshot(edge, context.edgeSnapshot)) {
    showToast("That connection changed. Reopen its context menu before branching.", "error");
    return;
  }
  const source = project.graph.nodes.find((node) => node.id === edge.source);
  const target = project.graph.nodes.find((node) => node.id === edge.target);
  const preferred = project.graph.nodes.find((node) => node.id !== edge.source && node.id !== edge.target) || target || source;
  fillNodeChoices(byId("branch-target"), preferred?.id, project.graph);
  byId("branch-junction-name").value = "Branch point";
  byId("branch-label").value = "";
  byId("branch-type").value = "";
  byId("branch-error").hidden = true;
  byId("branch-connection-summary").textContent = "The original connection from " + (source?.label || edge.source) + " continues through a new circular junction to " + (target?.label || edge.target) + ". A separate branch will connect to the chosen component.";
  const selected = project.graph.nodes.find((node) => node.id === byId("branch-target").value);
  branchEditContext = {
    projectId: project.id,
    graphRef: project.graph,
    edgeId: edge.id,
    edgeSnapshot: { ...edge },
    position: { ...context.position },
    targetSnapshot: selected ? { id: selected.id, label: selected.label, type: selected.type } : null,
  };
  setDialogFocusTarget("branch-modal", returnFocus ? { element: returnFocus, fallbackGraph: true } : { edgeId: edge.id, fallbackGraph: true });
  byId("branch-modal").showModal();
  byId("branch-junction-name").focus();
}
function updateBranchTargetSnapshot() {
  if (!branchEditContext) return;
  const project = projectById(branchEditContext.projectId);
  const target = project?.graph.nodes.find((node) => node.id === byId("branch-target").value);
  branchEditContext.targetSnapshot = target ? { id: target.id, label: target.label, type: target.type } : null;
}
function saveBranch() {
  if (!requireMutation("edit connections")) return;
  const context = branchEditContext;
  const project = context && projectById(context.projectId);
  if (!context || !project || activeProject() !== project || project.graph !== context.graphRef) {
    byId("branch-error").textContent = "The map changed while this form was open. Reopen the branch menu before saving.";
    byId("branch-error").hidden = false;
    return;
  }
  const target = project.graph.nodes.find((node) => node.id === byId("branch-target").value);
  if (!sameNodeSnapshot(target, context.targetSnapshot)) {
    byId("branch-error").textContent = "The selected branch component changed or was removed. Choose a current component and save again.";
    byId("branch-error").hidden = false;
    return;
  }
  try {
    const originalGraph = project.graph;
    const candidate = branchEdgeCandidate(originalGraph, {
      edgeId: context.edgeId,
      expectedEdge: context.edgeSnapshot,
      branchTargetId: target.id,
      junctionLabel: byId("branch-junction-name").value,
      relationship: byId("branch-label").value,
      relationshipType: byId("branch-type").value,
      position: { x: context.position.x - 18, y: context.position.y - 18 },
    });
    const junction = candidate.nodes.find((node) => node.junction && !originalGraph.nodes.some((item) => item.id === node.id));
    if (!junction) throw new Error("The junction could not be created.");
    project.graph = candidate;
    project.updatedAt = Date.now();
    selectedNodeId = junction.id;
    selectedEdgeId = null;
    branchEditContext = null;
    setDialogFocusTarget("branch-modal", { nodeId: junction.id, fallbackGraph: true });
    byId("branch-modal").close();
    animateStructure = true;
    renderAll();
    fitGraph(true);
    persist();
    showToast("Branch saved as one junction, the original labeled segment, a neutral continuation, and one new branch.");
  } catch (error) {
    byId("branch-error").textContent = error instanceof Error ? error.message : "The branch could not be saved.";
    byId("branch-error").hidden = false;
  }
}
function sameEdgeSnapshot(edge, snapshot) {
  return Boolean(edge && snapshot && edge.id === snapshot.id && edge.source === snapshot.source && edge.target === snapshot.target && edge.label === snapshot.label && edge.type === snapshot.type);
}
function fillNodeChoices(select, selectedId, graph = currentGraph()) {
  select.replaceChildren();
  for (const node of graph.nodes) {
    const option = plain("option", "", node.label + " (" + node.type + ")");
    option.value = node.id;
    option.selected = node.id === selectedId;
    select.append(option);
  }
}
function openEdgeEditor(edgeId = null, sourceId = null, { targetId = null, focusField = "edge-label", returnFocus = null, originNodeContext = null } = {}) {
  if (!requireMutation("edit connections")) return;
  cancelPendingShareLoad();
  const project = activeProject();
  const graph = project?.graph;
  if (!project || !graph?.nodes.length) { showToast("Add a component before creating a connection.", "error"); return; }
  if (originNodeContext) {
    const originNode = graph.nodes.find((node) => node.id === originNodeContext.nodeId);
    if (!nodeContextIsCurrent(project, originNode, originNodeContext) || sourceId !== originNodeContext.nodeId) {
      focusGraphTarget({ element: returnFocus, fallbackGraph: true });
      showToast("The component changed. Reopen its context menu before connecting from it.", "error");
      return;
    }
  }
  const edge = edgeId ? graph.edges.find((item) => item.id === edgeId) : null;
  if (edgeId && !edge) { showToast("That connection no longer exists.", "error"); return; }
  editingEdgeId = edge?.id || null;
  edgeEditContext = { projectId: project.id, graphRef: graph, edgeId: edge?.id || null, edgeSnapshot: edge ? { ...edge } : null, originNodeContext };
  fillNodeChoices(byId("edge-source"), edge?.source || sourceId || graph.nodes[0].id, graph);
  byId("edge-source").disabled = Boolean(originNodeContext);
  fillNodeChoices(byId("edge-target"), edge?.target || targetId || graph.nodes[Math.min(1, graph.nodes.length - 1)].id, graph);
  byId("edge-label").value = edge?.label || "";
  byId("edge-type").value = edge?.type || "";
  byId("edge-modal-title").textContent = edge ? "Edit connection" : "Add connection";
  byId("edge-modal").querySelector(".modal-head p").textContent = edge ? "Update this relationship or reconnect one endpoint. Changes apply only when saved." : "Describe how two components interact. Changes apply only when saved.";
  byId("edge-error").hidden = true;
  byId("delete-edge").hidden = !edge;
  setDialogFocusTarget("edge-modal", returnFocus ? { element: returnFocus, fallbackGraph: true } : { edgeId: edge?.id || null, fallbackGraph: true });
  byId("edge-modal").showModal();
  byId(focusField)?.focus({ preventScroll: true });
}
function saveEdge() {
  if (!requireMutation("edit connections")) return;
  const context = edgeEditContext;
  const project = context && projectById(context.projectId);
  if (!context || !project || activeProject() !== project || project.graph !== context.graphRef) {
    byId("edge-error").textContent = "The map changed while this form was open. Reopen the editor before saving.";
    byId("edge-error").hidden = false;
    return;
  }
  const graph = project.graph;
  const source = byId("edge-source").value;
  const target = byId("edge-target").value;
  if (!source || !target || !graph.nodes.some((node) => node.id === source) || !graph.nodes.some((node) => node.id === target)) {
    byId("edge-error").textContent = "Choose two components that still exist in this map.";
    byId("edge-error").hidden = false;
    return;
  }
  if (context.originNodeContext) {
    const originNode = graph.nodes.find((node) => node.id === context.originNodeContext.nodeId);
    if (!nodeContextIsCurrent(project, originNode, context.originNodeContext) || source !== context.originNodeContext.nodeId) {
      byId("edge-error").textContent = "The component you started from changed. Reopen its context menu before saving this connection.";
      byId("edge-error").hidden = false;
      return;
    }
  }
  const existing = context.edgeId ? graph.edges.find((item) => item.id === context.edgeId) : null;
  if (context.edgeId && !sameEdgeSnapshot(existing, context.edgeSnapshot)) {
    byId("edge-error").textContent = "This connection changed while the form was open. Reopen it before saving.";
    byId("edge-error").hidden = false;
    return;
  }
  if (!existing && graph.edges.length >= LIMITS.edges) {
    byId("edge-error").textContent = "Maps support up to " + LIMITS.edges + " connections.";
    byId("edge-error").hidden = false;
    return;
  }
  const edge = {
    ...(existing || {}),
    id: existing?.id || newEdgeId(graph.edges),
    source, target,
    label: byId("edge-label").value.trim(),
    type: byId("edge-type").value.trim(),
  };
  const nextEdges = existing ? graph.edges.map((item) => item.id === existing.id ? edge : item) : [...graph.edges, edge];
  let candidate;
  try { candidate = normalizeEditableGraph({ ...graph, edges: nextEdges }, { baselineGraph: graph }); }
  catch (error) {
    byId("edge-error").textContent = error instanceof Error ? error.message : "This connection would make the map too large to save.";
    byId("edge-error").hidden = false;
    return;
  }
  project.graph = candidate;
  project.updatedAt = Date.now();
  selectedEdgeId = edge.id;
  setDialogFocusTarget("edge-modal", { edgeId: edge.id, fallbackGraph: true });
  byId("edge-modal").close();
  edgeEditContext = null;
  animateStructure = true;
  renderAll();
  fitGraph(true);
  persist();
}
function confirmDeleteEdgeSnapshot(context, returnFocus = null) {
  if (!requireMutation("delete connections")) return;
  const project = projectById(context?.projectId);
  const edge = project?.graph.edges.find((item) => item.id === context.edgeId);
  if (!project || activeProject() !== project || project.graph !== context.graphRef || !sameEdgeSnapshot(edge, context.edgeSnapshot)) {
    showToast("That connection changed before it could be deleted.", "error");
    return;
  }
  openConfirm("Delete this connection?", "This relationship will be removed from the current map.", "Delete connection", () => {
    if (!requireMutation("delete connections")) return;
    const currentProject = projectById(context.projectId);
    const currentEdge = currentProject?.graph.edges.find((item) => item.id === context.edgeId);
    if (!currentProject || activeProject() !== currentProject || currentProject.graph !== context.graphRef || !sameEdgeSnapshot(currentEdge, context.edgeSnapshot)) {
      showToast("That connection changed before it could be deleted.", "error");
      return;
    }
    currentProject.graph.edges = currentProject.graph.edges.filter((item) => item.id !== context.edgeId);
    currentProject.updatedAt = Date.now();
    if (selectedEdgeId === context.edgeId) selectedEdgeId = null;
    animateStructure = true;
    renderAll();
    fitGraph(true);
    persist();
  }, returnFocus ? { element: returnFocus, edgeId: context.edgeId, fallbackGraph: true } : { edgeId: context.edgeId, fallbackGraph: true });
}
function confirmEdgeDelete() {
  if (!requireMutation("delete connections")) return;
  const context = edgeEditContext;
  if (!context?.edgeId) return;
  const returnFocus = dialogFocusTargets.get("edge-modal") || { edgeId: context.edgeId, fallbackGraph: true };
  dialogFocusTargets.delete("edge-modal");
  byId("edge-modal").close();
  edgeEditContext = null;
  confirmDeleteEdgeSnapshot(context, returnFocus.element || null);
}
function openConfirm(title, copy, actionLabel, callback, returnFocus = null, inheritedShareLoad = null) {
  confirmResumeShareLoad = shareLoadTracker.interruptPending() || shareLoadTracker.transfer(inheritedShareLoad);
  byId("confirm-title").textContent = title;
  byId("confirm-copy").textContent = copy;
  byId("confirm-action").textContent = actionLabel;
  confirmAction = callback;
  setDialogFocusTarget("confirm-modal", returnFocus || { fallbackGraph: true });
  byId("confirm-modal").showModal();
}
function currentImportTab() {
  return byId("file-panel").hidden ? "paste" : "file";
}
function prepareImportDialog() {
  if (actionGate.isBusy("import-submit")) { showToast("An import is still finishing. Please wait."); return false; }
  importDialogContext = { destination: libraryMode, ownerUid: libraryMode === "cloud" ? currentAccountUid() : "" };
  const cloud = importDialogContext.destination === "cloud";
  byId("import-destination-hint").textContent = cloud
    ? "This map will be imported directly to your Cloud Workspace. No local workspace will be created."
    : "Your data is validated and stored locally in this browser.";
  byId("import-submit-label").textContent = cloud ? "Import to cloud" : "Import map";
  byId("import-description").textContent = cloud
    ? "Paste JSON or choose a file to import directly into your Cloud Workspace."
    : "Paste a JSON map, choose a file, or drop one anywhere on the canvas.";
  cancelPendingShareLoad();
  importReadGate.invalidate();
  byId("import-error").hidden = true;
  byId("json-input").value = "";
  selectedFile = null;
  byId("json-file").value = "";
  byId("selected-file").textContent = "No file selected";
  switchImportTab("paste");
  byId("import-modal").showModal();
  byId("json-input").focus();
  return true;
}
function openImport() {
  if (!requireImport()) return;
  droppedFileGate.invalidate();
  prepareImportDialog();
}
function openImportFromDrop(token) {
  if (!droppedFileGate.isCurrent(token) || !canImportCurrent()) return false;
  return prepareImportDialog();
}
function switchImportTab(name) {
  importReadGate.invalidate();
  document.querySelectorAll("[data-import-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.importTab === name));
  byId("paste-panel").hidden = name !== "paste";
  byId("file-panel").hidden = name !== "file";
}
function importError(message) {
  byId("import-error").textContent = message;
  byId("import-error").hidden = false;
}
async function readSelectedFile(file) {
  if (file.size > MAX_IMPORT_BYTES) throw new Error("This JSON file is larger than the 2 MB import limit.");
  if (!file.name.toLowerCase().endsWith(".json") && file.type && !file.type.includes("json")) {
    throw new Error("Choose a .json architecture file.");
  }
  return await file.text();
}
function submitImport() {
  if (!requireImport() || !importDialogContext || actionGate.isBusy("import-submit")) return;
  const context = importDialogContext;
  if (libraryMode !== context.destination || (context.destination === "cloud" && currentAccountUid() !== context.ownerUid)) {
    importError("The workspace destination or account changed. Close this dialog and open Import architecture again.");
    return;
  }
  void runButtonAction(byId("import-submit"), "import-submit", context.destination === "cloud" ? "Importing…" : "Reading…", async () => {
    const request = importReadGate.begin();
    const dialog = byId("import-modal");
    const tab = currentImportTab();
    const file = selectedFile;
    const pastedText = byId("json-input").value;
    const controls = [...dialog.querySelectorAll('#json-input, #json-file, [data-import-tab]')].map(element => ({ element, disabled: element.disabled }));
    controls.forEach(({ element }) => { element.disabled = true; });
    dialog.setAttribute("aria-busy", "true");
    byId("import-error").hidden = true;
    const current = () => importDialogContext === context && importReadGate.isCurrent(request) && dialog.open
      && currentImportTab() === tab && libraryMode === context.destination && canImportCurrent()
      && (context.destination !== "cloud" || currentAccountUid() === context.ownerUid);
    let cloudSaved = false;
    try {
      const source = await readImportSource({ tab, pastedText, file, readFile: readSelectedFile, token: request, isCurrent: importReadGate.isCurrent });
      if (source === null || !current()) {
        if (dialog.open && importDialogContext === context && context.destination === "cloud" && currentAccountUid() !== context.ownerUid) {
          importError("Your account changed. Reopen Import architecture to choose the destination account.");
        }
        return;
      }
      if (!source.trim()) throw new Error("Paste a JSON map or choose a JSON file first.");
      const graph = normalizeEditableGraph(source);
      if (context.destination === "cloud") {
        if (!preserveDirtyOwnerDraftForNavigation()) throw new Error("Save or export your pending edits before importing another map.");
        cloudLibraryFirstSelection.cancel();
        const result = await cloudImportController.importMap({ graph, ownerUid: context.ownerUid, isCurrent: current });
        if (result.status !== "saved") {
          if (dialog.open && importDialogContext === context && currentAccountUid() !== context.ownerUid) {
            importError("Your account changed. Reopen Import architecture to choose the destination account.");
          }
          return;
        }
        cloudSaved = true;
        if (!current() || !result.current) {
          showToast("Cloud import completed in the account that started it. No local workspace was created.");
          return;
        }
        const openCreated = preserveDirtyOwnerDraftForNavigation();
        recoverIncomingShareFailureAfterImport();
        cancelPendingShareLoad();
        selectedFile = null;
        dialog.close();
        if (openCreated) {
          const next = new URL(location.href);
          next.searchParams.delete("view"); next.hash = "";
          history.replaceState(history.state, "", next.pathname + next.search);
          onlineRoute = false;
          selectedNodeId = null; selectedEdgeId = null;
          focusedType = ""; lockedType = ""; touchInteractionActive = false;
          excludedTypes.clear(); searchTerm = ""; byId("search").value = "";
          viewMode = "graph"; animateStructure = true;
          onlineController.adoptCreatedWorkspace({ workspace: result.workspace, graph: result.graph, expectedOwnerUid: context.ownerUid });
          renderLibrary();
        }
        showToast("Imported " + graph.nodes.length + " components to Cloud Workspace.");
        return;
      }
      if (isOnlineSession() && !returnToLocalWorkspace()) throw new Error("Save or export your pending edits before importing another map.");
      recoverIncomingShareFailureAfterImport();
      cancelPendingShareLoad();
      const project = makeProject(graph);
      projects.unshift(project);
      activeId = project.id;
      viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
      selectedNodeId = null; selectedEdgeId = null;
      focusedType = ""; lockedType = ""; touchInteractionActive = false;
      excludedTypes.clear();
      searchTerm = "";
      byId("search").value = "";
      selectedFile = null;
      dialog.close();
      animateStructure = true;
      renderAll();
      fitGraph(true);
      const saved = persist(false);
      if (saved) {
        showToast("Imported " + graph.nodes.length + " components. This map is stored in this browser.");
        void admitMapProject("import", project, project.id);
      } else showToast("Imported for this session, but Atlas could not save the map in this browser. Download JSON before leaving.", "error");
    } catch (error) {
      if (cloudSaved) { showToast("The map was saved to Cloud Workspace but could not be opened. Select it from the cloud list.", "error"); return; }
      if (importDialogContext !== context || !importReadGate.isCurrent(request) || !dialog.open || currentImportTab() !== tab) return;
      importError(error instanceof Error ? error.message : "The map could not be imported.");
    } finally {
      controls.forEach(({ element, disabled }) => { element.disabled = disabled; });
      dialog.setAttribute("aria-busy", "false");
    }
  });
}
async function importDroppedFile(file) {
  if (!requireImport()) return;
  const request = droppedFileGate.begin();
  const destination = libraryMode, ownerUid = currentAccountUid();
  try {
    const text = await readSelectedFile(file);
    if (!droppedFileGate.isCurrent(request) || !canImportCurrent() || libraryMode !== destination
        || (destination === "cloud" && currentAccountUid() !== ownerUid)) return;
    if (!openImportFromDrop(request)) return;
    byId("json-input").value = text;
    switchImportTab("paste");
  } catch (error) {
    if (!droppedFileGate.isCurrent(request)) return;
    showToast(error instanceof Error ? error.message : "Could not read the dropped file.", "error");
  }
}
function requestClearData() {
  if (!requireMutation("clear local data")) return;
  const unresolvedCandidate = projects.find((project) => localProjectHasUnresolvedCloudCandidate(project.id));
  if (unresolvedCandidate) {
    showToast("Resolve the pending Cloud Workspace save for " + (unresolvedCandidate.graph.project.name || "this map") + " before clearing local data.", "error");
    return;
  }
  const message = recoveryMode && recoveryText
    ? "This permanently removes the saved Project Atlas library from this browser. Download the saved-data backup first if you need to preserve it. Theme and inspector preferences remain; the workspace will be empty."
    : "This removes the saved Project Atlas library from this browser. Theme and inspector preferences remain; the workspace will be empty. You can add or import a map, or opt in to View example flow later.";
  openConfirm("Clear local data and start fresh?", message, "Clear and start fresh", () => {
    const pending = projects.find((project) => localProjectHasUnresolvedCloudCandidate(project.id));
    if (pending) {
      showToast("Resolve the pending Cloud Workspace save for " + (pending.graph.project.name || "this map") + " before clearing local data.", "error");
      return;
    }
    const route = clearLocalDataRoute(location.search);
    try {
      history.replaceState(history.state, "", location.pathname + route.search + route.hash);
    } catch {
      showToast("The current share or example route could not be cleared, so local data was left unchanged.", "error");
      return;
    }
    shareLoadTracker.cancel();
    clearIncomingShareFailure();
    confirmResumeShareLoad = null;
    const result = clearLibrary();
    if (!result.ok) { showToast(result.error, "error"); return; }
    recoveryMode = false;
    recoveryText = "";
    lastStorageError = "";
    editHistory.clear("local:");
    for (const project of projects) mapAdmissionController.forget({ projectId: project.id });
    projects = [];
    cloudAssociations = {};
    saveCloudAssociations();
    activeId = "";
    viewMode = "graph";
    selectedNodeId = null;
    selectedEdgeId = null;
    touchSelectedEdge = null;
    focusedType = "";
    lockedType = "";
    excludedTypes.clear();
    filterPointerActivation = null;
    filterInputModality = "";
    touchInteractionActive = false;
    searchTerm = "";
    byId("search").value = "";
    renderAll();
    fitGraph(false);
    showToast("Local map data cleared. Your workspace is empty; add or import a map when ready.");
  });
}
function downloadRecovery() {
  if (!recoveryText) { showToast("There is no readable saved-data backup available.", "error"); return; }
  downloadText(recoveryText, "project-atlas-local-data-backup.json", "application/json;charset=utf-8");
  showToast("Downloaded the raw saved-data backup. It has not been changed.");
}
async function exportCurrent(kind) {
  if (!currentWorkspaceActions().canExport) { showToast("Wait until this map is available before exporting it.", "error"); return; }
  const project = activeProject();
  const graph = project.graph;
  const snapshot = { projectId: project.id, graph, workspaceId: isOnlineSession() ? onlineState.workspaceId : "" };
  const isCurrent = () => workspaceReadSnapshotIsCurrent(snapshot, {
    canExport: currentWorkspaceActions().canExport, projectId: activeProject()?.id,
    graph: activeProject()?.graph, workspaceId: isOnlineSession() ? onlineState.workspaceId : "",
  });
  const name = safeFilename(graph.project.name);
  if (kind === "json") { exportJson(graph); showToast("Downloaded a JSON backup."); return; }
  const activeTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  if (kind === "svg") { downloadText(buildSvg(graph, activeTheme), name + ".svg", "image/svg+xml;charset=utf-8"); showToast("Downloaded a standalone SVG."); return; }
  if (kind === "png" || kind === "copy-image") {
    try {
      const blob = await svgToPngBlob(buildSvg(graph, activeTheme));
      if (!isCurrent()) { showToast("Export stopped because the map changed or became unavailable.", "error"); return; }
      if (kind === "png") {
        downloadBlob(blob, name + ".png");
        showToast("Downloaded a PNG image. Very large maps are scaled to browser-safe dimensions.");
      } else {
        await copyPng(blob);
        showToast("Copied the architecture image.");
      }
    } catch (error) {
      if (!isCurrent()) return;
      if (kind === "copy-image") {
        try {
          const blob = await svgToPngBlob(buildSvg(graph, activeTheme));
          if (!isCurrent()) return;
          downloadBlob(blob, name + ".png");
          showToast("Image clipboard access is unavailable, so the PNG was downloaded instead.");
        } catch (fallbackError) {
          showToast((fallbackError instanceof Error ? fallbackError.message : "Image export failed.") + " Use Export > Download SVG or JSON.", "error");
        }
      } else showToast((error instanceof Error ? error.message : "PNG export failed.") + " Use Export > Download SVG or JSON.", "error");
    }
  }
}

async function copyText(text, { container = document.body, isCurrent = () => true } = {}) {
  if (!isCurrent()) throw new Error("The copy context changed before the clipboard write.");
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      if (!isCurrent()) throw new Error("The copy context changed while the clipboard was writing.");
      return true;
    } catch (error) {
      if (!isCurrent()) throw error;
    }
  }
  if (!isCurrent()) throw new Error("The copy context changed before the fallback clipboard write.");
  const previousFocus = document.activeElement;
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.left = "-10000px";
  helper.style.top = "0";
  const target = container?.isConnected ? container : document.body;
  target.append(helper);
  helper.focus();
  helper.select();
  let copied = false;
  try { copied = document.execCommand("copy"); } catch {}
  helper.remove();
  if (previousFocus?.isConnected) previousFocus.focus();
  if (!copied) throw new Error("Clipboard access is blocked. Select the text and copy it manually.");
  if (!isCurrent()) throw new Error("The copy context changed during the fallback clipboard write.");
  return true;
}
function currentBaseUrl() {
  return workspaceBaseUrl(location.href);
}
function currentPrompt() {
  return buildAgentPrompt(currentBaseUrl(), isLocalShareHost(location.hostname));
}
async function copyAgentPrompt(openFallback = true) {
  const prompt = currentPrompt();
  byId("prompt-text").value = prompt;
  try {
    await copyText(prompt, { container: byId("prompt-modal").open ? byId("prompt-modal") : document.body });
    showToast("Copied the Project Atlas agent prompt.");
    return true;
  } catch (error) {
    if (openFallback && !byId("prompt-modal").open) byId("prompt-modal").showModal();
    byId("prompt-text").focus();
    byId("prompt-text").select();
    showToast("Prompt is selected. Press Ctrl+C or Command+C to copy it.", "error");
    return false;
  }
}
async function openShareDialog() {
  if (isOnlineSession()) {
    const state = onlineController.state();
    if (!currentWorkspaceActions().canShare) { showToast("Wait until this shared map is available before copying its link.", "error"); return; }
    if (!state.canEdit) {
      const url = onlineCurrentLink;
      const isCurrent = () => currentWorkspaceActions().canShare && onlineState.workspaceId === state.workspaceId && onlineCurrentLink === url;
      if (!url) return;
      try {
        await copyText(url, { isCurrent });
        if (isCurrent()) showToast("Copied the live map link.");
      } catch {
        if (!isCurrent()) return;
        cancelPendingShareLoad();
        shareDialogSequence += 1;
        shareDialogProjectId = activeProject().id;
        shareDialogProjectName = String(currentGraph().project.name || "Software project");
        byId("share-url").value = url;
        byId("share-error").hidden = true;
        byId("share-named-fallback").hidden = true;
        byId("copy-named-share-link").hidden = true;
        byId("share-warning").textContent = "This is the same live map link you opened. The owner controls updates and whether it remains shared.";
        byId("share-modal").showModal();
        byId("share-url").focus();
        byId("share-url").select();
        showToast("Link selected. Press Ctrl+C or Command+C to copy it.", "error");
      }
      return;
    }
    libraryMode = "cloud";
    renderLibrary();
    openMapSettings({ origin: "cloud", id: state.workspaceId, ownerUid: state.userUid });
    return;
  }
  if (!requireMutation("create a snapshot link")) return;
  byId("copy-named-share-link").hidden = false;
  closeMapSettings();
  cancelPendingShareLoad();
  const sequence = ++shareDialogSequence;
  const graph = currentGraph();
  shareDialogProjectId = activeId;
  shareDialogProjectName = String(graph.project.name || "Software project");
  const dialog = byId("share-modal");
  const urlInput = byId("share-url");
  const errorBox = byId("share-error");
  const warning = byId("share-warning");
  urlInput.value = "";
  byId("share-named-fallback").value = "";
  byId("share-named-fallback").hidden = true;
  errorBox.hidden = true;
  errorBox.textContent = "";
  warning.textContent = isLocalShareHost(location.hostname)
    ? "This localhost link opens only on this computer. Deploy the static app first, then share its public URL."
    : "The graph is in this URL fragment and is not sent to the app server. The link carries the graph content.";
  dialog.showModal();
  urlInput.placeholder = "Preparing link…";
  urlInput.setAttribute("aria-busy", "true");
  byId("copy-named-share-link").disabled = true;
  const finishPreparation = startButtonProgress(byId("copy-share-link"), "Preparing…");
  try {
    const url = await createShareUrl(graph, currentBaseUrl());
    if (sequence !== shareDialogSequence || !dialog.open) return;
    urlInput.value = url;
  } catch (error) {
    if (sequence !== shareDialogSequence || !dialog.open) return;
    errorBox.textContent = (error instanceof Error ? error.message : "Could not create a share link.") + " Use Export > Download JSON as a fallback.";
    errorBox.hidden = false;
  } finally {
    finishPreparation();
    if (sequence === shareDialogSequence) {
      urlInput.setAttribute("aria-busy", "false");
      byId("copy-share-link").disabled = !urlInput.value;
      byId("copy-named-share-link").disabled = !urlInput.value;
    }
  }
}
function captureShareCopySnapshot() {
  return {
    dialogSequence: shareDialogSequence,
    dialogOpen: byId("share-modal").open,
    projectId: shareDialogProjectId,
    projectName: shareDialogProjectName,
    url: byId("share-url").value,
  };
}
function shareCopySnapshotIsCurrent(snapshot) {
  if (isOnlineSession() && (!currentWorkspaceActions().canShare || onlineCurrentLink !== snapshot.url)) return false;
  return isNamedLinkSnapshotCurrent(snapshot, {
    dialogSequence: shareDialogSequence,
    dialogOpen: byId("share-modal").open,
    projectId: activeProject()?.id || "",
    projectName: String(activeProject()?.graph.project.name || "Software project"),
    url: byId("share-url").value,
  });
}
async function copyShareLink() {
  if (!currentWorkspaceActions().canShare) return;
  const input = byId("share-url");
  const snapshot = captureShareCopySnapshot();
  if (!snapshot.url) {
    byId("share-error").textContent = byId("share-error").textContent || "No share link is ready. Download a JSON backup instead.";
    byId("share-error").hidden = false;
    return;
  }
  if (!shareCopySnapshotIsCurrent(snapshot)) return;
  try {
    await copyText(snapshot.url, { container: byId("share-modal"), isCurrent: () => shareCopySnapshotIsCurrent(snapshot) });
    if (shareCopySnapshotIsCurrent(snapshot)) showToast("Copied a link that opens this interactive map.");
  } catch {
    if (!shareCopySnapshotIsCurrent(snapshot)) return;
    input.focus();
    input.select();
    showToast("Share link is selected. Press Ctrl+C or Command+C to copy it.", "error");
  }
}
async function copyNamedShareLink() {
  if (!currentWorkspaceActions().canShare) return;
  const snapshot = captureShareCopySnapshot();
  if (!snapshot.url) {
    byId("share-error").textContent = byId("share-error").textContent || "No share link is ready. Download a JSON backup instead.";
    byId("share-error").hidden = false;
    return;
  }
  if (!shareCopySnapshotIsCurrent(snapshot)) return;
  let payload;
  try { payload = namedLinkPayload(snapshot.projectName, snapshot.url); }
  catch (error) {
    if (shareCopySnapshotIsCurrent(snapshot)) {
      byId("share-error").textContent = error instanceof Error ? error.message : "Could not format a named link. Use Copy link for the full URL.";
      byId("share-error").hidden = false;
    }
    return;
  }
  const namedFallback = byId("share-named-fallback");
  try {
    const mode = await writeNamedLinkClipboard(payload, {
      isCurrent: () => shareCopySnapshotIsCurrent(snapshot),
      writePlain: (text) => {
        if (!shareCopySnapshotIsCurrent(snapshot)) throw new Error("The share dialog changed.");
        return copyText(text, { container: byId("share-modal"), isCurrent: () => shareCopySnapshotIsCurrent(snapshot) });
      },
    });
    if (mode === "stale" || !shareCopySnapshotIsCurrent(snapshot)) return;
    namedFallback.hidden = true;
    showToast(mode === "rich" ? "Copied a named rich-text link and Markdown link." : "Copied a named Markdown link.");
  } catch {
    if (!shareCopySnapshotIsCurrent(snapshot)) return;
    try {
      await copyText(snapshot.url, { container: byId("share-modal"), isCurrent: () => shareCopySnapshotIsCurrent(snapshot) });
      if (!shareCopySnapshotIsCurrent(snapshot)) return;
      namedFallback.hidden = true;
      showToast("Named-link formatting was unavailable, so the full map link was copied.");
    } catch {
      if (!shareCopySnapshotIsCurrent(snapshot)) return;
      namedFallback.value = payload.markdown;
      namedFallback.hidden = false;
      namedFallback.focus();
      namedFallback.select();
      showToast("Named Markdown is selected. Press Ctrl+C or Command+C to copy it, or use Copy link for the full URL.", "error");
    }
  }
}
function showIncomingShareFailure(fragment, message) {
  incomingShareFailure = { fragment, message };
  byId("incoming-share-message").textContent = message;
  byId("incoming-share-context").textContent = shareFailureContext(Boolean(activeProject()));
  byId("incoming-share-error").hidden = false;
}
function clearIncomingShareFailure() {
  incomingShareFailure = null;
  byId("incoming-share-error").hidden = true;
  byId("incoming-share-message").textContent = "";
  byId("incoming-share-context").textContent = "";
}
function recoverIncomingShareFailureAfterImport() {
  const failure = incomingShareFailure;
  if (!failure) return;
  const route = clearRejectedShareRoute(location.search, location.hash, failure.fragment);
  if (!route) {
    clearIncomingShareFailure();
    return;
  }
  try {
    history.replaceState(history.state, "", location.pathname + route.search + route.hash);
    clearIncomingShareFailure();
  } catch {
    showIncomingShareFailure(
      failure.fragment,
      failure.message + " The JSON map was imported, but this invalid share link could not be removed from the address bar.",
    );
  }
}
function dismissIncomingShareFailure() {
  byId("incoming-share-error").hidden = true;
}
async function openIncomingShare() {
  if (onlineRoute) return;
  const request = shareLoadTracker.begin(location.hash);
  const fragment = request.fragment;
  if (!fragment.startsWith("#map=")) {
    if (incomingShareFailure?.fragment !== fragment) clearIncomingShareFailure();
    return;
  }
  if (incomingShareFailure && incomingShareFailure.fragment !== fragment) clearIncomingShareFailure();
  try {
    const graph = await decodeShareHash(fragment);
    if (!shareLoadTracker.isCurrent(request, location.hash)) return;
    if (!graph) return;
    const admissionKey = await shareKey(fragment);
    if (!shareLoadTracker.isCurrent(request, location.hash)) return;
    let project = findSharedProject(projects, fragment);
    let createdNow = false;
    if (!project) {
      normalizeEditableGraph(graph, { baselineGraph: graph });
      project = findSharedProject(projects, fragment);
      if (!project) {
        let uniqueId = admissionKey;
        if (projects.some((item) => item.id === uniqueId)) uniqueId += "-" + createProjectId().slice(-8);
        project = makeProject(graph, uniqueId, { shareSourceHash: fragment });
        projects.unshift(project);
        createdNow = true;
      }
    }
    clearIncomingShareFailure();
    activeId = project.id;
    viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
    selectedNodeId = null;
    excludedTypes.clear();
    searchTerm = "";
    byId("search").value = "";
    animateStructure = true;
    renderAll();
    fitGraph(true);
    const savedLocally = persist();
    if (createdNow && savedLocally) {
      void admitMapProject("fragment", project, admissionKey);
    } else {
      const pending = findPendingAdmission("fragment", admissionKey);
      if (pending && (currentMapAdmissionContext?.source !== "fragment" || currentMapAdmissionContext?.key !== admissionKey)) {
        restorePendingAdmissionContext("fragment", admissionKey, project, pending);
      }
    }
    showToast(recoveryMode ? "Opened shared map in this session. Download or clear the unreadable saved library before saving." : "Opened the shared map. It is available in this browser's project library.");
  } catch (error) {
    if (!shareLoadTracker.isCurrent(request, location.hash)) return;
    showIncomingShareFailure(fragment, error instanceof Error ? error.message : "This share link could not be opened.");
  } finally {
    shareLoadTracker.finish(request);
  }
}
function bindDialogEnterSave(id, save) {
  byId(id).addEventListener("keydown", (event) => {
    if (!shouldSaveOnEnter(event)) return;
    event.preventDefault();
    save();
  });
}
function updateMotionButton() {
  const button = byId("pause-motion");
  if (!button) return;
  button.textContent = motionPaused ? "Resume flow" : "Pause flow";
  button.setAttribute("aria-pressed", String(motionPaused));
  button.title = motionPaused ? "Resume graph animations" : "Pause graph animations";
}
function toggleMotion() {
  motionPaused = !motionPaused;
  const svg = byId("graph");
  svg.classList.toggle("motion-paused", motionPaused);
  try {
    if (motionPaused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  } catch {}
  updateMotionButton();
}
function attachEvents() {
  initAccountPanel({ root: document, account: accountSession });
  initSettingsPanel({ root: document, account: accountSession });
  accountSession.subscribe((accountState) => {
    if (accountState.status === "initializing" && authInitializingInvalidatesMapSettingsTarget(mapSettingsTarget)) mapSettingsController.invalidate();
    if (accountState.status === "ready" || accountState.status === "error") {
      onlineController.syncAccountUser?.(accountState.user || null);
      mapSettingsController.invalidate();
      if (accountState.status === "ready" && accountState.user?.uid && libraryMode === "cloud") {
        void onlineController.browseLibrary();
      }
    }
    renderAutosaveAdmissionNotice();
    updateOnlineUi();
  });
  byId("workspace-library-select").addEventListener("change", (event) => selectLibraryMode(event.currentTarget.value, { selectFirst: true }));
  byId("retry-cloud-workspaces").addEventListener("click", retryCloudLibrary);
  byId("map-settings-dialog").querySelectorAll("[data-map-settings-close]").forEach((button) => {
    button.addEventListener("click", closeMapSettings);
  });
  bindDialogBackdropClose(byId("map-settings-dialog"), closeMapSettings);
  bindDialogBackdropClose(byId("project-modal"));
  bindDialogBackdropClose(byId("editor-modal"));
  byId("map-settings-dialog").addEventListener("close", () => {
    clearMapSettingsProgress();
    mapSettingsReadCancel?.();
    mapSettingsReadCancel = null;
    mapSettingsController.close();
  });
  byId("save-map-settings").addEventListener("click", () => { void saveMapSettingsDetails(); });
  byId("apply-local-online").addEventListener("click", applyPendingLocalOnline);
  byId("retry-autosave").addEventListener("click", () => runButtonAction(byId("retry-autosave"), "admission-retry:" + currentMapAdmissionContext?.project.id, "Retrying…", retryAutosaveAdmission));
  byId("return-local").addEventListener("click", returnToLocalWorkspace);
  byId("reload-online").addEventListener("click", () => {
    void runButtonAction(byId("reload-online"), "reload-online", "Checking…", reloadOnlineWorkspace);
  });
  byId("retry-online-save").addEventListener("click", () => retryOnlineSaveWithFeedback(byId("retry-online-save")));
  byId("accept-conflict-online").addEventListener("click", () => retryOnlineSaveWithFeedback(byId("accept-conflict-online"), true));
  byId("reload-online-save").addEventListener("click", () => {
    if (!onlineController.reloadRemote()) void reloadOnlineWorkspace();
  });
  bindInspectorResize();
  window.addEventListener("hashchange", () => { if (!onlineRoute) void openIncomingShare(); });
  window.addEventListener("popstate", () => {
    const viewId = onlineViewIdFromSearch(location.search);
    if (new URLSearchParams(location.search).has("view")) {
      onlineRoute = true;
      onlineWorkspaceOpen = true;
      onlineUiUnavailable = false;
      onlineWorkspace = null;
      onlineGraphProject = null;
      onlineCurrentLink = "";
      onlineTargetWorkspaceId = "";
      renderAll();
      void onlineController.openSharedView(viewId);
      void selectLibraryMode("cloud");
    } else if (onlineRoute) {
      returnToLocalWorkspace();
    } else {
      void openIncomingShare();
    }
  });
  byId("new-project").addEventListener("click", createProject);
  byId("example-flow").addEventListener("click", openFlowExample);
  byId("show-map").addEventListener("click", () => setViewMode("graph"));
  byId("show-timeline").addEventListener("click", () => setViewMode("timeline"));
  byId("open-import").addEventListener("click", openImport);
  byId("recover-share-json").addEventListener("click", openImport);
  byId("dismiss-share-error").addEventListener("click", dismissIncomingShareFailure);
  byId("edit-project").addEventListener("click", openProjectEditor);
  byId("save-project").addEventListener("click", saveProjectDetails);
  byId("delete-project").addEventListener("click", confirmProjectDelete);
  byId("node-type-preset").addEventListener("change", () => {
    const custom = byId("node-type-preset").value === "Custom";
    byId("node-type-custom").hidden = !custom;
    byId("node-type-custom").required = custom;
    if (custom) byId("node-type-custom").focus();
  });
  byId("node-chart-enabled").addEventListener("change", () => {
    byId("node-chart-fields").hidden = !byId("node-chart-enabled").checked;
  });
  byId("save-node").addEventListener("click", saveNode);
  byId("delete-node").addEventListener("click", () => confirmNodeDelete(editingNodeId));
  byId("save-edge").addEventListener("click", saveEdge);
  byId("save-branch").addEventListener("click", saveBranch);
  byId("branch-target").addEventListener("change", updateBranchTargetSnapshot);
  byId("delete-edge").addEventListener("click", confirmEdgeDelete);
  bindDialogEnterSave("project-name-input", saveProjectDetails);
  bindDialogEnterSave("node-label", saveNode);
  bindDialogEnterSave("node-type-preset", saveNode);
  bindDialogEnterSave("node-type-custom", saveNode);
  bindDialogEnterSave("edge-label", saveEdge);
  bindDialogEnterSave("edge-type", saveEdge);
  byId("add-node").addEventListener("click", () => openNodeEditor());
  byId("add-edge").addEventListener("click", () => openEdgeEditor(null, selectedNodeId));
  byId("undo-edit").addEventListener("click", () => performEditHistory("undo"));
  byId("redo-edit").addEventListener("click", () => performEditHistory("redo"));
  byId("auto-layout").addEventListener("click", autoLayout);
  byId("fit-graph").addEventListener("click", () => fitGraph(true));
  byId("zoom-in").addEventListener("click", () => {
    const rect = byId("graph-stage").getBoundingClientRect();
    zoomAt(transform.scale * 1.16, rect.width / 2, rect.height / 2);
  });
  byId("zoom-out").addEventListener("click", () => {
    const rect = byId("graph-stage").getBoundingClientRect();
    zoomAt(transform.scale / 1.16, rect.width / 2, rect.height / 2);
  });
  byId("close-inspector").addEventListener("click", () => {
    selectedNodeId = null;
    renderInspector();
    refreshTraceStyles();
  });
  byId("search").addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderGraph();
  });
  const filterGroup = byId("type-filters");
  filterGroup.addEventListener("wheel", (event) => scrollTypeFiltersWithWheel(filterGroup, event), { passive: false });
  document.addEventListener("keydown", () => { filterInputModality = "keyboard"; }, true);
  filterGroup.addEventListener("pointerdown", (event) => {
    filterInputModality = event.pointerType || filterInputModality;
    const chip = event.target.closest?.(".filter-chip");
    filterPointerActivation = chip
      ? { type: chip.dataset.type || "all", pointerType: event.pointerType, pointerId: event.pointerId }
      : null;
  });
  filterGroup.addEventListener("pointercancel", (event) => {
    if (filterPointerActivation?.pointerId === event.pointerId) filterPointerActivation = null;
  });
  filterGroup.addEventListener("pointerover", (event) => {
    const chip = event.target.closest?.(".filter-chip[data-type]");
    if (chip) {
      filterInputModality = event.pointerType || filterInputModality;
      applyTypeInteraction({ kind: "pointer-over", type: chip.dataset.type, pointerType: event.pointerType });
    }
  });
  filterGroup.addEventListener("pointerout", (event) => {
    const from = event.target.closest?.(".filter-chip[data-type]");
    if (!from) return;
    filterInputModality = event.pointerType || filterInputModality;
    const to = event.relatedTarget?.closest?.(".filter-chip[data-type]");
    if (to && filterGroup.contains(to)) {
      applyTypeInteraction({ kind: "pointer-over", type: to.dataset.type, pointerType: event.pointerType });
    } else if (!filterGroup.contains(event.relatedTarget) || from.dataset.type === focusedType) {
      applyTypeInteraction({ kind: "pointer-out", pointerType: event.pointerType });
    }
  });
  filterGroup.addEventListener("focusin", (event) => {
    const chip = event.target.closest?.(".filter-chip[data-type]");
    if (filterInputModality === "keyboard" && filterPointerActivation?.pointerType !== "touch" && chip?.matches(":focus-visible")) {
      applyTypeInteraction({ kind: "focus", type: chip.dataset.type, inputType: "keyboard" });
    }
  });
  filterGroup.addEventListener("focusout", () => queueMicrotask(() => {
    const chip = document.activeElement?.closest?.(".filter-chip[data-type]");
    const keyboardFocus = filterInputModality === "keyboard" && chip?.matches(":focus-visible");
    applyTypeInteraction({
      kind: "focus",
      type: keyboardFocus ? chip.dataset.type : "",
      inputType: filterInputModality === "keyboard" ? "keyboard" : "unknown",
    });
  }));
  byId("project-modal").addEventListener("close", () => {
    projectEditContext = null;
    const interruption = projectEditResumeShareLoad;
    projectEditResumeShareLoad = null;
    if (shareLoadTracker.shouldResume(interruption, location.hash)) void openIncomingShare();
  });
  byId("editor-modal").addEventListener("close", () => { nodeEditContext = null; restoreDialogFocus("editor-modal"); });
  byId("edge-modal").addEventListener("close", () => { edgeEditContext = null; restoreDialogFocus("edge-modal"); });
  byId("branch-modal").addEventListener("close", () => { branchEditContext = null; restoreDialogFocus("branch-modal"); });
  byId("confirm-modal").addEventListener("close", () => {
    restoreDialogFocus("confirm-modal");
    const interruption = confirmResumeShareLoad;
    confirmResumeShareLoad = null;
    if (shareLoadTracker.shouldResume(interruption, location.hash)) void openIncomingShare();
  });
  const importDialog = byId("import-modal");
  const invalidateImportReads = () => { importReadGate.invalidate(); droppedFileGate.invalidate(); importDialogContext = null; };
  importDialog.addEventListener("cancel", invalidateImportReads);
  importDialog.addEventListener("close", invalidateImportReads);
  const shareDialog = byId("share-modal");
  shareDialog.addEventListener("close", () => { if (!shareDialog.open) shareDialogSequence += 1; });
  byId("import-submit").addEventListener("click", submitImport);
  importDialog.querySelectorAll("[data-import-tab]").forEach((tab) => tab.addEventListener("click", () => switchImportTab(tab.dataset.importTab)));
  byId("json-file").addEventListener("change", (event) => {
    importReadGate.invalidate();
    selectedFile = event.target.files?.[0] || null;
    byId("selected-file").textContent = selectedFile ? selectedFile.name + " (" + Math.ceil(selectedFile.size / 1024) + " KB)" : "No file selected";
    if (selectedFile) switchImportTab("file");
  });
  document.querySelector("[data-empty-create]").addEventListener("click", () => {
    if (activeProject()) openNodeEditor();
    else createProject();
  });
  document.querySelector("[data-empty-import]").addEventListener("click", openImport);
  byId("clear-data").addEventListener("click", requestClearData);
  byId("download-recovery").addEventListener("click", downloadRecovery);
  byId("confirm-action").addEventListener("click", () => {
    const action = confirmAction;
    confirmAction = null;
    byId("confirm-modal").close();
    if (action) action();
  });
  byId("export-menu-button").addEventListener("click", () => {
    const menu = byId("export-menu");
    menu.hidden = !menu.hidden;
  });
  document.querySelectorAll("[data-export]").forEach((button) => button.addEventListener("click", async () => {
    byId("export-menu").hidden = true;
    await runButtonAction(byId("export-menu-button"), "export", button.dataset.export === "copy-image" ? "Copying…" : "Exporting…", () => exportCurrent(button.dataset.export));
  }));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".heading-actions")) byId("export-menu").hidden = true;
  });
  byId("copy-agent-prompt").addEventListener("click", (event) => {
    void runButtonAction(event.currentTarget, "clipboard", "Copying…", () => copyAgentPrompt(true));
  });
  byId("copy-prompt-text").addEventListener("click", () => runButtonAction(byId("copy-prompt-text"), "clipboard", "Copying…", () => copyAgentPrompt(false)));
  byId("share-graph").addEventListener("click", () => runButtonAction(byId("share-graph"), "share", "Preparing…", openShareDialog));
  byId("copy-share-link").addEventListener("click", () => runButtonAction(byId("copy-share-link"), "clipboard", "Copying…", copyShareLink));
  byId("copy-named-share-link").addEventListener("click", () => runButtonAction(byId("copy-named-share-link"), "clipboard", "Copying…", copyNamedShareLink));
  byId("pause-motion")?.addEventListener("click", toggleMotion);
  byId("sidebar").addEventListener("transitionend", () => localMapTip.refresh());
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", updateViewMode);
  document.addEventListener("visibilitychange", updateWorkspaceLoadingUi);
  byId("project-list").addEventListener("click", (event) => {
    if (event.target.closest(".project-row")) sidebarDrawer.setOpen(false);
  });

  const graphSvg = byId("graph");
  const graphStage = byId("graph-stage");
  const preventGraphNativeSelection = (event) => event.preventDefault();
  graphSvg.addEventListener("selectstart", preventGraphNativeSelection, true);
  graphSvg.addEventListener("dragstart", preventGraphNativeSelection);
  graphStage.addEventListener("contextmenu", (event) => {
    if (!canMutateCurrent()) { event.preventDefault(); return; }
    if (viewMode !== "graph") return;
    const target = event.target;
    if (target.closest?.(".node-card, .edge-group, .graph-controls, .graph-view-tabs, .canvas-help, #graph-context-menu, .empty-state button, .empty-state a, .empty-state input")) return;
    const onMapSurface = target.closest?.("#graph") || target.closest?.(".empty-state") || target === graphStage;
    if (!onMapSurface) return;
    event.preventDefault();
    showCanvasContextMenu(event);
  });
  byId("graph-context-menu").addEventListener("click", handleGraphMenuAction);
  byId("graph-context-menu").addEventListener("keydown", (event) => {
    const items = [...byId("graph-context-menu").querySelectorAll('[role="menuitem"]:not([hidden])')];
    if (!items.length) return;
    const index = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      items[(index + step + items.length) % items.length].focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      items[event.key === "Home" ? 0 : items.length - 1].focus();
    } else if (event.key === "Tab") {
      const returnFocus = menuReturnFocus;
      const stops = focusableElementsOutsideGraphMenu();
      const originIndex = stops.indexOf(returnFocus);
      const targetIndex = originIndex + (event.shiftKey ? -1 : 1);
      const next = originIndex >= 0 ? stops[targetIndex] : null;
      if (next) {
        event.preventDefault();
        hideGraphContextMenu();
        next.focus({ preventScroll: true });
      } else {
        hideGraphContextMenu({ restoreFocus: true });
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      hideGraphContextMenu({ restoreFocus: true });
    }
  });
  document.addEventListener("pointerdown", (event) => { if (!event.target.closest?.("#graph-context-menu")) hideGraphContextMenu(); });
  graphSvg.addEventListener("pointerdown", startPan);
  graphSvg.addEventListener("pointermove", movePointer);
  graphSvg.addEventListener("pointerup", endPointer);
  graphSvg.addEventListener("pointercancel", endPointer);
  graphSvg.addEventListener("lostpointercapture", endPointer);
  document.addEventListener("pointerup", endPointer);
  document.addEventListener("pointercancel", endPointer);
  graphSvg.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = byId("graph-stage").getBoundingClientRect();
    zoomAt(transform.scale * (event.deltaY < 0 ? 1.1 : 1 / 1.1), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  byId("graph-stage").addEventListener("dragenter", (event) => {
    if (Array.from(event.dataTransfer?.types || []).includes("Files")) {
      event.preventDefault();
      byId("drop-overlay").hidden = false;
    }
  });
  byId("graph-stage").addEventListener("dragover", (event) => {
    if (Array.from(event.dataTransfer?.types || []).includes("Files")) event.preventDefault();
  });
  byId("graph-stage").addEventListener("dragleave", (event) => {
    if (!byId("graph-stage").contains(event.relatedTarget)) byId("drop-overlay").hidden = true;
  });
  byId("graph-stage").addEventListener("drop", (event) => {
    event.preventDefault();
    byId("drop-overlay").hidden = true;
    const file = Array.from(event.dataTransfer?.files || []).find((item) => item.name.toLowerCase().endsWith(".json") || item.type.includes("json"));
    if (file) importDroppedFile(file);
    else showToast("Drop a .json architecture map onto the canvas.", "error");
  });
  document.addEventListener("keydown", (event) => {
    const historyAction = editHistoryShortcut(event);
    if (historyAction && !document.querySelector("dialog[open]") && !dragState && canMutateCurrent()) {
      event.preventDefault();
      performEditHistory(historyAction);
      return;
    }
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key.toLowerCase() === "k") {
      event.preventDefault();
      byId("search").focus();
    } else if (modifier && event.key.toLowerCase() === "i") {
      event.preventDefault();
      openImport();
    } else if (event.key === "Escape") {
      if (dragState?.kind === "connection") cancelActiveConnection();
      const menu = byId("graph-context-menu");
      if (!menu.hidden) { event.preventDefault(); hideGraphContextMenu({ restoreFocus: true }); }
      byId("export-menu").hidden = true;
    }
  });
  document.addEventListener("visibilitychange", () => {
    try {
      if (document.hidden || motionPaused) graphSvg.pauseAnimations();
      else graphSvg.unpauseAnimations();
    } catch {}
  });
}
function init() {
  const canonicalUrl = canonicalWorkspaceUrl(location.href);
  if (canonicalUrl !== location.href) history.replaceState(history.state, "", canonicalUrl);
  attachEvents();
  const prompt = currentPrompt();
  byId("prompt-text").value = prompt;
  const hasOnlineView = new URLSearchParams(location.search).has("view");
  const openExample = !hasOnlineView && isFlowExampleRoute(location.search, location.hash);
  if (hasOnlineView) {
    onlineRoute = true;
    onlineWorkspaceOpen = true;
    onlineGraphProject = null;
    renderAll();
    byId("online-route-title").textContent = "Opening online workspace";
    byId("online-route-message").textContent = "Loading the online map. Local maps are not displayed on this route.";
    void onlineController.openSharedView(onlineViewIdFromSearch(location.search));
    void selectLibraryMode("cloud");
  } else if (openExample) openFlowExample();
  const search = consumeFlowExampleQuery(location.search);
  if (search !== location.search && !hasOnlineView) {
    history.replaceState(history.state, "", location.pathname + search + location.hash);
  }
  if (!openExample && !hasOnlineView) {
    viewMode = isFlowExample(activeProject()) ? "timeline" : "graph";
    renderAll();
    requestAnimationFrame(() => fitGraph(false));
    void openIncomingShare();
    if (hasAccountSessionHint()) {
      void accountSession.initialize().then((accountState) => {
        onlineController.syncAccountUser?.(accountState.user || null);
        if (accountState.user?.uid) return onlineController.enableOnline();
        return null;
      }).catch(() => {});
    }
    const active = activeProject();
    const pending = active ? Object.entries(cloudAssociations).find(([projectId, record]) =>
      projectId === active.id && record?.pending === true) : null;
    if (active && pending) restorePendingAdmissionContext(pending[1].source, pending[1].key, active, pending[1]);
  }
  updateMotionButton();
  if (recoveryMode) {
    showToast(recoveryText
      ? "Saved data could not be read. Download the raw backup or deliberately clear local data before saving changes."
      : "Browser storage is unavailable. Changes stay in this session; use Export to keep a backup.", "error");
  }
}
init();

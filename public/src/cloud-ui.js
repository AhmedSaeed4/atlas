import { createCloudOwnerCache } from "./cloud-owner-cache.js";

const ONLINE_ENABLED_KEY = "atlas.online.enabled.v1";
const json = (value) => JSON.stringify(value);
const clone = (value) => globalThis.structuredClone ? structuredClone(value) : JSON.parse(json(value));
const codeOf = (error) => String(error?.code || error?.status || "error").replace(/^cloud\//, "");
const ownerIdOf = (workspace) => String(workspace?.ownerId || workspace?.ownerUID || "");

export function readOnlineEnabled(storage) {
  try { return storage?.getItem(ONLINE_ENABLED_KEY) === "true"; }
  catch { return false; }
}

export function writeOnlineEnabled(storage, enabled) {
  try {
    if (enabled) storage?.setItem(ONLINE_ENABLED_KEY, "true");
    else storage?.removeItem(ONLINE_ENABLED_KEY);
    return true;
  } catch { return false; }
}

export function onlineViewIdFromSearch(search) {
  try {
    const id = new URLSearchParams(search || "").get("view") || "";
    return /^[A-Za-z0-9_-]{22}$/.test(id) ? id : "";
  } catch { return ""; }
}

export function resetOnlineLibraryForIdentityChange(library, previousUid, nextUid) {
  const previous = String(previousUid || "");
  const next = String(nextUid || "");
  if (previous === next) return false;
  library.snapshot = null;
  library.status = next ? "Loading your online maps." : "Sign in to see your online maps.";
  return true;
}

export function mayMutateWorkspace(mode, userUid = "", ownerUid = "") {
  if (mode === "local") return true;
  return mode === "owner" && Boolean(userUid) && userUid === ownerUid;
}

export function createCloudUiController(options = {}) {
  const loadService = options.loadService;
  const callbacks = options.callbacks || {};
  const storage = options.storage;
  const ownerCache = createCloudOwnerCache();
  const delay = Number.isFinite(options.saveDelay) ? Math.max(0, options.saveDelay) : 450;
  const setTimer = options.setTimeout || globalThis.setTimeout.bind(globalThis);
  const clearTimer = options.clearTimeout || globalThis.clearTimeout.bind(globalThis);

  let service = null;
  let servicePromise = null;
  let serviceEpoch = 0;
  let authUnsubscribe = null;
  let libraryUnsubscribe = null;
  let libraryUid = "";
  let latestLibraryResult = null;
  let workspaceUnsubscribe = null;
  let enabled = readOnlineEnabled(storage);
  let user = null;
  let mode = "local";
  let workspace = null;
  let workspaceId = "";
  let sharedId = "";
  let context = null;
  let scope = 0;
  let flowEpoch = 0;
  let saveEpoch = 0;
  let libraryEpoch = 0;
  let inFlightFingerprint = "";
  let explicitViewRoute = false;
  let status = "local";
  let timer = null;
  let queuedSave = null;
  let saving = false;
  let dirty = false;
  let expectedRevision = null;
  let savedFingerprint = "";
  let latestRemote = null;
  let conflictError = null;
  let routeUnavailable = false;
  let stalePreview = false;

  const canEditCurrent = () => !stalePreview && (!explicitViewRoute || mode === "owner")
    && !workspace?.deleting
    && mayMutateWorkspace(mode, user?.uid, ownerIdOf(workspace));
  const state = () => ({
    enabled, user: user ? { ...user } : null, userUid: user?.uid || "", mode,
    workspace: workspace ? { ...workspace } : null, workspaceId, sharedId,
    ownerUid: ownerIdOf(workspace), status, routeUnavailable, dirty, stalePreview,
    canEdit: canEditCurrent(), canDelete: Boolean(user?.uid && ownerIdOf(workspace) && user.uid === ownerIdOf(workspace)),
    inOnlineRoute: Boolean(context) || explicitViewRoute,
  });
  const emit = () => callbacks.onState?.(state());
  const emitSave = (value) => callbacks.onSaveStatus?.(value);
  const stopWatch = () => { try { workspaceUnsubscribe?.(); } catch {} workspaceUnsubscribe = null; };
  const stopLibrary = () => { libraryEpoch += 1; try { libraryUnsubscribe?.(); } catch {} libraryUnsubscribe = null; libraryUid = ""; latestLibraryResult = null; };
  const cancelSaveWork = (reason = "") => {
    const alreadySending = saving;
    if (timer !== null) clearTimer(timer);
    timer = null;
    queuedSave = null;
    saveEpoch += 1;
    inFlightFingerprint = "";
    saving = false;
    dirty = false;
    conflictError = null;
    if (reason) emitSave({
      status: alreadySending ? "in-flight" : "cancelled",
      message: alreadySending
        ? "A save request already sent may finish on the previous workspace; later edits were discarded."
        : reason,
    });
  };
  const serviceForAction = async () => {
    if (!loadService) throw new Error("Online workspaces are unavailable because their service is not configured.");
    if (!servicePromise) {
      const loadingEpoch = serviceEpoch;
      let loadingPromise;
      loadingPromise = Promise.resolve().then(loadService).then(async (loaded) => {
        if (loadingEpoch !== serviceEpoch) {
          try { await loaded.signOut(); } catch {}
          throw new Error("Online mode changed while the service was loading.");
        }
        service = loaded;
        authUnsubscribe = service.onAuthStateChanged((nextUser) => { void handleAuthChange(nextUser); });
        return service;
      }).catch((error) => {
        if (servicePromise === loadingPromise) servicePromise = null;
        throw error;
      });
      servicePromise = loadingPromise;
    }
    return await servicePromise;
  };
  const subscribeLibrary = ({ force = false } = {}) => {
    if (!force && libraryUnsubscribe && libraryUid === user?.uid && enabled) {
      // Replay the current list when returning to Cloud; an unchanged library
      // may not emit another Firestore event.
      if (latestLibraryResult) callbacks.onLibrary?.(latestLibraryResult);
      return;
    }
    stopLibrary();
    if (!enabled || !user?.uid || typeof service?.watchOwnedWorkspaces !== "function") return;
    const uid = user.uid;
    libraryUid = uid;
    const currentEpoch = libraryEpoch;
    try {
      libraryUnsubscribe = service.watchOwnedWorkspaces((result) => {
        if (currentEpoch !== libraryEpoch || !enabled || user?.uid !== uid) return;
        if (result?.status === "ready" && Array.isArray(result.workspaces)) {
          const ids = result.workspaces.filter((item) => !item.deleting && ownerIdOf(item) === uid).map((item) => item.id);
          ownerCache.retain(uid, ids);
          if (stalePreview && !ids.includes(workspaceId)) applyWatchEvent({ status: "deleted" }, scope, workspaceId);
        }
        if (result?.status !== "loading" || !latestLibraryResult) latestLibraryResult = result;
        callbacks.onLibrary?.(result);
      });
    } catch (error) { callbacks.onLibrary?.({ status: "error", error }); }
  };
  const applyWatchEvent = (event, currentScope, watchedId) => {
    if (currentScope !== scope || workspaceId !== watchedId) return;
    const eventStatus = String(event?.status || "error");
    if (eventStatus === "ready" && event.workspace && event.graph) {
      const incoming = { workspace: event.workspace, graph: event.graph };
      const fingerprint = json(event.graph);
      const ownerMatch = Boolean(user?.uid && ownerIdOf(event.workspace) && user.uid === ownerIdOf(event.workspace));
      stalePreview = false;
      if (context?.kind === "owned" && !explicitViewRoute && ownerMatch) ownerCache.put({ userUid: user.uid, workspace: event.workspace, graph: event.graph, serverValidated: true });
      else ownerCache.remove(user?.uid, watchedId);
      // Matching owners edit the live workspace immediately, including on a shared route.
      mode = ownerMatch ? "owner" : "viewer";
      if (!ownerMatch && !event.workspace.shared) {
        status = "permission-denied";
        routeUnavailable = true;
        workspace = null;
        workspaceId = "";
        sharedId = "";
        context = null;
        mode = explicitViewRoute ? "viewer" : "local";
        latestRemote = null;
        cancelSaveWork();
        stopWatch();
        callbacks.onUnavailable?.({ status: "permission-denied", message: "This private online map is only available to its owner." });
        emit();
        return;
      }
      const isDirty = dirty || Boolean(queuedSave) || saving;
      latestRemote = incoming;
      if (workspace?.deleting || event.workspace.deleting) {
        workspace = { ...event.workspace };
        status = "delete-incomplete";
        routeUnavailable = false;
        mode = ownerMatch ? "owner" : "viewer";
        callbacks.onWorkspace?.({ ...incoming, apply: false, ownerMatch, mode, localProjectId: context?.localProjectId || "" });
        emit();
        return;
      }
      if (mode === "owner" && ownerMatch && saving && fingerprint === inFlightFingerprint) {
        workspace = { ...event.workspace };
        expectedRevision = event.workspace.currentRevision ?? expectedRevision;
        savedFingerprint = fingerprint;
        status = "ready";
        callbacks.onWorkspace?.({ ...incoming, apply: false, ownerMatch, mode, localProjectId: context?.localProjectId || "" });
        emit();
        return;
      }
      if (mode === "owner" && ownerMatch && isDirty && savedFingerprint && fingerprint !== savedFingerprint) {
        conflictError = Object.assign(new Error("The online copy changed in another session."), {
          code: "conflict", actual: event.workspace.currentRevision,
        });
        status = "conflict";
        emitSave({ status: "conflict", error: conflictError, retryAvailable: true, reloadAvailable: true });
        callbacks.onWorkspace?.({ ...incoming, apply: false, ownerMatch, mode, localProjectId: context?.localProjectId || "" });
        emit();
        return;
      }
      workspace = { ...event.workspace };
      expectedRevision = event.workspace.currentRevision ?? expectedRevision;
      if (mode !== "owner" || !isDirty || !ownerMatch) {
        savedFingerprint = fingerprint;
        dirty = false;
      }
      status = "ready";
      routeUnavailable = false;
      callbacks.onWorkspace?.({ ...incoming, apply: mode !== "owner" || !isDirty, ownerMatch, mode, localProjectId: context?.localProjectId || "" });
      emit();
      return;
    }
    if (eventStatus === "loading") {
      status = "loading";
      if (latestRemote && mode === "viewer") {
        callbacks.onWorkspaceStatus?.({
          status: "loading",
          stale: true,
          message: "Waiting for server confirmation. Showing the last confirmed version as stale.",
        });
      }
      emit();
      return;
    }
    if (eventStatus === "offline") {
      if (stalePreview) { ownerCache.remove(user?.uid, watchedId); stalePreview = false; }
      status = "offline";
      if (!latestRemote) {
        routeUnavailable = true;
        callbacks.onUnavailable?.({ status: "offline", message: "This online workspace is unavailable while offline." });
      } else {
        callbacks.onWorkspaceStatus?.({ status: "offline", message: "Connection lost. Showing the last received version; updates are unavailable." });
      }
      emit();
      return;
    }
    if (["revoked", "deleted", "not-found", "permission-denied", "disabled", "error"].includes(eventStatus)) {
      stalePreview = false;
      ownerCache.remove(user?.uid, watchedId);
      status = eventStatus;
      routeUnavailable = true;
      workspace = null;
      workspaceId = "";
      sharedId = "";
      context = null;
      mode = explicitViewRoute ? "viewer" : "local";
      cancelSaveWork();
      stopWatch();
      const message = event.message || event.error?.message || (eventStatus === "revoked"
        ? "This online link is no longer shared."
        : eventStatus === "deleted" || eventStatus === "not-found"
          ? "This online workspace is no longer available."
          : eventStatus === "permission-denied"
            ? "You do not have access to this online workspace."
            : eventStatus === "disabled"
              ? "Online workspaces are not configured for this site."
              : "The online workspace could not be loaded.");
      callbacks.onUnavailable?.({ status: eventStatus, message });
      emit();
      return;
    }
    status = eventStatus;
    emit();
  };
  const startWatch = async (currentScope) => {
    if (!context?.workspaceId) return;
    const target = { workspaceId: context.workspaceId };
    if (context.sharedId) target.sharedId = context.sharedId;
    try {
      await serviceForAction();
      if (currentScope !== scope || !context || workspaceId !== target.workspaceId) return;
      stopWatch();
      const capturedId = target.workspaceId;
      workspaceUnsubscribe = service.watchWorkspace(target, (event) => applyWatchEvent(event, currentScope, capturedId));
    } catch (error) {
      if (currentScope !== scope) return;
      applyWatchEvent({ status: codeOf(error), error }, currentScope, target.workspaceId);
    }
  };
  async function handleAuthChange(nextUser) {
    const safeUser = nextUser?.uid ? {
      uid: String(nextUser.uid), displayName: String(nextUser.displayName || ""),
      email: String(nextUser.email || ""), photoURL: String(nextUser.photoURL || ""),
    } : null;
    ownerCache.setIdentity(safeUser?.uid || "");
    if ((safeUser?.uid || "") === (user?.uid || "")) { user = safeUser; emit(); return; }
    const currentScope = ++scope;
    stalePreview = false;
    stopWatch();
    cancelSaveWork("Account changed; pending online edits were discarded.");
    user = safeUser;
    const stillOwner = Boolean(user?.uid && ownerIdOf(workspace) && user.uid === ownerIdOf(workspace));
    if (mode === "owner" && !stillOwner) mode = "viewer";
    if (workspace && !workspace.shared && !stillOwner) {
      workspace = null;
      latestRemote = null;
      status = "permission-denied";
      routeUnavailable = true;
      callbacks.onUnavailable?.({ status: "permission-denied", message: "This private online map is only available to its owner." });
    }
    subscribeLibrary();
    emit();
    if (context?.workspaceId) void startWatch(currentScope);
  }
  const beginWorkspace = async ({ id, shared = false, localProjectId = "", kind = "owned" }) => {
    stalePreview = false;
    scope += 1;
    flowEpoch += 1;
    const currentScope = scope;
    stopWatch();
    cancelSaveWork("Online workspace changed; pending edits were not sent.");
    workspace = null;
    workspaceId = id;
    sharedId = shared ? id : "";
    context = { workspaceId: id, sharedId: shared ? id : "", localProjectId, kind };
    explicitViewRoute = Boolean(shared);
    mode = "viewer";
    status = "loading";
    routeUnavailable = false;
    expectedRevision = null;
    savedFingerprint = "";
    latestRemote = null;
    emit();
    stalePreview = false;
    callbacks.onWorkspaceLoading?.({ workspaceId: id, shared: Boolean(shared) });
    const preview = kind === "owned" && !shared ? ownerCache.get(user?.uid, id) : null;
    if (preview) {
      stalePreview = true;
      callbacks.onWorkspacePreview?.({ ...preview, stale: true, ownerMatch: false, mode: "viewer", localProjectId });
      emit();
    }
    await startWatch(currentScope);
  };
  const flushSave = async (currentScope = scope) => {
    if (saving || !queuedSave || !workspaceId || !canEditCurrent()) return;
    if (timer !== null) clearTimer(timer);
    timer = null;
    const request = queuedSave;
    queuedSave = null;
    saving = true;
    const currentSaveEpoch = ++saveEpoch;
    const targetWorkspaceId = workspaceId;
    inFlightFingerprint = request.fingerprint;
    status = "saving";
    emitSave({ status: "saving" });
    try {
      const activeService = await serviceForAction();
      if (currentScope !== scope || currentSaveEpoch !== saveEpoch || mode !== "owner" || workspaceId !== targetWorkspaceId) return;
      const result = await activeService.saveWorkspace({ workspaceId: targetWorkspaceId, graph: request.graph, expectedRevision });
      if (currentScope !== scope || currentSaveEpoch !== saveEpoch || mode !== "owner" || workspaceId !== targetWorkspaceId) return;
      workspace = { ...workspace, ...result };
      expectedRevision = result.currentRevision ?? result.revision ?? expectedRevision;
      savedFingerprint = request.fingerprint;
      if (queuedSave?.fingerprint === savedFingerprint) queuedSave = null;
      dirty = Boolean(queuedSave);
      conflictError = null;
      status = "ready";
      if (!dirty) emitSave({ status: "saved" });
      else scheduleFlush();
      emit();
    } catch (error) {
      if (currentScope !== scope || currentSaveEpoch !== saveEpoch) return;
      const errorCode = codeOf(error);
      if (errorCode === "conflict" || error?.name === "CloudConflictError") {
        conflictError = error;
        if (!queuedSave) queuedSave = request;
        dirty = true;
        status = "conflict";
        emitSave({ status: "conflict", error, retryAvailable: true, reloadAvailable: Boolean(latestRemote) });
      } else {
        if (!queuedSave) queuedSave = request;
        dirty = true;
        status = errorCode === "offline" ? "offline" : errorCode === "delete-incomplete" ? "delete-incomplete" : "error";
        emitSave({ status, error, retryAvailable: status === "offline" || status === "error" });
      }
      emit();
    } finally {
      if (currentSaveEpoch === saveEpoch) {
        saving = false;
        inFlightFingerprint = "";
        if (currentScope === scope) emit();
      }
    }
  };
  const scheduleFlush = () => {
    if (timer !== null) clearTimer(timer);
    const currentScope = scope;
    timer = setTimer(() => { timer = null; void flushSave(currentScope); }, delay);
  };
  const canDeleteCurrent = () => Boolean(workspaceId && user?.uid && ownerIdOf(workspace) && user.uid === ownerIdOf(workspace));

  return {
    state,
    syncAccountUser(nextUser) {
      void handleAuthChange(nextUser);
      return state();
    },
    canEdit: canEditCurrent,
    isViewer: () => mode === "viewer" || (explicitViewRoute && mode !== "owner"),
    retryLibrary() {
      if (!enabled || !user?.uid || !service) return false;
      if (typeof service.watchOwnedWorkspaces !== "function") {
        callbacks.onLibrary?.({ status: "error", error: new Error("Online map library retry is unavailable.") });
        return false;
      }
      status = "ready";
      subscribeLibrary({ force: true });
      emit();
      return true;
    },
    async enableOnline() {
      enabled = true;
      writeOnlineEnabled(storage, true);
      const requestedEpoch = serviceEpoch;
      status = "connecting";
      emit();
      try {
        await serviceForAction();
        if (requestedEpoch !== serviceEpoch || !enabled) return state();
        subscribeLibrary();
        status = "ready";
      } catch (error) {
        if (requestedEpoch !== serviceEpoch || !enabled) return state();
        status = codeOf(error);
        callbacks.onError?.(error);
      }
      emit();
      return state();
    },
    async browseLibrary() {
      // Browsing the cloud sidebar is an explicit read-only action. It activates
      // this controller for the current tab without changing stored preferences.
      enabled = true;
      const requestedEpoch = serviceEpoch;
      if (!context) { status = "connecting"; emit(); }
      try {
        await serviceForAction();
        if (requestedEpoch !== serviceEpoch || !enabled) return state();
        subscribeLibrary();
        if (!context) status = "ready";
      } catch (error) {
        if (requestedEpoch !== serviceEpoch || !enabled) return state();
        if (!context) status = codeOf(error);
        callbacks.onError?.(error);
      }
      emit();
      return state();
    },
    async disableOnline() {
      enabled = false;
      writeOnlineEnabled(storage, false);
      serviceEpoch += 1;
      stalePreview = false; ownerCache.setIdentity("");
      scope += 1;
      flowEpoch += 1;
      stopWatch(); stopLibrary();
      try { authUnsubscribe?.(); } catch {}
      authUnsubscribe = null;
      cancelSaveWork("Online mode was disabled; pending edits were not sent.");
      const oldService = service;
      service = null; servicePromise = null; user = null;
      workspace = null; workspaceId = ""; sharedId = ""; context = null;
      mode = explicitViewRoute ? "viewer" : "local"; status = "disabled"; routeUnavailable = explicitViewRoute;
      if (explicitViewRoute) callbacks.onUnavailable?.({ status: "disabled", message: "Online workspaces are disabled. Return to the local workspace to continue." });
      emit();
      try { await oldService?.signOut(); } catch (error) { callbacks.onError?.(error); }
      emit();
      return state();
    },
    async signIn() {
      if (!enabled) throw new Error("Enable online workspaces before signing in.");
      const requestedEpoch = serviceEpoch;
      const activeService = await serviceForAction();
      if (!enabled || requestedEpoch !== serviceEpoch || service !== activeService) throw new Error("Online mode changed before sign-in started.");
      const identity = await activeService.signInWithGoogle();
      if (!enabled || requestedEpoch !== serviceEpoch || service !== activeService) {
        try { await activeService.signOut(); } catch {}
        throw new Error("Online mode was disabled while sign-in was in progress.");
      }
      return identity;
    },
    async signOut() {
      stalePreview = false; ownerCache.setIdentity("");
      serviceEpoch += 1;
      const activeService = service;
      if (!activeService) servicePromise = null;
      flowEpoch += 1; scope += 1;
      stopWatch(); stopLibrary();
      cancelSaveWork("Signed out; pending online edits were discarded.");
      context = null; workspace = null; workspaceId = ""; sharedId = "";
      mode = explicitViewRoute ? "viewer" : "local";
      status = "signed-out"; routeUnavailable = explicitViewRoute;
      if (explicitViewRoute) callbacks.onUnavailable?.({ status: "signed-out", message: "You signed out. Reopen this online link to view it again." });
      emit();
      await activeService?.signOut();
    },
    async openSharedView(id) {
      if (!/^[A-Za-z0-9_-]{22}$/.test(String(id || ""))) {
        scope += 1; flowEpoch += 1; explicitViewRoute = true; stopWatch(); cancelSaveWork();
        workspace = null; workspaceId = ""; sharedId = ""; context = null;
        mode = "viewer"; status = "invalid-link"; routeUnavailable = true;
        callbacks.onUnavailable?.({ status: "invalid-link", message: "This online link is invalid." }); emit(); return;
      }
      await beginWorkspace({ id, shared: true, kind: "shared" });
    },
    async openOwnedWorkspace(id, { localProjectId = "" } = {}) {
      if (!enabled || !user?.uid) throw new Error("Sign in to Atlas before opening an owned workspace.");
      if (context?.kind === "owned" && workspaceId === String(id) && !routeUnavailable && workspaceUnsubscribe && !["offline", "error"].includes(status)) return;
      await beginWorkspace({ id: String(id), localProjectId, kind: "owned" });
    },
    forgetOwnerPreview(id) {
      const removed = ownerCache.remove(user?.uid, String(id || ""));
      if (stalePreview && workspaceId === id) applyWatchEvent({ status: "deleted" }, scope, id);
      return removed;
    },
    closeWorkspace() {
      stalePreview = false;
      scope += 1; flowEpoch += 1; explicitViewRoute = false;
      stopWatch(); cancelSaveWork("Workspace changed; pending online edits were not sent.");
      workspace = null; workspaceId = ""; sharedId = ""; context = null;
      mode = "local"; status = enabled ? "ready" : "local"; routeUnavailable = false;
      callbacks.onWorkspaceClosed?.(); emit();
    },
    enterOwnerEditMode() {
      const ownerId = ownerIdOf(workspace);
      if (!workspace || workspace.deleting || !user?.uid || !ownerId || user.uid !== ownerId) return false;
      mode = "owner";
      expectedRevision = workspace.currentRevision ?? expectedRevision;
      savedFingerprint = json(latestRemote?.graph || callbacks.getCurrentGraph?.() || {});
      dirty = false;
      emit();
      return true;
    },
    leaveOwnerEditMode() {
      if (mode !== "owner") return false;
      const remote = latestRemote;
      const localProjectId = context?.localProjectId || "";
      cancelSaveWork("Owner edit mode ended; pending edits were discarded.");
      mode = "viewer";
      status = "ready";
      if (remote) callbacks.onWorkspace?.({ ...remote, apply: true, ownerMatch: user?.uid === ownerIdOf(remote.workspace), mode, localProjectId });
      emit();
      return true;
    },
    adoptCreatedWorkspace({ workspace: created, graph, localProjectId = "", expectedOwnerUid = "" }) {
      const uid = String(user?.uid || "");
      if (!enabled || !uid || expectedOwnerUid !== uid || ownerIdOf(created) !== uid || !created?.id) {
        throw new Error("The created map belongs to a different account. Open it from its owner's Cloud Workspace.");
      }
      const snapshot = clone(graph);
      stopWatch(); cancelSaveWork();
      scope += 1; flowEpoch += 1;
      workspace = { ...created };
      workspaceId = created.id; sharedId = "";
      context = { workspaceId: created.id, sharedId: "", localProjectId, kind: "owned" };
      explicitViewRoute = false; mode = "owner"; status = "ready"; routeUnavailable = false; stalePreview = false;
      expectedRevision = created.currentRevision ?? created.revision ?? null;
      savedFingerprint = json(snapshot); latestRemote = { workspace, graph: snapshot }; dirty = false;
      callbacks.onWorkspaceCreated?.({ workspace: created, graph: snapshot, localProjectId });
      emit();
      void startWatch(scope);
      return true;
    },
    async saveOnline({ graph, localProjectId = "", workspaceId: candidateWorkspaceId = "", expectedOwnerUid = "" }) {
      if (!enabled) throw new Error("Enable online workspaces before saving a map online.");
      const myFlow = flowEpoch;
      const snapshot = clone(graph);
      if (!user?.uid) await this.signIn();
      if (myFlow !== flowEpoch) throw new Error("The selected map changed before online save completed. Start again from the intended map.");
      if (!user?.uid) throw new Error("Google sign-in did not complete.");
      const creatorUid = user.uid;
      const activeService = await serviceForAction();
      if (myFlow !== flowEpoch || user?.uid !== creatorUid) throw new Error("The account or selected map changed before online save started.");
      const created = await activeService.createWorkspace({
        name: snapshot.project?.name,
        graph: snapshot,
        workspaceId: candidateWorkspaceId,
        expectedOwnerUid: expectedOwnerUid || creatorUid,
      });
      if (myFlow !== flowEpoch || user?.uid !== creatorUid) {
        throw new Error("An online workspace was created, but the selected map or account changed before the page could associate it. It remains in the creator account's online library.");
      }
      stopWatch(); cancelSaveWork();
      workspace = { ...created, ownerId: creatorUid };
      workspaceId = created.id; sharedId = "";
      context = { workspaceId: created.id, sharedId: "", localProjectId, kind: "owned" };
      explicitViewRoute = false; mode = "owner"; status = "ready"; routeUnavailable = false;
      expectedRevision = created.currentRevision ?? created.revision ?? null;
      savedFingerprint = json(snapshot); latestRemote = { workspace, graph: snapshot }; dirty = false;
      callbacks.onWorkspaceCreated?.({ workspace: created, graph: snapshot, localProjectId });
      emit();
      void startWatch(scope);
      return created;
    },
    queueSave(graph) {
      if (!canEditCurrent() || !workspaceId) return false;
      const snapshot = clone(graph);
      const fingerprint = json(snapshot);
      if (fingerprint === savedFingerprint && !saving) {
        if (timer !== null) clearTimer(timer);
        timer = null; queuedSave = null; dirty = false;
        emitSave({ status: "saved" }); emit(); return true;
      }
      if (saving && fingerprint === inFlightFingerprint) {
        queuedSave = null;
        dirty = true;
        emitSave({ status: "saving" });
        emit();
        return true;
      }
      queuedSave = { graph: snapshot, fingerprint };
      dirty = true;
      emitSave({ status: "pending" });
      scheduleFlush();
      emit();
      return true;
    },
    async retrySave({ acceptConflict = false } = {}) {
      if (!queuedSave || !canEditCurrent()) return false;
      if (conflictError) {
        if (!acceptConflict) return false;
        const actual = conflictError.actual ?? conflictError.actualRevision;
        if (actual === undefined || actual === null) throw new Error("The latest online revision is unavailable; reload the workspace before retrying.");
        expectedRevision = actual;
        conflictError = null;
      }
      await flushSave(scope);
      return true;
    },
    reloadRemote() {
      if (!latestRemote || !workspace) return false;
      if (timer !== null) clearTimer(timer);
      timer = null; queuedSave = null; saveEpoch += 1; inFlightFingerprint = ""; saving = false; dirty = false; conflictError = null;
      workspace = { ...latestRemote.workspace };
      expectedRevision = workspace.currentRevision ?? expectedRevision;
      savedFingerprint = json(latestRemote.graph);
      status = "ready";
      emitSave({ status: "saved" });
      callbacks.onWorkspace?.({ ...latestRemote, apply: true, ownerMatch: user?.uid === ownerIdOf(workspace), mode, localProjectId: context?.localProjectId || "" });
      emit(); return true;
    },
    async setShared(enabledValue) {
      if (!canEditCurrent() || !workspaceId) throw new Error("Only the signed-in workspace owner can change sharing.");
      const targetId = workspaceId; const targetScope = scope; const targetUid = user?.uid;
      const activeService = await serviceForAction();
      const result = await activeService.setShared({ workspaceId: targetId, enabled: Boolean(enabledValue) });
      if (targetScope !== scope || targetId !== workspaceId || targetUid !== user?.uid) return { cancelled: true };
      workspace = { ...workspace, shared: Boolean(enabledValue) };
      emit(); return result;
    },
    async deleteCurrent() {
      if (!canDeleteCurrent()) throw new Error("Only the signed-in workspace owner can delete it.");
      const targetId = workspaceId; const targetScope = scope; const localProjectId = context?.localProjectId || "";
      const activeService = await serviceForAction();
      cancelSaveWork("Delete requested; pending online edits were not sent.");
      try {
        await activeService.deleteWorkspace(targetId);
      } catch (error) {
        if (codeOf(error) === "delete-incomplete" && targetScope === scope && targetId === workspaceId) {
          workspace = { ...workspace, shared: false, deleting: true };
          status = "delete-incomplete";
          emit();
        }
        throw error;
      }
      ownerCache.remove(user?.uid, targetId);
      callbacks.onWorkspaceDeleted?.({ id: targetId, localProjectId });
      if (targetScope === scope && targetId === workspaceId) this.closeWorkspace();
      return targetId;
    },
  };
}

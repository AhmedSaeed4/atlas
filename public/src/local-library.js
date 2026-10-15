import { LIBRARY_STORAGE_KEY, clearLibrary, readLibrary, writeLibrary } from "./storage.js";

const LOCK_NAME = "atlas-local-library-v1";
const changedElsewhere = () => ({ ok: false, code: "local-conflict", error: "Local maps changed in another tab. This tab has not overwritten them. Download any unsaved maps before reloading the latest library." });

// Both mechanisms serialize the synchronous check/write across same-origin tabs.
// The fallback database holds no graph data; its transaction is only a mutex.
export function createLibraryLock({ locks, database } = {}) {
  return async operation => {
    const coordinator = locks === undefined ? globalThis.navigator?.locks : locks;
    if (typeof coordinator?.request === "function") return coordinator.request(LOCK_NAME, { mode: "exclusive" }, operation);
    const localDatabase = database === undefined ? globalThis.indexedDB : database;
    if (!localDatabase) throw new Error("Safe local saving is unavailable. Keep this tab open and download a backup of your maps.");
    const db = await new Promise((resolve, reject) => {
      const request = localDatabase.open(LOCK_NAME, 1);
      let blocked = false;
      request.onupgradeneeded = () => request.result.createObjectStore("coordination");
      request.onerror = () => reject(request.error || new Error("Local save coordination is unavailable."));
      request.onblocked = () => { blocked = true; reject(new Error("Local saving is waiting for another tab. Close that tab and try again.")); };
      request.onsuccess = () => { if (blocked) request.result.close(); else resolve(request.result); };
    });
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction("coordination", "readwrite");
        let result;
        transaction.oncomplete = () => resolve(result);
        transaction.onerror = transaction.onabort = () => reject(transaction.error || new Error("Local save coordination failed."));
        const request = transaction.objectStore("coordination").get("library");
        request.onsuccess = () => {
          try { result = operation(); }
          catch (error) { transaction.abort(); reject(error); }
        };
      });
    } finally { db.close(); }
  };
}

export function createLocalLibrary({ normalizeGraph, storage, withLock = createLibraryLock(), onChange = () => {} } = {}) {
  const initial = readLibrary(normalizeGraph, { storage });
  let snapshot = initial.snapshot;
  let writable = initial.writable;
  let savedContents = JSON.stringify(initial.projects);
  let queue = Promise.resolve(), pending = 0, clearing = false, error = "", code = "";
  const target = () => storage === undefined ? globalThis.localStorage : storage;
  const state = () => Object.freeze({ pending, clearing, error, code });
  const notify = () => { try { onChange(state()); } catch { /* Presentation cannot interrupt persistence. */ } };
  const rememberResult = result => { error = result.ok ? "" : result.error; code = result.ok ? "" : result.code || "storage-error"; };
  function enqueue(operation) {
    pending++; notify();
    const run = queue.then(async () => {
      let result;
      try {
        result = await withLock(() => {
          if ((target().getItem(LIBRARY_STORAGE_KEY) || "") !== snapshot) return changedElsewhere();
          return operation();
        });
      } catch (failure) {
        result = { ok: false, code: "storage-error", error: failure?.message || "Local maps could not be saved. Download a backup before leaving this tab." };
      }
      rememberResult(result);
      return result;
    });
    queue = run.then(() => undefined, () => undefined);
    return run.finally(() => { pending--; notify(); });
  }
  return Object.freeze({
    initial, state,
    hasUnsaved: projects => JSON.stringify(projects) !== savedContents,
    synchronize(projects, { defer = false } = {}) {
      // Never replace in-flight writes, a user's open form/gesture or recovery bytes.
      if (pending || clearing || defer) return { status: "deferred" };
      if (!writable) return { status: "recovery" };
      let raw;
      try { raw = target().getItem(LIBRARY_STORAGE_KEY) || ""; }
      catch { return { status: "unavailable" }; }
      if (raw === snapshot) return { status: "unchanged" };
      const incoming = readLibrary(normalizeGraph, { storage });
      if (!incoming.writable) {
        rememberResult({ ok: false, code: "storage-error", error: "Local maps changed in another tab but could not be read. Your open maps are kept here; download a backup before reloading." });
        notify();
        return { status: "invalid" };
      }
      if (JSON.stringify(projects) !== savedContents) {
        rememberResult(changedElsewhere()); notify(); return { status: "conflict" };
      }
      snapshot = incoming.snapshot;
      savedContents = JSON.stringify(incoming.projects);
      rememberResult({ ok: true });
      notify();
      return { status: "updated", library: incoming };
    },
    save(projects, activeId) {
      if (!writable) return Promise.resolve({ ok: false, code: "recovery", error: "The saved library needs recovery. Download its original backup before deliberately clearing it; nothing was overwritten." });
      if (clearing) return Promise.resolve({ ok: false, code: "clearing", error: "Wait until clearing local maps finishes." });
      // Capture before yielding: later edits/navigation cannot change this write.
      let captured;
      try { captured = JSON.stringify({ version: 1, activeId, projects }); }
      catch { return Promise.resolve({ ok: false, code: "storage-error", error: "These local maps could not be prepared for saving. Download a backup before leaving this tab." }); }
      return enqueue(() => {
        const payload = JSON.parse(captured);
        const result = writeLibrary(payload.projects, payload.activeId, { storage });
        if (result.ok) { snapshot = captured; savedContents = JSON.stringify(payload.projects); }
        return result;
      });
    },
    clear() {
      if (clearing) return Promise.resolve({ ok: false, code: "clearing", error: "Local maps are already being cleared." });
      clearing = true;
      return enqueue(() => {
        const result = clearLibrary({ storage });
        if (result.ok) { snapshot = ""; savedContents = "[]"; writable = true; }
        return result;
      }).finally(() => { clearing = false; notify(); });
    },
    checkForChanges() {
      try {
        if ((target().getItem(LIBRARY_STORAGE_KEY) || "") !== snapshot) {
          rememberResult(changedElsewhere()); notify(); return true;
        }
      } catch { /* The next save reports blocked storage without discarding memory. */ }
      return false;
    },
  });
}

// Keep navigation and unchanged graph objects local to this tab. A storage-only
// activeId update must not switch maps, reset history or restart the graph DOM.
export function reconcileLocalLibrary(projects, activeId, incoming) {
  const prior = new Map(projects.map(project => [project.id, project]));
  const nextProjects = incoming.projects.map(project => {
    const previous = prior.get(project.id);
    if (!previous) return project;
    if (JSON.stringify(previous) === JSON.stringify(project)) return previous;
    return JSON.stringify(previous.graph) === JSON.stringify(project.graph)
      ? { ...project, graph: previous.graph } : project;
  });
  const nextActiveId = nextProjects.some(project => project.id === activeId) ? activeId : (nextProjects[0]?.id || "");
  return { projects: nextProjects, activeId: nextActiveId,
    libraryChanged: nextProjects.length !== projects.length || nextProjects.some((project, index) => project !== projects[index]),
    activeChanged: activeId !== nextActiveId || prior.get(activeId)?.graph !== nextProjects.find(project => project.id === nextActiveId)?.graph };
}

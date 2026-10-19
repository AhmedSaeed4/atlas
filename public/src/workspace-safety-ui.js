import {
  MAX_BACKUP_BYTES,
  makeLibraryBackup,
  readLibraryBackup,
} from "./library-backup.js";

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

// Owns local recovery presentation only. Callbacks retain the app's guarded
// authoritative-library writes; opening or previewing a backup never saves it.
export function initBackupTools({
  root = document,
  store,
  tabId,
  getState,
  onRestore,
  download,
  notify,
}) {
  const byId = (id) => root.getElementById(id),
    dialog = byId("backup-dialog");
  let candidate = null,
    draft = null,
    epoch = 0,
    draftLoaded = false,
    loadingDraft = false,
    fromDraft = false;
  let originalDownloaded = false,
    currentFailure = false,
    safeFingerprint = "",
    draftSequence = 0,
    priorDraft = null,
    loadTask = null,
    restoring = false;
  const error = (message) => {
    byId("backup-error").textContent = message || "";
    byId("backup-error").hidden = !message;
  };
  const canManage = () => getState().canManageLocal;
  function showDraftState(message = "") {
    const visible = Boolean(canManage() && draft);
    byId("recover-local-draft").hidden = !visible;
    byId("local-draft-note").hidden = !visible && !message;
    byId("local-draft-note").textContent =
      message ||
      (visible
        ? "Unsaved maps are available in recovery. Restore them as copies to review them safely."
        : "");
  }
  function loadDraft({ force = false } = {}) {
    if (draftLoaded || (!canManage() && !force) || !tabId)
      return Promise.resolve();
    if (loadTask) return loadTask;
    loadingDraft = true;
    const sequence = draftSequence;
    loadTask = (async () => {
      try {
        const saved = await store.readDraft(tabId);
        if (sequence === draftSequence) {
          draft = saved;
          priorDraft = saved;
        }
        draftLoaded = true;
      } finally {
        loadingDraft = false;
        loadTask = null;
        showDraftState();
      }
    })();
    return loadTask;
  }
  function invalidate() {
    candidate = null;
    byId("backup-apply").hidden = true;
    byId("backup-preview").replaceChildren();
    error("");
  }
  function open(recover = false) {
    if (!canManage()) {
      notify("Choose Local Workspace to restore a local backup.", "error");
      return;
    }
    epoch++;
    fromDraft = recover;
    originalDownloaded = false;
    invalidate();
    byId("backup-input").value = recover && draft ? draft.text : "";
    byId("backup-file").value = "";
    byId("backup-title").textContent = recover
      ? "Recover unsaved maps"
      : "Restore a backup";
    const unreadable = Boolean(getState().unreadable);
    byId("backup-unreadable").hidden = !unreadable;
    byId("backup-replace").checked = false;
    dialog.showModal();
    if (recover && draft) preview();
  }
  function preview() {
    invalidate();
    try {
      candidate = readLibraryBackup(byId("backup-input").value);
      if (!candidate.projects.length)
        throw new Error("This backup contains no maps to restore.");
      const state = getState(),
        names = new Set(
          state.projects.map((project) => project.graph.project.name),
        );
      const heading = element(
        "strong",
        "",
        "Ready to restore " +
          candidate.projects.length +
          (candidate.projects.length === 1 ? " map" : " maps"),
      );
      const copy = element(
        "p",
        "settings-copy",
        "Maps are restored as new local copies. Existing maps stay in place. Nothing is uploaded.",
      );
      const list = element("ul", "backup-map-list");
      for (const project of candidate.projects) {
        const name = project.graph.project.name;
        list.append(
          element(
            "li",
            "",
            name +
              " · " +
              project.graph.nodes.length +
              " components" +
              (names.has(name) ? " · duplicate name, restored separately" : ""),
          ),
        );
      }
      byId("backup-preview").append(heading, copy, list);
      byId("backup-apply").hidden = false;
      byId("backup-apply").textContent =
        "Restore " +
        candidate.projects.length +
        (candidate.projects.length === 1
          ? " map as a copy"
          : " maps as copies");
    } catch (failure) {
      candidate = null;
      error(failure.message);
    }
  }
  byId("backup-library").addEventListener("click", () => {
    try {
      const state = getState();
      download(
        makeLibraryBackup(state.projects, state.activeId),
        "atlas-library-backup.json",
        "application/json;charset=utf-8",
      );
      notify("Downloaded a backup of your local maps.");
    } catch (failure) {
      notify(failure.message, "error");
    }
  });
  byId("restore-library").addEventListener("click", () => open());
  byId("recover-local-draft").addEventListener("click", () => open(true));
  byId("backup-close").addEventListener("click", () => dialog.close());
  byId("backup-cancel").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    epoch++;
    candidate = null;
  });
  dialog.addEventListener("cancel", (event) => {
    if (restoring) event.preventDefault();
  });
  byId("backup-input").addEventListener("input", () => {
    epoch++;
    fromDraft = false;
    invalidate();
  });
  byId("backup-validate").addEventListener("click", preview);
  byId("backup-download-original").addEventListener("click", () => {
    const original = getState().original;
    if (original) {
      download(
        original,
        "atlas-original-unreadable-backup.json",
        "application/json;charset=utf-8",
      );
      originalDownloaded = true;
    }
  });
  byId("backup-file").addEventListener("change", async () => {
    const file = byId("backup-file").files?.[0],
      request = ++epoch;
    fromDraft = false;
    invalidate();
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) {
      error("This backup exceeds the 16 MiB limit.");
      return;
    }
    try {
      const text = await file.text();
      if (request !== epoch || !dialog.open) return;
      byId("backup-input").value = text;
      preview();
    } catch {
      if (request === epoch) error("The backup file could not be read.");
    }
  });
  byId("backup-apply").addEventListener("click", async () => {
    if (!candidate || !dialog.open) return;
    const state = getState();
    if (!state.canManageLocal) {
      error("The workspace changed. Reopen Restore backup.");
      return;
    }
    if (
      state.unreadable &&
      (!originalDownloaded || !byId("backup-replace").checked)
    ) {
      error(
        "Download the original backup and confirm replacing the unreadable library first.",
      );
      return;
    }
    const request = epoch,
      captured = candidate,
      recovery = draft,
      restoringDraft = fromDraft;
    const button = byId("backup-apply");
    restoring = true;
    error("");
    const controls = [...dialog.querySelectorAll("button,input,textarea")];
    const disabled = controls.map((control) => control.disabled);
    controls.forEach((control) => {
      control.disabled = true;
    });
    try {
      await onRestore(captured, { recover: state.unreadable });
      if (restoringDraft && recovery && tabId) {
        await store.clearDraft(tabId, recovery.text);
        draft = await store.readDraft(tabId);
        priorDraft = draft;
        currentFailure = false;
        safeFingerprint = "";
      }
      if (request === epoch && dialog.open) dialog.close();
      showDraftState();
      notify(
        "Restored " +
          captured.projects.length +
          " local " +
          (captured.projects.length === 1 ? "copy." : "copies."),
      );
    } catch (failure) {
      if (request === epoch) error(failure.message);
    } finally {
      restoring = false;
      controls.forEach((control, index) => {
        control.disabled = disabled[index];
      });
    }
  });
  return Object.freeze({
    update() {
      const state = getState();
      byId("local-backup-actions").hidden = !state.canManageLocal;
      byId("backup-library").disabled = !state.projects.length;
      showDraftState();
      void loadDraft();
    },
    async captureUnsaved(projects, activeId) {
      if (!projects.length) return false;
      if (!tabId) {
        showDraftState(
          "Recovery storage is blocked. Download this tab’s maps before leaving.",
        );
        return false;
      }
      await loadDraft({ force: true });
      const fingerprint = JSON.stringify(projects),
        request = ++draftSequence;
      const combined = structuredClone(projects),
        ids = new Set(combined.map((project) => project.id));
      // Keep a previous-session recovery until it is explicitly restored. A new
      // conflict must not silently replace that earlier unsaved version.
      if (priorDraft)
        for (const old of priorDraft.backup.projects) {
          const current = combined.find((project) => project.id === old.id);
          if (
            current &&
            JSON.stringify(current.graph) === JSON.stringify(old.graph)
          )
            continue;
          const copy = structuredClone(old);
          if (ids.has(copy.id)) copy.id = globalThis.crypto.randomUUID();
          ids.add(copy.id);
          combined.push(copy);
        }
      const result = await store.saveDraft(tabId, {
        version: 1,
        projects: combined,
        activeId,
      });
      if (request !== draftSequence) return result.ok;
      if (result.ok) {
        draft = { text: result.text, backup: readLibraryBackup(result.text) };
        currentFailure = true;
        safeFingerprint = fingerprint;
        showDraftState(
          result.mode === "tab"
            ? "Unsaved maps can be recovered after refresh in this tab. Download a backup before closing the browser."
            : "Unsaved maps are backed up in this browser. Use Recover unsaved maps to restore copies.",
        );
      } else
        showDraftState(
          "Recovery could not be saved. Download this tab’s maps before leaving.",
        );
      return result.ok;
    },
    safelyContains(projects) {
      return Boolean(
        safeFingerprint && safeFingerprint === JSON.stringify(projects),
      );
    },
    async saved() {
      if (!currentFailure || !draft || !tabId) return;
      const previous = draft,
        request = ++draftSequence;
      currentFailure = false;
      safeFingerprint = "";
      if (priorDraft) {
        const result = await store.saveDraft(tabId, {
          version: 1,
          projects: priorDraft.backup.projects,
          activeId: priorDraft.backup.activeId,
        });
        if (request === draftSequence && result.ok) draft = priorDraft;
      } else {
        await store.clearDraft(tabId, previous.text);
        if (draft === previous) draft = null;
      }
      showDraftState();
    },
  });
}

import { readLibraryBackup } from "./library-backup.js";
import { normalizeEditableGraph } from "./schema.js";

const DB_NAME = "atlas-workspace-safety-v1",
  STORE = "records";
const validScope = (scope) =>
  typeof scope === "string" &&
  scope.length > 0 &&
  scope.length <= 500 &&
  !/[\u0000-\u001f]/.test(scope);
const byteSize = (value) =>
  new TextEncoder().encode(JSON.stringify(value)).byteLength;
export const checkpointScope = ({
  localId,
  ownerUid,
  workspaceId,
  canEdit = true,
} = {}) => {
  if (!canEdit) return "";
  if (ownerUid && workspaceId)
    return "cloud:" + JSON.stringify([String(ownerUid), String(workspaceId)]);
  return localId ? "local:" + String(localId) : "";
};

// A separate browser database holds explicit safety records. The existing local
// library and its graph-free coordination database retain their original roles.
export function createBrowserSafetyAdapter({
  database = globalThis.indexedDB,
} = {}) {
  let connection;
  const open = () => {
    if (connection) return connection;
    connection = new Promise((resolve, reject) => {
      let blocked = false;
      if (!database) {
        reject(
          new Error(
            "This browser blocked recovery storage. Download a JSON backup.",
          ),
        );
        return;
      }
      const request = database.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const store = request.result.createObjectStore(STORE, {
          keyPath: "key",
        });
        store.createIndex("scope", "scope");
      };
      request.onerror = () =>
        reject(
          new Error("Recovery storage is unavailable. Download a JSON backup."),
        );
      request.onblocked = () => {
        blocked = true;
        reject(
          new Error("Close an older Atlas recovery window and try again."),
        );
      };
      request.onsuccess = () => {
        const db = request.result;
        if (blocked) {
          db.close();
          return;
        }
        db.onversionchange = () => {
          db.close();
          connection = null;
        };
        resolve(db);
      };
    });
    connection.catch(() => {
      connection = null;
    });
    return connection;
  };
  async function transaction(scope, change) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, change ? "readwrite" : "readonly"),
        store = tx.objectStore(STORE);
      let result;
      tx.oncomplete = () => resolve(result);
      tx.onerror = tx.onabort = () =>
        reject(
          tx.error ||
            new Error(
              "Recovery storage is full or unavailable. Download a JSON backup.",
            ),
        );
      const request = store.index("scope").getAll(scope);
      request.onsuccess = () => {
        const records = request.result;
        if (!change) {
          result = records;
          return;
        }
        try {
          const next = change(records);
          result = next.result;
          for (const key of next.remove || []) store.delete(key);
          for (const item of next.put || []) store.put(item);
        } catch (error) {
          tx.abort();
          reject(error);
        }
      };
    });
  }
  return Object.freeze({
    list: (scope) => transaction(scope),
    mutate: transaction,
  });
}

export function createWorkspaceSafety({
  adapter = createBrowserSafetyAdapter(),
  fallback,
  now = Date.now,
  newId = () => globalThis.crypto.randomUUID(),
  maxCheckpoints = 8,
  maxCheckpointBytes = 12 * 1024 * 1024,
} = {}) {
  // Duplicating a browser tab may clone sessionStorage. Independent document
  // instances append separate recovery records instead of overwriting a twin.
  const draftInstanceId = newId();
  const validateScope = (scope) => {
    if (!validScope(scope)) throw new Error("Choose an editable map first.");
  };
  const draftScope = (tabId) => {
    validateScope(tabId);
    return "draft:" + tabId;
  };
  const fallbackKey = (tabId) => "atlas.local.recovery.v1:" + tabId;
  const validDraft = (item) => {
    if (!item || item.kind !== "draft" || typeof item.text !== "string")
      return null;
    try {
      return { ...item, backup: readLibraryBackup(item.text) };
    } catch {
      return null;
    }
  };
  const readFallback = (tabId) => {
    try {
      return validDraft(
        JSON.parse(fallback?.getItem(fallbackKey(tabId)) || "null"),
      );
    } catch {
      return null;
    }
  };
  const api = {
    async saveDraft(tabId, backup) {
      const scope = draftScope(tabId),
        validated = readLibraryBackup(backup);
      const text = JSON.stringify({
        version: 1,
        projects: validated.projects,
        activeId: validated.activeId,
      });
      const item = {
        key: scope + ":" + draftInstanceId,
        scope,
        kind: "draft",
        updatedAt: now(),
        text,
      };
      try {
        await adapter.mutate(scope, (records) => ({
          put: [
            {
              ...item,
              sequence:
                Math.max(
                  0,
                  ...records.map((record) => Number(record.sequence) || 0),
                ) + 1,
            },
          ],
          result: true,
        }));
        return { ok: true, text, mode: "browser" };
      } catch (error) {
        try {
          if (!fallback) throw error;
          fallback.setItem(fallbackKey(tabId), JSON.stringify(item));
          return { ok: true, text, mode: "tab" };
        } catch {
          return { ok: false, error: error.message };
        }
      }
    },
    async readDraft(tabId) {
      const scope = draftScope(tabId);
      let items = [];
      try {
        items = await adapter.list(scope);
      } catch {}
      const candidates = [...items.map(validDraft), readFallback(tabId)]
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.updatedAt - a.updatedAt || (b.sequence || 0) - (a.sequence || 0),
        );
      return candidates[0] || null;
    },
    async clearDraft(tabId, expectedText) {
      const scope = draftScope(tabId);
      let restoredGraphs;
      try {
        restoredGraphs = new Set(
          readLibraryBackup(expectedText).projects.map((project) =>
            JSON.stringify(project.graph),
          ),
        );
      } catch {}
      const covered = (item) => {
        if (expectedText === undefined || item.text === expectedText)
          return true;
        const draft = validDraft(item);
        return Boolean(
          restoredGraphs &&
          draft &&
          draft.backup.projects.every((project) =>
            restoredGraphs.has(JSON.stringify(project.graph)),
          ),
        );
      };
      try {
        await adapter.mutate(scope, (items) => ({
          remove: items.filter(covered).map((item) => item.key),
          result: true,
        }));
      } catch {}
      const item = readFallback(tabId);
      if (item && covered(item))
        try {
          fallback.removeItem(fallbackKey(tabId));
        } catch {}
    },
    async listCheckpoints(scope) {
      validateScope(scope);
      const items = await adapter.list(scope);
      return items
        .filter((item) => item.kind === "checkpoint" && item.scope === scope)
        .flatMap((item) => {
          try {
            return [{ ...item, graph: normalizeEditableGraph(item.graph) }];
          } catch {
            return [];
          }
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);
    },
    async saveCheckpoint(scope, name, graph) {
      validateScope(scope);
      const label = String(name || "").trim();
      if (!label || label.length > 80)
        throw new Error("Name this checkpoint using 1 to 80 characters.");
      const item = {
        key: scope + ":" + newId(),
        scope,
        kind: "checkpoint",
        name: label,
        updatedAt: now(),
        graph: normalizeEditableGraph(graph),
      };
      if (byteSize(item) > maxCheckpointBytes)
        throw new Error(
          "This checkpoint is too large for the recovery budget. Export JSON instead.",
        );
      return adapter.mutate(scope, (items) => {
        const retained = items
          .filter((value) => value.kind === "checkpoint")
          .sort((a, b) => b.updatedAt - a.updatedAt);
        if (retained.some((value) => value.key === item.key))
          throw new Error("Could not create a unique checkpoint. Try again.");
        if (
          retained.length >= maxCheckpoints ||
          retained.reduce(
            (sum, value) => sum + byteSize(value),
            byteSize(item),
          ) > maxCheckpointBytes
        )
          throw new Error(
            "Checkpoint storage for this map is full. Export or remove a checkpoint before saving another.",
          );
        return { put: [item], result: item };
      });
    },
    async renameCheckpoint(scope, key, name) {
      validateScope(scope);
      const label = String(name || "").trim();
      if (!label || label.length > 80)
        throw new Error("Use a checkpoint name between 1 and 80 characters.");
      return adapter.mutate(scope, (items) => {
        const item = items.find(
          (value) =>
            value.kind === "checkpoint" &&
            value.key === key &&
            value.scope === scope,
        );
        if (!item) throw new Error("That checkpoint is no longer available.");
        return { put: [{ ...item, name: label }], result: true };
      });
    },
    async removeCheckpoint(scope, key) {
      validateScope(scope);
      return adapter.mutate(scope, (items) => ({
        remove: items
          .filter(
            (item) =>
              item.key === key &&
              item.scope === scope &&
              item.kind === "checkpoint",
          )
          .map((item) => item.key),
        result: true,
      }));
    },
    async removeCheckpointScope(scope) {
      validateScope(scope);
      return adapter.mutate(scope, (items) => ({
        remove: items
          .filter((item) => item.scope === scope && item.kind === "checkpoint")
          .map((item) => item.key),
        result: true,
      }));
    },
  };
  return Object.freeze(api);
}

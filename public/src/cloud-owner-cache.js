const copy = (value) => globalThis.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
const ownerOf = (workspace) => String(workspace?.ownerId || workspace?.ownerUID || workspace?.ownerUid || "");

// Only server-confirmed owner snapshots belong here. This cache never uses storage.
export function createCloudOwnerCache({ maxEntries = 4, maxBytes = 8 * 1024 * 1024 } = {}) {
  const entryLimit = Number.isSafeInteger(maxEntries) && maxEntries > 0 ? maxEntries : 4;
  const byteLimit = Number.isSafeInteger(maxBytes) && maxBytes > 0 ? maxBytes : 8 * 1024 * 1024;
  const entries = new Map();
  let activeUid = "";
  let bytes = 0;
  const clear = () => { entries.clear(); bytes = 0; };
  const removeId = (id) => {
    const previous = entries.get(id);
    if (!previous) return false;
    bytes -= previous.bytes;
    entries.delete(id);
    return true;
  };
  const allowed = (uid) => Boolean(activeUid && String(uid || "") === activeUid);
  return Object.freeze({
    setIdentity(uid) {
      const next = String(uid || "");
      if (next === activeUid) return;
      clear();
      activeUid = next;
    },
    put({ userUid, workspace, graph, serverValidated = false } = {}) {
      if (!allowed(userUid) || !serverValidated || ownerOf(workspace) !== activeUid) return false;
      const id = String(workspace?.id || "");
      if (!id) return false;
      if (workspace.deleting || !graph || typeof graph !== "object") { removeId(id); return false; }
      let snapshot;
      let size;
      try {
        snapshot = copy({ workspace, graph });
        size = new TextEncoder().encode(JSON.stringify(snapshot)).byteLength;
      } catch { return false; }
      removeId(id);
      if (size > byteLimit) return false;
      while (entries.size >= entryLimit || bytes + size > byteLimit) removeId(entries.keys().next().value);
      entries.set(id, { snapshot, bytes: size });
      bytes += size;
      return true;
    },
    get(userUid, id) {
      if (!allowed(userUid)) return null;
      const key = String(id || "");
      const entry = entries.get(key);
      if (!entry) return null;
      entries.delete(key);
      entries.set(key, entry);
      return copy(entry.snapshot);
    },
    remove(userUid, id) { return allowed(userUid) ? removeId(String(id || "")) : false; },
    retain(userUid, ids) {
      if (!allowed(userUid)) return;
      const keep = new Set(ids);
      for (const id of entries.keys()) if (!keep.has(id)) removeId(id);
    },
    clear,
    stats() { return Object.freeze({ entries: entries.size, bytes, maxEntries: entryLimit, maxBytes: byteLimit }); },
  });
}
// Remove only this account's device cloud copies; never clear the local library.
export function clearDeletedAccountStorage(uid, stores = []) {
  for (const storage of stores) {
    if (!storage) continue;
    const prefixes = ['atlas.online.owner-draft.v1:', 'atlas.cloud-import.candidate.v1:'].map(prefix => prefix + encodeURIComponent(uid) + ':');
    const remove = [];
    for (let i = 0; i < storage.length; i++) { const key = storage.key(i);if (prefixes.some(prefix => key?.startsWith(prefix))) remove.push(key); }
    for (const key of remove) storage.removeItem(key);
    const navigationKey = 'atlas.workspace.navigation.v1';
    let navigation;try { navigation = JSON.parse(storage.getItem(navigationKey) || 'null'); } catch { /* retain unknown bytes */ }
    if (navigation?.ownerUid === uid) storage.removeItem(navigationKey);
    const associationKey = 'atlas.online.associations.v1';
    let associations;try { associations = JSON.parse(storage.getItem(associationKey) || 'null'); } catch { /* retain unknown bytes */ }
    if (associations && !Array.isArray(associations) && typeof associations === 'object') {
      const retained = Object.fromEntries(Object.entries(associations).filter(([, value]) => value?.ownerUid !== uid));
      if (Object.keys(retained).length !== Object.keys(associations).length) storage.setItem(associationKey, JSON.stringify(retained));
    }
  }
}
export async function clearDeletedAccountCheckpoints(uid, database = globalThis.indexedDB) {
  if (!database) return;
  await new Promise((resolve, reject) => {
    const request = database.open('atlas-workspace-safety-v1', 1);
    let fresh = false;
    request.onupgradeneeded = () => { fresh = true;request.transaction.abort(); };
    request.onerror = () => fresh ? resolve() : reject(Error('Browser cleanup unavailable'));
    request.onblocked = () => reject(Error('Browser cleanup blocked'));
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('records')) { db.close();resolve();return; }
      const transaction = db.transaction('records', 'readwrite');
      const cursor = transaction.objectStore('records').openCursor();
      cursor.onsuccess = () => {
        const item = cursor.result;if (!item) return;
        const scope = item.value.scope;
        if (item.value.kind === 'checkpoint' && typeof scope === 'string' && scope.startsWith('cloud:')) {
          try { if (JSON.parse(scope.slice(6))[0] === uid) item.delete(); } catch { /* retain unrecognized record */ }
        }
        item.continue();
      };
      transaction.oncomplete = () => { db.close();resolve(); };
      transaction.onabort = transaction.onerror = () => { db.close();reject(Error('Browser cleanup unavailable')); };
    };
  });
}

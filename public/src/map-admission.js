const ADMISSION_SOURCES = new Set(["new", "import", "fragment"]);
const clone = (value) => globalThis.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));

function autosaveIsEnabled(account) {
  try { return account.getPreferenceState().saveFutureMaps === true; }
  catch { return false; }
}

function identityIsCurrent(account, uid) {
  return String(account.getState()?.user?.uid || "") === uid;
}

export function createMapAdmissionController({ account, createWorkspace } = {}) {
  if (!account || typeof account.getState !== "function" || typeof account.getService !== "function") {
    throw new TypeError("Map admissions require the shared account session.");
  }
  if (typeof createWorkspace !== "function") throw new TypeError("Map admissions require a workspace creator.");

  const records = new Map();
  let queue = Promise.resolve();
  let nextId = 0;

  const recordKey = ({ source, key, projectId }) => source + "\u0000" + String(key || projectId || "");

  function schedule(record, { retry = false } = {}) {
    const key = recordKey(record);
    if (!retry && record.promise) return record.promise;
    if (!retry && record.result) return Promise.resolve(record.result);
    if (record.promise) return record.promise;
    record.id = ++nextId;
    const admissionId = record.id;
    const run = queue.then(async () => {
      const finish = (result) => ({ ...result, id: admissionId, source: record.source, projectId: record.projectId, key: record.key });
      const isCurrent = () => {
        if (record.cancelled) return false;
        try { return record.isCurrent() !== false; } catch { return false; }
      };
      const preferenceEnabled = () => autosaveIsEnabled(account);
      if (!isCurrent()) return finish({ status: "stale", reason: "route-changed" });
      if (!preferenceEnabled()) return finish({ status: "local", reason: "preference-off" });

      let accountState = account.getState();
      if (!accountState.initialized) {
        try { await account.initialize(); }
        catch (error) { return finish({ status: "failed", reason: "account-error", error }); }
      }
      if (!isCurrent()) return finish({ status: "stale", reason: "route-changed" });
      if (account.getAuthInteractionEpoch?.() !== record.authInteractionEpoch) {
        return finish({ status: "needs-confirmation", reason: "sign-in-started-after-admission" });
      }
      if (!preferenceEnabled()) return finish({ status: "local", reason: "preference-turned-off" });

      accountState = account.getState();
      const uid = String(accountState.user?.uid || "");
      if (!uid) return finish({ status: "needs-sign-in", reason: "signed-out" });

      let service;
      try { service = await account.getService(); }
      catch (error) { return finish({ status: "failed", reason: "service-error", error }); }
      if (!isCurrent()) return finish({ status: "stale", reason: "route-changed" });
      if (account.getAuthInteractionEpoch?.() !== record.authInteractionEpoch) {
        return finish({ status: "needs-confirmation", reason: "sign-in-started-after-admission" });
      }
      if (!preferenceEnabled()) return finish({ status: "local", reason: "preference-turned-off" });
      if (!identityIsCurrent(account, uid)) return finish({ status: "stale", reason: "account-changed" });

      if (record.expectedOwnerUid && record.expectedOwnerUid !== uid) {
        return finish({ status: "needs-confirmation", reason: "pending-admission-owner-changed" });
      }
      const graph = clone(typeof record.getGraph === "function" ? record.getGraph() : record.graph);
      try {
        await record.prepareCreate?.({ ownerUid: uid, candidateWorkspaceId: record.candidateWorkspaceId, graph });
        const created = await createWorkspace({
          graph,
          name: graph.project?.name,
          projectId: record.projectId,
          source: record.source,
          ownerUid: uid,
          service,
          candidateWorkspaceId: record.candidateWorkspaceId,
          idempotencyKey: record.idempotencyKey,
        });
        const workspace = created?.workspace || created;
        const savedGraph = created?.graph ? clone(created.graph) : graph;
        return finish({ status: "saved", workspace, ownerUid: uid, graph: savedGraph, accountChanged: !identityIsCurrent(account, uid), postCreateError: created?.postCreateError || null });
      } catch (error) {
        return finish({ status: "failed", reason: "create-error", error, ownerUid: uid, graph });
      }
    });
    record.promise = run;
    queue = run.then(() => undefined, () => undefined);
    run.then((result) => {
      if (records.get(key) !== record || record.id !== admissionId) return;
      record.promise = null;
      record.result = result;
    }, () => {
      if (records.get(key) !== record || record.id !== admissionId) return;
      record.promise = null;
      record.result = { status: "failed", reason: "internal-error", source: record.source, projectId: record.projectId, key: record.key };
    });
    return run;
  }

  function admit({ source, key = "", projectId = "", graph, isCurrent = () => true, getGraph, candidateWorkspaceId = "", idempotencyKey = "", expectedOwnerUid = "", prepareCreate } = {}) {
    if (!ADMISSION_SOURCES.has(source)) return Promise.resolve({ status: "ignored", reason: "not-an-admission-event" });
    if (!graph || typeof graph !== "object" || Array.isArray(graph)) return Promise.resolve({ status: "ignored", reason: "invalid-graph" });
    const admission = { source, key: String(key || projectId), projectId: String(projectId || ""), graph: clone(graph), isCurrent, getGraph, candidateWorkspaceId: String(candidateWorkspaceId || ""), idempotencyKey: String(idempotencyKey || ""), expectedOwnerUid: String(expectedOwnerUid || ""), prepareCreate };
    if (!admission.key) return Promise.resolve({ status: "ignored", reason: "missing-key" });
    const id = recordKey(admission);
    const previous = records.get(id);
    // A fragment key identifies content, not a lifetime cloud workspace. A new
    // local project/candidate is a fresh import, even when that content is equal.
    const sameIntent = previous && previous.projectId === admission.projectId
      && previous.candidateWorkspaceId === admission.candidateWorkspaceId
      && previous.idempotencyKey === admission.idempotencyKey
      && previous.expectedOwnerUid === admission.expectedOwnerUid;
    if (previous && !sameIntent) previous.cancelled = true;
    const existing = sameIntent ? previous : null;
    if (existing?.promise) return existing.promise;
    if (existing?.result) return Promise.resolve(existing.result);
    const record = existing || {
      ...admission,
      authInteractionEpoch: account.getAuthInteractionEpoch?.(),
      id: 0,
      promise: null,
      result: null,
    };
    if (existing) {
      record.graph = admission.graph;
      record.projectId = admission.projectId;
      record.isCurrent = admission.isCurrent;
      record.getGraph = admission.getGraph;
      record.prepareCreate = admission.prepareCreate;
      record.expectedOwnerUid = admission.expectedOwnerUid;
      record.candidateWorkspaceId = admission.candidateWorkspaceId;
      record.idempotencyKey = admission.idempotencyKey;
    }
    records.set(id, record);
    return schedule(record);
  }

  function retry({ source, key, graph, projectId, isCurrent, getGraph, candidateWorkspaceId, idempotencyKey, expectedOwnerUid, prepareCreate } = {}) {
    if (!ADMISSION_SOURCES.has(source)) return Promise.resolve({ status: "ignored", reason: "not-an-admission-event" });
    const admission = { source, key: String(key || projectId || ""), projectId: String(projectId || ""), graph, isCurrent, getGraph, candidateWorkspaceId: String(candidateWorkspaceId || ""), idempotencyKey: String(idempotencyKey || ""), expectedOwnerUid: String(expectedOwnerUid || ""), prepareCreate };
    const id = recordKey(admission);
    const record = records.get(id);
    if (!record) return Promise.resolve({ status: "missing", reason: "no-pending-admission" });
    if (record.promise) return record.promise;
    if (graph && typeof graph === "object") record.graph = clone(graph);
    if (projectId) record.projectId = String(projectId);
    if (typeof isCurrent === "function") record.isCurrent = isCurrent;
    if (typeof getGraph === "function") record.getGraph = getGraph;
    if (candidateWorkspaceId) record.candidateWorkspaceId = String(candidateWorkspaceId);
    if (idempotencyKey) record.idempotencyKey = String(idempotencyKey);
    if (expectedOwnerUid) record.expectedOwnerUid = String(expectedOwnerUid);
    if (typeof prepareCreate === "function") record.prepareCreate = prepareCreate;
    record.authInteractionEpoch = account.getAuthInteractionEpoch?.();
    record.result = null;
    return schedule(record, { retry: true });
  }

  function getResult({ source, key, projectId } = {}) {
    if (!ADMISSION_SOURCES.has(source)) return null;
    const record = records.get(recordKey({ source, key, projectId }));
    return record?.result || null;
  }

  function forget({ projectId = "", workspaceId = "", ownerUid = "" } = {}) {
    const project = String(projectId || "");
    const workspace = String(workspaceId || "");
    const owner = String(ownerUid || "");
    if (!project && (!workspace || !owner)) return 0;
    let removed = 0;
    for (const [key, record] of records) {
      const matchesProject = project && record.projectId === project;
      const recordedOwner = String(record.result?.ownerUid || record.expectedOwnerUid || "");
      const matchesWorkspace = workspace && owner && recordedOwner === owner
        && (record.result?.workspace?.id === workspace || record.candidateWorkspaceId === workspace);
      if (!matchesProject && !matchesWorkspace) continue;
      record.cancelled = true;
      records.delete(key);
      removed += 1;
    }
    return removed;
  }

  return Object.freeze({ admit, retry, getResult, forget, pendingCount: () => [...records.values()].filter((record) => record.promise).length });
}

export const mapAdmissionSources = Object.freeze(["new", "import", "fragment"]);
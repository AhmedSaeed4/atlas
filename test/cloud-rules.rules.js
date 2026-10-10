import test, { after, afterEach, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  Bytes,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { createCloudService, createFirebaseAdapter } from "../public/src/cloud-service.js";
import { encodeCloudGraph } from "../public/src/cloud-model.js";
import { createMapAdmissionController } from "../public/src/map-admission.js";
import { commitManualMoveAssociation, hasUnresolvedLocalCloudCandidate, reusableManualMoveAttempt } from "../public/src/sidebar-library.js";
import { workspaceForLocalAssociation } from "../public/src/cloud-associations.js";

const PROJECT_ID = "demo-atlas-cloud-rules";
const WORKSPACE_ID = "A".repeat(22);
const REVISION_A = "R".repeat(22);
const REVISION_B = "S".repeat(22);
const REVISION_STALE = "T".repeat(22);
const TWO_MIB = 2 * 1024 * 1024;
const emulatedAddress = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8181";
const emulatedSeparator = emulatedAddress.lastIndexOf(":");
const emulatedHost = emulatedAddress.slice(0, emulatedSeparator);
const emulatedPort = Number(emulatedAddress.slice(emulatedSeparator + 1));
let env;

before(async () => {
  const rules = await readFile(new URL("../firestore.rules", import.meta.url), "utf8");
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules, host: emulatedHost, port: emulatedPort },
  });
});
beforeEach(async () => {
  await env.withSecurityRulesDisabled(async context => { await setDoc(doc(context.firestore(), "system", "workspaceQuota"), { enabled: true }); });
});
afterEach(async () => { await env.clearFirestore(); });
after(async () => { await env.cleanup(); });

function graphJson(name = "Eight chunk graph") {
  const base = JSON.stringify({
    schemaVersion: 1,
    project: { name, type: "Software project", description: "" },
    nodes: [{ id: "node-1", label: "Node", type: "Service", description: "" }],
    edges: [],
  });
  return base + " ".repeat(TWO_MIB - Buffer.byteLength(base, "utf8"));
}

function splitFixed(json, count = 8) {
  const width = Buffer.byteLength(json, "utf8") / count;
  assert.equal(width, Math.floor(width));
  const chunks = [];
  for (let index = 0; index < count; index += 1) {
    chunks.push({ index, text: json.slice(index * width, (index + 1) * width) });
  }
  return chunks;
}

function chunkRef(database, workspaceId, revision, index) {
  return doc(database, "workspaces", workspaceId, "revisions", revision, "chunks", String(index));
}
function firestoreChunk(chunk) {
  return {
    index: chunk.index,
    payload: Bytes.fromUint8Array(new TextEncoder().encode(chunk.text)),
  };
}
function quotaRef(database, uid) { return doc(database, "workspaceQuota", uid); }
function quotaData(workspaceIds, lastWorkspaceId, lastAction = "create", createdAt = serverTimestamp()) {
  return { schemaVersion: 1, workspaceIds, lastWorkspaceId, lastAction, createdAt, updatedAt: serverTimestamp() };
}
function workspaceRef(database, workspaceId = WORKSPACE_ID) {
  return doc(database, "workspaces", workspaceId);
}

function productionAdapterService(uid, database, generatedIds, { commitBatch, readWorkspaceFromServer } = {}) {
  const user = { uid, getIdToken: async () => "emulator-test-token" };
  const auth = { currentUser: user };
  let idIndex = 0;
  const adapter = createFirebaseAdapter(
    { projectId: PROJECT_ID },
    {
      app: { options: { projectId: PROJECT_ID } },
      auth,
      db: database,
      persistenceReady: Promise.resolve(),
      workspaceIdFactory: () => {
        const value = generatedIds[idIndex++];
        if (!value) throw new Error("Test exhausted its deterministic ID sequence");
        return value;
      },
      commitBatch,
      readWorkspaceFromServer,
    },
  );
  const service = createCloudService({
    baseUrl: "https://atlas.test/workspace",
    adapter: {
      ...adapter,
      observeAuth(callback) {
        callback(user);
        return () => {};
      },
    },
  });
  return { service, generatedCount: () => idIndex };
}

function makeTwoMiBGraph() {
  const targetBytes = 2 * 1024 * 1024;
  const build = (operationLength, firstPadding = 0, secondPadding = 0) => ({
    project: { name: "Maximum cloud graph", type: "Software project", description: "" },
    nodes: Array.from({ length: 800 }, (_, index) => ({
      id: "production-node-" + String(index).padStart(3, "0"),
      label: "Service " + (index + 1),
      type: "Service",
      description: "d".repeat(400 + (index === 0 ? firstPadding : index === 1 ? secondPadding : 0)),
      details: {
        operation: "o".repeat(operationLength),
        inputs: Array.from({ length: 4 }, () => "i".repeat(240)),
      },
    })),
    edges: [],
  });

  let low = 0;
  let high = 1000;
  let best = null;
  while (low <= high) {
    const operationLength = Math.floor((low + high) / 2);
    try {
      const encoded = encodeCloudGraph(build(operationLength));
      if (encoded.byteLength <= targetBytes) {
        best = { operationLength, encoded };
        low = operationLength + 1;
      } else {
        high = operationLength - 1;
      }
    } catch (error) {
      if (error?.code !== "graph-too-large") throw error;
      high = operationLength - 1;
    }
  }
  if (!best) throw new Error("Could not construct a graph within the cloud graph cap");
  const gap = targetBytes - best.encoded.byteLength;
  const firstPadding = Math.min(gap, 600);
  const secondPadding = gap - firstPadding;
  if (secondPadding > 600) throw new Error("Could not pad the test graph to the exact limit");
  const graph = build(best.operationLength, firstPadding, secondPadding);
  const encoded = encodeCloudGraph(graph);
  assert.equal(encoded.byteLength, targetBytes);
  assert.equal(encoded.chunks.length, 8);
  return { graph: encoded.graph, encoded };
}
async function readStoredWorkspace(workspaceId = WORKSPACE_ID) {
  let snapshot;
  await env.withSecurityRulesDisabled(async (context) => {
    snapshot = await getDoc(workspaceRef(context.firestore(), workspaceId));
  });
  return snapshot;
}
async function readStoredChunk(revision, index, workspaceId = WORKSPACE_ID) {
  let snapshot;
  await env.withSecurityRulesDisabled(async (context) => {
    snapshot = await getDoc(chunkRef(context.firestore(), workspaceId, revision, index));
  });
  return snapshot;
}
function makeMetadata(uid, revision, json, chunks, overrides = {}) {
  return {
    schemaVersion: 1,
    ownerId: uid,
    shared: false,
    deleting: false,
    name: "Eight chunk graph",
    projectType: "Software project",
    currentRevision: revision,
    previousRevision: null,
    chunkCount: chunks.length,
    byteLength: Buffer.byteLength(json, "utf8"),
    nodeCount: 1,
    edgeCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  };
}
async function createWorkspace(uid, revision = REVISION_A) {
  const database = env.authenticatedContext(uid).firestore();
  const json = graphJson();
  const chunks = splitFixed(json);
  const batch = writeBatch(database);
  for (const chunk of chunks) batch.set(chunkRef(database, WORKSPACE_ID, revision, chunk.index), firestoreChunk(chunk));
  batch.set(workspaceRef(database), makeMetadata(uid, revision, json, chunks));
  batch.set(quotaRef(database, uid), quotaData([WORKSPACE_ID], WORKSPACE_ID));
  await assertSucceeds(batch.commit());
  return { database, json, chunks };
}
async function saveRevision(database, fromRevision, toRevision, { chunkCount = 8, oldChunkCount = 8, json = graphJson("Updated graph") } = {}) {
  const chunks = splitFixed(json, chunkCount);
  const batch = writeBatch(database);
  for (const chunk of chunks) batch.set(chunkRef(database, WORKSPACE_ID, toRevision, chunk.index), firestoreChunk(chunk));
  for (let index = 0; index < oldChunkCount; index += 1) {
    batch.delete(chunkRef(database, WORKSPACE_ID, fromRevision, index));
  }
  batch.update(workspaceRef(database), {
    name: chunkCount === 1 ? "Shrunk graph" : "Updated graph",
    currentRevision: toRevision,
    previousRevision: fromRevision,
    chunkCount,
    byteLength: Buffer.byteLength(json, "utf8"),
    nodeCount: 1,
    edgeCount: 0,
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
  return { json, chunks };
}

// Each operation uses a new full-capacity payload: eight 256 KiB documents,
// exactly 2 MiB total. This probes atomic access-call limits as well as bounds.
test("owner can create, replace, shrink, share, and delete maximum-eight-chunk graphs atomically", async () => {
  const { database } = await createWorkspace("owner-a");
  let stored = await getDoc(workspaceRef(database));
  assert.equal(stored.data().chunkCount, 8);
  assert.equal(stored.data().byteLength, TWO_MIB);
  assert.equal((await getDoc(chunkRef(database, WORKSPACE_ID, REVISION_A, 7))).exists(), true);

  await saveRevision(database, REVISION_A, REVISION_B);
  stored = await getDoc(workspaceRef(database));
  assert.equal(stored.data().currentRevision, REVISION_B);
  assert.equal(stored.data().previousRevision, REVISION_A);
  assert.equal((await readStoredChunk(REVISION_A, 0)).exists(), false);
  assert.equal((await getDoc(chunkRef(database, WORKSPACE_ID, REVISION_B, 7))).exists(), true);

  const shrunkJson = JSON.stringify({
    schemaVersion: 1,
    project: { name: "Shrunk graph", type: "Software project" },
    nodes: [{ id: "node-1", label: "Node", type: "Service" }],
    edges: [],
  });
  await saveRevision(database, REVISION_B, REVISION_STALE, { chunkCount: 1, json: shrunkJson });
  assert.equal((await readStoredChunk(REVISION_B, 7)).exists(), false);
  assert.equal((await getDoc(chunkRef(database, WORKSPACE_ID, REVISION_STALE, 0))).exists(), true);

  // Expand to eight chunks again so delete exercises all cleanup references.
  await saveRevision(database, REVISION_STALE, REVISION_A, { chunkCount: 8, oldChunkCount: 1 });
  await updateDoc(workspaceRef(database), { shared: true, updatedAt: serverTimestamp() });
  const publicDb = env.unauthenticatedContext().firestore();
  assert.equal((await getDoc(workspaceRef(publicDb))).data().shared, true);
  assert.equal((await getDoc(chunkRef(publicDb, WORKSPACE_ID, REVISION_A, 7))).exists(), true);
  await assertFails(getDocs(collection(publicDb, "workspaces", WORKSPACE_ID, "revisions", REVISION_A, "chunks")));
  await assertFails(getDocs(collection(publicDb, "workspaces")));

  await updateDoc(workspaceRef(database), { shared: false, updatedAt: serverTimestamp() });
  await assertFails(getDoc(workspaceRef(publicDb)));
  await assertFails(getDoc(chunkRef(publicDb, WORKSPACE_ID, REVISION_A, 0)));

  await updateDoc(workspaceRef(database), { deleting: true, updatedAt: serverTimestamp() });
  const batch = writeBatch(database);
  for (let index = 0; index < 8; index += 1) batch.delete(chunkRef(database, WORKSPACE_ID, REVISION_A, index));
  batch.delete(workspaceRef(database));
  batch.update(quotaRef(database, "owner-a"), { workspaceIds: [], lastWorkspaceId: WORKSPACE_ID, lastAction: "delete", updatedAt: serverTimestamp() });
  await assertSucceeds(batch.commit());
  assert.equal((await readStoredWorkspace()).exists(), false);
  await assertFails(getDoc(workspaceRef(publicDb)));
  await assertFails(getDoc(chunkRef(publicDb, WORKSPACE_ID, REVISION_A, 0)));
});

test("an owner with no workspace documents can query an empty library", async () => {
  const database = env.authenticatedContext("owner-with-no-maps").firestore();
  const ownerQuery = query(collection(database, "workspaces"), where("ownerId", "==", "owner-with-no-maps"));
  const snapshot = await assertSucceeds(getDocs(ownerQuery));
  assert.equal(snapshot.empty, true);
  assert.equal(snapshot.size, 0);
});

test("an owner with no workspace documents receives a server-confirmed empty library snapshot", async () => {
  const database = env.authenticatedContext("owner-empty-listener").firestore();
  const ownerQuery = query(collection(database, "workspaces"), where("ownerId", "==", "owner-empty-listener"));
  let unsubscribe = () => {};
  const result = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Owner listener did not reach a server snapshot.")), 8000);
    unsubscribe = onSnapshot(
      ownerQuery,
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.fromCache) return;
        clearTimeout(timeout);
        resolve(snapshot);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
  try {
    const snapshot = await result;
    assert.equal(snapshot.empty, true);
    assert.equal(snapshot.size, 0);
    assert.equal(snapshot.metadata.fromCache, false);
  } finally {
    unsubscribe();
  }
});

test("production Firebase adapter creates, lists, and reads a maximum-size eight-chunk graph", async () => {
  const context = env.authenticatedContext("adapter-owner");
  const { service } = productionAdapterService("adapter-owner", context.firestore(), [
    "U".repeat(22),
    "V".repeat(22),
  ]);
  const { graph, encoded } = makeTwoMiBGraph();

  const created = await service.createWorkspace({ graph });
  assert.equal(created.id, "U".repeat(22));
  assert.equal(created.nodeCount, 800);
  assert.equal(created.edgeCount, 0);

  const storedParent = await getDoc(workspaceRef(context.firestore(), created.id));
  assert.equal(storedParent.data().chunkCount, 8);
  assert.equal(storedParent.data().byteLength, 2 * 1024 * 1024);

  const listed = await service.listWorkspaces();
  assert.equal(listed.status, "ready");
  assert.equal(listed.workspaces.length, 1);
  assert.equal(listed.workspaces[0].id, created.id);

  const ready = await new Promise((resolve, reject) => {
    let unsubscribe;
    const timeout = setTimeout(() => {
      unsubscribe?.();
      reject(new Error("Timed out waiting for the adapter graph read"));
    }, 15000);
    unsubscribe = service.watchWorkspace({ workspaceId: created.id }, (snapshot) => {
      if (snapshot.status === "ready") {
        clearTimeout(timeout);
        unsubscribe();
        resolve(snapshot);
      } else if (snapshot.status === "error") {
        clearTimeout(timeout);
        unsubscribe();
        reject(snapshot.error ?? new Error("Adapter graph read failed"));
      }
    });
  });
  assert.equal(ready.graph.nodes.length, 800);
  assert.deepEqual(encodeCloudGraph(ready.graph).json, encoded.json);
});

test("candidate creation starts with an atomic create batch and does not pre-read a missing workspace", async () => {
  const uid = "candidate-owner";
  const database = env.authenticatedContext(uid).firestore();
  const candidateId = "C".repeat(22);
  const revisionId = "D".repeat(22);
  let committedBatches = 0;
  let candidateReads = 0;
  const { service } = productionAdapterService(uid, database, [revisionId], {
    commitBatch: async (batch) => {
      committedBatches += 1;
      return batch.commit();
    },
    readWorkspaceFromServer: async (reference) => {
      candidateReads += 1;
      assert.ok(committedBatches > 0, "candidate must be attempted atomically before any reconciliation read");
      return getDocFromServer(reference);
    },
  });
  const graph = {
    project: { name: "Fixed candidate", type: "Software project", description: "" },
    nodes: [{ id: "node-candidate", label: "Candidate", type: "Service", description: "" }],
    edges: [],
  };

  const created = await service.createWorkspace({ graph, workspaceId: candidateId, expectedOwnerUid: uid });
  assert.equal(created.id, candidateId);
  assert.equal(committedBatches, 1);
  assert.equal(candidateReads, 0);
  const stored = await getDoc(workspaceRef(database, candidateId));
  assert.equal(stored.data().ownerId, uid);
  service.dispose();
});

test("a committed create with a lost response reconciles by candidate after reload without duplicates", async () => {
  const uid = "reload-owner";
  const database = env.authenticatedContext(uid).firestore();
  const candidateId = "L".repeat(22);
  const graph = {
    project: { name: "Reload candidate", type: "Software project", description: "same graph after refresh" },
    nodes: [{ id: "node-reload", label: "Reload", type: "Service", description: "" }],
    edges: [],
  };
  let batchCommits = 0;
  const firstService = productionAdapterService(uid, database, ["M".repeat(22), "N".repeat(22)], {
    commitBatch: async (batch) => {
      batchCommits += 1;
      await batch.commit();
      if (batchCommits === 1) throw Object.assign(new Error("response lost after commit"), { code: "unavailable" });
    },
    readWorkspaceFromServer: async () => {
      throw Object.assign(new Error("reconciliation read temporarily unavailable"), { code: "unavailable" });
    },
  });
  await assert.rejects(
    firstService.service.createWorkspace({ graph, workspaceId: candidateId, expectedOwnerUid: uid }),
  );
  firstService.service.dispose();
  assert.equal((await getDoc(workspaceRef(database, candidateId))).exists(), true);

  // A new service instance models page reload: the persisted local admission
  // supplies the same candidate ID, so the existing graph is reconciled.
  const reloaded = productionAdapterService(uid, database, ["O".repeat(22)]);
  const recovered = await reloaded.service.createWorkspace({ graph, workspaceId: candidateId, expectedOwnerUid: uid });
  assert.equal(recovered.id, candidateId);
  const listed = await reloaded.service.listWorkspaces();
  assert.deepEqual(listed.workspaces.map((item) => item.id), [candidateId]);
  const parent = await getDoc(workspaceRef(database, candidateId));
  assert.equal(parent.data().ownerId, uid);
  reloaded.service.dispose();
});

test("fixed candidate collisions with other owners or different content fail closed", async () => {
  const ownerA = "candidate-a";
  const ownerB = "candidate-b";
  const candidateId = "P".repeat(22);
  const revision = "Q".repeat(22);
  const graphA = {
    project: { name: "Owner A candidate", type: "Software project", description: "" },
    nodes: [{ id: "node-a", label: "A", type: "Service", description: "" }],
    edges: [],
  };
  const graphB = {
    project: { name: "Different graph", type: "Software project", description: "" },
    nodes: [{ id: "node-b", label: "B", type: "Service", description: "" }],
    edges: [],
  };
  const dbA = env.authenticatedContext(ownerA).firestore();
  const seeded = productionAdapterService(ownerA, dbA, [revision]);
  await seeded.service.createWorkspace({ graph: graphA, workspaceId: candidateId, expectedOwnerUid: ownerA });
  const before = (await getDoc(workspaceRef(dbA, candidateId))).data();
  seeded.service.dispose();

  const sameOwner = productionAdapterService(ownerA, dbA, ["R".repeat(22)]);
  await assert.rejects(
    sameOwner.service.createWorkspace({ graph: graphB, workspaceId: candidateId, expectedOwnerUid: ownerA }),
    { code: "workspace-id-collision" },
  );
  assert.deepEqual((await getDoc(workspaceRef(dbA, candidateId))).data(), before);
  sameOwner.service.dispose();

  const dbB = env.authenticatedContext(ownerB).firestore();
  const otherOwner = productionAdapterService(ownerB, dbB, ["S".repeat(22), "T".repeat(22)]);
  await assert.rejects(
    otherOwner.service.createWorkspace({ graph: graphA, workspaceId: candidateId, expectedOwnerUid: ownerB }),
    (error) => error.code === "permission-denied" || error.code === "workspace-id-collision",
  );
  assert.deepEqual((await getDoc(workspaceRef(dbA, candidateId))).data(), before);
  otherOwner.service.dispose();
});

test("production Firebase adapter retries a colliding ID without overwriting existing owner data", async () => {
  const database = env.authenticatedContext("collision-owner").firestore();
  await createWorkspace("collision-owner");
  const existingBefore = (await getDoc(workspaceRef(database))).data();
  const existingChunkBefore = await readStoredChunk(REVISION_A, 0);
  const originalPayload = new TextDecoder().decode(existingChunkBefore.data().payload.toUint8Array());

  const { service, generatedCount } = productionAdapterService("collision-owner", database, [
    WORKSPACE_ID,
    REVISION_A,
    "W".repeat(22),
    "X".repeat(22),
  ]);
  const created = await service.createWorkspace({ graph: {
    project: { name: "New graph", type: "Software project", description: "" },
    nodes: [{ id: "new-node", label: "New node", type: "Service", description: "" }],
    edges: [],
  } });

  assert.equal(generatedCount(), 4);
  assert.equal(created.id, "W".repeat(22));
  assert.deepEqual((await getDoc(workspaceRef(database))).data(), existingBefore);
  const existingChunkAfter = await readStoredChunk(REVISION_A, 0);
  assert.equal(new TextDecoder().decode(existingChunkAfter.data().payload.toUint8Array()), originalPayload);
  assert.equal((await readStoredChunk(REVISION_A, 0)).exists(), true);
});

test("private reads and writes are owner-only; owner queries require an owner filter", async () => {
  const { database } = await createWorkspace("owner-a");
  const other = env.authenticatedContext("owner-b").firestore();
  const publicDb = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(workspaceRef(database)));
  await assertFails(getDoc(workspaceRef(other)));
  await assertFails(getDoc(workspaceRef(publicDb)));
  await assertSucceeds(getDocs(query(collection(database, "workspaces"), where("ownerId", "==", "owner-a"))));
  await assertFails(getDocs(query(collection(other, "workspaces"), where("ownerId", "==", "owner-a"))));
  await assertFails(getDocs(collection(database, "workspaces")));
  await assertFails(updateDoc(workspaceRef(other), { name: "Takeover", updatedAt: serverTimestamp() }));
  await assertFails(deleteDoc(workspaceRef(other)));
});

test("a stale previousRevision cannot replace the current graph", async () => {
  const database = env.authenticatedContext("owner-a").firestore();
  const currentJson = JSON.stringify({
    schemaVersion: 1,
    project: { name: "Current graph", type: "Software project" },
    nodes: [{ id: "node-1", label: "Node", type: "Service" }],
    edges: [],
  });
  const currentChunk = { index: 0, text: currentJson };
  const create = writeBatch(database);
  create.set(chunkRef(database, WORKSPACE_ID, REVISION_A, 0), firestoreChunk(currentChunk));
  create.set(workspaceRef(database), makeMetadata("owner-a", REVISION_A, currentJson, [currentChunk]));
  create.set(quotaRef(database, "owner-a"), quotaData([WORKSPACE_ID], WORKSPACE_ID));
  await assertSucceeds(create.commit());

  const json = JSON.stringify({
    schemaVersion: 1,
    project: { name: "Stale write", type: "Software project" },
    nodes: [{ id: "node-1", label: "Node", type: "Service" }],
    edges: [],
  });
  const chunk = { index: 0, text: json };
  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(chunkRef(context.firestore(), WORKSPACE_ID, REVISION_STALE, 0), firestoreChunk(chunk));
  });
  await assertFails(updateDoc(workspaceRef(database), {
    currentRevision: REVISION_STALE,
    previousRevision: REVISION_STALE,
    name: "Stale write",
    chunkCount: 1,
    byteLength: Buffer.byteLength(json, "utf8"),
    nodeCount: 1,
    edgeCount: 0,
    updatedAt: serverTimestamp(),
  }));
  assert.equal((await getDoc(workspaceRef(database))).data().currentRevision, REVISION_A);
});

test("metadata byteLength must equal actual post-write UTF-8 chunk bytes", async () => {
  const database = env.authenticatedContext("owner-a").firestore();
  const json = JSON.stringify({
    schemaVersion: 1,
    project: { name: "Bad envelope", type: "Software project" },
    nodes: [{ id: "node-1", label: "Node", type: "Service" }],
    edges: [],
  });
  const batch = writeBatch(database);
  batch.set(chunkRef(database, WORKSPACE_ID, REVISION_A, 0), firestoreChunk({ index: 0, text: json }));
  batch.set(workspaceRef(database), makeMetadata("owner-a", REVISION_A, json, [{ index: 0, text: json }], { byteLength: 1 }));
  batch.set(quotaRef(database, "owner-a"), quotaData([WORKSPACE_ID], WORKSPACE_ID));
  await assertFails(batch.commit());
  assert.equal((await readStoredWorkspace()).exists(), false);
});

test("rules reject undeclared extra chunks and UTF-8 chunks above 288 KiB", async () => {
  const database = env.authenticatedContext("owner-a").firestore();
  const json = JSON.stringify({
    schemaVersion: 1,
    project: { name: "Extra", type: "Software project" },
    nodes: [{ id: "node-1", label: "Node", type: "Service" }],
    edges: [],
  });
  const oneChunk = [{ index: 0, text: json }];
  const extraBatch = writeBatch(database);
  extraBatch.set(chunkRef(database, WORKSPACE_ID, REVISION_A, 0), firestoreChunk(oneChunk[0]));
  extraBatch.set(chunkRef(database, WORKSPACE_ID, REVISION_A, 1), firestoreChunk({ index: 1, text: "hidden" }));
  extraBatch.set(workspaceRef(database), makeMetadata("owner-a", REVISION_A, json, oneChunk));
  extraBatch.set(quotaRef(database, "owner-a"), quotaData([WORKSPACE_ID], WORKSPACE_ID));
  await assertFails(extraBatch.commit());

  const largeText = "x".repeat(288 * 1024 + 1);
  const largeJson = JSON.stringify({
    schemaVersion: 1,
    project: { name: "Too large", type: "Software project" },
    nodes: [{ id: "node-1", label: "Node", type: "Service" }],
    edges: [],
  });
  const largeBatch = writeBatch(database);
  largeBatch.set(chunkRef(database, WORKSPACE_ID, REVISION_B, 0), firestoreChunk({ index: 0, text: largeText }));
  largeBatch.set(workspaceRef(database), makeMetadata("owner-a", REVISION_B, largeText, [{ index: 0, text: largeText }], { name: "Too large" }));
  largeBatch.set(quotaRef(database, "owner-a"), quotaData([WORKSPACE_ID], WORKSPACE_ID));
  await assertFails(largeBatch.commit());
});

test("public readers can fetch only a currently shared known chunk and never write", async () => {
  const { database } = await createWorkspace("owner-a");
  await updateDoc(workspaceRef(database), { shared: true, updatedAt: serverTimestamp() });
  const publicDb = env.unauthenticatedContext().firestore();
  const other = env.authenticatedContext("owner-b").firestore();
  await assertSucceeds(getDoc(workspaceRef(publicDb)));
  await assertSucceeds(getDoc(chunkRef(publicDb, WORKSPACE_ID, REVISION_A, 0)));
  await assertFails(getDoc(chunkRef(publicDb, WORKSPACE_ID, REVISION_A, 8)));
  await assertFails(getDoc(workspaceRef(publicDb, "Z".repeat(22))));
  await assertFails(setDoc(workspaceRef(publicDb), makeMetadata("attacker", REVISION_STALE, "x", [{ index: 0, text: "x" }])));
  await assertFails(updateDoc(workspaceRef(other), { shared: false, updatedAt: serverTimestamp() }));
});

test("a shared reader cannot fetch a seeded chunk beyond metadata chunkCount", async () => {
  const database = env.authenticatedContext("owner-a").firestore();
  const json = JSON.stringify({
    schemaVersion: 1,
    project: { name: "One chunk", type: "Software project" },
    nodes: [{ id: "node-1", label: "Node", type: "Service" }],
    edges: [],
  });
  const batch = writeBatch(database);
  batch.set(chunkRef(database, WORKSPACE_ID, REVISION_A, 0), firestoreChunk({ index: 0, text: json }));
  batch.set(workspaceRef(database), makeMetadata("owner-a", REVISION_A, json, [{ index: 0, text: json }]));
  batch.set(quotaRef(database, "owner-a"), quotaData([WORKSPACE_ID], WORKSPACE_ID));
  await assertSucceeds(batch.commit());
  await updateDoc(workspaceRef(database), { shared: true, updatedAt: serverTimestamp() });

  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(chunkRef(context.firestore(), WORKSPACE_ID, REVISION_A, 1), firestoreChunk({ index: 1, text: "hidden" }));
  });
  const publicDb = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(chunkRef(publicDb, WORKSPACE_ID, REVISION_A, 0)));
  await assertFails(getDoc(chunkRef(publicDb, WORKSPACE_ID, REVISION_A, 1)));
});


test("concurrent owner saves with the same expected revision allow one winner only", async () => {
  const database = env.authenticatedContext("owner-a").firestore();
  const originalJson = JSON.stringify({
    schemaVersion: 1,
    project: { name: "Race base", type: "Software project" },
    nodes: [{ id: "node-1", label: "Node", type: "Service" }],
    edges: [],
  });
  const initialChunk = { index: 0, text: originalJson };
  const create = writeBatch(database);
  create.set(chunkRef(database, WORKSPACE_ID, REVISION_A, 0), firestoreChunk(initialChunk));
  create.set(workspaceRef(database), makeMetadata("owner-a", REVISION_A, originalJson, [initialChunk], { name: "Race base" }));
  create.set(quotaRef(database, "owner-a"), quotaData([WORKSPACE_ID], WORKSPACE_ID));
  await assertSucceeds(create.commit());

  let readerCount = 0;
  let releaseReaders;
  const bothRead = new Promise((resolve) => { releaseReaders = resolve; });
  const attempt = (revision, name) => runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(workspaceRef(database));
    const current = snapshot.data();
    if (current.currentRevision !== REVISION_A) {
      throw Object.assign(new Error("The expected revision is stale."), { code: "stale-revision" });
    }
    if (readerCount < 2) {
      readerCount += 1;
      if (readerCount === 2) releaseReaders();
      await bothRead;
    }
    const json = JSON.stringify({
      schemaVersion: 1,
      project: { name, type: "Software project" },
      nodes: [{ id: "node-1", label: "Node", type: "Service" }],
      edges: [],
    });
    transaction.set(chunkRef(database, WORKSPACE_ID, revision, 0), firestoreChunk({ index: 0, text: json }));
    transaction.delete(chunkRef(database, WORKSPACE_ID, REVISION_A, 0));
    transaction.update(workspaceRef(database), {
      name,
      currentRevision: revision,
      previousRevision: REVISION_A,
      chunkCount: 1,
      byteLength: Buffer.byteLength(json, "utf8"),
      nodeCount: 1,
      edgeCount: 0,
      updatedAt: serverTimestamp(),
    });
  });
  const results = await Promise.allSettled([
    attempt(REVISION_B, "Winner B"),
    attempt(REVISION_STALE, "Winner T"),
  ]);
  const winners = results.flatMap((result, index) => result.status === "fulfilled" ? [index] : []);
  assert.equal(winners.length, 1);
  const loserIndex = winners[0] === 0 ? 1 : 0;
  const losingRevision = loserIndex === 0 ? REVISION_B : REVISION_STALE;
  const finalWorkspace = await getDoc(workspaceRef(database));
  assert.notEqual(finalWorkspace.data().currentRevision, REVISION_A);
  assert.equal((await readStoredChunk(REVISION_A, 0)).exists(), false);
  assert.equal((await readStoredChunk(losingRevision, 0)).exists(), false);
});

const tinyGraph = { project: { name: "Quota fixture", type: "Software project" }, nodes: [{ id: "one", label: "One", type: "Service" }], edges: [] };
async function seedAccountCount(uid, count) {
  const encoded = encodeCloudGraph(tinyGraph);
  const ids = Array.from({length: count}, (_, index) => String(index).padStart(22,"Q"));
  await env.withSecurityRulesDisabled(async context => {
    const database = context.firestore(), batch = writeBatch(database);
    for (const id of ids) {
      batch.set(workspaceRef(database,id), makeMetadata(uid, REVISION_A, encoded.json, encoded.chunks));
      for (const chunk of encoded.chunks) batch.set(chunkRef(database,id,REVISION_A,chunk.index),firestoreChunk(chunk));
    }
    if (ids.length) batch.set(quotaRef(database,uid),quotaData(ids,ids.at(-1),"seed"));
    await batch.commit();
  });
  return ids;
}
test("production adapter enforces20, reconciles an existing candidate at the cap, and deletion frees one slot", async () => {
  const uid="quota-owner", ids=await seedAccountCount(uid,19), database=env.authenticatedContext(uid).firestore();
  const candidate="C".repeat(22), next="D".repeat(22);
  const {service}=productionAdapterService(uid,database,Array(12).fill(REVISION_B));
  await service.createWorkspace({graph:tinyGraph,workspaceId:candidate});
  assert.equal((await getDoc(quotaRef(database,uid))).data().workspaceIds.length,20);
  await service.createWorkspace({graph:tinyGraph,workspaceId:candidate});
  assert.equal((await getDoc(quotaRef(database,uid))).data().workspaceIds.length,20);
  await assert.rejects(service.createWorkspace({graph:tinyGraph,workspaceId:next}),{code:"workspace-limit"});
  assert.equal((await readStoredWorkspace(next)).exists(),false);
  await service.setShared({workspaceId:candidate,enabled:true});
  await service.deleteWorkspace(ids[0]);
  assert.equal((await getDoc(quotaRef(database,uid))).data().workspaceIds.length,19);
  await service.createWorkspace({graph:tinyGraph,workspaceId:next});
  assert.equal((await getDoc(quotaRef(database,uid))).data().workspaceIds.length,20);
  service.dispose();
});
test("concurrent creates compete atomically for the last slot without a21st workspace", async () => {
  const uid="race-owner"; await seedAccountCount(uid,19);
  const database=env.authenticatedContext(uid).firestore();
  const {service}=productionAdapterService(uid,database,Array.from({length:12},(_,index)=>index%2 ? REVISION_STALE : REVISION_B));
  const results=await Promise.allSettled(["B".repeat(22),"C".repeat(22)].map(workspaceId=>service.createWorkspace({graph:tinyGraph,workspaceId})));
  assert.equal(results.filter(result=>result.status==="fulfilled").length,1);
  assert.equal(results.find(result=>result.status==="rejected").reason.code,"workspace-limit");
  assert.equal((await getDocs(query(collection(database,"workspaces"),where("ownerId","==",uid)))).size,20);
  assert.equal((await getDoc(quotaRef(database,uid))).data().workspaceIds.length,20);
  service.dispose();
});
test("quota ownership, reset, phantom reservations and quota-less direct creates fail closed", async () => {
  const uid="guard-owner"; const ids=await seedAccountCount(uid,20);
  const database=env.authenticatedContext(uid).firestore(), other=env.authenticatedContext("other").firestore();
  await assertFails(getDoc(quotaRef(other,uid)));
  await assertFails(deleteDoc(quotaRef(database,uid)));
  await assertFails(updateDoc(quotaRef(database,uid),{workspaceIds:[],lastAction:"delete",lastWorkspaceId:ids[0],updatedAt:serverTimestamp()}));
  const encoded=encodeCloudGraph(tinyGraph), candidate="N".repeat(22), batch=writeBatch(database);
  for(const chunk of encoded.chunks)batch.set(chunkRef(database,candidate,REVISION_B,chunk.index),firestoreChunk(chunk));
  batch.set(workspaceRef(database,candidate),makeMetadata(uid,REVISION_B,encoded.json,encoded.chunks));
  await assertFails(batch.commit());
  // Bypass the client helper entirely: the database must still deny a21st atomic create.
  const bypass = writeBatch(database);
  for (const chunk of encoded.chunks) bypass.set(chunkRef(database,candidate,REVISION_B,chunk.index),firestoreChunk(chunk));
  bypass.set(workspaceRef(database,candidate),makeMetadata(uid,REVISION_B,encoded.json,encoded.chunks));
  bypass.update(quotaRef(database,uid), {workspaceIds:[...ids,candidate],lastWorkspaceId:candidate,lastAction:"create",updatedAt:serverTimestamp()});
  await assertFails(bypass.commit());
  assert.equal((await getDoc(quotaRef(database,uid))).data().workspaceIds.length,20);
  const fresh=env.authenticatedContext("fresh-owner").firestore();
  await assertFails(setDoc(quotaRef(fresh,"fresh-owner"),quotaData([candidate],candidate)));
  assert.equal((await readStoredWorkspace(candidate)).exists(),false);
});
test("the quota is per account, and uninitialized legacy data cannot be silently reset", async () => {
  await seedAccountCount("full-owner",20);
  const uid="fresh-owner", database=env.authenticatedContext(uid).firestore();
  const {service}=productionAdapterService(uid,database,[REVISION_B]);
  await service.createWorkspace({graph:tinyGraph,workspaceId:"F".repeat(22)});
  assert.equal((await getDoc(quotaRef(database,uid))).data().workspaceIds.length,1);
  service.dispose();
  await env.withSecurityRulesDisabled(async context=>{await deleteDoc(quotaRef(context.firestore(),uid));});
  const legacy=productionAdapterService(uid,database,[REVISION_STALE]);
  await assert.rejects(legacy.service.createWorkspace({graph:tinyGraph,workspaceId:"L".repeat(22)}),{code:"quota-uninitialized"});
  assert.equal((await readStoredWorkspace("F".repeat(22))).exists(),true);
  legacy.service.dispose();
});
test("quota activation can pause new creates without blocking existing graph updates", async () => {
  const {database}=await createWorkspace("owner-a");
  await env.withSecurityRulesDisabled(async context=>{await setDoc(doc(context.firestore(),"system","workspaceQuota"),{enabled:false});});
  await saveRevision(database,REVISION_A,REVISION_B);
  const fresh=env.authenticatedContext("fresh").firestore(), encoded=encodeCloudGraph(tinyGraph), candidate="P".repeat(22), batch=writeBatch(fresh);
  batch.set(workspaceRef(fresh,candidate),makeMetadata("fresh",REVISION_B,encoded.json,encoded.chunks));
  for(const chunk of encoded.chunks)batch.set(chunkRef(fresh,candidate,REVISION_B,chunk.index),firestoreChunk(chunk));
  batch.set(quotaRef(fresh,"fresh"),quotaData([candidate],candidate));
  await assertFails(batch.commit());
  assert.equal((await getDoc(workspaceRef(database))).data().currentRevision,REVISION_B);
});

test("grandfathered over-limit maps remain editable and deletable without an automatic purge", async () => {
  const uid="legacy-large-owner", ids=await seedAccountCount(uid,21), database=env.authenticatedContext(uid).firestore();
  const {service}=productionAdapterService(uid,database,Array(12).fill(REVISION_B));
  await assert.rejects(service.createWorkspace({graph:tinyGraph,workspaceId:"G".repeat(22)}),{code:"workspace-limit"});
  const changed={...tinyGraph,project:{...tinyGraph.project,name:"Still editable"}};
  await service.saveWorkspace({workspaceId:ids[0],graph:changed,expectedRevision:REVISION_A});
  await service.setShared({workspaceId:ids[0],enabled:true});
  assert.equal((await getDocs(query(collection(database,"workspaces"),where("ownerId","==",uid)))).size,21);
  await service.deleteWorkspace(ids[1]);
  await service.deleteWorkspace(ids[2]);
  await service.createWorkspace({graph:tinyGraph,workspaceId:"G".repeat(22)});
  assert.equal((await getDoc(quotaRef(database,uid))).data().workspaceIds.length,20);
  assert.equal((await getDoc(workspaceRef(database,ids[0]))).data().name,"Still editable");
  service.dispose();
});


async function seedAdminDirectory(uids = ["admin", "member"]) {
  await env.withSecurityRulesDisabled(async context => {
    const database = context.firestore();
    await setDoc(doc(database, "system", "adminAccess"), { schemaVersion: 1, adminUid: "admin" });
    for (const uid of uids) await setDoc(doc(database, "accountProfiles", uid), { schemaVersion: 1, uid, name: uid, email: uid + "@example.test", createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    await setDoc(doc(database, "accountLimits", "admin"), { schemaVersion: 1, maxWorkspaces: null, updatedBy: "admin", updatedAt: serverTimestamp() });
  });
}
const allowanceRef = (database, uid = "member") => doc(database, "accountLimits", uid);
const allowanceData = (maximum, uid = "admin") => ({ schemaVersion: 1, maxWorkspaces: maximum, updatedBy: uid, updatedAt: serverTimestamp() });

test("sole administrator can read the private directory and usage without gaining access to private maps", async () => {
  await seedAdminDirectory(); await seedAccountCount("member", 1);
  const admin = env.authenticatedContext("admin").firestore(), member = env.authenticatedContext("member").firestore(), publicDb = env.unauthenticatedContext().firestore();
  assert.equal((await assertSucceeds(getDocs(collection(admin, "accountProfiles")))).size, 2);
  await assertSucceeds(getDoc(quotaRef(admin, "member")));
  await assertFails(getDocs(collection(member, "accountProfiles")));
  await assertFails(getDoc(doc(member, "accountProfiles", "admin")));
  await assertFails(getDocs(collection(publicDb, "accountProfiles")));
  await assertFails(getDoc(allowanceRef(publicDb, "admin")));
  const owned = await getDoc(quotaRef(member, "member"));
  await assertFails(getDoc(workspaceRef(admin, owned.data().workspaceIds[0])));
});

test("clients cannot bootstrap or replace the sole administrator, including through fake admin claims", async () => {
  await seedAdminDirectory();
  for (const uid of ["admin", "member"]) {
    const database = env.authenticatedContext(uid, { admin: true, email: "admin@example.test", email_verified: true }).firestore();
    await assertFails(setDoc(doc(database, "system", "adminAccess"), { adminUid: uid }));
    await assertFails(deleteDoc(doc(database, "system", "adminAccess")));
    if (uid !== "admin") await assertFails(setDoc(allowanceRef(database), allowanceData(null, uid)));
    if (uid !== "admin") await assertFails(getDoc(allowanceRef(database, "admin")));
  }
});

test("only administrator can grant30/40/unlimited or restore20, with validated account/audit fields", async () => {
  await seedAdminDirectory(); const admin = env.authenticatedContext("admin").firestore(), member = env.authenticatedContext("member").firestore();
  for (const maximum of [30, 40, null, 20]) {
    await assertSucceeds(setDoc(allowanceRef(admin), allowanceData(maximum)));
    assert.equal((await assertSucceeds(getDoc(allowanceRef(member)))).data().maxWorkspaces, maximum);
    await assertFails(setDoc(allowanceRef(member), allowanceData(null, "member")));
  }
  for (const maximum of [false, "unlimited", 100, -1]) await assertFails(setDoc(allowanceRef(admin), allowanceData(maximum)));
  await assertFails(setDoc(allowanceRef(admin), { ...allowanceData(30), updatedBy: "member" }));
  await assertFails(setDoc(allowanceRef(admin), { ...allowanceData(30), role: "admin" }));
  await assertFails(setDoc(allowanceRef(admin), { ...allowanceData(30), updatedAt: new Date() }));
  await assertFails(setDoc(allowanceRef(admin, "unknown"), allowanceData(30)));
  await assertFails(setDoc(allowanceRef(admin, "admin"), allowanceData(20)));
  await assertFails(deleteDoc(allowanceRef(admin, "admin")));
  await assertSucceeds(deleteDoc(allowanceRef(admin)));
});

test("profile enrollment is confined to verified own token claims and grants no privileges", async () => {
  await seedAdminDirectory();
  const uid = "new-member", claims = { email: "new@example.test", email_verified: true, name: "New member" };
  const database = env.authenticatedContext(uid, claims).firestore();
  const reference = doc(database, "accountProfiles", uid);
  const profile = { schemaVersion: 1, uid, name: claims.name, email: claims.email, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(reference, profile));
  await assertFails(updateDoc(reference, { email: "admin@example.test", updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(reference, { name: "Fake", updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(reference, { admin: true, updatedAt: serverTimestamp() }));
  await assertFails(setDoc(doc(database, "accountProfiles", "admin"), { ...profile, uid: "admin" }));
  await assertFails(deleteDoc(reference));
  const unverified = env.authenticatedContext("unverified", { ...claims, email_verified: false }).firestore();
  await assertFails(setDoc(doc(unverified, "accountProfiles", "unverified"), { ...profile, uid: "unverified" }));
});

test("production admin adapter lists names/counts, grants limits and guards stale concurrent edits", async () => {
  await seedAdminDirectory(); await seedAccountCount("member", 2);
  const { service } = productionAdapterService("admin", env.authenticatedContext("admin").firestore(), []);
  assert.equal((await service.getAdminAccess()).isAdmin, true);
  const directory = await service.listAdminAccounts();
  const member = directory.accounts.find(row => row.uid === "member");
  assert.equal(member.workspaceCount, 2); assert.equal(member.maxWorkspaces, 20);
  const granted = await service.setAccountLimit({ targetUid: "member", maxWorkspaces: 40, expectedUpdatedAt: null, expectedAdminUid: "admin" });
  assert.equal(granted.maxWorkspaces, 40); assert.ok(granted.allowanceUpdatedAt);
  await assert.rejects(service.setAccountLimit({ targetUid: "member", maxWorkspaces: 30, expectedUpdatedAt: null, expectedAdminUid: "admin" }), { code: "admin-conflict" });
  await service.setAccountLimit({ targetUid: "member", maxWorkspaces: 20, expectedUpdatedAt: granted.allowanceUpdatedAt, expectedAdminUid: "admin" });
  const { service: denied } = productionAdapterService("member", env.authenticatedContext("member").firestore(), []);
  assert.equal((await denied.getAdminAccess()).isAdmin, false);
  await assert.rejects(denied.listAdminAccounts(), { code: "admin-required" });
  service.dispose(); denied.dispose();
});

test("custom30/40 caps and unlimited are enforced by production admission and database rules", async () => {
  await seedAdminDirectory(["admin", "limit-30", "limit-40", "unlimited"]);
  const admin = env.authenticatedContext("admin").firestore();
  for (const maximum of [30, 40, null]) {
    const uid = maximum === null ? "unlimited" : "limit-" + maximum;
    const count = maximum === null ? 42 : maximum - 1;
    await seedAccountCount(uid, count);
    await setDoc(allowanceRef(admin, uid), allowanceData(maximum));
    const database = env.authenticatedContext(uid).firestore();
    const { service } = productionAdapterService(uid, database, Array(12).fill(REVISION_B));
    const candidate = (maximum === 30 ? "M" : maximum === 40 ? "N" : "U").repeat(22);
    await service.createWorkspace({ graph: tinyGraph, workspaceId: candidate });
    assert.equal((await getDoc(quotaRef(database, uid))).data().workspaceIds.length, count + 1);
    if (maximum !== null) {
      await assert.rejects(service.createWorkspace({ graph: tinyGraph, workspaceId: "X".repeat(22) }), { code: "workspace-limit" });
      const encoded = encodeCloudGraph(tinyGraph), next = "Y".repeat(22), bypass = writeBatch(database);
      for (const chunk of encoded.chunks) bypass.set(chunkRef(database, next, REVISION_B, chunk.index), firestoreChunk(chunk));
      bypass.set(workspaceRef(database, next), makeMetadata(uid, REVISION_B, encoded.json, encoded.chunks));
      const ids = (await getDoc(quotaRef(database, uid))).data().workspaceIds;
      bypass.update(quotaRef(database, uid), { workspaceIds: [...ids, next], lastWorkspaceId: next, lastAction: "create", updatedAt: serverTimestamp() });
      await assertFails(bypass.commit());
    }
    service.dispose();
  }
});

test("downgrading an over-limit member keeps editing/export/delete and rejects only new admissions", async () => {
  await seedAdminDirectory(); const ids = await seedAccountCount("member", 30);
  const admin = env.authenticatedContext("admin").firestore();
  await setDoc(allowanceRef(admin), allowanceData(20));
  const database = env.authenticatedContext("member").firestore();
  const { service } = productionAdapterService("member", database, Array(12).fill(REVISION_B));
  const saved = await service.saveWorkspace({ workspaceId: ids[0], graph: { ...tinyGraph, project: { name: "Kept after downgrade", type: "Software project" } }, expectedRevision: REVISION_A });
  await service.setShared({ workspaceId: ids[0], enabled: true });
  await assertSucceeds(getDoc(chunkRef(database, ids[0], saved.currentRevision, 0)));
  await service.deleteWorkspace(ids[1]);
  assert.equal((await getDoc(quotaRef(database, "member"))).data().workspaceIds.length, 29);
  await assert.rejects(service.createWorkspace({ graph: tinyGraph, workspaceId: "D".repeat(22) }), { code: "workspace-limit" });
  service.dispose();
});

test("maximum eight-chunk graph can create with an override within rule document-read budgets", async () => {
  await seedAdminDirectory(); await seedAccountCount("member", 20);
  await setDoc(allowanceRef(env.authenticatedContext("admin").firestore()), allowanceData(30));
  const { service } = productionAdapterService("member", env.authenticatedContext("member").firestore(), Array(12).fill(REVISION_B));
  const maximum = makeTwoMiBGraph();
  const encoded = encodeCloudGraph(maximum); assert.equal(encoded.chunkCount, 8);
  const created = await service.createWorkspace({ graph: maximum, workspaceId: "E".repeat(22) });
  assert.equal(created.nodeCount, 800); service.dispose();
});


async function watchReadyGraph(service, workspaceId) {
  return new Promise((resolve, reject) => {
    let unsubscribe;
    const timeout = setTimeout(() => {
      unsubscribe?.();
      reject(new Error("Timed out reading the recreated workspace"));
    }, 15000);
    unsubscribe = service.watchWorkspace({ workspaceId }, snapshot => {
      if (snapshot.status === "ready" || snapshot.status === "error") {
        clearTimeout(timeout);
        unsubscribe?.();
        if (snapshot.status === "ready") resolve(snapshot);
        else reject(snapshot.error || new Error("Recreated workspace could not be read"));
      }
    });
  });
}

const recreatedAgentGraph = () => ({
  project: { name: "Reopened agent map", type: "Backend", description: "Disposable deletion regression" },
  nodes: [{ id: "api", label: "API", type: "API" }, { id: "database", label: "Database", type: "Database" }],
  edges: [{ id: "stores", source: "api", target: "database", label: "stores" }],
});

test("the same owner can move an agent map again after deleting its earlier cloud and local copies", async () => {
  const uid = "manual-reimport-owner";
  const database = env.authenticatedContext(uid).firestore();
  const { service } = productionAdapterService(uid, database, [REVISION_A, REVISION_B]);
  try {
    const graph = recreatedAgentGraph();
    const projectId = "same-agent-fragment-hash";
    const associations = {};
    // Reopening the agent link recreates the same local content ID. Local-only
    // admission reserves an ID but never submits it; a manual move is allowed.
    const move = async candidate => {
      associations[projectId] = { workspaceId: "Z".repeat(22), ownerUid: uid, source: "fragment", pending: true, committed: false, admissionStatus: "local", confirmationRequired: true };
      assert.equal(hasUnresolvedLocalCloudCandidate(associations[projectId], workspaceForLocalAssociation(associations[projectId], uid)), false);
      assert.equal(reusableManualMoveAttempt(associations[projectId], uid), null);
      associations[projectId] = { workspaceId: candidate, ownerUid: uid, source: "manual", pending: true, committed: false, graphFingerprint: JSON.stringify(graph), idempotencyKey: "manual:" + candidate };
      await service.createWorkspace({ graph, workspaceId: candidate, expectedOwnerUid: uid });
      assert.equal(commitManualMoveAssociation(associations, projectId, () => true), true);
      assert.equal(workspaceForLocalAssociation(associations[projectId], uid), candidate);
      const ready = await watchReadyGraph(service, candidate);
      assert.equal(encodeCloudGraph(ready.graph).json, encodeCloudGraph(graph).json);
    };
    await move("A".repeat(22));
    await service.deleteWorkspace("A".repeat(22));
    delete associations[projectId]; // Confirmed cloud/local deletion clears the receipt.
    assert.equal((await readStoredWorkspace("A".repeat(22))).exists(), false);
    assert.deepEqual((await getDoc(quotaRef(database, uid))).data().workspaceIds, []);
    await move("B".repeat(22));
    assert.deepEqual((await service.listWorkspaces()).workspaces.map(item => item.id), ["B".repeat(22)]);
    assert.deepEqual((await getDoc(quotaRef(database, uid))).data().workspaceIds, ["B".repeat(22)]);
  } finally { service.dispose(); }
});

test("reopening identical agent content retires deleted admission results and reads the new cloud graph", async () => {
  const uid = "admission-reimport-owner";
  const database = env.authenticatedContext(uid).firestore();
  const { service } = productionAdapterService(uid, database, [REVISION_A, REVISION_B]);
  try {
    const account = { getState: () => ({ initialized: true, user: { uid } }), getPreferenceState: () => ({ saveFutureMaps: true }), getService: async () => service };
    const controller = createMapAdmissionController({ account, createWorkspace: input => input.service.createWorkspace({ graph: input.graph, workspaceId: input.candidateWorkspaceId, expectedOwnerUid: input.ownerUid }) });
    const admission = { source: "fragment", key: "same-agent-content", projectId: "same-local-hash", graph: recreatedAgentGraph(), expectedOwnerUid: uid };
    const original = await controller.admit({ ...admission, candidateWorkspaceId: "A".repeat(22) });
    assert.equal(original.status, "saved");
    await service.deleteWorkspace(original.workspace.id);
    assert.equal(controller.forget({ workspaceId: original.workspace.id, ownerUid: uid }), 1);
    assert.equal(controller.forget({ projectId: admission.projectId }), 0);
    const recreated = await controller.admit({ ...admission, candidateWorkspaceId: "B".repeat(22) });
    assert.equal(recreated.status, "saved");
    assert.equal(recreated.workspace.id, "B".repeat(22));
    const ready = await watchReadyGraph(service, recreated.workspace.id);
    assert.equal(encodeCloudGraph(ready.graph).json, encodeCloudGraph(admission.graph).json);
    assert.deepEqual((await service.listWorkspaces()).workspaces.map(item => item.id), [recreated.workspace.id]);
  } finally { service.dispose(); }
});

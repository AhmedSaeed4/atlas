import {
  browserLocalPersistence,
  initializeAuth,
  indexedDBLocalPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  Bytes,
  collection,
  doc,
  documentId,
  limit,
  orderBy,
  startAfter,
  getDocFromServer,
  getDocsFromServer,
  initializeFirestore,
  memoryLocalCache,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
  getFirestore,
} from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { getCloudConfigStatus, isCloudConfigured, firebaseConfig } from "./cloud-config.js";
import { subscribeWhenReady, waitForAuthSession } from "./cloud-subscription.js";
import {
  CloudModelError,
  createRandomWorkspaceId,
  createWorkspaceViewUrl,
  decodeCloudGraphChunks,
  encodeCloudGraph,
  normalizeWorkspaceId,
  normalizeWorkspaceMetadata,
} from "./cloud-model.js";

const APP_NAME = "atlas-online-workspaces";
const WORKSPACES = "workspaces";
import { CloudQuotaError, addRegistryWorkspace, removeRegistryWorkspace, registryWorkspaceIds } from "./cloud-quota.js";
import { accountProfileFromClaims, accountUid, timestampText, validateWorkspaceLimit, workspaceLimit } from "./account-access.js";


export class CloudServiceError extends Error {
  constructor(message, code = "cloud-error", { status = "error", cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "CloudServiceError";
    this.code = code;
    this.status = status;
  }
}

export class CloudConflictError extends CloudServiceError {
  constructor(expectedRevision, actualRevision) {
    super(
      "This workspace changed in another tab or device. Reload the online version before saving again.",
      "conflict",
      { status: "conflict" },
    );
    this.name = "CloudConflictError";
    this.expectedRevision = expectedRevision;
    this.actualRevision = actualRevision;
  }
}

function firebaseError(error) {
  if (error instanceof CloudServiceError) return error;
  if (error instanceof CloudQuotaError) return new CloudServiceError(error.message, error.code, { cause: error });
  if (error instanceof CloudModelError) {
    return new CloudServiceError(error.message, error.code, { status: "invalid", cause: error });
  }

  const rawCode = typeof error?.code === "string" ? error.code : "cloud-error";
  if (rawCode === "auth/popup-blocked") {
    return new CloudServiceError("Your browser blocked the Google sign-in popup. Allow popups for Atlas and try again.", "popup-blocked", { status: "popup-blocked", cause: error });
  }
  if (rawCode === "auth/popup-closed-by-user" || rawCode === "auth/cancelled-popup-request") {
    return new CloudServiceError("Google sign-in was cancelled.", "cancelled", { status: "cancelled", cause: error });
  }
  if (rawCode === "permission-denied" || rawCode === "storage/unauthorized") {
    return new CloudServiceError("You do not have permission to use this online workspace.", "permission-denied", { status: "permission-denied", cause: error });
  }
  if (rawCode === "not-found" || rawCode === "auth/user-not-found") {
    return new CloudServiceError("This online workspace no longer exists.", "not-found", { status: "not-found", cause: error });
  }
  if (rawCode === "unauthenticated" || rawCode === "auth/user-token-expired") {
    return new CloudServiceError("Sign in to manage your online workspaces.", "unauthenticated", { status: "unauthenticated", cause: error });
  }
  if (["unavailable", "deadline-exceeded", "network-request-failed", "auth/network-request-failed"].includes(rawCode)) {
    return new CloudServiceError("Atlas cannot reach the online workspace service. Check your connection and try again.", "offline", { status: "offline", cause: error });
  }
  return new CloudServiceError(
    typeof error?.message === "string" && error.message ? error.message : "The online workspace request failed.",
    rawCode,
    { status: "error", cause: error },
  );
}

function safeIdentity(user) {
  if (!user || typeof user.uid !== "string" || !user.uid) return null;
  const text = (value) => typeof value === "string" ? value : "";
  return Object.freeze({
    uid: user.uid,
    displayName: text(user.displayName),
    email: text(user.email),
    photoURL: text(user.photoURL),
  });
}

function workspaceSummary(metadata) {
  return Object.freeze({
    id: metadata.id,
    ownerId: metadata.ownerId,
    name: metadata.name,
    projectType: metadata.projectType,
    nodeCount: metadata.nodeCount,
    edgeCount: metadata.edgeCount,
    shared: metadata.shared,
    deleting: metadata.deleting,
    currentRevision: metadata.currentRevision,
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
  });
}

export function createFirebaseAdapter(config, {
  app: providedApp,
  auth: providedAuth,
  db: providedDb,
  persistenceReady: injectedPersistenceReady,
  workspaceIdFactory = createRandomWorkspaceId,
  commitBatch: injectedCommitBatch,
  readWorkspaceFromServer: injectedWorkspaceRead,
} = {}) {
  let app = providedApp;
  if (!app) {
    app = getApps().find((candidate) => candidate.name === APP_NAME);
    if (app && app.options.projectId !== config.projectId) {
      throw new CloudServiceError("Atlas is already connected to a different Firebase project.", "project-mismatch", { status: "configuration" });
    }
    if (!app) app = initializeApp(config, APP_NAME);
  }

  // Configure persistent storage before Auth initializes so its cross-tab
  // listener watches the same storage it uses for the session. Both choices
  // are LOCAL; IndexedDB is preferred with localStorage as a fallback.
  const auth = providedAuth || initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  });
  let db = providedDb;
  if (!db) {
    try {
      db = initializeFirestore(app, { localCache: memoryLocalCache() });
    } catch (error) {
      if (error?.code !== "failed-precondition" && error?.code !== "already-initialized") throw error;
      db = getFirestore(app);
    }
  }

  const persistenceReady = injectedPersistenceReady ?? auth.authStateReady();
  const authSessionReady = (uid) => waitForAuthSession({ auth, persistenceReady, uid });
  const commitBatch = typeof injectedCommitBatch === "function"
    ? injectedCommitBatch
    : (batch) => batch.commit();
  const readWorkspaceFromServer = typeof injectedWorkspaceRead === "function"
    ? injectedWorkspaceRead
    : getDocFromServer;
  const workspaceRef = (id) => doc(db, WORKSPACES, id);
  const quotaRef = (uid) => doc(db, "workspaceQuota", uid);
  const profileRef = (uid) => doc(db, "accountProfiles", accountUid(uid));
  const limitRef = (uid) => doc(db, "accountLimits", accountUid(uid));
  const adminRef = () => doc(db, "system", "adminAccess");
  async function assertAdmin(uid) {
    await authSessionReady(uid);
    const snapshot = await getDocFromServer(adminRef());
    await authSessionReady(uid);
    if (!snapshot.exists() || snapshot.data().adminUid !== uid) {
      throw new CloudServiceError("This page is only available to the administrator.", "admin-required", { status: "permission-denied" });
    }
  }
  async function syncAccountProfile(user) {
    if (typeof user?.getIdTokenResult !== "function") return;
    const token = await user.getIdTokenResult();
    const profile = accountProfileFromClaims(user.uid, token.claims);
    if (!profile) return;
    await authSessionReady(user.uid);
    await runTransaction(db, async transaction => {
      const current = await transaction.get(profileRef(user.uid));
      const old = current.exists() ? current.data() : null;
      if (old?.name === profile.name && old?.email === profile.email && old?.schemaVersion === 1 && old?.uid === user.uid) return;
      await authSessionReady(user.uid);
      transaction.set(profileRef(user.uid), { ...profile, createdAt: old?.createdAt || serverTimestamp(), updatedAt: serverTimestamp() });
    });
  }
  const revisionRef = (id, revision) => doc(db, WORKSPACES, id, "revisions", revision);
  const chunksCollection = (id, revision) => collection(revisionRef(id, revision), "chunks");
  const chunkRef = (id, revision, index) => doc(chunksCollection(id, revision), String(index));
  const utf8Encoder = new TextEncoder();
  const chunkData = (chunk) => ({
    index: chunk.index,
    payload: Bytes.fromUint8Array(utf8Encoder.encode(chunk.text)),
  });
  const localIsoNow = () => new Date().toISOString();

  function metadataForGraph({ uid, encoded, revision, previousRevision, shared, createdAt }) {
    const now = serverTimestamp();
    return {
      schemaVersion: 1,
      ownerId: uid,
      shared,
      deleting: false,
      name: encoded.graph.project.name,
      projectType: encoded.graph.project.type,
      currentRevision: revision,
      previousRevision,
      chunkCount: encoded.chunkCount,
      byteLength: encoded.byteLength,
      nodeCount: encoded.graph.nodes.length,
      edgeCount: encoded.graph.edges.length,
      createdAt: createdAt || now,
      updatedAt: now,
    };
  }

  function metadataResult(id, data, fallbackTime = localIsoNow()) {
    return {
      id,
      schemaVersion: data.schemaVersion,
      ownerId: data.ownerId,
      shared: data.shared,
      deleting: data.deleting,
      name: data.name,
      projectType: data.projectType,
      currentRevision: data.currentRevision,
      previousRevision: data.previousRevision,
      chunkCount: data.chunkCount,
      byteLength: data.byteLength,
      nodeCount: data.nodeCount,
      edgeCount: data.edgeCount,
      createdAt: data.createdAt && typeof data.createdAt.toDate === "function"
        ? data.createdAt.toDate().toISOString() : (data.createdAt || fallbackTime),
      updatedAt: data.updatedAt && typeof data.updatedAt.toDate === "function"
        ? data.updatedAt.toDate().toISOString() : (data.updatedAt || fallbackTime),
    };
  }

  async function readAllChunks(transaction, id, revision, count) {
    const refs = Array.from({ length: count }, (_, index) => chunkRef(id, revision, index));
    return Promise.all(refs.map((reference) => transaction.get(reference)));
  }

  function mapOwnedSnapshot(snapshot) {
    return snapshot.docs.map((entry) => normalizeWorkspaceMetadata(entry.id, entry.data()));
  }

  async function fetchGraphRevision(id, metadata) {
    const references = Array.from(
      { length: metadata.chunkCount },
      (_, index) => chunkRef(id, metadata.currentRevision, index),
    );
    const snapshots = await Promise.all(references.map((reference) => getDocFromServer(reference)));
    const chunks = snapshots.map((snapshot, index) => {
      if (!snapshot.exists()) {
        throw new CloudServiceError("The online workspace is missing a graph chunk.", "missing-chunk", { status: "invalid" });
      }
      const data = snapshot.data();
      if (!data.payload || typeof data.payload.toUint8Array !== "function") {
        throw new CloudServiceError("The online workspace contains an invalid graph chunk.", "invalid-chunk", { status: "invalid" });
      }
      let text;
      try {
        text = new TextDecoder("utf-8", { fatal: true }).decode(data.payload.toUint8Array());
      } catch (error) {
        throw new CloudServiceError("The online workspace contains invalid UTF-8 graph data.", "invalid-chunk", { status: "invalid", cause: error });
      }
      return { index: data.index, text };
    });
    const decoded = decodeCloudGraphChunks({
      chunks,
      chunkCount: metadata.chunkCount,
      byteLength: metadata.byteLength,
    });
    if (decoded.graph.nodes.length !== metadata.nodeCount || decoded.graph.edges.length !== metadata.edgeCount) {
      throw new CloudServiceError("The online workspace graph counts do not match its metadata.", "count-mismatch", { status: "invalid" });
    }
    return decoded;
  }

  function watchWorkspace(uid, id, callback) {
    const reference = workspaceRef(id);
    let stopped = false;
    let generation = 0;
    const emit = (event) => {
      if (stopped) return;
      callback(event);
    };

    const loadSnapshot = async (snapshot, eventGeneration) => {
      if (stopped || eventGeneration !== generation) return;
      if (snapshot.metadata?.fromCache) {
        // Listeners emit cached state before the server response even online.
        // A real network failure arrives through the listener error callback.
        emit({ status: "loading" });
        return;
      }
      if (snapshot.metadata?.hasPendingWrites) {
        emit({ status: "loading" });
        return;
      }
      if (!snapshot.exists()) {
        emit({ status: "deleted" });
        return;
      }

      let metadata;
      try {
        metadata = normalizeWorkspaceMetadata(id, snapshot.data());
      } catch (error) {
        emit({ status: "error", error: firebaseError(error) });
        return;
      }
      const isOwner = metadata.ownerId === auth.currentUser?.uid;
      if (!metadata.shared && !isOwner) {
        emit({ status: "revoked" });
        return;
      }

      try {
        const decoded = await fetchGraphRevision(id, metadata);
        if (stopped || eventGeneration !== generation) return;

        const latestSnapshot = await getDocFromServer(reference);
        if (!latestSnapshot.exists()) {
          emit({ status: "deleted" });
          return;
        }
        const latestMetadata = normalizeWorkspaceMetadata(id, latestSnapshot.data());
        const stillOwner = latestMetadata.ownerId === auth.currentUser?.uid;
        if (!latestMetadata.shared && !stillOwner) {
          emit({ status: "revoked" });
          return;
        }
        if (latestMetadata.currentRevision !== metadata.currentRevision
            || latestMetadata.chunkCount !== metadata.chunkCount
            || latestMetadata.byteLength !== metadata.byteLength) {
          emit({ status: "loading" });
          return;
        }
        emit({ status: "ready", metadata, chunks: decoded });
      } catch (error) {
        if (stopped || eventGeneration !== generation) return;
        const serviceError = firebaseError(error);
        emit({ status: serviceError.status === "permission-denied" ? "revoked" : "error", error: serviceError });
      }
    };

    const unsubscribe = subscribeWhenReady(authSessionReady(uid),
      () => onSnapshot(
        reference,
        { includeMetadataChanges: true },
        (snapshot) => {
          generation += 1;
          const eventGeneration = generation;
          loadSnapshot(snapshot, eventGeneration);
        },
        (error) => {
          const serviceError = firebaseError(error);
          emit({ status: serviceError.status === "permission-denied" ? "revoked" : serviceError.status, error: serviceError });
        },
      ),
      (error) => {
        const serviceError = firebaseError(error);
        emit({ status: serviceError.status === "permission-denied" ? "revoked" : serviceError.status, error: serviceError });
      },
    );
    return () => {
      stopped = true;
      generation += 1;
      unsubscribe();
    };
  }

  return {
    // Observe only after the SDK has restored the persisted session.
    observeAuth: (callback) => subscribeWhenReady(
      persistenceReady,
      () => firebaseOnAuthStateChanged(auth, (user) => {
        callback(user);
        // Directory metadata is optional and never delays sign-in or stores tokens.
        if (user) void syncAccountProfile(user).catch(() => {});
      }, (error) => callback(null, error)),
      (error) => callback(null, error),
    ),
    getAdminAccess: async uid => {
      await authSessionReady(uid);
      const snapshot = await getDocFromServer(adminRef());
      await authSessionReady(uid);
      return { isAdmin: snapshot.exists() && snapshot.data().adminUid === uid };
    },
    listAdminAccounts: async (uid, afterUid = "") => {
      await assertAdmin(uid);
      const constraints = [orderBy(documentId()), limit(50)];
      if (afterUid) constraints.push(startAfter(accountUid(afterUid)));
      const page = await getDocsFromServer(query(collection(db, "accountProfiles"), ...constraints));
      const accounts = await Promise.all(page.docs.map(async entry => {
        const [allowance, usage] = await Promise.all([getDocFromServer(limitRef(entry.id)), getDocFromServer(quotaRef(entry.id))]);
        const profile = entry.data();
        return Object.freeze({ uid: entry.id, name: String(profile.name || ""), email: String(profile.email || ""),
          maxWorkspaces: workspaceLimit(allowance.exists() ? allowance.data() : null),
          allowanceUpdatedAt: allowance.exists() ? timestampText(allowance.data().updatedAt) : null,
          workspaceCount: usage.exists() ? registryWorkspaceIds(usage.data()).length : null,
          isAdmin: entry.id === uid });
      }));
      await authSessionReady(uid);
      return { accounts, nextCursor: page.size === 50 ? page.docs.at(-1).id : null };
    },
    setAccountLimit: async (uid, targetUid, maximum, expectedUpdatedAt) => {
      await authSessionReady(uid);
      validateWorkspaceLimit(maximum);
      accountUid(targetUid);
      await runTransaction(db, async transaction => {
        const [admin, profile, oldLimit] = await Promise.all([
          transaction.get(adminRef()), transaction.get(profileRef(targetUid)), transaction.get(limitRef(targetUid)),
        ]);
        await authSessionReady(uid);
        if (!admin.exists() || admin.data().adminUid !== uid) throw new CloudServiceError("Administrator access is required.", "admin-required", { status: "permission-denied" });
        if (!profile.exists()) throw new CloudServiceError("This account is no longer in the directory. Refresh the list.", "account-not-found");
        const oldTime = oldLimit.exists() ? timestampText(oldLimit.data().updatedAt) : null;
        if (oldTime !== expectedUpdatedAt) throw new CloudServiceError("This allowance changed in another tab. Refresh before saving.", "admin-conflict", { status: "conflict" });
        if (targetUid === uid && maximum !== null) throw new CloudServiceError("The administrator keeps unlimited access.", "invalid-limit");
        transaction.set(limitRef(targetUid), { schemaVersion: 1, maxWorkspaces: maximum, updatedBy: uid, updatedAt: serverTimestamp() });
      });
      // A post-commit read supplies the authoritative timestamp for the next edit.
      const saved = await getDocFromServer(limitRef(targetUid));
      await authSessionReady(uid);
      return { maxWorkspaces: workspaceLimit(saved.data()), allowanceUpdatedAt: timestampText(saved.data().updatedAt) };
    },
    signInGoogle: async () => {
      await persistenceReady;
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      return signInWithPopup(auth, provider);
    },
    signOut: async () => {
      await persistenceReady;
      return firebaseSignOut(auth);
    },
    listWorkspaces: async (uid) => {
      await authSessionReady(uid);
      const ownerQuery = query(collection(db, WORKSPACES), where("ownerId", "==", uid));
      const snapshot = await getDocsFromServer(ownerQuery);
      const workspaces = mapOwnedSnapshot(snapshot);
      return snapshot.metadata?.fromCache
        ? { status: "offline", workspaces }
        : { status: "ready", workspaces };
    },
    watchOwnedWorkspaces: (uid, callback) => {
      const ownerQuery = query(collection(db, WORKSPACES), where("ownerId", "==", uid));
      return subscribeWhenReady(authSessionReady(uid),
        () => onSnapshot(
          ownerQuery,
          { includeMetadataChanges: true },
          (snapshot) => {
            if (snapshot.metadata?.fromCache || snapshot.metadata?.hasPendingWrites) {
              callback({ status: "loading", workspaces: [] });
              return;
            }
            try {
              callback({ status: "ready", workspaces: mapOwnedSnapshot(snapshot) });
            } catch (error) {
              callback({ status: "error", error: firebaseError(error) });
            }
          },
          (error) => callback({ status: "error", error: firebaseError(error) }),
        ),
        (error) => callback({ status: "error", error: firebaseError(error) }),
      );
    },
    createWorkspace: async (uid, encoded, candidateWorkspaceId = "") => {
      await authSessionReady(uid);
      const candidateId = candidateWorkspaceId ? normalizeWorkspaceId(candidateWorkspaceId) : "";
      const commitAtId = async (id) => {
        await authSessionReady(uid);
        const revision = workspaceIdFactory();
        const reference = workspaceRef(id);
        const metadata = metadataForGraph({
          uid,
          encoded,
          revision,
          previousRevision: null,
          shared: false,
        });
        // Keep the lost-response test seam around the entire atomic commit.
        await commitBatch({ commit: () => runTransaction(db, async (transaction) => {
          const quota = await transaction.get(quotaRef(uid));
          // The read participates in the transaction, so concurrent allowance
          // changes retry admission against the new server policy.
          let allowance;
          try { allowance = await transaction.get(limitRef(uid)); }
          catch (error) {
            // Older rules do not expose allowances. Keeping the default cap is
            // safe during rollout; every write still requires server approval.
            if (error?.code !== "permission-denied") throw error;
            await authSessionReady(uid);
          }
          const maximum = workspaceLimit(allowance?.exists() ? allowance.data() : null);
          if (!quota.exists()) {
            const legacy = await getDocsFromServer(query(collection(db, WORKSPACES), where("ownerId", "==", uid)));
            if (!legacy.empty) throw new CloudQuotaError("Cloud Workspace usage needs setup for this account. Existing maps are unchanged; keep this new map locally for now.", "quota-uninitialized");
          }
          const previous = quota.exists() ? quota.data() : null;
          const workspaceIds = addRegistryWorkspace(previous, id, maximum);
          for (const chunk of encoded.chunks) transaction.set(chunkRef(id, revision, chunk.index), chunkData(chunk));
          transaction.set(reference, metadata);
          transaction.set(quotaRef(uid), {
            schemaVersion: 1, workspaceIds, lastWorkspaceId: id, lastAction: "create",
            createdAt: previous?.createdAt || serverTimestamp(), updatedAt: serverTimestamp(),
          });
        }) });
        return metadataResult(id, {
          ...metadata,
          createdAt: localIsoNow(),
          updatedAt: localIsoNow(),
        });
      };

      if (!candidateId) {
        // Keep generated-ID collision behavior for older callers. Candidate-aware
        // admissions use the fixed-ID path below so retries cannot create siblings.
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const id = workspaceIdFactory();
          try {
            return await commitAtId(id);
          } catch (error) {
            if (!["permission-denied", "workspace-id-collision"].includes(error?.code) || attempt === 2) throw error;
          }
        }
        throw new CloudServiceError("A new online workspace could not be created.", "create-failed", { status: "error" });
      }

      const reconcileCandidate = async () => {
        await authSessionReady(uid);
        const snapshot = await readWorkspaceFromServer(workspaceRef(candidateId));
        await authSessionReady(uid);
        if (!snapshot.exists()) return null;
        const existing = normalizeWorkspaceMetadata(candidateId, snapshot.data());
        if (existing.ownerId !== uid) {
          throw new CloudServiceError(
            "This workspace ID is already in use by a different account. Nothing was overwritten.",
            "workspace-id-collision",
            { status: "conflict" },
          );
        }
        const current = await fetchGraphRevision(candidateId, existing);
        await authSessionReady(uid);
        if (current.json !== encoded.json) {
          throw new CloudServiceError(
            "This workspace ID already contains a different map. Nothing was overwritten.",
            "workspace-id-collision",
            { status: "conflict" },
          );
        }
        return metadataResult(candidateId, snapshot.data());
      };

      let lastCreateError = null;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          return await commitAtId(candidateId);
        } catch (error) {
          lastCreateError = error;
          if (["workspace-limit", "quota-uninitialized", "quota-invalid"].includes(error?.code)) throw error;
          try {
            const existing = await reconcileCandidate();
            if (existing) return existing;
          } catch (reconcileError) {
            if (reconcileError?.code === "workspace-id-collision") throw reconcileError;
            if (attempt === 1) throw lastCreateError;
          }
        }
      }
      throw lastCreateError || new CloudServiceError("A new online workspace could not be created.", "create-failed", { status: "error" });
    },
    saveWorkspace: async (uid, id, encoded, expectedRevision) => {
      await authSessionReady(uid);
      const reference = workspaceRef(id);
      const revision = createRandomWorkspaceId();
      return runTransaction(db, async (transaction) => {
        const workspaceSnapshot = await transaction.get(reference);
        if (!workspaceSnapshot.exists()) {
          throw new CloudServiceError("This online workspace no longer exists.", "not-found", { status: "not-found" });
        }
        const oldData = workspaceSnapshot.data();
        const current = normalizeWorkspaceMetadata(id, oldData);
        if (current.ownerId !== uid) {
          throw new CloudServiceError("You do not own this online workspace.", "permission-denied", { status: "permission-denied" });
        }
        if (current.currentRevision !== expectedRevision) {
          throw new CloudConflictError(expectedRevision, current.currentRevision);
        }
        if (current.deleting) {
          throw new CloudServiceError("This workspace is being deleted. Retry deletion from the owner library.", "delete-in-progress", { status: "delete-in-progress" });
        }
        const previousChunkSnapshots = await readAllChunks(
          transaction,
          id,
          current.currentRevision,
          current.chunkCount,
        );
        const metadata = metadataForGraph({
          uid,
          encoded,
          revision,
          previousRevision: current.currentRevision,
          shared: current.shared,
          createdAt: oldData.createdAt,
        });
        for (const chunk of encoded.chunks) {
          transaction.set(chunkRef(id, revision, chunk.index), chunkData(chunk));
        }
        for (let index = 0; index < previousChunkSnapshots.length; index += 1) {
          if (previousChunkSnapshots[index].exists()) {
            transaction.delete(chunkRef(id, current.currentRevision, index));
          }
        }
        transaction.update(reference, metadata);
        return metadataResult(id, {
          ...metadata,
          createdAt: current.createdAt,
          updatedAt: localIsoNow(),
        });
      });
    },
    watchWorkspace,
    deleteWorkspace: async (uid, id) => {
      await authSessionReady(uid);
      const reference = workspaceRef(id);
      let deletionStarted = false;
      try {
        await runTransaction(db, async (transaction) => {
          const workspaceSnapshot = await transaction.get(reference);
          if (!workspaceSnapshot.exists()) return;
          const current = normalizeWorkspaceMetadata(id, workspaceSnapshot.data());
          if (current.ownerId !== uid) {
            throw new CloudServiceError("You do not own this online workspace.", "permission-denied", { status: "permission-denied" });
          }
          if (current.deleting) {
            if (current.shared) {
              throw new CloudServiceError("This workspace has an inconsistent deletion state. Contact support before retrying.", "invalid-delete-state", { status: "invalid" });
            }
            return;
          }
          transaction.update(reference, {
            shared: false,
            deleting: true,
            updatedAt: serverTimestamp(),
          });
        });
        deletionStarted = true;

        await runTransaction(db, async (transaction) => {
          const workspaceSnapshot = await transaction.get(reference);
          if (!workspaceSnapshot.exists()) return;
          const current = normalizeWorkspaceMetadata(id, workspaceSnapshot.data());
          if (current.ownerId !== uid) {
            throw new CloudServiceError("You do not own this online workspace.", "permission-denied", { status: "permission-denied" });
          }
          if (!current.deleting || current.shared) {
            throw new CloudServiceError("The workspace is no longer in a safe state for deletion.", "invalid-delete-state", { status: "invalid" });
          }
          const quota = await transaction.get(quotaRef(uid));
          const previous = quota.exists() ? quota.data() : null;
          const workspaceIds = removeRegistryWorkspace(previous, id);
          const chunks = await readAllChunks(transaction, id, current.currentRevision, current.chunkCount);
          for (let index = 0; index < chunks.length; index += 1) {
            if (chunks[index].exists()) transaction.delete(chunkRef(id, current.currentRevision, index));
          }
          transaction.delete(reference);
          transaction.update(quotaRef(uid), { workspaceIds, lastWorkspaceId: id, lastAction: "delete", updatedAt: serverTimestamp() });
        });
      } catch (error) {
        if (deletionStarted) {
          throw new CloudServiceError(
            "Sharing was revoked, but deletion did not finish. Retry deletion to remove the stored graph.",
            "delete-incomplete",
            { status: "delete-incomplete", cause: error },
          );
        }
        throw error;
      }
    },
    setShared: async (uid, id, enabled) => {
      await authSessionReady(uid);
      const reference = workspaceRef(id);
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(reference);
        if (!snapshot.exists()) {
          throw new CloudServiceError("This online workspace no longer exists.", "not-found", { status: "not-found" });
        }
        const current = normalizeWorkspaceMetadata(id, snapshot.data());
        if (current.ownerId !== uid) {
          throw new CloudServiceError("You do not own this online workspace.", "permission-denied", { status: "permission-denied" });
        }
        if (current.deleting) {
          throw new CloudServiceError("This workspace is being deleted and cannot be shared.", "delete-in-progress", { status: "delete-in-progress" });
        }
        transaction.update(reference, { shared: Boolean(enabled), updatedAt: serverTimestamp() });
      });
      return Boolean(enabled);
    },
    getCurrentUser: () => auth.currentUser,
  };
}

function disabledAdapter() {
  const fail = () => Promise.reject(new CloudServiceError(
    "Online workspaces are not configured in this build.",
    "disabled",
    { status: "disabled" },
  ));
  return {
    observeAuth: (callback) => {
      queueMicrotask(() => callback(null));
      return () => {};
    },
    getAdminAccess: fail,
    listAdminAccounts: fail,
    setAccountLimit: fail,
    signInGoogle: fail,
    signOut: fail,
    listWorkspaces: fail,
    watchOwnedWorkspaces: (uid, callback) => {
      queueMicrotask(() => callback({ status: "disabled", workspaces: [] }));
      return () => {};
    },
    createWorkspace: fail,
    saveWorkspace: fail,
    watchWorkspace: (uid, id, callback) => {
      queueMicrotask(() => callback({ status: "error", error: new CloudServiceError(
        "Online workspaces are not configured in this build.",
        "disabled",
        { status: "disabled" },
      ) }));
      return () => {};
    },
    deleteWorkspace: fail,
    setShared: fail,
    getCurrentUser: () => null,
  };
}

export function createCloudService({
  config = firebaseConfig,
  app,
  auth,
  db,
  adapter: injectedAdapter,
  baseUrl,
} = {}) {
  const configStatus = getCloudConfigStatus(config);
  let adapter;
  if (injectedAdapter) {
    adapter = injectedAdapter;
  } else if (!configStatus.enabled) {
    adapter = disabledAdapter();
  } else {
    adapter = createFirebaseAdapter(config, { app, auth, db });
  }

  let rawUser = null;
  let authInitialized = false;
  let authError = null;
  let authEpoch = 0;
  let resolveAuthReady;
  const authReady = new Promise((resolve) => { resolveAuthReady = resolve; });
  const authListeners = new Set();
  const ownerWatchRecords = new Set();
  const workspaceWatchRecords = new Set();

  const getIdentity = () => safeIdentity(rawUser);
  const sendAuth = (listener) => {
    try { listener(getIdentity(), authError); } catch { /* Keep other listeners active. */ }
  };
  const notifyAuth = (user, error = null) => {
    authError = error ? firebaseError(error) : null;
    const oldUid = rawUser?.uid || null;
    const wasInitialized = authInitialized;
    rawUser = !authError && user && typeof user.uid === "string" ? user : null;
    authInitialized = true;
    const newUid = rawUser?.uid || null;
    if (!wasInitialized || oldUid !== newUid) authEpoch += 1;
    resolveAuthReady(getIdentity());
    for (const listener of authListeners) sendAuth(listener);
    if (wasInitialized && oldUid !== newUid) {
      for (const record of ownerWatchRecords) record.restart();
      for (const record of workspaceWatchRecords) record.restart();
    } else if (!wasInitialized) {
      for (const record of ownerWatchRecords) record.restart();
      for (const record of workspaceWatchRecords) record.restart();
    }
  };

  let stopInternalAuth = () => {};
  try {
    stopInternalAuth = adapter.observeAuth((user, error) => notifyAuth(user, error));
  } catch (error) {
    notifyAuth(null, error);
  }

  const awaitIdentity = async () => {
    if (!authInitialized) await authReady;
    return rawUser;
  };
  const requireUser = async () => {
    const user = await awaitIdentity();
    if (authError) throw authError;
    if (!user || typeof user.uid !== "string" || !user.uid) {
      throw new CloudServiceError("Sign in to manage your online workspaces.", "unauthenticated", { status: "unauthenticated" });
    }
    return { user, uid: user.uid, epoch: authEpoch };
  };
  const assertSameIdentity = (session) => {
    if (authEpoch !== session.epoch || rawUser?.uid !== session.uid) {
      throw new CloudServiceError("Your account changed while the request was running. Retry it from the current account.", "account-changed", { status: "unauthenticated" });
    }
  };

  function authObserver(callback, onError = () => {}) {
    if (typeof callback !== "function") throw new TypeError("Auth observer callback must be a function.");
    const listener = (identity, error) => {
      if (error) onError(error);
      else callback(identity);
    };
    authListeners.add(listener);
    if (authInitialized) sendAuth(listener);
    return () => authListeners.delete(listener);
  }

  function watchOwnedWorkspaces(callback) {
    if (typeof callback !== "function") throw new TypeError("Workspace observer callback must be a function.");
    let stopped = false;
    let innerUnsubscribe = () => {};
    let generation = 0;
    const emit = (event) => {
      if (!stopped) {
        try { callback(event); } catch { /* Keep the data subscription alive. */ }
      }
    };
    const record = {
      restart: async () => {
        generation += 1;
        const currentGeneration = generation;
        innerUnsubscribe();
        innerUnsubscribe = () => {};
        const user = await awaitIdentity();
        if (stopped || generation !== currentGeneration) return;
        if (!user?.uid) {
          emit({ status: "unauthenticated", workspaces: [] });
          return;
        }
        const sessionEpoch = authEpoch;
        try {
          innerUnsubscribe = adapter.watchOwnedWorkspaces(user.uid, (event) => {
            if (stopped || generation !== currentGeneration || sessionEpoch !== authEpoch) return;
            if (event?.status === "error") {
              emit({ status: "error", error: firebaseError(event.error), workspaces: [] });
              return;
            }
            if (event?.status === "loading") {
              emit({ status: "loading", workspaces: Array.isArray(event.workspaces) ? event.workspaces : [] });
              return;
            }
            if (event?.status === "offline") {
              emit({
                status: "offline",
                workspaces: Array.isArray(event.workspaces) ? event.workspaces : [],
              });
              return;
            }
            try {
              const workspaces = Array.isArray(event?.workspaces)
                ? event.workspaces.map((workspace) => workspaceSummary(
                  workspace?.id ? normalizeWorkspaceMetadata(workspace.id, workspace) : normalizeWorkspaceMetadata(workspace?.id, workspace?.data),
                ))
                : [];
              emit({ status: "ready", workspaces });
            } catch (error) {
              emit({ status: "error", error: firebaseError(error), workspaces: [] });
            }
          });
        } catch (error) {
          emit({ status: firebaseError(error).status, error: firebaseError(error), workspaces: [] });
        }
      },
      stop: () => {
        stopped = true;
        generation += 1;
        innerUnsubscribe();
        ownerWatchRecords.delete(record);
      },
    };
    ownerWatchRecords.add(record);
    record.restart();
    return record.stop;
  }

  function watchWorkspace(options, callback) {
    const workspaceId = normalizeWorkspaceId(options?.workspaceId || options?.sharedId);
    if (typeof callback !== "function") throw new TypeError("Workspace observer callback must be a function.");
    let stopped = false;
    let innerUnsubscribe = () => {};
    let generation = 0;
    const emit = (event) => {
      if (!stopped) {
        try { callback(event); } catch { /* Keep the data subscription alive. */ }
      }
    };
    const record = {
      restart: async () => {
        generation += 1;
        const currentGeneration = generation;
        innerUnsubscribe();
        innerUnsubscribe = () => {};
        const user = await awaitIdentity();
        if (stopped || generation !== currentGeneration) return;
        const sessionEpoch = authEpoch;
        emit({ status: "loading" });
        try {
          innerUnsubscribe = adapter.watchWorkspace(user?.uid || null, workspaceId, (event) => {
            if (stopped || generation !== currentGeneration || sessionEpoch !== authEpoch) return;
            if (event?.status === "ready") {
              try {
                const metadata = normalizeWorkspaceMetadata(workspaceId, event.metadata);
                const isOwner = metadata.ownerId === rawUser?.uid;
                if (!metadata.shared && !isOwner) {
                  emit({ status: "revoked" });
                  return;
                }
                const decoded = event.chunks?.graph
                  ? event.chunks
                  : decodeCloudGraphChunks({
                    chunks: event.chunks,
                    chunkCount: metadata.chunkCount,
                    byteLength: metadata.byteLength,
                  });
                emit({
                  status: "ready",
                  workspace: workspaceSummary(metadata),
                  graph: decoded.graph,
                });
              } catch (error) {
                emit({ status: "error", error: firebaseError(error) });
              }
              return;
            }
            if (event?.status === "error") {
              const error = firebaseError(event.error);
              emit({ status: error.status === "permission-denied" ? "revoked" : error.status, error });
              return;
            }
            if (["deleted", "revoked", "offline", "loading", "unauthenticated", "disabled"].includes(event?.status)) {
              emit({ status: event.status, error: event.error ? firebaseError(event.error) : undefined });
              return;
            }
            emit({ status: "error", error: new CloudServiceError("The online workspace returned an unknown status.", "invalid-response", { status: "error" }) });
          });
        } catch (error) {
          const serviceError = firebaseError(error);
          emit({ status: serviceError.status, error: serviceError });
        }
      },
      stop: () => {
        stopped = true;
        generation += 1;
        innerUnsubscribe();
        workspaceWatchRecords.delete(record);
      },
    };
    workspaceWatchRecords.add(record);
    record.restart();
    return record.stop;
  }

  const withSession = async (operation) => {
    try {
      const session = await requireUser();
      const result = await operation(session);
      assertSameIdentity(session);
      return result;
    } catch (error) {
      throw firebaseError(error);
    }
  };

  return Object.freeze({
    configStatus,
    onAuthStateChanged: authObserver,
    signInWithGoogle: async () => {
      try {
        const result = await adapter.signInGoogle();
        notifyAuth(result?.user || result);
        return getIdentity();
      } catch (error) {
        throw firebaseError(error);
      }
    },
    signOut: async () => {
      try {
        await adapter.signOut();
        notifyAuth(null);
      } catch (error) {
        throw firebaseError(error);
      }
    },
    listWorkspaces: () => withSession(async ({ uid }) => {
      const result = await adapter.listWorkspaces(uid);
      if (result?.status === "offline") {
        return Object.freeze({
          status: "offline",
          workspaces: Array.isArray(result.workspaces) ? result.workspaces : [],
        });
      }
      const workspaces = Array.isArray(result?.workspaces)
        ? result.workspaces.map((workspace) => workspaceSummary(
          workspace?.id ? normalizeWorkspaceMetadata(workspace.id, workspace) : workspaceSummary(workspace),
        ))
        : [];
      return Object.freeze({ status: "ready", workspaces });
    }),
    getAdminAccess: () => withSession(({ uid }) => adapter.getAdminAccess(uid)),
    listAdminAccounts: ({ afterUid = "" } = {}) => withSession(({ uid }) => adapter.listAdminAccounts(uid, afterUid)),
    setAccountLimit: ({ targetUid, maxWorkspaces, expectedUpdatedAt, expectedAdminUid } = {}) => withSession(({ uid }) => {
      if (uid !== expectedAdminUid) throw new CloudServiceError("Your account changed. Refresh before updating access.", "account-changed", { status: "unauthenticated" });
      accountUid(targetUid);
      validateWorkspaceLimit(maxWorkspaces);
      if (expectedUpdatedAt !== null && typeof expectedUpdatedAt !== "string") throw new CloudServiceError("Refresh the account allowance before saving.", "invalid-limit");
      return adapter.setAccountLimit(uid, targetUid, maxWorkspaces, expectedUpdatedAt);
    }),
    watchOwnedWorkspaces,
    createWorkspace: ({ name, graph, workspaceId, expectedOwnerUid } = {}) => withSession(async ({ uid }) => {
      if (expectedOwnerUid && String(expectedOwnerUid) !== uid) {
        throw new CloudServiceError(
          "Your account changed before this map could be saved. Sign in to the account that started the save and retry.",
          "account-changed",
          { status: "unauthenticated" },
        );
      }
      const encoded = encodeCloudGraph(graph, { name });
      const candidateId = workspaceId ? normalizeWorkspaceId(workspaceId) : "";
      const result = await adapter.createWorkspace(uid, encoded, candidateId);
      return workspaceSummary(normalizeWorkspaceMetadata(result.id, result));
    }),
    saveWorkspace: ({ workspaceId, graph, expectedRevision } = {}) => withSession(async ({ uid }) => {
      const id = normalizeWorkspaceId(workspaceId);
      const revision = normalizeWorkspaceId(expectedRevision);
      const encoded = encodeCloudGraph(graph);
      const result = await adapter.saveWorkspace(uid, id, encoded, revision);
      return workspaceSummary(normalizeWorkspaceMetadata(id, result));
    }),
    watchWorkspace,
    deleteWorkspace: (workspaceId) => withSession(async ({ uid }) => {
      const id = normalizeWorkspaceId(workspaceId);
      await adapter.deleteWorkspace(uid, id);
    }),
    setShared: ({ workspaceId, enabled } = {}) => withSession(async ({ uid }) => {
      const id = normalizeWorkspaceId(workspaceId);
      if (typeof enabled !== "boolean") {
        throw new CloudServiceError("Sharing state must be enabled or disabled.", "invalid-sharing-state", { status: "invalid" });
      }
      const result = await adapter.setShared(uid, id, enabled);
      if (!result) return null;
      const base = baseUrl || globalThis.location?.href;
      return Object.freeze({
        sharedId: id,
        viewUrl: createWorkspaceViewUrl(id, base),
      });
    }),
    dispose: () => {
      for (const record of ownerWatchRecords) record.stop();
      for (const record of workspaceWatchRecords) record.stop();
      authListeners.clear();
      stopInternalAuth();
    },
  });
}

export { getCloudConfigStatus, isCloudConfigured };

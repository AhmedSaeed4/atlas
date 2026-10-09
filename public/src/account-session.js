const FUTURE_AUTOSAVE_KEY = "atlas.autosave.future.v1";
const ACCOUNT_SESSION_HINT_KEY = "atlas.account.session-hint.v1";

function safeStorage(storage) {
  if (storage !== undefined) return storage;
  try { return globalThis.localStorage || null; } catch { return null; }
}

function safeIdentity(user) {
  if (!user?.uid) return null;
  return Object.freeze({
    uid: String(user.uid),
    displayName: String(user.displayName || ""),
    email: String(user.email || ""),
    photoURL: String(user.photoURL || ""),
  });
}

function safeError(error) {
  return Object.freeze({
    message: String(error?.message || "The account service could not be reached."),
    code: String(error?.code || error?.status || "error"),
  });
}

export function readFutureAutosavePreference(storage) {
  try { return safeStorage(storage)?.getItem(FUTURE_AUTOSAVE_KEY) === "true"; }
  catch { return false; }
}

export function writeFutureAutosavePreference(storage, enabled) {
  try {
    const target = safeStorage(storage);
    if (!target) return false;
    target.setItem(FUTURE_AUTOSAVE_KEY, enabled ? "true" : "false");
    return true;
  } catch { return false; }
}

export function hasAccountSessionHint(storage) {
  try { return safeStorage(storage)?.getItem(ACCOUNT_SESSION_HINT_KEY) === "true"; }
  catch { return false; }
}

function writeAccountSessionHint(storage, present) {
  try {
    const target = safeStorage(storage);
    if (!target) return false;
    target.setItem(ACCOUNT_SESSION_HINT_KEY, present ? "true" : "false");
    return true;
  } catch { return false; }
}

async function loadConfiguredCloudService() {
  const config = await import("./cloud-config.js");
  if (!config.isCloudConfigured(config.firebaseConfig)) {
    throw new Error(config.getCloudConfigStatus(config.firebaseConfig).reason);
  }
  const module = await import("./cloud-service.bundle.js");
  return module.createCloudService();
}

export function createAccountSession({ loadService = loadConfiguredCloudService, storage, eventTarget = globalThis } = {}) {
  const targetStorage = safeStorage(storage);
  const listeners = new Set();
  const preferenceListeners = new Set();
  let service = null;
  let servicePromise = null;
  let initializePromise = null;
  let authUnsubscribe = null;
  let authInteractionEpoch = 0;
  let autosaveFutureMaps = false;
  let preferencePersisted = false;
  let preferenceHydrated = false;
  let storageListenerAttached = false;
  let preferenceError = null;
  let state = { status: "idle", initialized: false, user: null, error: null };

  const stateSnapshot = () => Object.freeze({
    ...state,
    user: state.user ? Object.freeze({ ...state.user }) : null,
    error: state.error ? Object.freeze({ ...state.error }) : null,
  });
  const preferenceSnapshot = () => {
    hydratePreference();
    return Object.freeze({
      saveFutureMaps: autosaveFutureMaps,
      persisted: preferencePersisted,
      error: preferenceError ? Object.freeze({ ...preferenceError }) : null,
    });
  };
  const emitState = () => {
    const snapshot = stateSnapshot();
    for (const listener of [...listeners]) {
      try { listener(snapshot); } catch {}
    }
  };
  const emitPreference = () => {
    const snapshot = preferenceSnapshot();
    for (const listener of [...preferenceListeners]) {
      try { listener(snapshot); } catch {}
    }
  };
  const setState = (next) => {
    state = { ...state, ...next };
    emitState();
  };
  const rememberIdentity = (user) => {
    const identity = safeIdentity(user);
    writeAccountSessionHint(targetStorage, Boolean(identity));
    setState({ status: "ready", initialized: true, user: identity, error: null });
    return identity;
  };

  async function ensureService() {
    if (service) return service;
    if (!servicePromise) {
      let pending;
      pending = Promise.resolve().then(loadService).then((loaded) => {
        if (!loaded || typeof loaded.onAuthStateChanged !== "function"
            || typeof loaded.signInWithGoogle !== "function" || typeof loaded.signOut !== "function") {
          throw new TypeError("The cloud account service does not implement the Atlas Auth contract.");
        }
        service = loaded;
        return loaded;
      }).catch((error) => {
        if (servicePromise === pending) servicePromise = null;
        throw error;
      });
      servicePromise = pending;
    }
    return servicePromise;
  }

  async function initialize() {
    if (state.initialized && service) return stateSnapshot();
    if (initializePromise) return initializePromise;
    const pending = (async () => {
      setState({ status: "initializing", initialized: false, user: null, error: null });
      const activeService = await ensureService();
      if (authUnsubscribe) return stateSnapshot();
      let resolveFirst;
      let rejectFirst;
      let firstSettled = false;
      const firstState = new Promise((resolve, reject) => { resolveFirst = resolve; rejectFirst = reject; });
      const onFirstUser = (user) => {
        const identity = rememberIdentity(user);
        if (!firstSettled) { firstSettled = true; resolveFirst(identity); }
      };
      let authObserverFailed = false;
      const onAuthError = (error) => {
        authObserverFailed = true;
        // A failed check is not a confirmed sign-out. Keep the non-secret hint
        // so a later page visit can retry; it never supplies an identity.
        setState({ status: "error", initialized: false, user: null, error: safeError(error) });
        if (!firstSettled) { firstSettled = true; rejectFirst(error); }
        try { authUnsubscribe?.(); } catch {}
        authUnsubscribe = null;
      };
      try {
        const unsubscribe = activeService.onAuthStateChanged(onFirstUser, onAuthError);
        authUnsubscribe = typeof unsubscribe === "function" ? unsubscribe : () => {};
        if (authObserverFailed) {
          try { authUnsubscribe(); } catch {}
          authUnsubscribe = null;
        }
      } catch (error) {
        onAuthError(error);
      }
      await firstState;
      return stateSnapshot();
    })().catch((error) => {
      setState({ status: "error", initialized: false, error: safeError(error) });
      throw error;
    }).finally(() => {
      if (initializePromise === pending) initializePromise = null;
    });
    initializePromise = pending;
    return pending;
  }

  function attachStorageListener() {
    try {
      if (!storageListenerAttached && eventTarget?.addEventListener) {
        eventTarget.addEventListener("storage", storageListener);
        storageListenerAttached = true;
      }
    } catch {}
  }

  function restore() {
    attachStorageListener();
    return hasAccountSessionHint(targetStorage) ? initialize() : Promise.resolve(stateSnapshot());
  }

  async function getService() {
    await initialize();
    if (!service) throw new Error("The cloud account service is unavailable.");
    return service;
  }

  async function signIn() {
    authInteractionEpoch += 1;
    try {
      // When the account panel has already initialized, call Firebase from the
      // button's original click stack so the browser keeps popup user activation.
      const activeService = state.initialized && service ? service : await getService();
      const signInRequest = activeService.signInWithGoogle();
      const identity = safeIdentity(await signInRequest);
      if (identity) rememberIdentity(identity);
      return identity;
    } catch (error) {
      setState({ status: state.initialized ? "ready" : "error", error: safeError(error) });
      throw error;
    }
  }

  async function signOut() {
    authInteractionEpoch += 1;
    const activeService = await getService();
    try {
      await activeService.signOut();
      rememberIdentity(null);
    } catch (error) {
      setState({ status: state.initialized ? "ready" : "error", error: safeError(error) });
      throw error;
    }
  }

  function hydratePreference() {
    if (preferenceHydrated) return;
    autosaveFutureMaps = readFutureAutosavePreference(targetStorage);
    preferencePersisted = (() => {
      try { if (!targetStorage) return false; targetStorage.getItem(FUTURE_AUTOSAVE_KEY); return true; }
      catch { return false; }
    })();
    preferenceError = preferencePersisted ? null : {
      message: "Browser storage is unavailable; automatic saving stays off in this tab.",
      code: "storage-unavailable",
    };
    preferenceHydrated = true;
    attachStorageListener();
  }

  function setSaveFutureMaps(enabled) {
    hydratePreference();
    const next = Boolean(enabled);
    const persisted = writeFutureAutosavePreference(targetStorage, next);
    if (next && !persisted) {
      autosaveFutureMaps = false;
      preferencePersisted = false;
      preferenceError = { message: "Atlas could not save this preference. Automatic saving stays off in this tab; reload may restore the last saved choice.", code: "storage-unavailable" };
      emitPreference();
      return false;
    }
    autosaveFutureMaps = next;
    preferencePersisted = persisted;
    preferenceError = persisted ? null : {
      message: "Atlas could not save this preference. The current-tab choice is active, but reload may restore the last saved choice.",
      code: "storage-unavailable",
    };
    emitPreference();
    return persisted;
  }

  const storageListener = (event) => {
    if (event?.storageArea && event.storageArea !== targetStorage) return;
    if ((event?.key === ACCOUNT_SESSION_HINT_KEY || event?.key === null)
        && hasAccountSessionHint(targetStorage)) {
      // Wake an idle page after sign-in elsewhere. Firebase supplies/validates
      // the identity and synchronizes later sign-out in initialized tabs.
      void initialize().catch(() => {});
    }
    if (!preferenceHydrated || (event?.key !== FUTURE_AUTOSAVE_KEY && event?.key !== null)) return;
    autosaveFutureMaps = readFutureAutosavePreference(targetStorage);
    preferencePersisted = Boolean(targetStorage);
    preferenceError = preferencePersisted ? null : {
      message: "Browser storage is unavailable; automatic saving stays off in this tab.",
      code: "storage-unavailable",
    };
    emitPreference();
  };

  return Object.freeze({
    getState: stateSnapshot,
    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("Account listener must be a function.");
      listeners.add(listener);
      try { listener(stateSnapshot()); } catch {}
      return () => listeners.delete(listener);
    },
    initialize,
    restore,
    signIn,
    signOut,
    getService,
    getAuthInteractionEpoch: () => authInteractionEpoch,
    getPreferenceState: preferenceSnapshot,
    subscribePreference(listener) {
      if (typeof listener !== "function") throw new TypeError("Preference listener must be a function.");
      preferenceListeners.add(listener);
      try { listener(preferenceSnapshot()); } catch {}
      return () => preferenceListeners.delete(listener);
    },
    setSaveFutureMaps,
    disposeForTests() {
      try { authUnsubscribe?.(); } catch {}
      authUnsubscribe = null;
      if (storageListenerAttached) { try { eventTarget?.removeEventListener?.("storage", storageListener); } catch {} }
      listeners.clear();
      preferenceListeners.clear();
    },
  });
}

let sharedAccountSession = null;
export function getSharedAccountSession() {
  if (!sharedAccountSession) sharedAccountSession = createAccountSession();
  return sharedAccountSession;
}

export const accountSessionKeys = Object.freeze({
  futureAutosave: FUTURE_AUTOSAVE_KEY,
  sessionHint: ACCOUNT_SESSION_HINT_KEY,
});
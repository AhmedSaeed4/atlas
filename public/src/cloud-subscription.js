export function subscribeWhenReady(ready, subscribe, onError = () => {}) {
  let stopped = false;
  let unsubscribe = () => {};
  Promise.resolve(ready).then(() => {
    if (stopped) return;
    const nextUnsubscribe = subscribe();
    if (stopped) nextUnsubscribe?.();
    else if (typeof nextUnsubscribe === "function") unsubscribe = nextUnsubscribe;
  }).catch((error) => {
    if (!stopped) onError(error);
  });
  return () => {
    stopped = true;
    unsubscribe();
  };
}
export async function waitForAuthSession({ auth, persistenceReady, uid = "" }) {
  await persistenceReady;
  if (!uid) return;
  const signedInUser = auth?.currentUser;
  if (!signedInUser?.uid || signedInUser.uid !== uid) {
    throw Object.assign(new Error("The Firebase account changed before the online request started. Retry from the current account."), {
      code: "unauthenticated",
    });
  }
  await signedInUser.getIdToken();
  if (auth?.currentUser?.uid !== uid) {
    throw Object.assign(new Error("The Firebase account changed while its access token was refreshing. Retry from the current account."), {
      code: "unauthenticated",
    });
  }
}
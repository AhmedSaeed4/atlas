function shortenPopupUrl({ location, history, eventTarget }) {
  if (!location?.href) return () => {};
  const originalUrl = location.href;
  const url = new URL(originalUrl);
  if (!url.search && !url.hash) return () => {};
  // Firebase places location.href in the auth handler query. Keep map fragments
  // and other page parameters out of that request without reloading the map.
  url.search = "";
  url.hash = "";
  const popupUrl = url.href;
  const originalState = history?.state;
  try {
    history.replaceState(originalState, "", popupUrl);
    if (location.href !== popupUrl) throw new Error("The browser URL did not change.");
  } catch (cause) {
    throw Object.assign(new Error("Atlas could not prepare a short sign-in URL. Open the normal workspace address to sign in, then return to your map.", { cause }), { code: "auth/sign-in-url-unavailable" });
  }
  const popupState = history.state;
  let navigated = false;
  const onNavigate = () => { navigated = true; };
  eventTarget?.addEventListener?.("popstate", onNavigate);
  eventTarget?.addEventListener?.("hashchange", onNavigate);
  return () => {
    eventTarget?.removeEventListener?.("popstate", onNavigate);
    eventTarget?.removeEventListener?.("hashchange", onNavigate);
    // Auth or map actions may already have changed the route. Never bring back
    // an obsolete fragment over a new workspace or a browser Back navigation.
    if (!navigated && location.href === popupUrl && history.state === popupState) {
      history.replaceState(originalState, "", originalUrl);
    }
  };
}

export function createPopupSignIn(startPopup, {
  location = globalThis.location,
  history = globalThis.history,
  eventTarget = globalThis,
} = {}) {
  let pending = null;
  return () => {
    if (pending) return pending;
    let restore;
    try {
      restore = shortenPopupUrl({ location, history, eventTarget });
      // Invoke synchronously to retain the sign-in button's user activation.
      const request = startPopup();
      pending = Promise.resolve(request).then((result) => {
        restore();
        return result;
      }, (error) => {
        try { restore(); } catch { /* Keep the original authentication error. */ }
        throw error;
      }).finally(() => { pending = null; });
      return pending;
    } catch (error) {
      try { restore?.(); } catch { /* Keep the original preparation/popup error. */ }
      return Promise.reject(error);
    }
  };
}

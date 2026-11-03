(function () {
  const doc = document, root = doc.documentElement;
  let finished = false, leaving = false, overlay = null, previousFocus = null;
  const inertElements = new Map();
  root.dataset.startupState = 'pending';

  function mount() {
    if (overlay || !doc.body) return overlay;
    overlay = doc.createElement('div');
    overlay.id = 'page-startup'; overlay.className = 'page-startup';
    overlay.setAttribute('role', 'status'); overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = '<div class="startup-content"><span class="startup-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><p class="startup-message" id="startup-message">Loading Atlas…</p><span class="startup-track" aria-hidden="true"><i></i></span><div class="startup-actions" hidden><button type="button" id="startup-retry">Retry</button><button type="button" id="startup-continue">Continue to page</button><a href="./help#troubleshooting">Help</a></div></div>';
    previousFocus = doc.activeElement;
    for (const element of doc.body.children) {
      if (['SCRIPT', 'STYLE', 'LINK', 'NOSCRIPT'].includes(element.tagName)) continue;
      inertElements.set(element, element.inert); element.inert = true;
    }
    doc.body.append(overlay);
    overlay.querySelector('#startup-retry').addEventListener('click', () => location.reload());
    overlay.querySelector('#startup-continue').addEventListener('click', ready);
    root.dataset.startupState = 'loading';
    return overlay;
  }

  function finish() {
    const hadFocus = overlay?.contains(doc.activeElement);
    overlay?.remove(); overlay = null;
    for (const [element, inert] of inertElements) element.inert = inert;
    inertElements.clear();
    root.dataset.startupState = 'ready';
    if (hadFocus && previousFocus?.isConnected && previousFocus !== doc.body && !previousFocus.inert) previousFocus.focus({ preventScroll: true });
  }

  function ready() {
    if (finished) return;
    finished = true;
    clearTimeout(showTimer); clearTimeout(deadline);
    if (!overlay || doc.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    leaving = true; root.dataset.startupState = 'leaving';
    overlay.classList.add('is-leaving');
    setTimeout(finish, 210);
  }

  function fail(slow = false) {
    if (finished) return;
    clearTimeout(showTimer); clearTimeout(deadline);
    const panel = mount();
    if (!panel) { doc.addEventListener('DOMContentLoaded', () => fail(slow), { once: true }); return; }
    root.dataset.startupState = 'error'; panel.classList.add('has-error');
    panel.setAttribute('role', 'alert');
    panel.querySelector('#startup-message').textContent = slow
      ? 'Atlas is taking longer than expected. Retry, or continue to the page.'
      : 'Atlas couldn’t finish loading. Retry, or continue to the page.';
    panel.querySelector('.startup-actions').hidden = false;
    panel.querySelector('#startup-retry').focus({ preventScroll: true });
  }

  const showTimer = setTimeout(() => { if (!finished) mount(); }, 160);
  const deadline = setTimeout(() => fail(true), 10000);
  window.AtlasStartup = Object.freeze({ ready, fail: () => fail(false) });
  window.addEventListener('error', event => {
    if (event.error || event.target?.tagName === 'SCRIPT') fail(false);
  }, true);
  window.addEventListener('unhandledrejection', () => fail(false));
  window.addEventListener('pageshow', event => { if (event.persisted) { finished = true; clearTimeout(showTimer); clearTimeout(deadline); finish(); } });
  window.addEventListener('pagehide', () => { if (leaving) finish(); });
  if (root.dataset.startupMode === 'document') {
    if (doc.readyState !== 'loading') ready();
    else doc.addEventListener('DOMContentLoaded', ready, { once: true });
  }
})();

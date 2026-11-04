/* Responsive presentation only. Existing controls and their permission guards stay intact. */
export function initWorkspaceShell({ doc = document, win = window } = {}) {
  initDescriptionDisclosure(doc, win);
  const compact = win.matchMedia('(max-width: 1100px)');
  const pairs = [
    ['project-actions-toggle', 'project-actions'],
    ['workspace-tools-toggle', 'workspace-tool-actions'],
  ].map(([triggerId, panelId]) => ({ trigger: doc.getElementById(triggerId), panel: doc.getElementById(panelId) }))
    .filter(({ trigger, panel }) => trigger && panel);

  function close(panel) {
    if (panel.hasAttribute('popover') && panel.matches(':popover-open')) panel.hidePopover();
  }
  function position({ trigger, panel }) {
    const anchor = trigger.getBoundingClientRect();
    const box = panel.getBoundingClientRect();
    const viewport = win.visualViewport;
    const width = viewport?.width || win.innerWidth;
    const height = viewport?.height || win.innerHeight;
    const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
    const panelWidth = box.width || Math.min(280, width - 24);
    panel.style.left = Math.max(left + 12, Math.min(anchor.right - panelWidth, left + width - panelWidth - 12)) + 'px';
    const below = anchor.bottom + 8;
    panel.style.top = Math.max(top + 12, Math.min(below + box.height > top + height - 12 ? anchor.top - box.height - 8 : below, top + height - box.height - 12)) + 'px';
  }
  function configure() {
    for (const { trigger, panel } of pairs) {
      const focusedElement = doc.activeElement;
      const focusedInside = panel.contains(focusedElement);
      const focusedTrigger = doc.activeElement === trigger;
      close(panel);
      trigger.hidden = !compact.matches;
      trigger.setAttribute('aria-expanded', 'false');
      if (compact.matches) {
        panel.setAttribute('popover', 'auto');
        if (focusedInside) trigger.focus({ preventScroll: true });
      } else {
        panel.removeAttribute('popover');
        panel.style.removeProperty('left');
        panel.style.removeProperty('top');
        if (focusedInside) focusedElement.focus({ preventScroll: true });
        else if (focusedTrigger) panel.querySelector('button:not(:disabled):not([hidden])')?.focus({ preventScroll: true });
      }
    }
  }
  for (const pair of pairs) {
    const { trigger, panel } = pair;
    panel.addEventListener('beforetoggle', event => {
      trigger.setAttribute('aria-expanded', String(event.newState === 'open'));
      if (event.newState === 'open') queueMicrotask(() => position(pair));
      if (event.newState === 'closed' && panel.id === 'project-actions') doc.getElementById('export-menu').hidden = true;
    });
    panel.addEventListener('toggle', event => {
      if (event.newState === 'open') position(pair);
    });
    panel.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !compact.matches || button.hasAttribute('popovertarget') || button.id === 'export-menu-button') return;
      // Run the original handler first, then reveal its dialog or the updated map.
      queueMicrotask(() => close(panel));
    });
  }
  doc.addEventListener('click', () => {
    if (doc.querySelector('dialog[open]')) for (const { panel } of pairs) close(panel);
  });
  compact.addEventListener('change', configure);
  win.addEventListener('resize', () => {
    for (const pair of pairs) if (pair.panel.hasAttribute('popover') && pair.panel.matches(':popover-open')) position(pair);
  }, { passive: true });
  configure();
}

function initDescriptionDisclosure(doc, win) {
  const description = doc.getElementById('project-description');
  const clip = doc.getElementById('project-description-clip');
  const row = description?.closest('.project-description-row');
  const more = doc.getElementById('project-description-more');
  const main = doc.getElementById('workspace-main');
  if (!description || !clip || !row || !more) return;
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, expanded = false, expandable = false, animation = null;
  let previousText = '', previousWidth = 0, observedWidth = 0;

  function settle() {
    animation?.cancel();
    animation = null;
    delete clip.dataset.animating;
  }
  function setExpanded(next, { animate = true } = {}) {
    next = Boolean(next && expandable);
    if (next === expanded && !animation) return;
    const start = clip.getBoundingClientRect().height;
    settle();
    expanded = next;
    clip.dataset.expanded = String(expanded);
    more.setAttribute('aria-expanded', String(expanded));
    more.setAttribute('aria-label', expanded ? 'Collapse map description' : 'Read full map description');
    more.textContent = expanded ? 'Less' : 'More';
    const end = clip.getBoundingClientRect().height;
    if (!animate || reduced.matches || !start || !end || Math.abs(start - end) < .5 || typeof clip.animate !== 'function') return;
    // Keep the complete text visible while the container smoothly clips it.
    clip.dataset.animating = 'true';
    const current = clip.animate([{ height: start + 'px' }, { height: end + 'px' }], {
      duration: 240, easing: 'cubic-bezier(.22, .8, .25, 1)', fill: 'both',
    });
    animation = current;
    current.finished.then(() => { if (animation === current) settle(); }, () => {});
  }
  function refresh() {
    frame = 0;
    const text = description.textContent;
    const loading = main?.dataset.workspaceLoading === 'skeleton';
    const width = clip.clientWidth;
    if (loading || text !== previousText || !width) setExpanded(false, { animate: false });
    else if (width !== previousWidth) settle();
    previousText = text;
    previousWidth = width;
    const lineHeight = parseFloat(win.getComputedStyle(description).lineHeight);
    expandable = !loading && width > 0 && Boolean(text.trim()) && description.scrollHeight > lineHeight * 2 + 1;
    row.dataset.expandable = String(expandable);
    more.hidden = !expandable;
    if (!expandable) setExpanded(false, { animate: false });
  }
  function schedule() {
    if (!frame) frame = win.requestAnimationFrame(refresh);
  }
  new win.MutationObserver(schedule).observe(description, { childList: true, characterData: true, subtree: true });
  if (main) new win.MutationObserver(schedule).observe(main, { attributes: true, attributeFilter: ['data-workspace-loading'] });
  new win.ResizeObserver(entries => {
    const width = Math.round(entries[0].contentRect.width);
    if (width !== observedWidth) { observedWidth = width; schedule(); }
  }).observe(clip);
  more.addEventListener('click', () => setExpanded(!expanded));
  clip.addEventListener('click', () => {
    if (!expanded && !win.getSelection()?.toString()) setExpanded(true);
  });
  doc.addEventListener('click', event => {
    if (expanded && !row.contains(event.target)) setExpanded(false);
  });
  doc.addEventListener('keydown', event => {
    if (expanded && event.key === 'Escape' && !doc.querySelector('dialog[open]')) {
      event.preventDefault(); event.stopPropagation();
      setExpanded(false); more.focus({ preventScroll: true });
    }
  }, true);
  reduced.addEventListener('change', () => { if (reduced.matches) settle(); });
  schedule();
}

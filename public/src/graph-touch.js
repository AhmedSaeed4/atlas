// A touch gesture changes the camera, never a component's saved position.
export function touchCamera(view, origin, current, ratio = 1) {
  const scale = Math.min(2.5, Math.max(.001, view.scale * ratio));
  return {
    x: current.x - (origin.x - view.x) * scale / view.scale,
    y: current.y - (origin.y - view.y) * scale / view.scale,
    scale,
  };
}

export function bindGraphTouch(surface, { readCamera, writeCamera, onStart, onEmptyTap, scope, onNavigateStart, onNavigateEnd }) {
  const pointers = new Map();
  let baseline = null, gestureScope = null, moved = false, suppressClick = false, target = null;
  let bounds = null, navigating = false;
  const sample = () => {
    const points = [...pointers.values()].slice(0, 2), rect = bounds;
    return {
      x: points.reduce((n, p) => n + p.x, 0) / points.length - rect.left,
      y: points.reduce((n, p) => n + p.y, 0) / points.length - rect.top,
      distance: points.length === 2 ? Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y) : 0,
    };
  };
  const rebase = () => { bounds = surface.getBoundingClientRect(); baseline = { point: sample(), view: { ...readCamera() } }; };
  const finishNavigation = () => {
    if (!navigating) return;
    navigating = false;
    onNavigateEnd?.();
  };
  const cancel = () => { if (pointers.size) suppressClick = true; pointers.clear(); baseline = null; bounds = null; finishNavigation(); };
  surface.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') {
      if (pointers.size) { event.preventDefault(); event.stopPropagation(); }
      else suppressClick = false;
      return;
    }
    if (!pointers.size) {
      onStart(); gestureScope = scope(); moved = false; suppressClick = false; target = event.target;
    } else { moved = true; suppressClick = true; }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    rebase();
    // Preserve native tap/click targeting, but keep mouse/node-drag handlers out
    // of touch navigation. Touch pointers retain their native implicit capture.
    event.stopPropagation();
  }, true);
  const move = event => {
    if (!pointers.has(event.pointerId)) return;
    if (scope() !== gestureScope) { cancel(); return; }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const point = sample();
    if (!moved && Math.hypot(point.x - baseline.point.x, point.y - baseline.point.y) < 6) return;
    moved = true; suppressClick = true;
    if (!navigating) { navigating = true; onNavigateStart?.(); }
    const ratio = pointers.size > 1 && baseline.point.distance > 0 ? point.distance / baseline.point.distance : 1;
    const next = touchCamera(baseline.view, baseline.point, point, ratio);
    writeCamera(next);
    event.preventDefault(); event.stopPropagation();
  };
  const end = event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    const cancelled = event.type !== 'pointerup' || scope() !== gestureScope;
    if (cancelled) { moved = true; suppressClick = true; }
    if (pointers.size) rebase();
    else {
      baseline = null;
      bounds = null;
      finishNavigation();
      if (!moved && !cancelled && !target.closest?.('.node-card,.edge-group,.group-wire,.category-header')) onEmptyTap();
    }
    event.stopPropagation();
  };
  const doc = surface.ownerDocument;
  doc.addEventListener('pointermove', move, { capture: true, passive: false });
  doc.addEventListener('pointerup', end, true);
  doc.addEventListener('pointercancel', end, true);
  doc.addEventListener('lostpointercapture', end, true);
  surface.addEventListener('click', event => {
    if (suppressClick && event.detail !== 0) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  doc.addEventListener('visibilitychange', () => { if (doc.hidden) cancel(); });
  // Geometry can change when the page scrolls or the phone rotates. End this
  // camera gesture instead of reusing bounds from the old viewport.
  doc.addEventListener('scroll', cancel, true);
  doc.defaultView?.addEventListener('resize', cancel);
  return { cancel, isActive: () => pointers.size > 0, isNavigating: () => navigating };
}

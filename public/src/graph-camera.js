const validViewport = value => Number.isFinite(value?.width) && value.width > 0 &&
  Number.isFinite(value?.height) && value.height > 0;
const validTransform = value => Number.isFinite(value?.x) && Number.isFinite(value?.y) &&
  Number.isFinite(value?.scale) && value.scale > 0;

// Keep the world point at the viewport centre and the exact zoom while its
// container grows/shrinks. Same-sized restores retain exact pixel coordinates.
export function resizeGraphCamera(view, viewport) {
  if (!validViewport(view?.viewport) || !validViewport(viewport) || !validTransform(view?.transform)) return null;
  return {
    x: view.transform.x + (viewport.width - view.viewport.width) / 2,
    y: view.transform.y + (viewport.height - view.viewport.height) / 2,
    scale: view.transform.scale,
  };
}


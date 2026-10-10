export function isTouchClick(event, pointerDownType = "") {
  if (!(Number(event?.detail) > 0)) return false;
  const pointerType = typeof event.pointerType === "string" && event.pointerType
    ? event.pointerType
    : pointerDownType;
  return pointerType === "touch";
}

export function transitionTypeInteractions(state, action) {
  let focusedType = state.focusedType || "";
  let lockedType = state.lockedType || "";
  let touchInteractionActive = Boolean(state.touchInteractionActive);
  const excludedTypes = new Set(state.excludedTypes || []);

  switch (action.kind) {
    case "activate-all":
      lockedType = "";
      focusedType = "";
      excludedTypes.clear();
      touchInteractionActive = isTouchClick(action, action.pointerDownType);
      break;
    case "activate-type":
      if (isTouchClick(action, action.pointerDownType)) {
        lockedType = "";
        focusedType = focusedType === action.type ? "" : action.type;
        touchInteractionActive = true;
      } else {
        if (excludedTypes.has(action.type)) {
          excludedTypes.delete(action.type);
          lockedType = "";
        } else if (lockedType === action.type) {
          excludedTypes.add(action.type);
          lockedType = "";
        } else lockedType = action.type;
        focusedType = lockedType;
        touchInteractionActive = false;
      }
      break;
    case "pointer-over":
      if (action.pointerType !== "touch" && !lockedType) {
        focusedType = excludedTypes.has(action.type) ? "" : action.type || "";
        touchInteractionActive = false;
      }
      break;
    case "pointer-out":
      if (action.pointerType !== "touch" && !lockedType) {
        focusedType = excludedTypes.has(action.relatedType) ? "" : action.relatedType || "";
        touchInteractionActive = false;
      }
      break;
    case "focus":
      if (!lockedType && (!touchInteractionActive || action.inputType === "keyboard")) {
        focusedType = excludedTypes.has(action.type) ? "" : action.type || "";
        if (action.inputType === "keyboard") touchInteractionActive = false;
      }
      break;
    case "clear-highlight":
      lockedType = "";
      focusedType = "";
      touchInteractionActive = false;
      break;
    case "reset-filters":
      excludedTypes.clear();
      break;
    default:
      throw new TypeError("Unknown type interaction: " + action.kind);
  }

  return { focusedType, lockedType, excludedTypes, touchInteractionActive };
}

export function isCurrentTouchEdgeSelection(selection, selectedEdgeId, activeProjectId, activeGraph) {
  return Boolean(selection
    && selection.id === selectedEdgeId
    && selection.projectId === activeProjectId
    && selection.graphRef === activeGraph);
}

// Translate a vertical mouse wheel only while this strip can move horizontally.
// Native horizontal/Shift scrolling and browser zoom keep their normal behavior.
export function scrollTypeFiltersWithWheel(group, event) {
  if (event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey
      || Math.abs(event.deltaX || 0) >= Math.abs(event.deltaY || 0)) return false;
  const maximum = Math.max(0, group.scrollWidth - group.clientWidth);
  if (!maximum || !group.clientWidth) return false;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? group.clientWidth : 1;
  const delta = event.deltaY * unit;
  if (!Number.isFinite(delta)) return false;
  const next = Math.max(0, Math.min(maximum, group.scrollLeft + delta));
  if (next === group.scrollLeft) return false;
  event.preventDefault();
  group.scrollLeft = next;
  return true;
}

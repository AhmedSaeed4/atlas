export function isTouchClick(event, pointerDownType = "") {
  if (!(Number(event?.detail) > 0)) return false;
  const pointerType = typeof event.pointerType === "string" && event.pointerType
    ? event.pointerType
    : pointerDownType;
  return pointerType === "touch";
}

export function transitionTypeInteractions(state, action) {
  let focusedType = state.focusedType || "";
  let touchInteractionActive = Boolean(state.touchInteractionActive);
  const excludedTypes = new Set(state.excludedTypes || []);

  switch (action.kind) {
    case "activate-all":
      focusedType = "";
      excludedTypes.clear();
      touchInteractionActive = isTouchClick(action, action.pointerDownType);
      break;
    case "activate-type":
      if (isTouchClick(action, action.pointerDownType)) {
        focusedType = focusedType === action.type ? "" : action.type;
        touchInteractionActive = true;
      } else {
        if (excludedTypes.has(action.type)) excludedTypes.delete(action.type);
        else excludedTypes.add(action.type);
        touchInteractionActive = false;
      }
      break;
    case "pointer-over":
      if (action.pointerType !== "touch") {
        focusedType = action.type || "";
        touchInteractionActive = false;
      }
      break;
    case "pointer-out":
      if (action.pointerType !== "touch") {
        focusedType = action.relatedType || "";
        touchInteractionActive = false;
      }
      break;
    case "focus":
      if (!touchInteractionActive || action.inputType === "keyboard") {
        focusedType = action.type || "";
        if (action.inputType === "keyboard") touchInteractionActive = false;
      }
      break;
    case "reset-filters":
      excludedTypes.clear();
      break;
    default:
      throw new TypeError("Unknown type interaction: " + action.kind);
  }

  return { focusedType, excludedTypes, touchInteractionActive };
}

export function isCurrentTouchEdgeSelection(selection, selectedEdgeId, activeProjectId, activeGraph) {
  return Boolean(selection
    && selection.id === selectedEdgeId
    && selection.projectId === activeProjectId
    && selection.graphRef === activeGraph);
}

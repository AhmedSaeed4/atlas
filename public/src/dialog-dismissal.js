// Treat a deliberate backdrop click exactly like Cancel/Escape. A drag that
// starts in the dialog and finishes outside must not discard a form.
export function bindDialogBackdropClose(
  dialog,
  close = () => dialog.close("cancel"),
) {
  if (!dialog) return;
  let backdropPress = false;
  const isBackdrop = (event) => {
    if (event.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };
  dialog.addEventListener("pointerdown", (event) => {
    backdropPress = event.button === 0 && isBackdrop(event);
  });
  dialog.addEventListener("pointercancel", () => {
    backdropPress = false;
  });
  dialog.addEventListener("click", (event) => {
    const dismiss = backdropPress && isBackdrop(event);
    backdropPress = false;
    if (!dismiss || !dialog.open) return;
    // Existing cancel guards (for example an in-flight backup restore) retain
    // control, and file-read/context invalidation follows the Escape path.
    const EventType = dialog.ownerDocument?.defaultView?.Event || Event;
    if (dialog.dispatchEvent(new EventType("cancel", { cancelable: true })))
      close();
  });
  dialog.addEventListener("close", () => {
    backdropPress = false;
  });
}

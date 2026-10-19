const GUIDE_KEY = "atlas.workspace.guide.v1";
export function initWorkspaceGuide({
  root = document,
  storage,
  getState,
  copyPrompt,
  openImport,
  openExample,
}) {
  const byId = (id) => root.getElementById(id),
    dialog = byId("quick-guide");
  let dismissed = false;
  try {
    dismissed = storage?.getItem(GUIDE_KEY) === "done";
  } catch {}
  const complete = () => {
    dismissed = true;
    try {
      storage?.setItem(GUIDE_KEY, "done");
    } catch {}
    update();
  };
  function update() {
    const state = getState();
    byId("workspace-getting-started").hidden =
      dismissed || state.hasMaps || state.shared;
    byId("open-quick-guide").hidden = state.shared;
  }
  function open() {
    if (getState().shared) return;
    dialog.showModal();
  }
  byId("open-quick-guide").addEventListener("click", open);
  byId("start-quick-guide").addEventListener("click", open);
  byId("dismiss-quick-guide").addEventListener("click", complete);
  byId("guide-close").addEventListener("click", () => dialog.close());
  byId("guide-done").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", complete);
  byId("guide-copy").addEventListener("click", () => copyPrompt());
  byId("guide-import").addEventListener("click", () => {
    dialog.close();
    openImport();
  });
  byId("guide-example").addEventListener("click", () => {
    dialog.close();
    openExample();
  });
  update();
  return Object.freeze({ update, open });
}

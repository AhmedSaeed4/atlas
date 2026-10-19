import { MAX_IMPORT_BYTES, serializeGraphJson } from "./schema.js";
import { safeFilename } from "./exports.js";
import {
  compareGraphVersions,
  prepareMapUpdate,
  sameMapContext,
} from "./map-update.js";
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
export function renderVersionComparison(
  host,
  before,
  after,
  comparison = compareGraphVersions(before, after),
  { expanded = false } = {},
) {
  host.replaceChildren();
  if (comparison.projectChanged)
    for (const [field, label] of [
      ["name", "Name"],
      ["type", "Project type"],
      ["description", "Description"],
    ]) {
      if (before.project[field] !== after.project[field])
        host.append(
          el(
            "p",
            "comparison-project",
            label +
              ": " +
              (before.project[field] || "(empty)") +
              " → " +
              (after.project[field] || "(empty)"),
          ),
        );
    }
  const counts = el("div", "comparison-counts");
  for (const [label, value] of [
    ["Added", comparison.nodes.added.length],
    ["Changed", comparison.nodes.changed.length],
    ["Removed", comparison.nodes.removed.length],
  ]) {
    const item = el("span", "");
    item.append(
      el("strong", "", String(value)),
      document.createTextNode(" " + label),
    );
    counts.append(item);
  }
  host.append(counts);
  const names = new Map(
    [...before.nodes, ...after.nodes].map((node) => [node.id, node.label]),
  );
  for (const [kind, group] of [
    ["components", comparison.nodes],
    ["connections", comparison.edges],
  ])
    for (const action of ["added", "changed", "removed"]) {
      const items = group[action];
      if (!items.length) continue;
      const details = el("details", "comparison-section");
      details.open = expanded;
      details.append(
        el(
          "summary",
          "",
          action[0].toUpperCase() +
            action.slice(1) +
            " " +
            kind +
            " · " +
            items.length,
        ),
      );
      const list = el("ul", "");
      for (const item of items)
        list.append(
          el(
            "li",
            "",
            kind === "components"
              ? item.label
              : (names.get(item.source) || item.source) +
                  " → " +
                  (names.get(item.target) || item.target) +
                  (item.label ? " · " + item.label : ""),
          ),
        );
      details.append(list);
      host.append(details);
    }
  if (comparison.preservedPositions)
    host.append(
      el(
        "p",
        "settings-copy",
        "Current positions are kept for " +
          comparison.preservedPositions +
          " existing components.",
      ),
    );
  else if (comparison.moved.length)
    host.append(
      el(
        "p",
        "settings-copy",
        comparison.moved.length + " component positions change.",
      ),
    );
  if (!comparison.hasContentChanges && !comparison.moved.length)
    host.append(el("p", "settings-copy", "No changes need to be applied."));
}

export function initMapVersionTools({
  root = document,
  store,
  getContext,
  getPositions,
  onApply,
  download,
  notify,
}) {
  const byId = (id) => root.getElementById(id),
    updateDialog = byId("map-update-dialog"),
    checkpointDialog = byId("checkpoint-dialog");
  let updateContext = null,
    checkpointContext = null,
    candidate = null,
    selectedCheckpoint = null,
    epoch = 0,
    checkpointEpoch = 0,
    previewTimer = null,
    applying = null,
    checkpointOperation = null;
  const message = (id, text) => {
    byId(id).textContent = text || "";
    byId(id).hidden = !text;
  };
  const current = (context) => sameMapContext(context, getContext());
  const sameTarget = (context) => {
    const next = getContext();
    return Boolean(
      context &&
      next.canEdit &&
      context.key === next.key &&
      context.ownerUid === next.ownerUid,
    );
  };
  const updateOpen = (context, request) =>
    updateDialog.open &&
    updateContext === context &&
    epoch === request &&
    sameTarget(context);
  const checkpointsOpen = (context, request = checkpointEpoch) =>
    checkpointDialog.open &&
    checkpointContext === context &&
    checkpointEpoch === request &&
    sameTarget(context);
  const appliedMessage = (result, action) => {
    notify(
      !result?.saved
        ? action +
            " in this tab, but it is not saved yet. Keep the recovery or download JSON."
        : result.mode === "cloud"
          ? action + ". Cloud save is queued."
          : action + ". You can undo this change.",
      result?.saved ? "info" : "error",
    );
  };
  function resetUpdate() {
    clearTimeout(previewTimer);
    previewTimer = null;
    candidate = null;
    byId("map-update-apply").disabled = true;
    byId("map-update-preview").replaceChildren();
    message("map-update-error", "");
  }
  function showUpdate() {
    const context = getContext();
    if (!context.canEdit) return;
    updateContext = context;
    epoch++;
    resetUpdate();
    byId("map-update-input").value = "";
    byId("map-update-file").value = "";
    byId("map-update-positions").checked = true;
    byId("map-update-target").textContent =
      "Updating " +
      context.name +
      ". Import architecture still creates a separate map.";
    updateDialog.showModal();
  }
  function previewUpdate() {
    resetUpdate();
    if (!current(updateContext)) {
      message(
        "map-update-error",
        "This map or account changed. Close and reopen Update map.",
      );
      return;
    }
    try {
      candidate = prepareMapUpdate(
        updateContext.graph,
        byId("map-update-input").value,
        {
          preservePositions: byId("map-update-positions").checked,
          positions: getPositions(),
        },
      );
      renderVersionComparison(
        byId("map-update-preview"),
        updateContext.graph,
        candidate.graph,
        candidate.comparison,
      );
      byId("map-update-apply").disabled =
        !candidate.comparison.hasContentChanges &&
        !candidate.comparison.moved.length;
    } catch (error) {
      candidate = null;
      message("map-update-error", error.message);
    }
  }
  byId("update-current-map").addEventListener("click", showUpdate);
  byId("map-update-close").addEventListener("click", () =>
    updateDialog.close(),
  );
  byId("map-update-cancel").addEventListener("click", () =>
    updateDialog.close(),
  );
  updateDialog.addEventListener("close", () => {
    epoch++;
    resetUpdate();
    updateContext = null;
    byId("map-update-input").value = "";
    byId("map-update-preview").replaceChildren();
  });
  byId("map-update-input").addEventListener("input", () => {
    const request = ++epoch, context = updateContext;
    resetUpdate();
    byId("map-update-file").value = "";
    if (!byId("map-update-input").value.trim()) return;
    // Batch typing, but prepare pasted JSON without another button press.
    previewTimer = setTimeout(() => {
      previewTimer = null;
      if (updateOpen(context, request)) previewUpdate();
    }, 180);
  });
  byId("map-update-validate").addEventListener("click", previewUpdate);
  byId("map-update-positions").addEventListener("change", () => {
    if (byId("map-update-input").value.trim()) previewUpdate();
  });
  byId("map-update-file").addEventListener("change", async () => {
    const file = byId("map-update-file").files?.[0],
      request = ++epoch;
    resetUpdate();
    if (!file) return;
    // Do not leave an older candidate's text available while this file loads.
    byId("map-update-input").value = "";
    if (file.size > MAX_IMPORT_BYTES) {
      message("map-update-error", "This map exceeds the 2 MiB import limit.");
      return;
    }
    try {
      const text = await file.text();
      if (request !== epoch || !updateDialog.open) return;
      byId("map-update-input").value = text;
      previewUpdate();
    } catch {
      if (request === epoch)
        message("map-update-error", "The map file could not be read.");
    }
  });
  byId("map-update-apply").addEventListener("click", async () => {
    if (
      !candidate ||
      !current(updateContext) ||
      applying?.context === updateContext
    )
      return;
    const context = updateContext,
      graph = candidate.graph,
      button = byId("map-update-apply"),
      request = epoch,
      operation = { context };
    button.disabled = true;
    applying = operation;
    try {
      const result = await onApply(graph, { context, source: "update" });
      if (!updateOpen(context, request)) return;
      updateDialog.close();
      appliedMessage(result, "Map updated");
    } catch (error) {
      if (updateOpen(context, request))
        message("map-update-error", error.message);
    } finally {
      if (applying === operation) applying = null;
      if (updateOpen(context, request)) button.disabled = false;
    }
  });
  function clearCheckpointPreview() {
    selectedCheckpoint = null;
    byId("checkpoint-preview").replaceChildren();
    byId("checkpoint-restore").hidden = true;
  }
  async function listCheckpoints() {
    const context = checkpointContext,
      request = ++checkpointEpoch;
    if (!current(context)) return;
    byId("checkpoint-list").replaceChildren(
      el("li", "settings-copy", "Loading checkpoints…"),
    );
    try {
      const records = await store.listCheckpoints(context.key);
      if (!checkpointsOpen(context, request) || !current(context)) return;
      const list = byId("checkpoint-list");
      list.replaceChildren();
      byId("checkpoint-capacity").textContent =
        records.length +
        " of 8 checkpoints · 12 MiB budget per map. Existing checkpoints are never removed automatically.";
      if (!records.length)
        list.append(
          el(
            "li",
            "settings-copy",
            "No checkpoints yet. Save a named version before making a larger change.",
          ),
        );
      for (const record of records) {
        const item = el("li", "checkpoint-item"),
          select = el("button", "checkpoint-select"),
          name = el("strong", "", record.name),
          meta = el(
            "p",
            "settings-copy",
            new Date(record.updatedAt).toLocaleString() +
              " · " +
              record.graph.nodes.length +
              " components",
          );
        const actions = el("div", "checkpoint-actions");
        const review = () => {
          if (!checkpointsOpen(context, request) || !current(context) || checkpointOperation) return;
          message("checkpoint-error", "");
          selectedCheckpoint = record;
          for (const row of list.children) {
            const chosen = row === item;
            row.setAttribute("data-selected", String(chosen));
            row.querySelector(".checkpoint-select")?.setAttribute("aria-pressed", String(chosen));
          }
          renderVersionComparison(byId("checkpoint-preview"), context.graph, record.graph, undefined, { expanded: true });
          byId("checkpoint-restore").hidden = false;
        };
        select.type = "button";
        select.setAttribute("aria-label", "Review checkpoint " + record.name);
        select.setAttribute("aria-controls", "checkpoint-preview");
        select.setAttribute("aria-pressed", String(selectedCheckpoint?.key === record.key));
        item.setAttribute("data-selected", String(selectedCheckpoint?.key === record.key));
        select.addEventListener("click", review);
        const action = (label, run) => {
          const button = el("button", "button secondary", label);
          button.type = "button";
          button.addEventListener("click", async () => {
            if (
              !checkpointsOpen(context, request) ||
              !current(context) ||
              checkpointOperation
            )
              return;
            button.disabled = true;
            message("checkpoint-error", "");
            try {
              await run(button);
            } catch (error) {
              if (checkpointsOpen(context, request))
                message("checkpoint-error", error.message);
            } finally {
              button.disabled = false;
            }
          });
          actions.append(button);
          return button;
        };
        action("Review", review);
        action("Download", () =>
          download(
            serializeGraphJson(record.graph, 2),
            safeFilename(context.name + "-" + record.name) + ".json",
            "application/json;charset=utf-8",
          ),
        );
        let renaming = false;
        action("Rename", async (button) => {
          if (!renaming) {
            renaming = true;
            const input = el("input", "checkpoint-rename");
            input.type = "text";
            input.maxLength = 80;
            input.value = record.name;
            input.setAttribute("aria-label", "New name for " + record.name);
            name.replaceWith(input);
            button.textContent = "Save name";
            input.focus();
            input.select();
            return;
          }
          const input = item.querySelector(".checkpoint-rename");
          await store.renameCheckpoint(context.key, record.key, input.value);
          if (checkpointsOpen(context, request)) await listCheckpoints();
        });
        let confirmRemoval = false;
        action("Remove", async (button) => {
          if (!confirmRemoval) {
            confirmRemoval = true;
            button.textContent = "Confirm removal";
            return;
          }
          await store.removeCheckpoint(context.key, record.key);
          if (!checkpointsOpen(context, request)) return;
          if (selectedCheckpoint?.key === record.key) clearCheckpointPreview();
          await listCheckpoints();
        });
        item.append(select, name, meta, actions);
        list.append(item);
      }
    } catch (error) {
      if (checkpointsOpen(context, request) && current(context)) {
        byId("checkpoint-list").replaceChildren();
        message("checkpoint-error", error.message);
      }
    }
  }
  byId("open-checkpoints").addEventListener("click", () => {
    const context = getContext();
    if (!context.canEdit) return;
    checkpointContext = context;
    checkpointOperation = null;
    byId("checkpoint-save").disabled = false;
    byId("checkpoint-restore").disabled = false;
    byId("checkpoint-map-name").textContent = context.name;
    byId("checkpoint-name").value = "";
    clearCheckpointPreview();
    message("checkpoint-error", "");
    checkpointDialog.showModal();
    void listCheckpoints();
  });
  byId("checkpoint-close").addEventListener("click", () =>
    checkpointDialog.close(),
  );
  byId("checkpoint-done").addEventListener("click", () =>
    checkpointDialog.close(),
  );
  checkpointDialog.addEventListener("close", () => {
    checkpointEpoch++;
    checkpointContext = null;
    checkpointOperation = null;
    clearCheckpointPreview();
    byId("checkpoint-list").replaceChildren();
    byId("checkpoint-name").value = "";
  });
  byId("checkpoint-save").addEventListener("click", async () => {
    if (!current(checkpointContext) || checkpointOperation) return;
    const context = checkpointContext,
      button = byId("checkpoint-save"),
      request = checkpointEpoch,
      operation = { context };
    checkpointOperation = operation;
    button.disabled = true;
    message("checkpoint-error", "");
    try {
      await store.saveCheckpoint(
        context.key,
        byId("checkpoint-name").value,
        context.graph,
      );
      if (!checkpointsOpen(context, request) || !current(context)) return;
      byId("checkpoint-name").value = "";
      await listCheckpoints();
      if (checkpointsOpen(context)) notify("Checkpoint saved on this device.");
    } catch (error) {
      if (checkpointsOpen(context, request) && current(context))
        message("checkpoint-error", error.message);
    } finally {
      if (checkpointOperation === operation) {
        checkpointOperation = null;
        if (checkpointsOpen(context)) button.disabled = false;
      }
    }
  });
  byId("checkpoint-restore").addEventListener("click", async () => {
    if (
      !selectedCheckpoint ||
      !current(checkpointContext) ||
      checkpointOperation
    )
      return;
    const context = checkpointContext,
      selected = selectedCheckpoint,
      button = byId("checkpoint-restore"),
      request = checkpointEpoch,
      operation = { context };
    checkpointOperation = operation;
    button.disabled = true;
    try {
      const records = await store.listCheckpoints(context.key);
      if (!checkpointsOpen(context, request)) return;
      const stillPresent = records.find(
        (item) =>
          item.key === selected.key &&
          JSON.stringify(item.graph) === JSON.stringify(selected.graph),
      );
      if (!stillPresent || !current(context))
        throw new Error(
          "The checkpoint or map changed. Review it again before restoring.",
        );
      applying = operation;
      const result = await onApply(stillPresent.graph, {
        context,
        source: "checkpoint",
      });
      if (!checkpointsOpen(context, request)) return;
      checkpointDialog.close();
      appliedMessage(result, "Checkpoint restored");
    } catch (error) {
      if (checkpointsOpen(context, request))
        message("checkpoint-error", error.message);
    } finally {
      if (applying === operation) applying = null;
      if (checkpointOperation === operation) {
        checkpointOperation = null;
        if (checkpointsOpen(context)) button.disabled = false;
      }
    }
  });
  const panel = byId("map-tools-panel"),
    toggle = byId("map-tools");
  panel.addEventListener("beforetoggle", (event) => {
    if (event.newState === "open") {
      const rect = toggle.getBoundingClientRect();
      panel.style.left =
        Math.max(8, Math.min(rect.right - 220, innerWidth - 232)) + "px";
      panel.style.top = rect.bottom + 7 + "px";
    }
  });
  for (const id of ["update-current-map", "open-checkpoints"])
    byId(id).addEventListener("click", () => {
      try {
        panel.hidePopover();
      } catch {}
    });
  return Object.freeze({
    update() {
      const context = getContext();
      toggle.disabled = !context.canEdit;
      toggle.hidden = !context.hasProject || context.shared;
      for (const [dialog, captured] of [
        [updateDialog, updateContext],
        [checkpointDialog, checkpointContext],
      ])
        if (
          dialog.open &&
          !current(captured) &&
          !(applying?.context === captured && sameTarget(captured))
        )
          dialog.close();
    },
  });
}

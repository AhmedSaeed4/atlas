const snapshot = (graph) => JSON.stringify(graph);
const memorySize = (entry) => 2 * [entry.current, ...entry.past, ...entry.future].reduce((sum, text) => sum + text.length, 0);

// Graph snapshots stay in memory, scoped by local map or verified cloud owner/map.
// No view state, account access, workspace deletion or sharing action is recorded.
export function createEditHistory({ maxSteps = 50, maxBytes = 32 * 1024 * 1024, maxWorkspaces = 20 } = {}) {
  const entries = new Map();
  const steps = Math.max(1, Math.floor(maxSteps));
  const budget = Math.max(1, Math.floor(maxBytes));
  const workspaces = Math.max(1, Math.floor(maxWorkspaces));
  const touch = (key, entry) => { entries.delete(key); entries.set(key, entry); };
  const trim = (key, entry) => {
    while (entry.past.length > steps) entry.past.shift();
    while (entry.past.length + entry.future.length > steps) entry.future.shift();
    while (memorySize(entry) > budget && (entry.past.length || entry.future.length)) {
      if (entry.past.length) entry.past.shift(); else entry.future.shift();
    }
    entry.bytes = memorySize(entry);
    let bytes = [...entries.values()].reduce((sum, item) => sum + item.bytes, 0);
    for (const [otherKey, other] of entries) {
      if (entries.size <= workspaces && bytes <= budget) break;
      if (otherKey === key) continue;
      entries.delete(otherKey); bytes -= other.bytes;
    }
  };
  const state = (key) => {
    const entry = entries.get(key);
    return Object.freeze({ canUndo: Boolean(entry?.past.length), canRedo: Boolean(entry?.future.length),
      undoCount: entry?.past.length || 0, redoCount: entry?.future.length || 0 });
  };
  const seed = (key, text) => {
    const entry = { current: text, past: [], future: [], bytes: 2 * text.length };
    touch(key, entry); trim(key, entry); return state(key);
  };
  const sync = (key, graph) => {
    if (!key) return state(key);
    const text = snapshot(graph), entry = entries.get(key);
    if (!entry || entry.current !== text) return seed(key, text);
    touch(key, entry); return state(key);
  };
  const step = (key, graph, direction) => {
    const entry = entries.get(key);
    if (!entry) return null;
    if (entry.current !== snapshot(graph)) { sync(key, graph); return null; }
    const from = direction === "undo" ? entry.past : entry.future;
    const to = direction === "undo" ? entry.future : entry.past;
    if (!from.length) return null;
    const text = from.at(-1), result = JSON.parse(text);
    from.pop(); to.push(entry.current); entry.current = text;
    touch(key, entry); trim(key, entry); return result;
  };
  return Object.freeze({
    ensure(key, graph) {
      if (!key) return state(key);
      const entry = entries.get(key);
      if (!entry) return seed(key, snapshot(graph));
      touch(key, entry); return state(key);
    },
    sync,
    record(key, graph) {
      if (!key) return state(key);
      const text = snapshot(graph), entry = entries.get(key);
      if (!entry) return seed(key, text);
      if (entry.current === text) return state(key);
      entry.past.push(entry.current); entry.current = text; entry.future = [];
      touch(key, entry); trim(key, entry); return state(key);
    },
    undo: (key, graph) => step(key, graph, "undo"),
    redo: (key, graph) => step(key, graph, "redo"),
    state,
    forget(key) { entries.delete(key); },
    clear(prefix = "") { for (const key of entries.keys()) if (key.startsWith(prefix)) entries.delete(key); },
  });
}

export function editHistoryShortcut(event) {
  if (!(event.ctrlKey || event.metaKey) || event.altKey || event.isComposing || event.defaultPrevented) return null;
  const target = event.target;
  if (target?.isContentEditable || target?.closest?.("input, textarea, select, [contenteditable], [role='textbox']")) return null;
  const key = String(event.key || "").toLowerCase();
  if (key === "z") return event.shiftKey ? "redo" : "undo";
  if (key === "y" && !event.shiftKey) return "redo";
  return null;
}

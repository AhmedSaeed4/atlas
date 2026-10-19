import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { initMapVersionTools } from "../public/src/map-version-tools.js";
import { normalizeEditableGraph } from "../public/src/schema.js";

// Exercise the real async dialog handlers with a small, deterministic DOM.
// No browser globals, persistence adapters, or controller source are replaced.
class Element {
  constructor(tag = "div") {
    this.tagName = tag;
    this.children = [];
    this.listeners = new Map();
    this.value = "";
    this.hidden = false;
    this.disabled = false;
    this.open = false;
    this.style = {};
    this.attributes = {};
    this.text = "";
  }
  set textContent(value) {
    this.text = String(value);
    this.children = [];
  }
  get textContent() {
    return this.text + this.children.map((child) => child.textContent).join("");
  }
  append(...children) {
    for (const child of children) {
      child.parent = this;
      this.children.push(child);
    }
  }
  replaceChildren(...children) {
    this.text = "";
    this.children = [];
    this.append(...children);
  }
  replaceWith(child) {
    const i = this.parent.children.indexOf(this);
    child.parent = this.parent;
    this.parent.children[i] = child;
  }
  setAttribute(key, value) {
    this.attributes[key] = value;
  }
  addEventListener(event, handler) {
    const list = this.listeners.get(event) || [];
    list.push(handler);
    this.listeners.set(event, list);
  }
  fire(event) {
    return Promise.all(
      (this.listeners.get(event) || []).map((handler) =>
        handler({ target: this }),
      ),
    );
  }
  showModal() {
    this.open = true;
  }
  close() {
    this.open = false;
    void this.fire("close");
  }
  hidePopover() {}
  focus() {}
  select() {}
  querySelector(selector) {
    return this.children
      .flatMap((child) => [child, ...child.descendants()])
      .find((child) => "." + child.className === selector);
  }
  descendants() {
    return this.children.flatMap((child) => [child, ...child.descendants()]);
  }
}
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
const graph = (name = "Fictional") =>
  normalizeEditableGraph({
    project: { name },
    nodes: [{ id: "a", label: name, type: "Service" }],
    edges: [],
  });
function fixture(t, overrides = {}) {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  const previous = globalThis.document;
  globalThis.document = {
    createElement: (tag) => new Element(tag),
    createTextNode: (text) => {
      const node = new Element("#text");
      node.textContent = text;
      return node;
    },
  };
  t.after(() => {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  });
  let context = {
    key: "local:a",
    ownerUid: "",
    graph: graph(),
    canEdit: true,
    hasProject: true,
    name: "Fictional",
  };
  const notices = [],
    applied = [];
  const record = {
    key: "local:a:version",
    name: "Before changes",
    graph: graph("Before"),
    updatedAt: 1,
  };
  const store = {
    listCheckpoints: async () => [record],
    saveCheckpoint: async () => record,
    ...overrides.store,
  };
  const controller = initMapVersionTools({
    root: { getElementById: get },
    store,
    getContext: () => ({ ...context }),
    getPositions: () => new Map(),
    onApply:
      overrides.onApply ||
      (async (value, options) => {
        applied.push({ value, options });
        return { saved: true };
      }),
    download: () => {},
    notify: (...notice) => notices.push(notice),
  });
  return {
    get,
    record,
    notices,
    applied,
    controller,
    context: (value) => {
      context = { ...context, ...value };
      controller.update();
    },
    click: (id) => get(id).fire("click"),
    review: () =>
      get("checkpoint-list")
        .descendants()
        .find(
          (child) =>
            child.tagName === "button" && child.textContent === "Review",
        )
        .fire("click"),
  };
}
test("closing a checkpoint dialog cancels a restore waiting for its second storage read", async (t) => {
  const read = deferred();
  let reads = 0,
    f;
  f = fixture(t, {
    store: {
      listCheckpoints: async () => (++reads === 1 ? [f.record] : read.promise),
    },
  });
  await f.click("open-checkpoints");
  await setImmediate();
  await f.review();
  const restore = f.click("checkpoint-restore");
  await f.click("checkpoint-close");
  read.resolve([f.record]);
  await restore;
  assert.equal(f.applied.length, 0);
  assert.equal(f.get("checkpoint-dialog").open, false);
  assert.equal(f.get("checkpoint-preview").textContent, "");
});
test("an account switch clears private checkpoint data and ignores a late list", async (t) => {
  const read = deferred();
  const f = fixture(t, { store: { listCheckpoints: () => read.promise } });
  f.context({ key: "cloud:owner-a:map", ownerUid: "owner-a" });
  await f.click("open-checkpoints");
  f.context({
    key: "cloud:owner-b:map",
    ownerUid: "owner-b",
    graph: graph("Other"),
  });
  read.resolve([f.record]);
  await setImmediate();
  assert.equal(f.get("checkpoint-dialog").open, false);
  assert.equal(f.get("checkpoint-list").textContent, "");
  assert.equal(f.get("checkpoint-preview").textContent, "");
});
test("an old checkpoint save cannot clear a reopened name or enable a newer save", async (t) => {
  const first = deferred(),
    second = deferred();
  let saves = 0;
  const f = fixture(t, {
    store: {
      saveCheckpoint: () => (++saves === 1 ? first.promise : second.promise),
    },
  });
  await f.click("open-checkpoints");
  await setImmediate();
  f.get("checkpoint-name").value = "First";
  const saveA = f.click("checkpoint-save");
  await f.click("checkpoint-close");
  await f.click("open-checkpoints");
  await setImmediate();
  f.get("checkpoint-name").value = "Second";
  const saveB = f.click("checkpoint-save");
  first.resolve(f.record);
  await saveA;
  assert.equal(f.get("checkpoint-name").value, "Second");
  assert.equal(f.get("checkpoint-save").disabled, true);
  assert.deepEqual(f.notices, []);
  second.resolve(f.record);
  await saveB;
  assert.equal(f.get("checkpoint-name").value, "");
  assert.equal(f.get("checkpoint-save").disabled, false);
  assert.equal(f.notices.length, 1);
});
test("an old update completion cannot close or enable a reopened, unvalidated dialog", async (t) => {
  const save = deferred();
  const f = fixture(t, { onApply: () => save.promise });
  await f.click("update-current-map");
  f.get("map-update-input").value = JSON.stringify(graph("Updated"));
  await f.click("map-update-validate");
  assert.equal(f.get("map-update-apply").disabled, false);
  const apply = f.click("map-update-apply");
  await f.click("map-update-close");
  await f.click("update-current-map");
  f.get("map-update-input").value = "New unfinished input";
  save.resolve({ saved: true });
  await apply;
  assert.equal(f.get("map-update-dialog").open, true);
  assert.equal(f.get("map-update-input").value, "New unfinished input");
  assert.equal(f.get("map-update-apply").disabled, true);
  assert.deepEqual(f.notices, []);
});
test("own update rendering can finish while navigation to another map closes the pending dialog", async (t) => {
  const save = deferred();
  let f;
  f = fixture(t, {
    onApply: (value) => {
      f.context({ graph: value });
      return save.promise;
    },
  });
  await f.click("update-current-map");
  f.get("map-update-input").value = JSON.stringify(graph("Updated"));
  await f.click("map-update-validate");
  const apply = f.click("map-update-apply");
  assert.equal(f.get("map-update-dialog").open, true);
  f.context({ key: "local:b", graph: graph("Different map") });
  assert.equal(f.get("map-update-dialog").open, false);
  save.reject(new Error("Old write failed"));
  await apply;
  assert.equal(f.get("map-update-error").textContent, "");
  assert.deepEqual(f.notices, []);
});
test("checkpoint restores report unsaved recovery instead of claiming successful persistence", async (t) => {
  const f = fixture(t, {
    onApply: async () => ({ saved: false, mode: "local" }),
  });
  await f.click("open-checkpoints");
  await setImmediate();
  await f.review();
  await f.click("checkpoint-restore");
  assert.equal(f.notices[0][1], "error");
  assert.match(f.notices[0][0], /not saved yet/);
  assert.equal(f.get("checkpoint-dialog").open, false);
});

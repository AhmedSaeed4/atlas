import assert from "node:assert/strict";
import test from "node:test";
import {
  createLandingNetwork,
  getLandingNetworkDetails,
  getLandingNetworkRelations,
  getLandingNetworkWheelRotation,
  getLandingNetworkFrame,
  projectLandingNetworkNode,
  getLandingNetworkHighlight,
  mountLandingNetwork,
} from "../public/src/landing-network.js";

test("the illustration is one connected finite network within a small rendering budget", () => {
  const { nodes, edges, hubs } = createLandingNetwork();
  assert.ok(nodes.length > 100 && nodes.length <= 256);
  assert.ok(edges.length < nodes.length * 6);
  const neighbours = nodes.map(() => []);
  const seenEdges = new Set();
  for (const node of nodes) {
    for (const field of ["x", "y", "z", "r", "phase"]) assert.ok(Number.isFinite(node[field]), field);
    assert.ok(node.r > 0 && node.r < 10);
    assert.ok(getLandingNetworkDetails(node.key));
  }
  for (const [from, to] of edges) {
    assert.ok(Number.isInteger(from) && Number.isInteger(to));
    assert.ok(from >= 0 && from < nodes.length && to >= 0 && to < nodes.length);
    assert.notEqual(from, to);
    const key = [from, to].sort((a, b) => a - b).join(":");
    assert.ok(!seenEdges.has(key), "duplicate connection");
    seenEdges.add(key);
    neighbours[from].push(to);
    neighbours[to].push(from);
  }
  const reached = new Set([0]);
  const pending = [0];
  while (pending.length) {
    for (const next of neighbours[pending.pop()]) {
      if (!reached.has(next)) { reached.add(next); pending.push(next); }
    }
  }
  assert.equal(reached.size, nodes.length, "the view must not contain disconnected clouds");
  for (const [key, index] of Object.entries(hubs)) {
    assert.ok(nodes[index].hub);
    assert.equal(nodes[index].key, key);
  }
});

test("software layers and individual components highlight their actual relationship", () => {
  const groups = { interface: ["web"], services: ["api", "data"], async: ["queue", "worker"] };
  for (const [layer, components] of Object.entries(groups)) {
    assert.deepEqual(getLandingNetworkRelations(layer), new Set([layer, ...components]));
    for (const component of components) {
      assert.deepEqual(getLandingNetworkRelations(component), new Set([component, layer]));
      const detail = getLandingNetworkDetails(component);
      assert.ok(detail.title && detail.description);
    }
  }
});

test("unknown, malformed and inherited labels cannot select a relationship", () => {
  for (const id of [null, undefined, {}, [], 1, "", "<img onerror=alert(1)>", "__proto__", "constructor", "toString"]) {
    assert.equal(getLandingNetworkDetails(id), null);
    assert.deepEqual(getLandingNetworkRelations(id), new Set());
  }
  const detail = getLandingNetworkDetails("api");
  detail.title = "Changed outside the renderer";
  const related = getLandingNetworkRelations("services");
  related.clear();
  assert.equal(getLandingNetworkDetails("api").title, "API service");
  assert.equal(getLandingNetworkRelations("services").size, 3);
});


test("only a pointer inside the network ellipse consumes a wheel gesture", () => {
  const region = { cx: 400, cy: 250, rx: 160, ry: 100 };
  const event = { deltaY: 100 };
  const rotation = getLandingNetworkWheelRotation(event, { x: 400, y: 250 }, region);
  assert.ok(Math.abs(rotation.yaw - .23) < 1e-12);
  assert.equal(rotation.pitch, 0);
  assert.ok(getLandingNetworkWheelRotation(event, { x: 560, y: 250 }, region));
  for (const point of [{ x: 561, y: 250 }, { x: 400, y: 351 }, { x: 550, y: 340 }, { x: 120, y: 250 }]) {
    assert.equal(getLandingNetworkWheelRotation(event, point, region), null, "text, empty space and rectangular corners must scroll the page");
  }
});

test("network scrolling preserves zoom and rejects empty or invalid gestures", () => {
  const region = { cx: 100, cy: 100, rx: 50, ry: 50 }, point = { x: 100, y: 100 };
  assert.equal(getLandingNetworkWheelRotation({ ctrlKey: true, deltaY: 100 }, point, region), null);
  assert.equal(getLandingNetworkWheelRotation({ deltaY: 0, deltaX: 0 }, point, region), null);
  assert.equal(getLandingNetworkWheelRotation({ deltaY: NaN }, point, region), null);
  assert.equal(getLandingNetworkWheelRotation({ deltaY: 1 }, point, { ...region, rx: 0 }), null);
  assert.equal(getLandingNetworkWheelRotation({ deltaY: 1 }, { x: Infinity, y: 100 }, region), null);
});

test("pixel, line and page wheel input remains bounded and supports tilt", () => {
  const region = { cx: 100, cy: 100, rx: 50, ry: 50 }, point = { x: 100, y: 100 };
  const pixel = getLandingNetworkWheelRotation({ deltaY: 240 }, point, region);
  assert.deepEqual(getLandingNetworkWheelRotation({ deltaY: 15, deltaMode: 1 }, point, region), pixel);
  assert.deepEqual(getLandingNetworkWheelRotation({ deltaY: 1, deltaMode: 2 }, point, region, 540), pixel);
  assert.deepEqual(getLandingNetworkWheelRotation({ deltaY: 99999 }, point, region), pixel);
  assert.deepEqual(getLandingNetworkWheelRotation({ deltaX: 100, deltaY: 50, shiftKey: true }, point, region), { yaw: .2, pitch: .09 });
});

test("a uniform perspective keeps the globe round and bounded through a full orbit", () => {
  const cloud = createLandingNetwork();
  const original = structuredClone(cloud);
  const sizes = [
    { width: 284, height: 608, matrix: { right: 264, bottom: 256 } },
    { width: 339, height: 608, matrix: { right: 319, bottom: 256 } },
    { width: 760, height: 788, matrix: { right: 580, bottom: 256 } },
    { width: 798, height: 440, matrix: { right: 311.22, bottom: 353 } },
    { width: 920, height: 440, matrix: { right: 358.8, bottom: 360 } },
    { width: 1180, height: 507.4, matrix: { right: 460, bottom: 390 } },
  ];
  for (const { width, height, matrix } of sizes) {
    const frame = getLandingNetworkFrame(width, height, matrix);
    const savedFrame = { ...frame };
    assert.equal(frame.rx, frame.ry, "viewport must not stretch the mesh");
    const x = projectLandingNetworkNode({ x: 1, y: 0, z: 0 }, frame, 0, 0);
    const y = projectLandingNetworkNode({ x: 0, y: 1, z: 0 }, frame, 0, 0);
    assert.ok(Math.abs(x.x - frame.cx - (y.y - frame.cy)) < 1e-9);
    for (let turn = 0; turn <= 48; turn++) {
      for (const pitch of [-.85, -.12, .85]) {
        for (const node of cloud.nodes) {
          const p = projectLandingNetworkNode(node, frame, turn * Math.PI / 24, pitch);
          const margin = p.r * p.scale + 5; // dot plus focus ring
          assert.ok(p.x - margin >= 0 && p.x + margin <= width, "side crop");
          assert.ok(p.y - margin >= 0 && p.y + margin <= height, "top/bottom crop");
          if (width < 780) assert.ok(p.y - margin > matrix.bottom + 20, "reading column overlap");
          else assert.ok(p.x - margin > matrix.right + 12, "reading column overlap");
        }
      }
    }
    assert.deepEqual(frame, savedFrame, "rotation must not re-fit the drawing");
  }
  assert.deepEqual(cloud, original, "projection must not deform the source mesh");
});

test("a dot highlights only itself and directly connected neighbours without moving them", () => {
  const cloud = createLandingNetwork(), before = structuredClone(cloud);
  const index = 42, focus = getLandingNetworkHighlight(cloud, cloud.nodes[index].key, index);
  const expectedEdges = new Set(), expectedNodes = new Set([index]);
  cloud.edges.forEach(([a, b], edge) => {
    if (a === index || b === index) { expectedEdges.add(edge); expectedNodes.add(a); expectedNodes.add(b); }
  });
  assert.deepEqual(focus, { nodes: expectedNodes, edges: expectedEdges });
  assert.ok(focus.nodes.size < cloud.nodes.length / 5, "hover must stay local");
  assert.deepEqual(cloud, before);
});

test("every label can trace its actual hub and its layer connection", () => {
  const cloud = createLandingNetwork();
  for (const [layer, components] of Object.entries({ interface: ["web"], services: ["api", "data"], async: ["queue", "worker"] })) {
    for (const part of components) {
      const connection = cloud.edges.findIndex(([a, b]) => [a, b].includes(cloud.hubs[layer]) && [a, b].includes(cloud.hubs[part]));
      assert.ok(connection >= 0, "label relation must exist in the mesh");
      for (const key of [part, layer]) {
        const focus = getLandingNetworkHighlight(cloud, key);
        assert.ok(focus.edges.has(connection));
        assert.ok(focus.nodes.has(cloud.hubs[part]) && focus.nodes.has(cloud.hubs[layer]));
        assert.ok(focus.nodes.size < cloud.nodes.length / 2, "labels must not flood the globe with highlights");
      }
    }
  }
  for (const key of [null, "__proto__", "constructor", "unrecognized"]) {
    assert.deepEqual(getLandingNetworkHighlight(cloud, key), { nodes: new Set(), edges: new Set() });
  }
  assert.deepEqual(createLandingNetwork(), cloud, "reload must retain the same composition");
});

test("mounted hover fades paths without moving geometry or the camera, and settles when paused", (t) => {
  const saved = new Map(), frames = new Map();
  let nextFrame = 0, time = 100, paths = [], from = null;
  function install(key, value) {
    saved.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  t.after(() => {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const context = {
    setTransform() {}, clearRect() { paths = []; }, beginPath() {}, stroke() {}, fill() {},
    fillRect() {}, arc() {}, drawImage() {}, bezierCurveTo() {},
    moveTo(x, y) { from = [x, y]; },
    lineTo(x, y) { paths.push([...from, x, y]); },
    createRadialGradient() { return { addColorStop() {} }; },
  };
  function element(box) {
    const events = new Map();
    return {
      dataset: {}, style: {}, events,
      classList: { toggle() {}, add() {}, remove() {} },
      addEventListener(type, fn) { events.set(type, fn); },
      removeEventListener() {}, setAttribute() {}, closest() { return null; },
      getBoundingClientRect() { return box; },
    };
  }
  const box = { left: 0, top: 0, right: 1180, bottom: 508, width: 1180, height: 508 };
  const stage = element(box), canvas = element(box);
  canvas.getContext = () => context;
  stage.querySelector = () => canvas;
  const ids = ["interface", "services", "async", "web", "api", "data", "queue", "worker"];
  const rows = ids.map((id, index) => {
    const row = element({ left: index < 3 ? 0 : 260, right: index < 3 ? 190 : 460, top: 150 + index % 5 * 46, height: 46 });
    row.dataset.item = id;
    return row;
  });
  stage.querySelectorAll = () => rows;
  const root = {
    dataset: {},
    querySelector(selector) {
      if (selector === "[data-network-stage]") return stage;
      if (selector === ".matrix") return element({ right: 460, bottom: 390 });
      return { textContent: "" };
    },
  };
  const media = { matches: false, addEventListener() {}, removeEventListener() {} };
  install("matchMedia", () => media);
  install("devicePixelRatio", 1);
  install("document", {
    hidden: false, documentElement: { dataset: { theme: "light" } },
    addEventListener() {}, removeEventListener() {},
    createElement() { return { getContext: () => context }; },
  });
  const Observer = class { observe() {} disconnect() {} };
  install("ResizeObserver", Observer);
  install("MutationObserver", Observer);
  install("IntersectionObserver", Observer);
  install("requestAnimationFrame", fn => { frames.set(++nextFrame, fn); return nextFrame; });
  install("cancelAnimationFrame", id => frames.delete(id));
  function settle() {
    for (let step = 0; frames.size && step < 120; step++) {
      const callbacks = [...frames.values()]; frames.clear();
      time += 16;
      callbacks.forEach(fn => fn(time));
    }
    assert.equal(frames.size, 0, "paused or hovered rendering must settle");
  }
  const controller = mountLandingNetwork(root);
  stage.events.get("keydown")({ key: " ", target: stage, preventDefault() {} });
  settle();
  const geometry = () => [...new Set(paths.map(p => JSON.stringify(p)))].sort();
  const before = geometry();
  const camera = { yaw: stage.dataset.yaw, pitch: stage.dataset.pitch, radius: stage.dataset.radius, width: canvas.width, height: canvas.height };
  const frame = getLandingNetworkFrame(1180, 508, { right: 460, bottom: 390 });
  const cloud = createLandingNetwork();
  for (const index of [0, 42, cloud.hubs.api]) {
    const point = projectLandingNetworkNode(cloud.nodes[index], frame, .22, -.12);
    stage.events.get("pointermove")({ clientX: point.x, clientY: point.y, target: canvas, pointerId: 1 });
    settle();
    assert.ok(stage.dataset.hover, "pointer should explore a node");
    assert.deepEqual(geometry(), before, "hover must not pull dots or tilt the view");
    assert.deepEqual({ yaw: stage.dataset.yaw, pitch: stage.dataset.pitch, radius: stage.dataset.radius, width: canvas.width, height: canvas.height }, camera);
  }
  stage.events.get("pointerleave")();
  settle();
  assert.equal(stage.dataset.hover, "");
  assert.deepEqual(geometry(), before);
  controller.destroy();
});

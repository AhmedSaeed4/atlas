import assert from "node:assert/strict";
import test from "node:test";
import {
  createLandingNetwork,
  getLandingNetworkDetails,
  getLandingNetworkRelations,
  getLandingNetworkWheelRotation,
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

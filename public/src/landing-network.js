const groups = { interface: ["web"], services: ["api", "data"], async: ["queue", "worker"] };
const pairs = Object.entries(groups).flatMap(([layer, parts]) => parts.map((part) => [layer, part]));
const descriptions = {
  interface: ["Interface", "The web client is where someone meets the system."],
  services: ["Services", "Follow the API layer into the records it keeps."],
  async: ["Async work", "A queue hands work to a process that runs in the background."],
  web: ["Web client", "The interface connects a person to the application."],
  api: ["API service", "The service receives requests and coordinates application work."],
  data: ["Data store", "Application records belong to the service layer."],
  queue: ["Job queue", "Pending work waits here before a worker picks it up."],
  worker: ["Worker", "A background process completes the queued work."]
};
// Fictional, deterministic geometry; the demo never reads saved maps.
function createLandingNetwork() {
  let seed = 7401;
  const random = () => {
    seed = seed * 1664525 + 1013904223 >>> 0;
    return seed / 4294967296;
  };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function makeCloud(keys) {
    const nodes = [], hubs = {};
    for (let i = 0; i < 176; i++) {
      const azimuth = random() * Math.PI * 2;
      const vertical = random() * 2 - 1;
      const radius = Math.cbrt(random());
      const circumference = Math.sqrt(1 - vertical * vertical);
      const y = vertical * radius;
      const key = keys[clamp(Math.floor((y + 1) / 2 * keys.length), 0, keys.length - 1)];
      const prominent = random() > 0.96;
      nodes.push({ x: Math.cos(azimuth) * circumference * radius, y, z: Math.sin(azimuth) * circumference * radius, key, r: prominent ? 4.2 + random() * 1.6 : 0.9 + random() * 1.1, phase: random() * Math.PI * 2, hub: false });
    }
    const hubPositions = { interface: [-0.7, -0.48, 0.1], services: [-0.68, 0.03, 0.4], async: [-0.44, 0.67, 0.2], web: [0.44, -0.74, 0.35], api: [0.76, -0.3, 0.2], data: [0.71, 0.07, 0.3], queue: [0.68, 0.49, 0.18], worker: [0.24, 0.78, 0.3] };
    keys.forEach((key) => {
      hubs[key] = nodes.length;
      const [x, y, z] = hubPositions[key];
      nodes.push({ x, y, z, key, r: 4.8 + random() * 1.6, phase: random() * 6, hub: true });
    });
    // Nearest-prior links keep every point in the same connected network.
    const edgeKeys = new Set(), edges = [];
    nodes.forEach((node, source) => {
      const neighbours = nodes.map((other, target) => ({ target, distance: (node.x - other.x) ** 2 + (node.y - other.y) ** 2 + (node.z - other.z) ** 2 })).filter((n) => n.target !== source).sort((a, b) => a.distance - b.distance);
      const links = [...neighbours.slice(0, node.hub ? 4 : 3), ...source ? [neighbours.find((n) => n.target < source)] : []];
      links.forEach(({ target }) => {
        const from = Math.min(source, target), to = Math.max(source, target), key = `${from}:${to}`;
        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push([from, to]);
        }
      });
    });
    // Give the labeled layer/component relationships real paths through the mesh.
    pairs.forEach(([layer, part]) => {
      const from = Math.min(hubs[layer], hubs[part]), to = Math.max(hubs[layer], hubs[part]);
      const key = from + ":" + to;
      if (!edgeKeys.has(key)) { edgeKeys.add(key); edges.push([from, to]); }
    });
    return { nodes, edges, hubs };
  }
  return makeCloud(Object.keys(descriptions));
}
function getLandingNetworkDetails(id) {
  if (typeof id !== "string" || !Object.hasOwn(descriptions, id)) return null;
  const [title, description] = descriptions[id];
  return { title, description };
}
function getLandingNetworkRelations(id) {
  if (typeof id !== "string" || !Object.hasOwn(descriptions, id)) return new Set();
  if (Object.hasOwn(groups, id)) return new Set([id, ...groups[id]]);
  const layer = Object.keys(groups).find((key) => groups[key].includes(id));
  return new Set([id, layer]);
}
// One scale for all axes; hover and rotation never change the framing.
function getLandingNetworkFrame(width, height, matrix) {
  const stacked = width < 780;
  const left = stacked ? 12 : matrix.right + 28;
  const top = stacked ? matrix.bottom + 48 : 28;
  const right = width - 12, bottom = height - 28;
  const radius = Math.max(1, (Math.min(right - left, bottom - top) / 2 - 14) / 1.015);
  return { cx: (left + right) / 2, cy: (top + bottom) / 2, rx: radius, ry: radius };
}
function projectLandingNetworkNode(node, frame, yaw, pitch) {
  const ct = Math.cos(yaw), st = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = node.x * ct + node.z * st, z = node.z * ct - node.x * st;
  const y = node.y * cp - z * sp, depth = node.y * sp + z * cp;
  const perspective = 6 / (6 - depth);
  return { ...node, x: frame.cx + x * frame.rx * perspective, y: frame.cy + y * frame.ry * perspective, depth, scale: perspective };
}
function getLandingNetworkHighlight(cloud, key, pointIndex = null) {
  const nodes = new Set(), edges = new Set();
  if (!getLandingNetworkDetails(key)) return { nodes, edges };
  const directPoint = Number.isInteger(pointIndex) && cloud.nodes[pointIndex]?.key === key;
  const seeds = new Set(directPoint ? [pointIndex] : [...getLandingNetworkRelations(key)].map(id => cloud.hubs[id]));
  seeds.forEach(index => nodes.add(index));
  cloud.edges.forEach(([from, to], index) => {
    if (seeds.has(from) || seeds.has(to)) {
      edges.add(index);
      nodes.add(from);
      nodes.add(to);
    }
  });
  return { nodes, edges };
}
function containsNetworkPoint(point, region) {
  if (!point || !region || ![point.x, point.y, region.cx, region.cy, region.rx, region.ry].every(Number.isFinite) || region.rx <= 0 || region.ry <= 0) return false;
  const x = (point.x - region.cx) / region.rx;
  const y = (point.y - region.cy) / region.ry;
  return x * x + y * y <= 1;
}
// Return null when the browser should retain normal page scrolling or zoom.
function getLandingNetworkWheelRotation(event, point, region, pageHeight = 800) {
  if (!event || event.ctrlKey || !containsNetworkPoint(point, region)) return null;
  const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pageHeight : 1;
  const deltaX = event.deltaX ?? 0, deltaY = event.deltaY ?? 0;
  if (![units, deltaX, deltaY].every(Number.isFinite) || units <= 0) return null;
  const dx = Math.max(-240, Math.min(240, deltaX * units));
  const dy = Math.max(-240, Math.min(240, deltaY * units));
  if (!dx && !dy) return null;
  return {
    yaw: event.shiftKey ? dx * .002 : dy * .0023,
    pitch: event.shiftKey ? dy * .0018 : dx * .0018,
  };
}

function mountLandingNetwork(root) {
  if (!root) return null;
  const stage = root.querySelector("[data-network-stage]");
  const canvas = stage?.querySelector("canvas");
  const context = canvas?.getContext("2d", { alpha: true });
  if (!context) return null;
  const rows = [...stage.querySelectorAll("[data-item]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const cloud = createLandingNetwork();
  const nodeLight = new Float32Array(cloud.nodes.length), edgeLight = new Float32Array(cloud.edges.length);
  let highlight = { nodes: new Set(), edges: new Set() }, focusAmount = 0, highlightState = "";
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let inView = true;
  let width = 0, height = 0, mobile = false, frame = null, anchors = {}, palette = {}, sprites = [];
  let selected = null, preview = null, selectedPoint = null, previewPoint = null, motion = !reduced.matches;
  let yaw = 0.22, pitch = -0.12, targetYaw = yaw, targetPitch = pitch;
  let mouse = { x: 0, y: 0, inside: false }, drag = null, raf = null, lastTime = 0, visualTime = 0;
  let projected = [], rowState = "";
  function updateText() {
    const active = preview || selected, connected = getLandingNetworkRelations(active), state = `${selected}:${preview}`;
    if (state === rowState) return;
    rowState = state;
    rows.forEach((row) => {
      const id = row.dataset.item;
      row.setAttribute("aria-pressed", String(id === selected));
      row.classList.toggle("is-related", connected.has(id) && id !== active);
      row.classList.toggle("is-preview", id === preview);
    });
    const details = getLandingNetworkDetails(active);
    const title = details?.title || "Software, in perspective";
    const text = details?.description || "Every dot is a part. Every line is a relationship.";
    root.querySelector("#network-detail-title").textContent = title;
    root.querySelector("#network-detail-text").textContent = text;
    stage.dataset.selected = selected || "";
    stage.dataset.hover = preview || "";
  }
  function setPreview(id, pointIndex = null) {
    if (preview !== id || previewPoint !== pointIndex) {
      preview = id;
      previewPoint = pointIndex;
      updateText();
      requestFrame();
    }
  }
  function makePalette() {
    const dark = document.documentElement.dataset.theme === "dark";
    palette = dark ? { ink: "235,238,225", accent: "222,239,82", trace: "204,224,79", shadow: "0,0,0", neutral: 0.22 } : { ink: "33,39,33", accent: "187,204,41", trace: "100,120,25", shadow: "27,33,28", neutral: 0.27 };
    sprites = [false, true].map((accent) => {
      const sprite = document.createElement("canvas");
      sprite.width = 80;
      sprite.height = 80;
      const ctx = sprite.getContext("2d"), color = accent ? palette.accent : palette.ink;
      const shadow = ctx.createRadialGradient(44, 46, 0, 44, 46, 34);
      shadow.addColorStop(0, `rgba(${palette.shadow},${dark ? 0.28 : 0.16})`);
      shadow.addColorStop(1, `rgba(${palette.shadow},0)`);
      ctx.fillStyle = shadow;
      ctx.fillRect(0, 0, 80, 80);
      const sphere = ctx.createRadialGradient(29, 27, 1, 36, 36, 17);
      sphere.addColorStop(0, `rgba(${color},${accent ? 0.84 : dark ? 0.96 : 0.77})`);
      sphere.addColorStop(0.53, `rgba(${color},1)`);
      sphere.addColorStop(1, `rgba(${color},${dark ? 0.75 : 1})`);
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(36, 36, 17, 0, Math.PI * 2);
      ctx.fill();
      return sprite;
    });
    requestFrame();
  }
  // Cache geometry and label anchors on resize, never during an orbit.
  function resize() {
    const rect = stage.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    mobile = width < 780;
    root.dataset.layout = mobile ? "stack" : "side";
    const matrix = root.querySelector(".matrix").getBoundingClientRect();
    frame = getLandingNetworkFrame(width, height, { right: matrix.right - rect.left, bottom: matrix.bottom - rect.top });
    stage.dataset.radius = frame.rx.toFixed(2);
    const ratio = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    anchors = {};
    rows.forEach((row) => {
      const box = row.getBoundingClientRect();
      anchors[row.dataset.item] = { left: box.left - rect.left, right: box.right - rect.left, y: box.top - rect.top + box.height / 2 };
    });
    stage.dataset.points = String(cloud.nodes.length);
    stage.dataset.networks = "1";
    if (sprites.length) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      draw(performance.now());
    }
  }
  function interactionRegion() {
    return { ...frame, rx: frame.rx * 1.015 + 8, ry: frame.ry * 1.015 + 8 };
  }
  function curve(a, b, alpha, active, bend = 0.5) {
    context.strokeStyle = `rgba(${active ? palette.trace : palette.ink},${alpha})`;
    context.lineWidth = active ? 1 : 0.65;
    context.beginPath();
    context.moveTo(a.x, a.y);
    const shift = (b.x - a.x) * bend;
    context.bezierCurveTo(a.x + shift, a.y, b.x - shift, b.y, b.x, b.y);
    context.stroke();
  }
  function draw(time) {
    raf = null;
    if (document.hidden || !inView || !frame) return;
    const dt = Math.min(40, lastTime ? time - lastTime : 16);
    lastTime = time;
    const active = preview || selected;
    const pointIndex = preview ? previewPoint : selectedPoint;
    const state = active + ":" + pointIndex;
    if (state !== highlightState) {
      highlightState = state;
      highlight = getLandingNetworkHighlight(cloud, active, pointIndex);
    }
    // The form drifts as one object. Hold it still while someone explores it.
    const drifting = motion && !reduced.matches && !mouse.inside && !active && !drag;
    if (drifting) visualTime += dt;
    const easing = reduced.matches ? 1 : 1 - Math.exp(-dt / 80);
    yaw += (targetYaw - yaw) * easing;
    pitch += (targetPitch - pitch) * easing;
    const drift = Math.sin(visualTime * 0.00006) * 0.035;
    const fade = reduced.matches ? 1 : 1 - Math.exp(-dt / 140);
    let fading = false;
    const approach = (value, target) => {
      const next = value + (target - value) * fade;
      if (Math.abs(target - next) < 0.002) return target;
      fading = true;
      return next;
    };
    focusAmount = approach(focusAmount, active ? 1 : 0);
    nodeLight.forEach((value, index) => { nodeLight[index] = approach(value, highlight.nodes.has(index) ? 1 : 0); });
    edgeLight.forEach((value, index) => { edgeLight[index] = approach(value, highlight.edges.has(index) ? 1 : 0); });
    context.clearRect(0, 0, width, height);
    projected = cloud.nodes.map((node, index) => ({ ...projectLandingNetworkNode(node, frame, yaw + drift, pitch), index }));
    cloud.edges.forEach(([from, to], index) => {
      const a = projected[from], b = projected[to], light = edgeLight[index];
      const depth = clamp(0.65 + (a.depth + b.depth) * 0.27, 0.18, 1.12);
      context.strokeStyle = "rgba(" + palette.ink + "," + palette.neutral * depth * (1 - focusAmount * 0.45) + ")";
      context.lineWidth = 0.6;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      if (light > 0.002) {
        context.strokeStyle = "rgba(" + palette.trace + "," + light * 0.68 * depth + ")";
        context.lineWidth = 0.9;
        context.stroke();
      }
    });
    // Quiet threads tie labels into the illustration; focused paths strengthen.
    Object.entries(cloud.hubs).forEach(([key, index]) => {
      if (Object.hasOwn(groups, key)) return;
      const hub = projected[index], anchor = anchors[key], light = nodeLight[index];
      if (mobile) {
        const lane = width - 5;
        context.strokeStyle = "rgba(" + palette.ink + ",0.06)";
        context.lineWidth = 0.6;
        context.beginPath();
        context.moveTo(anchor.right + 6, anchor.y);
        context.bezierCurveTo(lane, anchor.y, lane, frame.cy - frame.ry, hub.x, hub.y);
        context.stroke();
        if (light > 0.002) {
          context.strokeStyle = "rgba(" + palette.trace + "," + light * 0.38 + ")";
          context.stroke();
        }
      } else {
        const end = { x: anchor.right + 10, y: anchor.y };
        curve(end, hub, 0.10, false, 0.48);
        if (light > 0.002) curve(end, hub, light * 0.5, true, 0.48);
      }
    });
    const points = [...projected].sort((a, b) => a.depth - b.depth);
    points.forEach((point) => {
      const light = nodeLight[point.index];
      const radius = point.r * point.scale;
      context.globalAlpha = clamp(0.60 + point.depth * 0.35, 0.24, 1) * (1 - focusAmount * 0.24) + light * 0.15;
      if (point.r > 4) {
        const size = radius * 80 / 17;
        context.drawImage(sprites[0], point.x - radius * 36 / 17, point.y - radius * 36 / 17, size, size);
      } else {
        context.fillStyle = "rgb(" + palette.ink + ")";
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      if (light > 0.002) {
        context.globalAlpha = light * 0.92;
        context.fillStyle = "rgb(" + (point.hub ? palette.accent : palette.trace) + ")";
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      if (light > 0.002 && (point.index === pointIndex || point.hub && point.key === active)) {
        context.globalAlpha = light * 0.38;
        context.strokeStyle = "rgb(" + palette.trace + ")";
        context.lineWidth = 0.8;
        context.beginPath();
        context.arc(point.x, point.y, radius + 5, 0, Math.PI * 2);
        context.stroke();
      }
    });
    context.globalAlpha = 1;
    pairs.forEach(([layer, part]) => {
      const from = anchors[layer], to = anchors[part];
      const light = Math.min(nodeLight[cloud.hubs[layer]], nodeLight[cloud.hubs[part]]);
      const a = { x: from.right + 8, y: from.y }, b = { x: to.left - 8, y: to.y };
      curve(a, b, 0.16, false, 0.47);
      if (light > 0.002) curve(a, b, light * 0.7, true, 0.47);
    });
    const viewYaw = yaw.toFixed(3), viewPitch = pitch.toFixed(3);
    if (stage.dataset.yaw !== viewYaw) stage.dataset.yaw = viewYaw;
    if (stage.dataset.pitch !== viewPitch) stage.dataset.pitch = viewPitch;
    if (drifting || fading || Math.abs(targetYaw - yaw) > 5e-4 || Math.abs(targetPitch - pitch) > 5e-4) requestFrame();
  }
  function requestFrame() {
    if (!raf && !document.hidden && inView && width && sprites.length) raf = requestAnimationFrame(draw);
  }
  function nearest(x, y) {
    if (!frame || !containsNetworkPoint({ x, y }, interactionRegion())) return null;
    // Retaining a nearby point prevents flicker between densely spaced neighbours.
    const current = projected[previewPoint];
    if (current && Math.hypot(current.x - x, current.y - y) < Math.max(13, current.r + 7)) return current;
    let closest = null, distance = 19;
    projected.forEach((point) => {
      const d = Math.hypot(point.x - x, point.y - y);
      if (d < distance) { closest = point; distance = d; }
    });
    return closest;
  }
  function position(event) {
    const bounds = stage.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }
  function rotate(dx, dy = 0) {
    targetYaw += dx;
    targetPitch = clamp(targetPitch + dy, -0.85, 0.85);
    requestFrame();
  }
  function resetView() {
    targetYaw = 0.22;
    targetPitch = -0.12;
    mouse.inside = false;
    setPreview(null);
    requestFrame();
  }
  function syncMotion() {
    stage.dataset.motion = String(motion);
    root.querySelector(".key-guide").textContent = reduced.matches ? "Arrows rotate · 0 resets" : motion ? "Arrows rotate · Space pauses" : "Arrows rotate · Space resumes";
    requestFrame();
  }
  rows.forEach((row) => {
    const id = row.dataset.item;
    row.addEventListener("pointerenter", () => setPreview(id));
    row.addEventListener("pointerleave", () => setPreview(null));
    row.addEventListener("focus", () => setPreview(id));
    row.addEventListener("blur", () => setPreview(null));
    row.addEventListener("click", () => {
      selected = selected === id ? null : id;
      selectedPoint = null;
      updateText();
      requestFrame();
    });
  });
  stage.addEventListener("pointermove", (event) => {
    const point = position(event);
    const overNetwork = containsNetworkPoint(point, interactionRegion()) && !event.target.closest("button,a");
    mouse = { ...point, inside: overNetwork };
    stage.classList.toggle("is-over-network", overNetwork);
    if (drag && drag.id === event.pointerId) {
      const dx = point.x - drag.last.x, dy = point.y - drag.last.y;
      rotate(dx * 5e-3, dy * 35e-4);
      drag.last = point;
      drag.distance += Math.hypot(dx, dy);
    } else {
      const row = event.target.closest("[data-item]");
      const hit = overNetwork ? nearest(point.x, point.y) : null;
      setPreview(row ? row.dataset.item : hit?.key || null, row ? null : hit?.index ?? null);
    }
    requestFrame();
  });
  stage.addEventListener("pointerleave", () => {
    if (!drag) {
      mouse.inside = false;
      stage.classList.remove("is-over-network");
      setPreview(null);
      requestFrame();
    }
  });
  stage.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.isPrimary === false || drag || event.target.closest("button,a")) return;
    const point = position(event);
    if (!containsNetworkPoint(point, interactionRegion())) return;
    drag = { id: event.pointerId, start: point, last: point, distance: 0 };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
    stage.dataset.dragging = "true";
    setPreview(null);
  });
  function endDrag(event, cancelled = false) {
    if (!drag || drag.id !== event.pointerId) return;
    const endpoint = position(event);
    const distance = Math.max(drag.distance, Math.hypot(endpoint.x - drag.start.x, endpoint.y - drag.start.y));
    stage.dataset.gesture = cancelled ? "cancelled" : distance < 5 ? "select" : "orbit";
    drag = null;
    stage.classList.remove("is-dragging");
    stage.dataset.dragging = "false";
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (!cancelled && distance < 5) {
      const point = position(event);
      const hit = nearest(point.x, point.y);
      selected = hit?.key || null;
      selectedPoint = hit?.index ?? null;
      updateText();
    }
    requestFrame();
  }
  stage.addEventListener("pointerup", (event) => endDrag(event));
  stage.addEventListener("pointercancel", (event) => endDrag(event, true));
  stage.addEventListener("lostpointercapture", (event) => endDrag(event, true));
  stage.addEventListener("wheel", (event) => {
    if (event.target.closest("[data-item]")) return;
    const rotation = getLandingNetworkWheelRotation(event, position(event), interactionRegion(), height);
    if (!rotation) return;
    event.preventDefault();
    rotate(rotation.yaw, rotation.pitch);
  }, { passive: false });
  stage.addEventListener("keydown", (event) => {
    if (event.target !== stage) return;
    const moves = { ArrowLeft: [-0.2, 0], ArrowRight: [0.2, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] };
    if (moves[event.key]) {
      event.preventDefault();
      rotate(...moves[event.key]);
    }
    if (event.key === "0" || event.key === "Escape") {
      event.preventDefault();
      resetView();
    }
    if (event.key === " ") {
      event.preventDefault();
      if (!event.repeat && !reduced.matches) { motion = !motion; syncMotion(); }
    }
  });
  function updateReducedMotion() {
    if (reduced.matches) motion = false;
    syncMotion();
  }
  reduced.addEventListener("change", updateReducedMotion);
  function updateVisibility() {
    if (document.hidden && raf) {
      cancelAnimationFrame(raf);
      raf = null;
    } else {
      lastTime = 0;
      requestFrame();
    }
  }
  document.addEventListener("visibilitychange", updateVisibility);
  const resizer = new ResizeObserver(resize);
  resizer.observe(stage);
  const themeObserver = new MutationObserver(makePalette);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  // Stop rendering when the illustration is offscreen.
  const visibilityObserver = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    stage.dataset.inView = String(inView);
    if (!inView && raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    if (inView) {
      lastTime = 0;
      requestFrame();
    }
  });
  visibilityObserver.observe(stage);
  makePalette();
  resize();
  updateText();
  syncMotion();
  return {
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      inView = false;
      resizer.disconnect();
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      reduced.removeEventListener("change", updateReducedMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    }
  };
}
export {
  createLandingNetwork,
  getLandingNetworkDetails,
  getLandingNetworkRelations,
  getLandingNetworkWheelRotation,
  getLandingNetworkFrame,
  projectLandingNetworkNode,
  getLandingNetworkHighlight,
  mountLandingNetwork
};

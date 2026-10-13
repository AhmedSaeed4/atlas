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
    for (let i = 0; i < 224; i++) {
      const azimuth = random() * Math.PI * 2;
      const vertical = random() * 2 - 1;
      const radius = Math.cbrt(random());
      const circumference = Math.sqrt(1 - vertical * vertical);
      const y = vertical * radius;
      const key = keys[clamp(Math.floor((y + 1) / 2 * keys.length), 0, keys.length - 1)];
      const prominent = random() > 0.92;
      nodes.push({ x: Math.cos(azimuth) * circumference * radius, y, z: Math.sin(azimuth) * circumference * radius, key, r: prominent ? 5 + random() * 3 : 1.1 + random() * 1.4, phase: random() * Math.PI * 2, hub: false });
    }
    const hubPositions = { interface: [-0.7, -0.48, 0.1], services: [-0.68, 0.03, 0.4], async: [-0.44, 0.67, 0.2], web: [0.44, -0.74, 0.35], api: [0.76, -0.3, 0.2], data: [0.71, 0.07, 0.3], queue: [0.68, 0.49, 0.18], worker: [0.24, 0.78, 0.3] };
    keys.forEach((key) => {
      hubs[key] = nodes.length;
      const [x, y, z] = hubPositions[key];
      nodes.push({ x, y, z, key, r: 5.2 + random() * 2.4, phase: random() * 6, hub: true });
    });
    // Nearest-prior links keep every point in the same connected network.
    const edgeKeys = new Set(), edges = [];
    nodes.forEach((node, source) => {
      const neighbours = nodes.map((other, target) => ({ target, distance: (node.x - other.x) ** 2 + (node.y - other.y) ** 2 + (node.z - other.z) ** 2 })).filter((n) => n.target !== source).sort((a, b) => a.distance - b.distance);
      const links = [...neighbours.slice(0, node.hub ? 6 : 4), ...source ? [neighbours.find((n) => n.target < source)] : []];
      links.forEach(({ target }) => {
        const from = Math.min(source, target), to = Math.max(source, target), key = `${from}:${to}`;
        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push([from, to]);
        }
      });
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
  const clouds = [createLandingNetwork()];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let inView = true;
  let width = 0, height = 0, mobile = false, networkCenterX = 0, networkRadiusX = 0, readingZones = [], anchors = {}, palette = {}, sprites = [];
  let selected = null, preview = null, motion = !reduced.matches;
  let yaw = 0.22, pitch = -0.12, targetYaw = yaw, targetPitch = pitch, mouseX = 0, mouseY = 0;
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
  function setPreview(id) {
    if (preview !== id) {
      preview = id;
      updateText();
      requestFrame();
    }
  }
  function makePalette() {
    const dark = document.documentElement.dataset.theme === "dark";
    palette = dark ? { ink: "235,238,225", accent: "222,239,82", shadow: "0,0,0", edge: 0.23, dim: 0.075, neutral: 0.16 } : { ink: "33,39,33", accent: "195,211,44", shadow: "27,33,28", edge: 0.29, dim: 0.08, neutral: 0.19 };
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
  // Measure on resize only; animation uses cached label anchors.
  function resize() {
    mobile = stage.clientWidth < 720;
    const layout = mobile ? "stack" : "side";
    if (root.dataset.layout !== layout) root.dataset.layout = layout;
    const rect = stage.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const matrixBounds = root.querySelector(".matrix").getBoundingClientRect();
    const networkLeft = matrixBounds.right - rect.left + (width < 900 ? 22 : 40);
    const networkRoom = width - networkLeft - 14;
    networkCenterX = mobile ? width * 0.5 : networkLeft + networkRoom / 2;
    networkRadiusX = Math.max(45, Math.min(networkRoom * 0.47, height * 0.48));
    readingZones = [...root.querySelectorAll(".column")].map((column) => {
      const box = column.getBoundingClientRect();
      return { x: box.left - rect.left - 7, y: box.top - rect.top - 5, w: box.width + 14, h: box.height + 10 };
    });
    const ratio = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    anchors = {};
    rows.forEach((row) => {
      const bounds = row.getBoundingClientRect();
      anchors[row.dataset.item] = { left: bounds.left - rect.left, right: bounds.right - rect.left, y: bounds.top - rect.top + bounds.height / 2 };
    });
    stage.dataset.points = String(clouds.reduce((sum, cloud) => sum + cloud.nodes.length, 0));
    stage.dataset.networks = String(clouds.length);
    if (sprites.length) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      draw(performance.now());
    }
  }
  function geometry() {
    if (mobile) {
      if (width < 520) return { cx: width * 0.5, cy: 407, rx: width * 0.445, ry: 108 };
      return { cx: width * 0.5, cy: (305 + height - 64) / 2, rx: Math.min(width * 0.445, 225), ry: Math.min(185, (height - 369) * 0.475) };
    }
    return { cx: networkCenterX, cy: height * 0.49, rx: networkRadiusX, ry: Math.min(230, height * 0.4) };
  }
  function interactionRegion() {
    const shape = geometry();
    // Include projected edge dots and their small radii, without a rectangular hit area.
    return { ...shape, rx: shape.rx * 1.04 + 8, ry: shape.ry * 1.04 + 8 };
  }
  function project(node, shape, index, tiltYaw, tiltPitch) {
    const turn = tiltYaw, ct = Math.cos(turn), st = Math.sin(turn), cp = Math.cos(tiltPitch), sp = Math.sin(tiltPitch);
    const x = node.x * ct + node.z * st, z = node.z * ct - node.x * st;
    const y = node.y * cp - z * sp, depth = node.y * sp + z * cp;
    const perspective = 3.9 / (3.9 - depth);
    let px = shape.cx + x * shape.rx * perspective, py = shape.cy + y * shape.ry * perspective;
    if (motion && !reduced.matches) {
      px += Math.sin(visualTime * 23e-5 + node.phase) * 1.8;
      py += Math.cos(visualTime * 19e-5 + node.phase) * 1.4;
    }
    if (mouse.inside && !drag && !reduced.matches) {
      const dx = mouse.x - px, dy = mouse.y - py, distance = Math.hypot(dx, dy);
      const attraction = Math.exp(-(distance * distance) / 11500) * 7;
      px += dx / (distance + 24) * attraction;
      py += dy / (distance + 24) * attraction;
    }
    return { ...node, x: px, y: py, depth, scale: perspective };
  }
  function curve(a, b, alpha, active, bend = 0.5) {
    context.strokeStyle = `rgba(${active ? palette.accent : palette.ink},${alpha})`;
    context.lineWidth = active ? 1 : 0.65;
    context.beginPath();
    context.moveTo(a.x, a.y);
    const shift = (b.x - a.x) * bend;
    context.bezierCurveTo(a.x + shift, a.y, b.x - shift, b.y, b.x, b.y);
    context.stroke();
  }
  function draw(time) {
    raf = null;
    if (document.hidden || !inView) return;
    const dt = Math.min(40, lastTime ? time - lastTime : 16);
    lastTime = time;
    if (motion && !reduced.matches) visualTime += dt;
    const easing = reduced.matches ? 1 : 1 - Math.exp(-dt / 80);
    yaw += (targetYaw - yaw) * easing;
    pitch += (targetPitch - pitch) * easing;
    const active = preview || selected, connected = getLandingNetworkRelations(active);
    const drift = motion && !reduced.matches ? Math.sin(visualTime * 11e-5) * 0.035 : 0;
    const hoverYaw = mouse.inside && motion && !reduced.matches && !drag ? mouseX * 0.055 : 0;
    const hoverPitch = mouse.inside && motion && !reduced.matches && !drag ? mouseY * 0.035 : 0;
    context.clearRect(0, 0, width, height);
    projected = clouds.map((cloud, index) => {
      const shape = geometry(index);
      return cloud.nodes.map((node) => project(node, shape, index, yaw + drift + hoverYaw, pitch + hoverPitch));
    });
    clouds.forEach((cloud, index) => {
      const points2 = projected[index];
      cloud.edges.forEach(([source, target]) => {
        const a = points2[source], b = points2[target], emphasized = connected.has(a.key) && connected.has(b.key);
        const depth = clamp(0.72 + (a.depth + b.depth) * 0.16, 0.38, 1.1);
        context.strokeStyle = `rgba(${palette.ink},${(active ? emphasized ? palette.edge : palette.dim : palette.neutral) * depth})`;
        context.lineWidth = emphasized ? 0.7 : 0.55;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      });
      Object.entries(cloud.hubs).forEach(([key, nodeIndex]) => {
        const hub = points2[nodeIndex], anchor = anchors[key];
        if (!anchor || Object.hasOwn(groups, key)) return;
        const isPart = !Object.hasOwn(groups, key);
        const end = { x: isPart ? anchor.right + 9 : anchor.left - 9, y: anchor.y };
        if (mobile) {
          const lane = isPart ? width - 2 : 2;
          context.strokeStyle = `rgba(${connected.has(key) ? palette.accent : palette.ink},${connected.has(key) ? 0.55 : 0.16})`;
          context.lineWidth = connected.has(key) ? 0.9 : 0.6;
          context.beginPath();
          context.moveTo(hub.x, hub.y);
          context.bezierCurveTo(lane, hub.y, lane, anchor.y, lane, anchor.y);
          context.stroke();
        } else curve(hub, end, connected.has(key) ? 0.63 : 0.18, connected.has(key), 0.48);
      });
    });
    const points = projected.flat().sort((a, b) => a.depth - b.depth);
    points.forEach((point) => {
      const emphasized = connected.has(point.key), alpha = active ? emphasized ? 0.95 : 0.55 : 0.84;
      const radius = point.r * point.scale;
      context.globalAlpha = alpha * clamp(0.83 + point.depth * 0.2, 0.45, 1);
      if (point.r > 4) {
        const size = radius * 80 / 17;
        context.drawImage(sprites[point.hub && emphasized ? 1 : 0], point.x - radius * 36 / 17, point.y - radius * 36 / 17, size, size);
      } else {
        context.fillStyle = `rgb(${point.hub && emphasized ? palette.accent : palette.ink})`;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      if (point.hub && point.key === active) {
        context.globalAlpha = 0.4;
        context.strokeStyle = `rgb(${palette.accent})`;
        context.lineWidth = 0.8;
        context.beginPath();
        context.arc(point.x, point.y, radius + 4, 0, Math.PI * 2);
        context.stroke();
      }
    });
    context.globalAlpha = 1;
    context.save();
    // Clear behind the fixed reading columns without boxing in the mesh.
    context.globalCompositeOperation = "destination-out";
    context.filter = "blur(10px)";
    context.fillStyle = "#000";
    readingZones.forEach((zone) => context.fillRect(zone.x - 9, zone.y - 9, zone.w + 18, zone.h + 18));
    context.restore();
    pairs.forEach(([layer, part]) => {
      const from = anchors[layer], to = anchors[part];
      const emphasized = connected.has(layer) && connected.has(part);
      curve({ x: from.right + 8, y: from.y }, { x: to.left - 8, y: to.y }, emphasized ? 0.85 : 0.2, emphasized, 0.47);
    });
    const viewYaw = yaw.toFixed(3), viewPitch = pitch.toFixed(3);
    if (stage.dataset.yaw !== viewYaw) stage.dataset.yaw = viewYaw;
    if (stage.dataset.pitch !== viewPitch) stage.dataset.pitch = viewPitch;
    if (motion && !reduced.matches || Math.abs(targetYaw - yaw) > 5e-4 || Math.abs(targetPitch - pitch) > 5e-4) requestFrame();
  }
  function requestFrame() {
    if (!raf && !document.hidden && inView && width && sprites.length) raf = requestAnimationFrame(draw);
  }
  function nearest(x, y) {
    let closest = null, distance = 24;
    projected.flat().forEach((point) => {
      if (readingZones.some((zone) => point.x >= zone.x && point.x <= zone.x + zone.w && point.y >= zone.y && point.y <= zone.y + zone.h)) return;
      const d = Math.hypot(point.x - x, point.y - y);
      if (d < distance) {
        closest = point;
        distance = d;
      }
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
      updateText();
      requestFrame();
    });
  });
  stage.addEventListener("pointermove", (event) => {
    const point = position(event);
    const overNetwork = containsNetworkPoint(point, interactionRegion()) && !event.target.closest("button,a");
    mouse = { ...point, inside: overNetwork };
    stage.classList.toggle("is-over-network", overNetwork);
    mouseX = (point.x / width - 0.5) * 2;
    mouseY = (point.y / height - 0.5) * 2;
    if (drag && drag.id === event.pointerId) {
      const dx = point.x - drag.last.x, dy = point.y - drag.last.y;
      rotate(dx * 5e-3, dy * 35e-4);
      drag.last = point;
      drag.distance += Math.hypot(dx, dy);
    } else {
      const row = event.target.closest("[data-item]");
      setPreview(row ? row.dataset.item : event.target.closest("button") ? null : nearest(point.x, point.y)?.key || null);
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
    if (event.button !== 0 || event.target.closest("button,a")) return;
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
      selected = nearest(point.x, point.y)?.key || null;
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
  mountLandingNetwork
};

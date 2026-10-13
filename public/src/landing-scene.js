const HOME = { yaw: -.80, pitch: .60 };
const DEFAULT_LABEL = "Your code. A clearer picture.";
const LABELS = {
  interface: "Start with the code already in your project.",
  architecture: "See the parts. Follow the connections.",
  repository: "Ground every component in repository evidence.",
  agent: "Your coding agent connects the pieces.",
  share: "Keep an editable map you can explore."
};
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function createLandingScene() {
  const upright = { u: { x: 1, y: 0, z: 0 }, v: { x: 0, y: -1, z: 0 } };
  const flat = { u: { x: 1, y: 0, z: 0 }, v: { x: 0, y: 0, z: 1 } };
  return [
    { id: "interface", o: { x: -.53, y: 2.65, z: -1.23 }, w: 2.12, h: 1.84, ...structuredClone(upright) },
    { id: "architecture", o: { x: -1.09, y: 2.04, z: -.48 }, w: 2.40, h: 1.52, ...structuredClone(upright) },
    { id: "repository", o: { x: -2.14, y: .30, z: -.73 }, w: 1.36, h: .82, ...structuredClone(flat) },
    { id: "agent", o: { x: -2.17, y: .09, z: -.13 }, w: 1.49, h: .98, ...structuredClone(flat) },
    { id: "share", o: { x: .67, y: .12, z: .58 }, w: 1.45, h: .97, ...structuredClone(flat) },
  ];
}

export function projectScenePoint(point, camera = HOME) {
  if (!point || ![point.x, point.y, point.z, camera.yaw, camera.pitch].every(Number.isFinite)) return null;
  const cy = Math.cos(camera.yaw), sy = Math.sin(camera.yaw), cp = Math.cos(camera.pitch), sp = Math.sin(camera.pitch);
  const x = point.x * cy + point.z * sy;
  const z = -point.x * sy + point.z * cy;
  const y = point.y * cp - z * sp;
  const depth = point.y * sp + z * cp;
  if (depth >= 23.6) return null;
  // Weak perspective keeps the reference's isometric linework while preserving depth.
  const perspective = 24 / (24 - depth);
  return { x: x * perspective, y: -y * perspective, depth, perspective };
}

export function orbitSceneCamera(camera, dx, dy) {
  if (![camera?.yaw, camera?.pitch, dx, dy].every(Number.isFinite)) return { ...HOME };
  const yaw = camera.yaw + clamp(dx, -1000, 1000) * .006;
  return { yaw: Math.atan2(Math.sin(yaw), Math.cos(yaw)), pitch: clamp(camera.pitch + clamp(dy, -1000, 1000) * .004, .18, 1.15) };
}

export function easeSceneCamera(current, target, amount = .16) {
  const step = Math.atan2(Math.sin(target.yaw - current.yaw), Math.cos(target.yaw - current.yaw)) * amount;
  return { yaw: Math.atan2(Math.sin(current.yaw + step), Math.cos(current.yaw + step)), pitch: current.pitch + (target.pitch - current.pitch) * amount };
}

// Frame-rate independent damping, with a bounded first frame after resuming.
export function sceneMotionStep(elapsed = 1000 / 60) {
  return 1 - Math.exp(-clamp(Number.isFinite(elapsed) ? elapsed : 1000 / 60, 0, 64) / 88);
}

export function scenePolygonContains(point, polygon) {
  if (!point || ![point.x, point.y].every(Number.isFinite) || !Array.isArray(polygon) || polygon.length < 3 || polygon.some(p => !p || ![p.x, p.y].every(Number.isFinite))) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export function mountLandingScene(root) {
  if (!root || root.dataset.mounted === "true") return;
  const canvas = root.querySelector("canvas"), ctx = canvas?.getContext("2d");
  if (!ctx) return;
  root.dataset.mounted = "true";
  const stage = root.querySelector(".scene-stage");
  const caption = root.querySelector("[data-scene-label]");
  const panels = createLandingScene();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const lifts = Object.fromEntries(panels.map(panel => [panel.id, 0]));
  let w = 0, h = 0, dpr = 1, scale = 1, offset = { x: 0, y: 0 }, palette = {}, raf = 0, visible = true;
  let base = { ...HOME }, current = { ...HOME }, hover = { x: 0, y: 0 }, active = null, hits = [], gesture = null;
  let lastFrame = 0, pulseStart = -Infinity, now = 0;
  const pointOn = (panel, x, y) => ({ x: panel.o.x + panel.u.x * x + panel.v.x * y, y: panel.o.y + panel.u.y * x + panel.v.y * y, z: panel.o.z + panel.u.z * x + panel.v.z * y });
  const corners = panel => [[0, 0], [panel.w, 0], [panel.w, panel.h], [0, panel.h]].map(([x, y]) => pointOn(panel, x, y));
  const screen = point => {
    const p = projectScenePoint(point, current);
    return p ? { x: offset.x + p.x * scale, y: offset.y + p.y * scale, depth: p.depth } : null;
  };
  const local = (panel, x, y) => screen(pointOn(panel, x, y));

  function line(points, color = palette.ink, alpha = 1, width = .8, close = false, fill = null) {
    const projected = points.map(screen);
    if (projected.some(p => !p)) return;
    ctx.beginPath();
    projected.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    if (close) ctx.closePath();
    // Opaque surfaces hide their contents correctly when windows overlap.
    if (fill) { ctx.fillStyle = fill; ctx.globalAlpha = 1; ctx.fill(); }
    if (color) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = alpha; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function planeLine(panel, points, color = palette.ink, alpha = .65, width = .65) {
    line(points.map(([x, y]) => pointOn(panel, x, y)), color, alpha, width);
  }
  function box(panel, x, y, bw, bh, r = .035, fill = null, color = palette.ink, alpha = .82, width = .75) {
    const points = [];
    for (const [cx, cy, start] of [[x + bw - r, y + r, -Math.PI / 2], [x + bw - r, y + bh - r, 0], [x + r, y + bh - r, Math.PI / 2], [x + r, y + r, Math.PI]]) {
      for (let i = 0; i <= 6; i++) {
        const angle = start + i * Math.PI / 12;
        points.push(pointOn(panel, cx + r * Math.cos(angle), cy + r * Math.sin(angle)));
      }
    }
    line(points, color, alpha, width, true, fill);
  }
  function circle(panel, x, y, r, color = palette.ink, alpha = .75, fill = null) {
    line(Array.from({ length: 24 }, (_, i) => pointOn(panel, x + Math.cos(i * Math.PI / 12) * r, y + Math.sin(i * Math.PI / 12) * r)), color, alpha, .65, true, fill);
  }
  function text(panel, x, y, value, size = .075, color = palette.quiet, weight = 400) {
    const p = local(panel, x, y), u = local(panel, x + .01, y), v = local(panel, x, y + .01);
    if (!p || !u || !v) return;
    ctx.save();
    ctx.transform((u.x - p.x) / .01, (u.y - p.y) / .01, (v.x - p.x) / .01, (v.y - p.y) / .01, p.x, p.y);
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
    ctx.fillText(value, 0, 0);
    ctx.restore();
  }
  function surface(panel, top = palette.paper, bottom = palette.paperShade) {
    const a = local(panel, 0, 0), b = local(panel, panel.w, panel.h);
    const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    gradient.addColorStop(0, top); gradient.addColorStop(1, bottom);
    return gradient;
  }
  function bezier(points, t) {
    const [a, b, c, d] = points, s = 1 - t;
    return Object.fromEntries(["x", "y", "z"].map(key => [key, s * s * s * a[key] + 3 * s * s * t * b[key] + 3 * s * t * t * c[key] + t * t * t * d[key]]));
  }
  function connection(points, selected) {
    const path = Array.from({ length: 38 }, (_, i) => bezier(points, i / 37));
    line(path, selected ? palette.accentInk : palette.quiet, selected ? .85 : .62, selected ? 1.05 : .8);
    // A single short traversal acknowledges a newly hovered window, then settles.
    const progress = (now - pulseStart) / 1100;
    if (selected && !reduced.matches && progress >= 0 && progress < 1) {
      const p = screen(bezier(points, progress));
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);
      ctx.fillStyle = palette.accent; ctx.fill();
    }
    const p = screen(points[3]);
    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = selected ? palette.accent : palette.paper; ctx.fill();
    ctx.strokeStyle = palette.quiet; ctx.lineWidth = .65; ctx.stroke();
  }

  function drawPanel(panel) {
    const selected = active === panel.id;
    const isMap = panel.id === "architecture";
    const edge = isMap || selected ? palette.ink : palette.quiet;
    const back = { ...panel, o: { ...panel.o, y: panel.o.y - (panel.v.z ? .037 : 0), z: panel.o.z - (panel.v.y ? .037 : 0) } };
    box(back, 0, 0, panel.w, panel.h, .045, palette.edge, palette.quiet, .65, .65);
    box(panel, 0, 0, panel.w, panel.h, .045, surface(panel), edge, selected ? .95 : .78, isMap ? 1.05 : .8);
    planeLine(panel, [[0, .20], [panel.w, .20]], edge, .35, .65);
    [.10, .19, .28].forEach(x => circle(panel, x, .10, .021, palette.quiet, .65));
    circle(panel, panel.w - .12, .10, .022, null, 1, isMap || selected ? palette.accent : palette.edge);

    if (panel.id === "interface") {
      text(panel, .43, .126, "project / src", .080, palette.ink);
      box(panel, .085, .27, .49, 1.45, .025, palette.inset, null);
      text(panel, .14, .39, "FILES", .057);
      ["app.ts", "api.ts", "store.ts", "jobs.ts"].forEach((name, i) => {
        const y = .55 + i * .23;
        if (i === 1) box(panel, .12, y - .10, .42, .16, .018, palette.softAccent, null);
        text(panel, .16, y, name, .058, i === 1 ? palette.accentInk : palette.quiet);
      });
      text(panel, .68, .38, "api.ts", .077, palette.ink);
      planeLine(panel, [[.66, .46], [1.98, .46]], palette.quiet, .24, .6);
      const rows = [[.72, .50, .21], [.84, .66, .24], [.95, .42, .34], [.84, .72, .14], [.72, .20, .10], [.72, .52, .23], [.84, .74, .14], [.95, .29, .38], [.84, .51, .22], [.72, .22, .10]];
      rows.forEach(([x, length, accent], i) => {
        const y = .60 + i * .105;
        text(panel, .65, y + .02, String(i + 1).padStart(2, "0"), .049);
        planeLine(panel, [[x + .09, y], [x + .09 + accent, y]], i === 2 || i === 6 ? palette.accentInk : palette.ink, .66, 1.3);
        planeLine(panel, [[x + .13 + accent, y], [x + .16 + length, y]], palette.quiet, .40, 1.0);
      });
    } else if (isMap) {
      text(panel, .43, .126, "ATLAS / architecture", .075, palette.ink, 500);
      box(panel, .07, .28, .26, 1.12, .023, palette.inset, null);
      for (let i = 0; i < 4; i++) {
        if (i === 0) box(panel, .11, .37, .18, .17, .025, palette.softAccent, null);
        planeLine(panel, [[.15, .45 + i * .23], [.25, .45 + i * .23]], i ? palette.quiet : palette.accentInk, .75, .9);
      }
      for (let x = .43; x < 2.33; x += .12) for (let y = .32; y < 1.4; y += .12) {
        const p = local(panel, x, y); ctx.fillStyle = palette.quiet; ctx.globalAlpha = .19;
        ctx.fillRect(p.x, p.y, .6, .6); ctx.globalAlpha = 1;
      }
      const nodes = [[.46, .55, "Client"], [1.13, .42, "API"], [1.80, .42, "Store"], [1.13, 1.01, "Queue"], [1.80, 1.01, "Worker"]];
      const route = points => planeLine(panel, points, palette.accentInk, .78, .85);
      route([[.93, .695], [1.03, .695], [1.03, .565], [1.13, .565]]);
      route([[1.60, .565], [1.80, .565]]);
      route([[1.365, .71], [1.365, 1.01]]);
      route([[1.60, 1.155], [1.80, 1.155]]);
      nodes.forEach(([x, y, label], i) => {
        box(panel, x, y, .47, .29, .035, i === 1 ? palette.softAccent : palette.paper, i === 1 ? palette.accentInk : palette.quiet, .84, .65);
        text(panel, x + .055, y + .18, label, .074, palette.ink, 500);
        circle(panel, x, y + .145, .015, palette.quiet, .9, palette.paper);
        circle(panel, x + .47, y + .145, .015, palette.quiet, .9, palette.paper);
      });
    } else if (panel.id === "repository") {
      text(panel, .41, .126, "evidence", .078, palette.ink);
      text(panel, .15, .40, "</>", .17, palette.ink, 500);
      for (let i = 0; i < 4; i++) {
        planeLine(panel, [[.57, .32 + i * .10], [1.17 - (i % 2) * .14, .32 + i * .10]], palette.quiet, .50, .8);
      }
      planeLine(panel, [[.15, .64], [.45, .64]], palette.accentInk, .8, 1.5);
    } else if (panel.id === "agent") {
      text(panel, .41, .126, "agent / inspect", .074, palette.ink);
      box(panel, .13, .30, .34, .36, .04, palette.inset, null);
      planeLine(panel, [[.22, .39], [.31, .48], [.22, .56]], palette.ink, .8, 1.1);
      planeLine(panel, [[.33, .57], [.40, .57]], palette.accentInk, .9, 1.1);
      text(panel, .60, .41, "Read the code.", .070, palette.ink);
      text(panel, .60, .56, "Trace the system.", .059, palette.quiet);
      planeLine(panel, [[.15, .78], [1.30, .78]], palette.quiet, .28, .65);
      circle(panel, .19, .85, .024, null, 1, palette.accent);
      text(panel, .27, .87, "repository \u2192 map", .060, palette.quiet);
    } else {
      text(panel, .41, .126, "architecture.json", .073, palette.ink);
      const points = [[.28, .47], [.66, .36], [1.08, .47], [.66, .75]];
      [[0, 1], [1, 2], [1, 3], [3, 2]].forEach(([a, b]) => planeLine(panel, [points[a], points[b]], palette.quiet, .7, .8));
      points.forEach(([x, y], i) => circle(panel, x, y, i === 1 ? .06 : .035, i === 1 ? palette.accentInk : palette.quiet, .85, i === 1 ? palette.accent : palette.paper));
    }
  }

  function cube(x, y, z, cw, ch, cd, accent = false) {
    const p = (dx, dy, dz) => ({ x: x + dx, y: y + dy, z: z + dz });
    const front = accent ? palette.accent : palette.paper;
    const side = accent ? palette.accentSide : palette.edge;
    const top = accent ? palette.accentTop : palette.paper;
    return [
      { points: [p(0, 0, cd), p(cw, 0, cd), p(cw, ch, cd), p(0, ch, cd)], normal: [0, 0, 1], fill: front },
      { points: [p(cw, 0, 0), p(0, 0, 0), p(0, ch, 0), p(cw, ch, 0)], normal: [0, 0, -1], fill: front },
      { points: [p(cw, 0, 0), p(cw, 0, cd), p(cw, ch, cd), p(cw, ch, 0)], normal: [1, 0, 0], fill: side },
      { points: [p(0, 0, cd), p(0, 0, 0), p(0, ch, 0), p(0, ch, cd)], normal: [-1, 0, 0], fill: side },
      { points: [p(0, ch, 0), p(cw, ch, 0), p(cw, ch, cd), p(0, ch, cd)], normal: [0, 1, 0], fill: top },
    ].filter(face => {
      const [nx, ny, nz] = face.normal;
      return nx * -Math.sin(current.yaw) * Math.cos(current.pitch) + ny * Math.sin(current.pitch) + nz * Math.cos(current.yaw) * Math.cos(current.pitch) > 0;
    });
  }
  function shadow(points, opacity, blur = 8) {
    ctx.save(); ctx.shadowColor = palette.shadow; ctx.shadowBlur = blur; ctx.shadowOffsetY = 4;
    const projected = points.map(screen);
    ctx.beginPath(); projected.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
    ctx.fillStyle = palette.shadow; ctx.globalAlpha = opacity; ctx.fill(); ctx.restore();
  }
  function render() {
    if (!w || !h) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.lineJoin = "round"; ctx.lineCap = "round";
    hits = [];
    ctx.setLineDash([2, 5]);
    for (let i = -6; i <= 6; i++) {
      const t = i * .38;
      // Segmented falloff leaves the composition open at its edges.
      for (let j = -5; j < 5; j++) {
        const alpha = .20 * (1 - Math.abs(i) / 7) * (1 - Math.abs(j + .5) / 6);
        line([{ x: t, y: -.1, z: j * .35 }, { x: t, y: -.1, z: (j + 1) * .35 }], palette.quiet, alpha, .6);
        line([{ x: j * .43, y: -.1, z: t * .72 }, { x: (j + 1) * .43, y: -.1, z: t * .72 }], palette.quiet, alpha, .6);
      }
    }
    ctx.setLineDash([]);
    for (const panel of panels.filter(p => p.v.z)) shadow(corners(panel).map(p => ({ x: p.x + .08, y: -.087, z: p.z + .07 })), .10, 7);
    shadow([{ x: -.42, y: -.09, z: .32 }, { x: .56, y: -.09, z: .32 }, { x: .56, y: -.09, z: 1.16 }, { x: -.42, y: -.09, z: 1.16 }], .17, 12);
    const center = { x: .06, y: .02, z: .72 };
    connection([{ x: -.68, y: .09 + lifts.agent, z: .50 }, { x: -.48, y: .03, z: .53 }, { x: -.53, y: .02, z: 1.05 }, center], active === "agent" || active === "repository");
    connection([center, { x: .09, y: .02, z: .07 }, { x: .02, y: .05, z: -.48 }, { x: .02, y: .52 + lifts.architecture, z: -.48 }], active === "architecture" || active === "interface");
    connection([center, { x: .05, y: .02, z: 1.39 }, { x: .40, y: .02, z: 1.34 }, { x: .67, y: .12 + lifts.share, z: 1.10 }], active === "share");
    const posed = panels.map(panel => ({ ...panel, o: { ...panel.o, y: panel.o.y + lifts[panel.id] } }));
    const objects = posed.map(panel => ({
      panel,
      depth: panel.v.y ? projectScenePoint({ x: 0, y: 0, z: panel.o.z }, current).depth : corners(panel).reduce((sum, p) => sum + projectScenePoint(p, current).depth, 0) / 4
    }));
    const faces = [...cube(-.43, -.01, .25, .90, .09, .80), ...cube(-.43, .14, .25, .90, .11, .80)];
    for (let row = 0; row < 2; row++) for (let col = 0; col < 2; col++) faces.push(...cube(-.30 + col * .35, .32 + row * .35, .53, .28, .28, .16, true));
    faces.forEach(face => objects.push({ ...face, depth: face.points.reduce((sum, p) => sum + projectScenePoint(p, current).depth, 0) / 4 }));
    objects.sort((a, b) => a.depth - b.depth).forEach(object => {
      if (object.panel) {
        drawPanel(object.panel); hits.push({ id: object.panel.id, polygon: corners(object.panel).map(screen) });
      } else line(object.points, palette.ink, .52, .7, true, object.fill);
    });
    root.dataset.yaw = current.yaw.toFixed(3); root.dataset.pitch = current.pitch.toFixed(3); root.dataset.active = active || "";
  }
  function setActive(id) {
    if (active === id) return;
    active = id;
    pulseStart = reduced.matches ? -Infinity : performance.now();
    caption.textContent = LABELS[active] || DEFAULT_LABEL;
  }
  function frame(timestamp) {
    raf = 0;
    if (!visible || document.hidden) return;
    now = timestamp;
    const easing = reduced.matches ? 1 : sceneMotionStep(lastFrame ? timestamp - lastFrame : 1000 / 60);
    lastFrame = timestamp;
    const target = { yaw: base.yaw + hover.x, pitch: clamp(base.pitch + hover.y, .18, 1.15) };
    current = easeSceneCamera(current, target, easing);
    let moving = Math.abs(Math.atan2(Math.sin(target.yaw - current.yaw), Math.cos(target.yaw - current.yaw))) + Math.abs(current.pitch - target.pitch) > .0005;
    for (const panel of panels) {
      const lift = active === panel.id && !reduced.matches ? .075 : 0;
      lifts[panel.id] += (lift - lifts[panel.id]) * easing;
      moving ||= Math.abs(lift - lifts[panel.id]) > .0003;
    }
    render();
    if (moving || (active && !reduced.matches && now - pulseStart < 1100)) requestFrame();
    else lastFrame = 0;
  }
  function requestFrame() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }
  function resize() {
    const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height; dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const styles = getComputedStyle(root);
    const color = name => styles.getPropertyValue(name).trim();
    palette = {
      ink: color("--landing-ink"), quiet: color("--landing-quiet"), accent: color("--landing-accent"),
      paper: color("--scene-paper"), paperShade: color("--scene-paper-shade"), edge: color("--scene-edge"),
      inset: color("--scene-inset"), softAccent: color("--scene-soft-accent"), accentInk: color("--scene-accent-ink"),
      accentSide: color("--scene-accent-side"), accentTop: color("--scene-accent-top"), shadow: color("--scene-shadow")
    };
    const boundary = panels.flatMap(corners).map(p => projectScenePoint(p, HOME));
    const minX = Math.min(...boundary.map(p => p.x)), maxX = Math.max(...boundary.map(p => p.x)), minY = Math.min(...boundary.map(p => p.y)), maxY = Math.max(...boundary.map(p => p.y));
    scale = Math.max(1, Math.min((w - 28) / (maxX - minX), (h - 38) / (maxY - minY)));
    offset = { x: w / 2 - (minX + maxX) * scale / 2, y: h / 2 - (minY + maxY) * scale / 2 };
    render(); requestFrame();
  }
  const pointer = event => { const r = canvas.getBoundingClientRect(); return { x: event.clientX - r.left, y: event.clientY - r.top }; };
  canvas.addEventListener("pointermove", event => {
    if (!event.isPrimary || (gesture && event.pointerId !== gesture.id)) return;
    const p = pointer(event);
    if (gesture) {
      const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
      if (!gesture.dragging && Math.hypot(dx, dy) > 7) {
        if (event.pointerType === "touch" && Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
        gesture.dragging = true; canvas.setPointerCapture(event.pointerId); root.classList.add("is-dragging"); setActive(null);
      }
      if (gesture.dragging) {
        base = orbitSceneCamera(gesture.camera, dx, dy); hover = { x: 0, y: 0 }; root.dataset.gesture = "orbit"; requestFrame(); return;
      }
    }
    if (event.pointerType === "touch") return;
    setActive([...hits].reverse().find(hit => scenePolygonContains(p, hit.polygon))?.id || null);
    hover = reduced.matches ? { x: 0, y: 0 } : { x: (p.x / w - .5) * .11, y: (p.y / h - .5) * .075 };
    requestFrame();
  });
  canvas.addEventListener("pointerdown", event => {
    if (event.button !== 0 || !event.isPrimary) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, camera: { ...current }, dragging: false };
    root.dataset.gesture = ""; stage.dataset.pointerFocus = "true"; stage.focus({ preventScroll: true });
  });
  function finish(event) {
    if (gesture && event.pointerId !== gesture.id) return;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    gesture = null; root.classList.remove("is-dragging");
  }
  canvas.addEventListener("pointerup", finish); canvas.addEventListener("pointercancel", finish); canvas.addEventListener("lostpointercapture", finish);
  canvas.addEventListener("pointerleave", () => {
    if (gesture?.dragging) return;
    gesture = null; setActive(null); hover = { x: 0, y: 0 }; requestFrame();
  });
  stage.addEventListener("blur", () => { delete stage.dataset.pointerFocus; });
  root.addEventListener("keydown", event => {
    delete stage.dataset.pointerFocus;
    const changes = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -14], ArrowDown: [0, 14] };
    if (changes[event.key]) {
      event.preventDefault(); base = orbitSceneCamera(base, ...changes[event.key]); hover = { x: 0, y: 0 }; setActive(null); requestFrame();
    } else if (event.key === "Escape" || event.key === "0") {
      event.preventDefault(); base = { ...HOME }; hover = { x: 0, y: 0 }; setActive(null); requestFrame();
    }
  });
  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(resize).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  function stopFrame() { if (raf) cancelAnimationFrame(raf); raf = 0; lastFrame = 0; }
  new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (!visible) stopFrame(); else requestFrame();
  }).observe(root);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopFrame(); else requestFrame(); });
  reduced.addEventListener("change", () => { hover = { x: 0, y: 0 }; pulseStart = -Infinity; requestFrame(); });
  caption.textContent = DEFAULT_LABEL;
  resize();
}

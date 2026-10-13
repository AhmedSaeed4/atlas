const HOME = { yaw: -.80, pitch: .60 };
const LABELS = { interface: "Web interface", architecture: "Architecture map", repository: "Repository evidence", agent: "Agent instructions", share: "Shared view" };
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function createLandingScene() {
  const upright = { u: { x: 1, y: 0, z: 0 }, v: { x: 0, y: -1, z: 0 } };
  const flat = { u: { x: 1, y: 0, z: 0 }, v: { x: 0, y: 0, z: 1 } };
  return [
    { id: "interface", o: { x: -.85, y: 2.45, z: -1.12 }, w: 2.05, h: 1.94, ...structuredClone(upright) },
    { id: "architecture", o: { x: -1.12, y: 1.90, z: -.59 }, w: 1.82, h: 1.44, ...structuredClone(upright) },
    { id: "repository", o: { x: -2.03, y: .24, z: -.65 }, w: 1.32, h: .90, ...structuredClone(flat) },
    { id: "agent", o: { x: -2.05, y: .06, z: -.12 }, w: 1.48, h: 1.08, ...structuredClone(flat) },
    { id: "share", o: { x: .48, y: .10, z: .40 }, w: 1.65, h: 1.04, ...structuredClone(flat) },
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
  const caption = root.querySelector("[data-scene-label]");
  const panels = createLandingScene();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let w = 0, h = 0, dpr = 1, scale = 1, offset = { x: 0, y: 0 }, palette = {}, raf = 0, visible = true;
  let base = { ...HOME }, current = { ...HOME }, hover = { x: 0, y: 0 }, active = null, hits = [], gesture = null;
  const pointOn = (panel, x, y) => ({ x: panel.o.x + panel.u.x * x + panel.v.x * y, y: panel.o.y + panel.u.y * x + panel.v.y * y, z: panel.o.z + panel.u.z * x + panel.v.z * y });
  const corners = panel => [[0,0],[panel.w,0],[panel.w,panel.h],[0,panel.h]].map(([x,y]) => pointOn(panel,x,y));
  const screen = point => { const p = projectScenePoint(point,current); return p ? { x: offset.x + p.x * scale, y: offset.y + p.y * scale, depth: p.depth } : null; };
  const local = (panel, x, y) => screen(pointOn(panel,x,y));
  function line(points, color = palette.ink, alpha = 1, width = .8, close = false, fill = null) {
    const projected = points.map(screen);
    if (projected.some(p => !p)) return;
    ctx.beginPath(); projected.forEach((p,i) => i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y));
    if (close) ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.globalAlpha = alpha; ctx.fill(); }
    if (color) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = alpha; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function planeLine(panel, points, color = palette.ink, alpha = .65, width = .65) { line(points.map(([x,y]) => pointOn(panel,x,y)),color,alpha,width); }
  function box(panel,x,y,bw,bh,r=.035,fill=null,color=palette.ink,alpha=.82,width=.75) {
    const points=[];
    for (const [cx,cy,start] of [[x+bw-r,y+r,-Math.PI/2],[x+bw-r,y+bh-r,0],[x+r,y+bh-r,Math.PI/2],[x+r,y+r,Math.PI]]) {
      for(let i=0;i<=6;i++){const angle=start+i*Math.PI/12;points.push(pointOn(panel,cx+r*Math.cos(angle),cy+r*Math.sin(angle)));}
    }
    line(points,color,alpha,width,true,fill);
  }
  function circle(panel,x,y,r,color=palette.ink,alpha=.75,fill=null) {
    line(Array.from({length:24},(_,i)=>pointOn(panel,x+Math.cos(i*Math.PI/12)*r,y+Math.sin(i*Math.PI/12)*r)),color,alpha,.65,true,fill);
  }
  function text(panel,x,y,value,size=.06,color=palette.quiet) {
    const p=local(panel,x,y),u=local(panel,x+.01,y),v=local(panel,x,y+.01);
    if(!p||!u||!v)return;
    ctx.save();ctx.transform((u.x-p.x)/.01,(u.y-p.y)/.01,(v.x-p.x)/.01,(v.y-p.y)/.01,p.x,p.y);
    ctx.fillStyle=color;ctx.font=size+"px ui-sans-serif, system-ui, sans-serif";ctx.fillText(value,0,0);ctx.restore();
  }
  function cubic(points, highlighted = false) {
    const [a,b,c,d]=points;
    const path=Array.from({length:32},(_,i)=>{const t=i/31,s=1-t;return {x:s*s*s*a.x+3*s*s*t*b.x+3*s*t*t*c.x+t*t*t*d.x,y:s*s*s*a.y+3*s*s*t*b.y+3*s*t*t*c.y+t*t*t*d.y,z:s*s*s*a.z+3*s*s*t*b.z+3*s*t*t*c.z+t*t*t*d.z};});
    line(path,highlighted?palette.accent:palette.ink,highlighted?.9:.55,highlighted?1.2:.85);
  }
  function drawPanel(panel) {
    const selected=active===panel.id;
    const edge=selected?palette.accent:palette.ink;
    const normal=panel.u.x*panel.v.z-panel.u.z*panel.v.x;
    const back={...panel,o:{...panel.o,y:panel.o.y+(normal?-.026:0),z:panel.o.z+(normal?0:-.026)}};
    box(back,0,0,panel.w,panel.h,.035,palette.paper,palette.quiet,.35,.6);
    box(panel,0,0,panel.w,panel.h,.035,palette.paper,edge,.95,selected?1.1:.85);
    planeLine(panel,[[0,.17],[panel.w,.17]],edge,.65,.6);
    [.09,.17,.25].forEach(x=>circle(panel,x,.085,.026,edge,.65));
    if(panel.id==="interface") {
      text(panel,.38,.108,"INTERFACE",.055);
      for(let col=0;col<3;col++) {
        const x=.17+col*.60;
        box(panel,x,.35,.49,.83,.025,null,palette.quiet,.65,.55);
        if(col===2) {
          for(let i=0;i<7;i++)planeLine(panel,[[x+.04,.43+i*.09],[x+.45,.43+i*.09]],palette.quiet,.25,.45);
        } else { circle(panel,x+.245,.71,.10,palette.quiet,.5);planeLine(panel,[[x+.10,.95],[x+.39,.95]],palette.quiet,.5); }
        for(let i=0;i<5;i++)planeLine(panel,[[x,1.32+i*.085],[x+.43-(i%2)*.07,1.32+i*.085]],palette.quiet,.5,.5);
      }
    } else if(panel.id==="architecture") {
      text(panel,.37,.108,"ARCHITECTURE",.055);
      const nodes=[[.18,.45,.40,.24],[.80,.33,.42,.24],[.80,.90,.42,.24],[1.40,.62,.27,.24]];
      planeLine(panel,[[.58,.57],[.69,.57],[.69,.45],[.80,.45]],edge,.7,.75);
      planeLine(panel,[[.58,.57],[.69,.57],[.69,1.02],[.80,1.02]],edge,.7,.75);
      planeLine(panel,[[1.22,.45],[1.31,.45],[1.31,.74],[1.40,.74]],edge,.7,.75);
      planeLine(panel,[[1.22,1.02],[1.31,1.02],[1.31,.74],[1.40,.74]],edge,.7,.75);
      nodes.forEach(([x,y,bw,bh])=>{box(panel,x,y,bw,bh,.025,null,edge,.72,.6);circle(panel,x+.07,y+.07,.017,edge,.65);planeLine(panel,[[x+.05,y+.16],[x+bw-.05,y+.16]],palette.quiet,.65,.45);});
    } else if(panel.id==="repository") {
      text(panel,.36,.108,"REPOSITORY",.052);
      for(let i=0;i<6;i++)planeLine(panel,[[.18,.30+i*.065],[1.10-(i%3)*.10,.30+i*.065]],palette.quiet,.73,.6);
      box(panel,.43,.73,.42,.10,.04,null,edge,.75,.6);
    } else if(panel.id==="agent") {
      text(panel,.36,.108,"AGENT",.055);
      box(panel,.13,.30,.57,.34,.028,null,edge,.74,.65);
      planeLine(panel,[[.28,.44],[.44,.48],[.36,.52],[.36,.60],[.31,.51],[.28,.44]],edge,.8,.9);
      for(let i=0;i<5;i++)planeLine(panel,[[.83,.29+i*.065],[1.29-(i%2)*.06,.29+i*.065]],palette.quiet,.63,.55);
      box(panel,.13,.76,.60,.17,.03,null,palette.quiet,.6,.55);
      box(panel,.83,.76,.48,.17,.03,null,edge,.72,.6);
    } else {
      text(panel,.36,.108,"SHARED VIEW",.055);
      planeLine(panel,[[.45,.62],[1.15,.35],[.87,.84],[.74,.60],[1.15,.35]],edge,.85,1.1);
      planeLine(panel,[[.74,.60],[.57,.76],[.60,.61]],edge,.65,.7);
    }
  }
  function cube(x,y,z,cw,ch,cd,fill) {
    const p=(dx,dy,dz)=>({x:x+dx,y:y+dy,z:z+dz});
    return [ [p(0,0,cd),p(cw,0,cd),p(cw,ch,cd),p(0,ch,cd)], [p(cw,0,0),p(cw,0,cd),p(cw,ch,cd),p(cw,ch,0)], [p(0,ch,0),p(cw,ch,0),p(cw,ch,cd),p(0,ch,cd)] ].map(points=>({points,fill}));
  }
  function render() {
    if(!w||!h)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.lineJoin="round";ctx.lineCap="round";
    hits=[];
    // The ground is a projected world plane, not a background rectangle.
    ctx.setLineDash([3,5]);
    for(let i=-6;i<=6;i++) {
      const t=i*.38,alpha=.08+.09*(1-Math.abs(i)/7);
      line([{x:t,y:-.1,z:-1.65},{x:t,y:-.1,z:1.65}],palette.quiet,alpha,.6);
      line([{x:-2.30,y:-.1,z:t*.72},{x:2.30,y:-.1,z:t*.72}],palette.quiet,alpha,.6);
    }
    ctx.setLineDash([]);
    const center={x:0,y:.04,z:.38};
    cubic([center,{x:-.40,y:.04,z:.46},{x:-.77,y:.04,z:.65},{x:-.57,y:.06,z:.43}],active==="agent"||active==="repository");
    cubic([center,{x:-.35,y:.04,z:-.02},{x:-.30,y:.12,z:-.58},{x:-.21,y:.46,z:-.59}],active==="architecture"||active==="interface");
    cubic([center,{x:.04,y:.02,z:1.10},{x:.45,y:.02,z:1.19},{x:.48,y:.1,z:.92}],active==="share");
    // Small floor shadows and stacked plinth give the Atlas mark actual depth.
    for(const panel of panels.filter(p=>p.v.z)) {
      const shadow=corners(panel).map(p=>({x:p.x+.07,y:-.085,z:p.z+.06}));
      line(shadow,null,.065,0,true,palette.quiet);
    }
    // Parallel upright planes sort by their plane distance, independent of window height.
    const objects=panels.map(panel=>({panel,depth:panel.v.y ? projectScenePoint({x:0,y:0,z:panel.o.z},current).depth : corners(panel).reduce((sum,p)=>sum+projectScenePoint(p,current).depth,0)/4}));
    const faces=[...cube(-.34,-.025,.02,.68,.08,.62,palette.paper),...cube(-.34,.08,.02,.68,.10,.62,palette.paper)];
    for(let row=0;row<2;row++)for(let col=0;col<2;col++)faces.push(...cube(-.25+col*.28,.31+row*.28,.25,.22,.22,.10,(row+col)%2?palette.softAccent:palette.accent));
    faces.forEach(face=>objects.push({...face,depth:face.points.reduce((sum,p)=>sum+projectScenePoint(p,current).depth,0)/4}));
    objects.sort((a,b)=>a.depth-b.depth).forEach(object=>{
      if(object.panel){drawPanel(object.panel);hits.push({id:object.panel.id,polygon:corners(object.panel).map(screen)});}
      else line(object.points,palette.ink,.9,.75,true,object.fill);
    });
    root.dataset.yaw=current.yaw.toFixed(3);root.dataset.pitch=current.pitch.toFixed(3);root.dataset.active=active||"";
  }
  function updateCaption() { caption.textContent=active?LABELS[active]:"One system. Many connected views."; }
  function frame() {
    raf=0;if(!visible||document.hidden)return;
    const target={yaw:base.yaw+hover.x,pitch:clamp(base.pitch+hover.y,.18,1.15)};
    const easing=reduced.matches?1:.16;
    current=easeSceneCamera(current,target,easing);
    render();
    if(Math.abs(Math.atan2(Math.sin(target.yaw-current.yaw),Math.cos(target.yaw-current.yaw)))+Math.abs(current.pitch-target.pitch)>.0005)requestFrame();
  }
  function requestFrame() { if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(frame); }
  function resize() {
    const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    const styles=getComputedStyle(root);palette={ink:styles.getPropertyValue("--landing-ink").trim(),quiet:styles.getPropertyValue("--landing-quiet").trim(),accent:styles.getPropertyValue("--landing-accent").trim(),paper:styles.getPropertyValue("--scene-paper").trim(),softAccent:styles.getPropertyValue("--scene-soft-accent").trim()};
    const boundary=panels.flatMap(corners).map(p=>projectScenePoint(p,HOME));
    const minX=Math.min(...boundary.map(p=>p.x)),maxX=Math.max(...boundary.map(p=>p.x)),minY=Math.min(...boundary.map(p=>p.y)),maxY=Math.max(...boundary.map(p=>p.y));
    scale=Math.min((w-48)/(maxX-minX),(h-32)/(maxY-minY));offset={x:w/2-(minX+maxX)*scale/2,y:h/2-(minY+maxY)*scale/2};
    render();requestFrame();
  }
  const pointer=event=>{const r=canvas.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top};};
  canvas.addEventListener("pointermove",event=>{
    const p=pointer(event);
    if(gesture) {
      const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
      if(!gesture.dragging&&Math.hypot(dx,dy)>7) {
        if(event.pointerType==="touch"&&Math.abs(dy)>Math.abs(dx)) {gesture=null;return;}
        gesture.dragging=true;canvas.setPointerCapture(event.pointerId);root.classList.add("is-dragging");
      }
      if(gesture.dragging){base=orbitSceneCamera(gesture.camera,dx,dy);hover={x:0,y:0};root.dataset.gesture="orbit";requestFrame();return;}
    }
    active=[...hits].reverse().find(hit=>scenePolygonContains(p,hit.polygon))?.id||null;
    updateCaption();hover=reduced.matches?{x:0,y:0}:{x:(p.x/w-.5)*.14,y:(p.y/h-.5)*.10};requestFrame();
  });
  canvas.addEventListener("pointerdown",event=>{if(event.button!==0||!event.isPrimary)return;gesture={x:event.clientX,y:event.clientY,camera:{...current},dragging:false};root.dataset.gesture="";});
  function finish(event){if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);gesture=null;root.classList.remove("is-dragging");}
  canvas.addEventListener("pointerup",finish);canvas.addEventListener("pointercancel",finish);canvas.addEventListener("lostpointercapture",()=>{gesture=null;root.classList.remove("is-dragging");});
  canvas.addEventListener("pointerleave",()=>{if(gesture?.dragging)return;active=null;hover={x:0,y:0};updateCaption();requestFrame();});
  root.addEventListener("keydown",event=>{
    const changes={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-14],ArrowDown:[0,14]};
    if(changes[event.key]) {event.preventDefault();base=orbitSceneCamera(base,...changes[event.key]);hover={x:0,y:0};requestFrame();}
    else if(event.key==="Escape"||event.key==="0"){event.preventDefault();base={...HOME};hover={x:0,y:0};active=null;updateCaption();requestFrame();}
  });
  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(resize).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  const observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}else requestFrame();});observer.observe(root);
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else requestFrame();});
  reduced.addEventListener("change",()=>{hover={x:0,y:0};requestFrame();});
  updateCaption();resize();
}

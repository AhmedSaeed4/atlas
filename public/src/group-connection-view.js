const svg = (tag, attrs = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  return element;
};

export function scaleGroupConnectionMarkers(layer, scale) {
  const factor = Math.min(2.2, Math.max(1, .6 / Math.max(.05, scale)));
  for (const marker of layer.querySelectorAll('.group-port,.group-port-direction')) marker.setAttribute('transform', `scale(${Math.min(factor, Number(marker.parentElement.dataset.maxMarkerScale) || factor)})`);
  for (const arrow of layer.querySelectorAll('.group-wire .edge-arrow')) {
    const x = arrow.dataset.tipX, y = arrow.dataset.tipY;
    arrow.setAttribute('transform', `translate(${x} ${y}) scale(${factor}) translate(${-x} ${-y})`);
  }
}

export function renderGroupConnectionWires(layer, plan, { onSelect, selectedEdgeIds = new Set(), selectedNodeId, trace, traceMode, focusedType, graph, scale = 1 } = {}) {
  let container = layer.querySelector('.group-connections');
  if (!plan) { container?.remove(); return; }
  if (!container) { container = svg('g', { class: 'group-connections' }); layer.prepend(container); }
  const existing = new Map([...container.children].map(element => [element.dataset.wireId, element]));
  const byId = new Map(graph.nodes.map(node => [node.id, node]));
  const hasSelection = [...selectedEdgeIds].some(Boolean);
  for (const wire of plan.wires) {
    let group = existing.get(wire.id);
    if (!group) {
      group = svg('g', { class: 'group-wire', 'data-wire-id': wire.id, 'data-kind': wire.kind, tabindex: 0, role: 'button' });
      group.append(svg('title'), svg('path', { class: 'edge-hit-target' }));
      if (wire.kind === 'trunk') group.append(svg('path', { class: 'wire-casing', 'aria-hidden': true }));
      group.append(svg('path', { class: 'edge-path' }), svg('path', { class: 'edge-arrow', 'aria-hidden': true }));
      if (wire.kind === 'trunk') group.append(svg('rect', { class: 'edge-label-bg', height: 17, rx: 8 }), svg('text', { class: 'edge-label' }));
      group.addEventListener('pointerdown', event => event.stopPropagation());
      group.addEventListener('contextmenu', event => { event.preventDefault(); event.stopPropagation(); group.onclick(event); });
      container.append(group);
    }
    existing.delete(wire.id);
    group.setAttribute('aria-label', wire.title + ', ' + wire.edgeIndexes.length + ' connections. Inspect relationships');
    group.querySelector('title').textContent = wire.title + ': ' + wire.edgeIndexes.length + ' connections';
    group.dataset.edgeIds = JSON.stringify(wire.edgeIndexes.map(index => graph.edges[index].id));
    if (wire.nodeId) group.dataset.nodeId = wire.nodeId;
    if (wire.direction) group.dataset.direction = wire.direction;
    for (const path of group.querySelectorAll('.edge-path,.edge-hit-target,.wire-casing')) path.setAttribute('d', wire.geometry.path);
    group.querySelector('.edge-arrow').setAttribute('d', wire.geometry.arrowPath);
    group.querySelector('.edge-arrow').dataset.tipX = wire.end.x;
    group.querySelector('.edge-arrow').dataset.tipY = wire.end.y;
    const selected = wire.edgeIndexes.some(index => selectedEdgeIds.has(graph.edges[index].id));
    const connected = Boolean(selectedNodeId && traceMode !== 'all' && wire.edgeIndexes.some(index => trace.edges.has(index)));
    const focused = !focusedType || wire.edgeIndexes.some(index => {
      const edge = graph.edges[index]; return byId.get(edge.source)?.type === focusedType || byId.get(edge.target)?.type === focusedType;
    });
    group.classList.toggle('selected', selected);
    group.classList.toggle('dimmed', Boolean((selectedNodeId && traceMode !== 'all' && !connected) || (hasSelection && !selectedNodeId && !selected)));
    group.classList.toggle('focus-dimmed', !focused);
    group.querySelector('.edge-path').classList.toggle('connected', connected);
    group.querySelector('.edge-arrow').classList.toggle('connected', connected);
    group.classList.toggle('trace-label', connected);
    group.setAttribute('aria-pressed', String(selected));
    if (wire.kind === 'trunk') {
      const { labelX, labelY } = wire.geometry, width = wire.label.length * 5.3 + 18;
      const background = group.querySelector('rect');
      background.setAttribute('display', wire.label ? 'inline' : 'none');
      for (const [key, value] of Object.entries({ x: labelX - width / 2, y: labelY - 10, width })) background.setAttribute(key, value);
      const label = group.querySelector('text'); label.setAttribute('display', wire.label ? 'inline' : 'none'); label.setAttribute('x', labelX); label.setAttribute('y', labelY + 2); label.textContent = wire.label;
    }
    group.onclick = event => { event.stopPropagation(); onSelect(wire); };
    group.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); onSelect(wire); } };
  }
  // Ports are presentation only: they do not create graph nodes or change the
  // connection-editing target. Existing card ports still create real edges.
  let portLayer = container.querySelector('.group-ports');
  if (!portLayer) { portLayer = svg('g', { class: 'group-ports', 'pointer-events': 'none' }); container.append(portLayer); }
  existing.delete(undefined);
  for (const group of existing.values()) group.remove();
  portLayer.replaceChildren();
  for (const port of plan.ports) {
    const active = port.edgeIndexes.some(index => selectedEdgeIds.has(graph.edges[index].id)
      || (selectedNodeId && traceMode !== 'all' && trace.edges.has(index)));
    const group = svg('g', { class: 'group-terminal' + (active ? ' is-active' : ''), 'data-group-port': port.group,
      'data-direction': port.direction, 'data-wire-id': port.wireId, 'data-max-marker-scale': port.maxMarkerScale, transform: `translate(${port.x} ${port.y})` });
    const title = svg('title'); title.textContent = port.direction === 'in' ? 'From ' + port.peer + ' into ' + port.group : 'From ' + port.group + ' to ' + port.peer;
    const rectangle = svg('rect', { class: 'group-port', x: -7, y: -9, width: 14, height: 18, rx: 4 });
    const arrow = svg('path', { class: 'group-port-direction', d: 'M -2 -3 L 2 0 L -2 3' });
    const label = svg('text', { class: 'group-port-label', x: port.direction === 'in' ? 14 : -14, y: -6,
      'text-anchor': port.direction === 'in' ? 'start' : 'end' });
    label.textContent = port.direction === 'in' ? 'IN' : 'OUT';
    group.append(title, rectangle, arrow, label); portLayer.append(group);
  }
  scaleGroupConnectionMarkers(container, scale);
}

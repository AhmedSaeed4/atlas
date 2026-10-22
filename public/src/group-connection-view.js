const svg = (tag, attrs = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  return element;
};

export function renderGroupConnectionWires(layer, plan, { onSelect, selectedEdgeIds = new Set(), selectedNodeId, trace, traceMode, focusedType, graph } = {}) {
  let container = layer.querySelector('.group-connections');
  if (!plan) { container?.remove(); return; }
  if (!container) { container = svg('g', { class: 'group-connections' }); layer.prepend(container); }
  const existing = new Map([...container.children].map(element => [element.dataset.wireId, element]));
  const byId = new Map(graph.nodes.map(node => [node.id, node]));
  for (const wire of plan.wires) {
    let group = existing.get(wire.id);
    if (!group) {
      group = svg('g', { class: 'group-wire', 'data-wire-id': wire.id, 'data-kind': wire.kind, tabindex: 0, role: 'button' });
      group.append(svg('title'), svg('path', { class: 'edge-hit-target' }), svg('path', { class: 'edge-path' }));
      if (wire.kind === 'trunk') group.append(svg('rect', { class: 'edge-label-bg', height: 17, rx: 8 }), svg('text', { class: 'edge-label' }));
      group.addEventListener('pointerdown', event => event.stopPropagation());
      group.addEventListener('contextmenu', event => { event.preventDefault(); event.stopPropagation(); group.onclick(event); });
      container.append(group);
    }
    existing.delete(wire.id);
    group.setAttribute('aria-label', wire.title + ', ' + wire.edgeIndexes.length + ' connections. Inspect relationships');
    group.querySelector('title').textContent = wire.title + ': ' + wire.edgeIndexes.length + ' connections';
    group.dataset.edgeIds = JSON.stringify(wire.edgeIndexes.map(index => graph.edges[index].id));
    for (const path of group.querySelectorAll('path')) path.setAttribute('d', wire.geometry.path);
    const selected = wire.edgeIndexes.some(index => selectedEdgeIds.has(graph.edges[index].id));
    const connected = Boolean(selectedNodeId && traceMode !== 'all' && wire.edgeIndexes.some(index => trace.edges.has(index)));
    const focused = !focusedType || wire.edgeIndexes.some(index => {
      const edge = graph.edges[index]; return byId.get(edge.source)?.type === focusedType || byId.get(edge.target)?.type === focusedType;
    });
    group.classList.toggle('selected', selected);
    group.classList.toggle('dimmed', Boolean(selectedNodeId && traceMode !== 'all' && !connected));
    group.classList.toggle('focus-dimmed', !focused);
    group.querySelector('.edge-path').classList.toggle('connected', connected);
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
    const group = svg('g', { 'data-group-port': port.group, 'data-direction': port.direction });
    const circle = svg('circle', { class: 'group-port', cx: port.x, cy: port.y, r: 5 });
    const title = svg('title'); title.textContent = port.group + (port.direction === 'in' ? ' input' : ' output');
    circle.append(title); group.append(circle); portLayer.append(group);
  }
}

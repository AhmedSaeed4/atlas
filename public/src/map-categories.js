// Categories reuse the canonical node.group field. These bounds are presentation
// data only; imports, checkpoints and cloud saves keep the original node IDs.
export const CATEGORY_PADDING = 24;
export const CATEGORY_HEADER = 54;
export const CATEGORY_MIN_WIDTH = 292;
const categoryHeaders = new WeakMap();

export function categoryBounds(graph, positions, dimensions, excludedTypes = new Set()) {
  const groups = new Map();
  for (const node of graph.nodes) {
    if (!node.group || node.viewGroup) continue;
    if (!groups.has(node.group)) groups.set(node.group, { name: node.group, members: [], total: 0 });
    const group = groups.get(node.group);
    group.total++;
    if (excludedTypes.has(node.type)) continue;
    const point = positions.get(node.id), size = dimensions.get(node.id);
    if (point && size) group.members.push({ id: node.id, ...point, ...size });
  }
  return [...groups.values()].filter(group => group.members.length).map(group => {
    const x = Math.min(...group.members.map(node => node.x)) - CATEGORY_PADDING;
    const y = Math.min(...group.members.map(node => node.y)) - CATEGORY_HEADER;
    const right = Math.max(...group.members.map(node => node.x + node.width)) + CATEGORY_PADDING;
    const bottom = Math.max(...group.members.map(node => node.y + node.height)) + CATEGORY_PADDING;
    return { ...group, x, y, width: Math.max(CATEGORY_MIN_WIDTH, right - x), height: bottom - y };
  });
}

export function categoryTitle(name, width, fontSize = 12) {
  const limit = Math.max(8, Math.floor((width - 110) / (fontSize * .58)));
  return name.length > limit ? name.slice(0, limit - 1) + '\u2026' : name;
}

export function scaleCategoryHeaders(layer, scale) {
  layer.dataset.scale = String(scale);
  const fontSize = Math.min(22, Math.max(12, 10 / Math.max(.05, scale)));
  for (const group of layer.children) {
    const header = categoryHeaders.get(group);
    if (!header) continue;
    const label = header.querySelector('.category-name');
    label.style.fontSize = fontSize + 'px';
    label.textContent = categoryTitle(group.dataset.category, Number(group.dataset.width), fontSize);
    header.querySelector('.category-count').style.fontSize = Math.min(16, Math.max(10, 8 / Math.max(.05, scale))) + 'px';
  }
}

const svg = (tag, attributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
};

// Reuse the mounted boundaries during dragging and filtering. Never rebuild
// node cards or routes just to resize a container.
export function renderCategoryContainers(layer, graph, layout, { excludedTypes = new Set(), headerLayer = null } = {}) {
  const existing = new Map([...layer.children].map(element => [element.dataset.category, element]));
  for (const box of categoryBounds(graph, layout.positions, layout.dimensions, excludedTypes)) {
    let group = existing.get(box.name);
    if (!group) {
      group = svg('g', { class: 'map-category', 'data-category': box.name });
      group.append(svg('rect', { class: 'category-boundary', rx: 22 }));
      const header = svg('g', { class: 'category-header', 'data-category-header': box.name, role: 'group', 'aria-label': 'Category ' + box.name });
      const title = svg('title');
      title.textContent = box.name;
      header.append(title, svg('rect', { class: 'category-header-hit', x: 8, y: 8, height: 34, rx: 12 }),
        svg('circle', { class: 'category-dot', cx: 24, cy: 26, r: 3 }),
        svg('text', { class: 'category-name', x: 36, y: 30 }),
        svg('text', { class: 'category-count', y: 30, 'text-anchor': 'end' }));
      layer.append(group);
      categoryHeaders.set(group, header);
      (headerLayer || group).append(header);
    }
    existing.delete(box.name);
    group.dataset.width = String(box.width);
    group.setAttribute('transform', `translate(${box.x} ${box.y})`);
    const header = categoryHeaders.get(group);
    header.setAttribute('transform', headerLayer ? `translate(${box.x} ${box.y})` : 'translate(0 0)');
    const rectangle = group.querySelector('.category-boundary');
    rectangle.setAttribute('width', box.width);
    rectangle.setAttribute('height', box.height);
    header.querySelector('.category-header-hit').setAttribute('width', box.width - 16);
    header.querySelector('.category-name').textContent = categoryTitle(box.name, box.width);
    const count = header.querySelector('.category-count');
    count.setAttribute('x', box.width - 24);
    count.textContent = box.members.length === box.total ? String(box.total) : box.members.length + '/' + box.total;
    count.setAttribute('aria-label', box.members.length + ' of ' + box.total + ' components visible');
  }
  for (const element of existing.values()) { categoryHeaders.get(element)?.remove(); element.remove(); }
  scaleCategoryHeaders(layer, Number(layer.dataset.scale) || 1);
}

// View preference only: keys are existing local/owner/viewer map scopes. No
// graph labels, membership, credentials or cloud data are copied into it.
export function createCategoryFramePreferences(storage) {
  const key = 'atlas.category-frames.v1';
  let scopes = new Set();
  try {
    const saved = JSON.parse(storage?.getItem(key) || '[]');
    if (Array.isArray(saved) && saved.length <= 200) scopes = new Set(saved.filter(scope => typeof scope === 'string' && scope.length <= 500));
  } catch {}
  return Object.freeze({
    enabled(scope) { return Boolean(scope && scopes.has(scope)); },
    set(scope, enabled) {
      if (!scope || typeof scope !== 'string' || scope.length > 500) return false;
      scopes.delete(scope);
      if (enabled) scopes.add(scope);
      while (scopes.size > 200) scopes.delete(scopes.values().next().value);
      try { if (!storage) return false; storage.setItem(key, JSON.stringify([...scopes])); return true; } catch { return false; }
    },
  });
}

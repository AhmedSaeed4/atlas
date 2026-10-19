export const LIBRARY_PREFERENCES_KEY = "atlas.library.preferences.v1";
const scopeFor = ({ origin = "local", ownerUid = "" } = {}) =>
  origin === "cloud" ? (ownerUid ? "cloud:" + String(ownerUid) : "") : "local";
const valid = (value) =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= 220 &&
  !/[\u0000-\u001f]/.test(value);
export function createLibraryPreferences(storage) {
  let pins = [];
  function reload() {
    try {
      const raw = storage?.getItem(LIBRARY_PREFERENCES_KEY);
      const parsed = raw && raw.length <= 64000 ? JSON.parse(raw) : null;
      pins =
        parsed?.version === 1 && Array.isArray(parsed.pins)
          ? parsed.pins
              .filter((item) => valid(item?.scope) && valid(item?.id))
              .slice(0, 512)
          : [];
    } catch {
      pins = [];
    }
  }
  reload();
  return Object.freeze({
    reload,
    pinned(context) {
      const scope = scopeFor(context);
      return new Set(
        pins.filter((item) => item.scope === scope).map((item) => item.id),
      );
    },
    toggle(context) {
      const scope = scopeFor(context),
        id = context.id;
      if (!valid(scope) || !valid(id)) return { pinned: false, saved: false };
      const exists = pins.some(
        (item) => item.scope === scope && item.id === id,
      );
      pins = pins.filter((item) => item.scope !== scope || item.id !== id);
      if (!exists) pins.unshift({ scope, id });
      pins = pins.slice(0, 512);
      let saved = false;
      try {
        storage.setItem(
          LIBRARY_PREFERENCES_KEY,
          JSON.stringify({ version: 1, pins }),
        );
        saved = true;
      } catch {}
      return { pinned: !exists, saved };
    },
  });
}
export function filterWorkspaceLibrary(
  items,
  {
    query = "",
    pinned = new Set(),
    metadata = (item) => ({
      id: item.id,
      name: item.name || item.graph?.project?.name,
      type: item.projectType || item.graph?.project?.type,
    }),
  } = {},
) {
  const tokens = String(query)
    .slice(0, 200)
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return items
    .map((item, index) => ({ item, index, data: metadata(item) }))
    .filter(({ data }) =>
      tokens.every((token) =>
        [data.name, data.type]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(token),
      ),
    )
    .sort(
      (a, b) =>
        Number(pinned.has(b.data.id)) - Number(pinned.has(a.data.id)) ||
        a.index - b.index,
    )
    .map(({ item }) => item);
}
export function editedLabel(value, now = Date.now()) {
  const time = typeof value === "number" ? value : Date.parse(value);
  if (!Number.isFinite(time) || time <= 0) return "";
  const days = Math.max(0, Math.floor((now - time) / 86400000));
  return days === 0
    ? "Edited today"
    : days === 1
      ? "Edited yesterday"
      : days < 30
        ? "Edited " + days + " days ago"
        : "Edited " +
          new Date(time).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
}

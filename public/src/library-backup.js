import {
  assertGraphJsonWithinLimit,
  normalizeEditableGraph,
} from "./schema.js";
import { createProjectId } from "./storage.js";

export const MAX_BACKUP_BYTES = 16 * 1024 * 1024;
export const MAX_BACKUP_MAPS = 100;
const bytes = (text) => new TextEncoder().encode(text).byteLength;
const record = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

// Backups are local data, never cloud associations, permissions or upload consent.
export function readLibraryBackup(input) {
  let root = input;
  if (typeof root === "string") {
    if (bytes(root) > MAX_BACKUP_BYTES)
      throw new Error(
        "This backup exceeds the 16 MiB limit. Restore smaller batches.",
      );
    try {
      root = JSON.parse(root);
    } catch {
      throw new Error("This backup is not valid JSON.");
    }
  }
  if (!record(root)) throw new Error("Choose an Atlas backup or a JSON map.");
  if (!Array.isArray(root.projects)) {
    return {
      version: 1,
      kind: "map",
      projects: [
        {
          id: "imported-map",
          graph: normalizeEditableGraph(root),
          updatedAt: Date.now(),
        },
      ],
      activeId: "imported-map",
    };
  }
  if (root.version !== 1)
    throw new Error("This backup version is not supported.");
  if (root.projects.length > MAX_BACKUP_MAPS)
    throw new Error("Restore up to 100 maps at a time.");
  const ids = new Set();
  const projects = root.projects.map((item, index) => {
    if (
      !record(item) ||
      typeof item.id !== "string" ||
      !item.id.trim() ||
      item.id.length > 180 ||
      /[\u0000-\u001f]/.test(item.id)
    )
      throw new Error("Map " + (index + 1) + " has an invalid backup ID.");
    if (ids.has(item.id))
      throw new Error("The backup contains duplicate map IDs.");
    ids.add(item.id);
    try {
      const graph = normalizeEditableGraph(item.graph);
      assertGraphJsonWithinLimit(graph);
      return {
        id: item.id,
        graph,
        updatedAt: Number.isFinite(item.updatedAt)
          ? item.updatedAt
          : Date.now(),
      };
    } catch (error) {
      throw new Error("Map " + (index + 1) + ": " + error.message);
    }
  });
  if (bytes(JSON.stringify({ version: 1, projects })) > MAX_BACKUP_BYTES)
    throw new Error("This backup exceeds the 16 MiB limit.");
  return {
    version: 1,
    kind: "library",
    projects,
    activeId: ids.has(root.activeId) ? root.activeId : projects[0]?.id || "",
  };
}

export function makeLibraryBackup(projects, activeId) {
  const backup = readLibraryBackup({ version: 1, projects, activeId });
  return JSON.stringify(
    { version: 1, activeId: backup.activeId, projects: backup.projects },
    null,
    2,
  );
}

export function restoreLibraryCopies(
  current,
  backup,
  { newId = createProjectId, now = Date.now() } = {},
) {
  const validated = readLibraryBackup({
    version: 1,
    projects: backup.projects,
    activeId: backup.activeId,
  });
  const ids = new Set(current.map((project) => project.id));
  const names = new Set(current.map((project) => project.graph.project.name));
  let activeId = "";
  const copies = validated.projects.map((project) => {
    const id = newId();
    if (typeof id !== "string" || !id || ids.has(id))
      throw new Error("Could not create a unique map ID. Try restoring again.");
    ids.add(id);
    const graph = structuredClone(project.graph);
    if (names.has(graph.project.name))
      graph.project.name = graph.project.name.slice(0, 109) + " (restored)";
    names.add(graph.project.name);
    if (project.id === validated.activeId) activeId = id;
    return { id, graph, updatedAt: now };
  });
  return {
    projects: [...copies, ...current],
    activeId: activeId || copies[0]?.id || current[0]?.id || "",
    copies,
  };
}

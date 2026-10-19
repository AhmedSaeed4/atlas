import { SAMPLE_GRAPHS } from "./samples.js";
export const LIBRARY_STORAGE_KEY = "project-atlas-library-v1";
const STORAGE_KEY = LIBRARY_STORAGE_KEY;
const REQUEST_FLOW_NAME = "Request flow demo";
const requestFlowIndex = SAMPLE_GRAPHS.findIndex(
  (graph) => graph.project?.name === REQUEST_FLOW_NAME,
);
const requestFlowSample =
  requestFlowIndex >= 0 ? SAMPLE_GRAPHS[requestFlowIndex] : null;

export function createProjectId() {
  if (globalThis.crypto && typeof crypto.randomUUID === "function")
    return crypto.randomUUID();
  return (
    "atlas-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 9)
  );
}

export function readLibrary(normalizeGraph, { storage } = {}) {
  let rawBackup = "";
  let target;
  try {
    target = storage === undefined ? globalThis.localStorage : storage;
    rawBackup = target.getItem(STORAGE_KEY) || "";
    if (rawBackup === "")
      return {
        projects: [],
        activeId: "",
        writable: true,
        error: "",
        rawBackup: "",
        snapshot: rawBackup,
      };
    const parsed = JSON.parse(rawBackup);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.projects)) {
      throw new Error(
        "Saved project data is not in a format this version can read.",
      );
    }
    const projects = parsed.projects.map((record) => {
      const graph = normalizeGraph(record.graph, { allowEmpty: true });
      const isRequestFlowExample =
        record.exampleId === "request-flow" ||
        (requestFlowSample &&
          graph.project.name === REQUEST_FLOW_NAME &&
          (String(record.id || "") === "sample-" + (requestFlowIndex + 1) ||
            JSON.stringify(graph) ===
              JSON.stringify(
                normalizeGraph(requestFlowSample, { allowEmpty: true }),
              )));
      return {
        id: String(record.id || createProjectId()),
        graph,
        updatedAt: Number(record.updatedAt) || Date.now(),
        ...(isRequestFlowExample ? { exampleId: "request-flow" } : {}),
        ...(typeof record.shareSourceHash === "string" &&
        record.shareSourceHash.length <= 60000
          ? { shareSourceHash: record.shareSourceHash }
          : {}),
      };
    });
    const projectIds = new Set();
    for (const project of projects) {
      if (projectIds.has(project.id))
        throw new Error(
          "Saved project library contains duplicate project IDs.",
        );
      projectIds.add(project.id);
    }
    return {
      projects,
      activeId: String(parsed.activeId || ""),
      writable: true,
      error: "",
      rawBackup: "",
      snapshot: rawBackup,
    };
  } catch (error) {
    if (!rawBackup) {
      try {
        rawBackup = target?.getItem(STORAGE_KEY) || "";
      } catch {}
    }
    return {
      projects: null,
      activeId: null,
      writable: false,
      error:
        error instanceof Error
          ? error.message
          : "Browser storage is unavailable.",
      rawBackup,
      snapshot: rawBackup,
    };
  }
}

export function writeLibrary(projects, activeId, options = {}) {
  try {
    return writeLibrarySnapshot(
      JSON.stringify({ version: 1, activeId, projects }),
      options,
    );
  } catch {
    return {
      ok: false,
      error:
        "These local maps could not be prepared for saving. Export a JSON backup before leaving.",
    };
  }
}
export function writeLibrarySnapshot(snapshot, { storage } = {}) {
  try {
    (storage === undefined ? globalThis.localStorage : storage).setItem(
      STORAGE_KEY,
      snapshot,
    );
    return { ok: true, error: "" };
  } catch (error) {
    const quota =
      error &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED");
    return {
      ok: false,
      error: quota
        ? "Browser storage is full. Export a JSON backup, remove saved projects, or free space before saving more changes."
        : "This browser blocked local storage. Changes are in memory for this session; export a JSON backup to keep them.",
    };
  }
}

export function clearLibrary({ storage } = {}) {
  try {
    (storage === undefined ? globalThis.localStorage : storage).removeItem(
      STORAGE_KEY,
    );
    return { ok: true, error: "" };
  } catch {
    return {
      ok: false,
      error:
        "This browser blocked local storage, so saved data could not be cleared.",
    };
  }
}

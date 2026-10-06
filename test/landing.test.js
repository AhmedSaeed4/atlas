import assert from "node:assert/strict";
import test from "node:test";
import { buildAgentPrompt } from "../public/src/prompt.js";
import {
  getLegacyShareRedirect,
  getPreviewNodeDetails,
  getWorkspaceBaseUrl,
  isLocalViewerUrl,
} from "../public/src/landing.js";

test("legacy root map fragments redirect to the workspace with query and fragment preserved", () => {
  assert.equal(
    getLegacyShareRedirect({
      pathname: "/",
      search: "?campaign=legacy&next=a%2Fb",
      hash: "#map=g.ABC_123",
    }),
    "./workspace.html?campaign=legacy&next=a%2Fb#map=g.ABC_123",
  );
});

test("legacy raw-fragment links and direct index entries keep their exact payload", () => {
  assert.equal(
    getLegacyShareRedirect({ pathname: "/index.html", search: "?view=old", hash: "#map=r.eyJuYW1lIjoiQ2Fm6SJ9" }),
    "./workspace.html?view=old#map=r.eyJuYW1lIjoiQ2Fm6SJ9",
  );
});

test("ordinary root queries and non-root paths do not masquerade as shared maps", () => {
  assert.equal(getLegacyShareRedirect({ pathname: "/", search: "?example=flow", hash: "" }), null);
  assert.equal(getLegacyShareRedirect({ pathname: "/", search: "?map=old", hash: "#section=privacy" }), null);
  assert.equal(getLegacyShareRedirect({ pathname: "/nested/", hash: "#map=g.payload" }), null);
  assert.equal(getLegacyShareRedirect({ pathname: "/", hash: "#MAP=g.payload" }), null);
});

test("the prompt viewer URL points at workspace.html and excludes the landing query and fragment", () => {
  assert.equal(
    getWorkspaceBaseUrl("https://atlas.example/atlas/index.html?campaign=old#map=g.old"),
    "https://atlas.example/atlas/workspace.html",
  );
  assert.equal(
    getWorkspaceBaseUrl("http://127.0.0.1:4173/?example=flow"),
    "http://127.0.0.1:4173/workspace.html",
  );
});

test("prompt generation uses the viewer URL and warns for local development", () => {
  const publicPrompt = buildAgentPrompt(getWorkspaceBaseUrl("https://atlas.example/"), false);
  assert.match(publicPrompt, /https:\/\/atlas\.example\/workspace\.html/);
  assert.match(publicPrompt, /Manual: inspect the repository and create only architecture-map\.json/);
  assert.match(publicPrompt, /Automatic: inspect the repository and create architecture-map\.json/);
  assert.doesNotMatch(publicPrompt, /LOCAL DEVELOPMENT WARNING/);

  const localPrompt = buildAgentPrompt(getWorkspaceBaseUrl("http://127.0.0.1:4173/?example=flow"), true);
  assert.match(localPrompt, /http:\/\/127\.0\.0\.1:4173\/workspace\.html/);
  assert.match(localPrompt, /LOCAL DEVELOPMENT WARNING/);
});

test("local viewer detection distinguishes development hosts and non-web origins", () => {
  assert.equal(isLocalViewerUrl("http://localhost:4173/workspace.html"), true);
  assert.equal(isLocalViewerUrl("https://dev.localhost/workspace.html"), true);
  assert.equal(isLocalViewerUrl("http://127.0.0.1:4173/workspace.html"), true);
  assert.equal(isLocalViewerUrl("http://[::1]:4173/workspace.html"), true);
  assert.equal(isLocalViewerUrl("file:///D:/atlas/index.html"), true);
  assert.equal(isLocalViewerUrl("https://atlas.example/workspace.html"), false);
});

test("preview labels stay plain text values for safe textContent rendering", () => {
  const description = "<img src=x onerror=alert(1)>";
  assert.deepEqual(
    getPreviewNodeDetails({
      dataset: { title: "<b>Data store</b>", kind: "STORAGE", description },
    }),
    { title: "<b>Data store</b>", kind: "STORAGE", description },
  );
  assert.equal(getPreviewNodeDetails(null), null);
});
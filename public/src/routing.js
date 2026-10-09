// Preserve query strings and fragments when old bookmarked routes are opened.
export function canonicalWorkspaceUrl(inputUrl) {
  const url = new URL(String(inputUrl));
  url.pathname = url.pathname.replace(/\/workspace(?:\.html)?\/?$/, "/workspace");
  return url.href;
}
export function workspaceBaseUrl(inputUrl) {
  const url = new URL("./workspace", canonicalWorkspaceUrl(inputUrl));
  url.search = "";
  url.hash = "";
  return url.href;
}

# Atlas architecture

Atlas is a static website built with HTML, CSS and JavaScript modules. Local mode has no runtime package dependency. The optional Firebase client is built into a locally hosted bundle and loaded only for online actions or viewing an online link.

## Files

- public/index.html, public/landing.css and public/src/landing.js provide the landing page and illustrative graph preview.
- public/workspace.html, public/styles.css, public/theme.css and public/src/app.js provide the interactive workspace.
- public/src/schema.js validates imported maps and normalizes supported fields.
- public/src/layout.js and geometry.js compute node arrangements and connector geometry.
- public/src/refinement-graph.js and refinement-ui.js support graph editing and inspector controls.
- public/src/traces.js, timeline.js, charts.js and edge-motion.js provide graph tracing, dependency steps, evidence-backed charts and connection animation.
- public/src/storage.js handles browser-local persistence and recovery.
- public/src/edit-history.js stores bounded in-memory graph undo/redo per map/owner, rejects unexpected graph replacements and classifies shortcuts without overriding native form editing. app.js records completed edits and sends restores through normal local persistence or cloud autosave.
- public/src/share.js encodes and decodes map snapshots in URL fragments.
- public/src/routing.js creates clean workspace links and canonicalizes legacy filename routes without changing query or fragment data.
- public/src/exports.js produces JSON, SVG and PNG exports.
- public/src/prompt.js generates instructions for external coding agents.
- public/src/node-editor.js validates chosen component types and optional measured chart fields.
- public/src/account-session.js provides the lazy shared account session and independent future-saving preference; account-ui.js presents Account and Settings on the workspace and landing page.
- public/src/map-admission.js gates local new/import/fragment events, while cloud-associations.js scopes saved links and pending creation records to the owner.
- public/src/cloud-import.js handles explicit cloud imports without a local project, with verified owner/destination guards, single-flight requests and owner/hash-scoped candidate IDs for idempotent retry.
- public/src/cloud-ui.js coordinates optional account, library, owner editing and read-only viewing state.
- public/src/sidebar-library.js resolves per-map action targets by library, map ID and owner identity, independently of the open graph, and orders confirmed cloud lists by creation time to match local newest-first insertion. The same cached order drives rendering and first-map selection; updates never rank by edit time.
- public/src/cloud-owner-cache.js bounds temporary, server-confirmed owner previews in memory; account changes clear them and reopening still requires server validation.
- public/src/cloud-model.js and cloud-service.js encode bounded revisions and implement Auth/Firestore access; cloud-entry.js is built into the locally hosted cloud-service.bundle.js by scripts/build-cloud.js.
- public/src/cloud-quota.js checks per-account workspace membership; the adapter and rules atomically enforce20 cloud maps while retaining local data and existing revisions.
- firestore.rules and firestore.indexes.json define database permissions and owner library queries; firebase.json configures their emulator and deployment.
- public/src/theme.js manages the local theme preference.
- server.js is a loopback-only development server that serves public/.
- test/ contains Node test-runner checks; run npm test.

## Data flow

A user imports a JSON map or opens a share link. Atlas validates and normalizes that data, computes the layout and renders an interactive graph. Edits are saved in this browser's local storage. Exported JSON can be imported in another browser.

A share link contains a compressed map snapshot in its URL fragment. The browser decodes it locally; recipients edit independent copies. This local sharing mode does not synchronize changes. Optional online workspaces instead use Firebase Authentication and Firestore: the link contains a random workspace ID, the owner saves revisions, and viewers receive the current revision with read-only access. Anyone with a local fragment link can decode its embedded map; anyone with an enabled online link can read its current map. Share only suitable information.

Charts require supporting evidence and are supplied as map data. Atlas does not collect runtime telemetry. External coding agents analyze their own project and produce map files or links; Atlas does not run an AI service or upload source code.

## Hosting

Deploy only public/ to a static host. Relative asset URLs support the landing and workspace routes. The root handles legacy map fragments by forwarding them to the workspace. Static security headers restrict network connections and executable sources. Browser storage is specific to the site's origin.

## Optional cloud boundary

Local storage remains separate from the online library. A sidebar library switch chooses which list to browse, independently of the currently open graph and the future-map saving preference. Per-map actions capture the target origin, map ID and owner identity so opening another row's settings cannot mutate the current graph by accident. Signing in and future-map automatic saving are separate choices. Only explicit preference consent enables automatic future local new/import/fragment uploads; importing from the Cloud Workspace section explicitly uploads that import directly, without a local project. Existing local maps are not migrated. Successful imports shorten the current address after commit. Owners edit normally with autosave, while viewers remain read-only. Firestore stores bounded UTF-8 JSON chunks and owner metadata; rules enforce owner-only modification and allow viewing only an enabled shared workspace's current revision. Revocation or deletion must clear the viewer graph. Account switches cancel pending UI operations and subscriptions. No source repository, analytics or AI request is sent by Atlas.

Cloud creation/final deletion also changes workspaceQuota/{ownerUid} in the same transaction. Rules require exactly one corresponding owned workspace add/remove and cap new membership at20. A trusted server-only system/workspaceQuota activation record gates membership changes during initial setup. Existing owner registries are seeded from metadata only, preserving graphs and any grandfathered over-limit accounts; client entitlement overrides and an admin dashboard are not implemented.

# Atlas architecture

Atlas is a static website built with HTML, CSS and JavaScript modules. There is no build step or runtime package dependency.

## Files

- public/index.html, public/landing.css and public/src/landing.js provide the landing page and illustrative graph preview.
- public/workspace.html, public/styles.css, public/theme.css and public/src/app.js provide the interactive workspace.
- public/src/schema.js validates imported maps and normalizes supported fields.
- public/src/layout.js and geometry.js compute node arrangements and connector geometry.
- public/src/refinement-graph.js and refinement-ui.js support graph editing and inspector controls.
- public/src/traces.js, timeline.js, charts.js and edge-motion.js provide graph tracing, dependency steps, evidence-backed charts and connection animation.
- public/src/storage.js handles browser-local persistence and recovery.
- public/src/share.js encodes and decodes map snapshots in URL fragments.
- public/src/exports.js produces JSON, SVG and PNG exports.
- public/src/prompt.js generates instructions for external coding agents.
- public/src/theme.js manages the local theme preference.
- server.js is a loopback-only development server that serves public/.
- test/ contains Node test-runner checks; run npm test.

## Data flow

A user imports a JSON map or opens a share link. Atlas validates and normalizes that data, computes the layout and renders an interactive graph. Edits are saved in this browser's local storage. Exported JSON can be imported in another browser.

A share link contains a compressed map snapshot in its URL fragment. The browser decodes it locally; recipients edit independent copies. There is no live synchronization or cloud database. Anyone with the link can read its embedded map, so share only suitable information.

Charts require supporting evidence and are supplied as map data. Atlas does not collect runtime telemetry. External coding agents analyze their own project and produce map files or links; Atlas does not run an AI service or upload source code.

## Hosting

Deploy only public/ to a static host. Relative asset URLs support the landing and workspace routes. The root handles legacy map fragments by forwarding them to the workspace. Static security headers restrict network connections and executable sources. Browser storage is specific to the site's origin.

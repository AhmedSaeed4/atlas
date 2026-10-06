# Atlas

Atlas turns repository evidence into an editable software architecture map. It works for frontend, backend, API, mobile, desktop and Electron, CLI, library, infrastructure, and mixed projects. The app is plain HTML, CSS, and JavaScript modules; it has no runtime packages, analytics, remote assets, AI calls, uploads, or cloud database.

## Run locally

Use Node.js 18 or newer. No package installation is needed.

```sh
npm start
```

Open http://127.0.0.1:4173 for the landing page; the interactive workspace is at http://127.0.0.1:4173/workspace.html. The development server binds to loopback and serves only the deployable public/ folder. Local share links work on this computer only. Copy agent prompt is available on both pages; deploy the static app before sharing remotely.

Run the checks with:

```sh
npm test
```

The tests cover import schema and limits, Foglamp-compatible aliases, cycle and empty graph layout, backward edges and loops, categorized and legacy charts, optional detail/junction compatibility, safe SVG escaping, PNG size caps, share-link encoding/decoding and decompression limits, named-link clipboard contracts, resizable inspector preferences, and browser storage errors/recovery.

## Build a map

Choose **Copy agent prompt** on the landing page or in the workspace and paste it into a coding agent that is already working in the target repository. Unless you already chose a delivery mode in your instructions, the prompt first asks whether you want a JSON file to import yourself or a JSON file plus a clickable Atlas link, then waits for your answer. Manual mode creates only architecture-map.json; Automatic mode creates that file, a local Python link helper, and a named viewer link. Both modes ground claims in repository evidence, avoid secret values, and never upload or POST the map. The Automatic helper checks raw-file and formatted-input UTF-8 sizes as a preflight; Atlas canonical import validation remains authoritative.

The version 1 JSON format is:

```json
{
  "schemaVersion": 1,
  "project": {
    "name": "Example",
    "description": "A short project summary",
    "type": "Web application"
  },
  "nodes": [
    {
      "id": "api",
      "label": "HTTP API",
      "type": "API",
      "description": "Routes requests to application services",
      "source": "src/api",
      "group": "Server",
      "details": {
        "purpose": "Receives and validates requests before dispatch",
        "operation": "Routes accepted requests to application services",
        "inputs": ["HTTP request"],
        "outputs": ["JSON response"],
        "dependencies": ["Application Service"],
        "evidence": ["src/api/routes.ts: route handler"],
        "uncertainty": ["Retry behavior is configured elsewhere"]
      }
    },
    {
      "id": "service",
      "label": "Application Service",
      "type": "Service",
      "description": "Handles application rules behind the API",
      "source": "src/services",
      "group": "Server"
    }
  ],
  "edges": [
    {
      "id": "api-service",
      "source": "api",
      "target": "service",
      "label": "calls [observed]"
    }
  ]
}
```

A node may optionally include repository-grounded `details`: `purpose` (up to 500 characters), `operation` (up to 1,000), and `inputs`, `outputs`, `dependencies`, `evidence`, and `uncertainty` lists (up to 8 entries of 240 characters each). These details are shown in the inspector and in the accessible description of exported SVG nodes. The viewer treats all imported labels and details as text.

A node may optionally include an evidence-backed `chart` with a measured `label`, `kind` (`bar`, `line`, or `area`), 2 to 32 finite `values`, optional `unit`, and required `evidence`. Chart `label` is limited to 80 characters; `unit` to 24; `evidence` to 240. Independent categories use `kind: "bar"` and one `categories` label (up to 80 characters) per value. Ordered line/area series require matching category labels and an `order` explanation (up to 160 characters). Values are capped at +/- 1,000,000,000,000. Counts are not pass rates or proof of quality. Ask for a chart only when repository evidence supports its meaning; do not invent telemetry or dates. Older version 1 charts without categories remain valid and are shown as separate unlabeled bars with an explicit note that order is unspecified. Chart fields survive JSON export, share links, storage, and import. Use the local theme switch for light/dark surfaces; the preference is saved separately from project data, and SVG/PNG exports use the currently selected palette.

The **Timeline** view groups components into connected dependency steps numbered Step 01, Step 02, and so on. It shows direction and relationship labels, uses no calendar dates, and remains readable when a map has many stages. The **View example flow** action opens the demonstration request path as its own project without replacing saved maps; its area chart counts components per stage and its line chart counts outgoing edges per stage. Both are visibly marked as demonstration structural data, not runtime telemetry. You can also open workspace.html?example=flow directly: it reuses the existing bundled demo identity, consumes that query after opening, and never overrides a #map share fragment.

You can also paste JSON, choose a file, or drop a JSON file onto the graph. Imported text is shown as text, checked before it is used, and kept in browser storage. Use Export > Download JSON to make a backup and Import architecture to restore it in another browser. Clearing this browser's site data removes locally saved projects. Imports are limited to 2 MiB, 800 nodes, and 2,400 edges. Unsupported schema versions and broken references are rejected.

Edit nodes and connections in the app, drag nodes into a useful arrangement, and save JSON, SVG, or PNG. PNG rasterization is capped at 8,192 pixels per dimension and 24 million pixels total; the full SVG export remains available for larger maps.

On the Map, right-click empty canvas to add a component at that world position; panning and zooming are accounted for, and Cancel creates nothing. Right-click a component, or focus it and press ContextMenu/Shift+F10, to edit it, connect from it, or delete it with confirmation. Edit and connect forms save only on Save; Cancel returns focus to the originating component. Delete captures the component and map identity and removes it and its attached connections only after confirmation. Drag a circular output port to an input port to open a connection form with the direction prefilled. A canceled or invalid gesture does not change the map. Select a connection to edit it, or use its context menu to edit, reconnect either endpoint, delete with confirmation, or branch it. The context menu supports arrow keys, Home/End, Tab/Shift+Tab to leave for the next/previous page control, and Escape; dialogs return focus to the originating graph item.

A version 1 node may use `"type": "Junction"` with `"junction": true` as a presentation waypoint; it does not claim a runtime software component. Use junctions only for genuine fan-out or when splitting an evidenced connection makes the map clearer. Branching keeps the original source-to-junction direction and relationship, uses an unlabeled junction-to-original-target continuation, and labels the new junction-to-branch edge only with the user-provided relationship. The junction and both added connections are saved together only after Save. Cancel leaves the original graph untouched. Export and share preserve the marker. Existing self-links and parallel connections remain supported.

## Local storage and share links

The project library is stored in this browser's local storage for this site. It does not sync between devices. If browser storage is blocked, changes are only in the current session; use Export > Download JSON to keep a backup, then Import architecture to restore it elsewhere. Clearing this browser's site data removes saved projects. The app reports quota failures instead of claiming a save succeeded and preserves malformed saved bytes for recovery. The inspector's width and expanded state use separate guarded local preferences and never touch the project library. Drag its desktop divider or use the keyboard separator controls; on small screens the inspector stacks below the graph.

A share link embeds the graph in its URL fragment using gzip plus base64url, with a raw UTF-8 base64url fallback. Copy named link puts a project-named Markdown link and, where supported, a rich-text hyperlink on the clipboard; Copy link remains available for the complete plain URL. Prompt-generated viewer links target workspace.html; the site root is the landing page. Existing links with a #map fragment on the root are redirected to the workspace while preserving their query and fragment. The viewer decodes and validates the fragment locally. Browsers do not send a URL fragment in the HTTP request, and the app Content Security Policy blocks network connections. A copied link still contains the complete map data, so avoid sharing maps with sensitive repository details. Links over 60,000 characters are refused; use JSON export and local import instead. Recipients can pan, zoom, filter, inspect, edit, and save their own independent browser copy; their changes do not update the sender map or other recipients, and there is no live collaboration.


When you delete a project opened from a shared link, Atlas clears the URL fragment only when it exactly matches that project, so refreshing will not restore the deleted local copy. Canceling or deleting an unrelated project preserves the current fragment. Deletion does not revoke a copied URL: opening an older external link later can import a fresh snapshot again.

A link generated on localhost opens only on the same computer. For other people, first deploy the static app and use its public URL.

## Deploy free static hosting

The deployment output contains only `public/`. Tests and the local development server are outside the deployment output.

### Vercel

Import the repository and select **Other** as the Framework Preset. Enable **Build Command Override** and leave the build command blank because this static app has no build step. Set the output directory to `public`. The included `vercel.json` sets the output directory and security headers. See [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build).

### Cloudflare Pages

Create a Pages project from the repository. Use `exit 0` as the build command and `public` as the build output directory. The included `public/_headers` applies the security headers. See [Cloudflare Pages framework guides](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

After deployment, open the public app and use **Copy agent prompt** so the prompt includes its deployed base URL. Do not deploy using a localhost URL. No account credentials or deployment access are included with this project.

## Privacy and security

All graph import, editing, rendering, storage, and share-link generation happen in the browser. The app makes no network calls for graph content and sends no telemetry. Static hosting receives ordinary page requests only. Content Security Policy sets `connect-src 'none'`; labels and descriptions are rendered as text, and SVG exports escape XML text and attributes.



### Import/export size

Atlas limits imported JSON to 2 MiB and checks the exact UTF-8 size of the two-space formatted JSON export before accepting new imports or creating share links. Previously generated bounded v1 share links and existing browser-saved maps remain readable even if their formatted export exceeds that cap. Such maps can be saved only unchanged or with a smaller formatted export until they return under the limit; new imports are rejected if their formatted export would exceed it.

Existing oversized legacy maps can still be downloaded as JSON backups. A formatted backup larger than 2 MiB cannot be imported back into Atlas until the map is reduced below the limit. New accepted maps pass the formatted-size check before saving.

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the module layout and browser-local data flow.

## License

MIT. See [LICENSE](LICENSE).

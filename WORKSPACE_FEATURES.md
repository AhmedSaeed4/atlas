# Workspace features

Atlas still opens software architecture maps from an external coding agent, with account-free local maps and optional owner-controlled cloud workspaces. These tools use the existing theme and graph; none uploads source code or calls an AI service.

## Find and explore a map

- **Find a component** or Ctrl/Command+K searches labels, component types, paths and evidence text. Use Up/Down and Enter, or click a result, to reveal and smoothly center it over about 0.4 seconds. Pan, zoom, dragging, another result or switching views interrupts the move; reduced motion centers immediately. Escape dismisses results. Opening a match can reveal its hidden type or expand its group. The final position/zoom stays the same as immediate focusing.
- Maps open in the normal node-and-wire view. **Category frames** is optional: every assigned component remains visible, with direct internal connections and shared boundary inputs/outputs. Connections between the same two groups share one outside wire, then branch to the actual nodes inside. A group may contain one node; unassigned nodes keep their own ports. Click a shared wire to list the real relationships, then choose one to inspect or edit. The per-map choice is remembered in this browser; map JSON and cloud data are unchanged.
- Assign categories through the component editor's optional Category field. Blank means outside frames. Drag the category header to move every member together, including hidden members; wires follow and one Undo reverses the whole drop. Escape cancels it. Focus a header and press arrow keys to move10 units (Shift:40). Dragging a node still moves only that node; empty frame space pans. Viewer headers stay inert. Auto layout arranges frames; movement never changes membership. Existing maps are not classified automatically.
- **Explore** chooses downstream, upstream, immediate neighbours or all components for the selected component. Downstream is the default. Shared wires highlight when they contain a traced relationship; the Inspector retains the actual endpoints. Normal view retains optional group folding; frame mode keeps nodes visible and lists group counts without collapse controls. Timeline retains its existing grouping tools.
- Frame mode starts with spaced categories instead of reusing legacy normal-map coordinates. Frame moves are saved separately, so switching back restores normal placement. Auto layout resets only the active arrangement. Larger gaps reserve routing corridors; outside shared wires prefer separate rounded lanes. Single-connection badges are omitted, and bundled counts avoid frames/other badges. SVG/PNG follow the same drawing; JSON/cloud/checkpoints/share links retain both arrangements. Complex graphs may still contain crossings; select a component/wire to inspect its real relationships.
- At compact laptop/tablet widths, the Inspector overlays the graph. Its circular details control sits beside Map/Timeline. Selecting a component opens details; an empty-canvas click or Close dismisses it. At large widths it retains the normal docked layout. Full screen retains its existing separate exit control and Escape behavior.
- Ordinary component/connection text edits retain pan and zoom. Finder intentionally centers a result; topology/layout changes may fit the graph.
- **Full screen** and normal Map share the latest zoom and focus. Try zooming into a component, entering full screen, moving/zooming there, then exiting: the latest view carries back with you. Pan or zoom in normal view and enter again to check the same behavior in the other direction. Resizing while expanded also retains focus. There are no separate saved camera positions to jump back to. The existing expand/collapse transition stays smooth; reduced motion applies immediately.

Search and dragging reuse mounted graph elements and cached geometry. Drag input is batched once per animation frame; the moved component and incident connections update, along with cached routes near any changed category/card obstacle. Distant routes retain their geometry. Timeline avoids constructing the hidden SVG. These changes reduce repeated work; actual frame rates still depend on the map, browser and device.

## Manage a library

Open a map's sidebar settings to find **Manage map**, **Cloud & sharing** and **Remove map** in separate groups. Short descriptions explain each action, and icons help distinguish them. Availability and confirmations follow the same local/cloud permissions.

The sidebar search filters workspace names without changing the current map. A map's settings include **Pin in sidebar**. Pins change display order only, preserving canonical creation order and exact action targets. Cloud pins are separated by verified account; preferences contain IDs, not graph contents. The sidebar also shows last-edited context.

**Quick guide** explains the existing prompt → agent → import/link flow. A new empty local library has a dismissible invitation; existing libraries are not forced through onboarding. No prompt text or delivery workflow is replaced.

Each tab remembers its own current local or owned cloud workspace. Hints contain only IDs and library/owner identity, never graph data or permissions. Explicit agent links, shared links and examples take precedence.

## Back up and recover local maps

1. Open **Backups** in the sidebar, then **Back up maps** to download the local library, including all local graphs. Keep the JSON outside the browser if it matters. Cloud workspaces are not included.
2. Choose **Backups → Restore backup**, then select/paste a version1 library backup or ordinary single-map JSON.
3. Review the count and names. Apply explicitly to create fresh local copies; existing maps remain. Duplicate names get a restored suffix. This flow never uploads or links restored maps to a cloud account, even when future automatic saving is enabled.

Restore accepts up to 100 maps and a 16 MiB library input; every normalized map must also satisfy the ordinary 2 MiB, 800 component and 2,400 connection limits. All records are validated before changes are applied. If saved bytes are unreadable, the original bytes must be downloaded and explicit replacement consent given before recovery can replace that broken library.

When a local write fails or conflicts with a newer saved library, Atlas attempts a separate recovery draft. A notice offers review/restore as copies. The latest authoritative maps are retained, and only recovered versions covered by the restore are cleared. Multiple drafts may require multiple reviews. Duplicated tabs keep separate document versions. A later successful edit does not erase an older unrecovered draft.

Recovery normally survives reload through IndexedDB, scoped to the tab's session identity. When IndexedDB is blocked, a session-storage fallback can survive refresh in that tab. Closing the browser, losing the session identity, clearing site data or private-mode eviction can make drafts unavailable. If recovery is not durable, Atlas reports that and warns before leaving; ordinary successful saves do not cause a leave prompt. Download JSON when a notice says work is not saved.

## Update an existing map

Ordinary **Import architecture** still creates a separate map. To compare a fresh agent output with the current map:

1. Open **Map tools → Update current map** on an editable map.
2. Paste or choose the updated graph JSON. The preview prepares automatically (after a brief typing pause), showing added, changed and removed components/connections and project details. Apply becomes available when valid input contains changes. Preview changes remains available to refresh manually. Editing/clearing input immediately disables any old candidate; invalid or unchanged input cannot be applied.
3. **Keep current positions** preserves positions for matching component IDs, including the current calculated arrangement. New components use the normal layout. Uncheck it to accept positions in the incoming data.
4. Apply explicitly, or cancel to leave the map unchanged. Apply uses normal Undo, local guarded saving or the owner's existing cloud autosave queue. An online queued save is not server confirmation; wait for **Saved online**.

Matching uses stable component and connection IDs. Renamed IDs count as removal plus addition. This compares supplied architectural data, not source-code diffs or live runtime metrics. Switching maps/accounts, losing edit access or receiving a changed graph invalidates a stale preview. Shared viewers cannot apply updates.

## Device checkpoints

Open **Map tools → Checkpoints** on an editable local map or verified owned cloud map. Give the current version a name and save. Click anywhere on a checkpoint row, or use its Review button, to open its expanded change lists and make Restore available. The row also supports keyboard activation. Selection never restores automatically; Restore requires a separate click. Download, Rename and two-step Remove keep their separate actions and do not select another checkpoint. Restore uses the normal save and Undo flow. Closing a dialog before a pending restore read completes cancels the restore.

Checkpoints survive reload in this browser and origin, with at most eight checkpoints and a 12 MiB total budget per map. A full budget rejects a new checkpoint; existing named versions are never automatically evicted. They are device copies, not cloud revision history, and do not synchronize across devices. Another account or a shared viewer cannot access an owner's checkpoint tools.

Successful deletion of a map from this browser also removes that map's device checkpoints. **Clear local data** removes local maps and their named checkpoints; separate cloud maps and unsaved recovery drafts are retained. If the browser blocks cleanup, a warning reports the limitation. Cloud deletion from another device may leave inaccessible device records. Export important checkpoints before deletion, moving devices or clearing site data. Restored/imported copies have fresh map IDs and do not inherit the original map's checkpoints.

## Dismissing dialogs

Click the dimmed area outside a workspace dialog to cancel it, just as with Escape or its Close/Cancel button. This includes Quick guide, import/share/prompt, editors, confirmations, map versions and backup restore; Account/Settings use the same behavior on both pages. Outside dismissal never presses Save, Apply or a confirmation action. A drag beginning inside a dialog and ending outside does not dismiss it. An in-progress backup restore keeps its existing cancellation guard until the operation finishes. Unsaved form inputs are discarded exactly as with Cancel.

The single **Backups** sidebar entry opens a small menu with separately described download/restore actions. Click outside or press Escape to dismiss the menu. Optional backup/sharing help lives inside it. An available **Recover unsaved maps** action and its notice remain visible directly in the sidebar.

## Reproducible checks

```sh
npm test
node --test test/local-library.test.js test/workspace-safety.test.js test/map-version-tools.test.js
node --test test/graph-render-cache.test.js test/graph-exploration.test.js test/workspace-library-view.test.js
npm run test:browser:list
npx playwright install chromium
npm run test:browser
```

The browser suite launches the existing static server on loopback 4199 and uses fictional graphs in fresh contexts, reduced motion and no real accounts. It checks navigation, direct backup restore, finder/filters, camera stability, compact/full-screen Inspector, updates/checkpoints and incremental drag. Node controller tests also exercise delayed reads, cancellation, account changes and old async completions. Run provider-specific model/rules checks separately as described in the README. Never clear an existing user's data to test a feature.

Manual smoke checks: use disposable maps; verify two tabs retain separate selections across reload and synchronize clean edits; hold an editor in one tab to provoke a real conflict, then restore that draft as a copy without losing the newer original. Check both themes, Map/Timeline, keyboard result navigation/Escape, compact and phone widths, reduced motion, full-screen entry/exit and overlay dismissal. On an isolated cloud adapter, verify owned saves, account-switch clearing and read-only shared viewing. Simulated adapter checks do not establish live provider behavior.

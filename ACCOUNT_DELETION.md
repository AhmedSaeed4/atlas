# Account deletion

This feature is implemented locally and **disabled on hosted environments until configured**. It uses Cloudflare Pages Functions and one scheduled Cloudflare Worker, with Firebase REST APIs. It adds no runtime npm dependency or Firebase Cloud Functions subscription. Keep Cloudflare Workers on Free and Firebase on Spark; do not attach billing or upgrade a plan to enable it. Free quotas are finite and shared with other project traffic. Actual account billing settings and Cloudflare CPU usage must be checked before enablement; emulator/browser tests cannot establish them.

## User flow

Account → Delete account opens a separate confirmation showing the account identity, effects and local-map exception. The user types DELETE, then verifies the same Google identity. The trusted endpoint accepts no target UID: Firebase verifies the ID token and the server derives its UID. Verification must be recent (five minutes). Cancelled verification starts no deletion. The current operator administrator must transfer the operator role before self-deletion; there is no silent removal of the sole administrator.

After the server accepts the request, it cannot be cancelled. A scoped, signed seven-day recovery receipt is held in this tab's session storage, not in a URL. The UI issues bounded continuation requests, supports Resume after errors, and redirects home only after confirmed cloud/Auth deletion, sign-out and this device's cleanup. Do not delete a real account merely to review the UI. The separate loopback preview below uses fictional data.

## Server workflow and boundaries

`server/account-deletion.js` is an adapter-driven state machine. `server/deletion-firebase.js` implements authenticated Firebase REST operations; `server/deletion-handler.js` supplies strict same-origin JSON POST handling and generic error responses. Only `functions/api/account-deletion.js` is an HTTP entry. `public/_routes.json` invokes it only for that API route; ordinary static requests bypass Functions.

Each account has one private `accountDeletions/{uid}` job. Firestore rules use its existence to deny new maps/chunks, edits, profile reenrollment, and public reads of that owner's shared maps. The job cannot be read or edited by browser clients. Creation reads the operator configuration inside a Firestore transaction so a changed admin assignment cannot race the protection. Each cleanup step obtains a two-minute CAS lease; concurrent requests cannot both advance the state. Expired leases recover after a process crash.

Map cleanup queries ownership independently of the quota registry. It disables sharing and deletes **all** revision/chunk descendants in the application's schema, including missing revision parent documents. Each invocation handles at most one workspace step and at most twenty chunk deletes in one commit; it does not download graph payloads. Profile, allowance and quota records follow. Auth is deleted last; a lost Auth-delete response can be retried. Unsupported future account collections must be added to this workflow when introduced.

An operational job/lock remains for at least seventy minutes **after Auth deletion**, since existing ID tokens can otherwise remain usable. It contains UID, random nonce, phase and scheduling timestamps, not map content, name or email. Scheduled recovery removes that final record after the grace period. This is deliberate temporary retention, not instant removal of every operational record. A failed scheduled task retries on a later tick; quotas/outages can delay completion. Provider backups and recipients' downloaded copies cannot be recalled.

`workers/account-deletion-recovery.js` runs once a minute, processing one due job or removing one expired completed job. Its Firestore query uses the ordinary single-field nextRunAt index. With no jobs it still consumes approximately1,440 small query invocations daily. Large backlogs take longer; a foreground request normally advances its own job every500ms, for at most120 steps before offering resume. Each server invocation has a bounded number of outgoing calls below Workers Free's50-subrequest ceiling. Free-plan10ms CPU suitability requires an actual Cloudflare test; network time is separate. There is no unbounded recursive task or promise that a single request will finish a large account.

On the current device, successful completion removes that UID's cloud drafts/import candidates/navigation/associations and cloud checkpoints. Browser-local maps, local recovery backups, unrelated accounts, downloads and other browsers/devices remain separate. The future-upload preference is switched off. Session-storage failure does not stop the server recovery job, but may require signing in again to obtain a new receipt while the Auth account still exists; contact support if recovery cannot be resumed.

## Local review and automated verification

```sh
npm test
npx playwright test test/browser/account-deletion.spec.js
node scripts/run-cloud-rules.js --deletion-only
npm run test:cloud:rules
```

The emulator suite tests real REST transaction/lease writes, rule locks and recursive schema cleanup; its Auth-delete call is simulated, not a real Firebase account deletion. Node tests cover forged receipts, identity mismatch, administrator protection, recent login, concurrency, failure/retry and local-map preservation. Browser checks use fictional identities and simulated responses. Full browser regressions remain `npm run test:browser`.

For an interactive fictional preview, use the existing server in a separate loopback origin:

```powershell
$env:HOST = "127.0.0.1"
$env:PORT = "4176"
$env:ATLAS_DELETION_PREVIEW = "true"
node server.js
```

Open `http://127.0.0.1:4176/account-deletion-preview`. Test Keep account, DELETE confirmation, cancelled verification, interrupted cleanup/Resume, both themes and Reset demo. `dev/` is outside the static output. The preview has no credentials or real deletion adapter. The ordinary Node preview server returns not-configured for the real API; it never proxies to production.

## Required enablement (separate approval and testing)

Do not enable the endpoint before the deployed rules and scheduled recovery worker are verified. No credentials, billing or provider permissions are configured automatically by this repository.

1. Verify the actual Cloudflare Workers Free and Firebase Spark plans and remaining quotas. Keep the approved Pages project/build root at this repository and output public/. Functions are built from the sibling functions/ tree; do not upload server/ as static files.
2. Use a dedicated server service account, with only the needed Firestore document read/query/create/update/delete permissions and `firebaseauth.users.delete`. Scope it to this Firebase project. Do not use a personal owner credential or ship it to public/. IAM grants require explicit operator review.
3. Configure the following on **both** the Pages Function and recovery Worker: `FIREBASE_PROJECT_ID`, `FIREBASE_WEB_API_KEY` (existing public web key), secret `FIREBASE_SERVICE_ACCOUNT` (service-account JSON), and a high-entropy secret `ACCOUNT_DELETION_SECRET` (at least32 characters). Use the same signing secret for recovery. Never print secrets or paste them into source, test logs, URLs or chat. Local .dev.vars files are ignored.
4. Deploy and verify the new Firestore rules first using the established authenticated operator workflow. The HTTP feature and Worker remain disabled through `ACCOUNT_DELETION_ENABLED` until all components are ready. The checked-in Worker config has it false and no public workers.dev route. Deploy its code/cron with the Worker-specific config `workers/wrangler.deletion.json`, and configure its secrets through Cloudflare. Review existing Wrangler tooling before choosing a pinned CLI; none was added as a dependency here.
5. With a disposable account and fictional maps, verify the hosted endpoint's token verification, Google reauthentication, cloud record/Auth deletion, disabled public sharing, interruption/recovery and final marker removal. Inspect actual CPU/subrequest/quota metrics on the Free plan. Confirm the recovery cron runs independently after a browser closes. Never use the operator's account as a fixture.
6. Only after those checks, enable `ACCOUNT_DELETION_ENABLED=true` on both components. Preview deployments must stay disabled or use a separate disposable Firebase project; never give an automatically published preview production deletion credentials.

The scheduled-only production Worker uses the checked-in configuration, with explicit activation at deploy time (Node24 and the tested Wrangler version):

```sh
npx wrangler@4.157.0 deploy --config workers/wrangler.deletion.json --var ACCOUNT_DELETION_ENABLED:true
```

Its existing server secrets must be retained. Keep `workers_dev` disabled in production; the HTTP endpoint belongs to Pages. A Pages environment-setting change applies to the next deployment, so configure production activation before the approved main build and verify that actual main deployment. Retiring a review site must remove only its extra static/HTTP hosting and exact Auth domain, while preserving this Worker, its cron, secrets and all pending deletion jobs. Never remove locks or rotate the receipt key while accepted jobs still need recovery.

For an explicitly approved live review, an independently deployed Worker can serve the current local interface and the same deletion handler, with scheduled recovery on that Worker. Set secret `ACCOUNT_DELETION_TEST_EMAIL` to the designated disposable Google account: Firebase must return that exact verified email before any deletion job is created. Empty values deny all accounts; omit the setting only for an approved general release. Register only the exact review hostname with Firebase Auth. Keep the public Pages site disabled and its automatic previews credential-free. This review is a provider-backed test, not the fictional local preview, and does not publish or merge the product Git branch. Measure its real runtime and remove the temporary review hosting/domain after the approved production rollout and all pending jobs have drained.

The deletion-lock rule checks can add dependent document reads to ordinary cloud operations, so include them when reviewing the shared Firestore quota. If free execution limits cannot support measured cleanup, keep the endpoint disabled and report the limitation. Do not upgrade billing as a workaround. Rollback must preserve pending jobs and a working scheduled recovery path until they have drained; do not remove the lock rules while a deletion is in progress.

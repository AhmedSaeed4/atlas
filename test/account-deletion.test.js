import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeletionEngine, uidPath } from '../server/account-deletion.js';
import { handleDeletion } from '../server/deletion-handler.js';
import { issueReceipt, verifyReceipt, verifyIdentity, serverConfig } from '../server/deletion-firebase.js';
import { clearDeletedAccountStorage } from '../public/src/account-deletion-storage.js';
function fixture() {
  let job = null, version = 0, time = 1000000, maps = 2;const calls = [];
  const store = {
    admin: async () => ({ data: { adminUid: 'operator' } }),
    job: async () => job && structuredClone({ data: job, version }),
    createJob: async (_uid, data) => { job = data;version++; },
    updateJob: async (_uid, data, expected) => { if (expected !== version) throw Object.assign(Error(), { status: 412 });job = structuredClone(data);version++;return { data: job, version }; },
    removeJob: async () => { job = null;calls.push('lock'); },
    firstWorkspace: async () => maps ? {} : null,
    removeWorkspaceStep: async () => { calls.push('map');maps--; },
    removeAccountRecords: async () => calls.push('records'),
    removeAuth: async () => calls.push('auth'),
  };
  const clock = { now: () => time, nonce: () => 'fictional-random-nonce' };
  return { store, clock, engine: createDeletionEngine(store, clock), calls, advance: ms => time += ms, job: () => job };
}
test('deletion resumes, deletes Auth last and removes stale-token lock only after grace', async () => {
  const f = fixture(), receipt = await f.engine.begin({ uid: 'alpha', authTime: 1000 });
  assert.deepEqual(await f.engine.begin({ uid: 'alpha', authTime: 1000 }), receipt);
  for (let i = 0; i < 6; i++) await f.engine.step(receipt.uid, receipt.nonce);
  assert.deepEqual(f.calls, ['map', 'map', 'records', 'auth']);
  assert.equal((await f.engine.step(receipt.uid, receipt.nonce)).status, 'complete');
  assert.ok(f.job());f.advance(71 * 60000);await f.engine.step(receipt.uid, receipt.nonce);assert.equal(f.job(), null);
});
test('operator, stale login, future login and path injection never start cleanup', async () => {
  const f = fixture();
  for (const identity of [{ uid: 'operator', authTime: 1000 }, { uid: 'alpha', authTime: 0 }, { uid: 'alpha', authTime: 9000 }, { uid: '../beta', authTime: 1000 }]) await assert.rejects(f.engine.begin(identity));
  assert.equal(f.job(), null);assert.deepEqual(f.calls, []);assert.throws(() => uidPath(''));
});
test('concurrent step leases prevent double work; expired lease permits recovery', async () => {
  const f = fixture(), value = await f.engine.begin({ uid: 'alpha', authTime: 1000 });
  await Promise.all([f.engine.step(value.uid, value.nonce), f.engine.step(value.uid, value.nonce)]);
  assert.deepEqual(f.calls, ['map']);
  f.job().leaseUntil = f.clock.now() + 120000;
  await f.engine.step(value.uid, value.nonce);assert.equal(f.calls.length, 1);
  f.advance(120001);await f.engine.step(value.uid, value.nonce);assert.equal(f.calls.length, 2);
});
test('partial failure never reports completion and is retryable', async () => {
  const f = fixture(), value = await f.engine.begin({ uid: 'alpha', authTime: 1000 });
  const original = f.store.removeWorkspaceStep;f.store.removeWorkspaceStep = async () => { throw Error('offline'); };
  await assert.rejects(f.engine.step(value.uid, value.nonce));assert.equal(f.job().phase, 'maps');assert.equal(f.job().leaseUntil, 0);
  f.store.removeWorkspaceStep = original;await f.engine.step(value.uid, value.nonce);assert.deepEqual(f.calls, ['map']);
  await assert.rejects(f.engine.step(value.uid, 'someone-elses-receipt'), { code: 'invalid-receipt' });
});
test('receipt forgery and different signing keys are rejected', async () => {
  const secret = 'fictional-secret-'.repeat(4), receipt = await issueReceipt({ uid: 'alpha', nonce: 'n' }, secret);
  assert.equal((await verifyReceipt(receipt, secret)).uid, 'alpha');
  await assert.rejects(verifyReceipt(receipt + '.extra', secret));await assert.rejects(verifyReceipt(receipt, 'other'.repeat(10)));
  await assert.rejects(verifyReceipt('bad', secret));
});
const request = (body, headers = {}) => new Request('https://atlas.test/api/account-deletion', { method: 'POST', headers: { Origin: 'https://atlas.test', 'Content-Type': 'application/json', Authorization: 'Bearer fictional', ...headers }, body: JSON.stringify(body) });
test('endpoint rejects cross-origin requests, arbitrary UID, bad method and missing server config', async () => {
  assert.equal((await handleDeletion(request({ action: 'begin' }), {})).status, 503);
  assert.equal((await handleDeletion(request({ action: 'begin' }, { Origin: 'https://evil.test' }), {})).status, 403);
  assert.equal((await handleDeletion(request({ action: 'begin', uid: 'victim' }), {})).status, 400);
  assert.equal((await handleDeletion(new Request('https://atlas.test/api/account-deletion'), {})).status, 405);
  assert.throws(() => serverConfig({ ACCOUNT_DELETION_ENABLED: 'false' }));
});
test('endpoint derives owner from verified identity and requires issued receipt for continuation', async () => {
  const f = fixture(), env = { ACCOUNT_DELETION_SECRET: 'fictional'.repeat(8) };
  const deps = { store: f.store, clock: f.clock, config: () => ({}), identity: async () => ({ uid: 'alpha', authTime: 1000 }) };
  const result = await (await handleDeletion(request({ action: 'begin' }), env, deps)).json();
  assert.equal((await verifyReceipt(result.receipt, env.ACCOUNT_DELETION_SECRET)).uid, 'alpha');
  const continued = await handleDeletion(request({ action: 'continue' }, { Authorization: 'Deletion ' + result.receipt }), env, deps);
  assert.equal(continued.status, 200);assert.deepEqual(f.calls, ['map']);
});
test('decoded claims alone cannot authenticate; Firebase rejection or different returned UID fails', async () => {
  const token = 'x.' + btoa(JSON.stringify({ sub: 'alpha', aud: 'demo', iss: 'https://securetoken.google.com/demo', iat: Date.now()/1000, exp: Date.now()/1000+100, auth_time: Date.now()/1000 })) + '.x';
  await assert.rejects(verifyIdentity(token, { FIREBASE_PROJECT_ID: 'demo' }, async () => new Response('{}', { status: 400 })));
  await assert.rejects(verifyIdentity(token, { FIREBASE_PROJECT_ID: 'demo' }, async () => Response.json({ users: [{ localId: 'beta' }] })));
});
test('device cleanup preserves local maps and other accounts', () => {
  const records = new Map([['project-atlas-library-v1', 'local-map'], ['atlas.online.owner-draft.v1:alpha:map', 'private'], ['atlas.online.owner-draft.v1:beta:map', 'other'], ['atlas.workspace.navigation.v1', JSON.stringify({ ownerUid: 'alpha' })]]);
  const storage = { get length() { return records.size; }, key: i => [...records.keys()][i], getItem: k => records.get(k), removeItem: k => records.delete(k) };
  clearDeletedAccountStorage('alpha', [storage]);assert.equal(records.get('project-atlas-library-v1'), 'local-map');assert.equal(records.get('atlas.online.owner-draft.v1:beta:map'), 'other');assert.equal(records.size, 2);
});

test('revoked sessions and lookup quota failures are rejected before any deletion', async () => {
  const now = Date.now() / 1000;
  const token = 'x.' + btoa(JSON.stringify({ sub: 'alpha', aud: 'demo', iss: 'https://securetoken.google.com/demo', iat: now, exp: now + 100, auth_time: now - 60 })) + '.x';
  await assert.rejects(verifyIdentity(token, { FIREBASE_PROJECT_ID: 'demo' }, async () => Response.json({ users: [{ localId: 'alpha', validSince: now - 30 }] })), { code: 'sign-in-required' });
  await assert.rejects(verifyIdentity(token, { FIREBASE_PROJECT_ID: 'demo' }, async () => Response.json({}, { status: 429 })), { code: 'quota-exceeded', status: 429 });
});

test('review deployment accepts only the provider-verified test account', async () => {
  const now = Date.now() / 1000;
  const token = 'x.' + btoa(JSON.stringify({ sub: 'alpha', aud: 'demo', iss: 'https://securetoken.google.com/demo', iat: now, exp: now + 100, auth_time: now, email: 'review@example.test', email_verified: true })) + '.x';
  const env = { FIREBASE_PROJECT_ID: 'demo', ACCOUNT_DELETION_TEST_EMAIL: 'review@example.test' };
  const identity = { localId: 'alpha', email: 'REVIEW@example.test', emailVerified: true };
  const lookup = user => async () => Response.json({ users: [user] });
  assert.equal((await verifyIdentity(token, env, lookup(identity))).uid, 'alpha');
  for (const user of [{ ...identity, email: 'other@example.test' }, { ...identity, emailVerified: false }, { localId: 'alpha' }]) await assert.rejects(verifyIdentity(token, env, lookup(user)), { code: 'testing-restricted', status: 403 });
  await assert.rejects(verifyIdentity(token, { ...env, ACCOUNT_DELETION_TEST_EMAIL: '' }, lookup(identity)), { code: 'testing-restricted' });
  assert.equal((await verifyIdentity(token, { FIREBASE_PROJECT_ID: 'demo' }, lookup({ localId: 'alpha' }))).uid, 'alpha');
});

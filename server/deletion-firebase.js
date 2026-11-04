import { DeletionError, uidPath } from './account-deletion.js';
const encoder = new TextEncoder();
const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
const encode = value => b64(encoder.encode(JSON.stringify(value)));
const decode = value => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0))));
let accessCache;
export function serverConfig(env) {
  if (env.ACCOUNT_DELETION_ENABLED !== 'true' || !env.FIREBASE_SERVICE_ACCOUNT || !env.FIREBASE_WEB_API_KEY || !env.ACCOUNT_DELETION_SECRET || env.ACCOUNT_DELETION_SECRET.length < 32) throw new DeletionError('not-configured', 503);
  let account; try { account = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT); } catch { throw new DeletionError('not-configured', 503); }
  if (!account.project_id || !account.client_email || !account.private_key || account.project_id !== env.FIREBASE_PROJECT_ID) throw new DeletionError('not-configured', 503);
  return account;
}
async function jsonFetch(fetcher, url, options = {}, missing = false) {
  const response = await fetcher(url, { ...options, signal: AbortSignal.timeout(15000) });
  if (missing && response.status === 404) return null;
  const body = await response.json();
  if (!response.ok) throw new DeletionError(response.status === 429 ? 'quota-exceeded' : 'service-unavailable', response.status === 429 ? 429 : ['ABORTED', 'FAILED_PRECONDITION', 'ALREADY_EXISTS'].includes(body.error?.status) ? 409 : response.status === 409 || response.status === 412 ? response.status : 503);
  return body;
}
async function accessToken(account, fetcher) {
  if (accessCache?.email === account.client_email && accessCache.expires > Date.now()) return accessCache.token;
  const issued = Math.floor(Date.now() / 1000);
  const data = encode({ alg: 'RS256', typ: 'JWT' }) + '.' + encode({ iss: account.client_email, scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/identitytoolkit', aud: 'https://oauth2.googleapis.com/token', iat: issued, exp: issued + 3600 });
  const raw = account.private_key.replace(/-----[^-]+-----|\s/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(raw), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const assertion = data + '.' + b64(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(data)));
  const result = await jsonFetch(fetcher, 'https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
  if (!result.access_token) throw new DeletionError('service-unavailable', 503);
  accessCache = { email: account.client_email, token: result.access_token, expires: Date.now() + 3300000 };
  return result.access_token;
}
export async function verifyIdentity(token, env, fetcher = fetch) {
  if (!token || token.length > 10000) throw new DeletionError('sign-in-required', 401);
  let claims; try { claims = decode(token.split('.')[1]); } catch { throw new DeletionError('sign-in-required', 401); }
  if (claims.aud !== env.FIREBASE_PROJECT_ID || claims.iss !== 'https://securetoken.google.com/' + env.FIREBASE_PROJECT_ID || claims.exp <= Date.now() / 1000 || !Number.isFinite(claims.iat) || claims.iat > Date.now() / 1000 + 30) throw new DeletionError('sign-in-required', 401);
  // Firebase validates the token cryptographically. Decoding alone is never authorization.
  const response = await fetcher('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + encodeURIComponent(env.FIREBASE_WEB_API_KEY), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new DeletionError(response.status === 429 ? 'quota-exceeded' : response.status >= 500 ? 'service-unavailable' : 'sign-in-required', response.status === 429 ? 429 : response.status >= 500 ? 503 : 401);
  const user = (await response.json()).users?.[0];
  if (!user || user.disabled || user.localId !== claims.sub || Number(user.validSince || 0) > claims.auth_time) throw new DeletionError('sign-in-required', 401);
  // A review deployment accepts only its designated, provider-verified account.
  if (env.ACCOUNT_DELETION_TEST_EMAIL !== undefined && (!env.ACCOUNT_DELETION_TEST_EMAIL?.trim() || user.emailVerified !== true || user.email?.trim().toLowerCase() !== env.ACCOUNT_DELETION_TEST_EMAIL.trim().toLowerCase())) throw new DeletionError('testing-restricted', 403);
  return { uid: uidPath(user.localId), authTime: claims.auth_time };
}
async function receiptKey(secret) { return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
export async function issueReceipt(value, secret) {
  const payload = encode({ ...value, exp: Math.floor(Date.now() / 1000) + 7 * 86400 });
  return payload + '.' + b64(await crypto.subtle.sign('HMAC', await receiptKey(secret), encoder.encode(payload)));
}
export async function verifyReceipt(receipt, secret) {
  try {
    if (typeof receipt !== 'string' || receipt.length > 2000) throw Error();
    const [payload, signature, extra] = receipt.split('.');
    const bytes = Uint8Array.from(atob(signature.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0));
    if (extra || !await crypto.subtle.verify('HMAC', await receiptKey(secret), bytes, encoder.encode(payload))) throw Error();
    const value = decode(payload);uidPath(value.uid);
    if (value.exp <= Date.now() / 1000 || typeof value.nonce !== 'string') throw Error();
    return value;
  } catch { throw new DeletionError('invalid-receipt', 403); }
}
const fields = value => Object.fromEntries(Object.entries(value).map(([key, val]) => [key, typeof val === 'number' ? { doubleValue: val } : { stringValue: val }]));
const unpack = doc => doc && ({ data: Object.fromEntries(Object.entries(doc.fields || {}).map(([key, val]) => [key, val.stringValue ?? val.doubleValue ?? Number(val.integerValue)])), version: doc.updateTime });
export function createFirebaseDeletionStore(env, account, fetcher = fetch) {
  const root = `projects/${account.project_id}/databases/(default)/documents`;
  async function request(suffix, method = 'GET', body, missing = false) {
    return jsonFetch(fetcher, 'https://firestore.googleapis.com/v1/' + root + suffix, { method, headers: { Authorization: 'Bearer ' + await accessToken(account, fetcher), 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) }, missing);
  }
  const get = path => request('/' + path, 'GET', null, true);
  const commit = writes => request(':commit', 'POST', { writes });
  const remove = paths => commit(paths.map(path => ({ delete: root + '/' + path })));
  const query = structuredQuery => request(':runQuery', 'POST', { structuredQuery });
  return {
    admin: async () => unpack(await get('system/adminAccess')),
    job: async uid => unpack(await get('accountDeletions/' + uidPath(uid))),
    createJob: async (uid, data) => {
      const { transaction } = await request(':beginTransaction', 'POST', {});
      try {
        const reads = await request(':batchGet', 'POST', { documents: [root + '/system/adminAccess'], transaction });
        const admin = reads.find(row => row.found)?.found;
        if (admin?.fields?.adminUid?.stringValue === uid) throw new DeletionError('administrator-handoff-required', 409);
        await request(':commit', 'POST', { transaction, writes: [{ update: { name: root + '/accountDeletions/' + uidPath(uid), fields: fields(data) }, currentDocument: { exists: false } }] });
      } catch (error) { try { await request(':rollback', 'POST', { transaction }); } catch { /* transaction expires */ } throw error; }
    },
    updateJob: async (uid, data, version) => {
      const result = await commit([{ update: { name: root + '/accountDeletions/' + uidPath(uid), fields: fields(data) }, currentDocument: { updateTime: version } }]);
      return { data, version: result.writeResults[0].updateTime };
    },
    removeJob: (uid, version) => commit([{ delete: root + '/accountDeletions/' + uidPath(uid), currentDocument: { updateTime: version } }]),
    firstWorkspace: async uid => {
      const result = await query({ from: [{ collectionId: 'workspaces' }], where: { fieldFilter: { field: { fieldPath: 'ownerId' }, op: 'EQUAL', value: { stringValue: uidPath(uid) } } }, select: { fields: [{ fieldPath: 'ownerId' }] }, limit: 1 });
      return result.find(row => row.document)?.document;
    },
    removeWorkspaceStep: async (uid, workspace) => {
      if (workspace.fields?.ownerId?.stringValue !== uid || !workspace.name.startsWith(root + '/workspaces/')) throw new DeletionError('invalid-owner', 403);
      const path = workspace.name.slice(root.length + 1);
      if (!/^workspaces\/[A-Za-z0-9_-]{22}$/.test(path)) throw new DeletionError('invalid-workspace', 503);
      await request('/' + path + '?updateMask.fieldPaths=shared&updateMask.fieldPaths=deleting', 'PATCH', { fields: { shared: { booleanValue: false }, deleting: { booleanValue: true } } });
      // showMissing discovers revision parents that only have chunk subcollections.
      const revisions = await request('/' + path + '/revisions?pageSize=1&showMissing=true&mask.fieldPaths=_deletionUnused');
      const revision = revisions.documents?.[0];
      if (!revision) { await remove([path]); return; }
      const revisionPath = revision.name.slice(root.length + 1);
      if (!revisionPath.startsWith(path + '/revisions/') || revisionPath.split('/').length !== 4) throw new DeletionError('invalid-revision', 503);
      const chunks = await request('/' + revisionPath + '/chunks?pageSize=20&mask.fieldPaths=index');
      const names = (chunks.documents || []).map(doc => doc.name.slice(root.length + 1));
      if (names.some(name => !name.startsWith(revisionPath + '/chunks/') || name.split('/').length !== 6)) throw new DeletionError('invalid-chunk', 503);
      if (names.length) await remove(names);
      else await remove([revisionPath]);
    },
    removeAccountRecords: uid => remove(['accountProfiles/', 'accountLimits/', 'workspaceQuota/'].map(prefix => prefix + uidPath(uid))),
    removeAuth: async uid => {
      const response = await fetcher(`https://identitytoolkit.googleapis.com/v1/projects/${account.project_id}/accounts:delete`, { method: 'POST', headers: { Authorization: 'Bearer ' + await accessToken(account, fetcher), 'Content-Type': 'application/json' }, body: JSON.stringify({ localId: uidPath(uid) }), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok && result.error?.message !== 'USER_NOT_FOUND') throw new DeletionError('service-unavailable', 503);
    },
    dueJob: async () => {
      const results = await query({ from: [{ collectionId: 'accountDeletions' }], where: { fieldFilter: { field: { fieldPath: 'nextRunAt' }, op: 'LESS_THAN_OR_EQUAL', value: { doubleValue: Date.now() } } }, orderBy: [{ field: { fieldPath: 'nextRunAt' }, direction: 'ASCENDING' }], limit: 1 });
      const doc = results.find(row => row.document)?.document;
      return doc ? { uid: doc.name.split('/').at(-1), ...unpack(doc).data } : null;
    },
  };
}

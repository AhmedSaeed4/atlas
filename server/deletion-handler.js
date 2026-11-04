import { createDeletionEngine, DeletionError } from './account-deletion.js';
import { serverConfig, createFirebaseDeletionStore, verifyIdentity, issueReceipt, verifyReceipt } from './deletion-firebase.js';
const response = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' } });
export async function handleDeletion(request, env, dependencies = {}) {
  try {
    if (request.method !== 'POST') return response({ code: 'method-not-allowed' }, 405);
    if (request.headers.get('Origin') !== new URL(request.url).origin || request.headers.get('Content-Type') !== 'application/json') throw new DeletionError('invalid-request', 403);
    if (Number(request.headers.get('Content-Length') || 0) > 256) throw new DeletionError('invalid-request', 413);
    const raw = await request.text();if (raw.length > 256) throw new DeletionError('invalid-request', 413);
    let body;try { body = JSON.parse(raw); } catch { throw new DeletionError('invalid-request'); }
    if (!body || Object.keys(body).some(key => key !== 'action') || !['begin', 'continue'].includes(body.action)) throw new DeletionError('invalid-request');
    const account = (dependencies.config || serverConfig)(env);
    const store = dependencies.store || createFirebaseDeletionStore(env, account);
    const engine = createDeletionEngine(store, dependencies.clock);
    const authorization = request.headers.get('Authorization') || '';
    if (body.action === 'begin') {
      if (!authorization.startsWith('Bearer ')) throw new DeletionError('sign-in-required', 401);
      const identity = await (dependencies.identity || verifyIdentity)(authorization.slice(7), env);
      const value = await engine.begin(identity);
      return response({ status: 'working', receipt: await issueReceipt(value, env.ACCOUNT_DELETION_SECRET) });
    }
    if (!authorization.startsWith('Deletion ')) throw new DeletionError('invalid-receipt', 403);
    const value = await verifyReceipt(authorization.slice(9), env.ACCOUNT_DELETION_SECRET);
    return response(await engine.step(value.uid, value.nonce));
  } catch (error) {
    // Never expose Google responses, credentials, tokens or account identifiers.
    return response({ code: error instanceof DeletionError ? error.code : 'service-unavailable' }, error instanceof DeletionError ? error.status : 503);
  }
}
export async function recoverDeletion(env) {
  const account = serverConfig(env), store = createFirebaseDeletionStore(env, account);
  const job = await store.dueJob();
  if (job) await createDeletionEngine(store).step(job.uid, job.nonce);
}

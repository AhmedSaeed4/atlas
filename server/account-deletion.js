// Trusted, resumable deletion. The adapter is server-only; no admin key enters public/.
export class DeletionError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}
export const uidPath = uid => {
  if (typeof uid !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(uid)) throw new DeletionError('invalid-identity', 401);
  return uid;
};
export function createDeletionEngine(store, { now = Date.now, nonce = () => crypto.randomUUID() } = {}) {
  async function begin(identity) {
    const uid = uidPath(identity.uid);
    if (!Number.isFinite(identity.authTime) || now() / 1000 - identity.authTime > 300 || identity.authTime > now() / 1000 + 30) throw new DeletionError('recent-login-required', 401);
    const admin = await store.admin();
    if (admin?.data?.adminUid === uid) throw new DeletionError('administrator-handoff-required', 409);
    let job = await store.job(uid);
    if (!job) {
      try { await store.createJob(uid, { nonce: nonce(), phase: 'maps', createdAt: now(), eraseAfter: now() + 70 * 60000, leaseUntil: 0, nextRunAt: now() }, admin); }
      catch (error) { if (error.code === 'administrator-handoff-required' || (error.status !== 409 && error.status !== 412)) throw error; }
      job = await store.job(uid);
    }
    if (!job) throw new DeletionError('retry-required', 503);
    return { uid, nonce: job.data.nonce };
  }
  async function step(uid, expectedNonce) {
    uidPath(uid);
    const snapshot = await store.job(uid);
    if (!snapshot) return { status: 'complete' }; // Only callers with an issued receipt reach step.
    const job = snapshot.data;
    if (expectedNonce !== job.nonce) throw new DeletionError('invalid-receipt', 403);
    if (job.phase === 'done') {
      if (now() >= job.eraseAfter) await store.removeJob(uid, snapshot.version);
      return { status: 'complete' };
    }
    if (job.leaseUntil > now()) return { status: 'working' };
    let leased;
    try { leased = await store.updateJob(uid, { ...job, leaseUntil: now() + 120000, nextRunAt: now() + 120000 }, snapshot.version); }
    catch (error) { if ([409, 412].includes(error.status)) return { status: 'working' }; throw error; }
    try {
      let phase = job.phase;
      if (phase === 'maps') {
        const workspace = await store.firstWorkspace(uid);
        if (workspace) await store.removeWorkspaceStep(uid, workspace);
        else phase = 'records';
      } else if (phase === 'records') {
        await store.removeAccountRecords(uid);
        phase = 'auth';
      } else if (phase === 'auth') {
        await store.removeAuth(uid);
        phase = 'done';
      } else throw new DeletionError('invalid-job', 503);
      const eraseAfter = phase === 'done' ? Math.max(job.eraseAfter, now() + 70 * 60000) : job.eraseAfter;
      await store.updateJob(uid, { ...job, phase, eraseAfter, leaseUntil: 0, nextRunAt: phase === 'done' ? eraseAfter : now() + 60000 }, leased.version);
      return { status: phase === 'done' ? 'complete' : 'working' };
    } catch (error) {
      // Lease expiry permits recovery even if releasing it also fails.
      try { await store.updateJob(uid, { ...job, leaseUntil: 0, nextRunAt: now() + 300000 }, leased.version); } catch { /* retained for scheduled retry */ }
      throw error;
    }
  }
  return { begin, step };
}

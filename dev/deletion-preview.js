import { initAccountDeletion } from '/src/account-deletion.js';
let user = { uid: 'preview-owner', email: 'alex@example.test' }, listeners = [], remaining = 3, interrupted = false;
const account = {
  getState: () => ({ user }),
  subscribe: callback => { listeners.push(callback);callback({ user });return () => {}; },
  getService: async () => ({ prepareAccountDeletion: async () => {
    if (document.getElementById('preview-cancel').checked) throw Object.assign(Error(), { code: 'auth/popup-closed-by-user' });
    return 'fictional-demo-token';
  } }),
  signOut: async () => { user = null;listeners.forEach(callback => callback({ user })); },
};
initAccountDeletion({ account, navigate: () => {
  document.getElementById('account-delete-dialog').close();
  document.getElementById('preview-result').textContent = 'Demo complete: the account was removed and the real application would now redirect to the homepage. No real data was changed.';
}, fetcher: async (_url, options) => {
  await new Promise(resolve => setTimeout(resolve, 700));
  const { action } = JSON.parse(options.body);
  if (action === 'begin') return Response.json({ status: 'working', receipt: 'fictional-preview-receipt' });
  if (document.getElementById('preview-interrupt').checked && !interrupted) { interrupted = true;throw TypeError('Simulated network interruption'); }
  return Response.json({ status: --remaining <= 0 ? 'complete' : 'working' });
} });
document.getElementById('preview-open').onclick = () => document.getElementById('account-modal').showModal();
document.getElementById('preview-close').onclick = () => document.getElementById('account-modal').close();
document.getElementById('preview-reset').onclick = () => { sessionStorage.removeItem('atlas.account.deletion.v1');location.reload(); };

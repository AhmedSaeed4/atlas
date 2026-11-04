import { bindDialogBackdropClose } from './dialog-dismissal.js';
import { clearDeletedAccountStorage, clearDeletedAccountCheckpoints } from './account-deletion-storage.js';
const RECEIPT_KEY = 'atlas.account.deletion.v1';
const messages = {
  'not-configured': 'Account deletion is not enabled on this server yet. Nothing was deleted. You can contact support for help.',
  'testing-restricted': 'Account deletion is currently restricted to the designated test account. Nothing was deleted.',
  'administrator-handoff-required': 'This account manages Atlas. Transfer administrator access before deleting it. Nothing was deleted.',
  'recent-login-required': 'Please verify your Google account again before deleting it.',
  'sign-in-required': 'Please sign in again to verify this account.',
  'account-changed': 'Your account changed. No deletion was requested for the new account. Close this dialog and verify the intended account.',
  'invalid-receipt': 'This recovery session has expired. Sign in to the same account and start deletion again to resume.',
  'quota-exceeded': 'The service has reached a usage limit. Deletion is not complete. Leave this request saved and try again later.',
};
export function deletionMessage(error) {
  if (String(error?.code).includes('popup-blocked')) return 'Allow the Google verification popup for Atlas, then try again. Nothing was deleted.';
  if (String(error?.code).includes('popup-closed') || String(error?.code).includes('cancelled-popup')) return 'Verification was cancelled. Nothing was deleted.';
  return messages[error?.code] || 'Deletion could not finish. Your request is saved if deletion has started. Try again; do not assume your account has been deleted.';
}
export async function deletionRequest(action, authorization, fetcher = fetch) {
  const response = await fetcher('./api/account-deletion', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: authorization }, body: JSON.stringify({ action }), credentials: 'omit', signal: AbortSignal.timeout(20000) });
  let body;try { body = await response.json(); } catch { throw Object.assign(Error(), { code: 'not-configured' }); }
  if (!response.ok) throw Object.assign(Error(), { code: body.code });
  if (!['working', 'complete'].includes(body.status) || (action === 'begin' && typeof body.receipt !== 'string')) throw Error('Invalid deletion response');
  return body;
}
export function initAccountDeletion({ root = document, account, fetcher = fetch, navigate = url => location.replace(url), storage } = {}) {
  if (!root.createElement) return () => {};
  if (storage === undefined) { try { storage = globalThis.sessionStorage; } catch { storage = null; } }
  const accountDialog = root.getElementById('account-modal');
  if (!accountDialog || !account) return () => {};
  const section = root.createElement('div');section.className = 'account-delete-section';section.hidden = true;
  section.innerHTML = '<div><strong>Delete account</strong><p>Permanently remove your Atlas account and cloud maps.</p></div><button type="button" class="account-delete-link">Delete account…</button>';
  accountDialog.querySelector('.account-actions').after(section);
  const dialog = root.createElement('dialog');dialog.className = 'account-delete-dialog';dialog.id = 'account-delete-dialog';dialog.setAttribute('aria-labelledby', 'account-delete-title');
  dialog.innerHTML = '<div class="account-delete-shell"><div class="account-delete-heading"><h2 id="account-delete-title">Delete your Atlas account?</h2><button type="button" class="account-delete-close" aria-label="Close account deletion"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg></button></div><p class="account-delete-identity"></p><p>Your cloud maps, shared links and account records will be removed permanently. Download any maps you want to keep before continuing.</p><div class="account-delete-note">Local maps stored in this browser will stay. Your Google account is not deleted. Copies already downloaded by other people cannot be recalled.</div><label class="account-delete-field" for="account-delete-confirm">Type <strong>DELETE</strong> to confirm<input id="account-delete-confirm" autocomplete="off" spellcheck="false" autocapitalize="characters"></label><p class="account-delete-status" role="status" aria-live="polite"></p><p class="account-delete-error" role="alert" hidden></p><div class="account-delete-actions"><button type="button" class="account-delete-cancel">Keep account</button><button type="button" class="account-delete-submit" disabled>Verify and delete account</button></div><p class="account-delete-footnote">You will verify with Google before deletion starts. After it starts, deletion cannot be undone.</p><a href="mailto:mizuedit3@gmail.com" class="account-delete-support">Contact support</a></div>';
  root.body.append(dialog);
  const pick = selector => dialog.querySelector(selector);
  const input = pick('input'), submit = pick('.account-delete-submit'), error = pick('.account-delete-error'), status = pick('.account-delete-status');
  let busy = false, pending = null, disposed = false, uid = '', runningUid = '';
  try { const saved = JSON.parse(storage?.getItem(RECEIPT_KEY) || 'null');if (typeof saved?.receipt === 'string' && typeof saved?.uid === 'string') pending = saved; } catch { /* no unsafe fallback */ }
  function render() {
    const user = account.getState?.().user;
    section.hidden = !user?.uid && !pending;
    section.querySelector('button').disabled = busy;
    const canResume = pending && (!user?.uid || user.uid === pending.uid);
    input.disabled = busy || Boolean(canResume);
    submit.disabled = busy || (!canResume && (input.value !== 'DELETE' || !user?.uid));
    submit.textContent = busy ? 'Deleting account…' : canResume ? 'Resume deletion' : 'Verify and delete account';
    pick('.account-delete-identity').textContent = canResume ? 'Deletion request saved on this device.' : user?.email || user?.displayName || 'Your Atlas account';
    pick('.account-delete-cancel').textContent = pending ? 'Close for now' : 'Keep account';
    pick('.account-delete-footnote').textContent = pending ? 'Deletion has started and cannot be cancelled. A server recovery task can continue it if you close this page.' : 'You will verify with Google before deletion starts. After it starts, deletion cannot be undone.';
  }
  const close = () => {
    if (busy || disposed || !dialog.open) return;
    // Keep a native modal/backdrop mounted throughout the handoff. Native
    // 'close' is queued, so reopening the parent from that event exposes the page.
    if (!accountDialog.open) accountDialog.showModal();
    for (const trigger of root.querySelectorAll('[data-open-account]')) trigger.setAttribute('aria-expanded', 'true');
    dialog.close();
    section.querySelector('button').focus({ preventScroll: true });
  };
  pick('.account-delete-cancel').onclick = close;pick('.account-delete-close').onclick = close;
  dialog.addEventListener('cancel', event => { event.preventDefault();close(); });bindDialogBackdropClose(dialog, close);
  input.oninput = render;
  section.querySelector('button').onclick = () => {
    uid = account.getState?.().user?.uid || pending?.uid || '';
    input.value = '';error.hidden = true;status.textContent = '';render();
    dialog.showModal();accountDialog.close();
    for (const trigger of root.querySelectorAll('[data-open-account]')) trigger.setAttribute('aria-expanded', 'false');
    if (!pending) input.focus();
  };
  submit.onclick = async () => {
    if (busy || submit.disabled) return;
    const user = account.getState?.().user;
    if (user?.uid && user.uid !== uid) { error.textContent = 'Your account changed. Close this dialog and choose the account again.';error.hidden = false;return; }
    if (pending && user?.uid && pending.uid !== user.uid) { error.textContent = 'A deletion is pending for a different account. Sign out before resuming it.';error.hidden = false;return; }
    busy = true;runningUid = uid;error.hidden = true;status.textContent = pending ? 'Continuing secure cleanup…' : 'Waiting for Google verification…';render();
    try {
      if (!pending) {
        const service = await account.getService();
        if (!service.prepareAccountDeletion) throw Object.assign(Error(), { code: 'not-configured' });
        const token = await service.prepareAccountDeletion(uid);
        if (account.getState?.().user?.uid !== uid) throw Object.assign(Error(), { code: 'account-changed' });
        const result = await deletionRequest('begin', 'Bearer ' + token, fetcher);
        pending = { uid, receipt: result.receipt };
        try { storage?.setItem(RECEIPT_KEY, JSON.stringify(pending)); } catch { /* server recovery still owns the request */ }
      }
      status.textContent = 'Removing cloud maps and account records. This may take a moment…';
      // A bounded foreground run; scheduled recovery continues larger accounts.
      for (let step = 0; step < 120 && !disposed; step++) {
        const current = account.getState?.().user;
        if (current?.uid && current.uid !== runningUid) throw Object.assign(Error(), { code: 'account-changed' });
        const result = await deletionRequest('continue', 'Deletion ' + pending.receipt, fetcher);
        if (result.status === 'complete') {
          // Never sign out another account selected while a request was in flight.
          if (account.getState?.().user?.uid && account.getState().user.uid !== runningUid) throw Object.assign(Error(), { code: 'account-changed' });
          await account.signOut();
          account.setSaveFutureMaps?.(false);
          const stores = [storage];try { stores.push(globalThis.localStorage); } catch { /* unavailable */ }
          clearDeletedAccountStorage(runningUid, stores);
          await clearDeletedAccountCheckpoints(runningUid);
          try { storage?.removeItem(RECEIPT_KEY); } catch { /* redirect still succeeds */ }
          status.textContent = 'Account deleted. Returning to the homepage…';
          navigate('./?account=deleted');return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      status.textContent = 'Cleanup is still in progress. You can close this page and resume later.';
    } catch (failure) { error.textContent = deletionMessage(failure);error.hidden = false;status.textContent = ''; }
    finally { busy = false;render(); }
  };
  const unsubscribe = account.subscribe?.(() => { render(); });render();
  return () => { disposed = true;unsubscribe?.();section.remove();dialog.remove(); };
}

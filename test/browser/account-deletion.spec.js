import { test, expect } from '@playwright/test';
async function prepare(page, { fail = false, path = '/' } = {}) {
  await page.route('**/src/landing.js', route => route.fulfill({ contentType: 'text/javascript', body: 'window.AtlasStartup.ready();' }));
  await page.route('**/src/app.js', route => route.fulfill({ contentType: 'text/javascript', body: 'window.AtlasStartup.ready();' }));
  await page.goto(path);await expect(page.locator('html')).toHaveAttribute('data-startup-state', 'ready');
  await page.evaluate(async fail => {
    localStorage.setItem('project-atlas-library-v1', 'fictional-local-preserved');
    let user = { uid: 'fictional-owner', email: 'alex@example.test' }, remaining = 2, failed = false;
    window.deletionCalls = [];
    window.deletionAccount = { getState: () => ({ user }), subscribe: callback => { callback({ user });return () => {}; }, signOut: async () => { user = null; }, getService: async () => ({ prepareAccountDeletion: async () => { window.deletionCalls.push('verify');if (window.delayVerification) await new Promise(resolve => { window.releaseVerification = resolve; });return 'fictional'; } }), setSaveFutureMaps: () => {} };
    const { initAccountDeletion } = await import('/src/account-deletion.js');
    // The rest of Account remains the production controller, including native
    // queued close events and its aria-expanded cleanup.
    const { initAccountPanel } = await import('/src/account-ui.js');
    initAccountPanel({ account: window.deletionAccount, initDeletion: options => initAccountDeletion({ ...options, navigate: url => { window.deletedDestination = url; }, fetcher: async (_url, options) => {
      const { action } = JSON.parse(options.body);window.deletionCalls.push(action);
      if (action === 'begin') return Response.json({ status: 'working', receipt: 'disposable-receipt' });
      if (fail && !failed) { failed = true;throw TypeError('offline'); }
      return Response.json({ status: --remaining <= 0 ? 'complete' : 'working' });
    } }) });
    document.getElementById('account-modal').showModal();
  }, fail);
  await page.getByRole('button', { name: 'Delete account…', exact: true }).click();
}
test('confirmation protects cancellation and deletion preserves local data before redirect', async ({ page }) => {
  await prepare(page);
  const dialog = page.locator('#account-delete-dialog'), submit = dialog.locator('.account-delete-submit');
  await expect(submit).toBeDisabled();await dialog.getByRole('button', { name: 'Keep account' }).click();
  expect(await page.evaluate(() => deletionCalls)).toEqual([]);
  await page.getByRole('button', { name: 'Delete account…', exact: true }).click();
  await page.locator('#account-delete-confirm').fill('DELETE');await submit.click();
  await expect.poll(() => page.evaluate(() => window.deletedDestination)).toBe('./?account=deleted');
  expect(await page.evaluate(() => localStorage.getItem('project-atlas-library-v1'))).toBe('fictional-local-preserved');
  expect(await page.evaluate(() => deletionCalls)).toEqual(['verify', 'begin', 'continue', 'continue']);
});

for (const path of ['/', '/workspace']) test(`${path} returns directly to Account on every dismissal without dropping the modal backdrop`, async ({ page }) => {
  await prepare(page, { path });
  await page.evaluate(() => {
    window.uncoveredDialogCloses = 0;
    const close = HTMLDialogElement.prototype.close;
    HTMLDialogElement.prototype.close = function (...args) {
      close.apply(this, args);
      if (this.id === 'account-delete-dialog' && !document.querySelector('dialog:modal')) window.uncoveredDialogCloses++;
    };
  });
  for (const theme of ['dark', 'light']) {
    await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
    for (const method of ['x', 'keep', 'escape', 'outside']) {
      if (!await page.locator('#account-delete-dialog').isVisible()) await page.getByRole('button', { name: 'Delete account…', exact: true }).click();
      if (method === 'x') await page.getByRole('button', { name: 'Close account deletion', exact: true }).click();
      if (method === 'keep') await page.getByRole('button', { name: 'Keep account', exact: true }).click();
      if (method === 'escape') await page.keyboard.press('Escape');
      if (method === 'outside') await page.mouse.click(4, 4);
      await expect(page.locator('#account-modal')).toBeVisible();
      await expect(page.locator('#account-delete-dialog')).not.toBeVisible();
      expect(await page.evaluate(() => window.uncoveredDialogCloses)).toBe(0);
      await expect(page.locator('.account-delete-link')).toBeFocused();
      await expect(page.locator('[data-open-account]').first()).toHaveAttribute('aria-expanded', 'true');
    }
  }
  expect(await page.evaluate(() => window.deletionCalls)).toEqual([]);
});
test('interrupted cleanup exposes resume and never starts a second deletion job', async ({ page }) => {
  await prepare(page, { fail: true });await page.locator('#account-delete-confirm').fill('DELETE');
  await page.getByRole('button', { name: 'Verify and delete account', exact: true }).click();
  await expect(page.locator('.account-delete-error')).toContainText('could not finish');
  expect(await page.evaluate(() => window.deletedDestination)).toBeUndefined();
  await page.getByRole('button', { name: 'Resume deletion', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.deletedDestination)).toBe('./?account=deleted');
  expect((await page.evaluate(() => deletionCalls)).filter(value => value === 'begin')).toHaveLength(1);
});
for (const theme of ['light', 'dark']) test(`phone confirmation is readable and keyboard accessible in ${theme}`, async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });await prepare(page);
  await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
  await expect(page.getByLabel('Type DELETE to confirm', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  const geometry = await page.locator('#account-delete-dialog').boundingBox();expect(geometry.width).toBeLessThanOrEqual(320);
  await page.keyboard.press('Escape');await expect(page.locator('#account-delete-dialog')).not.toBeVisible();
  expect(await page.evaluate(() => deletionCalls)).toEqual([]);
});

test('an account switch during verification cannot start deletion or sign out the new account', async ({ page }) => {
  await prepare(page);await page.evaluate(() => { window.delayVerification = true; });
  await page.locator('#account-delete-confirm').fill('DELETE');await page.getByRole('button', { name: 'Verify and delete account', exact: true }).click();
  await expect.poll(() => page.evaluate(() => typeof window.releaseVerification)).toBe('function');
  await page.evaluate(() => { window.deletionAccount.getState = () => ({ user: { uid: 'other-account' } });window.releaseVerification(); });
  await expect(page.locator('.account-delete-error')).toContainText('Your account changed');
  expect(await page.evaluate(() => window.deletionCalls)).toEqual(['verify']);
  expect(await page.evaluate(() => window.deletedDestination)).toBeUndefined();
});

test('an interrupted request survives refresh without requiring another begin or verification', async ({ page }) => {
  await prepare(page, { fail: true });await page.locator('#account-delete-confirm').fill('DELETE');
  await page.getByRole('button', { name: 'Verify and delete account', exact: true }).click();await expect(page.locator('.account-delete-error')).toBeVisible();
  await prepare(page);await page.getByRole('button', { name: 'Resume deletion', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.deletedDestination)).toBe('./?account=deleted');
  expect(await page.evaluate(() => window.deletionCalls)).toEqual(['continue', 'continue']);
});

test('rapid close and reopen keeps the latest dialog and focus with normal motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  const result = await page.evaluate(async () => {
    const dialog = document.getElementById('account-delete-dialog'), account = document.getElementById('account-modal');
    for (let i = 0; i < 6; i++) {
      dialog.querySelector('.account-delete-close').click();
      account.querySelector('.account-delete-link').click();
    }
    await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
    return { deletion: dialog.open, account: account.open, focus: document.activeElement.id, modalCount: document.querySelectorAll('dialog:modal').length };
  });
  expect(result).toEqual({ deletion: true, account: false, focus: 'account-delete-confirm', modalCount: 1 });
  await page.getByRole('button', { name: 'Close account deletion', exact: true }).click();
  await expect(page.locator('#account-modal')).toBeVisible();await expect(page.locator('.account-delete-link')).toBeFocused();
  expect(await page.evaluate(() => window.deletionCalls)).toEqual([]);
});

test('dismissal is blocked while verification runs and success does not reopen Account', async ({ page }) => {
  await prepare(page);await page.evaluate(() => { window.delayVerification = true; });
  await page.locator('#account-delete-confirm').fill('DELETE');await page.getByRole('button', { name: 'Verify and delete account', exact: true }).click();
  await expect.poll(() => page.evaluate(() => typeof window.releaseVerification)).toBe('function');
  await page.getByRole('button', { name: 'Close account deletion', exact: true }).click();
  await page.keyboard.press('Escape');await page.mouse.click(4, 4);
  await expect(page.locator('#account-delete-dialog')).toBeVisible();await expect(page.locator('#account-modal')).not.toBeVisible();
  expect(await page.evaluate(() => window.deletionCalls)).toEqual(['verify']);
  await page.evaluate(() => window.releaseVerification());
  await expect.poll(() => page.evaluate(() => window.deletedDestination)).toBe('./?account=deleted');
  await expect(page.locator('#account-modal')).not.toBeVisible();
});

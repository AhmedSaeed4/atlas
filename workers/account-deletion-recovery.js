import { recoverDeletion } from '../server/deletion-handler.js';
export default {
  async scheduled(_event, env, context) { context.waitUntil(recoverDeletion(env)); },
  fetch() { return new Response('Not found', { status: 404 }); },
};

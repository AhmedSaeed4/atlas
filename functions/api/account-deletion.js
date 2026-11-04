import { handleDeletion } from '../../server/deletion-handler.js';
export const onRequest = ({ request, env }) => handleDeletion(request, env);

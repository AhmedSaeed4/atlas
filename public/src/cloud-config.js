export const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyBvuAItyaaRKBywT11NJ2g9Tp4EjVGTc_M",
  authDomain: "atlas-ahmedsaeed4-2026.firebaseapp.com",
  projectId: "atlas-ahmedsaeed4-2026",
  appId: "1:790536067689:web:6833eb2e60f14f77e1a0f8",
  messagingSenderId: "790536067689",
});

const REQUIRED_CONFIG_KEYS = Object.freeze([
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
  "messagingSenderId",
]);

export function isCloudConfigured(config = firebaseConfig) {
  return Boolean(config)
    && typeof config === "object"
    && REQUIRED_CONFIG_KEYS.every((key) => typeof config[key] === "string" && config[key].trim());
}

export function getCloudConfigStatus(config = firebaseConfig) {
  if (!isCloudConfigured(config)) {
    return Object.freeze({
      enabled: false,
      reason: "Online workspaces are unavailable because Firebase web configuration is missing.",
    });
  }
  return Object.freeze({ enabled: true, projectId: config.projectId });
}

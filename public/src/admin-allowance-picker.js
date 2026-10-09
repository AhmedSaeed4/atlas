import { limitLabel, WORKSPACE_LIMIT_CHOICES } from "./account-access.js";
import { createChoicePicker } from "./choice-picker.js";

export function createAllowancePicker(options) {
  return createChoicePicker({ ...options, classPrefix: "allowance",
    choices: WORKSPACE_LIMIT_CHOICES.map(value => ({ value, label: limitLabel(value) })) });
}

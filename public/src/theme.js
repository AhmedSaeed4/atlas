(function () {
  const storageKey = "atlas-theme";
  const allowed = new Set(["light", "dark"]);
  let theme = "dark";
  try {
    const saved = localStorage.getItem(storageKey);
    if (allowed.has(saved)) theme = saved;
  } catch {}

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const schemeMeta = document.querySelector('meta[name="color-scheme"]');
    if (schemeMeta) schemeMeta.content = theme;
    const colorMeta = document.querySelector('meta[name="theme-color"]');
    if (colorMeta) colorMeta.content = theme === "light" ? "#dedfd7" : "#171916";
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    const nextTheme = theme === "light" ? "dark" : "light";
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.setAttribute("aria-label", "Switch to " + nextTheme + " theme");
    toggle.title = "Switch to " + nextTheme + " theme";
    const value = document.getElementById("theme-value");
    if (value) value.textContent = theme === "light" ? "Light" : "Dark";
}

  applyTheme();
  window.addEventListener("DOMContentLoaded", function () {
    applyTheme();
    const toggle = document.getElementById("theme-toggle");
    toggle?.addEventListener("click", function () {
      theme = theme === "light" ? "dark" : "light";
      applyTheme();
      try { localStorage.setItem(storageKey, theme); } catch {}
    });
  }, { once: true });
})();

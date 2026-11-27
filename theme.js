(() => {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const key = 'autonomo-theme';
  let picker;

  function readPreference() {
    try {
      const value = localStorage.getItem(key);
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
      return 'system';
    }
  }

  let preference = readPreference();

  function applyTheme() {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    if (picker) picker.value = preference;
    if (root.dataset.theme === theme) return;
    root.dataset.theme = theme;
    themeColor.content = theme === 'dark' ? '#181412' : '#ffffff';
    window.dispatchEvent(new Event('themechange'));
  }

  applyTheme();
  system.addEventListener('change', applyTheme);
  window.addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return;
    preference = readPreference();
    applyTheme();
  });

  document.addEventListener('DOMContentLoaded', () => {
    picker = document.querySelector('#theme-select');
    picker.addEventListener('change', () => {
      preference = picker.value;
      try {
        if (preference === 'system') localStorage.removeItem(key);
        else localStorage.setItem(key, preference);
      } catch {
        // The current page can still switch themes when storage is unavailable.
      }
      applyTheme();
    });
    applyTheme();
    picker.hidden = false;
  }, { once: true });
})();

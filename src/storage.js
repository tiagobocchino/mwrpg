// === PERSISTÊNCIA LOCAL (v0.2) ===
// window.MWRPG_STORAGE — save/load/clear do progresso da campanha via localStorage.
(function () {
  const KEY = 'mwrpg_save_v1';

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() }));
    } catch (e) {
      // localStorage indisponível (modo privado, quota cheia) — progresso segue só em memória
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  function hasSave() {
    try { return localStorage.getItem(KEY) !== null; } catch (e) { return false; }
  }

  Object.assign(window, { MWRPG_STORAGE: { save, load, clear, hasSave } });
})();

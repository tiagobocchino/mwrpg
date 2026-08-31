// === AUTENTICAÇÃO (v0.4 — login por link mágico) ===
// window.MWRPG_AUTH — inicializa o cliente Supabase (via /api/config,
// nunca com chave hardcoded) e expõe login/logout/sessão.
// Se o Supabase não estiver configurado (503 em /api/config, ou rodando
// local sem backend), o jogo funciona sem login — degrada pro modo
// atual (localStorage), sem travar ninguém.
window.MWRPG_AUTH = (function () {
  let client = null;
  let configChecked = false;
  let configAvailable = false;

  async function init() {
    if (configChecked) return configAvailable;
    configChecked = true;
    try {
      const res = await fetch('/api/config');
      if (!res.ok) return false;
      const { supabaseUrl, supabasePublishableKey } = await res.json();
      if (!window.supabase || !supabaseUrl || !supabasePublishableKey) return false;
      client = window.supabase.createClient(supabaseUrl, supabasePublishableKey);
      configAvailable = true;
      return true;
    } catch (e) {
      console.debug('MWRPG_AUTH: config indisponível, seguindo sem login', e.message);
      return false;
    }
  }

  async function getSession() {
    if (!(await init())) return null;
    const { data } = await client.auth.getSession();
    return data.session || null;
  }

  async function signInWithEmail(email) {
    if (!(await init())) throw new Error('login indisponível — Supabase não configurado');
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
  }

  function onChange(cb) {
    if (!client) return () => {};
    const { data } = client.auth.onAuthStateChange((_event, session) => cb(session));
    return () => data.subscription.unsubscribe();
  }

  function getClient() {
    return client;
  }

  return { init, getSession, signInWithEmail, signOut, onChange, getClient };
})();

// === AUTENTICAÇÃO (v0.4 — login por link mágico) ===
// window.MWRPG_AUTH — inicializa o cliente Supabase (via /api/config,
// nunca com chave hardcoded) e expõe login/logout/sessão.
// Se o Supabase não estiver configurado (503 em /api/config, ou rodando
// local sem backend), o jogo funciona sem login — degrada pro modo
// atual (localStorage), sem travar ninguém.

// Tradução de erros do Supabase Auth — sempre por error.code (estável),
// nunca por texto em inglês (muda entre versões da API). Fonte dos
// códigos: supabase.com/docs/guides/auth/debugging/error-codes.
const AUTH_ERROR_MESSAGES = {
  over_email_send_rate_limit: 'Muitos links pedidos pra este email em pouco tempo. Espere alguns minutos e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas em pouco tempo. Espere um instante e tente de novo.',
  email_address_invalid: 'Esse endereço de email não é aceito — confira se digitou certo.',
  email_address_not_authorized: 'O envio de email ainda está sendo configurado — tente novamente em alguns minutos, ou avise quem administra o jogo.',
  email_not_confirmed: 'Sua conta ainda não foi confirmada. Confira seu email.',
  email_provider_disabled: 'Login por email está temporariamente desativado. Tente novamente mais tarde.',
  otp_disabled: 'Login por link mágico está temporariamente desativado. Tente novamente mais tarde.',
  otp_expired: 'Esse link expirou ou já foi usado. Peça um novo link.',
  validation_failed: 'Não consegui processar esse email. Confira o formato e tente de novo.',
  unexpected_failure: 'Algo deu errado do nosso lado. Tente novamente em instantes.',
  invalid_credentials: 'Email ou senha incorretos.',
  weak_password: 'Essa senha é fraca demais — use pelo menos 6 caracteres.',
  same_password: 'A nova senha precisa ser diferente da atual.'
};

function translateAuthError(error) {
  if (!error) return null;
  const code = error.code || (error.status === 429 ? 'over_request_rate_limit' : null);
  return AUTH_ERROR_MESSAGES[code] || 'Não foi possível enviar o link agora. Tente novamente em instantes.';
}

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

  // Se o navegador voltou de um link mágico com erro (expirado, já usado,
  // etc.), o Supabase manda isso pela URL, não por uma exceção que dá pra
  // capturar num try/catch normal. Checa uma vez e limpa a URL depois.
  function consumeUrlError() {
    const raw = window.location.hash && window.location.hash.length > 1
      ? window.location.hash.slice(1)
      : window.location.search.slice(1);
    const params = new URLSearchParams(raw);
    const code = params.get('error_code');
    if (!code) return null;
    window.history.replaceState(null, '', window.location.pathname);
    return translateAuthError({ code });
  }

  async function signInWithEmail(email) {
    if (!(await init())) throw new Error('login indisponível — Supabase não configurado');
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) {
      const friendly = new Error(translateAuthError(error));
      friendly.code = error.code;
      throw friendly;
    }
  }

  async function signInWithPassword(email, password) {
    if (!(await init())) throw new Error('login indisponível — Supabase não configurado');
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      const friendly = new Error(translateAuthError(error));
      friendly.code = error.code;
      throw friendly;
    }
  }

  // Chamado com uma sessão já ativa (ex.: logo depois de confirmar o link
  // mágico) pra vincular uma senha à conta — assim o jogador não precisa
  // de link mágico novo toda vez que voltar.
  async function setPassword(password) {
    if (!client) throw new Error('login indisponível — Supabase não configurado');
    const { error } = await client.auth.updateUser({ password });
    if (error) {
      const friendly = new Error(translateAuthError(error));
      friendly.code = error.code;
      throw friendly;
    }
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

  return { init, getSession, signInWithEmail, signInWithPassword, setPassword, signOut, onChange, getClient, consumeUrlError };
})();

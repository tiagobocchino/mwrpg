// === PERSISTÊNCIA EM NUVEM (v0.4) ===
// window.MWRPG_CLOUD — CRUD simples de campaign_sessions no Supabase.
// Só funciona com usuário logado (RLS exige auth.uid() = user_id).
window.MWRPG_CLOUD = (function () {
  function table() {
    const client = window.MWRPG_AUTH.getClient();
    if (!client) throw new Error('cliente Supabase não inicializado');
    return client.from('campaign_sessions');
  }

  // Retorna a campanha ativa mais recente do usuário, ou null.
  async function loadActiveSession(userId) {
    const { data, error } = await table()
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function createSession(userId, initial) {
    const { data, error } = await table()
      .insert({
        user_id: userId,
        scenario_id: 'ys',
        messages: initial.messages,
        history: initial.history,
        options: initial.options,
        mode: initial.mode,
        party_at: initial.partyAt,
        turn_count: 0
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function saveSession(sessionId, patch) {
    const { error } = await table().update(patch).eq('id', sessionId);
    if (error) throw error;
  }

  return { loadActiveSession, createSession, saveSession };
})();

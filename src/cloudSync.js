// === PERSISTÊNCIA EM NUVEM (v0.4 campanha, v0.6 personagem) ===
// window.MWRPG_CLOUD — CRUD de campaign_sessions e characters no
// Supabase. Só funciona com usuário logado (RLS exige auth.uid() = user_id).
window.MWRPG_CLOUD = (function () {
  function client() {
    const c = window.MWRPG_AUTH.getClient();
    if (!c) throw new Error('cliente Supabase não inicializado');
    return c;
  }
  function sessionsTable() { return client().from('campaign_sessions'); }
  function charactersTable() { return client().from('characters'); }

  // Retorna a campanha ativa mais recente do usuário, ou null.
  async function loadActiveSession(userId) {
    const { data, error } = await sessionsTable()
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  // characterId, seed e extra (discovered/known_markers/missions) são
  // opcionais — mantém compatibilidade com quem ainda não tem
  // personagem/semente (degradação graciosa).
  async function createSession(userId, initial, characterId, seed, extra) {
    const { data, error } = await sessionsTable()
      .insert({
        user_id: userId,
        character_id: characterId || null,
        scenario_id: 'ys',
        messages: initial.messages,
        history: initial.history,
        options: initial.options,
        mode: initial.mode,
        party_at: initial.partyAt,
        seed: seed || null,
        discovered: (extra && extra.discovered) || [],
        known_markers: (extra && extra.knownMarkers) || [],
        missions: (extra && extra.missions) || [],
        turn_count: 0
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function saveSession(sessionId, patch) {
    const { error } = await sessionsTable().update(patch).eq('id', sessionId);
    if (error) throw error;
  }

  // --- Personagem (v0.6) ---------------------------------------------

  // Um personagem por conta, hoje (sem escolha entre vários salvos).
  async function loadCharacter(userId) {
    const { data, error } = await charactersTable()
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  // Nome é único GLOBALMENTE (índice único case-insensitive no banco,
  // supabase/schema.sql) — a corrida entre dois jogadores salvando o
  // mesmo nome ao mesmo tempo é resolvida pelo próprio Postgres, não
  // por uma checagem prévia daqui (evita condição de corrida — ver
  // docs/ASSEMBLEIA-05-CLASSES-E-RECOMECO-VARIADO.md, Frente A).
  async function createCharacter(userId, name, data) {
    const { data: row, error } = await charactersTable()
      .insert({ user_id: userId, name, data })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') {
        const friendly = new Error('Esse nome já foi escolhido por outro jogador — tente outro.');
        friendly.nameTaken = true;
        throw friendly;
      }
      throw error;
    }
    return row;
  }

  return { loadActiveSession, createSession, saveSession, loadCharacter, createCharacter };
})();

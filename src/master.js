// === MESTRE IA ===
// Integração com window.claude.complete e prompt do mestre

window.MWRPG_MASTER = (function () {
  const SYSTEM_PROMPT = `Você é o MESTRE de uma campanha solo de RPG de mesa, no cenário "A Coroa Enterrada de Ys" — fantasia bretã, low-magic, com elementos sobrenaturais. O jogador comanda um aventureiro marcado pelo selo de Ys, acompanhado de três NPCs companheiros: Brennan (bardo), Sira (clériga das marés) e Korrin (batedor).

REGRAS DO TOM:
- Sábio, consciente, sincero, direto.
- Sem rodeios, sem prolixidade. Floreios apenas em descrições sensoriais.
- Detalhista nos sentidos: cheiro, luz, som, textura, temperatura.
- Nunca decida ações pelo jogador. Pare em pontos de decisão.
- Português brasileiro, registro literário-acessível.
- Comprimento: 80–180 palavras por turno (até 250 em cenas-chave).

REGRAS DO SISTEMA "D6 das Três Letras":
- 3 atributos: CRP (Corpo), MNT (Mente), ALM (Alma) — valores 1 a 5.
- Toda ação incerta rola 2d6 + atributo. Bandas: 6- falha narrativa, 7-9 sucesso com custo, 10-12 sucesso pleno, 13+ crítico.
- Em combate, ofereça as 6 ações padrão: Atacar, Magia, Item, Mover, Defender, Falar.

REGRAS DA SUA RESPOSTA — IMPORTANTE:
- Você responde SEMPRE em JSON estrito, sem texto fora do JSON, sem markdown.
- Estrutura:
{
  "narration": "texto da narração, em parágrafos (use \\n\\n entre parágrafos)",
  "mode": "dialog" | "combat" | "exploration" | "scene_end",
  "options": [
    { "label": "texto da opção", "attr": "crp|mnt|alm|none", "needsRoll": true|false }
  ],
  "rollResult": null | { "applied": "como o resultado afetou a cena" },
  "mapHint": null | { "moveTo": "id_da_localização" | null, "enterInterior": true | false | null, "remoteArea": true | false | null, "revealMission": { "id": "string_curto", "titulo": "string", "localId": "id_da_localização_ou_nome_livre" } | null, "newLocations": [{"id":"x","x":0-100,"y":0-100,"label":"nome"}] | null },
  "stateChanges": null | { "playerHp": delta_int, "playerMp": delta_int, "addTag": "string" | null }
}
- Forneça SEMPRE entre 2 e 6 opções. Em combate, 6 opções (use as 6 ações padrão).
- "needsRoll" true se a opção exige rolagem; "attr" indica qual atributo somar.
- Se uma opção for puramente narrativa (perguntar algo, observar), needsRoll = false e attr = "none".

MAPA — DUAS ESCALAS (cidade e interior):
- Use "moveTo" quando a cena muda de localização na cidade (o mapa volta pra escala de cidade). IDs válidos: tavern, chapel, lighthouse, docks, cliff.
- Use "enterInterior": true quando a cena entra dentro de um prédio do local atual — SÓ é válido se o jogador já estiver em "tavern", "chapel" ou "lighthouse" (Taberna do Pescador Coxo, Capela de Sant Vinog, Farol Apagado — os únicos com interior desenhado). "docks" (Cais Velho) e "cliff" (Penhasco da Bruma) são cenários externos, sem interior — nunca peça enterInterior nesses dois.
- Use "enterInterior": false quando a cena sai do interior de volta pro exterior do mesmo local.
- Não combine "moveTo" e "enterInterior" na mesma resposta — mude de local OU entre/saia de um interior, nunca os dois no mesmo turno.

ÁREA REMOTA — quando o mapa não deve ficar disponível:
- Locais conhecidos (tavern, chapel, lighthouse, docks, cliff) sempre liberam o mapa — não precisa sinalizar nada pra eles.
- Se a cena for uma masmorra, ruína, ou qualquer lugar longe da cidade que você está narrando na hora (sem ficha própria de mapa), use "remoteArea": true — isso esconde o mapa até o jogador voltar. Quando a cena voltar pra perto da cidade, use "remoteArea": false. Se não mudou nada desde o turno anterior, deixe "remoteArea": null.

REVELAR MISSÃO — quando um NPC aponta um lugar ainda não visitado:
- Se, na conversa, um NPC contar de um lugar específico que o grupo ainda não visitou (gancho de missão), preencha "revealMission" com um id curto (ex.: "missao-farol-secreto"), um título curto, e o "localId" do lugar (use o id conhecido se for um dos 5 locais; senão invente um id curto e estável em minúsculas e hífen, tipo "cripta-afogada").
- Não repita o mesmo "revealMission" em turnos seguintes pra missão já revelada — só na primeira vez que ela é contada.
- Isso é opcional — a maioria dos turnos não revela missão nenhuma, deixe "revealMission": null.

Mantenha continuidade com o histórico.`;

  function buildMessages(history, latest) {
    const msgs = [];
    msgs.push({ role: 'user', content: SYSTEM_PROMPT });
    msgs.push({ role: 'assistant', content: 'Entendido. Aguardo a primeira ação do jogador.' });
    for (const h of history) {
      msgs.push({ role: h.role === 'master' ? 'assistant' : 'user', content: h.content });
    }
    if (latest) msgs.push({ role: 'user', content: latest });
    return msgs;
  }

  // Limite real do free tier da Groq: 8.000 tokens/minuto por organização
  // (não por usuário) — ver docs/ASSEMBLEIA-02-LLM-GRATUITO-E-BANCO.md.
  // Manda só a intro + as últimas trocas em vez do histórico inteiro.
  function trimHistory(history) {
    const MAX_RECENT = 10; // ~5 trocas jogador/mestre
    if (history.length <= MAX_RECENT) return history;
    const intro = history[0];
    const recent = history.slice(-MAX_RECENT);
    return recent.indexOf(intro) !== -1 ? recent : [intro].concat(recent);
  }

  function guessAcervoTags(latest) {
    if (!window.MWRPG_ACERVO) return [];
    const text = String(latest || '').toLowerCase();
    const allTags = {};
    window.MWRPG_ACERVO.entries.forEach(e => e.tags.forEach(t => { allTags[t] = 1; }));
    return Object.keys(allTags).filter(t => text.indexOf(t) !== -1);
  }

  // Semente da campanha (Assembleia 05, Frente B) — injetada em toda
  // chamada da campanha, não só na abertura, pra situações ao longo
  // dos turnos também carregarem o mesmo gancho/ambientação, não só a
  // primeira mensagem. Custo: só algumas dezenas de tokens por turno.
  function seedContext(seed) {
    if (!seed) return '';
    let txt = `\n\nCONTEXTO DESTA CAMPANHA (mantenha consistência com isto ao longo de toda a história):\n- Gancho: ${seed.ganchoTexto}`;
    if (seed.quemFalaPrimeiroLabel) txt += `\n- Quem tende a puxar a conversa: ${seed.quemFalaPrimeiroLabel}`;
    if (seed.clima) txt += `\n- Ambientação sensorial: ${seed.clima}`;
    return txt;
  }

  function buildGroqMessages(history, latest, seed) {
    let sys = SYSTEM_PROMPT + seedContext(seed);
    const tags = guessAcervoTags(latest);
    const lore = window.pickAcervoLore ? window.pickAcervoLore(tags, 2) : [];
    if (lore.length) {
      sys += '\n\nMATERIAL DE REFERÊNCIA DISPONÍVEL (domínio público, use como' +
        ' inspiração se fizer sentido — não é obrigatório encaixar):\n' +
        lore.map(e => `- ${e.titulo}: ${e.resumoJogavel}`).join('\n');
    }
    const msgs = [{ role: 'system', content: sys }];
    for (const h of trimHistory(history)) {
      msgs.push({ role: h.role === 'master' ? 'assistant' : 'user', content: h.content });
    }
    if (latest) msgs.push({ role: 'user', content: latest });
    return msgs;
  }

  async function callGroq(messages) {
    const res = await fetch('/api/master', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    if (res.status === 429) {
      const body = await res.json().catch(() => ({}));
      const err = new Error('groq_quota_exceeded');
      err.quotaExceeded = true;
      err.retryAfter = body.retryAfter || null;
      throw err;
    }
    if (!res.ok) throw new Error('groq_http_' + res.status);
    const data = await res.json();
    if (!data.text) throw new Error('groq_empty_response');
    return parseResponse(data.text);
  }

  async function askGroq(history, latest, seed) {
    return callGroq(buildGroqMessages(history, latest, seed));
  }

  // Gera a abertura de uma campanha NOVA (recomeço) a partir de uma
  // semente (src/seeds.js) — uma chamada só, sem histórico. Se falhar
  // por qualquer motivo (offline, cota, erro), quem chamou decide o
  // fallback (ver handleReset em app.jsx — cai pro texto fixo original).
  async function generateVariedIntro(seed) {
    const acervoEntry = (window.MWRPG_ACERVO && seed && seed.acervoId)
      ? window.MWRPG_ACERVO.entries.find(e => e.id === seed.acervoId)
      : null;
    let instrucao = 'Gere a ABERTURA de uma campanha NOVA neste mesmo cenário e grupo — não é continuação de nada, é o primeiro momento da história. ' +
      'Não presuma nenhuma escolha do jogador ainda, não inclua rollResult. Ofereça de 2 a 4 opções iniciais.' +
      seedContext(seed);
    if (acervoEntry) {
      instrucao += `\n\nInspire-se livremente nisto pro gancho (não copie o texto, adapte pra esta campanha): ${acervoEntry.titulo} — ${acervoEntry.resumoJogavel}`;
    }
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: instrucao }
    ];
    return callGroq(messages);
  }

  function quotaExceededResponse() {
    return {
      narration:
        '(O mestre precisa de um instante de silêncio — nossa cota gratuita de IA para hoje se esgotou. ' +
        'Sua campanha está salva; volte mais tarde ou amanhã pra continuar exatamente daqui.)',
      mode: 'quota_exceeded',
      options: [],
      quotaExceeded: true
    };
  }

  async function ask(history, latest, seed) {
    // 1) Groq via /api/master (produção real — precisa de GROQ_API_KEY no servidor)
    try {
      return await askGroq(history, latest, seed);
    } catch (eGroq) {
      if (eGroq.quotaExceeded) {
        // Cota esgotada é um estado honesto, não "erro genérico" — não cai
        // silenciosamente pro modo offline (isso enganaria o jogador sobre
        // o motivo). Ver docs/ASSEMBLEIA-02-LLM-GRATUITO-E-BANCO.md.
        return quotaExceededResponse();
      }
      console.debug('master.ask: Groq indisponível, tentando próximo provedor', eGroq.message);
    }
    // 2) window.claude.complete (só existe dentro do artifact host da Anthropic)
    if (window.claude && window.claude.complete) {
      try {
        const messages = buildMessages(history, latest);
        const text = await window.claude.complete({ messages });
        return parseResponse(text);
      } catch (eClaude) {
        console.error('master.ask (claude.complete) failed', eClaude);
      }
    }
    // 3) modo offline
    return mockResponse(history, latest);
  }

  function parseResponse(text) {
    let raw = text.trim();
    // strip code fences if present
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    // try to find first { and last }
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) raw = raw.slice(start, end + 1);
    try {
      const obj = JSON.parse(raw);
      // sanitize
      obj.narration = String(obj.narration || '').trim();
      obj.mode = obj.mode || 'dialog';
      obj.options = Array.isArray(obj.options) ? obj.options.slice(0, 6) : [];
      if (obj.options.length < 2) {
        obj.options = [
          { label: 'Continuar.', attr: 'none', needsRoll: false }
        ];
      }
      return obj;
    } catch (e) {
      console.warn('Falha ao parsear JSON do mestre, usando fallback:', e, text);
      return {
        narration: text,
        mode: 'dialog',
        options: [
          { label: 'Continuar.', attr: 'none', needsRoll: false }
        ]
      };
    }
  }

  // fallback offline (sem claude.complete)
  function mockResponse(history, latest) {
    const last = history[history.length - 1];
    if (!last && !latest) return {
      narration: window.MWRPG_DATA.scenario.intro,
      mode: 'dialog',
      options: window.MWRPG_DATA.scenario.options.map(o => ({
        label: o.label,
        attr: o.tone === 'direct' ? 'mnt' : o.tone === 'social' ? 'alm' : o.tone === 'bardic' ? 'alm' : 'none',
        needsRoll: o.tone !== 'cautious'
      }))
    };
    return {
      narration: '(Modo offline: o mestre acena, e a história aguarda a chave da nuvem para continuar. Conecte o orchestrador para narrações vivas.)\n\nEnquanto isso, descreva o que faz a seguir.',
      mode: 'dialog',
      options: [
        { label: 'Observar a sala.', attr: 'mnt', needsRoll: true },
        { label: 'Sair pela porta dos fundos.', attr: 'crp', needsRoll: false },
        { label: 'Pedir mais um copo.', attr: 'alm', needsRoll: false }
      ]
    };
  }

  return { ask, generateVariedIntro, SYSTEM_PROMPT };
})();

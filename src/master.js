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
  "mapHint": null | { "moveTo": "id_da_localização" | null, "newLocations": [{"id":"x","x":0-100,"y":0-100,"label":"nome"}] | null },
  "stateChanges": null | { "playerHp": delta_int, "playerMp": delta_int, "addTag": "string" | null }
}
- Forneça SEMPRE entre 2 e 6 opções. Em combate, 6 opções (use as 6 ações padrão).
- "needsRoll" true se a opção exige rolagem; "attr" indica qual atributo somar.
- Se uma opção for puramente narrativa (perguntar algo, observar), needsRoll = false e attr = "none".

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

  async function ask(history, latest) {
    if (!window.claude || !window.claude.complete) {
      return mockResponse(history, latest);
    }
    try {
      const messages = buildMessages(history, latest);
      const text = await window.claude.complete({ messages });
      return parseResponse(text);
    } catch (e) {
      console.error('master.ask failed', e);
      return {
        narration: '(O mestre faz uma pausa, como se ouvisse algo distante. A cena continua.)',
        mode: 'dialog',
        options: [
          { label: 'Esperar.', attr: 'none', needsRoll: false },
          { label: 'Insistir.', attr: 'mnt', needsRoll: true }
        ]
      };
    }
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

  return { ask, SYSTEM_PROMPT };
})();

// === CLASSES (v0.6) ===
// window.MWRPG_CLASSES — as 3 classes do sistema de criação de
// personagem, mapeadas 1:1 nos 3 atributos já existentes do D6 das
// Três Letras (src/engine.js). Decisão da Assembleia 05: as classes
// SÃO os arquétipos previstos pela Assembleia 04, com nome real —
// não é uma camada nova. Soma dos 3 atributos sempre 6, mesmo total
// já usado pelo jogador fixo e pelos 3 NPCs (src/data.js).
window.MWRPG_CLASSES = {
  list: [
    {
      id: 'guerreiro',
      nome: 'Guerreiro',
      resumo: 'Combate corpo a corpo — força e resistência à frente do grupo.',
      role: 'Guerreiro solar, marcado por Ys',
      crp: 3, mnt: 2, alm: 1,
      tags: ['Espada longa', 'Escudo de couro', 'Marca de Ys'],
      // ajuste ±1 permitido entre os dois atributos secundários
      // (nunca no primário — mantém a identidade da classe)
      ajustavel: ['mnt', 'alm']
    },
    {
      id: 'ladina',
      nome: 'Ladina',
      resumo: 'Ardil e precisão à distância — arco, faca e um passo à frente.',
      role: 'Ladina solar, marcada por Ys',
      crp: 2, mnt: 3, alm: 1,
      tags: ['Arco curto', 'Adaga', 'Marca de Ys'],
      ajustavel: ['crp', 'alm']
    },
    {
      id: 'maga',
      nome: 'Mágica',
      resumo: 'Poder da alma canalizado em runas e feitiços.',
      role: 'Maga solar, marcada por Ys',
      crp: 1, mnt: 2, alm: 3,
      tags: ['Cajado rúnico', 'Grimório de bolso', 'Marca de Ys'],
      ajustavel: ['crp', 'mnt']
    }
  ]
};

function mwrpgFindClass(classId) {
  return window.MWRPG_CLASSES.list.find(c => c.id === classId) || null;
}

// Monta o objeto de personagem completo (formato de MWRPG_DATA.player)
// a partir de uma classe + ajuste opcional de ±1 entre os dois
// atributos secundários + o nome escolhido pelo jogador.
function mwrpgBuildCharacter(name, classId, adjust) {
  const cls = mwrpgFindClass(classId);
  if (!cls) return null;
  const attrs = { crp: cls.crp, mnt: cls.mnt, alm: cls.alm };
  if (adjust && cls.ajustavel && cls.ajustavel.length === 2) {
    const [a, b] = cls.ajustavel;
    if (adjust === a && attrs[a] < 5 && attrs[b] > 1) { attrs[a] += 1; attrs[b] -= 1; }
    else if (adjust === b && attrs[b] < 5 && attrs[a] > 1) { attrs[b] += 1; attrs[a] -= 1; }
  }
  const hpMax = 10 + attrs.crp;
  const mpMax = 4 + attrs.alm * 2;
  return {
    id: 'p',
    name,
    role: cls.role,
    classId: cls.id,
    portrait: (name || '?').trim().charAt(0).toUpperCase() || '?',
    hp: hpMax, hpMax,
    mp: mpMax, mpMax,
    crp: attrs.crp, mnt: attrs.mnt, alm: attrs.alm,
    tags: cls.tags.slice()
  };
}

Object.assign(window, { mwrpgFindClass, mwrpgBuildCharacter });

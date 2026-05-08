// === ENGINE — D6 das Três Letras ===
// Sistema 2d6 + atributo (CRP/MNT/ALM)
// 6-: falha narrativa | 7-9: sucesso parcial | 10-12: pleno | 13+: crítico

window.MWRPG_ENGINE = (function () {
  const d6 = () => 1 + Math.floor(Math.random() * 6);

  function roll2d6(modifier = 0) {
    const a = d6(), b = d6();
    const sum = a + b + modifier;
    let band, label;
    if (sum >= 13) { band = 'crit'; label = 'Sucesso Crítico'; }
    else if (sum >= 10) { band = 'win'; label = 'Sucesso Pleno'; }
    else if (sum >= 7)  { band = 'mid'; label = 'Sucesso Parcial'; }
    else                { band = 'fail'; label = 'Falha Narrativa'; }
    return { a, b, raw: a + b, modifier, sum, band, label };
  }

  // sortei o atributo a partir de uma tag textual mandada pelo mestre
  function attrFromTag(tag) {
    if (!tag) return null;
    const t = tag.toLowerCase();
    if (/(força|forca|combate|atac|esquiv|corp|atlét|atletico)/.test(t)) return 'crp';
    if (/(astúcia|astuc|ardil|inteligência|intel|saber|conhe|menta|invest|lóg)/.test(t)) return 'mnt';
    if (/(carisma|sociais|persua|empat|font|alma|fé|fe|intuiç|magia|mística)/.test(t)) return 'alm';
    return null;
  }

  // tipos de combate — 6 ações fixas
  const COMBAT_ACTIONS = [
    { id: 'attack',  label: 'Atacar',   glyph: '⚔', attr: 'crp' },
    { id: 'magic',   label: 'Magia',    glyph: '✦', attr: 'alm' },
    { id: 'item',    label: 'Item',     glyph: '⏧', attr: null },
    { id: 'move',    label: 'Mover',    glyph: '↬', attr: 'crp' },
    { id: 'defend',  label: 'Defender', glyph: '⛨', attr: 'crp' },
    { id: 'speak',   label: 'Falar',    glyph: '☍', attr: 'alm' }
  ];

  return { d6, roll2d6, attrFromTag, COMBAT_ACTIONS };
})();

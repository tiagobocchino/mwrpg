// === MAPAS (v0.5 — duas escalas, Leaflet CRS.Simple) ===
// window.MWRPG_MAPS — cidade (Penmarc'h) + interiores. Cada entrada de
// interior segue a convenção "<locationId>_interior" pra bater com os
// ids de window.MWRPG_DATA.map.locations (tavern, chapel, lighthouse...).
// Arte: sprites CC0 do Kenney (RPG Base) — proveniência completa em
// docs/PROPOSTA-MAPA.md e docs/ACERVO-PROVENIENCIA.md.
window.MWRPG_MAPS = {
  city: {
    id: 'city',
    label: "Penmarc'h — Porto da Bretanha",
    image: 'src/assets/maps/mapa-cidade-penmarch.png',
    width: 2368,
    height: 832,
    markers: [
      { id: 'tavern', label: 'Taberna do Pescador Coxo', x: 480, y: 288 },
      { id: 'chapel', label: 'Capela de Sant Vinog', x: 1568, y: 288 },
      { id: 'lighthouse', label: 'Farol Apagado', x: 2016, y: 544 },
      { id: 'docks', label: 'Cais Velho', x: 480, y: 544 },
      { id: 'cliff', label: 'Penhasco da Bruma', x: 1184, y: 736 }
    ]
  },
  tavern_interior: {
    id: 'tavern_interior',
    label: 'Taberna do Pescador Coxo — Interior',
    image: 'src/assets/maps/mapa-taberna.png',
    width: 640,
    height: 512,
    exit: { x: 288, y: 480 }
  },
  chapel_interior: {
    id: 'chapel_interior',
    label: 'Capela de Sant Vinog — Interior',
    image: 'src/assets/maps/mapa-capela.png',
    width: 640,
    height: 512,
    exit: { x: 288, y: 480 }
  },
  lighthouse_interior: {
    id: 'lighthouse_interior',
    label: 'Farol Apagado — Interior',
    image: 'src/assets/maps/mapa-farol.png',
    width: 512,
    height: 448,
    exit: { x: 224, y: 416 }
  }
};

// true se o local tem um mapa de interior de verdade (não todo local tem —
// Cais Velho e Penhasco da Bruma são só pontos externos no mapa da cidade).
function mwrpgHasInterior(locationId) {
  return !!window.MWRPG_MAPS[locationId + '_interior'];
}

// === REGISTRO DE TIPO DE LOCAL (v0.7 — Assembleia 06, Seção 1.3) ===
// Decide sozinho (sem depender do mestre classificar cena a cena) se
// o mapa fica disponível: "cidade" sempre disponível; "masmorra" e
// "missao_distante" ficam bloqueados até o jogador sair de lá. Locais
// que a narração cria ad-hoc (sem entrada aqui) usam o sinal separado
// mapHint.remoteArea (src/master.js) em vez de um tipo fixo.
window.MWRPG_LOCATION_TYPES = {
  tavern: 'cidade',
  chapel: 'cidade',
  lighthouse: 'cidade',
  docks: 'cidade',
  cliff: 'cidade'
};

// Locais desconhecidos (não registrados) tratam como fora da cidade,
// por segurança — nunca libera mapa por omissão de cadastro.
function mwrpgLocationType(locationId) {
  return window.MWRPG_LOCATION_TYPES[locationId] || 'missao_distante';
}

Object.assign(window, { mwrpgHasInterior, mwrpgLocationType });

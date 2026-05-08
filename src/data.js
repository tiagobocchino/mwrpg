// Estado inicial do jogo — cenário "A Coroa Enterrada de Ys"
window.MWRPG_DATA = {
  scenario: {
    id: 'ys',
    title: 'A Coroa Enterrada de Ys',
    intro:
`A bruma sobe da costa como o sopro de um animal velho. Ys — a cidade que o mar engoliu há mil anos — voltou a respirar. Há três noites, pescadores juram ter visto torres negras emergindo na maré baixa, e um sino tocando sob a água.

Vocês quatro chegam ao porto de Penmarc'h ao anoitecer: você, com a marca da família ainda fresca no antebraço; Brennan, o bardo de cabelo cor de cobre, afinando a harpa; Sira, a clériga das marés, beijando uma concha em silêncio; e Korrin, o batedor de olhos cinzentos, já farejando o vento.

O taberneiro coxo limpa um copo e olha para vocês como quem mede o peso de uma corda. — "Vieram pela coroa, não vieram?"`,
    options: [
      { id: 'a', label: 'Pela coroa, sim. O que sabe sobre Ys?', tone: 'direct' },
      { id: 'b', label: 'Apenas viajantes. Uma cama e um caldo, por favor.', tone: 'cautious' },
      { id: 'c', label: 'Beber primeiro. Depois conversamos.', tone: 'social' },
      { id: 'd', label: 'Brennan se adianta e canta uma canção sobre o mar.', tone: 'bardic' }
    ]
  },
  player: {
    id: 'p',
    name: 'Você',
    role: 'Solar marcado',
    portrait: 'V',
    hp: 14, hpMax: 14,
    mp: 6, mpMax: 6,
    crp: 2, mnt: 2, alm: 2,
    tags: ['Espada longa', 'Marca de Ys', 'Anel-selo da família']
  },
  npcs: [
    {
      id: 'brennan', name: 'Brennan', role: 'Bardo de Cobre', portrait: 'B', portraitClass: 'npc-1',
      hp: 11, hpMax: 11, mp: 8, mpMax: 8,
      crp: 1, mnt: 3, alm: 2,
      tags: ['Harpa de osso', 'Adaga', 'Lábia']
    },
    {
      id: 'sira', name: 'Sira', role: 'Clériga das Marés', portrait: 'S', portraitClass: 'npc-2',
      hp: 13, hpMax: 13, mp: 10, mpMax: 10,
      crp: 2, mnt: 1, alm: 3,
      tags: ['Cajado de coral', 'Concha sagrada', 'Cura']
    },
    {
      id: 'korrin', name: 'Korrin', role: 'Batedor', portrait: 'K', portraitClass: 'npc-3',
      hp: 12, hpMax: 12, mp: 4, mpMax: 4,
      crp: 3, mnt: 2, alm: 1,
      tags: ['Arco curto', 'Faca de caça', 'Rastreio']
    }
  ],
  map: {
    title: 'Penmarc\'h — Porto da Bretanha',
    locations: [
      { id: 'tavern', x: 50, y: 55, label: 'Taberna do Pescador Coxo', current: true },
      { id: 'docks', x: 22, y: 32, label: 'Cais Velho' },
      { id: 'chapel', x: 76, y: 28, label: 'Capela de Sant Vinog' },
      { id: 'lighthouse', x: 88, y: 70, label: 'Farol Apagado' },
      { id: 'cliff', x: 14, y: 75, label: 'Penhasco da Bruma' }
    ]
  }
};

// === MAGIAS (v0.8 Fase 1 — fundação de progressão, Assembleia 08) ===
// window.MWRPG_SPELLS — catálogo pequeno de início (12, não as 100 do
// Relatório de uma vez — decisão da Assembleia 08, "mecanismo completo,
// conteúdo inicial pequeno"). Cada magia tem um limiar de Inteligência
// pra desbloqueio automático — nunca decidido pelo mestre, sempre lido
// daqui (mesmo princípio já usado pra mapas e itens: o LLM escolhe
// dentro do que o código registrou, nunca inventa magia fora daqui).
//
// Proveniência: nomes e conceitos inspirados no D&D 5e SRD 5.1
// (CC-BY 4.0) — ver Relatorio_Pesquisa_RPG.md §6 e
// docs/MAGIAS-PROVENIENCIA.md. Textos de efeito reescritos no tom do
// jogo, não copiados literalmente do SRD.
window.MWRPG_SPELLS = {
  list: [
    { id: 'mao-magica', nome: 'Mão Mágica', intMin: 0, escola: 'Evocação',
      efeito: 'Uma mão invisível ergue e move um objeto pequeno à distância, sem esforço nenhum.' },
    { id: 'luz', nome: 'Luz', intMin: 0, escola: 'Evocação',
      efeito: 'Um objeto tocado passa a brilhar como uma tocha por um bom tempo.' },
    { id: 'toque-curativo', nome: 'Toque Curativo', intMin: 0, escola: 'Cura',
      efeito: 'Um toque fecha um corte pequeno e alivia um pouco da dor.' },
    { id: 'curar-ferimentos', nome: 'Curar Ferimentos', intMin: 1, escola: 'Cura',
      efeito: 'Restaura uma quantidade real de HP em quem for tocado.' },
    { id: 'maos-flamejantes', nome: 'Mãos Flamejantes', intMin: 1, escola: 'Evocação',
      efeito: 'Um jato curto de fogo sai das mãos do conjurador, atingindo quem estiver à frente.' },
    { id: 'bencao', nome: 'Bênção', intMin: 1, escola: 'Abjuração',
      efeito: 'A sorte de um aliado próximo melhora por um tempo — as próximas ações dele saem um pouco mais fáceis.' },
    { id: 'palavra-de-cura', nome: 'Palavra de Cura', intMin: 2, escola: 'Cura',
      efeito: 'Uma única palavra basta pra fechar um ferimento à distância, sem precisar tocar.' },
    { id: 'raio', nome: 'Raio', intMin: 2, escola: 'Evocação',
      efeito: 'Um filete de eletricidade salta do conjurador até um alvo à frente, em linha reta.' },
    { id: 'escudo-arcano', nome: 'Escudo Arcano', intMin: 2, escola: 'Abjuração',
      efeito: 'Uma barreira invisível absorve o próximo golpe que o conjurador receberia.' },
    { id: 'bola-de-fogo', nome: 'Bola de Fogo', intMin: 3, escola: 'Evocação',
      efeito: 'Uma esfera de fogo explode numa área, atingindo tudo que estiver perto do ponto de impacto.' },
    { id: 'restauracao-menor', nome: 'Restauração Menor', intMin: 3, escola: 'Cura',
      efeito: 'Cura pequenos males que a cura comum não resolve — veneno leve, cansaço, uma tontura persistente.' },
    { id: 'muralha-de-fogo', nome: 'Muralha de Fogo', intMin: 4, escola: 'Evocação',
      efeito: 'Uma parede de chamas surge por um tempo, bloqueando a passagem e ferindo quem tentar atravessar.' }
  ]
};

// Magias que um personagem com determinada Inteligência já teria
// direito de saber (desbloqueio automático — Assembleia 08, Seção 1.4).
// Não confundir com "magias conhecidas" de verdade: o jogo ainda marca
// como conhecida só quando o desbloqueio é aplicado (ver src/app.jsx),
// isto aqui é só a lista de candidatas pro nível de INT dado.
function mwrpgSpellsUnlockedByInt(intValue) {
  const v = intValue || 0;
  return window.MWRPG_SPELLS.list.filter(s => s.intMin <= v);
}

function mwrpgFindSpell(spellId) {
  return window.MWRPG_SPELLS.list.find(s => s.id === spellId) || null;
}

Object.assign(window, { mwrpgSpellsUnlockedByInt, mwrpgFindSpell });

// === ACERVO DE DOMÍNIO PÚBLICO (v1) ===
// window.MWRPG_ACERVO — referências curadas (fábulas, mitologia, folclore)
// pra compor narração/monstros/situações em vez de gerar tudo do zero.
// Cada entrada tem proveniência registrada — ver docs/ACERVO-PROVENIENCIA.md.
window.MWRPG_ACERVO = {
  entries: [
    {
      id: 'fabula-raposa-cabra-poco',
      categoria: 'situacao',
      titulo: 'A Raposa e o Cabrito no Poço',
      tags: ['armadilha', 'poço', 'traição', 'esperteza', 'confiança quebrada'],
      resumoJogavel:
        'Um poço abandonado onde algo (ou alguém) prometeu ajuda a quem caiu lá dentro — e a ajuda tem um preço que só fica claro tarde demais. Boa base pra armadilha social: um PNJ oferece uma saída fácil de um perigo, mas a saída dele depende de outra vítima cair no lugar.',
      fonte: {
        obra: "Aesop's Fables (coletânea)",
        origem: 'Fábula grega atribuída a Esopo',
        url: 'https://www.gutenberg.org/files/21/21-h/21-h.htm',
        baseLegal: 'Domínio público (EUA) — Project Gutenberg eBook nº 21'
      }
    },
    {
      id: 'fabula-leao-doente',
      categoria: 'situacao',
      titulo: 'O Leão Doente',
      tags: ['emboscada', 'covil', 'predador', 'pistas', 'investigação'],
      resumoJogavel:
        'Um covil onde um predador finge fraqueza pra atrair visitantes — a pista que denuncia a armadilha são as pegadas: muitas entrando, nenhuma saindo. Ótima base pra uma masmorra pequena ou um encontro de investigação antes do combate.',
      fonte: {
        obra: "Aesop's Fables (coletânea)",
        origem: 'Fábula grega atribuída a Esopo',
        url: 'https://www.gutenberg.org/files/21/21-h/21-h.htm',
        baseLegal: 'Domínio público (EUA) — Project Gutenberg eBook nº 21'
      }
    },
    {
      id: 'fabula-lobo-cordeiro',
      categoria: 'situacao',
      titulo: 'O Lobo e o Cordeiro',
      tags: ['tirania', 'injustiça', 'poder', 'dilema moral', 'confronto'],
      resumoJogavel:
        'Um confronto onde o lado mais forte inventa justificativa atrás de justificativa pra oprimir o mais fraco, não importa a resposta dada. Boa base pra uma cena de tensão social/política sem combate — um nobre, guarda ou monstro que já decidiu o desfecho antes de "ouvir" o jogador.',
      fonte: {
        obra: "Aesop's Fables (coletânea)",
        origem: 'Fábula grega atribuída a Esopo',
        url: 'https://www.gutenberg.org/files/21/21-h/21-h.htm',
        baseLegal: 'Domínio público (EUA) — Project Gutenberg eBook nº 21'
      }
    },
    {
      id: 'mito-quimera',
      categoria: 'monstro',
      titulo: 'Quimera',
      tags: ['monstro', 'fera híbrida', 'fogo', 'chefe', 'montanha'],
      resumoJogavel:
        'Fera híbrida da mitologia grega — corpo de leão, cabeça de cabra emergindo do dorso, cauda de serpente, sopro de fogo. Vive em terreno isolado e hostil (originalmente a Lícia). Boa base pra chefe de área: três "fases" de ameaça num único corpo (mordida, chifrada, fogo).',
      fonte: {
        obra: "Bulfinch's Mythology — The Age of Fable",
        origem: 'Mito grego clássico (a criatura em si é domínio público; a prosa específica de Bulfinch não foi copiada aqui — descrição escrita própria)',
        url: 'https://www.gutenberg.org/ebooks/3327',
        baseLegal: 'Domínio público — Project Gutenberg eBook nº 3327'
      }
    },
    {
      id: 'mito-minotauro',
      categoria: 'monstro',
      titulo: 'Minotauro',
      tags: ['monstro', 'labirinto', 'masmorra', 'tributo', 'chefe'],
      resumoJogavel:
        'Criatura com corpo humano e cabeça de touro, presa no centro de um labirinto que ninguém que entra consegue sair sozinho. Boa base pra masmorra com fio condutor: um mapa que só se resolve com um recurso específico (fio, marcação, rastro) e um chefe final que é vítima e ameaça ao mesmo tempo.',
      fonte: {
        obra: "Bulfinch's Mythology — The Age of Fable",
        origem: 'Mito grego clássico (a criatura em si é domínio público; a prosa específica de Bulfinch não foi copiada aqui — descrição escrita própria)',
        url: 'https://www.gutenberg.org/ebooks/3327',
        baseLegal: 'Domínio público — Project Gutenberg eBook nº 3327'
      }
    },
    {
      id: 'folclore-curupira',
      categoria: 'monstro',
      titulo: 'Curupira',
      tags: ['floresta', 'guardião', 'folclore brasileiro', 'rastro', 'proteção'],
      resumoJogavel:
        'Figura do folclore brasileiro — guardião da mata, pés virados pra trás pra confundir quem tenta rastreá-lo, protege a floresta de caçadores e destruidores. Boa base pra um "vilão" que na verdade está do lado certo — um encontro que pode virar aliado se os jogadores mostrarem respeito pelo território.',
      fonte: {
        obra: 'Folclore popular brasileiro (tradição oral, múltiplas variantes regionais)',
        origem: 'Personagem de domínio público — descrição escrita própria, sem copiar nenhuma coletânea/tradução específica ainda protegida',
        url: 'https://www.dominiopublico.gov.br/',
        baseLegal: 'Folclore tradicional oral — sem autor identificável, sem prazo de proteção aplicável'
      }
    }
  ]
};

// Recuperação simples por sobreposição de tag — MVP, sem embeddings/RAG.
function pickAcervoLore(tags, max) {
  max = max || 2;
  var wanted = (tags || []).map(function (t) { return String(t).toLowerCase(); });
  var scored = window.MWRPG_ACERVO.entries.map(function (entry) {
    var score = entry.tags.filter(function (t) { return wanted.indexOf(t.toLowerCase()) !== -1; }).length;
    return { entry: entry, score: score };
  });
  scored.sort(function (a, b) { return b.score - a.score; });
  return scored.filter(function (s) { return s.score > 0; }).slice(0, max).map(function (s) { return s.entry; });
}

Object.assign(window, { pickAcervoLore: pickAcervoLore });

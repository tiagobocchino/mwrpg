# Magias — Registro de Proveniência

Registro de proveniência do catálogo em `src/spells.js` (v0.8 Fase 1 —
fundação de progressão, Assembleia 08). Mesma disciplina do
`docs/ACERVO-PROVENIENCIA.md` e `docs/MAPAS-PROVENIENCIA.md`: nada
entra sem licença verificada com fonte real — mas com uma diferença
importante em relação a tudo que já existia em produção antes: **é a
primeira vez que conteúdo do D&D 5e SRD 5.1 realmente entra no jogo**
(até aqui, `docs/ACERVO-PROVENIENCIA.md` só tinha fábula/mitologia/
folclore de domínio público — o SRD estava só na pesquisa fundadora,
nunca em código).

## Fonte

**D&D 5e SRD 5.1** — Anexo/lista de magias.

- Licença: **CC-BY 4.0**, liberada pela Wizards of the Coast em
  janeiro/2023 — https://www.dndbeyond.com/posts/1438-system-reference-document-5-1-now-available-under.
- Diferença em relação ao CC0 usado nos assets visuais (Kenney):
  CC-BY **exige atribuição visível**, não é domínio público puro. Por
  isso este catálogo, diferente dos mapas, precisa de um crédito
  visível em produção — ver `src/app.jsx` (`.app-credits`, rodapé fixo
  discreto) e `src/styles.css` (`.app-credits`).
- O que é reaproveitável sob essa licença: **nomes e conceitos** das
  magias (texto do SRD em si). O que **não** é coberto e continua
  Product Identity da WotC: stat blocks/mecânica exata de jogo — por
  isso os números e a mecânica de desbloqueio aqui são desenho
  original do MWRPG (D6 das Três Letras + Inteligência), não uma cópia
  do sistema de magia do D&D 5e.
- Lista completa de referência: `Relatorio_Pesquisa_RPG.md` §6 (100
  magias pesquisadas, fonte https://www.5esrd.com/spellcasting/all-spells/).

## Técnica usada

Catálogo pequeno de início (12 magias, não as 100 do Relatório de uma
vez) — decisão da Assembleia 08 ("mecanismo completo, conteúdo inicial
pequeno", mesmo padrão já usado nos itens da Assembleia 07). Nomes
inspirados nas amostras do Relatório §6.1 (categoria "Cura" e
"Elementais"); **textos de efeito reescritos no tom do jogo**, não
copiados literalmente do SRD — o Narrative Writer marcou isso como
requisito na Assembleia 08 (reaproveitar o nome sob CC-BY é diferente
de colar a descrição inteira).

## Magias no catálogo (`src/spells.js`)

| Id | Nome | INT mínima | Escola |
|---|---|---|---|
| `mao-magica` | Mão Mágica | 0 | Evocação |
| `luz` | Luz | 0 | Evocação |
| `toque-curativo` | Toque Curativo | 0 | Cura |
| `curar-ferimentos` | Curar Ferimentos | 1 | Cura |
| `maos-flamejantes` | Mãos Flamejantes | 1 | Evocação |
| `bencao` | Bênção | 1 | Abjuração |
| `palavra-de-cura` | Palavra de Cura | 2 | Cura |
| `raio` | Raio | 2 | Evocação |
| `escudo-arcano` | Escudo Arcano | 2 | Abjuração |
| `bola-de-fogo` | Bola de Fogo | 3 | Evocação |
| `restauracao-menor` | Restauração Menor | 3 | Cura |
| `muralha-de-fogo` | Muralha de Fogo | 4 | Evocação |

## Desbloqueio automático — quem decide, e por quê

Mesmo princípio já usado no mapa (Assembleia 06) e nos itens
(Assembleia 07): **o mestre (LLM) não inventa magia livremente — só
narra o uso de uma magia que já está na lista "conhecida" do
personagem**, calculada 100% em código (`src/engine.js`,
`intFromXp`/`xpForBand`, e `mwrpgSpellsUnlockedByInt` em
`src/spells.js`). O ganho de XP em si não depende de nenhum sinal do
mestre — é determinístico a partir da banda da própria rolagem
(crítico/pleno/parcial/falha) que o cliente já calcula, custo de token
zero pra essa parte (ver `CLAUDE.md` v0.8 Fase 1 pro detalhamento).

## Aprendizado por pergaminho/grimório — ainda não implementado

A segunda via de aquisição que o Tiago descreveu (ler um pergaminho/
grimório encontrado, com teste de conhecimentos gerais + Inteligência,
e treino escalonado por nível da magia) é a próxima fase depois desta
(Assembleia 08, Seção 1.2) — depende do sistema de itens da Assembleia
07 já estar no ar (scroll/grimório é um tipo de item).

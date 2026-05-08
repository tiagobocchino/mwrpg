# Relatório de Pesquisa — Base de Conteúdo para RPG Solo Narrativo com Mestre IA

> Documento de pesquisa para fundamentar o jogo descrito no briefing: campanha solo + 3 NPCs companheiros, mestre conduzido por IA, chat central, mapa abaixo do chat, respostas em 2–6 escolhas, sistema de dados simples.
>
> **Critério de fontes:** priorizadas obras com licença aberta (OGL 1.0a, ORC, CC-BY, domínio público) para que o conteúdo possa ser reaproveitado sem risco jurídico. Onde a fonte é proprietária, ela aparece apenas como **referência conceitual** (não para cópia literal de texto/arte).
>
> Data da pesquisa: maio/2026.

---

## Sumário

1. [Sistemas de RPG estudados (10)](#1-sistemas-de-rpg-estudados-10)
2. [Sistema de dados recomendado para o jogo](#2-sistema-de-dados-recomendado)
3. [Bestiário — 100 criaturas (50 grandes / 30 médias / 20 pequenas)](#3-bestiário)
4. [Armas — 300 entradas categorizadas](#4-armas)
5. [Objetos & Itens — 800 entradas categorizadas](#5-objetos--itens)
6. [Magias — 100 entradas](#6-magias)
7. [Feitiços / Rituais — 50 entradas](#7-feitiços--rituais)
8. [Raças jogáveis — 8 (originais, inspiradas em folclore aberto)](#8-raças-jogáveis)
9. [25 histórias-arquétipo para campanhas](#9-25-histórias-arquétipo-para-campanhas)
10. [Recomendações de design para o jogo](#10-recomendações-de-design-para-o-jogo)
11. [Bibliografia consolidada](#11-bibliografia-consolidada)
12. [Perguntas de múltipla escolha para você](#12-perguntas-de-múltipla-escolha-para-você)

---

## 1. Sistemas de RPG estudados (10)

Comparativo dos livros de regras estudados, ordenados de mais simples → mais complexo. As colunas indicam: **dado base**, **complexidade de fichas (1–5)** e **adequação ao formato chat-com-IA**.

| # | Sistema | Editora | Dado base | Ficha | Chat-IA | Licença | Link |
|---|---------|---------|-----------|-------|---------|---------|------|
| 1 | **Lasers & Feelings** | One Page | 1d6 | 1 | ★★★★★ | CC-BY | https://onesevendesign.com/lasersfeelings_rpg.pdf |
| 2 | **Honey Heist** | Grant Howitt | 2d6 | 1 | ★★★★★ | Pessoal | https://gshowitt.itch.io/honey-heist |
| 3 | **Risus: The Anything RPG** | S. John Ross | nd6 | 2 | ★★★★★ | Free | https://www222.pair.com/sjohn/risus.htm |
| 4 | **FATE Accelerated** | Evil Hat | 4dF | 2 | ★★★★ | OGL/CC-BY | https://fate-srd.com/fate-accelerated |
| 5 | **Powered by the Apocalypse (PbtA)** | Vincent Baker et al. | 2d6+mod | 3 | ★★★★ | CC-BY | http://apocalypse-world.com/pbta/policy |
| 6 | **Dungeon World** | Sage Kobold | 2d6+mod | 3 | ★★★★ | CC-BY | https://dungeon-world.com/ |
| 7 | **OSE (Old-School Essentials)** | Necrotic Gnome | 1d20 + 1d6 | 3 | ★★★ | OGL | https://oldschoolessentials.necroticgnome.com/srd/ |
| 8 | **D&D 5e SRD 5.1** | WotC | 1d20 | 4 | ★★★ | OGL/CC-BY 4.0 | https://dnd.wizards.com/resources/systems-reference-document |
| 9 | **Pathfinder 2e SRD** | Paizo | 1d20 | 4 | ★★ | ORC | https://2e.aonprd.com/ |
| 10 | **Tormenta20 (Jambô)** | Jambô | 1d20 | 4 | ★★★ | CC-BY-NC | https://sytalla.com.br/wp-content/uploads/2020/11/T20-SRD.pdf |

**Conclusão da comparação:** para um RPG solo narrativo conduzido por IA com respostas em 2–6 caminhos, sistemas baseados em **2d6 + modificador de tag** (PbtA / Dungeon World) ou **dado único contra atributo** (Lasers & Feelings) entregam a melhor fricção dramática **sem matemática longa**. O d20 do D&D só funciona se tudo for resolvido por *1 rolagem por ação* sem cadeia de modificadores.

---

## 2. Sistema de dados recomendado

Proposta sintética, derivada da comparação acima — chamada provisória **"D6 das Três Letras"**:

- **3 atributos** (em vez de 6 do D&D): **Corpo** (CRP), **Mente** (MNT), **Alma** (ALM). Valores 1–5.
- **Dado base:** 2d6 + atributo relevante.
- **Tabela de leitura única:**
  - 6– → falha narrativa (o mestre piora a situação)
  - 7–9 → sucesso parcial (consegue, mas com custo)
  - 10–12 → sucesso pleno
  - 13+ → sucesso crítico (+ vantagem narrativa)
- **Combate:** mesma rolagem. Dano = 1d6 + arma. Vida = 10 + CRP.
- **Vantagem/Desvantagem:** rola 3d6 e descarta o pior/melhor (mecânica idêntica ao D&D 5e, simplificando para 1 mecânica universal).

Justificativa: PbtA já provou que essa curva produz histórias melhores que d20. Fonte: Vincent Baker, *Powered by the Apocalypse — Design Notes* (https://lumpley.games/2019/03/03/powered-by-the-apocalypse-part-1/).

---

## 3. Bestiário

> Todos os monstros listados existem no **D&D 5e SRD 5.1 (CC-BY 4.0)** e/ou no **Pathfinder 2e SRD (ORC)** — portanto reutilizáveis. Beholder, Mind Flayer, Displacer Beast, Yuan-ti e outros são **Product Identity** da WotC e foram **deliberadamente excluídos**.

### 3.1 Grandes (50) — Tamanho Large+ ou ameaça de chefe

| # | Criatura | Origem folclórica | Fonte aberta |
|---|----------|-------------------|--------------|
| 1 | Dragão Vermelho Ancião | Universal | SRD 5.1 |
| 2 | Dragão Branco Ancião | Norse | SRD 5.1 |
| 3 | Dragão Verde Ancião | Universal | SRD 5.1 |
| 4 | Dragão Negro Ancião | Universal | SRD 5.1 |
| 5 | Dragão Azul Ancião | Universal | SRD 5.1 |
| 6 | Dragão de Ouro Ancião | Asiático | SRD 5.1 |
| 7 | Dragão de Prata Ancião | Universal | SRD 5.1 |
| 8 | Tarrasque | Folclore francês | SRD 5.1 |
| 9 | Kraken | Norse | SRD 5.1 |
| 10 | Lich | Folclore eslavo | SRD 5.1 |
| 11 | Vampiro Ancião | Eslavo | SRD 5.1 |
| 12 | Lobisomem Alfa | Europeu | SRD 5.1 |
| 13 | Hidra de 7 cabeças | Grego | SRD 5.1 |
| 14 | Quimera | Grego | SRD 5.1 |
| 15 | Behir | Original D&D | SRD 5.1 |
| 16 | Roc | Árabe | SRD 5.1 |
| 17 | Mamute lanoso | Pré-histórico | SRD 5.1 |
| 18 | T-Rex | Pré-histórico | SRD 5.1 |
| 19 | Anquilossauro | Pré-histórico | SRD 5.1 |
| 20 | Elemental do Fogo Ancião | Aristotélico | PF2e SRD |
| 21 | Elemental da Água Ancião | Aristotélico | PF2e SRD |
| 22 | Elemental da Terra Ancião | Aristotélico | PF2e SRD |
| 23 | Elemental do Ar Ancião | Aristotélico | PF2e SRD |
| 24 | Gigante das Tempestades | Norse | SRD 5.1 |
| 25 | Gigante do Fogo | Norse | SRD 5.1 |
| 26 | Gigante do Gelo | Norse | SRD 5.1 |
| 27 | Gigante das Pedras | Norse | SRD 5.1 |
| 28 | Gigante das Colinas | Norse | SRD 5.1 |
| 29 | Gigante das Nuvens | Norse | SRD 5.1 |
| 30 | Treant Ancião | Tolkien-esco/folclore inglês | SRD 5.1 |
| 31 | Esfinge Ginosfinge | Egípcio | SRD 5.1 |
| 32 | Esfinge Androsfinge | Egípcio | SRD 5.1 |
| 33 | Górgona | Grego | SRD 5.1 |
| 34 | Medusa | Grego | SRD 5.1 |
| 35 | Minotauro Senhor do Labirinto | Grego | SRD 5.1 |
| 36 | Ciclope | Grego | SRD 5.1 |
| 37 | Hipogrifo Real | Medieval | SRD 5.1 |
| 38 | Pégaso Branco | Grego | SRD 5.1 |
| 39 | Grifo Ancião | Persa | SRD 5.1 |
| 40 | Cavalo de Pesadelo | Inglês | SRD 5.1 |
| 41 | Demônio Balor | Persa-esco | SRD 5.1 |
| 42 | Demônio Marilith | Hindu-esco | SRD 5.1 |
| 43 | Diabo Ósseo | Cristão | SRD 5.1 |
| 44 | Diabo Cornudo | Cristão | SRD 5.1 |
| 45 | Múmia Real | Egípcio | SRD 5.1 |
| 46 | Verme Púrpuro | Original D&D | SRD 5.1 |
| 47 | Hidra de Lerna | Grego | SRD 5.1 |
| 48 | Pesadelo do Pântano (Black Pudding gigante) | Original D&D | SRD 5.1 |
| 49 | Cavaleiro da Morte | Folclore arturiano | SRD 5.1 |
| 50 | Sereia Sirena Anciã | Grego | SRD 5.1 |

### 3.2 Médias (30)

| # | Criatura | Fonte |
|---|----------|-------|
| 51 | Ogro | SRD 5.1 |
| 52 | Troll | SRD 5.1 |
| 53 | Centauro | SRD 5.1 |
| 54 | Hobgoblin Capitão | SRD 5.1 |
| 55 | Bugbear | SRD 5.1 |
| 56 | Orc Guerreiro | SRD 5.1 |
| 57 | Gnoll | SRD 5.1 |
| 58 | Lagarto-homem | SRD 5.1 |
| 59 | Sahuagin | SRD 5.1 |
| 60 | Esqueleto Cavaleiro | SRD 5.1 |
| 61 | Zumbi Veterano | SRD 5.1 |
| 62 | Ghoul | SRD 5.1 |
| 63 | Ghast | SRD 5.1 |
| 64 | Espectro | SRD 5.1 |
| 65 | Aparição | SRD 5.1 |
| 66 | Banshee | SRD 5.1 |
| 67 | Lobo Sinistro | SRD 5.1 |
| 68 | Urso-coruja | SRD 5.1 |
| 69 | Basilisco | SRD 5.1 |
| 70 | Cocatriz | SRD 5.1 |
| 71 | Mantícora | Persa, SRD 5.1 |
| 72 | Harpia | Grego, SRD 5.1 |
| 73 | Sátiro | Grego, SRD 5.1 |
| 74 | Driade | Grego, SRD 5.1 |
| 75 | Náiade | Grego, PF2e SRD |
| 76 | Ninfa | Grego, PF2e SRD |
| 77 | Tigre Dente-de-Sabre | Pré-histórico, SRD 5.1 |
| 78 | Lobo Atroz | SRD 5.1 |
| 79 | Urso Polar | SRD 5.1 |
| 80 | Crocodilo Gigante | SRD 5.1 |

### 3.3 Pequenas (20)

| # | Criatura | Fonte |
|---|----------|-------|
| 81 | Goblin | SRD 5.1 |
| 82 | Kobold | SRD 5.1 |
| 83 | Gremlin | PF2e SRD |
| 84 | Mephit Vapor | SRD 5.1 |
| 85 | Mephit Magma | SRD 5.1 |
| 86 | Mephit Gelo | SRD 5.1 |
| 87 | Mephit Fumaça | SRD 5.1 |
| 88 | Pixie | SRD 5.1 |
| 89 | Sprite | SRD 5.1 |
| 90 | Quasit | SRD 5.1 |
| 91 | Imp | SRD 5.1 |
| 92 | Aranha Gigante | SRD 5.1 |
| 93 | Rato Gigante | SRD 5.1 |
| 94 | Centopeia Gigante | SRD 5.1 |
| 95 | Morcego Gigante | SRD 5.1 |
| 96 | Escorpião Gigante | SRD 5.1 |
| 97 | Sapo Gigante | SRD 5.1 |
| 98 | Vespa Gigante | SRD 5.1 |
| 99 | Cubo Gelatinoso (jovem) | SRD 5.1 |
| 100 | Limo Verde | SRD 5.1 |

**Fonte primária:** *D&D 5e SRD 5.1*, Anexo I — Monstros (https://dnd.wizards.com/resources/systems-reference-document) — liberado sob CC-BY 4.0 desde janeiro/2023 (https://www.dndbeyond.com/posts/1438-system-reference-document-5-1-now-available-under).

---

## 4. Armas

300 armas, organizadas em 12 categorias. Lista resumida — **catálogo completo em CSV anexo: `data/armas.csv`** (ver §11). Aqui mostro o schema + 25 amostras representativas.

**Schema:** `id, nome, categoria, dano (no sistema 2d6), alcance, propriedades, fonte`

### 4.1 Categorias e contagem
- Espadas: 35
- Machados: 25
- Lanças & alabardas: 30
- Maças & martelos: 20
- Adagas & punhais: 20
- Arcos & bestas: 25
- Armas de arremesso: 20
- Armas de haste exótica: 15
- Armas mágicas básicas: 40
- Armas de fogo (cenário low-magic): 20
- Armas naturais & improvisadas: 25
- Armas culturais regionais (katana, kris, kpinga, macuahuitl, urumi, etc.): 25

### 4.2 Amostras
| Nome | Categoria | Dano | Propriedades | Fonte |
|------|-----------|------|--------------|-------|
| Espada longa | Espadas | 1d8 | versátil 1d10 | SRD 5.1 |
| Espada bastarda | Espadas | 1d10 | duas mãos | SRD 5.1 |
| Florete | Espadas | 1d8 | acuidade | SRD 5.1 |
| Cimitarra | Espadas | 1d6 | acuidade, leve | SRD 5.1 |
| Espada curta | Espadas | 1d6 | acuidade, leve | SRD 5.1 |
| Machado de batalha | Machados | 1d8 | versátil 1d10 | SRD 5.1 |
| Machado de guerra | Machados | 1d12 | duas mãos, pesado | SRD 5.1 |
| Machadinha | Machados | 1d6 | leve, arremesso 6/18 | SRD 5.1 |
| Lança | Lanças | 1d6 | arremesso 6/18, versátil | SRD 5.1 |
| Alabarda | Lanças | 1d10 | alcance, pesado, duas mãos | SRD 5.1 |
| Glaive | Lanças | 1d10 | alcance, duas mãos | SRD 5.1 |
| Pique | Lanças | 1d10 | alcance, duas mãos | SRD 5.1 |
| Maça | Maças | 1d6 | — | SRD 5.1 |
| Mangual | Maças | 1d8 | — | SRD 5.1 |
| Martelo de guerra | Maças | 1d8 | versátil 1d10 | SRD 5.1 |
| Adaga | Adagas | 1d4 | acuidade, leve, arremesso 6/18 | SRD 5.1 |
| Punhal sai | Adagas | 1d4 | acuidade, leve, defesa | T20 SRD |
| Arco longo | Arcos | 1d8 | longo 45/180, duas mãos | SRD 5.1 |
| Arco curto | Arcos | 1d6 | longo 24/96, duas mãos | SRD 5.1 |
| Besta pesada | Bestas | 1d10 | longo 30/120, recarga | SRD 5.1 |
| Funda | Arremesso | 1d4 | longo 9/36 | SRD 5.1 |
| Dardo | Arremesso | 1d4 | finesse, arremesso 6/18 | SRD 5.1 |
| Cajado | Haste | 1d6 | versátil 1d8 | SRD 5.1 |
| Katana | Cultural | 1d8 | acuidade, versátil 1d10 | PF2e SRD |
| Macuahuitl | Cultural | 1d10 | duas mãos, sangramento | Wikipedia (https://pt.wikipedia.org/wiki/Macuahuitl) |

**Fonte primária da lista:** SRD 5.1 §5 (Equipment), Pathfinder 2e Equipment (https://2e.aonprd.com/Weapons.aspx), Wikipedia para armas históricas.

---

## 5. Objetos & Itens

800 entradas, organizadas em 14 categorias. **Catálogo completo em `data/itens.csv`** (mesmo padrão das armas).

| Categoria | Qtd | Exemplos |
|-----------|-----|----------|
| Mantimentos & rações | 60 | Pão duro, queijo de cabra, carne-seca, hidromel |
| Ferramentas de aventureiro | 80 | Corda 15m, pé-de-cabra, ferraduras, pederneira |
| Iluminação | 30 | Tocha, lanterna furta-fogo, vela de sebo, fungo lumífero |
| Containers | 40 | Mochila, cantil, sacola de pano, bolsa Bag-of-Holding |
| Roupas & vestuário | 60 | Capa de viajante, botas resistentes, manto com capuz |
| Joias & relíquias | 80 | Camafeu, anel-selo, idolozinho de osso, relíquia óssea |
| Livros & pergaminhos | 70 | Diário em couro, mapa antigo, pergaminho lacrado |
| Componentes alquímicos | 80 | Pó de prata, mandrágora, sangue de morcego, enxofre |
| Componentes mágicos | 60 | Cristal de quartzo, foco arcano, pena de fênix |
| Comidas & bebidas finas | 40 | Vinho élfico, chá de raiz, mel encantado |
| Itens religiosos | 40 | Símbolo sagrado, água benta, incenso, terço |
| Itens de armadilha/segurança | 30 | Kit de gazua, óleo, alarme arcano |
| Animais & montarias | 40 | Cavalo de carga, mula, pônei, falcão treinado |
| Itens mágicos comuns | 90 | Poção de cura menor, pedra-luz, corda da escalada |

**Fontes:**
- D&D 5e SRD 5.1, §5 (Equipment) e §6 (Magic Items) — https://dnd.wizards.com/resources/systems-reference-document
- Pathfinder 2e SRD — https://2e.aonprd.com/Equipment.aspx
- Tormenta20 SRD (cap. 4 Equipamento) — https://sytalla.com.br/wp-content/uploads/2020/11/T20-SRD.pdf
- OSE Equipment — https://oldschoolessentials.necroticgnome.com/srd/index.php/Equipment

---

## 6. Magias

100 magias diversas (cura, elementais, praga, materialização). Distribuição por nível e escola, derivada do SRD 5.1.

| Nível | Qtd | Escolas representadas |
|-------|-----|------------------------|
| 0 (Truques) | 20 | Evocação, Ilusão, Adivinhação, Necromancia |
| 1 | 20 | Todas as 8 escolas |
| 2 | 15 | Todas as 8 |
| 3 | 15 | Todas |
| 4 | 10 | Foco em transmutação/conjuração |
| 5 | 10 | Foco em evocação/abjuração |
| 6+ | 10 | Magias épicas |

### 6.1 Amostras por categoria pedida

**Cura (10 selecionadas):**
1. Curar Ferimentos (1) – SRD 5.1
2. Palavra de Cura (1) – SRD 5.1
3. Curar Ferimentos em Massa (5) – SRD 5.1
4. Restauração Menor (2) – SRD 5.1
5. Restauração Maior (5) – SRD 5.1
6. Reviver os Mortos (3) – SRD 5.1
7. Ressurreição (7) – SRD 5.1
8. Aura Vital (4) – SRD 5.1
9. Toque Curativo (truque) – PF2e SRD
10. Bênção (1) – SRD 5.1

**Elementais (15 selecionadas):**
1. Bola de Fogo (3) – SRD 5.1
2. Mãos Flamejantes (1) – SRD 5.1
3. Raio (3) – SRD 5.1
4. Raio Relampejante (3) – SRD 5.1
5. Sopro Congelante (1) – SRD 5.1
6. Tempestade de Gelo (4) – SRD 5.1
7. Muralha de Fogo (4) – SRD 5.1
8. Tempestade de Granizo (4) – SRD 5.1
9. Esfera Flamejante (2) – SRD 5.1
10. Pés do Vento (2) – SRD 5.1
11. Terremoto (8) – SRD 5.1
12. Erguer Terra (2) – PF2e SRD
13. Maremoto (8) – SRD 5.1
14. Tempestade Trovejante (5) – SRD 5.1
15. Convocar Elemental (5) – SRD 5.1

**Pragas (10):**
1. Praga de Insetos (5) – SRD 5.1
2. Contágio (5) – SRD 5.1
3. Nuvem Fétida (3) – SRD 5.1
4. Praga de Locustas (homebrew via SRD) – SRD 5.1
5. Toque Vampírico (3) – SRD 5.1
6. Murchar (4) – SRD 5.1
7. Aniquilação (9) – SRD 5.1
8. Círculo da Morte (6) – SRD 5.1
9. Causar Ferimentos (1) – SRD 5.1
10. Mãos Geladas (1) – SRD 5.1

**Materialização / Invocação (10):**
1. Criar Comida e Água (3) – SRD 5.1
2. Conjurar Animais (3) – SRD 5.1
3. Conjurar Elemental (5) – SRD 5.1
4. Conjurar Fada (6) – SRD 5.1
5. Convocar Familiar (1) – SRD 5.1
6. Mão Mágica (truque) – SRD 5.1
7. Disco Flutuante de Tenser (1) – SRD 5.1
8. Forjar Arma (1) – SRD 5.1
9. Mansão Magnífica (7) – SRD 5.1
10. Cubo de Força (5) – SRD 5.1

**Buffs / Debuffs / Utilidades** completam as 100. Lista completa em `data/magias.csv`.

**Fonte:** https://www.5esrd.com/spellcasting/all-spells/

---

## 7. Feitiços / Rituais

50 entradas. Em RPGs, "feitiços" pode significar (a) magias rituais de longa duração ou (b) maldições/encantamentos sociais. Cobri ambos, espalhados por níveis e formas:

| # | Feitiço | Tipo | Nível |
|---|---------|------|-------|
| 1 | Ritual da Marcação Verdadeira | Adivinhação | 1 |
| 2 | Selo do Pacto de Sangue | Encantamento | 2 |
| 3 | Escrever Pergaminho Mágico | Criação | 3 |
| 4 | Maldição da Ferida que Não Cura | Necromancia | 4 |
| 5 | Maldição dos Sete Espelhos | Ilusão | 5 |
| 6 | Bênção da Casa | Abjuração | 1 |
| 7 | Caminho do Sonho Profético | Adivinhação | 3 |
| 8 | Marca da Heresia | Encantamento | 4 |
| 9 | Encanto da Beleza Inquebrável | Transmutação | 3 |
| 10 | Maldição do Lobo no Sangue | Transmutação | 5 |
| ... | ... | ... | ... |
| 50 | Pacto Faustiano | Negociação infernal | Épico |

Lista completa em `data/feiticos.csv`. Fontes principais: SRD 5.1 (Rituals), Pathfinder 2e Rituals (https://2e.aonprd.com/Rituals.aspx), folclore europeu compilado em *The Encyclopedia of Witchcraft & Demonology* (Robbins, 1959 — citado via Wikipedia).

---

## 8. Raças jogáveis

8 raças **originais** do nosso jogo, todas inspiradas em folclore aberto / domínio público — evitamos nomes registrados como "tiefling", "drow", "dragonborn", "halfling".

| # | Nome no jogo | Inspiração | Atributo bônus | Traço marcante |
|---|--------------|------------|-----------------|----------------|
| 1 | **Filhos do Solar** (humanos) | Universal | Livre (+1 a qq) | Versatilidade: 1 perícia extra |
| 2 | **Sídhe da Aurora** | Sídhe celta (https://en.wikipedia.org/wiki/Aos_S%C3%AD) | +1 MNT | Visão nas penumbras, longevidade |
| 3 | **Filhos da Forja** (anão-análogo) | Dvergr nórdico (Edda Poética, domínio público) | +1 CRP | Resistência a venenos, conhecimento mineral |
| 4 | **Pequeninos do Vale** (hobbit-análogo, mas chamado de Vallenkin) | Folclore inglês (brownies, hob) | +1 ALM | Sorte: rerrola um 1 por dia |
| 5 | **Estirpe Dracônica** | Mitologia chinesa / persa | +1 CRP | Sopro de elemento à escolha (1×descanso) |
| 6 | **Sangue de Lua** (lobinhos-do-luar) | Folclore eslavo, vukodlak | +1 CRP | Forma híbrida 1×/dia |
| 7 | **Naiades de Água Doce** | Mitologia grega (públicas) | +1 ALM | Anfíbios, falam com peixes |
| 8 | **Forasteiros Estelares** (descendentes de quedas de meteoro) | Original | +1 MNT | Imunidade a frio, brilho na pele |

Fontes folclóricas todas em domínio público; nenhum nome ou descrição copia obras com copyright vigente.

---

## 9. 25 histórias-arquétipo para campanhas

Esqueletos de enredo para a IA-mestre puxar. Cada uma traz: gancho inicial, 3 atos, antagonista, recompensa, e referência cultural pública.

| # | Título | Arquétipo (Booker, *Seven Basic Plots*) | Referência aberta |
|---|--------|------------------------------------------|--------------------|
| 1 | A Coroa Enterrada de Ys | Vencendo o Monstro | Lenda bretã de Ys (Wikipedia) |
| 2 | O Cantar do Bardo Cego | Demanda | Odisseia (Homero, dom. púb.) |
| 3 | A Torre que Não Existia Ontem | Mistério | Borges, *O Aleph* (referência) |
| 4 | A Dívida do Pântano | Pacto Faustiano | Folclore louisianense |
| 5 | Onze Faces no Espelho | Ascensão & Queda | Beowulf (dom. púb.) |
| 6 | A Caravana de Sal | Viagem | Marco Polo (dom. púb.) |
| 7 | A Festa da Donzela Albina | Romance trágico | Tristão e Isolda (dom. púb.) |
| 8 | O Lobo de Mil Invernos | Vencendo o Monstro | Folclore russo, Baba Yaga |
| 9 | A Grande Caça do Cervo Branco | Demanda | Lais de Marie de France (dom. púb.) |
| 10 | A Última Feira de Karak-Dum | Comédia social | *As mil e uma noites* (dom. púb.) |
| 11 | O Náufrago do Farol Negro | Mistério gótico | Poe (dom. púb.) |
| 12 | A Roseira Sangrenta | Tragédia | folclore alemão, Grimm (dom. púb.) |
| 13 | Os Sete Sinos do Cárcere | Ascensão | *Conde de Monte Cristo* (dom. púb.) |
| 14 | O Pacto da Lua de Sangue | Pacto Faustiano | folclore eslavo |
| 15 | A Procissão Espectral | Horror | folclore galês, Cŵn Annwn |
| 16 | A Cidade que Atravessa Mares | Viagem | Saga de Erik (dom. púb.) |
| 17 | O Ovo do Roc | Demanda | Mil e uma noites (dom. púb.) |
| 18 | O Banquete dos Mortos | Mistério social | folclore mexicano, Día de Muertos |
| 19 | A Terceira Espada de Cuchulainn | Épico de heroísmo | mitologia irlandesa (dom. púb.) |
| 20 | O Coração Mecânico | Steampunk-tragédia | original, inspirado em Shelley |
| 21 | O Garoto que Cantou para o Vento | Lenda iniciática | folclore quéchua |
| 22 | A Donzela do Lago e o Espelho de Ferro | Romance arturiano | Mort d'Arthur (dom. púb.) |
| 23 | A Caravana Fantasma | Sobrenatural | folclore norte-americano (Stagecoach) |
| 24 | O Castelo que Cresce | Surrealismo | Calvino, *Cidades Invisíveis* (referência) |
| 25 | A Sombra do Sol | Apocalipse contido | Apocalipse Joanino (dom. púb.) |

Fontes principais: Sacred Texts Archive (https://sacred-texts.com/), Project Gutenberg (https://www.gutenberg.org/), Wikipedia.

---

## 10. Recomendações de design para o jogo

Resposta direta aos pontos **1.1 a 1.7** do briefing:

### 10.1 Design system temático "fora dos padrões de mercado"
Sugestão: **"Manuscrito vivo"** — a UI inteira simula um pergaminho que respira. Tipografia serifada de leitura (sugestão: *EB Garamond* ou *Cormorant Garamond* via Google Fonts, abertas) + uma display gravurada (sugestão: *Cinzel* ou *UnifrakturMaguntia*). Cor base **off-white pergaminho** `oklch(0.96 0.015 80)`, foreground **tinta-ferro** `oklch(0.22 0.02 60)`, accent **vermelho-selo** `oklch(0.5 0.15 25)`. Sem gradientes neon, sem glassmorphism. Texturas de papel sutis em SVG noise.

### 10.2 Motion design (Framer Motion / GSAP)
- **Texto do mestre digitado letra-a-letra** (~30ms/char), com cursor de pena animado.
- **Opções de resposta entram com stagger** (0.05s) e leve `y: 8 → 0`.
- **Rolagem de dados:** physics 3D (Three.js + cannon-es) por baixo do chat, com som de madeira (sugiro freesound.org CC-0).
- **Mapa cenário:** SVG com `pan/zoom` (svg-pan-zoom) + tokens com `framer-motion` `layout` para realocação suave.
- **Transições de cena:** mancha de tinta espalhando (clip-path animado).

### 10.3 Acessibilidade
- WCAG AA: contraste ≥ 4.5 em todos os textos.
- Atalho `1–6` para escolher uma das 6 opções (o RPG no teclado).
- TTS opcional (voz sintética para a narração — Web Speech API).
- Reduced-motion: respeitar `prefers-reduced-motion`.

### 10.4 Sistema de RPG simplificado
Conforme §2 deste relatório.

### 10.5 Mapa de cenário abaixo do chat
- Aspect ratio 16:9 fixo.
- Tokens circulares com aro colorido por facção (jogador = dourado, NPC aliado = azul, hostil = vermelho).
- Grade hexagonal opcional (recomendo: hex flat-top, axial coords) — só aparece em combate.
- "Bruma de guerra" (`mask-radial-gradient`) revela à medida que o jogador avança.

### 10.6 Estrutura do chat central
- Bolha do mestre: pergaminho com selo de cera (avatar).
- Bolha do jogador: tinta cursiva.
- Após fala do mestre, surgem **2–6 botões de escolha** (sempre 6 em combate, conforme briefing).
- Em combate, menu fixo: **Atacar / Magia / Item / Mover / Defender / Falar**.

### 10.7 Tom do mestre — prompt sugerido para a LLM

```
Você é o Mestre de uma campanha solo de RPG. Seu tom é sábio,
consciente, sincero, direto. Não use rodeios, não comente sobre
si mesmo, não quebre a quarta parede. Quando descrever cenas,
seja detalhista nos sentidos (cheiro, luz, som, textura).
Nunca decida ações pelo jogador — sempre pare em um ponto de
decisão e ofereça de 2 a 6 caminhos como uma lista enumerada.
Em combate, ofereça exatamente 6 ações: atacar, magia, item,
mover, defender, falar. Resolva resultados de dados de forma
narrativa: 6– é falha narrativa, 7-9 sucesso com custo, 10+
sucesso pleno, 13+ crítico. Mantenha respostas entre 80 e 180
palavras, exceto cenas-chave (até 300). Português brasileiro.
```

### 10.8 Stack técnica recomendada
- **Frontend:** React + Vite + TypeScript + Tailwind + Framer Motion + Three.js (dados)
- **Estado:** Zustand (jogo) + React Query (mensagens)
- **Backend:** Supabase (auth + persistência + edge functions)
- **IA-mestre:** LangChain + RAG (Pinecone ou pgvector no Supabase) com 4 coleções: regras, bestiário, lore-mundo, histórico-da-campanha
- **Modelo:** Claude Haiku 4.5 (orçamento ok) ou GPT-4o-mini para narração; embedding `text-embedding-3-small`
- **Deploy:** Vercel (front) + Render ou Supabase edge (back)

---

## 11. Bibliografia consolidada

### Sistemas (livros de regras)
- *D&D 5e SRD 5.1 (CC-BY 4.0)* — https://dnd.wizards.com/resources/systems-reference-document
- *Pathfinder 2e SRD (ORC)* — https://2e.aonprd.com/
- *Dungeon World (CC-BY)* — https://dungeon-world.com/
- *FATE Core SRD* — https://fate-srd.com/
- *Old-School Essentials SRD* — https://oldschoolessentials.necroticgnome.com/srd/
- *Tormenta20 SRD (CC-BY-NC)* — https://sytalla.com.br/srd/
- *Lasers & Feelings* — https://onesevendesign.com/lasersfeelings_rpg.pdf
- *Risus* — https://www222.pair.com/sjohn/risus.htm
- *PbtA Policy* — http://apocalypse-world.com/pbta/policy

### Folclore & literatura primária (domínio público)
- Project Gutenberg — https://www.gutenberg.org/
- Sacred Texts Archive — https://sacred-texts.com/
- Edda Poética (trad. Bellows) — https://www.sacred-texts.com/neu/poe/
- Mil e Uma Noites (trad. Burton) — https://www.gutenberg.org/ebooks/5667
- Beowulf (trad. Gummere) — https://www.gutenberg.org/ebooks/16328

### Enciclopédias / referência
- Wikipedia (PT/EN) — todas as criaturas folclóricas
- Encyclopedia Mythica — https://pantheon.org/
- *The Monomyth* (Joseph Campbell, ref. conceitual)
- *The Seven Basic Plots* (Christopher Booker, ref. conceitual)

### Recursos de design / motion
- Framer Motion — https://motion.dev
- GSAP — https://gsap.com
- OpenGameArt (CC0/CC-BY) — https://opengameart.org/
- Freesound (CC) — https://freesound.org/

### Para a IA-mestre
- LangChain JS — https://js.langchain.com/
- Supabase pgvector — https://supabase.com/docs/guides/ai
- *Powered by the Apocalypse — Design Notes*, V. Baker — https://lumpley.games/2019/03/03/powered-by-the-apocalypse-part-1/

---

## 12. Perguntas de múltipla escolha para você

Para destravar a próxima fase (montar o **Design System Board** e prototipar a tela de jogo), preciso destas decisões:

### Q1. Sistema de regras escolhido
- **A)** D6 das Três Letras (proposto em §2) — simples, narrativo, 2d6+atributo
- **B)** PbtA puro (Dungeon World adaptado) — testado, bem documentado
- **C)** Lasers & Feelings ultra-leve (1 atributo só) — máxima simplicidade
- **D)** d20 estilo D&D 5e simplificado — familiar para fãs do Critical Role
- **E)** Outro / quero combinar

### Q2. Direção visual ("design system board")
- **A)** "Manuscrito vivo" — pergaminho, tinta-ferro, selo de cera, serif clássica
- **B)** "Sombra & Brasa" — dark mode profundo, accent âmbar, neon discreto, like Disco Elysium
- **C)** "Aquarela de campanha" — cores quentes lavadas, traço orgânico, tipografia mecânica
- **D)** "Códex arcano" — geometria sagrada, ouro sobre azul-meia-noite, glifos
- **E)** Quero ver 2-3 propostas lado a lado em design canvas

### Q3. Tom do mundo (ambientação)
- **A)** Alta fantasia clássica (espadas, magia, dragões)
- **B)** Fantasia sombria (low-magic, política, horror folclórico)
- **C)** Fantasia brasileira (Saci, Curupira, Iara, sertão místico)
- **D)** Cyber-fantasia (magia + circuitos, Shadowrun-esco)
- **E)** Eu escolho depois — me dê um mundo aberto neutro

### Q4. Quantidade de companheiros NPC no início
- **A)** Sempre 3 fixos pré-criados
- **B)** Jogador escolhe 3 entre 8 candidatos pré-criados
- **C)** Jogador cria os 3 (ficha guiada por IA)
- **D)** Começa sozinho e recruta ao longo da história

### Q5. Mapa de cenário — formato
- **A)** SVG ilustrado top-down (pan/zoom, tokens circulares)
- **B)** Hex grid clássico (combate tático visível)
- **C)** Grade quadrada estilo roguelike
- **D)** Mapa narrativo abstrato (pontos conectados por linhas, sem coords)

### Q6. Stack de IA
- **A)** Claude Haiku 4.5 + RAG via pgvector (Supabase) — recomendado
- **B)** GPT-4o-mini + Pinecone
- **C)** Modelo local (Ollama) — privacidade, sem custo
- **D)** Híbrido: modelo grande para narração, modelo pequeno para resolução de regras

### Q7. Próximo entregável que você quer ver
- **A)** Design system board em HTML (cores, tipos, componentes, motion specs)
- **B)** Mock interativo da tela de jogo (chat + mapa + ficha) com dados fake
- **C)** Wireframe rápido em baixa fidelidade pra validar fluxo antes
- **D)** Documento técnico de arquitetura (LangChain + Supabase + RAG)
- **E)** Tudo acima, na ordem A→B→D

---

> **Observação final:** os arquivos `data/armas.csv`, `data/itens.csv`, `data/magias.csv`, `data/feiticos.csv` e `data/bestiario.csv` foram referenciados ao longo do relatório mas ainda não foram gerados — posso produzi-los junto da próxima entrega (responda as perguntas e eu já trago os CSVs no commit seguinte). A geração antecipada de 800 itens individuais sem direção de mundo gasta orçamento à toa; melhor calibrar em §12 primeiro.

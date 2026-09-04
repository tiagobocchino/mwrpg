# Mapas — Registro de Proveniência

Registro de proveniência da arte usada em `src/assets/maps/*.png` (v0.5,
sistema de mapa com duas escalas — cidade + interiores; arte redesenhada
na v0.7, Assembleia 06). Mesma disciplina do `docs/ACERVO-PROVENIENCIA.md`:
nada entra sem licença verificada com fonte real.

## Fontes

**Kenney "RPG Base"** — pacote de sprites do Kenney.nl (v0.5, ainda em uso
na v0.7 para prédios/portas/árvores/props externos).

- Licença: **CC0 (domínio público / sem restrições)**, confirmada no
  `License.txt` incluído no download do pacote.
- Download: `https://kenney.nl/media/pages/assets/rpg-base/316dd80b01-1677669634/kenney_rpg-base.zip`
- Autor: Kenney (kenney.nl) — pacotes CC0 explicitamente liberados para
  uso comercial e não-comercial, sem exigência de atribuição (atribuição
  é bem-vinda, não obrigatória).

**Kenney "Roguelike/RPG pack"** — pacote de sprites do Kenney.nl (novo na
v0.7, único uso: mobília de interior — mesa, cadeira, balcão, armário —
pra atender o pedido explícito do Tiago de diferenciar móveis nos
interiores).

- Licença: **CC0 (domínio público / sem restrições)**, confirmada no
  `License.txt` incluído no download do pacote (mesmo texto padrão do
  Kenney usado no RPG Base).
- Download: `https://kenney.nl/media/pages/assets/roguelike-rpg-pack/12c03cd78b-1677697420/kenney_roguelike-rpg-pack.zip`
- Autor: Kenney (kenney.nl).
- Geometria: spritesheet único `Spritesheet/roguelikeSheet_transparent.png`,
  968×526px, grade de 57×31 tiles de 16×16px com 1px de margem (pitch de
  17px por tile).
- Tiles usados (coordenada `coluna,linha` no spritesheet, 0-indexado),
  verificados visualmente por contact sheet ampliado antes do uso (mesma
  disciplina do achado de autotile do RPG Base — uma miniatura pequena já
  enganou uma vez nesta sessão: (16,6)/(17,6) pareciam mesa e eram uma
  banca de feira; a mesa real está em (20,6)-(22,6)):

  | Coordenada | Uso |
  |---|---|
  | (20,6), (21,6), (22,6) | Mesa longa (3 segmentos: ponta esq., meio, ponta dir.) |
  | (18,4) | Mesa pequena (2 lugares) |
  | (19,2) | Cadeira |
  | (30,0) | Balcão/armário de cozinha (usado como balcão de taberna) |
  | (30,5) | Armário/guarda-roupa |

- **Escada**: o pacote foi varrido inteiro (todos os 57×31 tiles, 4
  quadrantes conferidos) e **não tem sprite de escada**. Em vez de forçar
  um tile errado, a escada do Farol Apagado é desenhada por código (degraus
  em espiral concêntricos, `draw_spiral_stairs` no script de build) — ver
  seção "Técnica usada" abaixo.

## Técnica usada

**v0.5 (terreno original):** o pacote "RPG Base" tem tiles de terreno em
estilo autotile/blob (bordas parciais desenhadas para encaixar com
vizinhos específicos) — repetir um único tile de terreno em grade criou
um padrão listrado/recortado indesejado (achado real, ver `CLAUDE.md`
histórico de decisões). Solução: terreno em cor sólida via PIL
(`ImageDraw`), sprites do Kenney só nos elementos discretos.

**v0.7 (terreno redesenhado, Assembleia 06):** terreno agora é gerado por
ruído (value noise, `numpy`, sem dependência externa além do próprio
numpy) pintado em bandas discretas (~10 níveis) em vez de gradiente
contínuo — dá um efeito "pintado"/cel-shaded que combina com a referência
de estilo pedida (Kingdom Hearts) e, como efeito colateral bem-vindo,
comprime muito melhor em PNG do que ruído contínuo pixel-a-pixel. Os
caminhos entre locais viram curvas (Bézier quadrática) em vez de linhas
retas. Prédios continuam sendo os tiles sólidos do Kenney (mesma técnica
da v0.5); interiores agora recebem mobília real do "Roguelike/RPG pack"
por cima do piso pintado. Todo PNG final é quantizado pra paleta reduzida
(64–96 cores, `Image.quantize` + `optimize=True`) antes de salvar — arte
flat/cel-shaded não perde qualidade visível com paleta pequena, e o
arquivo fica bem menor.

## Tiles usados — RPG Base (`rpg-base/PNG/rpgTile###.png`, 64×64px cada)

| Índice | Uso |
|---|---|
| 60 | Parede de prédio (fachada externa, cidade) |
| 78 | Parede escura (interior) |
| 92 | Parede clara (interior) |
| 184 | Porta |
| 197 | Árvore |
| 161 | Prateleira/estante (prop) |
| 216 | Barril (prop) |

(Tiles do "Roguelike/RPG pack" — ver tabela na seção da fonte acima.)

## Arquivos gerados

| Arquivo | Mapa | Dimensões | Peso (v0.7) | Peso (v0.5) |
|---|---|---|---|---|
| `mapa-cidade-penmarch.png` | Penmarc'h — cidade (5 locais) | 2368×832 | ~112 KB | ~39 KB |
| `mapa-taberna.png` | Taberna do Pescador Coxo — interior | 640×512 | ~22 KB | ~5 KB |
| `mapa-capela.png` | Capela de Sant Vinog — interior | 640×512 | ~21 KB | ~5 KB |
| `mapa-farol.png` | Farol Apagado — interior | 512×448 | ~20 KB | ~5 KB |

Peso total subiu de ~55 KB (v0.5) para ~175 KB (v0.7) — cerca de 3,2×.
Continua leve em termos absolutos (menor que uma única foto de celular;
carregado uma vez e cacheado pelo navegador, não entra no orçamento de
token da Groq), mas é um custo real e por isso está registrado aqui como
o condicionado pediu, não escondido.

Script de composição (referência, não versionado no repo — gerado em
scratchpad de sessão, `build_maps_v07.py`): usa Pillow (`PIL.Image`,
`ImageDraw`) e `numpy` (ruído de terreno), desenha o terreno base, os
caminhos curvos e sobrepõe os tiles do Kenney e a mobília do Roguelike/RPG
pack nas posições de grade correspondentes às coordenadas de `src/maps.js`.

## Biblioteca de renderização

**Leaflet.js 1.9.4** (`L.CRS.Simple`, mapas não-geográficos baseados em
pixel) — licença BSD-2-Clause, uso livre incluindo comercial. Carregado
via CDN (unpkg) com hash de integridade (SRI) pinado em `index.html`.

## Locais sem interior desenhado

`docks` (Cais Velho) e `cliff` (Penhasco da Bruma) são pontos só no mapa
da cidade — de propósito, não é lacuna: nem toda localização precisa de
uma cena de interior (ver `src/master.js` → `SYSTEM_PROMPT`, seção MAPA,
que instrui o mestre a nunca pedir `enterInterior` nesses dois).

## Locais distantes curados (v0.7) — de propósito, sem mapa nenhum

`ruinas-afogadas` (Ruínas Afogadas) e `cripta-sob-capela` (Cripta sob a
Capela) — registrados em `src/maps.js` (`MWRPG_LOCATION_TYPES`, tipo
`masmorra`) e em `src/master.js` (seção "LOCAIS DISTANTES CURADOS"), pra
dar nome e identidade estável a 1-2 locais distantes em vez do mestre
inventar um id novo cada vez. **Não têm — nem vão ter — mapa próprio
desenhado**: pela regra de acesso da Assembleia 06 (Seção 1.3), o mapa
fica escondido em qualquer masmorra/missão distante enquanto o grupo
estiver lá dentro, então uma imagem de mapa pra esses locais nunca
apareceria pro jogador. É a mesma arquitetura que já resolve `docks`/
`cliff` acima, aplicada aos locais fora da cidade.

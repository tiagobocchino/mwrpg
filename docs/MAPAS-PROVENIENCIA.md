# Mapas — Registro de Proveniência

Registro de proveniência da arte usada em `src/assets/maps/*.png` (v0.5,
sistema de mapa com duas escalas — cidade + interiores). Mesma disciplina
do `docs/ACERVO-PROVENIENCIA.md`: nada entra sem licença verificada com
fonte real.

## Fonte

**Kenney "RPG Base"** — pacote de sprites do Kenney.nl.

- Licença: **CC0 (domínio público / sem restrições)**, confirmada no
  `License.txt` incluído no download do pacote.
- Download: `https://kenney.nl/media/pages/assets/rpg-base/316dd80b01-1677669634/kenney_rpg-base.zip`
- Autor: Kenney (kenney.nl) — pacotes CC0 explicitamente liberados para
  uso comercial e não-comercial, sem exigência de atribuição (atribuição
  é bem-vinda, não obrigatória).

## Técnica usada

O pacote "RPG Base" tem tiles de terreno em estilo autotile/blob (bordas
parciais desenhadas para encaixar com vizinhos específicos) — repetir um
único tile de terreno em grade criou um padrão listrado/recortado
indesejado (achado real, ver `CLAUDE.md` histórico de decisões). Solução
final: terreno (grama, água, terra batida, piso de interior) é cor sólida
desenhada via PIL (`ImageDraw`), com leve efeito de xadrez sutil; os
sprites reais do Kenney entram só nos elementos discretos (prédios,
portas, árvores, móveis), sobrepostos via `alpha_composite`.

## Tiles usados (`rpg-base/PNG/rpgTile###.png`, 64×64px cada)

| Índice | Uso |
|---|---|
| 60 | Parede de prédio (fachada externa, cidade) |
| 78 | Parede escura (interior) |
| 92 | Parede clara (interior) |
| 184 | Porta |
| 197 | Árvore |
| 161 | Prateleira/estante (prop) |
| 216 | Barril (prop) |

## Arquivos gerados

| Arquivo | Mapa | Dimensões | Script |
|---|---|---|---|
| `mapa-cidade-penmarch.png` | Penmarc'h — cidade (5 locais) | 2368×832 | `build_maps.py` |
| `mapa-taberna.png` | Taberna do Pescador Coxo — interior | 640×512 | `build_maps.py` |
| `mapa-capela.png` | Capela de Sant Vinog — interior | 640×512 | `build_maps.py` |
| `mapa-farol.png` | Farol Apagado — interior | 512×448 | `build_maps.py` |

Script de composição (referência, não versionado no repo — gerado em
scratchpad de sessão): usa Pillow (`PIL.Image`, `ImageDraw`), desenha o
terreno base e sobrepõe os tiles do Kenney nas posições de grade
correspondentes às coordenadas de `src/maps.js`.

## Biblioteca de renderização

**Leaflet.js 1.9.4** (`L.CRS.Simple`, mapas não-geográficos baseados em
pixel) — licença BSD-2-Clause, uso livre incluindo comercial. Carregado
via CDN (unpkg) com hash de integridade (SRI) pinado em `index.html`.

## Locais sem interior desenhado

`docks` (Cais Velho) e `cliff` (Penhasco da Bruma) são pontos só no mapa
da cidade — de propósito, não é lacuna: nem toda localização precisa de
uma cena de interior (ver `src/master.js` → `SYSTEM_PROMPT`, seção MAPA,
que instrui o mestre a nunca pedir `enterInterior` nesses dois).

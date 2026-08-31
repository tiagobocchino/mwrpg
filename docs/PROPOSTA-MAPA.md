# Proposta — Mapa com cara de jogo (duas escalas)

**Status: proposta, não implementada.** Pedido explícito do Tiago: trazer
a proposta com referência visual antes de construir a versão final.

## O problema com o mapa atual

`MapPanel` (`src/components.jsx`) é um SVG desenhado à mão: dois `<path>`
de "costa" genéricos + círculos com nome pra cada local. Funcional, mas
não parece um mapa de jogo — parece um diagrama. E é uma escala só (a
cidade); não existe conceito de "entrar" num local.

## Biblioteca recomendada: Leaflet.js + `CRS.Simple`

**O que é**: Leaflet é a biblioteca de mapas web mais usada (mapas
reais, tipo OpenStreetMap) — mas o modo `L.CRS.Simple` desliga a parte
de geografia e trata qualquer imagem como um "mapa" pan/zoom com
coordenadas de pixel. É o padrão usado por wikis de jogo pra mapas
interativos (Terraria, Minecraft, etc.) — não é gambiarra, é uso
documentado e comum da própria biblioteca.

**Peso real, medido agora** (não estimado): `leaflet.js` + `leaflet.css`
via CDN somam **~46KB comprimidos (gzip)** — mais leve que qualquer
dependência que já carregamos (o Babel standalone sozinho já é vários
MB). Cabe perfeitamente no projeto zero-build: é `<script>`/`<link>` de
CDN, igual ao React/Babel já carregados, sem npm, sem bundler.

**Como cabe no projeto**: cada mapa (cidade, interior) é uma imagem
única (PNG). `L.imageOverlay(imagemUrl, bounds)` + `L.marker()` pra cada
ponto de interesse, clicável. Não precisa da parte de "tiles" pra imagem
grande (`gdal2tiles`, que pede Python/npm) — nossa escala de mapa é
pequena o bastante pra imagem única funcionar direto.

## De onde vem a arte (sem artista)

**Kenney.nl** — acervo de assets de jogo sob licença **CC0** (domínio
público, uso comercial liberado, zero risco de direito autoral, mesma
disciplina já aplicada em `docs/ACERVO-PROVENIENCIA.md`):

- [Roguelike/RPG Pack](https://kenney.nl/assets/roguelike-rpg-pack) — 1.700 sprites, terreno + estruturas + personagens top-down
- [RPG Base](https://kenney.nl/assets/rpg-base) — 230 sprites, focado em interiores/mobília
- [Tiny Dungeon](https://kenney.nl/assets/tiny-dungeon) — 130 sprites, estilo compacto 16×16
- [Roguelike Caves & Dungeons](https://kenney.nl/assets/roguelike-caves-dungeons) — 520 sprites, terreno externo/interno

Plano: compor duas imagens (mapa da cidade + mapa da taberna) a partir
desses sprites — não é "gerar" arte nova, é montar um mapa a partir de
peças prontas e livres, do mesmo jeito que o acervo narrativo monta
histórias a partir de fábulas em domínio público em vez de inventar do
zero. Registro de proveniência de cada pack usado seguiria o mesmo
padrão do `ACERVO-PROVENIENCIA.md`.

## As duas escalas

**Escala 1 — Cidade (Penmarc'h)**: mapa top-down compacto mostrando os
5 locais já existentes no cenário (Taberna do Pescador Coxo, Cais Velho,
Capela de Sant Vinog, Farol Apagado, Penhasco da Bruma) como marcadores
clicáveis sobre um terreno costeiro montado com os tiles do Kenney.
Substitui o SVG atual 1:1 nesse nível.

**Escala 2 — Interior**: ao clicar num marcador da cidade, transição pra
um segundo mapa (mesmo mecanismo Leaflet, imagem diferente) mostrando o
interior daquele local — por exemplo a planta da taberna (mesas, balcão,
porta dos fundos) usando os tiles de interior do RPG Base/Tiny Dungeon.
Esse mapa também é pan/zoom, com seus próprios marcadores (NPCs
presentes, saída de volta pra cidade). Nem todo local precisa de
interior no dia 1 — dá pra começar só com a Taberna (é onde a campanha
começa) e expandir.

## Referência visual

As páginas de cada pack do Kenney linkadas acima já mostram preview
completo dos sprites reais (screenshots oficiais do autor) — é a
referência mais honesta que posso dar sem já ter montado nada: é
literalmente o material-fonte que viraria o mapa. Estilo geral: top-down
2D, traço limpo tipo "board game digital", paleta que combina bem com o
design system "Manuscrito Vivo" (tons terrosos, sem neon).

## O que preciso de aprovação antes de construir

1. **Confirmar a biblioteca** (Leaflet + `CRS.Simple`) — ou se prefere
   que eu avalie alternativa (ex.: `svg-pan-zoom`, mais simples ainda,
   mas sem o ecossistema de marcadores/popups pronto do Leaflet).
2. **Confirmar a fonte de arte** (Kenney CC0) — ou se topa investir
   tempo/orçamento numa arte mais autoral depois.
3. **Escopo do dia 1**: só o mapa da cidade renovado, ou já entra com a
   Taberna como primeiro interior também?

## Próximo passo sugerido

Construir um protótipo de baixa fidelidade (interação real — pan, zoom,
clique pra entrar no interior — com placeholders simples no lugar da
arte final) pra validar a mecânica antes de investir tempo compondo os
mapas definitivos com os tiles do Kenney. Aguardando sinal verde pra
começar.

# MWRPG — A Coroa Enterrada de Ys

RPG solo narrativo conduzido por Mestre IA. Chat central, mapa de cenário, ficha do jogador + 3 NPCs companheiros. Sistema próprio **D6 das Três Letras** (CRP/MNT/ALM, 2d6 + atributo).

> Cenário inicial: lenda bretã de Ys, fantasia low-magic. Fontes em domínio público (SRD 5.1 CC-BY 4.0, Project Gutenberg, Sacred Texts).

## Stack

- **Front-end:** HTML estático + React 18 + Babel (transformer no navegador) — zero build step.
- **Mestre IA:** `window.claude.complete` (artifact host) — fallback offline incluso.
- **Tipografia:** Cinzel + EB Garamond + IM Fell English + IBM Plex Mono (Google Fonts).

## Estrutura

```
.
├── index.html              # entrada
├── src/
│   ├── styles.css          # design system "Manuscrito Vivo"
│   ├── data.js             # cenário, jogador, NPCs, mapa
│   ├── engine.js           # rolagem 2d6, bandas, ações de combate
│   ├── master.js           # prompt do mestre + parser JSON
│   ├── components.jsx      # Chat, Map, Sheet, Dice, Topbar
│   ├── app.jsx             # estado, fluxo de turno
│   └── tweaks-panel.jsx    # painel de tweaks
├── Relatorio_Pesquisa_RPG.md   # pesquisa fundadora
├── vercel.json
└── README.md
```

## Rodar localmente

Não precisa de build. Qualquer servidor estático serve:

```bash
# opção 1 — Python
python3 -m http.server 8000

# opção 2 — Node
npx serve .
```

Abra `http://localhost:8000`.

## Deploy no Vercel (100% free)

1. Suba este projeto para um repositório GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o repo.
3. Framework preset: **Other** (é HTML puro).
4. **Build & Output:** deixe em branco. Vercel serve estático direto.
5. Deploy.

> O `vercel.json` já está incluso e configura SPA-like routing.

## Sobre o Mestre IA fora do artifact host

Quando rodar fora do ambiente Claude artifacts (ex.: produção em Vercel), `window.claude.complete` não existe e o jogo cai em modo offline com mensagens guiadas. Para integração real:

- Edite `src/master.js` → função `ask()`.
- Plugue uma chamada a uma edge function (Supabase / Vercel) que faça o roteamento para Claude/OpenAI/Ollama.
- Mantenha o contrato JSON da resposta intacto.

## Licença

Conteúdo de regras: derivado de SRD 5.1 (CC-BY 4.0). Texto literário e código: CC-BY-SA 4.0.

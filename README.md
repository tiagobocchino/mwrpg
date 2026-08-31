# MWRPG — A Coroa Enterrada de Ys

RPG solo narrativo conduzido por Mestre IA. Chat central, mapa de cenário, ficha do jogador + 3 NPCs companheiros. Sistema próprio **D6 das Três Letras** (CRP/MNT/ALM, 2d6 + atributo). Progresso salvo automaticamente no navegador (localStorage) — botão "Continuar" retoma a última campanha.

> Cenário inicial: lenda bretã de Ys, fantasia low-magic. Fontes em domínio público (SRD 5.1 CC-BY 4.0, Project Gutenberg, Sacred Texts).

## Stack

- **Front-end:** HTML estático + React 18 + Babel (transformer no navegador) — zero build step.
- **Mestre IA:** Groq (`openai/gpt-oss-120b`, camada gratuita) via `api/master.js` (Vercel Function) → `window.claude.complete` (artifact host) → modo offline. Nessa ordem de fallback.
- **Acervo:** referências curadas de domínio público (fábulas, mitologia, folclore) em `src/acervo.js`, com proveniência em `docs/ACERVO-PROVENIENCIA.md`.
- **Tipografia:** Cinzel + EB Garamond + IM Fell English + IBM Plex Mono (Google Fonts).

## Estrutura

```
.
├── index.html              # entrada
├── api/
│   └── master.js           # Vercel Function — proxy pro Groq (GROQ_API_KEY no servidor)
├── docs/                   # método, assembleias, proveniência do acervo
├── .claude/agents/         # roster de agentes deste projeto
├── src/
│   ├── styles.css          # design system "Manuscrito Vivo"
│   ├── data.js             # cenário, jogador, NPCs, mapa
│   ├── acervo.js           # referências de domínio público (pickAcervoLore)
│   ├── engine.js           # rolagem 2d6, bandas, ações de combate
│   ├── master.js           # prompt do mestre + parser JSON + fallback em cadeia
│   ├── storage.js          # persistência local (localStorage) — save/continuar
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

O jogo tenta, nesta ordem: (1) `api/master.js` na Vercel, que chama a Groq
de verdade; (2) `window.claude.complete`, se estiver rodando dentro do
artifact host da Anthropic; (3) modo offline com mensagens guiadas, se
os dois anteriores falharem (ex.: rodando local com `python -m http.server`,
que não serve `/api`, ou sem `GROQ_API_KEY` configurada).

**Pra ativar o Mestre IA real em produção:**
1. Criar conta na [Groq](https://console.groq.com) e gerar uma API key.
2. No painel da Vercel → Project Settings → Environment Variables → adicionar `GROQ_API_KEY`.
3. Nunca commitar a chave nem colar ela em chat/documento — só no painel da Vercel.

O contrato JSON da resposta (`CLAUDE.md` §4) é o mesmo não importa o
provedor — trocar de LLM no futuro não deveria exigir mudar o frontend.

## Licença

Conteúdo de regras: derivado de SRD 5.1 (CC-BY 4.0). Acervo narrativo:
domínio público (Project Gutenberg, folclore tradicional) — proveniência
completa em `docs/ACERVO-PROVENIENCIA.md`. Texto literário e código:
CC-BY-SA 4.0.

# CLAUDE.md — MWRPG (handoff para Claude Code)

> Este arquivo é o briefing completo para qualquer LLM (em especial Claude Code) continuar o desenvolvimento do projeto **MWRPG — A Coroa Enterrada de Ys**. Cole este arquivo na raiz do repo (já está em `CLAUDE.md`) e o agente terá todo o contexto que tenho.

---

## 0. MÉTODO DE PRODUÇÃO (framework — mesmo de todos os projetos do Tiago)

Decisão do Tiago (31/08/2026): este projeto segue o mesmo método de
planejamento por assembleia multiagente + votação já estabelecido no
PushProcessos, adaptado ao domínio de jogo. Detalhe completo, com o passo
a passo, a honestidade sobre o que a "votação" é e não é, e a regra
permanente do ciclo commit→push→produção→documentação:
**`docs/METODO-PLANEJAMENTO.md`**.

Resumo: funcionalidade nova de porte relevante (entidade de dado nova,
mudança de comportamento visível pro jogador, risco real de não caber na
fundação atual) passa pelo método antes de qualquer código — não pular
direto pra implementação. Roster de agentes deste projeto em
`.claude/agents/` — ver `orchestrator-mwrpg.md` para o roster completo e
a matriz de delegação.

---

## 1. PERSONA — quem você está sendo

Você é um **dev fullstack brasileiro**:
- Mestre em **CSS, HTML, JS** com domínio total de **Framer Motion**, **GSAP** e animação de UI única e marcante. Sabe usar técnicas de UI para guiar a ação do usuário.
- **Python** especialista em **LangChain**, criação de agentes de IA com RAG, integração entre múltiplos agentes.
- **Backend cloud:** **Supabase**, **Firebase**, **Render**, **Vercel** — escolhe o stack pelo problema, não por moda.
- Sofisticado no trato com o usuário; explica decisões técnicas em português claro.
- Gosta de surpreender o usuário com pequenas coisas (micro-interações, sons, easings inesperados).

**Tom:** sábio, consciente, sincero, direto. Sem prolixidade. Floreios apenas quando descreve estética/UX.

---

## 2. VISÃO DO PRODUTO

**MWRPG** é um RPG de mesa **solo + 3 NPCs companheiros**, conduzido por um **Mestre IA**. O jogador conversa pelo chat e responde com **2 a 6 caminhos** sugeridos pelo mestre; em combate, sempre **6 ações fixas**. Foco em narrativa, com sistema de regras leve.

**Pilares:**
1. UI fora dos padrões — pergaminho vivo, tipografia clássica, animações de pena/tinta.
2. Sistema de regras simples (3 atributos, 1 dado, 4 bandas de sucesso).
3. Acessível: teclas 1–6 escolhem opções; TTS opcional; respeita `prefers-reduced-motion`.
4. 100% gratuito e na nuvem (Vercel + Supabase tier free).

---

## 3. SISTEMA DE REGRAS — "D6 das Três Letras"

- **3 atributos:** CRP (Corpo), MNT (Mente), ALM (Alma) — valores 1 a 5.
- **Rolagem:** 2d6 + atributo relevante.
- **Bandas:**
  - **6−** falha narrativa (mestre piora a situação)
  - **7–9** sucesso parcial (consegue, com custo)
  - **10–12** sucesso pleno
  - **13+** crítico (vantagem narrativa)
- **Combate:** 6 ações fixas — Atacar, Magia, Item, Mover, Defender, Falar.
- **Vantagem/Desvantagem:** rola 3d6 e descarta o pior/melhor.
- **HP base:** 10 + CRP. **Foco/MP base:** 4 + ALM × 2.

Implementação canônica em `src/engine.js`. **Não mudar a fórmula sem pedir o usuário.**

---

## 4. PROMPT DO MESTRE (canônico)

Localização: `src/master.js` → `SYSTEM_PROMPT`.

Regras imutáveis:
- Tom: sábio, consciente, sincero, direto. Sem rodeios. Detalhista nos sentidos (cheiro, luz, som, textura, temperatura).
- Português brasileiro, registro literário-acessível.
- 80–180 palavras por turno (até 250 em cenas-chave).
- Nunca decide ações pelo jogador — sempre para em ponto de decisão.
- Sempre 2–6 opções; em combate, exatamente 6 (as ações padrão).
- **Resposta SEMPRE em JSON estrito**, sem texto fora, sem markdown:

```json
{
  "narration": "texto em parágrafos (use \\n\\n)",
  "mode": "dialog | combat | exploration | scene_end",
  "options": [
    { "label": "...", "attr": "crp|mnt|alm|none", "needsRoll": true|false }
  ],
  "rollResult": null,
  "mapHint": null,
  "stateChanges": null
}
```

Quando trocar provedor de LLM (sair do artifact host), **manter o contrato JSON intacto**.

---

## 5. DESIGN SYSTEM — "Manuscrito Vivo"

### 5.1 Filosofia
A UI inteira simula um pergaminho que respira. Sem gradientes neon, sem glassmorphism, sem AI-slop. Toques de tinta, selos de cera, bordas envelhecidas via SVG noise.

### 5.2 Tokens (em `src/styles.css` → `:root`)

```css
--paper:        oklch(0.96 0.015 80);  /* off-white pergaminho */
--paper-2:      oklch(0.92 0.02 78);
--paper-edge:   oklch(0.86 0.025 70);
--ink:          oklch(0.22 0.02 60);   /* tinta-ferro */
--ink-2:        oklch(0.38 0.025 60);
--ink-mute:     oklch(0.55 0.02 60);
--seal:         oklch(0.50 0.15 25);   /* vermelho-selo */
--gold:         oklch(0.72 0.13 80);
--moss:         oklch(0.45 0.08 140);
--azure:        oklch(0.45 0.10 250);
```

### 5.3 Tema secundário "Ember" (dark)
Ativado por `[data-theme="ember"]` no `<html>`. Mantém mesmas variáveis com luminosidades invertidas.

### 5.4 Tipografia (Google Fonts)
- **Display:** Cinzel (títulos, brand, atributos)
- **Body:** EB Garamond (narração, opções)
- **Hand:** IM Fell English (fala do jogador, em itálico)
- **Mono:** IBM Plex Mono (chips, metadados, timestamps)

### 5.5 Componentes-chave
- **`.parchment`** — card padrão (gradiente sutil + borda envelhecida + sombra suave)
- **`.msg-master`** — bolha do mestre com avatar de selo de cera (`::after { content: '※' }`)
- **`.msg-player`** — bolha cursiva, alinhada à direita
- **`.option`** — botão de escolha com tecla numerada à esquerda; em combate vira `.option.combat` com glyph
- **`.dice-stage`** — overlay full-screen com 2 dados girando

### 5.6 Motion specs
- Texto do mestre: `pop-in` (220ms, cubic-bezier(0.2, 0.8, 0.2, 1))
- Stagger entre opções: 40ms
- Cursor de pena pulsa a 700ms (`@keyframes blink`)
- Token do jogador no mapa: anel pulsante 2.4s

---

## 6. ARQUITETURA DE ARQUIVOS

```
mwrpg/
├── index.html              # entrada — carrega scripts em ordem
├── README.md
├── vercel.json             # rotas + headers
├── .gitignore
├── CLAUDE.md               # ESTE arquivo
├── Relatorio_Pesquisa_RPG.md   # base de conteúdo (bestiário, magias, raças, 25 enredos)
├── docs/                   # método, assembleias, proveniência do acervo
├── .claude/agents/         # roster de agentes deste projeto
├── api/
│   └── master.js           # Vercel Function — proxy pro Mestre IA via Groq (GROQ_API_KEY no servidor)
└── src/
    ├── styles.css          # design system Manuscrito Vivo
    ├── data.js             # window.MWRPG_DATA — cenário, jogador, NPCs, mapa
    ├── acervo.js            # window.MWRPG_ACERVO — referências de domínio público, pickAcervoLore()
    ├── engine.js           # window.MWRPG_ENGINE — d6, roll2d6, COMBAT_ACTIONS
    ├── master.js           # window.MWRPG_MASTER — ask() [Groq → claude.complete → offline], SYSTEM_PROMPT
    ├── storage.js           # window.MWRPG_STORAGE — save(), load(), clear(), hasSave() (localStorage, v0.2)
    ├── components.jsx      # Chat, MapPanel, Sheet, DiceOverlay, Topbar, Option, Message
    ├── app.jsx             # App — estado, fluxo de turno, handlers
    └── tweaks-panel.jsx    # painel de tweaks (TweaksPanel, TweakSection, TweakRadio, TweakToggle, useTweaks)
```

### 6.1 Ordem de carregamento (importante!)
Em `index.html`, scripts carregam nesta ordem (dependências antes de quem usa):
1. React + ReactDOM + Babel standalone (CDN, integrity hashes pinados)
2. `src/data.js` (vanilla)
3. `src/acervo.js` (vanilla — precisa vir antes de `master.js`, que usa `pickAcervoLore`)
4. `src/engine.js` (vanilla)
5. `src/master.js` (vanilla)
6. `src/storage.js` (vanilla)
7. `src/tweaks-panel.jsx` (Babel)
8. `src/components.jsx` (Babel)
9. `src/app.jsx` (Babel)

`api/master.js` não entra nessa lista — não é carregado pelo navegador, é
uma Vercel Function separada, servida em `/api/master`.

### 6.2 Convenção: scripts Babel não compartilham scope
Cada `<script type="text/babel">` vira IIFE separada após Babel. Para compartilhar, sempre exporte via `Object.assign(window, { ... })` no fim do arquivo, e importe via `const X = window.X` no início do arquivo consumidor.

### 6.3 Anti-padrão CRÍTICO
**Nunca** declare `const styles = { ... }` em escopo global de qualquer arquivo Babel — colide entre arquivos. Use nome específico (`const chatStyles = { ... }`) ou inline styles.

---

## 7. ESTADO DA APP (em `app.jsx`)

```js
const [tweaks, setTweak]     = useTweaks(TWEAK_DEFAULTS);
const [messages, setMessages] = useS([{ role:'master', content: intro }]);
const [options, setOptions]  = useS([...]);
const [mode, setMode]        = useS('dialog');     // 'dialog'|'combat'|'exploration'|'scene_end'
const [thinking, setThinking] = useS(false);
const [rolling, setRolling]  = useS(null);          // { a, b, sum, band, label, modifier } | null
const [player, setPlayer]    = useS(MWRPG_DATA.player);
const [npcs]                 = useS(MWRPG_DATA.npcs);
const [partyAt, setPartyAt]  = useS('tavern');
const history                = useR([]);            // não-reativo, log para o LLM
```

**Fluxo de um turno:**
1. Jogador clica opção (ou tecla 1–6, ou texto livre).
2. `setMessages` adiciona bolha do jogador.
3. Se `option.needsRoll`, dispara `DiceOverlay` por 1.7s e adiciona linha de sistema com o roll.
4. `setThinking(true)`, `setOptions([])`.
5. `MWRPG_MASTER.ask(history.current, prompt)` → JSON.
6. `applyMasterResponse(resp)`: nova mensagem, novo `mode`, novas options, talvez `mapHint.moveTo`, talvez `stateChanges`.
7. `setThinking(false)`.

---

## 8. TWEAKS

`TWEAK_DEFAULTS` está em `app.jsx` dentro do bloco marcado:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ ... }/*EDITMODE-END*/;
```

Atualmente expõe: `theme`, `allowFreeText`, `showDice`. Ampliar conforme novos eixos surgirem (ex.: difficulty, voiceTTS, masterVerbosity).

---

## 9. CENÁRIO INICIAL — "A Coroa Enterrada de Ys"

- Lenda bretã (Wikipedia: Ys — domínio público).
- Porto: Penmarc'h. 5 locais no mapa: Taberna, Cais Velho, Capela de Sant Vinog, Farol Apagado, Penhasco da Bruma.
- Party: jogador + Brennan (bardo, MNT 3) + Sira (clériga, ALM 3) + Korrin (batedor, CRP 3).
- Gancho: torres negras de Ys ressurgiram da maré; um sino tocando sob a água.

**Outras 24 histórias** estão listadas em `Relatorio_Pesquisa_RPG.md` §9.

---

## 10. ROADMAP (em ordem de prioridade)

### v0.2 — Persistência local ✅ concluído
- localStorage para `messages`, `history`, `player`, `partyAt`, `options`, `mode` (`src/storage.js` → `window.MWRPG_STORAGE`).
- Botão "Continuar" no topbar quando há save; some após "Recomeçar" ou após a primeira ação de uma sessão retomada.
- "Recomeçar" limpa o save (`MWRPG_STORAGE.clear()`).

### v0.3 — Mestre IA fora do artifact host ⏳ código pronto, aguardando credencial
- Decisão da Assembleia 02 (`docs/ASSEMBLEIA-02-LLM-GRATUITO-E-BANCO.md`): **Groq**, não Claude/OpenAI — camada gratuita real, não treina com os dados enviados (política verificada com fonte).
- `api/master.js` (Vercel Function) → chama `openai/gpt-oss-120b` na Groq (substituto oficial do `llama-3.3-70b-versatile`, deprecado 16/ago/2026). Variável `GROQ_API_KEY` no Vercel env — **nunca commitada**.
- `src/master.js` → `ask()` tenta Groq primeiro, cai pra `window.claude.complete` (artifact host) e por fim modo offline. Histórico podado (`trimHistory`) por causa do limite real do free tier da Groq: 8.000 tokens/minuto **por organização inteira**, não por usuário.
- Contrato JSON mantido intacto.
- **Não testado ponta a ponta ainda** — falta o Tiago criar a conta/chave da Groq. Testado o que dá: fallback gracioso quando a Groq não responde (confirmado local), montagem correta da requisição (formato Groq/OpenAI-compatible confirmado via documentação oficial).

### Acervo de domínio público (junto com v0.3, prioridade do Tiago)
- `src/acervo.js` — referências curadas (fábulas de Esopo, mitologia clássica, folclore brasileiro) com proveniência registrada em `docs/ACERVO-PROVENIENCIA.md`. Retrieval simples por tag (`pickAcervoLore`), sem embeddings ainda.
- O mestre recebe até 2 entradas relevantes como "material de referência" no prompt — inspiração, não obrigação de uso.
- Regra: nada entra no acervo sem proveniência registrada e licença verificada (ver checklist do Code QA Engineer).

### v0.4 — RAG com Supabase pgvector
- 4 coleções: `regras`, `bestiario`, `lore_mundo`, `historico_campanha`.
- Ingestão dos CSVs descritos no Relatório §4–8.
- Embeddings via `text-embedding-3-small` (OpenAI) ou `voyage-3-lite`.
- Mestre puxa top-5 trechos relevantes a cada turno.

### v0.5 — Auth + multi-personagem
- Supabase Auth (magic link).
- Tabela `characters` (1 user → N personagens).
- Tabela `sessions` (snapshots de campanha).

### v0.6 — Combate tático
- Hex grid opcional sobre o mapa quando `mode === 'combat'`.
- Tokens arrastáveis (com snap).
- HP/foco animados (Framer Motion `layout`).

### v0.7 — Bestiário/itens visuais
- Modal "Compêndio" com pesquisa fuzzy.
- Cards de monstros, armas, magias usando o design system.

### v0.8 — Som
- Música ambiente low-loop (CC0 do freesound.org).
- SFX: rolagem de dado, virar pergaminho, selo batendo.

### v0.9 — TTS opcional
- Web Speech API. Voz "fr-CA" para o mestre (sotaque bretão estilizado).

### v1.0 — Compartilhamento de campanha
- URL pública read-only (replays).
- Export PDF do diário da campanha.

---

## 11. STACK CLOUD GRATUITO

| Camada | Provedor | Tier free |
|---|---|---|
| Hosting estático | Vercel | Hobby (sempre grátis) |
| API (Edge Functions) | Vercel | 100k execs/mês |
| Auth + DB + Vector | Supabase | 500MB DB, 5GB bandwidth |
| LLM | Claude Haiku 4.5 ou Llama 3.1 via Groq | varia |
| Embeddings | OpenAI text-embedding-3-small ou Voyage | $5 free credit |
| Fontes | Google Fonts | grátis |
| Áudio CC0 | Freesound | grátis |

---

## 12. DEPLOY

```bash
git clone https://github.com/tiagobocchino/mwrpg.git
cd mwrpg
# nada para instalar — é HTML estático
```

No Vercel:
- **Framework Preset:** Other
- **Build Command:** (vazio)
- **Output Directory:** `.`
- **Install Command:** (vazio)

`vercel.json` cuida de headers e clean URLs.

---

## 13. CONVENÇÕES DE CÓDIGO

- **Português** em strings de UI, comentários e nomes de variáveis de domínio (player, npcs, partyAt, mode).
- **Inglês** em nomes técnicos (Chat, Sheet, useTweaks).
- HTML canônico: tags fechadas explicitamente, atributos com aspas duplas.
- CSS: variáveis em `:root`, classes em kebab-case, BEM relaxado.
- React: function components, hooks no topo, sem class components.
- Sem TypeScript (manter zero-build). Quando migrar para Vite, aí sim TS.
- Estilos de animação inline ok para `animationDelay` dinâmico; resto via CSS classes.

---

## 14. ANTI-PADRÕES (não fazer)

- ❌ Recriar UI proprietária (D&D Beyond, Roll20, Foundry).
- ❌ Usar nomes registrados como "Beholder", "Mind Flayer", "Tiefling", "Drow", "Dragonborn".
- ❌ Adicionar conteúdo fora do SRD 5.1 / PF2e SRD / domínio público.
- ❌ Inventar fonte ou sistema novo sem pedir o usuário.
- ❌ Adicionar gradientes neon, glassmorphism, ou qualquer tropo de "AI dashboard".
- ❌ Mudar prompt do mestre sem aviso.
- ❌ Usar emoji na UI (apenas glyphs Unicode tipográficos: ⚔ ✦ ⛨ ☍ ↬ ⏧ ※).

---

## 15. PRÓXIMOS PASSOS IMEDIATOS PARA O CLAUDE CODE

1. Ler `Relatorio_Pesquisa_RPG.md` inteiro.
2. Implementar **v0.2 (persistência local)** — é o ganho mais alto com menor risco.
3. Implementar **v0.3 (Edge Function de mestre)** — destrava produção real.
4. Antes de seguir para v0.4, perguntar ao usuário sobre as 7 perguntas do Relatório §12.

---

## 16. ESTILO DE COMUNICAÇÃO COM O USUÁRIO

- Português brasileiro, direto, sem preâmbulo.
- Quando entregar, listar (a) o que mudou, (b) onde mudou, (c) o que quer do usuário a seguir.
- Antes de adicionar features grandes, perguntar via múltipla escolha (4–5 alternativas).
- Quando travado, mostrar 2 caminhos com prós/contras.

---

> **Fim do briefing.** Tudo daqui para frente é decisão sua + do usuário.

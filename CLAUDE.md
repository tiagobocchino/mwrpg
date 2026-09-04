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
├── docs/                   # método, assembleias, proveniência do acervo, proposta do mapa
├── .claude/agents/         # roster de agentes deste projeto
├── supabase/
│   └── schema.sql          # tabelas characters + campaign_sessions, RLS (rodar 1x no SQL Editor do Supabase)
├── api/
│   ├── master.js           # Vercel Function — proxy pro Mestre IA via Groq (GROQ_API_KEY no servidor)
│   └── config.js           # Vercel Function — devolve SUPABASE_URL + PUBLISHABLE_KEY pro cliente (seguro expor)
└── src/
    ├── styles.css          # design system Manuscrito Vivo
    ├── data.js             # window.MWRPG_DATA — cenário, jogador, NPCs, mapa
    ├── maps.js              # window.MWRPG_MAPS — mapas Leaflet (cidade + interiores), mwrpgHasInterior()
    ├── classes.js           # window.MWRPG_CLASSES — 3 classes, mwrpgBuildCharacter() (v0.6)
    ├── seeds.js             # window.MWRPG_SEEDS — ganchos de recomeço, mwrpgPickNextSeed() (v0.6)
    ├── acervo.js            # window.MWRPG_ACERVO — referências de domínio público, pickAcervoLore()
    ├── engine.js           # window.MWRPG_ENGINE — d6, roll2d6, COMBAT_ACTIONS
    ├── master.js           # window.MWRPG_MASTER — ask() [Groq → claude.complete → offline], SYSTEM_PROMPT
    ├── storage.js           # window.MWRPG_STORAGE — save(), load(), clear(), hasSave() (localStorage, fallback sem login)
    ├── auth.js              # window.MWRPG_AUTH — login por link mágico (Supabase Auth), degrada sem login se não configurado
    ├── cloudSync.js          # window.MWRPG_CLOUD — CRUD de campaign_sessions no Supabase
    ├── components.jsx      # Chat, MapPanel, Sheet, DiceOverlay, Topbar, LoginGate, Option, Message
    ├── app.jsx             # App — estado, fluxo de turno, login gate, limite de demo, handlers
    └── tweaks-panel.jsx    # painel de tweaks (TweaksPanel, TweakSection, TweakRadio, TweakToggle, useTweaks)
```

### 6.1 Ordem de carregamento (importante!)
Em `index.html`, scripts carregam nesta ordem (dependências antes de quem usa):
1. React + ReactDOM + Babel standalone + **supabase-js** + **Leaflet** (CDN, integrity hashes pinados)
2. `src/data.js` (vanilla)
3. `src/maps.js` (vanilla — `window.MWRPG_MAPS`, usado por `MapPanel` em `components.jsx`)
4. `src/classes.js` (vanilla — `window.MWRPG_CLASSES`, usado por `CharacterCreationGate`)
5. `src/seeds.js` (vanilla — `window.MWRPG_SEEDS`, usado por `handleReset` em `app.jsx`)
6. `src/acervo.js` (vanilla — precisa vir antes de `master.js`, que usa `pickAcervoLore`)
7. `src/engine.js` (vanilla)
8. `src/master.js` (vanilla)
9. `src/storage.js` (vanilla)
10. `src/auth.js` (vanilla — usa `window.supabase.createClient`)
11. `src/cloudSync.js` (vanilla — usa `window.MWRPG_AUTH.getClient()`)
12. `src/tweaks-panel.jsx` (Babel)
13. `src/components.jsx` (Babel)
14. `src/app.jsx` (Babel)

`api/master.js` e `api/config.js` não entram nessa lista — não são
carregados pelo navegador, são Vercel Functions servidas em `/api/*`.

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

### v0.3 — Mestre IA fora do artifact host ✅ concluído e confirmado em produção
- Decisão da Assembleia 02 (`docs/ASSEMBLEIA-02-LLM-GRATUITO-E-BANCO.md`): **Groq**, não Claude/OpenAI — camada gratuita real, não treina com os dados enviados (política verificada com fonte).
- `api/master.js` (Vercel Function) → chama `openai/gpt-oss-120b` na Groq (substituto oficial do `llama-3.3-70b-versatile`, deprecado 16/ago/2026). Variável `GROQ_API_KEY` no Vercel env — **nunca commitada**.
- `src/master.js` → `ask()` tenta Groq primeiro, cai pra `window.claude.complete` (artifact host) e por fim modo offline. Histórico podado (`trimHistory`) por causa do limite real do free tier da Groq: 8.000 tokens/minuto e **200.000/dia por organização inteira**, não por usuário.
- Contrato JSON mantido intacto.
- **Confirmado em produção (31/08/2026)**: turno real jogado em `mwrpg-one.vercel.app`, narração veio da Groq, incorporou o resultado da rolagem na história, tom e tamanho dentro do especificado.

### Acervo de domínio público (junto com v0.3, prioridade do Tiago)
- `src/acervo.js` — referências curadas (fábulas de Esopo, mitologia clássica, folclore brasileiro) com proveniência registrada em `docs/ACERVO-PROVENIENCIA.md`. Retrieval simples por tag (`pickAcervoLore`), sem embeddings ainda.
- O mestre recebe até 2 entradas relevantes como "material de referência" no prompt — inspiração, não obrigação de uso.
- Regra: nada entra no acervo sem proveniência registrada e licença verificada (ver checklist do Code QA Engineer).

### v0.4 — Login + persistência em nuvem + limite de demo ⏳ código pronto, aguardando confirmação em produção
- **Login por link mágico na primeira vez** (Supabase Auth, `signInWithOtp`) — sem senha pra entrar a primeira vez, menos atrito, sem "bagunça de dado" (identidade real por email). `src/auth.js` inicializa o cliente via `/api/config` (nunca chave hardcoded); se o Supabase não estiver configurado, o jogo funciona sem login, como sempre (degradação graciosa, mesmo padrão do Groq).
- **Senha criada logo após confirmar o email** (pedido do Tiago, 31/08/2026): assim que o link mágico confirma a sessão, `SetPasswordGate` pede uma senha (`auth.updateUser({password})`) antes de entrar no jogo — com opção de pular. Da próxima vez, `LoginGate` oferece "Já tenho senha — entrar direto" (`signInWithPassword`) como alternativa ao link mágico, não como substituto — quem esqueceu a senha ou é novo sempre pode voltar pro link mágico.
- **Persistência em nuvem**: `supabase/schema.sql` (rodar uma vez no SQL Editor do Supabase) — tabelas `characters` e `campaign_sessions`, RLS por `auth.uid()`. `src/cloudSync.js` faz o CRUD. Substitui o `localStorage` da v0.2 quando logado; localStorage continua sendo o fallback de quem não está logado.
- **Limite de 40 rodadas por campanha** (não por usuário nem por sala — justificativa: convida a testar de novo em vez de banir depois de uma campanha, e sustenta o custo de IA compartilhado). Ao chegar em 40, a partida trava (sem novas opções), com uma mensagem explicando que é demo, escrita em tom de convite. `DEMO_LIMIT` em `src/app.jsx`.
- **Cota da Groq esgotada (429) tratada honestamente**: distinto do fallback offline genérico — mostra "o mestre precisa de um instante de silêncio", não conta como rodada, campanha continua salva. Ver `api/master.js` e `src/master.js` → `quotaExceededResponse()`.
- **Risco real, sinalizado ao Tiago**: com `trimHistory` + `max_completion_tokens: 700`, uma campanha de 40 rodadas consome ~60k tokens — o teto de 200k/dia da Groq (org inteira) permite só ~3 campanhas completas por dia se todo mundo jogar até o fim. Não é um limite confortável para vários testers simultâneos.
- **Achado real em produção (31/08/2026)**: o serviço de email embutido do Supabase **só entrega pra membros da equipe do projeto** e tem teto de **2 emails/hora** (confirmado na documentação oficial, não é achismo) — bloqueante estrutural pra qualquer jogador de teste real, não só questão de volume. Resolução: `docs/MANUAL-04-EMAIL-SMTP.md` — Brevo como SMTP próprio (300 emails/dia grátis, sem cartão, verifica remetente individual por código de 6 dígitos sem precisar de domínio — diferente do Resend, que só manda pro próprio dono da conta até verificar um domínio por DNS).
- **Erros de autenticação traduzidos e tratados** (`src/auth.js` → `AUTH_ERROR_MESSAGES`, por `error.code`, nunca por texto em inglês que pode mudar): rate limit, email inválido, remetente não autorizado, link expirado/já usado, provedor desativado, etc. — cobre também o retorno de um link mágico expirado (erro vem pela URL, não por exceção — `consumeUrlError()`).
- **Achado real em produção (31/08/2026, segundo teste ponta a ponta)**: o link mágico voltou apontando pra `http://localhost:3000` (`otp_expired` + `access_denied` na URL) — causa raiz é o "Site URL"/"Redirect URLs" do Supabase ainda no valor de fábrica, que ignora o `emailRedirectTo` já passado no código (`src/auth.js`, linha do `signInWithOtp`) sempre que a origem não está na lista de permissões. Resolução: `docs/MANUAL-05-URL-CONFIGURATION.md` — trocar Site URL pra produção, adicionar produção + localhost:8000 em Redirect URLs, e (junto, mesma tela) trocar o template de email padrão (inglês) por um em português.
- **✅ Testado ponta a ponta e validado em produção (31/08/2026)**: depois do Manual 05, o Tiago confirmou o teste real — inclusive com **jogadores externos** (não só ele), login funcionando de ponta a ponta. Feedback real desses testes já entrou no roadmap: sistema de classes (v0.6, ver Assembleia 05) e variação real no recomeço de campanha (idem).

### v0.5 — Mapa com duas escalas ✅ implementado, aguardando teste do Tiago em produção
Ver `docs/PROPOSTA-MAPA.md` (proposta original, aprovada e expandida pelo
Tiago em 31/08/2026: "faça alguns para o próprio mestre decidir onde e
quando usar os lugares e cidades"). Implementação:
- `src/maps.js` — `window.MWRPG_MAPS`: mapa da cidade (Penmarc'h, 5
  locais) + 3 interiores desenhados (Taberna, Capela, Farol). `docks` e
  `cliff` são só pontos externos, sem interior — de propósito.
- `MapPanel` (`src/components.jsx`) — reescrito com **Leaflet.js**
  (`L.CRS.Simple`, mapas em pixel, não geográficos). Clicar no marcador
  "Vocês" quando ele está sobre um local com interior entra na escala de
  interior; um marcador de saída (↩) volta pra cidade.
- `src/app.jsx` — estado `mapScale` ('city' | 'interior'),
  `handleEnterInterior`/`handleExitInterior`, e `applyMasterResponse`
  interpreta `resp.mapHint.enterInterior` (true entra, false sai) além do
  `moveTo` já existente.
- `src/master.js` → `SYSTEM_PROMPT` — instrui o mestre sobre
  `enterInterior` e quais locais têm interior de verdade (só
  tavern/chapel/lighthouse), pra ele nunca pedir uma transição inválida.
- Arte: sprites CC0 do Kenney "RPG Base" (prédios/portas/árvores/props)
  sobre terreno em cor sólida desenhada via PIL — proveniência completa
  em `docs/MAPAS-PROVENIENCIA.md`.
- **Testado localmente (31/08/2026)**: transição cidade→interior→cidade
  funcionando (clique no marcador, depois no ↩), sem erros de console,
  layout mobile (375px) sem overflow horizontal. Ainda não testado em
  produção real pelo Tiago.

### v0.6 — Classes + recomeço com história variada ✅ implementado e validado em produção pelo Tiago
Feedback real de jogadores externos (31/08/2026), processado pela
Assembleia 05 (`docs/ASSEMBLEIA-05-CLASSES-E-RECOMECO-VARIADO.md`).
Duas frentes:
- **Sistema de classes** — `src/classes.js` (`window.MWRPG_CLASSES`):
  Guerreiro (CRP 3/MNT 2/ALM 1), Ladina (MNT 3/CRP 2/ALM 1), Mágica
  (ALM 3/MNT 2/CRP 1) — mapeamento 1:1 nos atributos já existentes, com
  ajuste ±1 entre os dois atributos secundários. `CharacterCreationGate`
  (`src/components.jsx`) — 3 cards de classe + nome, aparece só na
  primeira vez que um usuário logado não tem personagem ainda. Nome
  **único globalmente** (decisão do Tiago) — índice único
  case-insensitive no banco (`supabase/schema.sql`), erro traduzido em
  português com sugestões de nome alternativo quando colide
  (`src/cloudSync.js` → `createCharacter`, `error.code === '23505'`).
  A tabela `characters` (existia desde a v0.4, morta) finalmente está
  em uso — `campaign_sessions.character_id` também passa a ser
  preenchido de verdade.
- **Recomeço com história variada** — `src/seeds.js`
  (`window.MWRPG_SEEDS`): 6 ganchos curados, cada um ancorado numa
  entrada real do acervo de domínio público, sorteados sem repetir o
  último usado (localStorage). `src/master.js` →
  `generateVariedIntro(seed)` pede ao mestre uma abertura de campanha
  de verdade nova (1 chamada Groq); a mesma semente é reenviada em
  **todo turno** daquela campanha (`seedContext`, dentro de
  `buildGroqMessages`) pra situações ao longo da história também
  variarem, não só a primeira mensagem — pedido explícito do Tiago
  ("diálogos e situações", não só a abertura). Se a geração falhar por
  qualquer motivo, cai pro texto fixo original — nunca trava o
  "Recomeçar".
- **Portão de lançamento inalterado**: nenhum convite novo de teste até
  o mecanismo de proteção de orçamento da Groq (Assembleia 04) estar
  pronto e testado em produção — essas duas frentes entram em paralelo
  no desenvolvimento, não pulam essa fila.
- **Testado localmente (31/08/2026)**: `CharacterCreationGate`
  verificado ponta a ponta (troca de classe, ajuste ±1, prévia de
  vida/foco, validação de nome, erro + sugestões de nome duplicado) em
  desktop e mobile 375px, sem erro de console. Geração de abertura
  variada verificada via chamada direta — local cai corretamente pro
  fallback (sem `/api` fora da Vercel).
- **✅ Validado em produção pelo próprio Tiago (31/08/2026)**: as duas
  frentes funcionando de verdade — criação de personagem com classe, e
  recomeço gerando história realmente diferente (abertura + situações).
  Achado separado no mesmo teste: o email de login voltou a chegar em
  inglês — não era bug desta feature, era o template do Supabase se
  perdendo de novo (Manual 05, agora corrigido cobrindo os **dois**
  templates que `signInWithOtp` pode disparar, não só um).

### v0.7 — Mapas avançados: névoa por nó, regra de acesso, marcador de missão ⏳ camada de dados/regra implementada, arte em andamento
Assembleia 06 (`docs/ASSEMBLEIA-06-MAPAS-AVANCADOS.md`, Finalista 3,
aprovado pelo Tiago), fase 1 de 2 (dados/regra antes da arte, por
pedido dele — "se o tempo apertar, o que fica pra trás é o acabamento
visual, não a mecânica"):
- **Névoa por nó**: `discovered` (locais visitados) e `known_markers`
  (locais conhecidos por informação, sem visita — ex.: mission
  revelada por NPC) — duas listas independentes em
  `campaign_sessions`, nunca se misturam. `MapPanel` só renderiza um
  marcador se o local estiver numa das duas; local nunca mencionado
  simplesmente não aparece.
- **Regra de acesso ao mapa**: `window.MWRPG_LOCATION_TYPES`
  (`src/maps.js`) classifica cada local como `cidade` (mapa sempre
  disponível) — locais fora do registro, ou sinalizados pelo mestre via
  `mapHint.remoteArea: true`, bloqueiam o `MapPanel` (mensagem "mapa
  indisponível aqui") até o jogador voltar a um local conhecido.
- **Marcador de missão mínimo**: `mapHint.revealMission` (id/título/
  local) — sem sistema de missão completo, o mestre nomeia a missão na
  hora, dentro do que já está narrando.
- **Testado localmente (31/08/2026)**: fluxo completo via
  `handleChoose` real (não simulação isolada) — abertura mostra só
  `tavern` descoberto; `remoteArea: true` bloqueia o mapa
  imediatamente; `moveTo` + `revealMission` juntos desbloqueiam o
  mapa, marcam o novo local como descoberto, e gravam a missão — tudo
  verificado também em mobile 375px, sem erro de console.
- **O que o Tiago já consegue ver em produção, mesmo sem a arte nova**:
  o mapa da cidade só mostra os locais realmente visitados (o resto
  começa oculto, não os 5 de sempre); uma cena de masmorra/missão
  distante narrada pelo mestre esconde o painel do mapa até voltar;
  uma missão contada por um NPC pode aparecer no mapa antes de ser
  visitada. **O efeito visual de escuridão sobre o mapa não entra
  nesta versão** (Assembleia 06, gap reconhecido) — fica pra v0.8+.
- **Ainda não feito**: arte melhorada (exteriores estilizados, mobília
  real do Kenney Roguelike/RPG pack nos interiores) e o(s) 1-2 local(is)
  distante(s) curado(s) — próxima fase desta mesma versão.

### v0.8 — RAG com Supabase pgvector
- 4 coleções: `regras`, `bestiario`, `lore_mundo`, `historico_campanha`.
- Ingestão dos CSVs descritos no Relatório §4–8.
- Embeddings via `text-embedding-3-small` (OpenAI) ou `voyage-3-lite`.
- Mestre puxa top-5 trechos relevantes a cada turno.

### v0.9 — Combate tático
- Hex grid opcional sobre o mapa quando `mode === 'combat'`.
- Tokens arrastáveis (com snap).
- HP/foco animados (Framer Motion `layout`).

### v0.10 — Bestiário/itens visuais
- Modal "Compêndio" com pesquisa fuzzy.
- Cards de monstros, armas, magias usando o design system.

### v0.11 — Som
- Música ambiente low-loop (CC0 do freesound.org).
- SFX: rolagem de dado, virar pergaminho, selo batendo.

### v0.12 — TTS opcional
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

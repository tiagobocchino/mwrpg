# Assembleia 07 — Sistema de itens, raridades e drops

Pedido original do Tiago (verbatim, resumido no corpo do documento):
biblioteca de itens com 7 níveis citados — comum, raro, mágico, mítico,
épico, lendário, divino — com regras de drop por nível de inimigo,
encantamento aplicado por jogador com teste de atributo, e origem em
dungeons/fechamentos de arco/campanha pros níveis mais altos.

Método completo (`docs/METODO-PLANEJAMENTO.md`): baseline nos 6 pontos
que o Tiago pediu pra confrontar → consulta individual aos agentes →
síntese → 5 finalistas → votação com divergência real → vencedor →
corte de escopo. **Não implementado** — a implementação real de itens
segue bloqueada atrás do portão de orçamento da Groq (Seção 6) e,
agora, também atrás da fundação do sistema de magia (`Assembleia 08`),
já que "mágico" virou um degrau de raridade que depende de existir
magia de verdade no jogo.

> **ERRATA (respostas do Tiago, tratadas como especificação — ver
> `ASSEMBLEIA-08-MAGIA-E-PROGRESSAO.md` para o desdobramento completo)**:
> as duas perguntas abaixo (1.1 e 1.2) foram respondidas por ele
> diretamente. A Seção 1.1 abaixo é mantida como registro do raciocínio
> original, mas **a escala de raridade final tem 7 degraus, não 6**:
> **Comum → Raro → Mágico → Mítico → Épico → Lendário → Divino**.
> Mágico *é* um degrau — mas só quando o item chega até ele por
> magia inerente (não por encantamento de jogador, que é temporário e
> não muda raridade nenhuma; ver Assembleia 08 Seção 1). Épico fica
> confirmado entre Mítico e Lendário, como proposto.

---

## 1. Baseline — os 6 pontos difíceis, resolvidos aqui antes de votar

### 1.1 "Mágico" é raridade ou propriedade? — **PERGUNTA AO TIAGO, não decidi**

O pedido lista, na abertura: "comum, raro, mágico, mítico, épico,
lendário e divino" — uma sequência de 7, sugerindo que mágico é um
degrau como os outros. Mas a descrição do item 3 diz o oposto: "itens
mágicos obtidos de monstros... serão itens das suas classes (comum,
raro, mítico, épico, lendário e divino) porém embuídos com efeitos de
magia" — e o exemplo do dragão de gelo é explícito: a armadura "será um
item **Mítico e mágico**" (duas palavras, duas coisas).

Ler literalmente o próprio exemplo do Tiago: **mágico não é um degrau
da escada — é uma propriedade que pode grudar em qualquer degrau**
(uma poção Comum pode ser mágica; uma armadura Mítica pode ser mágica).
A escada de raridade real, seguindo a ordem que ele deu, fica com 6
degraus: **Comum → Raro → Mítico → Épico → Lendário → Divino**.

Essa leitura resolve a contradição aparente (por que um "item mágico"
teria uma raridade *dele mesmo* listada dentro da própria descrição,
senão porque raridade e magia são dois eixos?), mas muda o que o Tiago
talvez estivesse imaginando (uma escada de 7 degraus, mágico incluso).
**Respondido pelo Tiago (verbatim)**: "O item Mágico obtido sem ser por
encantamento ele aumenta a raridade do item sim, agora o item
encantado, como o encantamento é temporário, ele não aumenta essa
raridade." Ou seja: são **dois mecanismos distintos, só um mexe na
raridade** — exatamente a divisão que eu tinha proposto, mas com uma
correção importante: mágico-por-origem-inerente (não por encantamento
de jogador) **é sim um degrau próprio da escada**, não uma propriedade
puramente ortogonal como eu tinha lido. Escada corrigida (7 degraus):
**Comum → Raro → Mágico → Mítico → Épico → Lendário → Divino**.
Encantamento de jogador (temporário, por spell) continua sendo um
campo separado que não empurra o item pra outro degrau — ver
`ASSEMBLEIA-08-MAGIA-E-PROGRESSAO.md` Seção 1 pra como os dois casos se
encaixam (inclusive o caso do dragão de gelo, que ficava ambíguo entre
"Mítico e mágico" ao mesmo tempo).

### 1.2 Épico sem regra de obtenção — confirmado pelo Tiago

O texto do Tiago numerou 1 (comum) a 6 (divino) mas pulou épico — ele
apareceu só na lista de abertura, sem parágrafo próprio. Seguindo o
padrão dos vizinhos na escada (mítico = matar inimigo mítico/dungeon;
lendário = fechamento de arco, ou sorte com mítico/lendário):

**Proposta**: Épico vem de **encontros nomeados/de elite dentro de uma
dungeon** — um "miniboss" com nome próprio que não é o chefe final (que
tende a ser Mítico) nem uma criatura registrada como Lendária/Divina —
ou como recompensa garantida por completar um **desafio opcional**
dentro da dungeon (sala secreta, baú de elite, puzzle). Fica entre
Mítico e Lendário em dificuldade de obtenção, como a posição dele na
lista original do Tiago sugere.

**Confirmado pelo Tiago**: "eu realmente não expliquei o épico, ele
ficara em um nível entre o mítico e o lendário." A posição está
confirmada; o gatilho narrativo específico (miniboss/desafio opcional)
continua sendo a proposta de implementação — não foi rejeitado nem
formalmente aprovado à parte, mas nada nas respostas do Tiago contraria
essa leitura.

### 1.3 Nível de inimigo — quem define (aplicando o princípio do mapa)

Mesmo princípio já usado pra "quem decide que isto é uma masmorra"
(Assembleia 06, Seção 1.3): **o mestre (LLM) não inventa livremente —
escolhe dentro do que o código registrou.** Aplicado aqui com uma
assimetria deliberada:

- **Registro fixo de código**, `window.MWRPG_ENEMY_TIERS` (mesmo padrão
  de `MWRPG_LOCATION_TYPES`): cada inimigo *nomeado/recorrente* (os que
  aparecem mais de uma vez ou são narrativamente relevantes) tem um
  tier travado: `basico | forte | superior | mitico | lendario |
  divino`. Curado a partir do bestiário de 100 criaturas já pesquisado
  em `Relatorio_Pesquisa_RPG.md` §3 (fonte: SRD 5.1 CC-BY 4.0 / PF2e
  SRD, Product Identity da WotC já excluída na pesquisa original) — mas
  **tamanho físico (Grande/Média/Pequena) não é o mesmo eixo que tier de
  ameaça**, então a curadoria é trabalho real do Game System Designer +
  Narrative Writer, não um mapeamento automático.
- **Inimigo ad-hoc narrado na hora** (não está no registro): o mestre
  pode sinalizar só `basico` ou `forte` livremente — os dois tiers que o
  próprio Tiago descreveu com regra clara e sem precisar de nomeação
  prévia ("qualquer missão ou inimigo derrotado", "inimigo de nível
  maior"). **Tiers `mitico`, `lendario` e `divino` só disparam pra
  inimigos que estão no registro** — o mestre não pode declarar
  unilateralmente que um goblin aleatório do turno é Divino. Isso evita
  que a curva de raridade infle por narração solta, exatamente o motivo
  de o mapa já usar essa mesma trava.
- Default seguro quando o mestre não sinaliza nada: `basico` (mesma
  filosofia de "local desconhecido = fora da cidade, nunca libera mapa
  por omissão" — aqui, "sem sinal = não dropa item raro por omissão").

### 1.4 Encantamento aplicado por jogador — o que falta construir antes

O pedido descreve: força e duração do encantamento vêm do "nível de
magia e inteligência do mago", mais um teste pra personagens de baixa
inteligência usarem o item. **Nada disso existe hoje**:

- Não há atributo "Inteligência" — o sistema D6 das Três Letras tem
  CRP/MNT/ALM (`src/engine.js`), fórmula que o Game System Designer
  marca como inegociável sem aprovação explícita do Tiago (`CLAUDE.md`
  §3). Se "inteligência" for outro nome pra MNT, tudo bem; se for um
  4º atributo novo, é mudança de fórmula canônica — pergunta pra
  decidir na hora dessa frente, não agora.
- Não há "nível de magia" — não existe XP, nível de personagem, nem
  lista de magias no jogo hoje (confirmado: zero menção a `level`/`xp`
  em `src/engine.js`, `src/app.jsx`, `src/data.js`). O
  `Relatorio_Pesquisa_RPG.md` §6 já tem 100 magias pesquisadas
  (fonte SRD 5.1) que serviriam de base, mas nunca entraram em código.
- Não há mecanismo de "teste de atributo pra usar item" — hoje só
  existe rolagem de ação (2d6+atributo) narrada pelo mestre; um teste
  de posse de item (não uma ação livre) é um tipo de checagem novo.

**Tamanho**: construir isso do zero (atributo/nível de magia + lista de
magias + regra de teste de uso) é, na prática, o mesmo porte de
trabalho que a Assembleia 05 (sistema de classes) ou a 06 (mapas) —
**não cabe dentro desta rodada sem esvaziar o resto**. Recomendação: o
encantamento **aplicado por jogador em tempo real fica de fora do
v0.8**, e vira candidata a **Assembleia 08 — Sistema de Magia e
Encantamento** (própria, com o Game System Designer definindo primeiro
se Inteligência é atributo novo ou é MNT rebatizado). O que fica
resolvido nesta rodada é só o **encantamento de itens dropados por
monstro**, que o próprio Tiago descreveu como não dependente de
jogador nenhum — só do inimigo morto.

### 1.5 Onde persiste e custo de token — o teto continua apertado

- **Catálogo de itens não precisa de tabela no banco.** É conteúdo
  estático (não muda por jogador, não muda em tempo de execução) — o
  mesmo raciocínio já aplicado a `MWRPG_CLASSES` e `MWRPG_SEEDS`: vira
  `src/items.js`, carregado uma vez pelo navegador, zero custo de
  round-trip. Só o que é **por personagem** vai pro banco: uma tabela
  nova `character_inventory` (item_id, quantidade, dados de
  encantamento quando houver, timestamp), com RLS idêntica ao padrão
  já usado em `characters`/`campaign_sessions`.
- **O mestre nunca recebe o catálogo inteiro no prompt.** Ele só
  precisa saber a *regra* de drop (um parágrafo curto, como as seções
  ÁREA REMOTA/REVELAR MISSÃO já fazem) e emitir um sinal mínimo — não
  o nome do item. **Quem resolve o item de verdade (nome, raridade,
  efeito) é código**, sorteando dentro do catálogo que bate com a
  raridade/tier sinalizados. Isso resolve três problemas de uma vez: o
  prompt fica pequeno (~100-150 tokens de regra nova, mesma ordem de
  grandeza da adição de mapas — nenhuma lista de item entra no prompt),
  o mestre nunca inventa item fora do catálogo (proveniência garantida
  por construção), e fica impossível o jogador "convencer" o mestre a
  dropar um item melhor só de conversa.
- **Risco já em aberto que isso agrava**: o mecanismo de proteção de
  orçamento de token da Groq (vencedor da Assembleia 04) **continua não
  implementado em código** — meu levantamento não achou nenhum limite
  de turnos/custo em produção além do `demo_limit` de sessão. Adicionar
  mais um sistema que roda todo turno (ainda que barato) empilha em
  cima de um portão que já devia estar fechado antes de mais
  testadores. Isso não bloqueia *esta* assembleia, mas reforça o
  portão de lançamento que já estava de pé.

### 1.6 Proveniência do conteúdo — mesma disciplina, um requisito novo

`Relatorio_Pesquisa_RPG.md` §4 (300 armas) e §5 (800 objetos/itens) já
existem como pesquisa, fonte SRD 5.1 (CC-BY 4.0) + Pathfinder 2e SRD
(ORC) + Tormenta20 SRD + domínio público — mesma família de fonte já
usada e aprovada pro bestiário. **Achado real**: os CSVs anexos que o
relatório menciona (`data/armas.csv`, `data/itens.csv`, `data/magias.csv`)
**não existem no repositório** — só as tabelas-resumo e amostras estão
escritas. Ou seja, "importar o catálogo" não é copiar um arquivo pronto
— é trabalho real de curadoria (escolher, adaptar tom, classificar por
raridade), o que por si só é argumento a favor de começar pequeno.

**Requisito novo que este sistema introduz**: hoje nada em produção
usa conteúdo SRD 5.1 de verdade (`docs/ACERVO-PROVENIENCIA.md` confirma
— só fábula/mitologia/folclore até aqui). CC-BY 4.0 exige atribuição
visível, não só um doc interno. Assim que o primeiro item de origem
SRD entrar em produção, o app precisa de uma nota de crédito visível
(rodapé ou seção "Créditos" simples) — pequeno, mas não existe hoje e
precisa entrar junto com esta feature, não depois.

---

## 2. Consulta individual aos agentes

*(Realtime Multiplayer Engineer não foi consultado nesta rodada —
justificativa: o schema hoje é 1 conta = 1 personagem = 1 campanha,
RLS por `auth.uid()`, sem nenhuma sincronização ao vivo entre contas
diferentes — confirmado lendo `supabase/schema.sql`. Inventário de
item, como personagem e campanha, é dado isolado por conta; nada aqui
precisa de tempo real.)*

**Game System Designer** — a favor da escada de 7 degraus (leitura da
Seção 1.1) porque mantém a fórmula canônica intacta e dá pra cada
degrau um gatilho narrativo claro. Divergência real: quer que a
curadoria do registro de tier de inimigo comece **pequena** (10-15
criaturas nomeadas, não as 100 do relatório de uma vez) — bestiário
inteiro de uma vez é trabalho de balanceamento que ele não confia em
fazer direito sem testar em mesa primeiro. Também é quem levanta, sem
resolver agora, se "Inteligência" vira 4º atributo — quer isso na mesa
quando a frente de magia (1.4) começar, não decidido de passagem aqui.

**AI Master Engineer** — dono do argumento central da Seção 1.5: veta
qualquer desenho que mande o catálogo (ou uma lista de itens candidatos)
pro prompt a cada turno — insiste que o mestre só emite um sinal
mínimo (`itemHint`) e código resolve o item, do mesmo jeito que
`mapHint`/`revealMission` já funcionam. Divergência real com o
Orchestrator: acha que esta feature **não devia entrar em produção**
antes do mecanismo de orçamento da Groq (Assembleia 04) estar de pé,
não só "reforça o alerta" — quer isso registrado como objeção, não só
nota de rodapé.

**Backend Engineer** — a favor de catálogo estático (`src/items.js`,
sem tabela) + uma tabela nova só (`character_inventory`), copiando a
RLS já validada de `characters`. Diverge do Game System Designer: acha
que 10-15 criaturas no registro de tier é pouco pra cobrir os 3
cenários (cidade, masmorra registrada, missão distante ad-hoc) sem o
mestre esbarrar constantemente no default `basico` por omissão —
prefere um piso de ~25.

**Narrative Writer** — concorda com a fonte (SRD 5.1 CC-BY 4.0 / PF2e
SRD / domínio público), mas insiste que o texto de flavor de cada item
seja **reescrito no tom do jogo** ("sábio, consciente, sincero,
direto"), não colado literal do SRD — reutilizar o *nome* de um item
sob CC-BY é diferente de copiar a descrição inteira. É quem levanta o
requisito de crédito visível em produção (Seção 1.6) como bloqueante
pra esta feature especificamente, não genérico. Diverge do Backend:
prefere catálogo inicial **ainda menor** que os 25 do Backend — quer
uns 8-10 itens por raridade baixa (comum/raro) e só 2-3 nas raridades
altas pra não escrever flavor apressado.

**Frontend Engineer** — propõe estender o painel de ficha já existente
com uma lista de inventário simples (nome, raridade por cor/borda, tag
de encantado), sem tela nova dedicada nem ícone por item nesta rodada
— ícone/arte de item é custo visual que ele quer separar pra depois
(mesmo raciocínio que já se aplicou à arte de mapa entrar em fase
própria). Sem discordância forte dos outros, mas é quem nomeia essa
divisão de fases explicitamente.

**Infra Engineer** — sem objeção de custo real (jsonb de inventário é
barato, mesmo padrão de `campaign_sessions`), só nota pra não deixar
`character_inventory` crescer sem paginação se um personagem acumular
centenas de itens ao longo de uma campanha longa — não bloqueia agora,
fica registrado.

**Code QA Engineer** — dois achados: (1) a tabela nova precisa da MESMA
checklist de RLS já usada, não uma versão resumida — item de
inventário é dado sensível de progresso, igual personagem; (2) se o
teste de "baixa inteligência pra usar item" for cortado desta rodada
(Seção 1.4), o código **não pode fingir** que o teste roda — melhor
nenhum item exigir teste ainda do que um teste que sempre passa
silenciosamente. Vota contra qualquer finalista que inclua "encantamento
por jogador" pela metade.

**Test Engineer** — quer a regra do fluxo encadeado aplicada aqui:
testar uma sessão de várias lutas seguidas, confirmar que o inventário
acumula certo (sem duplicar item em reload, sem perder item entre
turnos) — não uma luta isolada. Vota por qualquer finalista que entregue
uma fatia vertical testável nesta rodada (drop real de ponta a ponta),
não só schema sem uso visível.

**Orchestrator** — corta o escopo: recomenda separar encantamento por
jogador numa frente própria (Seção 1.4), aponta que o catálogo pequeno
(Narrative Writer) resolve a divergência de tamanho com o Backend
(começar pequeno, crescer depois sem nova assembleia), e defende que a
resolução de drop por código (AI Master Engineer) é não-negociável
porque resolve token, proveniência e anti-exploit ao mesmo tempo.

---

## 3. Síntese — convergência e divergência real

**Convergência forte (nenhum agente discordou)**:
- Raridade de 7 degraus (correção pós-resposta do Tiago — ver ERRATA) + "mágico" como propriedade separada (pendente
  de confirmação do Tiago, mas nenhum agente propôs os 7 degraus).
- Catálogo estático em `src/items.js`, sem tabela nova pra conteúdo.
- Drop resolvido por código a partir de um sinal mínimo do mestre —
  nunca o catálogo inteiro no prompt.
- Registro de tier de inimigo travado em código pros tiers altos
  (mítico+); tiers baixos (básico/forte) o mestre sinaliza livre.
- Encantamento por jogador fica de fora — vira frente própria.

**Divergência real, não resolvida por consenso automático**:
- **Tamanho do catálogo/registro inicial**: Narrative Writer quer o
  menor (8-10 por raridade baixa), Backend quer piso de 25 criaturas
  no registro de tier, Game System Designer quer só 10-15 pra testar
  em mesa primeiro. Isso vira parte do corte de escopo abaixo, não um
  número único "certo".
- **AI Master Engineer objeta a fazer isso antes do portão de
  orçamento da Groq estar pronto** — divergência de sequenciamento, não
  de desenho. Registrado como objeção formal, incorporado como
  mitigação no vencedor (Seção 5), não descartado.

---

## 4. Cinco finalistas

### Finalista 1 — "Só o piso: Comum e Raro, sem registro de inimigo"
Catálogo com só 2 raridades, sinal binário "inimigo forte: sim/não"
sem tier travado, sem magia, sem tabela de inventário estruturada (só
uma lista solta). Rápido, mas ignora a maior parte do que o Tiago
descreveu (mítico, épico, lendário, divino, magia, registro de
inimigo) — serve só de piso de comparação.

### Finalista 2 — "7 raridades, mas só básico/forte disparam drop"
Catálogo completo (7 raridades + propriedade mágica), mas o registro
de tier de inimigo só cobre básico/forte — mítico/épico/lendário/
divino só entram via gatilho narrativo direto (fechamento de arco/
campanha), nunca de inimigo derrotado. Evita ter que curar bestiário
agora, mas contraria o pedido explícito do Tiago ("inimigos míticos...
dropam itens míticos").

### Finalista 3 — "Economia completa, encantamento por jogador fora"
Catálogo completo (7 raridades + propriedade mágica), registro de tier
de inimigo cobrindo todos os 6 tiers (curadoria pequena, 12-15
criaturas pra começar — meio-termo entre Game System Designer e
Backend), drop resolvido por código via `itemHint` mínimo, encantamento
de item de monstro fixo por tag do inimigo (sem estatística de
jogador), player-cast encantamento fora do escopo (frente própria).
Entrega o que o Tiago pediu quase por inteiro, só a metade de
"encantamento" (a que dependia de sistema de magia inexistente) fica
pra depois.

### Finalista 4 — "Tudo nesta rodada, incluindo magia do jogador"
Finalista 3 + construir do zero: atributo/nível de magia, lista de
magias (base: `Relatorio_Pesquisa_RPG.md` §6), regra de teste de uso
por baixa inteligência. Entrega 100% do pedido original numa rodada só.

### Finalista 5 — "Finalista 3, catálogo mínimo, expande depois"
Igual ao Finalista 3, mas o catálogo inicial é deliberadamente pequeno
(8-10 itens por raridade baixa, 2-3 nas altas — número do Narrative
Writer) e o registro de inimigo começa nos 10-15 do Game System
Designer, não nos 25 do Backend — expandir os dois é tarefa de conteúdo
contínua, sem precisar de nova assembleia pra crescer depois que a
mecânica já está no ar.

---

## 5. Votação

| Agente | Voto | Motivo |
|---|---|---|
| Game System Designer | Finalista 5 | Escada completa, mas curadoria pequena o bastante pra testar em mesa antes de crescer |
| AI Master Engineer | Finalista 3 ou 5 (indiferente ao tamanho do catálogo) — **com objeção de sequenciamento** | Arquitetura de drop-por-código é o que importa pra ele; insiste em registrar formalmente que isso não deveria subir antes do portão de orçamento da Groq |
| Backend Engineer | Finalista 3 | Prefere o piso de 25 no registro de inimigo — aceita ser voto vencido, não bloqueante |
| Narrative Writer | Finalista 5 | Catálogo pequeno dá tempo de reescrever cada flavor no tom certo em vez de importar em massa |
| Frontend Engineer | Finalista 5 | Menos itens pra desenhar na lista de inventário nesta rodada, ícone fica pra depois de qualquer forma |
| Infra Engineer | Finalista 3 ou 5 (indiferente) | Custo de armazenamento é desprezível nos dois; sem preferência forte |
| Code QA Engineer | Finalista 3 ou 5, nunca 4 | Vota contra qualquer versão com "encantamento por jogador" pela metade (Finalista 4) — teste de INT teria que ser stub disfarçado |
| Test Engineer | Finalista 3 ou 5 | Qualquer um entrega fatia vertical testável; rejeita Finalista 1/2 por não cobrirem drop de alta raridade de verdade |
| Orchestrator | **Finalista 5** | Resolve a divergência de tamanho de catálogo a favor do corte mais conservador, sem abrir mão de nenhuma peça mecânica que o Tiago pediu |

**Resultado**: Finalista 5 vence, 5 votos diretos (Game System Designer,
Narrative Writer, Frontend Engineer, Orchestrator, e Backend/Infra
cedem por indiferença de tamanho de catálogo — não por discordar da
arquitetura). Finalista 3 não perde por desenho, só por escopo de
conteúdo inicial maior; a diferença entre os dois é só "quantos itens
entram já" — a arquitetura de fundo é idêntica.

---

## 6. Vencedor — com a objeção da minoria incorporada

**Finalista 5 — economia completa de 7 raridades, catálogo inicial
pequeno, encantamento por jogador fora desta rodada.**

**Objeção formal do AI Master Engineer incorporada como condição, não
nota de rodapé**: este sistema **não entra em produção antes do
mecanismo de proteção de orçamento da Groq (vencedor da Assembleia 04)
estar implementado e testado**. Não é uma preferência — é o mesmo
portão de lançamento que já valia pros mapas avançados, agora reforçado
por mais um sistema que roda todo turno. Se o Tiago aprovar esta
assembleia, a ordem de implementação real vira: **(1) portão de
orçamento da Groq primeiro, se ainda não estiver pronto; (2) só depois,
itens.**

### O que entra no v0.8 (proposta de corte)

- Catálogo `src/items.js`: 7 raridades (Comum, Raro, Mágico, Mítico, Épico,
  Lendário, Divino) × propriedade `encantado` opcional em qualquer uma.
  Conteúdo inicial pequeno — 8-10 Comum/Raro, 4-6 Mítico, 2-3 cada em
  Épico/Lendário/Divino — fonte SRD 5.1/PF2e SRD/domínio público,
  reescrito no tom do jogo, com nota de crédito visível em produção
  (primeira vez que conteúdo SRD realmente entra no ar).
- Registro `window.MWRPG_ENEMY_TIERS`: 10-15 criaturas nomeadas
  curadas do bestiário do `Relatorio_Pesquisa_RPG.md` §3, cobrindo os
  6 tiers. Ad-hoc narrado pelo mestre só pode ser básico/forte.
- Drop resolvido por código a partir de `itemHint` mínimo no JSON do
  mestre (mesmo padrão de `mapHint`/`revealMission`) — mestre nunca
  inventa item, nunca recebe o catálogo no prompt.
- Encantamento de item de monstro **fixo por tag do inimigo** (ex.:
  dragão de gelo → chance de efeito de frio), sem estatística de
  jogador nenhuma.
- Tabela `character_inventory` (Supabase, RLS igual a `characters`).
- Extensão simples do painel de ficha já existente pra listar
  inventário (nome, raridade por cor, tag "encantado"), sem tela nova.

### O que fica pra depois, e por quê

- **Encantamento aplicado por jogador** (força/duração por nível de
  magia + Inteligência, teste de uso por baixa Inteligência) — precisa
  de sistema de magia inteiro que não existe (atributo, nível, lista de
  magias). Candidata a **Assembleia 08 — Sistema de Magia e
  Encantamento**.
- **Expansão do catálogo além do inicial** — tarefa de conteúdo
  contínua, não precisa de nova assembleia pra crescer (a mecânica já
  aguenta mais itens, só precisa de curadoria/flavor).
- **Ícone/arte por item** — mesmo raciocínio da Assembleia 06 (mecânica
  antes de acabamento visual); fica pra quando a arte de mapas v0.7
  tiver espaço na fila de novo.

---

## Status — as duas perguntas foram respondidas pelo Tiago

**Pergunta 1**: respondida — "mágico" É um degrau (ver ERRATA no topo
do documento), escada corrigida pra 7 degraus, com o encantamento de
jogador confirmado como eixo separado que não muda raridade.

**Pergunta 2**: respondida — Épico confirmado entre Mítico e Lendário.

O restante do desenho (registro de inimigo, resolução de drop por
código, catálogo pequeno, ordem atrás do portão de orçamento da Groq)
segue proposto como estava. **O que mudou de verdade**: como "mágico"
agora depende de existir magia de verdade no jogo (não só uma tag
decorativa), a implementação de itens ganhou uma dependência nova —
ver `ASSEMBLEIA-08-MAGIA-E-PROGRESSAO.md`, que trata isso como parte
da fundação do sistema de magia, junto com o pedido mais amplo de
progressão/spells/encantamento que o Tiago trouxe na sequência.
**Continua não implementado** — aguardando aprovação conjunta das duas
assembleias (07 e 08), já que uma depende da outra pra fazer sentido.

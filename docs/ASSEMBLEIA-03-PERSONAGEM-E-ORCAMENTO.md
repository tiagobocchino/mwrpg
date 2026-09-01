# Assembleia 03 — Reconciliar escopo (personagem/sala) e orçamento de token da Groq

Gerada a partir da `docs/RETROSPECTIVA-01-DESVIO-DE-METODO.md`: os dois
pontos reais que a retrospectiva encontrou sem mitigação — o escopo da
Assembleia 01 (sala/Realtime/criação de personagem) abandonado sem
decisão formal, e o risco de orçamento de token da Groq sinalizado mas
nunca resolvido. Método completo, como pedido pelo Tiago: baseline →
consulta individual → síntese → 5 finalistas → votação → vencedor com
mitigações da minoria → aguardando aprovação antes de implementar.

---

## 1. Baseline (munição pro debate, não proposta fechada)

**Situação atual, confirmada no código antes de escrever isto**: v0.4/v0.5
é solo + login individual. `campaign_sessions` é 1:1 `user_id`. A tabela
`characters` existe em `supabase/schema.sql` mas tem zero referências em
`src/` — nunca foi ligada a nada. Não existe sala, convite, nem Supabase
Realtime. O limite de 40 rodadas/campanha não tem nenhum mecanismo de
proteção agregada contra o teto de 200k tokens/dia da Groq (que é por
organização, não por usuário).

**Três rumos candidatos pra próxima fase:**
- **A — Retomar a Assembleia 01 como estava**: construir sala + Realtime
  + criação de personagem agora, do jeito que foi aprovado em 31/08.
- **B — Solo definitivo**: fechar formalmente a porta de multiplayer por
  ora, registrar isso como decisão (não como esquecimento) em `CLAUDE.md`
  e no roadmap, revisitar só com sinal real de demanda.
- **C — Meio-termo**: manter solo (é o que está gerando aprendizado real
  com testers), mas terminar a criação de personagem agora (já estava
  provisionada no schema, é o item que a Game System Designer marcou como
  não-negociável desde a Assembleia 01), e tratar o risco de orçamento da
  Groq como bloqueio paralelo antes de abrir pra mais gente.

---

## 2. Consulta individual aos agentes

### Realtime Multiplayer Engineer
Meu domínio inteiro — Presence, Broadcast, sala — segue em zero desde que
foi aprovado. Não vejo problema técnico em adiar mais uma fase, mas
objeto a deixar isso invisível de novo: se vamos continuar solo, isso
precisa virar registro explícito, não silêncio como da última vez. Com
sinal real de gente terminando campanha solo, aí sim entra sala — abrir
Realtime sem esse sinal é gastar engenharia sem saber se alguém quer
jogar junto. **Não bate com A agora** (cedo demais sem dado de uso); não
gosto de B porque "fechar a porta" formal é otimista demais no sentido
errado — prefiro "ainda não" a "não".

### Game System Designer
Criação de personagem é meu item não-negociável desde a Assembleia 01 e
segue sem existir — quem joga hoje usa a ficha fixa de `data.js`. Isso já
trava conteúdo solo: qualquer um dos outros 24 enredos do Relatório
precisa de personagem customizável pra fazer sentido, sala ou não sala.
**Prioridade: destravar isso agora, com ou sem sala.**

### Backend Engineer
O schema já antecipa isso (`characters` table, criada e nunca usada) —
terminar essa peça não é escopo novo, é fechar o que já foi desenhado.
Ressalva técnica real: `campaign_sessions.user_id` hoje presume dono
único; se sala voltar depois, isso precisa de uma tabela de participação
(`session_members` ou similar) em vez de FK direta — desenhar
`characters` já sabendo disso evita migração dupla, mas não bloqueia
fazer characters agora.

### AI Master Engineer
O item mais urgente do ponto de vista técnico não é personagem — é o
teto de 200k tokens/dia da Groq ser por organização inteira. Isso já
está sinalizado em `CLAUDE.md` sem mitigação nenhuma. Cada dia que
passa com mais gente testando aumenta a chance real de um jogador no
meio de uma campanha receber "cota esgotada" por causa de outro
jogador que ele nunca viu — pior experiência que não ter personagem
customizável ainda. **Isso precisa de ação concreta antes de abrir pra
mais testers**, não depois.

### Narrative Writer
Apoio a prioridade de personagem — sem isso, todo o material do
Relatório além de "A Coroa Enterrada de Ys" fica parado. Sala não muda
meu trabalho diretamente; não tenho posição forte nesse eixo.

### Frontend Engineer
Criação de personagem é uma tela nova (wizard), cabe sem sair do
zero-build — é só mais um componente React, não uma decisão de
arquitetura. Sala seria diferente: estado compartilhado ao vivo entre
abas é exatamente o tipo de complexidade que eu já registrei no meu
próprio arquivo como "decisão a levar pra assembleia, não a tomar
sozinho" (trade-off zero-build vs. Vite). Se formos de A agora, quero
essa decisão de build step formalmente decidida aqui, não implícita —
mas prefiro adiar a pergunta pra quando sala realmente entrar.

### Infra Engineer
Sem custo extra pra terminar personagem (mesma infra atual, mesmo tier).
Sala futura (Supabase Realtime) segue no tier gratuito até um volume que
não vou estimar de memória — confirmo o número real quando a decisão
for tomada de verdade, não agora como enchimento.

### Code QA Engineer
Achado da minha própria checklist não aplicada retroativamente: o campo
`mapHint.enterInterior` estendeu o contrato JSON do mestre sem passar
por revisão minha formal — não é grave (é aditivo, não quebra nada), só
registro que devia ter passado. Sobre o rumo: terminar personagem
introduz menos superfície nova de isolamento pra proteger do que sala
(sala = mais um vetor de "jogador vê dado de outro jogador"). Também
apoio resolver o orçamento de token antes de mais testers — cota
estourada no meio de uma campanha real é o tipo de falha que devia ter
sido pega antes de acontecer com um usuário de verdade.

### Test Engineer
A regra do fluxo encadeado já exige testar sessões solo de vários turnos
seguidos — isso continua valendo pra personagem custom. Sala multiplica
a superfície de teste (múltiplas abas simultâneas); prefiro isso vir
depois de já termos testado bem o fluxo solo com usuários de fora,
incluindo o fluxo de criação de personagem.

---

## 3. Síntese — convergência e divergência

**Convergência forte (8 de 9 agentes)**: terminar a criação de
personagem agora, independente de sala. Ninguém defendeu adiar isso.

**Convergência forte, eixo separado**: o risco de orçamento de token da
Groq (AI Master Engineer, Code QA Engineer, e implicitamente Realtime
Multiplayer Engineer ao falar de "sinal real de uso") precisa de ação
concreta antes de mais testers — não é opcional, tem prazo real (cada
tester novo aumenta a chance de estourar).

**Divergência real**: não é entre A/B/C como blocos — é **ordem e
urgência relativa** entre "terminar personagem" e "resolver orçamento de
token". Ninguém propôs abandonar sala pra sempre (Realtime Multiplayer
Engineer rejeita explicitamente formalizar isso como "não" definitivo).
Esse é o eixo de variação real dos finalistas.

---

## 4. Cinco finalistas

### Finalista 1 — "Retomar tudo agora" (= A)
Construir sala + Realtime + criação de personagem juntos, do jeito que a
Assembleia 01 aprovou originalmente. Sem esperar sinal de demanda.

### Finalista 2 — "Personagem primeiro, sala depois"
Termina a criação de personagem agora (schema já existe, só falta o
fluxo). Orçamento de token da Groq entra como tarefa pequena em paralelo
(não bloqueia o lançamento de personagem, mas roda antes de qualquer
divulgação nova pra mais testers). Sala fica no roadmap, sem data, com
critério explícito de retomada (sinal real de demanda solo).

### Finalista 3 — "Orçamento primeiro, depois personagem"
Resolve o risco de token da Groq nesta semana (baixar o padrão de 40 pra
um número mais seguro, ou um contador agregado no Supabase que recusa
educadamente antes do teto) antes de qualquer novo convite de teste.
Personagem entra logo em seguida, mas só depois do orçamento estar
protegido.

### Finalista 4 — "Solo definitivo" (= B)
Fecha formalmente a porta de multiplayer por ora — registra em
`CLAUDE.md`/roadmap como decisão deliberada, não pendência. Foco total em
polir o solo (personagem incluso) sem nenhum compromisso futuro de sala.

### Finalista 5 — "Personagem + sala mínima juntos"
Termina personagem E desenha uma sala mínima (dono + convite por link,
sem Realtime — sincronização por polling/refresh, como o Finalista 1 da
Assembleia 01 já tinha mapeado) no mesmo ciclo, pra não migrar o schema
duas vezes. Realtime de verdade fica pra depois.

---

## 5. Votação

| Agente | Voto | Justificativa / objeção |
|---|---|---|
| Realtime Multiplayer Engineer | **#2** | Sem sinal de demanda pra sala ainda; objeta #1 (cedo demais) e #4 (não fechar a porta formalmente, só adiar). |
| Game System Designer | **#2** | Personagem é o item que mais atrasou — prioridade máxima, com ou sem sala. |
| Backend Engineer | **#5** (dissenso) | Terminar `characters` e já desenhar a separação dono/participante junto evita migração dupla — mais barato fazer uma vez que duas. |
| AI Master Engineer | **#3** | Orçamento de token tem prazo real, cada tester novo aumenta o risco; desclassifica #1 e #5 por adicionarem escopo antes de proteger quem já está jogando. |
| Narrative Writer | **#2** | Personagem destrava conteúdo parado; sem posição forte no eixo sala. |
| Frontend Engineer | **#2** | Personagem cabe sem sair do zero-build; objeta a #1/#5 — decisão de build step pra sala não deveria ser implícita dentro de outro finalista. |
| Infra Engineer | **#2** | Sem diferença de custo relevante entre #2/#3; segue o consenso. |
| Code QA Engineer | **#3** | Cota estourada no meio de campanha de um usuário real é falha que deveria ter sido pega antes — prioridade de proteção sobre feature nova. |
| Test Engineer | **#2** | Quer testar o fluxo de personagem como parte do fluxo encadeado antes de qualquer superfície nova de sala. |

**Resultado: Finalista 2 vence 6 a 2 a 1** (Backend Engineer dissente pra
#5; AI Master Engineer e Code QA Engineer dissentem pra #3).

---

## 6. Vencedor — com as mitigações da minoria incorporadas

**Finalista 2, "Personagem primeiro, sala depois"**, com o ajuste que
vem do dissenso que tem peso técnico real (a maioria não descarta o
ponto, só discorda da ordem):

1. **Do dissenso do AI Master Engineer e do Code QA Engineer (#3)** —
   incorporado, não descartado: o orçamento de token da Groq deixa de ser
   "em paralelo, sem prioridade clara" e vira **bloqueio explícito antes
   de qualquer novo convite de teste público**, ainda que a implementação
   de personagem comece em paralelo. Ou seja: pode-se construir os dois
   ao mesmo tempo, mas **não convidar mais gente pra testar** até o
   orçamento estar protegido — isso é barato (é decisão de sequência, não
   de escopo extra) e resolve a objeção sem atrasar personagem.
2. **Do dissenso do Backend Engineer (#5)** — parcialmente incorporado:
   ao desenhar o fluxo de criação de personagem, a tabela `characters`
   já tem `user_id` (dono) separado de `campaign_sessions` — o desenho já
   não precisa de migração pra sala no sentido de "quem é dono do
   personagem". O que falta pra sala de verdade é só a camada de
   participação/convite, que fica fora de escopo desta fase por decisão
   da maioria, não por esquecimento.

### O plano, resumido

- **Personagem**: fluxo de criação (`Backend Engineer` liga a tabela
  `characters` já existente; `Frontend Engineer` constrói o wizard;
  `Game System Designer` define os campos/arquétipos; `Narrative Writer`
  adapta o texto de onboarding).
- **Orçamento de token**: `AI Master Engineer` propõe o mecanismo
  (contador agregado no Supabase, ou reduzir o padrão de 40) antes de
  qualquer divulgação nova — **bloqueia convite de mais testers, não
  bloqueia o desenvolvimento de personagem**.
- **Sala/Realtime**: registrado no roadmap como "adiado por decisão, não
  por esquecimento" — critério de retomada: sinal real de jogadores
  solo pedindo pra jogar junto.
- **Code QA Engineer**: revisão retroativa de uma frase confirmando que
  `mapHint.enterInterior` não quebra o contrato do mestre (achado da
  retrospectiva, baixo risco, só fechar o registro).

### Em aberto — não decidido nesta assembleia

- Número exato do novo limite de demo, ou desenho exato do contador
  agregado — fica para a implementação real do AI Master Engineer,
  pesquisando preço/limite vigente da Groq (nunca por memória).
- Campos exatos da ficha de criação de personagem (arquétipos, pontos de
  distribuição) — Game System Designer especifica na implementação.

---

## Aguardando aprovação do Tiago

Nenhuma linha de código deste plano até o sinal explícito dele. Só este
documento e a retrospectiva não dependem de aprovação — são processo, não
produto, igual já registrado em `docs/METODO-PLANEJAMENTO.md`.

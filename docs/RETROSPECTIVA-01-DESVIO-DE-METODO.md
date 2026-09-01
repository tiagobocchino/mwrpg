# Retrospectiva 01 — desvio do método desde a Assembleia 02

**Motivo**: cobrança direta do Tiago (31/08/2026) — "você não está puxando
os especialistas e usando a metodologia do mesmo jeito que fizemos no
PushProcessos". Correta. Desde a Assembleia 02, login, senha pós-login,
limite de demo, contador por campanha, e o sistema de mapa (Leaflet +
Kenney, escopo de cidade+interiores) foram construídos direto — sem
consulta individual aos agentes, sem assembleia, sem votação. A
responsabilidade é dividida (o Tiago aprovou "constrói tudo", eu deveria
ter mantido o método rodando por baixo mesmo assim), mas quem tinha o
método documentado e os agentes prontos era eu.

Esta retrospectiva responde à pergunta real: **das decisões tomadas fora
do método, alguma teria sido derrubada se passasse pelos especialistas?**
Não é reabrir o que está bom — é auditoria honesta.

---

## O achado principal: o escopo da Assembleia 01 foi abandonado em silêncio

Antes de revisar as 6 decisões pontuais, o achado mais importante é
estrutural. A **Assembleia 01** (`docs/ASSEMBLEIA-01-PLATAFORMA-MULTIPLAYER.md`)
aprovou 8 a 1 o Finalista 2 ("Equilíbrio"), com escopo mínimo explícito:

> contas (magic link) + **criação de personagem** + **criar/entrar em
> sala por convite (token longo)** + Supabase Realtime (Presence +
> Broadcast) pra sincronização ao vivo + jogar uma sessão **multiplayer**
> completa.

O que de fato foi construído em v0.4/v0.5: login individual (magic link
— consistente com o aprovado), mas **nenhuma sala**, **nenhum Realtime**,
e **nenhuma criação de personagem** — o jogador continua com a ficha fixa
de `src/data.js`. Pior: a tabela `characters` já existe em
`supabase/schema.sql` (`user_id`, `name`, `data jsonb`) desde que o
schema foi escrito, provisionada exatamente pra esse fluxo — e está
**100% morta**, sem nenhuma referência em `src/` (confirmado por busca no
código antes de escrever esta retrospectiva, não por suposição). O
Backend Engineer scaffoldou a peça certa e ela nunca foi ligada.

Isso não aconteceu por decisão — aconteceu porque o pedido do Tiago
("temos que fazer login agora... limite de 40 rodadas") foi implementado
direto, e o produto foi silenciosamente virando "demo solo com login" sem
que ninguém — nem eu, nem os agentes, nem o Tiago explicitamente — tenha
decidido abandonar sala/Realtime/criação de personagem. Pode ter sido a
escolha certa (validar solo antes de multiplayer é uma estratégia
defensável), mas **nunca foi uma escolha registrada** — foi deriva.

---

## Revisão item a item

### 1. Login por link mágico
**Mecanismo em si**: já estava no plano aprovado da Assembleia 01 —
consistente, não contestável.
**O que não bate**: o modelo de dados por trás (`campaign_sessions` 1:1
`user_id`, sem noção de sala/membro) nunca foi levado ao Backend Engineer
formalmente depois da pivotagem pra solo. Se sala voltar, esse schema
precisa de rework (ver Assembleia 03, F5 do Backend Engineer).
**Seria contestado?** O mecanismo não. O modelo de dados, sim — não pelo
que é, mas por nunca ter sido decidido conscientemente.

### 2. Senha criada logo após o link mágico
**Análise honesta**: a Frontend Engineer/Backend Engineer escolheram
magic link *especificamente* pra reduzir atrito no primeiro contato
("sem senha pra entrar a primeira vez"). Inserir uma tela de senha
obrigatória-mas-pulável logo depois da confirmação **adiciona um passo**
no momento mais crítico do funil — o primeiro toque. A opção de pular
mitiga, mas um Frontend Engineer consultado formalmente teria ao menos
perguntado "por que não deixar isso pro segundo acesso?". Não é grave — é
uma escolha de UX com racional (evitar depender de link novo toda vez) —
mas é o tipo de decisão que a Frontend Engineer registra explicitamente
que **deveria** ir pra mesa, não decidir sozinha (ver o próprio arquivo
do agente, seção "decisão explícita a levar pra assembleia").
**Seria contestado?** Provavelmente questionado, não necessariamente
revertido. Mantenho como está — não vale desfazer uma feature que já
funciona por um processo faltante — mas registro o ponto.

### 3. Contador por campanha (não por usuário nem por sala)
Design correto dado o modelo solo atual — mas herda o mesmo problema do
item 1: faz sentido *porque* não existe sala. Se sala voltar, "campanha"
passa a pertencer ao grupo, não ao usuário individual, e o contador
precisa mudar de dono.
**Seria contestado?** Não no mérito isolado. Sim como consequência do
achado principal.

### 4. 40 rodadas por campanha
Já documentei o risco em `CLAUDE.md` (40 rodadas × ~60k tokens ≈ só ~3
campanhas completas por dia no teto de 200k tokens/dia da Groq, que é por
organização inteira, não por usuário) — mas **sinalizar não é mitigar**.
O AI Master Engineer, formalmente consultado, teria proposto uma ação
concreta antes de abrir pra mais testers: baixar o padrão, ou um contador
agregado de uso diário no Supabase que recusa educadamente antes de
estourar a cota pra todo mundo. Isso ainda não existe.
**Seria contestado?** Sim — este é o item com objeção técnica real e
ainda sem mitigação. Entra como prioridade na Assembleia 03.

### 5. Leaflet + Kenney (biblioteca e arte do mapa)
Peso medido antes de adotar (Leaflet ~46KB gzip, arte 68KB), licença
registrada (`docs/MAPAS-PROVENIENCIA.md`), zero-build preservado.
**Seria contestado?** Não — é a única das seis decisões que, revisada
agora, se sustenta sem ressalva nenhuma.

### 6. Escopo do mapa (cidade + 3 interiores, mestre decide via `mapHint.enterInterior`)
Tecnicamente qualifica como "muda comportamento visível do jogador de
forma não-trivial" (critério b do método) e deveria ter passado por
consulta, ainda que rápida. O `mapHint.enterInterior` também é uma
extensão aditiva do contrato JSON do mestre — o tipo de mudança que o
checklist do Code QA Engineer existe pra pegar, e que não foi revisado
formalmente por essa lente.
**Seria contestado?** Não no resultado — Game System Designer não tem
regra mecânica pra atrelar a "estar num interior" (é só narrativo/visual,
o que é uma escolha válida), mas isso deveria ter sido uma confirmação
explícita de uma frase, não um silêncio. Baixo risco, processo faltante
registrado.

---

## Conclusão

Uma decisão estrutural real ficou sem mitigação (item 4, orçamento de
token da Groq) e um desvio estrutural real nunca foi formalizado como
decisão (o abandono do escopo de sala/Realtime/criação de personagem da
Assembleia 01 — que também deixou uma tabela inteira do banco morta). As
outras quatro decisões se sustentam no mérito, com processo faltante mas
sem substância errada.

**Assembleia 03** (a seguir) resolve os dois pontos reais: reconcilia o
escopo (retomar sala agora, formalizar solo, ou meio-termo) e decide o
que fazer do risco de orçamento da Groq antes de abrir pra mais
testers.

# Assembleia 08 — Magia, progressão e encantamento

Continuação direta da Assembleia 07. O Tiago respondeu as duas perguntas
em aberto de lá (registrado na ERRATA de
`ASSEMBLEIA-07-ITENS-E-RARIDADES.md`) e, na mesma mensagem, especificou
como o encantamento por jogador funciona de verdade — o que abre um
sistema bem maior que "aplicar um buff": progressão de personagem,
Inteligência como eixo de maestria, magias como entidade própria, e
pergaminhos/grimórios como forma de aprender magia por item.

Respostas do Tiago que viram especificação aqui (verbatim):

> "Sobre os encantamentos, encantamentos são spells, elas podem ser
> adquiridas por experiência do personagem, caso ele alcance 'x' de
> inteligência ele liberará as skills daquele nível, mas também se ele
> tiver inteligência suficiente para aprender magias que ele encontrar
> em pergaminhos e grimórios ele terá de ler, interpretar (sujeito a
> teste de conhecimentos gerais e inteligência) e aprender (quanto
> maior o nível da skill mais ele tem que treinar para dominá-la)."
>
> "Sobre o treinamento de spells, cada spell nova vai ser mais difícil
> do personagem usar, que pode escalonar a dificuldade em fator da
> inteligência — quão maior ela for, mais maestria o personagem tem
> para aprender e usar spells."

Método completo: baseline nos 4 pontos que o Tiago pediu explicitamente
→ consulta individual → síntese → 5 finalistas → votação com
divergência real → vencedor → corte honesto. **Não implementado.**

---

## 1. Baseline — como os dois mecanismos de "mágico" se encaixam

Antes dos 4 pontos pedidos, uma reconciliação necessária: a Assembleia
07 tinha o exemplo do dragão de gelo ("armadura... será um item Mítico
e mágico") e a resposta nova ("mágico obtido sem ser por encantamento
aumenta a raridade"). Os dois batem assim:

- **Magia inerente** (não vem de jogador, vem de monstro/origem do
  item) — **promove** o item na escada de 7 degraus. Pra um item que já
  nasceria Comum/Raro por origem, "descobrir" que ele é magicamente
  imbuído o promove até o degrau **Mágico**. Pra um item cuja origem já
  é Mítico+ (por vir de um inimigo de tier alto, como o dragão), o
  degrau já é ditado pelo tier do monstro — a magia inerente não
  promove de novo por cima disso, ela só faz parte de *por que* aquele
  item chegou nesse degrau (é a mesma "energia" que justifica o salto:
  um dragão Mítico dropa um item Mítico *porque* carrega magia
  inerente do próprio dragão). Um item não tem dois degraus ao mesmo
  tempo — o degrau final é sempre o maior dos dois critérios (origem
  do monstro vs. presença de magia inerente), nunca a soma.
- **Encantamento de jogador** (spell aplicada por um mago com magias
  conhecidas) — **nunca muda o degrau**. É um campo à parte
  (`encantamento: { spellId, forca, expiraEm }`) que existe temporário
  em cima de qualquer item, de qualquer degrau, aplicado e removido sem
  tocar na raridade base do item.

Essa reconciliação é minha leitura de como os dois relatos se encaixam
— **fica marcada pra revisão do Tiago na aprovação**, não é uma
terceira pergunta bloqueante nova (já usei a pergunta em aberto desta
rodada nas duas da Assembleia 07; isto aqui é síntese, não uma
ambiguidade nova do mesmo tipo).

### 1.1 Ordem de dependência (pedido explícito do Tiago)

```
Inteligência (atributo) + progressão (XP)
        │
        ▼
Catálogo de magias (src/spells.js) + desbloqueio automático por limiar de INT
        │
        ├──────────────────────────────┐
        ▼                              ▼
Pergaminhos/grimórios (precisa      Encantamento por jogador
do sistema de ITENS da              (precisa de magias conhecidas
Assembleia 07 já existir,           — Layer acima — e vira o
porque scroll/grimório É            campo `encantamento` que a
um tipo de item) + teste de         Seção 1 acima descreve)
leitura (conhecimentos gerais
+ INT) + estado de treino
persistido (mais longo pra
magia de nível mais alto)
```

Confirma o que o Tiago pediu pra deixar explícito: **Inteligência e
progressão vêm antes de qualquer magia existir; magias conhecidas vêm
antes de encantamento ser possível; o sistema de itens (Assembleia 07)
precisa existir antes de pergaminho/grimório fazerem sentido como
item.** Nenhuma dessas quatro camadas é opcional pular — cada uma é
pré-requisito real da próxima, não só ordem de prioridade.

### 1.2 O corte honesto — nada disto cabe numa rodada só

Cada uma das 4 camadas acima tem porte comparável a uma assembleia
inteira já feita neste projeto (Assembleia 05 = sistema de classes,
Assembleia 06 = mapas, Assembleia 07 = itens). Tentar entregar as 4
juntas nesta versão repetiria o erro que a Assembleia 05 já preveniu
uma vez (mudar fórmula/ficha sem testar em mesa). **Proposta de
sequência de versões** (provisória — colide com placeholders já
existentes no roadmap do `CLAUDE.md`, como "v0.9 Combate tático"; a
reordenação final do roadmap fica pra quando o Tiago aprovar isto):

| Versão (provisória) | Entrega | Depende de |
|---|---|---|
| Próxima após itens | **Fundação**: Inteligência (atributo novo) + XP/progressão + catálogo de magias (`src/spells.js`) + desbloqueio automático por limiar de INT. Jogável: magia existe, personagem ganha spell sozinho ao evoluir. | Nada além do que já existe |
| Depois dessa | **Pergaminhos/grimórios**: scroll/grimório como item especial (Assembleia 07), teste de leitura, estado de treino persistido | Fundação + sistema de itens |
| Depois dessa | **Encantamento por jogador**: aplicar spell conhecida como buff temporário em item, fórmula de força/duração por INT/nível de spell | Fundação + pergaminhos (pra ter spells suficientes conhecidas valer a pena) |

Esta assembleia decide **só a primeira linha** (Fundação) — as outras
duas voltam como assembleia própria quando chegar a vez, cada uma com
seu próprio baseline/finalistas, porque cada uma tem decisões de
design que não dá pra prever bem de longe (ex.: dificuldade exata do
teste de leitura só faz sentido calibrar depois de ver a curva de XP
rodando de verdade).

### 1.3 Custo de token — o que cresce, e o que fazer se estourar

Achado importante ao revisar `src/master.js`: **hoje o mestre não
recebe a ficha do personagem re-serializada a cada turno** — ele
acompanha estado (HP, tags, etc.) só pela própria narração no
histórico (`buildMessages`), e `trimHistory` mantém só a abertura +
últimas ~5 trocas. Isso é intencional (mantém o prompt pequeno), mas
tem uma consequência real pra magia: **se "magias conhecidas" não for
reinjetado a cada turno do mesmo jeito que `seedContext` já é, essa
informação literalmente sai da janela de contexto depois de ~5 trocas**
— o mestre "esqueceria" que o personagem aprendeu uma magia 20 turnos
atrás, porque a mensagem onde isso aconteceu já rolou pra fora do
histórico truncado.

**Diferença real em relação aos itens (Assembleia 07)**: o hint de
drop de item é *esporádico* (só quando cai um item) e de custo fixo. A
lista de "magias conhecidas" só cresce ao longo da campanha — é o
primeiro pedaço de contexto deste projeto com **custo não-limitado**
por natureza, o oposto do padrão que `trimHistory`/`mapHint` foram
desenhados pra manter.

**Mitigação proposta** (mesma filosofia de `trimHistory` — janela
limitada, não lista completa):
- Reinjetar, a cada turno, só um **resumo compacto** — nomes das
  magias conhecidas (não descrição/efeito, isso fica no catálogo que o
  código já resolve), no mesmo estilo enxuto de `seedContext`.
- Se a lista de magias conhecidas crescer além de um teto (proposta:
  8-10 nomes), **cortar pras mais recentes/mais usadas**, não mandar a
  lista inteira — o personagem continua "sabendo" as mais antigas (o
  código/ficha tem o registro completo), só param de aparecer no
  prompt até serem relevantes de novo. Análogo ao que `trimHistory` já
  faz com a conversa.
- Estado de treino (quando a camada de pergaminho/grimório existir) só
  precisa aparecer no prompt quando há um treino **em andamento** —
  treinos concluídos ou não iniciados custam zero tokens.
- **Estimativa**: regra de magia (parágrafo fixo, como ÁREA
  REMOTA/REVELAR MISSÃO) + resumo de magias conhecidas (teto de 8-10
  nomes) fica na mesma ordem de grandeza das adições anteriores —
  dezenas a ~150 tokens por turno, não centenas.
- **Se mesmo assim estourar o teto**: o mestre não precisa saber a
  lista completa pra narrar bem — só precisa saber "este personagem
  pode fazer magia" (um resumo ainda mais curto: nível de maestria em
  vez de lista nomeada) e o **código** valida se uma ação específica de
  "Magia" é permitida antes de aceitar a escolha, independente do que
  o mestre presumiu. Isso é o mesmo princípio de 1.4 abaixo aplicado
  como rede de segurança de custo, não só de conteúdo.

### 1.4 Como o mestre narra sem inventar magia/item/nível fora do registro

Mesmo princípio de sempre (mapa, item): **registro de código, mestre
escolhe dentro dele, nunca inventa livremente.**
- `src/spells.js` (estático, como `items.js`/`classes.js`/`seeds.js`):
  catálogo de magias com id, nome, nível, escola, efeito resumido —
  fonte `Relatorio_Pesquisa_RPG.md` §6 (100 magias, SRD 5.1 CC-BY 4.0),
  mesma disciplina de proveniência.
- O mestre nunca decide sozinho se um personagem "aprendeu" uma magia
  nova ou "passou" num teste — ele emite um sinal mínimo (`spellHint`,
  no mesmo padrão de `mapHint`/`itemHint`) e **o código resolve** a
  rolagem real (2d6+INT vs. dificuldade escalada pelo nível da magia) e
  decide o resultado. O mestre só narra o resultado que o código já
  calculou — igual ao padrão já validado pra drop de item.
- Limiares de INT que liberam cada nível de magia ficam em código
  (`window.MWRPG_SPELL_TIERS` ou similar), não em critério livre do
  mestre — evita que a IA "decida" que um personagem já tem INT
  suficiente por narrativa solta.

---

## 2. Consulta individual aos agentes

**Game System Designer** — é quem carrega a decisão mais pesada desta
rodada: **Inteligência precisa ser um 4º atributo novo, não um apelido
pra MNT.** Justificativa: MNT já está sob o orçamento fixo de criação
(soma sempre 6 entre CRP/MNT/ALM); se "inteligência" fosse MNT,
qualquer personagem MNT-alto (a classe Mágica já nasce com MNT=2, não
é nem o atributo mais alto dela) ganharia progressão de magia
atrelada a um número que também rege metade das rolagens gerais do
personagem — confuso e desbalanceado. Proposta: **INT nasce baixa/zero
em todo personagem na criação (fora do orçamento de 6), sobe só por
XP** — não mexe na fórmula canônica (`2d6+CRP/MNT/ALM`), só adiciona um
atributo de progressão separado. **Isso é mudança de ficha e precisa
de aprovação explícita do Tiago antes de qualquer código**, mesma regra
que já vale pra fórmula. Vota pela Fundação sozinha nesta rodada — não
confia em calibrar dificuldade de teste/treino (camadas 2-3) sem ver a
curva de XP rodando antes.

**AI Master Engineer** — repete e reforça a objeção já registrada na
Assembleia 07: o mecanismo de proteção de orçamento da Groq (vencedor
da Assembleia 04) **continua não implementado em produção** — nenhum
limite de turno/custo além do `demo_limit` de sessão. Magia é o
primeiro sistema deste projeto com custo de prompt que cresce sem teto
natural (Seção 1.3) — o mais arriscado até agora pro orçamento. Insiste
que isso não sobe antes do portão da Groq estar pronto, e que a
mitigação de "resumo com teto" da Seção 1.3 é obrigatória, não
opcional, desde a primeira versão da Fundação.

**Backend Engineer** — projeta `character_progress` (xp, nível de INT
atual) e `character_spells` (magias conhecidas, por personagem) desde
já pensando no formato que `spell_training` (camada de pergaminho, mais
pra frente) vai precisar — mesmo raciocínio de "desenhar certo uma vez"
que já defendeu na Assembleia 07. `src/spells.js` estático, sem tabela
pro catálogo em si.

**Narrative Writer** — mesma disciplina de proveniência de sempre
(SRD 5.1 CC-BY 4.0, reescrito no tom do jogo, não colado literal).
Ponto novo: quando a camada de pergaminho/grimório chegar, o "texto que
o personagem lê" precisa ser conteúdo de verdade escrito por ela, não
só metadado — nota isso como custo de conteúdo real da PRÓXIMA fase,
não desta.

**Frontend Engineer** — estende o painel de ficha (já vai ganhar a
lista de inventário na Assembleia 07) com uma segunda lista curta:
magias conhecidas. Sem tela nova, sem barra de progresso de
treino nesta rodada (isso só existe na fase de pergaminho).

**Infra Engineer** — sem objeção de custo de armazenamento; nota que
`character_progress`/`character_spells` são tabelas pequenas,
comparáveis a `characters`.

**Code QA Engineer** — mesmo princípio da Assembleia 07: se o teste de
leitura/treino não está nesta rodada (não está — só entra na próxima
camada), **nenhum código deve fingir que ele roda**. Também: a mudança
de ficha (INT como atributo novo) precisa do mesmo tipo de registro
formal de aprovação que qualquer mudança em `engine.js` já exige — quer
isso documentado explicitamente na aprovação do Tiago, não implícito.

**Test Engineer** — quer a fatia vertical desta rodada testável de
ponta a ponta numa sessão só: personagem ganha XP, cruza o limiar de
INT, desbloqueia uma magia, usa "Magia" em combate, código valida.
Se a Fundação não entregar isso completo (XP até magia usável), não é
uma fatia testável de verdade — vota contra qualquer corte que pare no
meio disso.

**Orchestrator** — confirma a sequência de 3 versões (Seção 1.2),
insiste que a Fundação sozinha só vale a pena se entregar o ciclo
completo que o Test Engineer descreveu (senão é trabalho invisível),
e recomenda que a decisão de ficha do Game System Designer (INT como
4º atributo) seja destacada pro Tiago aprovar separadamente do resto,
por ser a única mudança desta rodada que toca a fórmula canônica.

---

## 3. Síntese — convergência e divergência real

**Convergência forte**: Fundação sozinha nesta rodada (XP+INT+catálogo
+desbloqueio automático); pergaminho/grimório e encantamento de jogador
ficam pra depois; drop/resultado de teste sempre resolvido por código,
nunca decidido livremente pelo mestre; catálogo estático, sem tabela
de conteúdo no banco.

**Divergência real**:
- **AI Master Engineer objeta ao sequenciamento** (mesma objeção da
  Assembleia 07, agora mais forte dado o custo crescente de contexto)
  — quer o portão de orçamento da Groq resolvido antes de qualquer
  código de magia, não só "registrado como risco".
- **Game System Designer isola a decisão de ficha** (INT como atributo
  novo) como algo que precisa aprovação própria do Tiago, separada da
  aprovação geral da assembleia — os outros agentes não se opõem, mas
  também não assumiram essa responsabilidade por ele.

---

## 4. Cinco finalistas

### Finalista 1 — "Só o atributo, sem XP nem magia"
Adiciona INT à ficha, sem mecanismo de progressão nenhum (INT fixa,
definida na criação). Não entrega nada do que o Tiago pediu
("adquiridas por experiência") — inclusa só como piso de comparação.

### Finalista 2 — "INT + XP, sem catálogo de magia ainda"
Atributo + progressão funcionando, mas nenhuma magia existe pra
desbloquear — personagem sobe INT sem ganhar nada tangível. Tecnicamente
mais simples, mas não é uma fatia jogável (Test Engineer votaria
contra).

### Finalista 3 — "Fundação completa: INT + XP + catálogo + desbloqueio automático"
A linha 1 da tabela da Seção 1.2, por inteiro. Ciclo fechado e
testável: personagem evolui, cruza limiar, ganha magia, usa em
combate. Pergaminho/grimório e encantamento ficam de fora, mas nada
do que entra fica pela metade.

### Finalista 4 — "Fundação + pergaminho/grimório na mesma rodada"
Finalista 3 + a segunda camada da Seção 1.2 (leitura/teste/treino)
junto. Contraria diretamente o corte que o próprio Tiago pediu
("não tente entregar tudo") — dependência real (Seção 1.1) significa
que isso só pode ser calibrado depois de ver a Fundação rodando, não
em paralelo.

### Finalista 5 — "Fundação completa, mas catálogo de magia bem pequeno pra começar"
Igual ao Finalista 3, mas com um catálogo inicial pequeno (10-15
magias, não as 100 do relatório de uma vez) — mesmo raciocínio que
venceu a Assembleia 07 pros itens: mecanismo completo, conteúdo
inicial pequeno, expande depois sem nova assembleia.

---

## 5. Votação

| Agente | Voto | Motivo |
|---|---|---|
| Game System Designer | Finalista 5 | Catálogo pequeno dá espaço pra testar a curva de INT/XP em mesa antes de crescer; insiste que a mudança de ficha seja aprovada à parte |
| AI Master Engineer | Finalista 3 ou 5 (indiferente ao tamanho do catálogo) — **com objeção de sequenciamento mantida** | Mecanismo de resumo-com-teto é o que importa; reforça que isso não sobe antes do portão de orçamento da Groq |
| Backend Engineer | Finalista 3 | Prefere não limitar artificialmente o catálogo já que ele é estático e barato de qualquer tamanho — voto vencido, não bloqueante |
| Narrative Writer | Finalista 5 | Catálogo pequeno dá tempo de reescrever cada magia no tom certo |
| Frontend Engineer | Finalista 5 | Lista curta de magias conhecidas é mais fácil de encaixar no painel já lotado (personagem + inventário + magias) |
| Infra Engineer | Finalista 3 ou 5 (indiferente) | Sem preferência de custo relevante |
| Code QA Engineer | Finalista 3 ou 5, nunca 4 | Rejeita Finalista 4 pelo mesmo motivo da Assembleia 07 — nada pode ficar pela metade fingindo funcionar |
| Test Engineer | Finalista 3 ou 5 | Qualquer um entrega a fatia vertical completa e testável; rejeita 1/2 por não fechar o ciclo |
| Orchestrator | **Finalista 5** | Resolve a divergência de tamanho de catálogo a favor do corte mais conservador, sem abrir mão de nenhuma peça mecânica pedida pra esta camada |

**Resultado**: Finalista 5 vence — mesmo padrão de decisão da
Assembleia 07 (mecanismo completo, conteúdo inicial pequeno).

---

## 6. Vencedor — com as objeções incorporadas

**Finalista 5 — Fundação completa (Inteligência + XP + catálogo de
magias + desbloqueio automático), catálogo inicial pequeno (10-15
magias), pergaminho/grimório e encantamento de jogador em versões
próprias mais adiante.**

**Duas condições não-negociáveis incorporadas do voto minoritário**:
1. **Portão de orçamento da Groq primeiro** (AI Master Engineer) — nem
   isto, nem os itens da Assembleia 07, sobem em código antes desse
   mecanismo estar implementado e testado. Já era condição da
   Assembleia 07; fica reafirmada e reforçada aqui, porque magia é o
   sistema de maior risco de custo até agora.
2. **INT como 4º atributo é decisão de ficha e precisa da aprovação
   explícita do Tiago separadamente do resto** (Game System Designer +
   Code QA Engineer) — não é implementada só por esta assembleia ter
   sido aprovada em bloco; precisa de um "sim" específico a essa parte.

### O que entra na próxima versão (Fundação)

- Atributo Inteligência (novo, fora do orçamento de criação de 6,
  sobe só por XP) — **sujeito à condição 2 acima**.
- Mecanismo de XP/progressão — o que conta como XP (missão concluída?
  combate vencido? os dois?) fica como decisão de implementação do
  Game System Designer dentro do que já está aprovado aqui, não
  precisa de nova assembleia só por isso.
- `src/spells.js`: catálogo estático, 10-15 magias, fonte SRD 5.1 (mesma
  proveniência do bestiário/itens), reescritas no tom do jogo.
- `window.MWRPG_SPELL_TIERS`: limiares de INT que liberam cada magia,
  travado em código.
- Desbloqueio automático — o código detecta quando INT cruza um
  limiar e libera a magia, mestre só narra o resultado.
- Resumo compacto de "magias conhecidas" reinjetado a cada turno com
  teto de 8-10 nomes (Seção 1.3), nunca a lista/descrição completa.
- Extensão do painel de ficha com lista de magias conhecidas.

### O que fica pra depois, e por quê

- **Pergaminhos/grimórios** (leitura, teste de conhecimentos gerais +
  INT, treino escalonado por nível) — precisa da Fundação rodando de
  verdade primeiro pra calibrar dificuldade, e precisa do sistema de
  itens (Assembleia 07) já implementado, já que scroll/grimório é item.
- **Encantamento por jogador** (aplicar spell conhecida como buff
  temporário em item, com força/duração por INT/nível) — depende de
  magias conhecidas suficientes pra fazer sentido, então só depois da
  Fundação **e** de pergaminho/grimório terem dado tempo de acumular
  algumas magias em jogo.
- **Expansão do catálogo além das 10-15 iniciais** — tarefa de
  conteúdo contínua, mecanismo já aguenta crescer sem nova assembleia.

---

## Aguardando aprovação do Tiago

Nenhuma pergunta bloqueante nova nesta rodada — as duas da Assembleia
07 já foram respondidas. Duas coisas que precisam do "sim" dele
especificamente antes de qualquer código, já destacadas acima:

1. **Confirma que Inteligência vira um 4º atributo novo** (fora do
   orçamento de criação de 6 entre CRP/MNT/ALM, sobe só por XP), e não
   um apelido/derivação de MNT? É a única mudança desta assembleia que
   toca a ficha canônica.
2. **A reconciliação da Seção 1** (magia inerente promove o degrau só
   até o maior entre origem-do-monstro e presença-de-magia;
   encantamento de jogador nunca muda o degrau) bate com o que você
   tinha em mente pro caso do dragão de gelo, ou você via isso
   diferente?

Fora essas duas, a sequência de 3 versões (Fundação → Pergaminho/
Grimório → Encantamento), o corte da Fundação, e as duas condições não-
negociáveis (portão de orçamento da Groq, aprovação separada da
mudança de ficha) estão propostos e prontos — nada implementado até
você confirmar.

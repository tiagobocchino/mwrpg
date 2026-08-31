# Manual 04 — Email próprio pro login (Brevo SMTP)

**Por que isso é necessário, não opcional**: o serviço de email embutido
do Supabase **não é feito pra usuários reais** — ele só entrega email pra
quem é membro da equipe do projeto Supabase, e mesmo assim com um limite
de **2 emails por hora** (confirmado na documentação oficial do
Supabase, não é achismo). Foi exatamente isso que gerou o erro
"email rate limit exceeded" que você viu. Sem resolver isso, **nenhum
jogador de teste real vai conseguir entrar** — não é sobre volume, é
sobre o mecanismo não funcionar pra ninguém de fora da sua equipe.

**Ordem recomendada:** depois dos Manuais 01-03, antes de convidar
qualquer pessoa de teste pra jogar.

**O que essa credencial destrava:** login funcionando pra qualquer
jogador, não só pra você.

---

## Por que Brevo, não Resend

Pesquisei os dois. O Resend (opção mais comum em tutoriais) só deixa
mandar email pra **você mesmo** até você verificar um domínio próprio
por DNS — e o MWRPG ainda não tem domínio próprio (`vercel.app` não
conta). O Brevo permite verificar um remetente individual (mesmo um
`@gmail.com`) só com um **código de 6 dígitos** enviado pro próprio
email — sem precisar de domínio. É a opção que destrava hoje, não só
"quando tivermos domínio". Quando o projeto tiver domínio próprio, dá
pra melhorar a entregabilidade autenticando o domínio no Brevo depois —
não é retrabalho, é evolução.

---

## Passo a passo

1. **(Criar a conta)** Acesse **brevo.com** → **Sign up free**. Não pede
   cartão de crédito.
2. **(Criar a conta)** Confirme seu email de cadastro (o próprio Brevo
   manda um link de confirmação pra sua caixa de entrada).
3. **(Verificar remetente)** No painel, vá em **Settings** (ou o menu
   com seu nome/engrenagem) → **Senders, Domains & Dedicated IPs** →
   aba **Senders**.
4. **(Verificar remetente)** Clique em **Add a sender** (ou "+ Add new
   sender").
5. **(Verificar remetente)** Preencha **From name** (`MWRPG`, ou
   "Mestre MWRPG" — aparece como remetente no email que o jogador
   recebe) e **From email** (o email que você quer usar como
   remetente — pode ser o mesmo `lixumlabs@gmail.com` que você já
   usou, ou outro).
6. **(Verificar remetente)** O Brevo manda um **código de 6 dígitos**
   pro email do passo 5. Abra a caixa de entrada, copie o código, cole
   na tela do Brevo pra confirmar. Rápido — minutos, não dias.
7. **(Credenciais SMTP)** Ainda no painel, vá em **Settings** →
   **SMTP & API** → aba **SMTP**.
8. **(Credenciais SMTP)** Anote: **Servidor** `smtp-relay.brevo.com`,
   **Porta** `587`, **Login** = o email da sua conta Brevo (não
   confunda com o remetente do passo 5 — pode ser o mesmo email, mas
   esse campo aqui é sempre o da conta), e **Senha** = clique em
   **Generate a new SMTP key** (ou copie uma existente). Essa chave
   **não** é sua senha da conta nem uma API key — é uma credencial só
   pra SMTP. Copie sem espaço extra no início/fim.
9. **(Configurar no Supabase)** No painel do Supabase (o mesmo projeto
   do Manual 02) → **Authentication** → **Emails** (ou **Sign In /
   Providers** → procure "SMTP Settings").
10. **(Configurar no Supabase)** Ative **Enable Custom SMTP** e
    preencha: **Sender email** = o email verificado nos passos 5-6;
    **Sender name** = `MWRPG`; **Host** = `smtp-relay.brevo.com`;
    **Port** = `587`; **Username** = o login da conta Brevo (passo 8);
    **Password** = a chave SMTP gerada no passo 8 — **cole só aqui,
    nunca no chat comigo**.
11. **(Configurar no Supabase)** Salve. O Supabase testa a conexão —
    se der erro aqui, veja "Erros comuns" abaixo.
12. **(Opcional, recomendado)** Em **Authentication** → **Rate
    Limits**, confira o limite de emails por hora (com SMTP próprio o
    padrão sobe pra 30/hora — dá pra aumentar mais, mas 300/dia é o
    teto real do Brevo free).

---

## O que NUNCA fazer

- A **chave SMTP** do Brevo e a senha/API key da conta: nunca colar
  aqui no chat comigo, nem em nenhum arquivo do repositório — só no
  campo de senha do Supabase.
- Login da conta Brevo (email): esse pode aparecer em texto normal sem
  problema (não é segredo), mas evite colar por hábito de higiene.

---

## Verificação

- Você entra no jogo (`mwrpg-one.vercel.app`), pede o link mágico com
  um email seu de verdade, e o email **chega** (confira spam também).
- Testando com um segundo email (de outra pessoa, ou uma conta sua
  secundária) — esse também recebe. Esse é o teste que prova que não é
  mais "só a equipe" — é o ponto central de todo esse manual.
- No painel do Brevo, em **Statistics** → **Transactional**, aparece o
  envio recente.

## Sobre os avisos "DKIM: Padrão" e "DMARC: domínio Freemail não é recomendado"

Depois de verificar o remetente (passo 6), o painel do Brevo mostra dois
avisos amarelos — são esperados, não um sinal de que algo deu errado:

- **DKIM: Padrão** — o Brevo assina com a própria chave dele, não uma
  específica pro seu domínio (porque `gmail.com`/`hotmail.com`/etc. não
  é um domínio que você controla o DNS).
- **DMARC: domínio Freemail não é recomendado** — desde 2026 o Gmail
  reforçou a fiscalização de DMARC e recomenda **não usar endereço
  pessoal gratuito como remetente de email transacional via terceiro**.

**O que isso significa na prática, sem exagerar nem minimizar**: o
Gmail passou a **rejeitar de vez** quem descumpre isso, mas essa regra
dura vale pra quem manda 5.000+ emails/dia — não é o nosso caso na fase
de teste. No nosso volume, o risco real é a mensagem **cair mais na
caixa de spam**, principalmente quando quem recebe também é Gmail.

**Dá pra usar assim mesmo pra começar.** Só avise os testers a
conferirem spam na primeira vez (já está na seção Verificação acima). A
solução definitiva — verificar um remetente num domínio próprio do
projeto — fica pra quando o MWRPG tiver domínio; trocar o "Sender
email" depois é rápido, não é retrabalho.

## Erros comuns

- **Supabase recusa salvar as configurações de SMTP** — confira porta
  (587) e se copiou a chave SMTP sem espaço/quebra de linha extra.
- **Email não chega, sem erro nenhum aparente** — confira a caixa de
  spam primeiro; se não estiver lá, confira em Brevo → Statistics se o
  envio sequer saiu (se não saiu, o problema é a config do Supabase; se
  saiu mas não chegou, pode ser filtro do provedor de quem recebe).
- **"Sender not verified"** — o email configurado como "Sender email"
  no Supabase (passo 10) precisa ser exatamente o mesmo que você
  verificou no passo 5-6, letra por letra.
- **Continua batendo em rate limit mesmo depois de configurar** — volte
  no passo 12 e confirme que o limite em Authentication → Rate Limits
  realmente subiu (às vezes fica salvo o valor antigo até um refresh).

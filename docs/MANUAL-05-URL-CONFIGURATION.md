# Manual 05 — Site URL, Redirect URLs e template do email (Supabase)

**Por que isso é necessário, não opcional**: o link mágico voltou
apontando pra `http://localhost:3000` — não é bug de código, é
configuração. O Supabase só usa a URL que o código pede
(`emailRedirectTo`, já implementado em `src/auth.js`) **se ela estiver
na lista de permissões**; se não estiver, ele ignora silenciosamente e
usa o "Site URL" salvo no painel, que por padrão vem `localhost:3000` —
o valor de fábrica de qualquer projeto novo. Sem corrigir isso, **todo
jogador real** que clicar no link vai cair numa tela de erro de conexão,
não só você.

**Ordem recomendada:** agora, antes de qualquer teste novo de login —
sem isso, o link mágico não serve pra nada em produção.

**O que essa correção destrava:** o link do email levar pra
`mwrpg-one.vercel.app` (produção) quando o pedido veio de lá, e pra
`localhost:8000` quando o pedido veio do seu teste local — sem precisar
trocar nada toda vez que alternar entre os dois.

---

## Parte 1 — Site URL e Redirect URLs

1. No painel do Supabase (o mesmo projeto do Manual 02), vá em
   **Authentication** → **URL Configuration** (barra lateral esquerda,
   dentro da seção Authentication).
2. No campo **Site URL**, troque `http://localhost:3000` por
   `https://mwrpg-one.vercel.app`. Esse é o destino padrão usado sempre
   que nenhum `emailRedirectTo` bater com a lista de permissões — então
   ele precisa ser a produção, não o localhost.
3. Em **Redirect URLs**, adicione (uma por linha, ou pelo botão
   "Add URL", dependendo da versão do painel):
   - `https://mwrpg-one.vercel.app/**`
   - `http://localhost:8000/**`
4. Salve. Não precisa mexer em mais nada nessa tela.

**Por que os dois com `/**` no final**: o `**` é um coringa oficial do
Supabase pra "qualquer coisa depois disso" — cobre o `#access_token=...`
e outros parâmetros que o próprio Supabase gruda na URL de volta, sem
precisar cadastrar cada variação manualmente. `localhost:8000` é a porta
real que uso quando testo local (servidor Python `http.server`) — se um
dia eu rodar noutra porta, aviso pra você adicionar aqui também.

## Parte 2 — Template do email em português (DOIS templates, não um)

**Achado real (31/08/2026, depois de editar só um e o email continuar
chegando em inglês)**: o `signInWithOtp` — a chamada que dispara o
login por email deste jogo (`src/auth.js`) — pode acionar **dois**
templates diferentes do Supabase, dependendo do estado da conta:
**"Confirm sign up"** (fluxo interno de primeira confirmação de conta)
ou **"Magic link or OTP"** (fluxo de login recorrente). Os dois usam a
mesma variável de link (`{{ .ConfirmationURL }}`) e o mesmo caminho no
painel, mas são registros **completamente independentes** — editar um
não edita o outro, e o Supabase decide qual dispara sem avisar o
jogador nem o painel.

**Correção deste manual (versão anterior estava incompleta)**: a
instrução original dizia pra editar só o "Magic Link", presumindo que
era o único usado — errado. **Edite os dois**, com o mesmo conteúdo
(ajustado no primeiro parágrafo pra cada contexto) — isso elimina o
problema de vez, sem precisar adivinhar qual vai disparar da próxima
vez.

1. **Authentication** → **Email Templates** (mesma seção da Parte 1).
2. Selecione o template **Confirm sign up**.
3. Campo **Subject** — apague e cole:

```
Confirme seu email — bem-vindo a Ys
```

4. Campo do corpo (editor HTML) — apague e cole:

```html
<h2>A Coroa Enterrada de Ys</h2>
<p>Penmarc'h aguarda — falta só confirmar seu email pra sua campanha começar.</p>
<p>Clique no link abaixo para confirmar e entrar:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar e entrar em Ys</a></p>
<p>Se você não pediu este link, ignore este email sem preocupação.</p>
```

5. Salve. **Recarregue a página** do painel depois de salvar e confira
   que o texto em português continua lá — é o jeito mais simples de
   confirmar que o "Save" pegou de verdade, não só pareceu pegar.
6. Agora selecione o template **Magic Link or OTP** (pode aparecer só
   como "Magic Link", dependendo da versão do painel).
7. Campo **Subject** — apague e cole:

```
Seu link para entrar em Ys
```

8. Campo do corpo (editor HTML) — apague e cole:

```html
<h2>A Coroa Enterrada de Ys</h2>
<p>A maré trouxe seu convite de volta.</p>
<p>Clique no link abaixo para entrar na sua campanha. Ele vale por pouco tempo — não demore:</p>
<p><a href="{{ .ConfirmationURL }}">Entrar em Ys</a></p>
<p>Se você não pediu este link, ignore este email sem preocupação.</p>
```

9. Salve, e recarregue de novo pra confirmar.

`{{ .ConfirmationURL }}` é a variável do próprio Supabase nos dois
templates — não trocar por nada, é ela que carrega o link de verdade
(já com o redirect certo, depois da Parte 1).

**Sobre o remetente "MWRPG via brevosend.com"** — isso é esperado, não
um bug novo: já registrado no `docs/MANUAL-04-EMAIL-SMTP.md` (avisos de
DKIM/DMARC) — acontece porque o domínio do remetente ainda não tem
autenticação DNS própria. Não afeta o conteúdo do email, só a linha de
remetente.

**Login por senha não manda email nenhum** — isso continua verdade;
os dois templates acima cobrem 100% dos emails que este jogo manda
hoje. Se no futuro entrar reset de senha ou confirmação de troca de
email, volto aqui pra adicionar a tradução desses também (são
templates novos, "Reset Password" e "Change Email Address").

## Parte 3 — Versionar o template no repositório (fora do painel)

O painel do Supabase não tem histórico nem controle de versão — é por
isso que a Parte 2 se perdeu na primeira vez. Duas camadas de proteção
contra isso acontecer de novo:

**1) Fonte de verdade versionada no repositório** — os dois templates
acima também estão salvos em `supabase/templates/confirm-signup.html`
e `supabase/templates/magic-link.html`. Se o painel voltar a mostrar o
texto em inglês, o conteúdo certo pra colar está sempre aqui, versionado
no git, não só na memória de quem editou da última vez.

**2) `supabase/config.toml`, só pra projeto local (não sincroniza com
produção)** — confirmado na documentação oficial do Supabase: dá pra
apontar cada template pra um arquivo `.html` local via
`[auth.email.template.confirmation]` (é essa a chave do "Confirm
sign up") e `[auth.email.template.magic_link]`, cada um com `subject`
e `content_path`. **Mas isso só vale rodando `supabase start` local** —
a documentação oficial é explícita: *"For hosted projects managed by
Supabase, copy the templates into the Email Templates section of the
Dashboard"* — não existe comando de CLI que aplique isso direto na
produção hospedada. Não vale a pena criar o `config.toml` agora (o
projeto não usa a CLI do Supabase pra mais nada), mas os arquivos
`.html` já ficam prontos em `supabase/templates/` caso isso mude no
futuro — copiar e colar continua sendo o processo real hoje, mesma
disciplina já usada pra rodar `supabase/schema.sql` manualmente.

---

## Verificação

- Pedir um link mágico novo em produção (`mwrpg-one.vercel.app`) — o
  email chega em português, com o assunto novo, e o link abre a própria
  produção, não localhost.
- Pedir um link mágico rodando local (`localhost:8000`) — o link deve
  voltar pra `localhost:8000`, não pra produção nem pra `:3000`.
- Um link não clicado em ~1h deve continuar dando erro (`otp_expired`) —
  isso é esperado e correto, não é o bug que estamos corrigindo aqui.
  Peça um link novo e clique rápido pra testar de verdade.

## Erros comuns

- **Link continua indo pra `localhost:3000` depois de salvar** — confira
  se salvou mesmo (o Supabase às vezes exige clicar fora do campo antes
  do botão Salvar ativar). Recarregue a tela de URL Configuration e
  confirme que o valor novo persistiu.
- **Erro "Invalid Redirect URL" ao tentar entrar** — a URL de onde você
  está rodando o jogo não bate com nenhuma entrada da lista da Parte 1.
  Confirme a origem exata (protocolo + domínio + porta) e adicione com
  `/**` no final.
- **Template não parece ter mudado no email recebido** — confira se
  clicou "Save" no template certo (existem vários templates diferentes
  na mesma tela — Magic Link, Change Email, Reset Password etc.) e
  aguarde alguns segundos antes de pedir o próximo link.
- **Editei o "Magic Link" e o email continuou em inglês** (achado real,
  31/08/2026) — você editou só um dos dois templates que o login deste
  jogo pode disparar. Confira também o **"Confirm sign up"** — ver
  Parte 2. Editar os dois resolve de vez, sem precisar adivinhar qual
  vai disparar da próxima vez.
- **Remetente aparece como "MWRPG via brevosend.com"** — esperado, não
  é bug (Manual 04, avisos de DKIM/DMARC). Não precisa mexer em nada.

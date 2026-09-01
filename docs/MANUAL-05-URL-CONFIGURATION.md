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

## Parte 2 — Template do email em português

O template atual é o padrão do Supabase, em inglês ("Your sign-in
link..."). Texto pronto abaixo, no tom do jogo (direto, sem
prolixidade — mesma régua do Mestre IA).

1. **Authentication** → **Email Templates** (mesma seção da Parte 1).
2. Selecione o template **Magic Link**.
3. Campo **Subject** — apague e cole:

```
Seu link para entrar em Ys
```

4. Campo do corpo (editor HTML) — apague e cole:

```html
<h2>A Coroa Enterrada de Ys</h2>
<p>A maré trouxe seu convite de volta.</p>
<p>Clique no link abaixo para entrar na sua campanha. Ele vale por pouco tempo — não demore:</p>
<p><a href="{{ .ConfirmationURL }}">Entrar em Ys</a></p>
<p>Se você não pediu este link, ignore este email sem preocupação.</p>
```

5. Salve. `{{ .ConfirmationURL }}` é a variável do próprio Supabase — não
   trocar por nada, é ela que carrega o link de verdade (já com o
   redirect certo, depois da Parte 1).

**Não mexer em mais nenhum template agora** — só o "Magic Link" está em
uso hoje (login por senha não manda email nenhum). Se no futuro entrar
reset de senha ou confirmação de troca de email, volto aqui pra
adicionar a tradução desses também.

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

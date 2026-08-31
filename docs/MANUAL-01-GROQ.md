# Manual 01 — Criar conta e chave da Groq

**Produção:** https://mwrpg-one.vercel.app/ — depois de colar a chave na
Vercel (Manual 03), teste jogando um turno ali; se a narração não vier
"nova" (cair em "Modo offline..."), veja "Erros comuns" no Manual 03.

**Ordem recomendada:** faça este primeiro (é o mais rápido), depois o
Manual 02 (Supabase), depois o Manual 03 (Vercel) — a chave da Groq e
as chaves do Supabase são coladas na Vercel no final.

**O que essa credencial destrava:** o Mestre IA passa a narrar de
verdade (hoje, sem ela, o jogo cai em modo offline com mensagens
guiadas).

---

## Passo a passo

1. Acesse **console.groq.com** no navegador.
2. Crie a conta — é grátis, **sem pedir cartão de crédito**. Pode entrar
   com Google/GitHub ou email.
3. Depois de logado, vá direto pra página de chaves: **console.groq.com/keys**
   (ou procure no menu lateral algo como "API Keys").
4. Clique no botão de criar uma chave nova (algo como **"Create API
   Key"**). Vai pedir um nome pra identificar a chave — pode colocar
   `mwrpg` ou `mwrpg-producao`.
5. A chave só aparece **uma vez**, na hora que você cria. Copie ela
   imediatamente (tem um botão de copiar do lado) e cole num lugar
   seguro temporário (ex.: um bloco de notas que você vai fechar depois)
   — você vai colar ela de novo daqui a pouco, no Manual 03 (Vercel).
   Se fechar a tela sem copiar, não tem como recuperar — só apagar essa
   e criar outra.

> Não tenho 100% de certeza do texto exato do botão de criar chave
> (interfaces mudam) — se não achar "Create API Key", procure por algo
> equivalente tipo "New key" ou um botão "+" perto da lista de chaves.

---

## O que NUNCA fazer

- **Nunca** cole essa chave aqui no chat comigo, nem em qualquer
  documento que não seja o painel da própria Vercel.
- **Nunca** commite ela num arquivo do repositório (`.env`, código,
  etc.) — se isso acontecer sem querer, a chave precisa ser revogada e
  recriada imediatamente.
- É seguro: guardar ela num gerenciador de senhas, ou colar direto no
  painel de variáveis de ambiente da Vercel (Manual 03).

---

## Verificação

- Você tem uma chave copiada, começando com algo como `gsk_...`.
- Na página `console.groq.com/keys`, sua chave aparece listada (o valor
  em si fica oculto depois de criada — só o nome e talvez os últimos
  caracteres aparecem, isso é normal).

## Erros comuns

- **Pediu cartão de crédito** — não deveria pedir pro tier gratuito. Se
  pedir, pare e me avise antes de continuar; pode ser um fluxo diferente
  do esperado.
- **Fechou a tela e perdeu a chave** — sem problema, é só voltar em
  `console.groq.com/keys`, apagar a chave sem valor e criar outra.
- **Não sabe se copiou certo** — a chave da Groq geralmente começa com
  `gsk_`. Se o que você copiou não parece com isso, volte e confira.

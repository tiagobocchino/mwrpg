# Manual 03 — Conectar a Vercel e fazer o primeiro deploy

**Ordem recomendada:** faça por último — este manual pede as chaves
que você já deve ter em mãos dos Manuais 01 (Groq) e 02 (Supabase).

**O que essa credencial/passo destrava:** existir, pela primeira vez,
uma **URL de produção de verdade** pro MWRPG. Até agora só testei local
— o ciclo de trabalho (commit → push → testar em produção) depende
disso existir.

---

## Antes de começar — o que você vai colar aqui

| Variável | De onde vem | Valor de exemplo |
|---|---|---|
| `GROQ_API_KEY` | Manual 01 | `gsk_...` |
| `SUPABASE_URL` | Manual 02 | `https://xxxxx.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Manual 02 (chave "pública"/`anon`) | `sb_publishable_...` |
| `SUPABASE_SECRET_KEY` | Manual 02 (chave "secreta"/`service_role`) | `sb_secret_...` |

As duas últimas do Supabase ainda não são usadas pelo código (isso é da
Fase 2, que ainda vou construir) — mas cadastrar agora evita repetir
esse passo depois.

---

## Passo a passo

1. Acesse **vercel.com** e clique em **Sign Up** (ou "Log In" se já
   tiver conta).
2. Escolha **Continue with GitHub** e autorize — é a forma mais direta
   de conectar o repositório `tiagobocchino/mwrpg`.
3. Depois de logado, vá em **vercel.com/new** (ou clique em algo como
   **"Add New..." → "Project"** no painel).
4. Na lista de repositórios do GitHub, procure **`tiagobocchino/mwrpg`**
   e clique em **Import**.
   - Se o repositório não aparecer na lista, a Vercel pode estar
     mostrando só alguns repos por padrão — procure um link tipo
     "Adjust GitHub App Permissions" pra dar acesso a esse repo
     específico.
5. Na tela de configuração do projeto (antes de deployar):
   - **Framework Preset**: mude pra **"Other"** (é HTML puro, sem
     framework).
   - **Build Command**: deixe **vazio** (ou desmarque o override, se
     houver um toggle).
   - **Output Directory**: deixe **vazio**, ou coloque `.` (ponto) se
     pedir algo.
   - **Install Command**: deixe **vazio**.
6. Antes de clicar em Deploy, abra a seção **Environment Variables**
   (nessa mesma tela de configuração, ou em Project Settings depois —
   as duas telas existem, use a que aparecer primeiro). Adicione as 4
   variáveis da tabela acima, uma por vez: cole o **Name** (nome exato
   da tabela) e o **Value** (o que você copiou nos manuais anteriores).
   Deixe marcado pra aplicar em **Production** (e Preview/Development
   também, se a tela perguntar — não atrapalha).
7. Clique em **Deploy**.
8. Espere o build terminar (deve ser rápido, é site estático). Ao
   final, a Vercel mostra a **URL de produção** — algo como
   `mwrpg.vercel.app` ou `mwrpg-<hash aleatório>.vercel.app`.

---

## O que NUNCA fazer

- As 4 variáveis da tabela: cole **só** no campo de Environment
  Variables da Vercel. Nunca aqui no chat comigo, nunca em nenhum
  arquivo do repositório.
- Se algum dia precisar me mostrar que configurou certo, me mande só o
  **nome** da variável e confirmação de que tem valor — nunca o valor
  em si.

---

## Verificação

- A Vercel mostra uma URL de produção funcionando (não erro 404/500).
- Abrindo a URL, o jogo carrega (tela inicial "MWRPG — A Coroa
  Enterrada de Ys").
- Jogue um turno: se o Mestre IA responder com narração nova (não a
  mensagem "(Modo offline...)"), a Groq está funcionando de ponta a
  ponta. Se cair no modo offline mesmo com a chave configurada, me avise
  — nesse ponto eu assumo e investigo (pode ser nome de variável
  digitado diferente do esperado, por exemplo).

## Erros comuns

- **Repositório não aparece na lista de import** — falta autorizar a
  Vercel a acessar aquele repo específico no GitHub (passo com
  "Adjust GitHub App Permissions").
- **Build falhou** — como não deveria ter build nenhum (Build Command
  vazio), se der erro aqui provavelmente o Framework Preset não ficou
  em "Other". Volte em Project Settings → General e confira.
- **Deploy funcionou mas o jogo cai em modo offline** — confira em
  Project Settings → Environment Variables se `GROQ_API_KEY` está
  exatamente com esse nome (maiúsculas, sem espaço) e se tem valor
  preenchido. Depois de corrigir, é preciso fazer um novo deploy (um
  redeploy, ou um novo push) pra variável valer — mudar a variável
  sozinha não atualiza um deploy que já existe.
- **URL de produção pede login/mostra tela da Vercel em vez do jogo** —
  pode ser "Deployment Protection" ativado por padrão em contas novas;
  procure essa opção em Project Settings → Deployment Protection e
  desative pra esse projeto (o jogo é público, não precisa dessa
  proteção).

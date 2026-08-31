# Manual 02 — Criar (recriar) o projeto Supabase

**Produção:** https://mwrpg-one.vercel.app/ — as chaves daqui são
coladas na Vercel (Manual 03) junto com a da Groq.

**Ordem recomendada:** faça depois do Manual 01 (Groq), antes do Manual
03 (Vercel) — as chaves daqui também são coladas na Vercel no final.

**O que essa credencial destrava:** hoje o MWRPG ainda não usa Supabase
em código (é a Fase 2 do projeto: contas de jogador, salas e
personagens salvos em nuvem). Criar o projeto agora adianta o terreno —
nada quebra por criar cedo.

---

## Importante: você está RECRIANDO — o que se perde

Se você já teve um projeto Supabase associado a este projeto antes (ou
a qualquer coisa que planeje reaproveitar), recriar do zero significa:

- **URL e chaves novas.** As antigas (se existirem) param de funcionar
  assim que você as trocar em qualquer lugar que as usava.
- **Dados antigos não vêm junto.** Um projeto novo nasce com banco
  vazio — nenhuma tabela, nenhuma linha, nenhum usuário de autenticação
  do projeto anterior é migrado automaticamente. Se havia algo lá que
  você queria manter, seria preciso ter exportado antes (dump do banco).
  Como o MWRPG ainda não gravou nada de produção no Supabase (a
  integração de código nem existe ainda), **não há perda real de dados
  do jogo neste momento** — só se você tinha algo de outro uso desse
  projeto especificamente.
- **Qualquer lugar que colou a chave antiga precisa ser atualizado**
  (nesse caso, só a Vercel — Manual 03 — já que o MWRPG não tinha
  Supabase configurado em lugar nenhum ainda).

Se você **não** tinha nenhum projeto Supabase antes especificamente pro
MWRPG, ignore esta seção e siga direto pro passo a passo — é só "criar",
não "recriar" de fato.

---

## Passo a passo

1. Acesse **supabase.com** e entre na conta (ou crie uma — grátis, dá
   pra usar login com GitHub).
2. No painel (dashboard), clique no botão **"New Project"**.
3. Escolha a **Organização** (se você não tem nenhuma ainda, o Supabase
   pede pra criar uma primeiro — pode usar seu nome ou "Tiago" mesmo,
   não afeta nada tecnicamente).
4. Preencha:
   - **Name** (nome do projeto): sugestão `mwrpg`.
   - **Database Password**: crie uma senha forte. **Anote essa senha
     num lugar seguro** — ela não é a mesma coisa que as chaves de API
     que você vai usar no código, mas é necessária se algum dia precisar
     conectar direto no banco (ex.: via `psql` ou uma ferramenta de
     administração). Se perder, dá pra resetar depois nas configurações
     do projeto, mas evite depender disso.
   - **Region**: escolha a mais perto de onde os jogadores de teste
     estão (ex.: `South America (São Paulo)` se existir essa opção, ou
     a região mais próxima disponível).
   - **Plano**: deixe no **Free** (é o que a Assembleia 02 recomendou
     manter, dado o volume esperado de teste).
5. Clique em criar / confirmar. A criação leva 1-2 minutos (o Supabase
   está provisionando o banco).
6. Depois de criado, vá em **Settings** (ícone de engrenagem, geralmente
   no menu lateral) → **API Keys** (pode aparecer como "API" dependendo
   da versão da interface).
7. Anote três coisas dessa tela:
   - **Project URL** (algo como `https://xxxxx.supabase.co`).
   - A chave pública — hoje o Supabase chama de **"Publishable key"**
     (formato `sb_publishable_...`). Em interfaces mais antigas/na aba
     **"Legacy API Keys"** ela pode aparecer como **`anon` key** — são
     equivalentes para esse propósito, use a que a tela principal
     mostrar primeiro.
   - A chave secreta — hoje chamada **"Secret keys"** (formato
     `sb_secret_...`), antigamente **`service_role`** key (mesma
     equivalência da anterior).

> Não tenho certeza absoluta de que a tela vai mostrar exatamente
> "Publishable key" / "Secret keys" no momento em que você fizer isso —
> o Supabase renomeou essas chaves recentemente e pode haver variação.
> Se aparecer `anon` / `service_role` em vez desses nomes novos, são a
> mesma coisa — use a "pública/anon" onde eu pedir a pública, e a
> "secreta/service_role" onde eu pedir a secreta.

8. **Novo passo (login + persistência, v0.4)**: no menu lateral, vá em
   **SQL Editor** → **New query**. Abra o arquivo `supabase/schema.sql`
   deste repositório (no GitHub, ou peça pra eu te mandar o conteúdo),
   cole o SQL inteiro na caixa, e clique em **Run** (ou "RUN", geralmente
   um botão verde). Isso cria as tabelas `characters` e
   `campaign_sessions` com a proteção de acesso (RLS) já configurada —
   sem isso, o login funciona mas o jogo não tem onde salvar a campanha.
9. **Habilitar o link mágico**: vá em **Authentication** → **Providers**
   (ou **Sign In / Providers**) e confirme que **Email** está habilitado
   com a opção de "magic link"/OTP — costuma vir habilitado por padrão
   num projeto novo, mas confira.

---

## O que NUNCA fazer

- A **Secret key / service_role** é equivalente a uma senha mestra do
  banco inteiro — **nunca** cole ela aqui no chat comigo, nem em
  qualquer lugar que não seja o painel de variáveis de ambiente da
  Vercel.
- A **Publishable key / anon** é segura de ficar exposta no navegador
  (é feita pra isso) — mas ainda assim, evite colar ela aqui no chat só
  por organização; prefira colar direto na Vercel.
- **Nunca** commite a senha do banco, a URL, ou qualquer uma das duas
  chaves em código.

---

## Verificação

- Você tem anotados: Project URL, Publishable/anon key, Secret/
  service_role key, e a senha do banco (separada, guardada à parte).
- O painel do projeto mostra status "Active"/"Healthy" (não "Paused" ou
  "Provisioning").
- Em **Table Editor**, aparecem as tabelas `characters` e
  `campaign_sessions` (depois de rodar o `schema.sql`).

## Erros comuns

- **Projeto ficou "Paused" logo de cara** — não deveria acontecer num
  projeto recém-criado; se acontecer, pode ser limite de projetos
  simultâneos da conta free (2 projetos ativos por conta) — pausar um
  projeto antigo libera espaço pra um novo.
- **Não achou "API Keys" no menu** — procure em **Project Settings**
  (não confundir com as configurações da conta/organização) — geralmente
  é o ícone de engrenagem específico daquele projeto, não o global.
- **Esqueceu a senha do banco** — normal, ela é usada com pouca
  frequência. Dá pra resetar em Settings → Database → Reset Database
  Password, sem perder dados.

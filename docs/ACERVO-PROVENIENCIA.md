# Acervo de Domínio Público — Registro de Proveniência

Cada peça do acervo (`src/acervo.js`) tem que ter uma linha aqui antes de
entrar em produção. Regra do `docs/METODO-PLANEJAMENTO.md` e checklist do
Code QA Engineer (`.claude/agents/code-qa-engineer-mwrpg.md`): nenhum
conteúdo protegido entra por descuido.

## Regras de licença aplicadas (verificadas com fonte real, Assembleia 02)

- **Project Gutenberg**: textos em domínio público nos EUA; redistribuir
  sem fins comerciais não exige permissão, com ou sem a marca "Project
  Gutenberg". Fonte: [gutenberg.org/policy/license.html](https://www.gutenberg.org/policy/license.html)
- **Domínio Público (Brasil)**: obra entra em domínio público 70 anos
  após 1º de janeiro do ano seguinte à morte do autor (Lei 9.610/98).
  Folclore de tradição oral sem autor identificável não tem prazo de
  proteção patrimonial aplicável.
- **Nuance aplicada em toda entrada de mitologia/fábula**: quando a fonte
  é um livro específico (ex.: Bulfinch's Mythology), **não copiamos a
  prosa do livro** — o `resumoJogavel` é redação própria, baseada no mito
  em si (que é domínio público independente de qualquer edição
  específica). Isso evita qualquer dúvida sobre direito de tradução ou
  edição de um editor/tradutor específico ainda protegido.
- **SRD 5.1**: ainda não usado neste acervo v1 (só fábula/mitologia/
  folclore até aqui). Se/quando entrar conteúdo do SRD, registrar aqui
  com a ressalva: nomes como "Beholder"/"Mind Flayer" aparecem no texto
  CC-BY 4.0, mas a mecânica/stat block deles continua protegida — não
  usar esses dois especificamente, mesmo citando o nome.

## Entradas

| id | Categoria | Fonte | Obra | URL | Base legal |
|---|---|---|---|---|---|
| `fabula-raposa-cabra-poco` | Situação | Fábula grega (Esopo) | Aesop's Fables | [gutenberg.org/files/21](https://www.gutenberg.org/files/21/21-h/21-h.htm) | Domínio público (EUA) — PG #21 |
| `fabula-leao-doente` | Situação | Fábula grega (Esopo) | Aesop's Fables | [gutenberg.org/files/21](https://www.gutenberg.org/files/21/21-h/21-h.htm) | Domínio público (EUA) — PG #21 |
| `fabula-lobo-cordeiro` | Situação | Fábula grega (Esopo) | Aesop's Fables | [gutenberg.org/files/21](https://www.gutenberg.org/files/21/21-h/21-h.htm) | Domínio público (EUA) — PG #21 |
| `mito-quimera` | Monstro | Mito grego clássico | Bulfinch's Mythology (referência, não copiado) | [gutenberg.org/ebooks/3327](https://www.gutenberg.org/ebooks/3327) | Domínio público — PG #3327 |
| `mito-minotauro` | Monstro | Mito grego clássico | Bulfinch's Mythology (referência, não copiado) | [gutenberg.org/ebooks/3327](https://www.gutenberg.org/ebooks/3327) | Domínio público — PG #3327 |
| `folclore-curupira` | Monstro | Folclore brasileiro (tradição oral) | — (sem coletânea específica citada, redação própria) | [dominiopublico.gov.br](https://www.dominiopublico.gov.br/) | Tradição oral, sem autor/prazo aplicável |

## Próximos passos (não feito ainda)

- Expandir pra mais categorias: PNJs/arquétipos, masmorras completas,
  chefes adicionais.
- Considerar mais folclore brasileiro (Boitatá, Iara, Saci) com a mesma
  disciplina de redação própria.
- Avaliar entrada de conteúdo SRD 5.1 quando fizer sentido pra regras
  mecânicas (ainda não necessário — o acervo v1 é só inspiração
  narrativa, o `engine.js` já cobre a mecânica).

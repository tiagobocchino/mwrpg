// Vercel Serverless Function — POST /api/master
// Proxy pro Mestre IA via Groq. A GROQ_API_KEY nunca chega no cliente —
// existe só aqui, como variável de ambiente do servidor (configurar no
// painel da Vercel: Project Settings -> Environment Variables).
//
// Recebe { messages: [{role, content}, ...] } já montado pelo cliente
// (src/master.js -> buildGroqMessages) e devolve { text } com o texto
// bruto da resposta do modelo (o cliente já sabe parsear o JSON do
// contrato do mestre em src/master.js -> parseResponse).

const GROQ_MODEL = 'openai/gpt-oss-120b'; // substituto oficial do llama-3.3-70b-versatile (deprecado 16/ago/2026)

// === Portão de orçamento de token (v0.8 Fase 0 — Assembleia 04, condição
// não-negociável reafirmada nas Assembleias 07/08) ===
// Teto real do free tier da Groq pro modelo acima, verificado ao vivo em
// 04/09/2026 (console.groq.com/docs/rate-limits — nunca de memória):
// 30 RPM, 1.000 RPD, 8.000 TPM, 200.000 TPD, tudo POR ORGANIZAÇÃO, não
// por jogador. TPD é o limite que estoura primeiro na prática (a ~2.850
// tokens/turno estimados, 200k TPD esgota bem antes de bater em RPD/RPM).
// Este mecanismo protege TPD; RPM/TPM continuam cobertos só pelo 429
// reativo da própria Groq (já tratado abaixo) — não fazia parte do
// desenho aprovado adicionar proteção de burst por minuto agora.
const GROQ_TPD_LIMIT = 200000;
// Margem de segurança: bloqueia a 90% do teto diário. Não é medido de
// verdade ainda (não existia contador nenhum até este commit) — é um
// número de partida deliberadamente conservador; a Assembleia 04 deixou
// esse número em aberto "pra decidir com dado real medido", e o dado
// real só existe depois deste mecanismo estar rodando. Revisar depois de
// alguns dias de uso real medido.
const GROQ_TPD_SAFE_LIMIT = Math.floor(GROQ_TPD_LIMIT * 0.9);

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

// Lê o total de tokens já gastos hoje. Falha ABERTA (deixa a chamada
// seguir) se o Supabase estiver fora do ar ou mal configurado — este
// contador protege orçamento, não dado sensível de usuário; travar o
// jogo inteiro por causa de uma falha transitória de leitura seria
// desproporcional. O 429 real da própria Groq continua como rede de
// segurança final em qualquer cenário.
async function readTodayUsage() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  try {
    const r = await fetch(
      `${url}/rest/v1/groq_usage_daily?usage_date=eq.${todayUtc()}&select=tokens_used`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!r.ok) return null;
    const rows = await r.json();
    return rows && rows[0] ? Number(rows[0].tokens_used) || 0 : 0;
  } catch (e) {
    console.error('readTodayUsage failed', e);
    return null;
  }
}

// Grava o consumo real da chamada que acabou de responder (usage.total_tokens
// da própria Groq — confirmado ao vivo em 04/09/2026 que esse campo existe
// na resposta, não é suposição). Best-effort: se falhar, só loga — não
// derruba a resposta que o jogador já recebeu.
async function recordUsage(tokens) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key || !tokens) return;
  try {
    const r = await fetch(`${url}/rest/v1/rpc/increment_groq_usage`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_date: todayUtc(), p_tokens: tokens })
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      console.error('recordUsage RPC failed', r.status, t.slice(0, 300));
    }
  } catch (e) {
    console.error('recordUsage failed', e);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'groq_not_configured' });
    return;
  }

  const messages = req.body && req.body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'missing_messages' });
    return;
  }

  const usedToday = await readTodayUsage();
  if (usedToday !== null && usedToday >= GROQ_TPD_SAFE_LIMIT) {
    // Bloqueia ANTES de gastar mais 1 token — mesmo formato de erro que
    // o 429 reativo da Groq abaixo, pro cliente (src/master.js) tratar
    // os dois casos do mesmo jeito, sem precisar saber qual dos dois foi.
    res.status(429).json({ error: 'groq_quota_exceeded', reason: 'daily_budget_gate' });
    return;
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.9,
        max_completion_tokens: 700,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => '');
      console.error('Groq API error', groqRes.status, errText.slice(0, 500));
      if (groqRes.status === 429) {
        // Cota do free tier estourada (TPM ou TPD, por organização inteira —
        // ver docs/ASSEMBLEIA-02-LLM-GRATUITO-E-BANCO.md). Distinguir isso de
        // um erro genérico permite ao cliente mostrar uma mensagem honesta em
        // vez de cair silenciosamente no modo offline.
        res.status(429).json({
          error: 'groq_quota_exceeded',
          retryAfter: groqRes.headers.get('retry-after') || null
        });
        return;
      }
      res.status(502).json({ error: 'groq_upstream_error', status: groqRes.status });
      return;
    }

    const data = await groqRes.json();
    const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text) {
      res.status(502).json({ error: 'groq_empty_response' });
      return;
    }

    // Registra o gasto real desta chamada (não estimado) no contador do
    // portão de orçamento. Precisa de "await" aqui, mesmo custando um
    // pouco de latência: uma função serverless pode ser congelada assim
    // que a resposta é enviada, então "disparar e esquecer" arriscaria
    // perder a gravação de verdade — e todo o mecanismo só protege se o
    // número gravado for real.
    const totalTokens = data && data.usage && data.usage.total_tokens;
    if (totalTokens) await recordUsage(totalTokens);

    res.status(200).json({ text });
  } catch (e) {
    console.error('api/master handler failed', e);
    res.status(500).json({ error: 'internal_error' });
  }
};

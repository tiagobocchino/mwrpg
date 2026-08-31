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

    res.status(200).json({ text });
  } catch (e) {
    console.error('api/master handler failed', e);
    res.status(500).json({ error: 'internal_error' });
  }
};

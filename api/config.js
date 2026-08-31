// Vercel Serverless Function — GET /api/config
// Devolve a config pública do Supabase pro cliente inicializar o SDK.
// Seguro expor: URL + Publishable/anon key são feitas pra rodar no
// navegador — a proteção real é a Row Level Security no banco, não o
// sigilo dessas duas strings. SUPABASE_SECRET_KEY NUNCA passa por aqui.

module.exports = function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    res.status(503).json({ error: 'supabase_not_configured' });
    return;
  }

  res.status(200).json({ supabaseUrl, supabasePublishableKey });
};

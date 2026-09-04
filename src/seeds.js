// === SEMENTES DE CAMPANHA (v0.6 — recomeço com história variada) ===
// window.MWRPG_SEEDS — pool curado de ganchos, cada um ancorado numa
// entrada real do acervo de domínio público (src/acervo.js), pra dar
// variação de abertura E de situações ao longo da campanha (não só a
// primeira mensagem) sem o mestre inventar fonte nenhuma por conta
// própria — decisão da Assembleia 05, Frente B.
window.MWRPG_SEEDS = {
  ganchos: [
    {
      id: 'sino-poco',
      acervoId: 'fabula-raposa-cabra-poco',
      texto: 'O sino que soa sob a maré foi ouvido de novo esta noite — e um pescador jura que o som sobe de um poço seco atrás da capela, não do mar.'
    },
    {
      id: 'leao-doente',
      acervoId: 'fabula-leao-doente',
      texto: 'O velho faroleiro está doente de cama há três dias e manda recado: só quem trouxer prova de coragem pode entrar — mas ninguém que entrou até agora voltou a sair pela porta da frente.'
    },
    {
      id: 'lobo-cordeiro',
      acervoId: 'fabula-lobo-cordeiro',
      texto: 'Um grupo de forasteiros chegou acusando alguém do porto de roubo — a acusação não fecha com os fatos, mas os forasteiros têm mais espadas que argumentos.'
    },
    {
      id: 'quimera',
      acervoId: 'mito-quimera',
      texto: 'Pescadores descrevem, entre risadas nervosas e juras sinceras, uma sombra de três formas diferentes nas ruínas afogadas na maré baixa.'
    },
    {
      id: 'minotauro',
      acervoId: 'mito-minotauro',
      texto: 'Um corredor novo se abriu sob a capela depois da última tempestade — quem entra encontra passagens que parecem se reorganizar sozinhas.'
    },
    {
      id: 'curupira',
      acervoId: 'folclore-curupira',
      texto: 'Rastros na trilha do penhasco apontam na direção errada — quem os seguiu de volta jura que a trilha os levou pra mais longe, não pra casa.'
    }
  ],
  quemFalaPrimeiro: [
    { id: 'brennan', label: 'Brennan, o bardo' },
    { id: 'sira', label: 'Sira, a clériga' },
    { id: 'korrin', label: 'Korrin, o batedor' },
    { id: 'taberneiro', label: 'o taberneiro coxo' }
  ],
  clima: [
    'bruma cerrada, quase não dá pra ver o cais',
    'chuva fina e constante, sem trovão',
    'calor abafado, sem vento nenhum',
    'vento cortante vindo do mar',
    'lua cheia refletida na água parada',
    'silêncio esquisito — nem gaivota grita'
  ]
};

// Sorteia o próximo gancho sem repetir o último usado por este
// navegador (localStorage — funciona com ou sem login). Clima e quem-
// fala-primeiro variam por sorteio simples (não precisam da mesma
// garantia de não-repetição imediata).
function mwrpgPickNextSeed() {
  const ganchos = window.MWRPG_SEEDS.ganchos;
  let lastIdx = -1;
  try { lastIdx = parseInt(localStorage.getItem('mwrpg_last_gancho_idx'), 10); } catch (e) {}
  let idx = Number.isInteger(lastIdx) ? (lastIdx + 1) % ganchos.length : Math.floor(Math.random() * ganchos.length);
  try { localStorage.setItem('mwrpg_last_gancho_idx', String(idx)); } catch (e) {}

  const gancho = ganchos[idx];
  const quem = window.MWRPG_SEEDS.quemFalaPrimeiro[Math.floor(Math.random() * window.MWRPG_SEEDS.quemFalaPrimeiro.length)];
  const clima = window.MWRPG_SEEDS.clima[Math.floor(Math.random() * window.MWRPG_SEEDS.clima.length)];

  return {
    ganchoId: gancho.id,
    ganchoTexto: gancho.texto,
    acervoId: gancho.acervoId,
    quemFalaPrimeiro: quem.id,
    quemFalaPrimeiroLabel: quem.label,
    clima
  };
}

Object.assign(window, { mwrpgPickNextSeed });

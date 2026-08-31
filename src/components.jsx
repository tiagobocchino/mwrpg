// === COMPONENTES VISUAIS ===
// React 18 + JSX (Babel inline). Todos os estilos vêm de styles.css.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ============================================================
// CHAT
// ============================================================
function Chat({ messages, options, mode, thinking, onChoose, onFreeText, allowFree }) {
  const scrollRef = useRef(null);
  const [free, setFree] = useState('');

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [messages, thinking]);

  // teclas 1-6 selecionam opção
  useEffect(() => {
    const handler = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= options.length) onChoose(options[n - 1], n - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [options, onChoose]);

  const optClass = useMemo(() => {
    if (mode === 'combat') return 'options-grid combat';
    if (options.length === 3) return 'options-grid three';
    if (options.length >= 5) return 'options-grid three';
    return 'options-grid';
  }, [mode, options.length]);

  return (
    <div className="parchment chat">
      <div className="section-title">
        <span>Câmara da História</span>
        <small>cap. {messages.filter(m => m.role === 'master').length || 1}</small>
      </div>
      <div className="chat-scroll" ref={scrollRef}>
        {messages.map((m, i) => <Message key={i} m={m} />)}
        {thinking && (
          <div className="msg msg-master">
            <div className="avatar">M</div>
            <div className="speaker">Mestre</div>
            <div className="thinking"><span className="pen"></span> tinta secando…</div>
          </div>
        )}
      </div>

      {options.length > 0 && !thinking && (
        <div className="options pop-in">
          <div className={optClass}>
            {options.map((o, i) => (
              <Option key={i} index={i} option={o} mode={mode} onChoose={() => onChoose(o, i)} />
            ))}
          </div>
          {allowFree && (
            <div className="composer">
              <textarea
                placeholder="ou descreva sua própria ação…"
                value={free}
                onChange={(e) => setFree(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && free.trim()) {
                    e.preventDefault();
                    onFreeText(free.trim());
                    setFree('');
                  }
                }}
              />
              <button className="btn-send" onClick={() => { if (free.trim()) { onFreeText(free.trim()); setFree(''); } }}>Falar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Message({ m }) {
  if (m.role === 'master') {
    return (
      <div className="msg msg-master pop-in">
        <div className="avatar">M</div>
        <div className="speaker">Mestre</div>
        <div className="body">
          {m.content.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    );
  }
  if (m.role === 'player') {
    return (
      <div className="msg msg-player pop-in">
        <div className="bubble">{m.content}</div>
      </div>
    );
  }
  // system / dice
  if (m.role === 'system' && m.kind === 'roll') {
    const r = m.roll;
    return (
      <div className="msg-system pop-in">
        <span className={`roll ${r.band}`}>
          🎲 {r.a}+{r.b}{r.modifier ? (r.modifier > 0 ? `+${r.modifier}` : r.modifier) : ''} = {r.sum} · {r.label}
        </span>
      </div>
    );
  }
  return <div className="msg-system pop-in">{m.content}</div>;
}

function Option({ index, option, mode, onChoose }) {
  const isCombat = mode === 'combat' && option.glyph;
  if (isCombat) {
    return (
      <button className="option combat" onClick={onChoose} style={{ animationDelay: `${index * 40}ms` }}>
        <span className="glyph">{option.glyph}</span>
        <span>{option.label}</span>
      </button>
    );
  }
  return (
    <button className="option pop-in" onClick={onChoose} style={{ animationDelay: `${index * 40}ms` }}>
      <span className="key">{index + 1}</span>
      <span>{option.label}</span>
    </button>
  );
}

// ============================================================
// MAPA
// ============================================================
function MapPanel({ map, partyAt }) {
  return (
    <div className="parchment map">
      <div className="section-title">
        <span>{map.title}</span>
        <small>cenário</small>
      </div>
      <div className="map-svg-wrap">
        <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
          {/* coast outline */}
          <path d="M0,10 Q15,18 30,14 T60,18 Q80,16 100,22 L100,60 L0,60 Z"
                fill="oklch(0.45 0.1 250 / 0.18)" stroke="oklch(0.35 0.1 250 / 0.3)" strokeWidth="0.2" />
          <path d="M0,42 Q20,38 35,42 T65,40 Q80,42 100,38 L100,60 L0,60 Z"
                fill="oklch(0.5 0.06 100 / 0.25)" stroke="none" />
          {/* paths */}
          {map.locations.map((loc, i) => (
            i < map.locations.length - 1 ? (
              <line key={i} x1={loc.x} y1={loc.y * 0.6}
                    x2={map.locations[i+1].x} y2={map.locations[i+1].y * 0.6}
                    stroke="oklch(0.55 0.02 60 / 0.25)" strokeWidth="0.2" strokeDasharray="0.5 0.5" />
            ) : null
          ))}
          {/* locations */}
          {map.locations.map(loc => (
            <g key={loc.id} className="token" style={{ transformOrigin: `${loc.x}% ${loc.y * 0.6}%` }}>
              <circle cx={loc.x} cy={loc.y * 0.6} r="1.4"
                      fill={partyAt === loc.id ? 'oklch(0.50 0.15 25)' : 'oklch(0.55 0.02 60 / 0.6)'}
                      stroke={partyAt === loc.id ? 'oklch(0.72 0.13 80)' : 'oklch(0.30 0.02 60)'}
                      strokeWidth="0.25" />
              {partyAt === loc.id && (
                <circle cx={loc.x} cy={loc.y * 0.6} r="2.4"
                        fill="none" stroke="oklch(0.72 0.13 80 / 0.6)" strokeWidth="0.2">
                  <animate attributeName="r" values="2.4;3.2;2.4" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <text x={loc.x} y={loc.y * 0.6 - 2.2} className="token-label">{loc.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="map-legend">
        <span><span className="dot" style={{ background: 'oklch(0.50 0.15 25)' }}></span>Vocês</span>
        <span><span className="dot" style={{ background: 'oklch(0.55 0.02 60 / 0.7)' }}></span>Local</span>
      </div>
    </div>
  );
}

// ============================================================
// FICHA
// ============================================================
function Sheet({ char, isPlayer }) {
  const portraitClass = char.portraitClass || '';
  return (
    <div className="parchment sheet">
      <div className="sheet-name">
        <div className={`sheet-portrait ${portraitClass}`}>{char.portrait}</div>
        <span>{char.name}</span>
      </div>
      <div className="sheet-sub">{char.role}</div>

      <div className="attrs">
        <div className="attr"><div className="attr-label">CRP</div><div className="attr-value">{char.crp}</div></div>
        <div className="attr"><div className="attr-label">MNT</div><div className="attr-value">{char.mnt}</div></div>
        <div className="attr"><div className="attr-label">ALM</div><div className="attr-value">{char.alm}</div></div>
      </div>

      <div className="bar">
        <div className="bar-label"><span>Vida</span><span>{char.hp} / {char.hpMax}</span></div>
        <div className="bar-track"><div className="bar-fill" style={{ width: `${(char.hp/char.hpMax)*100}%` }}></div></div>
      </div>
      <div className="bar">
        <div className="bar-label"><span>Foco</span><span>{char.mp} / {char.mpMax}</span></div>
        <div className="bar-track"><div className="bar-fill mana" style={{ width: `${(char.mp/char.mpMax)*100}%` }}></div></div>
      </div>

      <div className="tags">
        {char.tags.map((t, i) => <span key={i} className={`tag ${isPlayer && i === char.tags.length-1 ? 'gold' : ''}`}>{t}</span>)}
      </div>
    </div>
  );
}

// ============================================================
// DICE OVERLAY
// ============================================================
function DiceOverlay({ rolling, onDone }) {
  const [face1, setFace1] = useState(1);
  const [face2, setFace2] = useState(1);

  useEffect(() => {
    if (!rolling) return;
    let t = 0;
    const tick = setInterval(() => {
      setFace1(1 + Math.floor(Math.random() * 6));
      setFace2(1 + Math.floor(Math.random() * 6));
      t += 80;
    }, 80);
    const finish = setTimeout(() => {
      clearInterval(tick);
      setFace1(rolling.a);
      setFace2(rolling.b);
      setTimeout(onDone, 700);
    }, 900);
    return () => { clearInterval(tick); clearTimeout(finish); };
  }, [rolling]);

  if (!rolling) return null;
  return (
    <div className="dice-stage active">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex' }}>
          <div className="die" style={{ animation: 'spin 0.4s linear infinite' }}>{face1}</div>
          <div className="die" style={{ animation: 'spin 0.4s linear infinite reverse' }}>{face2}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.2em', color: 'var(--paper)', textTransform: 'uppercase' }}>
          {rolling.modifier ? `2d6 ${rolling.modifier > 0 ? '+' : ''}${rolling.modifier}` : '2d6'}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TOPBAR
// ============================================================
function Topbar({ scenarioTitle, onReset, canContinue, onContinue, demoInfo, onSignOut }) {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="seal"></span>
        <span>MWRPG</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginLeft: 14, textTransform: 'uppercase' }}>
          {scenarioTitle}
        </span>
      </div>
      <div className="topbar-actions">
        {demoInfo && (
          <span className="meta demo-badge" title="Versão demo — cada campanha vai até 40 rodadas">
            demo · rodada {demoInfo.turnCount}/{demoInfo.demoLimit}
          </span>
        )}
        <span className="meta">D6 das Três Letras</span>
        {canContinue && <button className="btn" onClick={onContinue}>Continuar</button>}
        <button className="btn btn-ghost" onClick={onReset}>Recomeçar</button>
        {onSignOut && <button className="btn btn-ghost" onClick={onSignOut}>Sair</button>}
      </div>
    </div>
  );
}

// ============================================================
// LOGIN GATE (v0.4 — link mágico)
// ============================================================
function LoginGate({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSignIn(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || 'Não foi possível enviar o link. Tente de novo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-gate">
      <div className="parchment login-card pop-in">
        <div className="section-title"><span>MWRPG</span><small>entrar</small></div>
        <p className="login-copy">
          Esta é uma <strong>versão demo</strong> do MWRPG — cada campanha vai até
          <strong> 40 rodadas</strong>, o suficiente pra viver um arco de história
          inteiro. Entre com seu email pra jogar e guardar seu progresso; sem senha,
          é só um link enviado pra sua caixa de entrada.
        </p>
        {sent ? (
          <p className="login-sent">
            Link enviado pra <strong>{email}</strong> — abra seu email e clique nele
            pra entrar. Pode fechar esta aba.
          </p>
        ) : (
          <form onSubmit={submit} className="login-form">
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
            <button className="btn" type="submit" disabled={busy}>
              {busy ? 'Enviando…' : 'Enviar link mágico'}
            </button>
          </form>
        )}
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

Object.assign(window, { Chat, MapPanel, Sheet, DiceOverlay, Topbar, LoginGate });

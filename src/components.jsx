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
// MAPA (v0.5 — Leaflet, duas escalas: cidade + interior)
// ============================================================
function MapPanel({ partyAt, mapScale, onEnterInterior, onExit, accessible, discovered, knownMarkers }) {
  const elRef = useRef(null);
  const leafletRef = useRef(null);
  const disc = discovered || [];
  const known = knownMarkers || [];

  const interiorId = partyAt + '_interior';
  const showingInterior = mapScale === 'interior' && window.MWRPG_MAPS[interiorId];
  const mapDef = showingInterior ? window.MWRPG_MAPS[interiorId] : window.MWRPG_MAPS.city;

  useEffect(() => {
    if (!elRef.current || !window.L || accessible === false) return;
    const L = window.L;
    if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null; }

    const bounds = [[0, 0], [mapDef.height, mapDef.width]];
    const lmap = L.map(elRef.current, {
      crs: L.CRS.Simple,
      minZoom: -3,
      maxZoom: 2,
      zoomControl: true,
      attributionControl: false
    });
    L.imageOverlay(mapDef.image, bounds).addTo(lmap);
    lmap.fitBounds(bounds);
    leafletRef.current = lmap;

    const toLatLng = (px, py) => [mapDef.height - py, px];

    (mapDef.markers || []).forEach((m) => {
      const isHere = m.id === partyAt;
      const isDiscovered = isHere || disc.indexOf(m.id) !== -1;
      const knownOnly = !isDiscovered && known.some(k => k.locationId === m.id);
      // v0.7 — névoa por nó: local nunca visitado e nunca mencionado por
      // ninguém simplesmente não aparece (Assembleia 06, Seção 1.2).
      if (!isDiscovered && !knownOnly) return;

      const cls = 'map-token' + (isHere ? ' map-token-here' : knownOnly ? ' map-token-known' : '');
      const icon = L.divIcon({ className: cls, html: '<span></span>', iconSize: [18, 18] });
      const marker = L.marker(toLatLng(m.x, m.y), { icon, title: m.label }).addTo(lmap);
      marker.bindTooltip(knownOnly ? `${m.label} (rumor)` : m.label, { direction: 'top', offset: [0, -8] });
      // só o local onde o grupo está agora pode ser "entrado" — o mestre
      // decide pra onde o grupo vai, o mapa só mostra e deixa entrar/sair
      if (isHere && window.mwrpgHasInterior(m.id)) {
        marker.on('click', () => onEnterInterior && onEnterInterior(m.id));
      }
    });

    if (mapDef.exit) {
      const exitIcon = L.divIcon({ className: 'map-token map-token-exit', html: '<span>↩</span>', iconSize: [22, 22] });
      const exitMarker = L.marker(toLatLng(mapDef.exit.x, mapDef.exit.y), { icon: exitIcon, title: 'Sair' }).addTo(lmap);
      exitMarker.on('click', () => onExit && onExit());
    }

    return () => { lmap.remove(); leafletRef.current = null; };
  }, [mapDef.id, partyAt, accessible, disc.join(','), known.map(k => k.id).join(',')]);

  // v0.7 — regra de acesso (Assembleia 06, Seção 1.3): fora de uma área
  // tipo "cidade" (masmorra, missão distante, ou cena remota sinalizada
  // pelo mestre), o mapa fica indisponível até o jogador sair de lá.
  if (accessible === false) {
    return (
      <div className="parchment map">
        <div className="section-title"><span>Mapa</span><small>indisponível aqui</small></div>
        <div className="map-locked">
          <p>Vocês estão longe de qualquer lugar conhecido — o mapa volta a
          ficar disponível assim que retornarem a um local familiar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parchment map">
      <div className="section-title">
        <span>{mapDef.label}</span>
        <small>{showingInterior ? 'interior' : 'cenário'}</small>
      </div>
      <div className="map-leaflet-wrap" ref={elRef} />
      <div className="map-legend">
        <span><span className="dot" style={{ background: 'oklch(0.50 0.15 25)' }}></span>Vocês</span>
        <span><span className="dot" style={{ background: 'oklch(0.55 0.02 60 / 0.7)' }}></span>Local (clique pra entrar)</span>
        <span><span className="dot" style={{ background: 'oklch(0.72 0.13 80 / 0.85)' }}></span>Rumor (ainda não visitado)</span>
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

      <div className={`attrs ${isPlayer ? 'attrs-4' : ''}`}>
        <div className="attr"><div className="attr-label">CRP</div><div className="attr-value">{char.crp}</div></div>
        <div className="attr"><div className="attr-label">MNT</div><div className="attr-value">{char.mnt}</div></div>
        <div className="attr"><div className="attr-label">ALM</div><div className="attr-value">{char.alm}</div></div>
        {isPlayer && (
          <div className="attr"><div className="attr-label">INT</div><div className="attr-value">{char.int || 0}</div></div>
        )}
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

      {isPlayer && char.knownSpells && char.knownSpells.length > 0 && (
        <div className="sheet-spells">
          <div className="sheet-sub">Magias conhecidas</div>
          <div className="tags">
            {char.knownSpells.map((spellId, i) => {
              const sp = window.mwrpgFindSpell && window.mwrpgFindSpell(spellId);
              return <span key={i} className="tag spell" title={sp ? sp.efeito : ''}>{sp ? sp.nome : spellId}</span>;
            })}
          </div>
        </div>
      )}
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
function Topbar({ scenarioTitle, onReset, resetting, canContinue, onContinue, demoInfo, onSignOut }) {
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
        <button className="btn btn-ghost" onClick={onReset} disabled={resetting}>{resetting ? 'Recomeçando…' : 'Recomeçar'}</button>
        {onSignOut && <button className="btn btn-ghost" onClick={onSignOut}>Sair</button>}
      </div>
    </div>
  );
}

// ============================================================
// LOGIN GATE (v0.4 — link mágico)
// ============================================================
function LoginGate({ onSignIn, onSignInPassword, initialError }) {
  const [mode, setMode] = useState('magic'); // 'magic' | 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError || null);

  function switchMode(next) {
    setMode(next);
    setError(null);
    setPassword('');
  }

  async function submitMagic(e) {
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

  async function submitPassword(e) {
    e.preventDefault();
    if (!email.trim() || !password || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSignInPassword(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Não foi possível entrar. Tente de novo.');
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
          inteiro.
        </p>

        {sent ? (
          <p className="login-sent">
            Link enviado pra <strong>{email}</strong> — abra seu email e clique nele
            pra entrar. Pode fechar esta aba.
          </p>
        ) : mode === 'magic' ? (
          <>
            <p className="login-copy" style={{ marginTop: -8 }}>
              Primeira vez? Entre com seu email — sem senha, é só um link
              enviado pra sua caixa de entrada.
            </p>
            <form onSubmit={submitMagic} className="login-form">
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
            <button className="btn btn-ghost login-toggle" onClick={() => switchMode('password')} disabled={busy}>
              Já tenho senha — entrar direto
            </button>
          </>
        ) : (
          <>
            <p className="login-copy" style={{ marginTop: -8 }}>
              Entre com o email e a senha que você criou.
            </p>
            <form onSubmit={submitPassword} className="login-form">
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
              />
              <input
                type="password"
                required
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
              />
              <button className="btn" type="submit" disabled={busy}>
                {busy ? 'Entrando…' : 'Entrar'}
              </button>
            </form>
            <button className="btn btn-ghost login-toggle" onClick={() => switchMode('magic')} disabled={busy}>
              Primeira vez ou esqueceu a senha? Link mágico
            </button>
          </>
        )}
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

// ============================================================
// CRIAR SENHA (v0.4 — logo depois de confirmar o link mágico, pra
// não precisar de link novo toda vez que voltar)
// ============================================================
function SetPasswordGate({ onSetPassword, onSkip }) {
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    if (password.length < 6) { setError('A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (password !== confirmPw) { setError('As senhas não coincidem.'); return; }
    setBusy(true);
    setError(null);
    try {
      await onSetPassword(password);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar a senha agora.');
      setBusy(false);
    }
  }

  return (
    <div className="login-gate">
      <div className="parchment login-card pop-in">
        <div className="section-title"><span>※ Login confirmado</span></div>
        <p className="login-copy">
          Crie uma senha pra sua conta — assim você entra direto da próxima
          vez, sem precisar de um novo link por email.
        </p>
        <form onSubmit={submit} className="login-form">
          <input
            type="password"
            required
            minLength={6}
            placeholder="Nova senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Confirme a senha"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            disabled={busy}
          />
          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Salvando…' : 'Salvar senha e entrar'}
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <button className="btn btn-ghost login-toggle" onClick={onSkip} disabled={busy}>
          Definir depois
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CRIAÇÃO DE PERSONAGEM (v0.6 — classes + nome único globalmente)
// ============================================================
function normalizeCharName(raw) {
  return String(raw || '').trim().replace(/\s+/g, ' ');
}
const CHAR_NAME_RE = /^[\p{L}\p{M}'’\- ]{2,24}$/u;

function CharacterCreationGate({ onCreate }) {
  const classes = window.MWRPG_CLASSES.list;
  const [classId, setClassId] = useState(classes[0].id);
  const [adjust, setAdjust] = useState(null); // null | attr id
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  const cls = classes.find(c => c.id === classId);
  const preview = window.mwrpgBuildCharacter(name || '…', classId, adjust);

  function nameError(n) {
    if (!n) return 'Escreva um nome pro seu personagem.';
    if (!CHAR_NAME_RE.test(n)) return 'Nome precisa ter entre 2 e 24 letras (acentos, espaço, apóstrofo e hífen valem).';
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    const clean = normalizeCharName(name);
    const nameErr = nameError(clean);
    if (nameErr) { setError(nameErr); setSuggestions(null); return; }
    setBusy(true);
    setError(null);
    setSuggestions(null);
    try {
      await onCreate(clean, classId, adjust);
    } catch (err) {
      setError(err.message || 'Não foi possível criar o personagem agora.');
      if (err.nameTaken) {
        setSuggestions([`${clean} de Ys`, `${clean}, o Marcado`, `${clean} II`]);
      }
      setBusy(false);
    }
  }

  return (
    <div className="login-gate">
      <div className="parchment login-card char-gate-card pop-in">
        <div className="section-title"><span>Quem é você em Ys?</span></div>
        <p className="login-copy">
          Escolha uma classe e um nome — esse personagem será seu, e o
          nome precisa ser único entre todos os jogadores.
        </p>

        <div className="class-cards">
          {classes.map(c => (
            <button
              type="button"
              key={c.id}
              className={'class-card' + (c.id === classId ? ' selected' : '')}
              onClick={() => { setClassId(c.id); setAdjust(null); }}
              disabled={busy}
            >
              <span className="class-card-name">{c.nome}</span>
              <span className="class-card-desc">{c.resumo}</span>
              <span className="class-card-stats">
                CRP {c.crp} · MNT {c.mnt} · ALM {c.alm}
              </span>
            </button>
          ))}
        </div>

        {cls && cls.ajustavel && (
          <div className="adjust-row">
            <span>Ajuste fino:</span>
            <label>
              <input type="radio" name="adjust" checked={adjust === null} onChange={() => setAdjust(null)} disabled={busy} />
              padrão
            </label>
            <label>
              <input type="radio" name="adjust" checked={adjust === cls.ajustavel[0]} onChange={() => setAdjust(cls.ajustavel[0])} disabled={busy} />
              +1 {cls.ajustavel[0].toUpperCase()}
            </label>
            <label>
              <input type="radio" name="adjust" checked={adjust === cls.ajustavel[1]} onChange={() => setAdjust(cls.ajustavel[1])} disabled={busy} />
              +1 {cls.ajustavel[1].toUpperCase()}
            </label>
          </div>
        )}

        <form onSubmit={submit} className="login-form">
          <input
            type="text"
            required
            maxLength={24}
            placeholder="Nome do personagem"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
          />
          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Criando…' : `Começar como ${cls ? cls.nome.toLowerCase() : ''}`}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}
        {suggestions && (
          <div className="name-suggestions">
            <span>Que tal:</span>
            {suggestions.map((s, i) => (
              <button type="button" key={i} className="btn btn-ghost name-suggestion-btn" onClick={() => { setName(s); setError(null); setSuggestions(null); }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <p className="login-copy" style={{ marginTop: 16, fontSize: 12 }}>
          Prévia — Vida {preview.hpMax} · Foco {preview.mpMax}
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { Chat, MapPanel, Sheet, DiceOverlay, Topbar, LoginGate, SetPasswordGate, CharacterCreationGate });

// === APP PRINCIPAL ===
const { useState: useS, useEffect: useE, useRef: useR, useCallback: useCB } = React;
const useTweaks = window.useTweaks;
const TweaksPanel = window.TweaksPanel;
const TweakSection = window.TweakSection;
const TweakToggle = window.TweakToggle;
const TweakRadio = window.TweakRadio;
const { Chat, MapPanel, Sheet, DiceOverlay, Topbar } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "parchment",
  "fontDisplay": "Cinzel",
  "fontBody": "EB Garamond",
  "allowFreeText": true,
  "showDice": true,
  "masterTone": "sage"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [messages, setMessages] = useS(() => [{ role: 'master', content: window.MWRPG_DATA.scenario.intro }]);
  const [options, setOptions] = useS(() => window.MWRPG_DATA.scenario.options.map(o => ({
    label: o.label,
    attr: o.tone === 'direct' ? 'mnt' : (o.tone === 'social' || o.tone === 'bardic') ? 'alm' : 'none',
    needsRoll: o.tone !== 'cautious'
  })));
  const [mode, setMode] = useS('dialog');
  const [thinking, setThinking] = useS(false);
  const [rolling, setRolling] = useS(null);
  const [player, setPlayer] = useS(window.MWRPG_DATA.player);
  const [npcs] = useS(window.MWRPG_DATA.npcs);
  const [partyAt, setPartyAt] = useS('tavern');
  const [canContinue, setCanContinue] = useS(() => window.MWRPG_STORAGE.hasSave());
  const history = useR([]);

  // tema via data-attr
  useE(() => { document.documentElement.setAttribute('data-theme', tweaks.theme === 'ember' ? 'ember' : ''); }, [tweaks.theme]);

  // primeiro turno: histórico inicia com a intro
  useE(() => { history.current = [{ role: 'master', content: window.MWRPG_DATA.scenario.intro }]; }, []);

  // v0.2 — autosave: grava progresso a cada mudança de estado relevante.
  // Pula o primeiro render pra não sobrescrever um save existente antes do
  // jogador decidir "Continuar" ou "Recomeçar".
  const skipFirstSave = useR(true);
  useE(() => {
    if (skipFirstSave.current) { skipFirstSave.current = false; return; }
    window.MWRPG_STORAGE.save({ messages, history: history.current, options, mode, player, partyAt });
  }, [messages, options, mode, player, partyAt]);

  const handleContinue = useCB(() => {
    const saved = window.MWRPG_STORAGE.load();
    if (!saved) return;
    setMessages(saved.messages || []);
    history.current = saved.history || [];
    setOptions(saved.options || []);
    setMode(saved.mode || 'dialog');
    setPlayer(saved.player || window.MWRPG_DATA.player);
    setPartyAt(saved.partyAt || 'tavern');
    setCanContinue(false);
  }, []);

  async function boot() {
    setThinking(true);
    setThinking(false);
  }

  const handleChoose = useCB(async (option, idx) => {
    if (thinking) return;
    setCanContinue(false);
    // 1. registrar fala do jogador
    const playerMsg = { role: 'player', content: option.label };
    setMessages(m => [...m, playerMsg]);
    history.current.push({ role: 'player', content: option.label });

    // 2. opcionalmente rolar dado
    let rollLine = null;
    if (option.needsRoll) {
      const attrVal = option.attr && option.attr !== 'none' ? (player[option.attr] || 0) : 0;
      const r = window.MWRPG_ENGINE.roll2d6(attrVal);
      if (tweaks.showDice) {
        await new Promise(resolve => {
          setRolling(r);
          setTimeout(() => {
            setRolling(null);
            resolve();
          }, 1700);
        });
      }
      rollLine = r;
      setMessages(m => [...m, { role: 'system', kind: 'roll', roll: r }]);
      history.current.push({
        role: 'player',
        content: `[Rolagem ${option.attr || ''}: 2d6+${attrVal} = ${r.sum} (${r.label})]`
      });
    }
    setOptions([]);
    setThinking(true);

    // 3. pedir próximo turno ao mestre
    const promptToMaster =
      `O jogador escolheu: "${option.label}".` +
      (rollLine ? ` Resultado: ${rollLine.label} (${rollLine.sum}). Incorpore o resultado na narração e adapte a cena.` : '') +
      ` Continue a história e ofereça ${mode === 'combat' ? 6 : '2 a 6'} novas opções.`;

    const resp = await window.MWRPG_MASTER.ask(history.current, promptToMaster);
    applyMasterResponse(resp);
  }, [thinking, player, mode, tweaks.showDice]);

  const handleFree = useCB(async (text) => {
    if (thinking) return;
    setCanContinue(false);
    setMessages(m => [...m, { role: 'player', content: text }]);
    history.current.push({ role: 'player', content: text });
    setOptions([]);
    setThinking(true);
    const resp = await window.MWRPG_MASTER.ask(history.current, `O jogador descreve livremente: "${text}". Reaja e ofereça novas opções.`);
    applyMasterResponse(resp);
  }, [thinking]);

  function applyMasterResponse(resp) {
    setMessages(m => [...m, { role: 'master', content: resp.narration }]);
    history.current.push({ role: 'master', content: resp.narration });

    // mode
    if (resp.mode === 'combat') {
      setMode('combat');
      // injeta as 6 ações padrão se a IA não enviou
      const combat = window.MWRPG_ENGINE.COMBAT_ACTIONS.map((a, i) => ({
        label: resp.options[i]?.label || a.label,
        glyph: a.glyph,
        attr: a.attr,
        needsRoll: a.id !== 'item'
      }));
      setOptions(combat);
    } else {
      setMode(resp.mode || 'dialog');
      setOptions(resp.options.slice(0, 6));
    }

    // movimento no mapa
    if (resp.mapHint && resp.mapHint.moveTo) {
      setPartyAt(resp.mapHint.moveTo);
    }

    // mudanças de estado
    if (resp.stateChanges) {
      const sc = resp.stateChanges;
      setPlayer(p => {
        const next = { ...p };
        if (typeof sc.playerHp === 'number') next.hp = Math.max(0, Math.min(p.hpMax, p.hp + sc.playerHp));
        if (typeof sc.playerMp === 'number') next.mp = Math.max(0, Math.min(p.mpMax, p.mp + sc.playerMp));
        if (sc.addTag) next.tags = [...p.tags, sc.addTag];
        return next;
      });
    }

    setThinking(false);
  }

  function handleReset() {
    if (!confirm('Recomeçar a campanha? O progresso atual será perdido.')) return;
    const intro = window.MWRPG_DATA.scenario.intro;
    setMessages([{ role: 'master', content: intro }]);
    setOptions(window.MWRPG_DATA.scenario.options.map(o => ({
      label: o.label,
      attr: o.tone === 'direct' ? 'mnt' : (o.tone === 'social' || o.tone === 'bardic') ? 'alm' : 'none',
      needsRoll: o.tone !== 'cautious'
    })));
    setMode('dialog');
    history.current = [{ role: 'master', content: intro }];
    setPlayer(window.MWRPG_DATA.player);
    setPartyAt('tavern');
    setCanContinue(false);
    window.MWRPG_STORAGE.clear();
  }

  return (
    <div className="app" data-screen-label="MWRPG — A Coroa Enterrada de Ys">
      <Topbar
        scenarioTitle={window.MWRPG_DATA.scenario.title}
        onReset={handleReset}
        canContinue={canContinue}
        onContinue={handleContinue}
      />

      <div className="col col-left">
        <Sheet char={player} isPlayer />
        <Sheet char={npcs[0]} />
      </div>

      <div className="col col-center">
        <Chat
          messages={messages}
          options={options}
          mode={mode}
          thinking={thinking}
          onChoose={handleChoose}
          onFreeText={handleFree}
          allowFree={tweaks.allowFreeText}
        />
        <MapPanel map={{ ...window.MWRPG_DATA.map }} partyAt={partyAt} />
      </div>

      <div className="col col-right">
        <Sheet char={npcs[1]} />
        <Sheet char={npcs[2]} />
      </div>

      <DiceOverlay rolling={rolling} onDone={() => {}} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Atmosfera">
          <TweakRadio
            label="Tema"
            value={tweaks.theme}
            options={[{value:'parchment',label:'Pergaminho'},{value:'ember',label:'Brasa'}]}
            onChange={(v) => setTweak('theme', v)}
          />
          <TweakToggle label="Animar dados" value={tweaks.showDice} onChange={(v) => setTweak('showDice', v)} />
          <TweakToggle label="Resposta livre" value={tweaks.allowFreeText} onChange={(v) => setTweak('allowFreeText', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);

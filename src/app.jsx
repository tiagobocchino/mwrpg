// === APP PRINCIPAL ===
const { useState: useS, useEffect: useE, useRef: useR, useCallback: useCB } = React;
const useTweaks = window.useTweaks;
const TweaksPanel = window.TweaksPanel;
const TweakSection = window.TweakSection;
const TweakToggle = window.TweakToggle;
const TweakRadio = window.TweakRadio;
const { Chat, MapPanel, Sheet, DiceOverlay, Topbar, LoginGate, SetPasswordGate, CharacterCreationGate } = window;

const DEMO_LIMIT = 40;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "parchment",
  "fontDisplay": "Cinzel",
  "fontBody": "EB Garamond",
  "allowFreeText": true,
  "showDice": true,
  "masterTone": "sage"
}/*EDITMODE-END*/;

function freshIntro() {
  const intro = window.MWRPG_DATA.scenario.intro;
  return {
    messages: [{ role: 'master', content: intro }],
    history: [{ role: 'master', content: intro }],
    options: window.MWRPG_DATA.scenario.options.map(o => ({
      label: o.label,
      attr: o.tone === 'direct' ? 'mnt' : (o.tone === 'social' || o.tone === 'bardic') ? 'alm' : 'none',
      needsRoll: o.tone !== 'cautious'
    })),
    mode: 'dialog',
    partyAt: 'tavern'
  };
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const init = useR(freshIntro()).current;
  const [messages, setMessages] = useS(init.messages);
  const [options, setOptions] = useS(init.options);
  const [mode, setMode] = useS(init.mode);
  const [thinking, setThinking] = useS(false);
  const [rolling, setRolling] = useS(null);
  const [player, setPlayer] = useS(window.MWRPG_DATA.player);
  const [npcs] = useS(window.MWRPG_DATA.npcs);
  const [partyAt, setPartyAt] = useS(init.partyAt);
  const [mapScale, setMapScale] = useS('city'); // 'city' | 'interior' (v0.5)
  const [canContinue, setCanContinue] = useS(() => window.MWRPG_STORAGE.hasSave());
  const [turnCount, setTurnCount] = useS(0);
  const [demoLocked, setDemoLocked] = useS(false);
  const history = useR(init.history);

  // v0.6 — personagem (classe + nome único) e semente de campanha
  // (recomeço com história variada). Ver Assembleia 05.
  const [needsCharacter, setNeedsCharacter] = useS(false);
  const [characterChecking, setCharacterChecking] = useS(true);
  const [campaignSeed, setCampaignSeed] = useS(null);
  const [resetting, setResetting] = useS(false);
  const characterId = useR(null);
  const characterBase = useR(null); // ficha "pristina" da classe, usada no recomeço
  const characterChecked = useR(false);

  // v0.7 — mapas avançados (Assembleia 06): névoa por nó, regra de
  // acesso ao mapa, marcador de missão mínimo.
  const [discovered, setDiscovered] = useS(() => [init.partyAt]);
  const [knownMarkers, setKnownMarkers] = useS([]); // [{ id, title, locationId }]
  const [missions, setMissions] = useS([]); // [{ id, titulo, localId, status }]
  const [remoteArea, setRemoteArea] = useS(false); // cena fora de qualquer local conhecido (mapHint.remoteArea)
  const mapAccessible = !remoteArea && window.mwrpgLocationType(partyAt) === 'cidade';

  // v0.4 — login (link mágico). authRequired só vira true se /api/config
  // responder com sucesso (Supabase configurado); senão o jogo segue sem
  // login, como sempre funcionou.
  const [authChecking, setAuthChecking] = useS(true);
  const [authRequired, setAuthRequired] = useS(false);
  const [session, setSession] = useS(null);
  const [authInitialError, setAuthInitialError] = useS(null);
  const [justConfirmed, setJustConfirmed] = useS(false);
  const cloudSessionId = useR(null);
  const hadInitialSession = useR(false);

  useE(() => {
    let unsub = () => {};
    (async () => {
      const ok = await window.MWRPG_AUTH.init();
      setAuthRequired(ok);
      if (ok) {
        setAuthInitialError(window.MWRPG_AUTH.consumeUrlError());
        const s = await window.MWRPG_AUTH.getSession();
        setSession(s);
        hadInitialSession.current = !!s;
        unsub = window.MWRPG_AUTH.onChange((s2) => {
          // sessão apareceu depois do mount (não já na primeira checagem)
          // = acabou de voltar do clique no link mágico. Oferece criar
          // senha antes de entrar no jogo (fica assim até o jogador
          // salvar uma senha ou pular).
          if (s2 && !hadInitialSession.current) {
            setJustConfirmed(true);
          }
          hadInitialSession.current = !!s2;
          setSession(s2);
        });
      }
      setAuthChecking(false);
    })();
    return () => unsub();
  }, []);

  // hidrata/cria a campanha em nuvem — só depois que o personagem
  // (classe + nome) já existe, senão a campanha nasceria sem dono.
  const cloudReady = useR(false);
  async function bootstrapCampaign(userId, charId) {
    if (cloudReady.current) return;
    cloudReady.current = true;
    try {
      const existing = await window.MWRPG_CLOUD.loadActiveSession(userId);
      if (existing) {
        cloudSessionId.current = existing.id;
        setMessages(existing.messages && existing.messages.length ? existing.messages : init.messages);
        history.current = existing.history && existing.history.length ? existing.history : init.history;
        setOptions(existing.options || []);
        setMode(existing.mode || 'dialog');
        setPartyAt(existing.party_at || 'tavern');
        setMapScale('city');
        setTurnCount(existing.turn_count || 0);
        setDemoLocked(existing.status === 'demo_limit_reached');
        setCampaignSeed(existing.seed || null);
        setDiscovered(existing.discovered && existing.discovered.length ? existing.discovered : [existing.party_at || 'tavern']);
        setKnownMarkers(existing.known_markers || []);
        setMissions(existing.missions || []);
        setRemoteArea(false); // não persistimos "no meio de uma cena remota" entre sessões — volta neutro
      } else {
        const created = await window.MWRPG_CLOUD.createSession(userId, init, charId, null, { discovered: [init.partyAt] });
        cloudSessionId.current = created.id;
      }
    } catch (e) {
      console.error('cloudSync: falha ao carregar/criar campanha', e);
    }
  }

  // v0.6 — carrega o personagem do jogador assim que a sessão aparece;
  // se não existir nenhum ainda, pede pra criar antes de qualquer campanha.
  useE(() => {
    if (!session || characterChecked.current) return;
    characterChecked.current = true;
    (async () => {
      try {
        const existing = await window.MWRPG_CLOUD.loadCharacter(session.user.id);
        if (existing) {
          characterId.current = existing.id;
          characterBase.current = existing.data;
          setPlayer(existing.data);
          await bootstrapCampaign(session.user.id, existing.id);
        } else {
          setNeedsCharacter(true);
        }
      } catch (e) {
        console.error('cloudSync: falha ao carregar personagem', e);
      } finally {
        setCharacterChecking(false);
      }
    })();
  }, [session]);

  const handleCreateCharacter = useCB(async (name, classId, adjust) => {
    const data = window.mwrpgBuildCharacter(name, classId, adjust);
    const row = await window.MWRPG_CLOUD.createCharacter(session.user.id, name, data);
    characterId.current = row.id;
    characterBase.current = row.data;
    setPlayer(row.data);
    setNeedsCharacter(false);
    await bootstrapCampaign(session.user.id, row.id);
  }, [session]);

  // tema via data-attr
  useE(() => { document.documentElement.setAttribute('data-theme', tweaks.theme === 'ember' ? 'ember' : ''); }, [tweaks.theme]);

  // autosave: nuvem se logado, localStorage caso contrário (v0.2, inalterado)
  const skipFirstSave = useR(true);
  useE(() => {
    if (skipFirstSave.current) { skipFirstSave.current = false; return; }
    if (cloudSessionId.current) {
      window.MWRPG_CLOUD.saveSession(cloudSessionId.current, {
        messages, history: history.current, options, mode, party_at: partyAt,
        turn_count: turnCount, status: demoLocked ? 'demo_limit_reached' : 'active',
        seed: campaignSeed, discovered, known_markers: knownMarkers, missions
      }).catch(e => console.error('cloudSync: falha ao salvar', e));
    } else if (!authRequired) {
      window.MWRPG_STORAGE.save({ messages, history: history.current, options, mode, player, partyAt, campaignSeed, discovered, knownMarkers, missions });
    }
  }, [messages, options, mode, player, partyAt, turnCount, demoLocked, campaignSeed, discovered, knownMarkers, missions]);

  const handleContinue = useCB(() => {
    const saved = window.MWRPG_STORAGE.load();
    if (!saved) return;
    setMessages(saved.messages || []);
    history.current = saved.history || [];
    setOptions(saved.options || []);
    setMode(saved.mode || 'dialog');
    setPlayer(saved.player || window.MWRPG_DATA.player);
    setPartyAt(saved.partyAt || 'tavern');
    setMapScale('city');
    setCampaignSeed(saved.campaignSeed || null);
    setDiscovered(saved.discovered && saved.discovered.length ? saved.discovered : [saved.partyAt || 'tavern']);
    setKnownMarkers(saved.knownMarkers || []);
    setMissions(saved.missions || []);
    setRemoteArea(false);
    setCanContinue(false);
  }, []);

  const handleEnterInterior = useCB((locationId) => {
    if (locationId === partyAt) setMapScale('interior');
  }, [partyAt]);
  const handleExitInterior = useCB(() => setMapScale('city'), []);

  const handleSignIn = useCB((email) => window.MWRPG_AUTH.signInWithEmail(email), []);
  const handleSignInPassword = useCB((email, password) => window.MWRPG_AUTH.signInWithPassword(email, password), []);
  const handleSetPassword = useCB(async (password) => {
    await window.MWRPG_AUTH.setPassword(password);
    setJustConfirmed(false);
  }, []);
  const handleSkipPassword = useCB(() => setJustConfirmed(false), []);
  const handleSignOut = useCB(async () => {
    await window.MWRPG_AUTH.signOut();
    setSession(null);
    cloudReady.current = false;
    cloudSessionId.current = null;
  }, []);

  function demoEndMessage() {
    return {
      role: 'system',
      content:
        'Por enquanto, a história para aqui — não porque a aventura acabou, mas ' +
        'porque esta é uma demonstração aberta pra quem quiser experimentar o ' +
        'MWRPG antes da versão completa. Cada campanha nesta fase vai até ' +
        DEMO_LIMIT + ' rodadas, pra dar espaço pra explorar sem pesar na nossa ' +
        'capacidade de teste (o mestre roda numa camada gratuita de IA, ' +
        'compartilhada entre todo mundo testando ao mesmo tempo). Gostou? ' +
        'Comece uma nova campanha quando quiser.'
    };
  }

  const handleChoose = useCB(async (option, idx) => {
    if (thinking || demoLocked) return;
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

    const resp = await window.MWRPG_MASTER.ask(history.current, promptToMaster, campaignSeed);
    applyMasterResponse(resp);
  }, [thinking, demoLocked, player, mode, tweaks.showDice, campaignSeed]);

  const handleFree = useCB(async (text) => {
    if (thinking || demoLocked) return;
    setCanContinue(false);
    setMessages(m => [...m, { role: 'player', content: text }]);
    history.current.push({ role: 'player', content: text });
    setOptions([]);
    setThinking(true);
    const resp = await window.MWRPG_MASTER.ask(history.current, `O jogador descreve livremente: "${text}". Reaja e ofereça novas opções.`, campaignSeed);
    applyMasterResponse(resp);
  }, [thinking, demoLocked, campaignSeed]);

  function applyMasterResponse(resp) {
    setMessages(m => [...m, { role: 'master', content: resp.narration }]);
    history.current.push({ role: 'master', content: resp.narration });

    // cota da IA esgotada: estado honesto, não conta como rodada, sem opções novas
    if (resp.quotaExceeded) {
      setOptions([]);
      setThinking(false);
      return;
    }

    // mode
    if (resp.mode === 'combat') {
      setMode('combat');
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

    // v0.5 — o mestre decide onde e quando usar cada mapa: moveTo troca
    // o local (volta pra escala de cidade); enterInterior mostra o
    // interior do local atual, se existir um registrado em maps.js.
    if (resp.mapHint && resp.mapHint.moveTo) {
      const dest = resp.mapHint.moveTo;
      setPartyAt(dest);
      setMapScale('city');
      // v0.7 — chegar num local conhecido sempre limpa "área remota"
      // (é o próprio jeito do jogador "sair de lá" voltar a liberar o mapa).
      setRemoteArea(false);
      setDiscovered(d => (d.indexOf(dest) === -1 ? [...d, dest] : d));
    } else if (resp.mapHint && resp.mapHint.enterInterior) {
      setMapScale(sc => (window.mwrpgHasInterior(partyAt) ? 'interior' : sc));
    } else if (resp.mapHint && resp.mapHint.enterInterior === false) {
      setMapScale('city');
    }

    // v0.7 — regra de acesso ao mapa pra cenas ad-hoc que não têm
    // registro fixo em maps.js (Assembleia 06, Seção 1.3).
    if (resp.mapHint && typeof resp.mapHint.remoteArea === 'boolean') {
      setRemoteArea(resp.mapHint.remoteArea);
    }

    // v0.7 — marcador de missão mínimo: um NPC revelou um local ainda
    // não visitado. Aparece no mapa sem revelar o terreno ao redor
    // (Seção 1.2) — nunca mistura com a lista de locais descobertos.
    if (resp.mapHint && resp.mapHint.revealMission && resp.mapHint.revealMission.id) {
      const rm = resp.mapHint.revealMission;
      setMissions(ms => (ms.some(m => m.id === rm.id) ? ms : [...ms, { id: rm.id, titulo: rm.titulo, localId: rm.localId, status: 'revelada' }]));
      setKnownMarkers(km => (km.some(k => k.locationId === rm.localId) ? km : [...km, { id: rm.id, title: rm.titulo, locationId: rm.localId }]));
    }

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

    // v0.4 — contagem de rodada da demo (só rodadas com narração real contam)
    setTurnCount(tc => {
      const next = tc + 1;
      if (next >= DEMO_LIMIT) {
        setDemoLocked(true);
        setOptions([]);
        setMessages(m => [...m, demoEndMessage()]);
      }
      return next;
    });

    setThinking(false);
  }

  // v0.6 — recomeço com história variada (Assembleia 05, Frente B):
  // sorteia uma semente nova (sem repetir a última, src/seeds.js) e
  // pede ao mestre uma abertura de verdade diferente, não o mesmo
  // texto fixo de sempre. Se a geração falhar por qualquer motivo
  // (offline, cota estourada), cai pro texto original — nunca trava.
  async function handleReset() {
    if (!confirm('Recomeçar a campanha? O progresso atual será perdido.')) return;
    setResetting(true);

    let newSeed = window.mwrpgPickNextSeed ? window.mwrpgPickNextSeed() : null;
    let opening;
    try {
      if (newSeed) {
        const resp = await window.MWRPG_MASTER.generateVariedIntro(newSeed);
        opening = {
          messages: [{ role: 'master', content: resp.narration }],
          history: [{ role: 'master', content: resp.narration }],
          options: resp.options,
          mode: resp.mode || 'dialog',
          partyAt: 'tavern'
        };
      } else {
        opening = freshIntro();
      }
    } catch (e) {
      console.error('handleReset: falha ao gerar abertura variada, usando texto padrão', e);
      opening = freshIntro();
      newSeed = null; // não persiste semente de uma abertura que não foi gerada
    }

    setMessages(opening.messages);
    setOptions(opening.options);
    setMode(opening.mode);
    history.current = opening.history;
    setPlayer(characterBase.current || window.MWRPG_DATA.player);
    setPartyAt(opening.partyAt);
    setMapScale('city');
    setCampaignSeed(newSeed);
    setDiscovered([opening.partyAt]);
    setKnownMarkers([]);
    setMissions([]);
    setRemoteArea(false);
    setCanContinue(false);
    setTurnCount(0);
    setDemoLocked(false);
    setResetting(false);
    window.MWRPG_STORAGE.clear();

    if (session && cloudSessionId.current) {
      const oldId = cloudSessionId.current;
      window.MWRPG_CLOUD.saveSession(oldId, { status: 'finished' }).catch(() => {});
      cloudSessionId.current = null;
      window.MWRPG_CLOUD.createSession(session.user.id, opening, characterId.current, newSeed, { discovered: [opening.partyAt] })
        .then(created => { cloudSessionId.current = created.id; })
        .catch(e => console.error('cloudSync: falha ao criar nova campanha', e));
    }
  }

  if (authChecking) return null;
  if (justConfirmed) return <SetPasswordGate onSetPassword={handleSetPassword} onSkip={handleSkipPassword} />;
  if (authRequired && !session) {
    return <LoginGate onSignIn={handleSignIn} onSignInPassword={handleSignInPassword} initialError={authInitialError} />;
  }
  if (authRequired && session && characterChecking) return null;
  if (authRequired && session && needsCharacter) {
    return <CharacterCreationGate onCreate={handleCreateCharacter} />;
  }

  return (
    <div className="app" data-screen-label="MWRPG — A Coroa Enterrada de Ys">
      <Topbar
        scenarioTitle={window.MWRPG_DATA.scenario.title}
        onReset={handleReset}
        resetting={resetting}
        canContinue={canContinue}
        onContinue={handleContinue}
        demoInfo={{ turnCount: Math.min(turnCount, DEMO_LIMIT), demoLimit: DEMO_LIMIT }}
        onSignOut={session ? handleSignOut : null}
      />

      <div className="col col-left">
        <Sheet char={player} isPlayer />
        <Sheet char={npcs[0]} />
      </div>

      <div className="col col-center">
        <Chat
          messages={messages}
          options={demoLocked ? [] : options}
          mode={mode}
          thinking={thinking}
          onChoose={handleChoose}
          onFreeText={handleFree}
          allowFree={tweaks.allowFreeText && !demoLocked}
        />
        <MapPanel
          partyAt={partyAt}
          mapScale={mapScale}
          onEnterInterior={handleEnterInterior}
          onExit={handleExitInterior}
          accessible={mapAccessible}
          discovered={discovered}
          knownMarkers={knownMarkers}
        />
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

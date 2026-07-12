// ============================================================================
// ALPHA / GEPARKT — Ueben (freie Drills: Grammatik, Produktion, Satzbau, Hoeren)
// ----------------------------------------------------------------------------
// Aus app.js ausgelagert (nicht Teil des roten Fadens). NICHT in die App
// eingebunden. Zum Reaktivieren zurueck nach app.js kopieren und Verdrahtung
// wiederherstellen (Tab, render()-Dispatch, Imports). Siehe alpha/BACKLOG.md.
// Abhaengigkeiten (aus app.js/Modulen): esc, openFlow, closeFlow, go, toast, shuffle, state, GRAMMAR, LESSONS, startedVocab, gainXp, reviewCard, recordAnswer, flushUnlocks, speak, sttSupported, listen, similarity, normalize
// ============================================================================

/* ============================ ÜBEN (Practice-Hub) ============================ */
function renderPractice() {
  const started = startedVocab().length;
  const weak = weakVocab().length;
  const sentences = buildSentencePool().length;
  const grammarN = grammarPool().length;
  const modes = [
    { id: 'produce', icon: '✍️', title: 'Produzieren', ok: started > 0, sub: 'Deutsch → Niederländisch selbst tippen', need: 'Erst ein paar Wörter lernen' },
    { id: 'build',   icon: '🧩', title: 'Satzbau',     ok: sentences > 0, sub: 'Wörter in die richtige Reihenfolge bringen', need: 'Erst eine Lektion machen' },
    { id: 'listen',  icon: '👂', title: 'Hören',       ok: started > 0 && ttsSupported(), sub: 'Niederländisch hören, Bedeutung erkennen', need: ttsSupported() ? 'Erst ein paar Wörter lernen' : 'Kein Ton auf diesem Gerät' },
    { id: 'grammar', icon: '📐', title: 'Grammatik',   ok: grammarN > 0, sub: 'Regeln aus deinen Lektionen testen', need: 'Erst eine Lektion machen' },
    { id: 'weak',    icon: '🎯', title: 'Schwachstellen', ok: weak > 0, sub: weak ? `${weak} wacklige Wörter gezielt üben` : 'Deine schwierigsten Wörter', need: 'Noch keine — üb ruhig mehr!' },
  ];
  app.innerHTML = `<div class="stack">
    <div class="section-title">Üben</div>
    <div class="section-sub">Aktiv produzieren statt nur wiedererkennen — hier sitzt es wirklich.</div>
    <div class="lgrid">${modes.map(m => `<button class="lesson" data-m="${m.id}" ${m.ok ? '' : 'disabled style="opacity:.5"'}>
      <span class="lem">${m.icon}</span>
      <span class="lmain"><b>${esc(m.title)}</b><span>${esc(m.ok ? m.sub : m.need)}</span></span></button>`).join('')}</div>
  </div>`;
  app.querySelectorAll('.lesson[data-m]').forEach(b => b.onclick = () =>
    ({ produce: openProduce, build: openBuild, listen: openListen, grammar: openGrammar, weak: openWeak }[b.dataset.m])());
}

// Grammatik-Fragen aus den Lektionen, die schon begonnen wurden.
function grammarPool() {
  const keys = new Set();
  for (const l of LESSONS) if (lessonStatus(l.id) !== 'neu' && l.grammar) keys.add(l.grammar);
  const out = [];
  for (const k of keys) {
    const g = GRAMMAR[k]; if (!g || !g.checks) continue;
    g.checks.forEach(c => out.push({ ...c, topic: g.title }));
  }
  return out;
}
// Grammatik-Trainer: Richtig/Falsch-Fragen aus mehreren Themen, interleaved.
function openGrammar() {
  const pool = shuffle(grammarPool()).slice(0, 10);
  if (!pool.length) { toast('Erst eine Lektion machen!', '📚'); return; }
  let i = 0;
  openFlow([{ render(body, foot, done) {
    const draw = () => {
      if (i >= pool.length) return done();
      const c = pool[i];
      body.innerHTML = `<div class="step-label">Grammatik · ${i + 1}/${pool.length}</div>
        <div class="step-title">${esc(c.q)}</div>
        <div class="muted" style="font-size:12px;margin-bottom:12px">Thema: ${esc(c.topic)}</div>
        <div class="choices">${c.options.map((o, oi) => `<button class="choice" data-o="${oi}">${esc(o)}</button>`).join('')}</div>`;
      let answered = false;
      body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
        if (answered) return; answered = true;
        const ok = +btn.dataset.o === c.answer;
        body.querySelectorAll('.choice').forEach(b2 => { if (+b2.dataset.o === c.answer) b2.classList.add('correct'); else if (b2 === btn) b2.classList.add('wrong'); });
        recordAnswer(ok); if (ok) gainXp(2); flushUnlocks();
        foot.innerHTML = `<button class="btn" id="n">${i === pool.length - 1 ? 'Fertig' : 'Weiter'}</button>`;
        foot.querySelector('#n').onclick = () => { i++; draw(); };
      });
      foot.innerHTML = '';
    };
    draw();
  }}], (fe) => finishScreen(fe, '📐', 'Grammatik geübt!', `${pool.length} Fragen`));
}

const stripArticle = (s) => s.replace(/^(de |het |een |'n )/, '');
function answerMatches(input, target) {
  const a = normalize(input), b = normalize(target);
  if (a === b) return true;
  if (stripArticle(a) === stripArticle(b)) return true;
  return similarity(a, b) >= 0.85 || similarity(stripArticle(a), stripArticle(b)) >= 0.85;
}
function buildSentencePool() {
  const out = [], seen = new Set();
  for (const l of LESSONS) {
    const cands = [...(l.speak || []), ...(l.dialogue || []).map(d => ({ nl: d.nl, de: d.de }))];
    for (const s of cands) {
      const w = s.nl.replace(/[.!?,„"…]/g, '').split(' ').filter(Boolean);
      if (w.length < 3 || w.length > 6 || seen.has(s.nl)) continue;
      seen.add(s.nl); out.push(s);
    }
  }
  return out;
}

// #2a — Produktion: Deutsch → Niederländisch selbst tippen (Toleranz-Check).
function openProduce() {
  const pool = shuffle(startedVocab().slice()).slice(0, 12);
  if (!pool.length) { toast('Erst ein paar Wörter lernen!', '📚'); return; }
  let i = 0;
  openFlow([{ render(body, foot, done) {
    const draw = () => {
      if (i >= pool.length) return done();
      const v = pool[i];
      body.innerHTML = `<div class="step-label">Produzieren · ${i + 1}/${pool.length}</div>
        <div class="step-title">Wie heißt das auf Niederländisch?</div>
        <div class="flash"><div class="trans" style="font-size:22px">${esc(v.de)}</div></div>
        <div class="field"><input id="ans" autocomplete="off" autocapitalize="off" autocorrect="off" placeholder="Auf Niederländisch tippen…"/></div>
        <div id="fb"></div>`;
      const inp = body.querySelector('#ans'); inp.focus();
      const check = () => {
        const val = inp.value.trim(); if (!val) return;
        const ok = answerMatches(val, v.nl);
        reviewCard(v.id, ok ? 'good' : 'again'); recordAnswer(ok); flushUnlocks();
        body.querySelector('#fb').innerHTML = `<div class="result ${ok ? 'ok' : 'no'}">${ok ? '✓ Richtig!' : 'Fast!'} Korrekt: <b>${esc(v.nl)}</b> — ${esc(v.de)}</div>`;
        inp.disabled = true; speak(v.nl);
        foot.innerHTML = `<button class="btn" id="n">${i === pool.length - 1 ? 'Fertig' : 'Weiter'}</button>`;
        foot.querySelector('#n').onclick = () => { i++; draw(); };
      };
      foot.innerHTML = `<button class="btn" id="c">Prüfen</button>`;
      foot.querySelector('#c').onclick = check;
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); inp.disabled ? foot.querySelector('#n')?.click() : check(); } });
    };
    draw();
  }}], (fe) => finishScreen(fe, '✍️', 'Produziert!', `${pool.length} Wörter aktiv geübt`));
}

// #2b — Satzbau: Wörter in die richtige Reihenfolge tippen.
function openBuild() {
  const pool = shuffle(buildSentencePool()).slice(0, 10);
  if (!pool.length) { toast('Erst eine Lektion machen!', '📚'); return; }
  let i = 0;
  openFlow([{ render(body, foot, done) {
    const draw = () => {
      if (i >= pool.length) return done();
      const s = pool[i];
      const words = s.nl.replace(/[.!?,„"…]/g, '').split(' ').filter(Boolean);
      const bank = shuffle(words.map((w, idx) => ({ w, key: idx })));
      let picked = [];
      const paint = () => {
        body.innerHTML = `<div class="step-label">Satzbau · ${i + 1}/${pool.length}</div>
          <div class="step-title">Bring die Wörter in die richtige Reihenfolge</div>
          <div class="muted" style="margin-bottom:10px">${esc(s.de)}</div>
          <div class="buildslot" id="slot">${picked.length ? picked.map((p, pi) => `<button class="chip" data-pi="${pi}">${esc(p.w)}</button>`).join('') : '<span class="muted">Tipp die Wörter unten an…</span>'}</div>
          <div class="buildbank" id="bank">${bank.map(c => picked.find(p => p.key === c.key) ? '' : `<button class="chip" data-key="${c.key}">${esc(c.w)}</button>`).join('')}</div>
          <div id="fb"></div>`;
        body.querySelectorAll('#bank .chip').forEach(b => b.onclick = () => { const k = +b.dataset.key; picked.push(bank.find(c => c.key === k)); paint(); });
        body.querySelectorAll('#slot .chip').forEach(b => b.onclick = () => { picked.splice(+b.dataset.pi, 1); paint(); });
        const complete = picked.length === words.length;
        foot.innerHTML = `<button class="btn" id="c" ${complete ? '' : 'disabled style="opacity:.5"'}>Prüfen</button>`;
        if (complete) foot.querySelector('#c').onclick = () => {
          const ok = normalize(picked.map(p => p.w).join(' ')) === normalize(words.join(' '));
          if (ok) { gainXp(3); flushUnlocks(); }
          body.querySelector('#fb').innerHTML = `<div class="result ${ok ? 'ok' : 'no'}">${ok ? '✓ Richtig!' : 'Nicht ganz:'} <b>${esc(s.nl)}</b></div>`;
          speak(s.nl);
          foot.innerHTML = `<button class="btn ghost" id="r">Nochmal</button><button class="btn" id="n">${i === pool.length - 1 ? 'Fertig' : 'Weiter'}</button>`;
          foot.querySelector('#r').onclick = () => { picked = []; paint(); };
          foot.querySelector('#n').onclick = () => { i++; draw(); };
        };
      };
      paint();
    };
    draw();
  }}], (fe) => finishScreen(fe, '🧩', 'Sätze gebaut!', 'Satzbau geübt'));
}

// #3 — Hören: Niederländisch hören, deutsche Bedeutung wählen.
function openListen() {
  const pool = shuffle(startedVocab().slice()).slice(0, 12);
  if (!pool.length) { toast('Erst ein paar Wörter lernen!', '📚'); return; }
  let i = 0;
  openFlow([{ render(body, foot, done) {
    const draw = () => {
      if (i >= pool.length) return done();
      const v = pool[i];
      const opts = shuffle([v.de, ...shuffle(ALL_VOCAB.filter(x => x.id !== v.id)).slice(0, 2).map(x => x.de)]);
      body.innerHTML = `<div class="step-label">Hören · ${i + 1}/${pool.length}</div>
        <div class="step-title">Was hörst du?</div>
        <div class="card" style="text-align:center"><button class="iconbtn" id="hear" style="width:64px;height:64px;font-size:28px">🔊</button>
          <div class="muted" style="margin-top:8px">Antippen zum Anhören</div></div>
        <div class="choices" style="margin-top:14px">${opts.map(o => `<button class="choice" data-de="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
      speak(v.nl);
      body.querySelector('#hear').onclick = () => speak(v.nl);
      let answered = false;
      body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
        if (answered) return; answered = true;
        const ok = btn.dataset.de === v.de;
        body.querySelectorAll('.choice').forEach(b2 => { if (b2.dataset.de === v.de) b2.classList.add('correct'); else if (b2 === btn) b2.classList.add('wrong'); });
        reviewCard(v.id, ok ? 'good' : 'again'); recordAnswer(ok); flushUnlocks();
        foot.innerHTML = `<button class="btn" id="n">${i === pool.length - 1 ? 'Fertig' : 'Weiter'}</button>`;
        foot.querySelector('#n').onclick = () => { i++; draw(); };
      });
      foot.innerHTML = '';
    };
    draw();
  }}], (fe) => finishScreen(fe, '👂', 'Gehört!', `${pool.length} Wörter geübt`));
}


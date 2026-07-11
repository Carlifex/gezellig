// ============================================================================
//  Gezellig v2 — App-Steuerung (deutsche UI, Inhalt Niederländisch)
// ============================================================================
import { LESSONS, GRAMMAR, CHAT, DAILY_GOALS } from './data.js';
import { statusLabel } from './srs.js';
import { speak, ttsSupported, setTtsEnabled, sttSupported, listen, similarity } from './speech.js';
import { reply as tutorReply, isMock, getEndpoint, setEndpoint } from './tutor.js';
import {
  state, save, levelInfo, dailyTasks, dueVocab, dueCount, reviewCard, completeLesson,
  chatTurn, speakResult, setSetting, resetAll, lessonStatus, milestoneState, takeUnlocks,
  todayXp, dailyGoalXp, goalMetToday, cardOf, ALL_VOCAB,
} from './progress.js';

setTtsEnabled(state.settings.tts);

const app = document.getElementById('app');
const tabbar = document.getElementById('tabbar');
let activeTab = 'today';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

/* ---------- toast / unlock notifications ---------- */
let toastEl = null, toastTimer = null;
function toast(msg, icon) {
  if (!toastEl) { toastEl = document.createElement('div'); toastEl.id = 'toast'; document.body.appendChild(toastEl); }
  toastEl.innerHTML = (icon ? `<span style="font-size:18px">${icon}</span>` : '') + `<span>${esc(msg)}</span>`;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
function flushUnlocks() {
  const u = takeUnlocks();
  u.forEach((m, i) => setTimeout(() => toast(`Meilenstein: ${m.title}`, m.icon), 400 + i * 2800));
}

/* ---------- tabs ---------- */
tabbar.hidden = false;
tabbar.querySelectorAll('button').forEach(b =>
  b.addEventListener('click', () => { activeTab = b.dataset.tab; syncTabs(); render(); }));
function syncTabs() { tabbar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tab === activeTab)); }
function go(tab) { activeTab = tab; syncTabs(); render(); }
function render() {
  ({ today: renderToday, lessons: renderLessons, vocab: renderVocab, chat: renderChat, profile: renderProfile }[activeTab] || renderToday)();
  window.scrollTo(0, 0);
}

/* ============================ START ============================ */
function renderToday() {
  const L = levelInfo();
  const due = dueCount();
  const goalXp = dailyGoalXp(), tXp = todayXp();
  const gpct = Math.min(100, Math.round(tXp / goalXp * 100));
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Guten Morgen!' : hour < 18 ? 'Guten Tag!' : 'Guten Abend!';
  const nextLesson = LESSONS.find(l => lessonStatus(l.id) === 'neu') || LESSONS.find(l => lessonStatus(l.id) !== 'gemeistert') || LESSONS[0];

  app.innerHTML = `
    <div class="stack">
      <div class="hero">
        <img src="illustrations/hero.webp" alt="Carlsson, Eni und die Katzen an einer Utrechter Gracht" loading="eager" onerror="this.closest('.hero').classList.add('noimg')"/>
        <div class="hero-cap">
          <div class="eyebrow">Gezellig · Deine Reise</div>
          <div class="greet">${greet}<small>${goalMetToday() ? 'Tagesziel geschafft — schön! 🎉' : 'Bereit für heute?'}</small></div>
        </div>
      </div>

      <div class="card levelcard">
        <div class="levelrow">
          <div class="lvicon">${L.icon}</div>
          <div class="lvtxt"><b>Level ${L.level} · ${esc(L.de)}</b><div class="nl">„${esc(L.nl)}"</div></div>
          <div class="lvnum"><b>${state.xp}</b><span>XP</span></div>
        </div>
        <div class="xpbar"><i style="width:${L.pct}%"></i></div>
        <div class="xpmeta"><span>${L.next ? `${L.into} / ${L.span} bis Level ${L.level + 1}` : 'Höchstes Level erreicht'}</span>
          <span>🔥 ${state.streak} ${state.streak === 1 ? 'Tag' : 'Tage'}</span></div>
      </div>

      <div class="card goal">
        <div class="dial" style="--p:${gpct}%"><i>${gpct}%</i></div>
        <div class="txt"><b>Tagesziel</b><div>${tXp} / ${goalXp} XP heute</div></div>
        <div class="streak"><b>🔥 ${state.streak}</b><span>STREAK</span></div>
      </div>

      <div>
        <div class="section-sub" style="margin:2px 0 10px">Heutige Aufgaben</div>
        <div class="tasks">${dailyTasks().map(taskRow).join('')}</div>
      </div>

      <button class="btn" id="learn">${nextLesson && lessonStatus(nextLesson.id) === 'neu' ? 'Nächste Lektion starten' : 'Weiterlernen'}</button>
      ${due ? `<button class="btn secondary" id="review">🔁 ${due} Wörter wiederholen</button>` : ''}
      <button class="btn ghost" id="quickchat">💬 Mit dem Bäcker reden</button>
    </div>`;

  app.querySelector('#learn').onclick = () => nextLesson ? openLesson(nextLesson.id) : go('lessons');
  const rv = app.querySelector('#review'); if (rv) rv.onclick = () => openReview();
  app.querySelector('#quickchat').onclick = () => go('chat');
}
function taskRow(t) {
  const cur = Math.min(state.daily.counters[t.metric], t.target);
  return `<div class="dtask ${t.done ? 'done' : ''}"><span class="box">${t.done ? '✓' : ''}</span>
    <b>${esc(t.label)}</b><span class="prog">${cur}/${t.target}</span></div>`;
}

/* ============================ LEKTIONEN ============================ */
function renderLessons() {
  app.innerHTML = `
    <div class="section-title">Lektionen</div>
    <div class="section-sub">Carlssons Geschichte in 9 Kapiteln — wähle selbst, wo du weitermachst.</div>
    <div class="lgrid">${LESSONS.map(l => {
      const st = lessonStatus(l.id);
      return `<button class="lesson" data-id="${l.id}">
        <span class="lem">${l.icon}</span>
        <span class="lmain"><span class="lchip">KAPITEL ${l.order}</span><b>${esc(l.title)}</b><span>${esc(l.situation)}</span></span>
        <span class="lst ${st}">${st}</span></button>`;
    }).join('')}</div>`;
  app.querySelectorAll('.lesson').forEach(b => b.onclick = () => openLesson(b.dataset.id));
}

/* ============================ WÖRTER ============================ */
function renderVocab() {
  const now = Date.now();
  const due = dueCount();
  const seen = ALL_VOCAB.filter(v => state.cards[v.id]);
  const rows = (seen.length ? seen : ALL_VOCAB).map(v => {
    const st = statusLabel(state.cards[v.id], now);
    return `<div class="vrow">
      <div><div class="nl">${esc(v.nl)}</div><div class="de">${esc(v.de)}</div></div>
      <button class="iconbtn play" data-say="${esc(v.nl)}" aria-label="vorlesen">🔊</button>
      <span class="st ${st.cls}">${st.text}</span></div>`;
  }).join('');
  app.innerHTML = `
    <div class="section-title">Wörter</div>
    <div class="section-sub">${seen.length} von ${ALL_VOCAB.length} gestartet · <b style="color:var(--orange-ink)">${due} jetzt fällig</b></div>
    ${due ? `<button class="btn" id="review" style="margin-bottom:16px">🔁 ${due} Wörter wiederholen</button>` : `<div class="warnbar" style="margin-bottom:16px">✅ Nichts fällig — mach eine Lektion, um neue Wörter zu lernen.</div>`}
    <div class="card" style="padding:6px 16px">${rows}</div>`;
  app.querySelectorAll('.play').forEach(b => b.onclick = () => speak(b.dataset.say));
  const rv = app.querySelector('#review'); if (rv) rv.onclick = () => openReview();
}

/* ============================ REDEN (Chat) ============================ */
function renderChat() {
  app.innerHTML = `
    <div class="section-title">Reden</div>
    <div class="section-sub">${isMock() ? 'Übungs-Modus (offline)' : 'Mit KI verbunden'} · beim Bäcker</div>
    <div class="chat-wrap">
      <div class="scen">🎭 ${esc(CHAT.scenarioDe)}</div>
      <div class="msgs" id="msgs"></div>
      <form class="composer" id="composer"><input id="cin" placeholder="Auf Niederländisch tippen…" autocomplete="off"/><button class="btn small" type="submit">➤</button></form>
    </div>`;
  mountChat(app.querySelector('#msgs'), app.querySelector('#composer'), app.querySelector('#cin'));
}
function mountChat(msgsEl, formEl, inputEl, onTurn) {
  const history = [];
  const add = (role, text, hint) => {
    const d = document.createElement('div');
    d.className = 'msg ' + (role === 'user' ? 'me' : 'bot');
    d.innerHTML = esc(text) + (hint ? `<span class="hint">${esc(hint)}</span>` : '');
    msgsEl.appendChild(d); window.scrollTo(0, document.body.scrollHeight);
  };
  add('assistant', CHAT.opener, CHAT.openerHint);
  history.push({ role: 'assistant', content: CHAT.opener });
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const txt = inputEl.value.trim(); if (!txt) return;
    inputEl.value = ''; add('user', txt); history.push({ role: 'user', content: txt });
    const think = document.createElement('div'); think.className = 'msg bot'; think.textContent = '…'; msgsEl.appendChild(think);
    const res = await tutorReply(history); think.remove();
    add('assistant', res.text, res.hint); history.push({ role: 'assistant', content: res.text });
    if (state.settings.tts) speak(res.text);
    chatTurn(); flushUnlocks();
    if (onTurn) onTurn(history);
  });
}

/* ============================ PROFIL ============================ */
function renderProfile() {
  const L = levelInfo();
  const words = ALL_VOCAB.filter(v => state.cards[v.id]).length;
  app.innerHTML = `
    <div class="section-title">Profil</div>
    <div class="section-sub">Dein Fortschritt & Einstellungen</div>

    <div class="card levelcard">
      <div class="levelrow"><div class="lvicon">${L.icon}</div>
        <div class="lvtxt"><b>Level ${L.level} · ${esc(L.de)}</b><div class="nl">${state.xp} XP gesamt</div></div>
        <div class="lvnum"><b>🔥 ${state.streak}</b><span>STREAK</span></div></div>
      <div class="xpbar"><i style="width:${L.pct}%"></i></div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="stat"><span>Sitzungen (Serie)</span><b>🔥 ${state.streak} Tage</b></div>
      <div class="stat"><span>Wiederholungen</span><b>${state.totals.reviews}</b></div>
      <div class="stat"><span>Wörter gelernt</span><b>${state.totals.wordsLearned}</b></div>
      <div class="stat"><span>Wörter gestartet</span><b>${words} / ${ALL_VOCAB.length}</b></div>
      <div class="stat"><span>Lektionen gemeistert</span><b>${state.totals.lessonsMastered} / ${LESSONS.length}</b></div>
      <div class="stat" style="border:none"><span>Gespräche geführt</span><b>${state.totals.chats}</b></div>
    </div>

    <div class="section-sub" style="margin:22px 0 8px">Meilensteine</div>
    <div class="msgrid">${milestoneState().map(m =>
      `<div class="ms ${m.unlocked ? '' : 'locked'}"><div class="em">${m.icon}</div><b>${esc(m.title)}</b><span>${esc(m.desc)}</span></div>`).join('')}</div>

    <div class="section-sub" style="margin:22px 0 8px">Tagesziel</div>
    <div class="seg" id="goalseg">${Object.entries(DAILY_GOALS).map(([k, g]) =>
      `<button data-g="${k}" class="${state.settings.dailyGoal === k ? 'on' : ''}">${g.label}<br><span style="font-size:11px;color:var(--muted)">${g.minutes} Min</span></button>`).join('')}</div>

    <div class="card" style="margin-top:16px">
      <div class="toggle"><span>🔊 Stimme vorlesen</span><button class="switch ${state.settings.tts ? 'on' : ''}" id="tts"><i></i></button></div>
      ${!ttsSupported() ? `<div class="warnbar" style="margin-top:10px">⚠️ Dieses Gerät kann keine Sprachausgabe im Browser.</div>` : ''}
      <div class="field"><label>KI-Proxy URL (optional — echter Gesprächspartner)</label>
        <input id="ep" placeholder="https://…/chat" value="${esc(getEndpoint())}"/>
        <span class="muted" style="font-size:12px">Leer = Offline-Bäcker. Siehe README.</span></div>
    </div>
    ${!sttSupported() ? `<div class="warnbar" style="margin-top:14px">🎤 Spracherkennung wird hier nicht unterstützt (z. B. iPhone). Beim Sprechen kannst du stattdessen tippen.</div>` : ''}
    <button class="btn ghost" id="reset" style="margin-top:16px">Fortschritt zurücksetzen</button>`;

  app.querySelectorAll('#goalseg button').forEach(b => b.onclick = () => { setSetting('dailyGoal', b.dataset.g); renderProfile(); });
  app.querySelector('#tts').onclick = () => { const v = !state.settings.tts; setSetting('tts', v); setTtsEnabled(v); renderProfile(); };
  const ep = app.querySelector('#ep'); ep.onchange = () => setEndpoint(ep.value.trim());
  app.querySelector('#reset').onclick = () => { if (confirm('Wirklich allen Fortschritt löschen?')) { resetAll(); go('today'); } };
}

/* ============================ FLOW-Engine ============================ */
let flowEl = null;
function openFlow(steps, onFinish) {
  let idx = 0;
  flowEl = document.createElement('div'); flowEl.className = 'flow'; document.body.appendChild(flowEl);
  tabbar.style.display = 'none';
  const total = steps.length;
  function show() {
    flowEl.innerHTML = `
      <div class="flow-top"><button class="iconbtn" id="close" aria-label="schließen">✕</button>
        <div class="progress"><i style="width:${Math.round(idx / total * 100)}%"></i></div>
        <span class="muted" style="font-size:12px;font-weight:700">${idx + 1}/${total}</span></div>
      <div class="flow-body" id="body"></div><div class="flow-foot" id="foot"></div>`;
    flowEl.querySelector('#close').onclick = closeFlow;
    steps[idx].render(flowEl.querySelector('#body'), flowEl.querySelector('#foot'), next);
  }
  function next() { idx++; if (idx >= total) return onFinish(flowEl); show(); }
  show();
}
function closeFlow() { if (flowEl) { flowEl.remove(); flowEl = null; } tabbar.style.display = ''; render(); }

/* ---------- LEKTION (erst blocken) ---------- */
function openLesson(lessonId) {
  const l = LESSONS.find(x => x.id === lessonId);
  const steps = [];
  if (l.story) steps.push(stepStory(l));
  steps.push(stepGrammar(l.grammar, 'Grammatik'), stepLearn(l.vocab), stepQuiz(l.vocab), stepDialogue(l), stepGrammarCheck(l.grammar));
  if (l.speak && l.speak.length) steps.push(stepSpeak(l.speak));
  if (l.culture) steps.push(stepCulture(l));
  openFlow(steps, (fe) => {
    const res = completeLesson(lessonId);
    flushUnlocks();
    fe.innerHTML = `<div class="flow-body"><div class="done">
      <div class="big">🎉</div><h2>Lektion geschafft!</h2>
      <p class="muted">${res && res.first ? `+${20 + (res.newWords || 0)} XP · ${res.newWords} neue Wörter im Training` : 'Wiederholt — gut gemacht!'}</p>
      <p class="muted">🔥 Streak: ${state.streak} · Level-XP: ${state.xp}</p>
      <button class="btn" id="fin" style="max-width:240px;margin-top:10px">Zurück</button></div></div>`;
    fe.querySelector('#fin').onclick = () => { go('today'); closeFlow(); };
  });
}

// Gerahmtes Szenen-Bild für einen Step. Fehlt die Datei, entfernt onerror es sauber.
// Quelle: neues l.images[slot], sonst (nur für 'story') das alte l.image.
function sceneImg(l, slot) {
  const src = (l.images && l.images[slot]) || (slot === 'story' ? l.image : null);
  return src ? `<img class="story-illus" src="${esc(src)}" alt="" loading="lazy" onerror="this.remove()"/>` : '';
}

function stepStory(l) {
  return { render(body, foot, done) {
    // Panel 1: Establishing-Illustration über der Text-Karte; ohne Bild Emoji-Fallback.
    const illus = sceneImg(l, 'story');
    const iconInCard = illus ? '' : `<div class="storyicon">${l.icon}</div>`;
    body.innerHTML = `<div class="step-label">Kapitel ${l.order}</div>
      <div class="step-title">${esc(l.title)}</div>
      ${illus}
      <div class="storycard">${iconInCard}<p>${l.story}</p></div>`;
    foot.innerHTML = `<button class="btn" id="n">Los geht’s</button>`;
    foot.querySelector('#n').onclick = done;
  }};
}
function stepCulture(l) {
  const c = l.culture;
  return { render(body, foot, done) {
    const illus = sceneImg(l, 'culture');
    body.innerHTML = `<div class="step-label">Kultur &amp; Geschichte</div>
      <div class="step-title">${esc(c.title)}</div>
      ${illus}
      <div class="culturecard">${illus ? '' : '<div class="cultureicon">🇳🇱</div>'}<p>${c.text}</p></div>`;
    foot.innerHTML = `<button class="btn" id="n">Weiter</button>`;
    foot.querySelector('#n').onclick = done;
  }};
}
function stepGrammar(gid, label) {
  const g = GRAMMAR[gid];
  return { render(body, foot, done) {
    body.innerHTML = `<div class="step-label">${esc(label)}</div><div class="step-title">${esc(g.title)}</div>
      <div class="gcard"><p>${g.body}</p><p style="margin-top:8px">${g.rule}</p></div>
      <p class="muted" style="font-size:13px">Kurz merken — gleich probierst du es aus.</p>`;
    foot.innerHTML = `<button class="btn" id="n">Verstanden</button>`;
    foot.querySelector('#n').onclick = done;
  }};
}
function stepLearn(vocab) {
  let i = 0;
  return { render(body, foot, done) {
    const draw = () => {
      if (i >= vocab.length) return done();
      const v = vocab[i];
      body.innerHTML = `<div class="step-label">Neue Wörter · ${i + 1}/${vocab.length}</div>
        <div class="step-title">Lern dieses Wort</div>
        <div class="flash"><div class="word">${esc(v.nl)}</div><div class="trans">${esc(v.de)}</div>
          <div class="ex">${esc(v.ex)} — ${esc(v.exDe)}</div>${v.note ? `<div class="ex" style="color:var(--orange-ink)">💡 ${esc(v.note)}</div>` : ''}</div>`;
      speak(v.nl);
      foot.innerHTML = `<button class="btn ghost" id="say">🔊 Nochmal hören</button><button class="btn" id="n">${i === vocab.length - 1 ? 'Weiter' : 'Kenne ich'}</button>`;
      foot.querySelector('#say').onclick = () => speak(v.nl);
      foot.querySelector('#n').onclick = () => { i++; draw(); };
    };
    draw();
  }};
}
function stepQuiz(vocab) {
  // Geblockte Übung: nur Wörter DIESER Lektion (baut deklarative Basis).
  let i = 0;
  const pool = vocab.slice();
  return { render(body, foot, done) {
    const draw = () => {
      if (i >= pool.length) return done();
      const v = pool[i];
      const others = shuffle(vocab.filter(x => x.id !== v.id).slice()).slice(0, 2);
      const opts = shuffle([v, ...others]);
      body.innerHTML = `<div class="step-label">Üben · ${i + 1}/${pool.length}</div>
        <div class="step-title">Was heißt „${esc(v.de)}"?</div>
        <div class="choices">${opts.map(o => `<button class="choice" data-id="${o.id}">${esc(o.nl)}</button>`).join('')}</div>`;
      let answered = false;
      body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
        if (answered) return; answered = true;
        const ok = btn.dataset.id === v.id;
        body.querySelectorAll('.choice').forEach(b2 => {
          if (b2.dataset.id === v.id) b2.classList.add('correct');
          else if (b2 === btn) b2.classList.add('wrong');
        });
        if (ok) speak(v.nl);
        foot.innerHTML = `<button class="btn" id="n">${i === pool.length - 1 ? 'Weiter' : 'Weiter'}</button>`;
        foot.querySelector('#n').onclick = () => { i++; draw(); };
      });
      foot.innerHTML = '';
    };
    draw();
  }};
}
function stepDialogue(l) {
  return { render(body, foot, done) {
    body.innerHTML = `<div class="step-label">Im Gespräch</div><div class="step-title">${esc(l.title)}</div>
      ${sceneImg(l, 'dialogue')}
      <p class="muted" style="font-size:13px">Tipp auf eine Zeile, um sie zu hören.</p>
      ${l.dialogue.map((d, k) => `<div class="line" data-i="${k}"><div class="who">${esc(d.who)}</div>
        <div><div class="nl">${esc(d.nl)}</div><div class="de">${esc(d.de)}</div></div><div class="spk">🔊</div></div>`).join('')}`;
    body.querySelectorAll('.line').forEach(el => el.onclick = () => speak(l.dialogue[+el.dataset.i].nl));
    foot.innerHTML = `<button class="btn" id="n">Weiter</button>`;
    foot.querySelector('#n').onclick = done;
  }};
}
function stepGrammarCheck(gid) {
  const checks = GRAMMAR[gid].checks;
  return { render(body, foot, done) {
    let ci = 0;
    const draw = () => {
      body.innerHTML = `<div class="step-label">Grammatik-Check</div><div class="step-title">Richtig oder falsch?</div>
        ${checks.map((c, k) => `<div class="card" style="margin-top:10px;opacity:${k > ci ? .4 : 1}">
          <div style="font-weight:700;margin-bottom:8px">${esc(c.q)}</div>
          <div class="row" style="gap:8px">${c.options.map((o, oi) =>
            `<button class="btn small ghost chk" data-k="${k}" data-o="${oi}" ${k === ci ? '' : 'disabled'} style="flex:1">${esc(o)}</button>`).join('')}</div></div>`).join('')}`;
      body.querySelectorAll('.chk').forEach(b => b.onclick = () => {
        if (+b.dataset.k !== ci) return;
        const ok = +b.dataset.o === checks[ci].answer;
        b.style.borderColor = ok ? 'var(--good)' : 'var(--bad)'; b.style.color = ok ? 'var(--good)' : 'var(--bad)';
        if (ok) { ci++; setTimeout(() => (ci >= checks.length ? done() : draw()), 380); }
      });
    };
    draw();
  }};
}
function stepSpeak(sentences) {
  let i = 0;
  return { render(body, foot, done) {
    const draw = () => {
      if (i >= sentences.length) return done();
      const s = sentences[i], supported = sttSupported();
      body.innerHTML = `<div class="step-label">Aussprache · ${i + 1}/${sentences.length}</div>
        <div class="step-title">Sprich laut nach</div>
        <div class="card"><div class="prompt-nl">${esc(s.nl)}</div><div class="prompt-de">${esc(s.de)}</div>
          <div class="rec"><button class="iconbtn" id="hear" style="width:52px;height:52px">🔊</button></div></div>
        <div id="area"></div>`;
      speak(s.nl);
      body.querySelector('#hear').onclick = () => speak(s.nl);
      const area = body.querySelector('#area');
      const finishRes = (ok, heard, err) => {
        speakResult(!!ok); flushUnlocks();
        const box = document.createElement('div'); box.className = 'result ' + (ok ? 'ok' : 'no');
        box.innerHTML = err ? '🎤 Nicht verstanden — nochmal oder überspringen.'
          : ok ? `✓ Gut! Gehört: „${esc(heard || '')}"` : `Fast! Gehört: „${esc(heard || '')}"`;
        area.appendChild(box);
        foot.innerHTML = `<button class="btn ghost" id="r">Nochmal</button><button class="btn" id="n">${i === sentences.length - 1 ? 'Fertig' : 'Weiter'}</button>`;
        foot.querySelector('#r').onclick = draw;
        foot.querySelector('#n').onclick = () => { i++; draw(); };
      };
      if (supported) {
        area.innerHTML = `<div class="rec"><button class="recbtn" id="mic">🎤</button><span class="muted" id="h" style="font-size:13px">Tippen & sprechen</span></div>`;
        const mic = area.querySelector('#mic'), h = area.querySelector('#h');
        mic.onclick = () => { mic.classList.add('live'); h.textContent = 'Höre zu…';
          listen({ onResult: (alts) => finishRes(Math.max(...alts.map(a => similarity(a, s.nl))) >= 0.6, alts[0]),
            onError: () => finishRes(null, null, true), onEnd: () => mic.classList.remove('live') }); };
      } else {
        area.innerHTML = `<div class="field"><label>🎤 Nicht unterstützt — tippe den Satz:</label><input id="typed" autocomplete="off"/></div>
          <button class="btn small" id="chk" style="margin-top:10px">Prüfen</button>`;
        area.querySelector('#chk').onclick = () => finishRes(similarity(area.querySelector('#typed').value, s.nl) >= 0.6, area.querySelector('#typed').value);
      }
      foot.innerHTML = `<button class="btn ghost" id="skip">Überspringen</button>`;
      foot.querySelector('#skip').onclick = () => { i++; draw(); };
    };
    draw();
  }};
}

/* ---------- REVIEW (interleaved SRS) ---------- */
function openReview() {
  const cards = dueVocab();
  if (!cards.length) { toast('Nichts fällig — mach eine Lektion!', '✅'); return; }
  let i = 0, revealed = false;
  const queue = shuffle(cards.slice());   // gemischt = interleaved
  openFlow([{ render(body, foot, done) {
    const draw = () => {
      if (i >= queue.length) return done();
      const v = queue[i];
      body.innerHTML = `<div class="step-label">Wiederholen · ${i + 1}/${queue.length}</div>
        <div class="step-title">Was heißt das?</div>
        <div class="flash"><div class="word">${esc(v.nl)}</div>
          ${revealed ? `<div class="trans">${esc(v.de)}</div><div class="ex">${esc(v.ex)}</div>` : '<div class="muted">Überleg… dann aufdecken.</div>'}</div>`;
      if (!revealed) {
        foot.innerHTML = `<button class="btn ghost" id="say">🔊</button><button class="btn" id="rev">Aufdecken</button>`;
        foot.querySelector('#say').onclick = () => speak(v.nl);
        foot.querySelector('#rev').onclick = () => { revealed = true; draw(); };
        speak(v.nl);
      } else {
        foot.innerHTML = `<div class="grades">
          <button class="grade again" data-g="again">Nochmal<small>&lt;1 Min</small></button>
          <button class="grade" data-g="hard">Schwer<small>morgen</small></button>
          <button class="grade good" data-g="good">Gut<small>Tage</small></button>
          <button class="grade" data-g="easy">Leicht<small>länger</small></button></div>`;
        foot.querySelectorAll('.grade').forEach(b => b.onclick = () => { reviewCard(v.id, b.dataset.g); flushUnlocks(); i++; revealed = false; draw(); });
      }
    };
    draw();
  }}], (fe) => {
    fe.innerHTML = `<div class="flow-body"><div class="done"><div class="big">✅</div><h2>Wiederholt!</h2>
      <p class="muted">${queue.length} Wörter · +${queue.length * 2} XP · 🔥 ${state.streak}</p>
      <button class="btn" id="fin" style="max-width:240px;margin-top:10px">Zurück</button></div></div>`;
    fe.querySelector('#fin').onclick = () => { go('today'); closeFlow(); };
  });
}

/* ---------- utils ---------- */
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- init ---------- */
syncTabs();
render();

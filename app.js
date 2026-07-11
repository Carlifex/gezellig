import { THEME, VOCAB, DIALOGUE, SPEAK, LISTEN, GRAMMAR, CHAT } from './data.js';
import { newCard, schedule, isDue, statusLabel } from './srs.js';
import { speak, ttsSupported, setTtsEnabled, sttSupported, listen, similarity } from './speech.js';
import { reply as tutorReply, isMock, getEndpoint, setEndpoint } from './tutor.js';

/* ------------------------------ Storage ------------------------------ */
const KEY = 'gezellig.state';
const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);

function load() {
  let s;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (_) {}
  if (!s) s = {};
  s.cards = s.cards || {};
  s.settings = s.settings || { tts: true };
  s.stats = s.stats || { sessions: 0, reviews: 0 };
  s.streak = s.streak || 0;
  s.lastSession = s.lastSession || null;
  s.todayDate = s.todayDate || null;
  s.todaySteps = s.todaySteps || 0;
  if (s.todayDate !== todayStr()) { s.todayDate = todayStr(); s.todaySteps = 0; }
  return s;
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
let state = load();
setTtsEnabled(state.settings.tts);

const cardOf = (id) => state.cards[id] || newCard();
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

/* ------------------------------ Root / tabs ------------------------------ */
const app = document.getElementById('app');
const tabbar = document.getElementById('tabbar');
let activeTab = 'today';

tabbar.hidden = false;
tabbar.querySelectorAll('button').forEach(b => {
  b.addEventListener('click', () => { activeTab = b.dataset.tab; syncTabs(); render(); });
});
function syncTabs() {
  tabbar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tab === activeTab));
}
function render() {
  if (activeTab === 'today') renderToday();
  else if (activeTab === 'vocab') renderVocab();
  else if (activeTab === 'chat') renderChatTab();
  else if (activeTab === 'profile') renderProfile();
  window.scrollTo(0, 0);
}

/* ------------------------------ Today ------------------------------ */
function dueCount() {
  const now = Date.now();
  return VOCAB.filter(v => isDue(state.cards[v.id], now)).length;
}
function renderToday() {
  const now = Date.now();
  const due = dueCount();
  const doneToday = state.lastSession === todayStr();
  const steps = state.todaySteps;
  const pct = Math.round((steps / 6) * 100);
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Goedemorgen!' : hour < 18 ? 'Goedemiddag!' : 'Goedenavond!';

  app.innerHTML = `
    <div class="stack">
      <div>
        <div class="eyebrow">Gezellig · ${esc(THEME.title)}</div>
        <div class="greet">${greet}<small>${doneToday ? 'Mooi, je dagsessie zit erop! 🎉' : 'Klaar voor je dagsessie?'}</small></div>
      </div>

      <div class="card goal">
        <div class="dial" style="--p:${pct}%"><i>${steps}/6</i></div>
        <div class="txt"><b>Dagdoel</b><div>${doneToday ? 'Voltooid' : steps ? `${6 - steps} stappen te gaan` : '6 korte stappen'}</div></div>
        <div class="streak"><b>🔥 ${state.streak}</b><span>DAGEN</span></div>
      </div>

      <button class="btn" id="start">${doneToday ? 'Nog een sessie' : 'Start dagsessie'}</button>

      <div>
        <div class="section-sub" style="margin:6px 0 10px">Wat er vandaag in zit</div>
        <div class="tasklist">
          <div class="task"><span class="em">🔁</span><div><b>Woorden herhalen</b><span>${due} woord(en) te oefenen</span></div></div>
          <div class="task"><span class="em">🗣️</span><div><b>Uitspraak</b><span>Zinnen naspreken bij de bakker</span></div></div>
          <div class="task"><span class="em">🎧</span><div><b>Luisteren & grammatica</b><span>de / het en een korte luisteroefening</span></div></div>
          <div class="task"><span class="em">💬</span><div><b>Praten met de bakker</b><span>Bestel iets — vrij gesprek</span></div></div>
        </div>
      </div>

      <button class="btn secondary" id="quickchat">💬 Even praten met de bakker</button>
    </div>`;

  app.querySelector('#start').addEventListener('click', () => startFlow());
  app.querySelector('#quickchat').addEventListener('click', () => { activeTab = 'chat'; syncTabs(); render(); });
}

/* ------------------------------ Vocab tab ------------------------------ */
function renderVocab() {
  const now = Date.now();
  const due = dueCount();
  const rows = VOCAB.map(v => {
    const st = statusLabel(state.cards[v.id], now);
    return `<div class="vrow">
      <div><div class="nl">${esc(v.nl)}</div><div class="de">${esc(v.de)}</div></div>
      <button class="iconbtn play" data-say="${esc(v.nl)}" aria-label="voorlezen">🔊</button>
      <span class="st ${st.cls}">${st.text}</span>
    </div>`;
  }).join('');
  app.innerHTML = `
    <div class="section-title">Woorden</div>
    <div class="section-sub">${VOCAB.length} woorden · <b style="color:var(--orange-ink)">${due} nu te herhalen</b></div>
    ${due ? `<button class="btn" id="review" style="margin-bottom:16px">Herhaal ${due} woord(en)</button>` : ''}
    <div class="card" style="padding:6px 16px">${rows}</div>`;
  app.querySelectorAll('.play').forEach(b => b.addEventListener('click', () => speak(b.dataset.say)));
  const rv = app.querySelector('#review');
  if (rv) rv.addEventListener('click', () => startReviewOnly());
}

/* ------------------------------ Chat tab ------------------------------ */
function renderChatTab() {
  app.innerHTML = `
    <div class="section-title">Praten</div>
    <div class="section-sub">${isMock() ? 'Oefen-modus (offline bakker)' : 'Verbonden met AI'} · Thema: bij de bakker</div>
    <div class="chat-wrap">
      <div class="scen">🎭 ${esc(CHAT.scenarioDe)}</div>
      <div class="msgs" id="msgs"></div>
      <form class="composer" id="composer">
        <input id="cin" placeholder="Typ in het Nederlands…" autocomplete="off" />
        <button class="btn small" type="submit">➤</button>
      </form>
    </div>`;
  mountChat(app.querySelector('#msgs'), app.querySelector('#composer'), app.querySelector('#cin'));
}

// Baut eine Chat-Konversation in die gegebenen Container. Gibt {history} zurück.
function mountChat(msgsEl, formEl, inputEl, onTurn) {
  const history = [];
  const addMsg = (role, text, hint) => {
    const div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'me' : 'bot');
    div.innerHTML = esc(text) + (hint ? `<span class="hint">${esc(hint)}</span>` : '');
    msgsEl.appendChild(div);
    msgsEl.parentElement.scrollTop = 1e9;
    window.scrollTo(0, document.body.scrollHeight);
  };
  // Opener vom Bäcker
  addMsg('assistant', CHAT.opener, CHAT.openerHint);
  history.push({ role: 'assistant', content: CHAT.opener });

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const txt = inputEl.value.trim();
    if (!txt) return;
    inputEl.value = '';
    addMsg('user', txt);
    history.push({ role: 'user', content: txt });
    const thinking = document.createElement('div');
    thinking.className = 'msg bot'; thinking.textContent = '…';
    msgsEl.appendChild(thinking);
    const res = await tutorReply(history);
    thinking.remove();
    addMsg('assistant', res.text, res.hint);
    history.push({ role: 'assistant', content: res.text });
    if (state.settings.tts) speak(res.text);
    if (onTurn) onTurn(history);
  });
  return { history };
}

/* ------------------------------ Profile ------------------------------ */
function renderProfile() {
  const learned = VOCAB.filter(v => (state.cards[v.id] || {}).reps > 0).length;
  app.innerHTML = `
    <div class="section-title">Profiel</div>
    <div class="section-sub">Je voortgang & instellingen</div>
    <div class="card">
      <div class="stat"><span>Huidige streak</span><b>🔥 ${state.streak} dagen</b></div>
      <div class="stat"><span>Sessies voltooid</span><b>${state.stats.sessions}</b></div>
      <div class="stat"><span>Woorden herhaald</span><b>${state.stats.reviews}</b></div>
      <div class="stat"><span>Woorden gestart</span><b>${learned} / ${VOCAB.length}</b></div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="toggle"><span>🔊 Stem voorlezen (TTS)</span>
        <button class="switch ${state.settings.tts ? 'on' : ''}" id="ttsToggle" aria-label="TTS"><i></i></button></div>
      ${!ttsSupported() ? `<div class="warnbar" style="margin-top:10px">⚠️ Dit apparaat ondersteunt geen spraakuitvoer in de browser.</div>` : ''}
      <div class="field">
        <label>AI-proxy URL (optioneel — voor de echte Claude-gesprekspartner)</label>
        <input id="ep" placeholder="https://…/chat" value="${esc(getEndpoint())}" />
        <span class="muted" style="font-size:12px">Leeg = offline oefen-bakker. Zie README voor de proxy.</span>
      </div>
    </div>

    ${!sttSupported() ? `<div class="warnbar" style="margin-top:14px">🎤 Spraakherkenning wordt hier niet ondersteund (bijv. iPhone/Safari). Je kunt bij de uitspraak-oefening in plaats daarvan typen.</div>` : ''}

    <button class="btn ghost" id="reset" style="margin-top:16px">Voortgang wissen</button>`;

  app.querySelector('#ttsToggle').addEventListener('click', () => {
    state.settings.tts = !state.settings.tts; setTtsEnabled(state.settings.tts); save(); renderProfile();
  });
  const ep = app.querySelector('#ep');
  ep.addEventListener('change', () => { setEndpoint(ep.value.trim()); });
  app.querySelector('#reset').addEventListener('click', () => {
    if (confirm('Alle voortgang wissen?')) { localStorage.removeItem(KEY); state = load(); renderProfile(); }
  });
}

/* ------------------------------ Guided flow ------------------------------ */
let flowEl = null;

function pickReviewCards(limit) {
  const now = Date.now();
  const due = VOCAB.filter(v => isDue(state.cards[v.id], now));
  const pool = due.length ? due : VOCAB.slice();          // wenn nichts fällig: neue Wörter
  return pool.slice(0, limit);
}

function startReviewOnly() {
  const cards = pickReviewCards(8);
  openFlow([ stepReview(cards, 'Woorden herhalen') ], { review: true });
}

function startFlow() {
  const cards = pickReviewCards(6);
  openFlow([
    stepReview(cards, 'Opwarmen'),
    stepDialogue(),
    stepSpeak(),
    stepListen(),
    stepGrammar(),
    stepChat(),
  ], { review: false });
}

function openFlow(steps, opts) {
  let idx = 0;
  flowEl = document.createElement('div');
  flowEl.className = 'flow';
  document.body.appendChild(flowEl);
  tabbar.style.display = 'none';

  const total = steps.length;
  function show() {
    const step = steps[idx];
    flowEl.innerHTML = `
      <div class="flow-top">
        <button class="iconbtn" id="close" aria-label="sluiten">✕</button>
        <div class="progress"><i style="width:${Math.round((idx / total) * 100)}%"></i></div>
        <span class="muted" style="font-size:12px;font-weight:700">${idx + 1}/${total}</span>
      </div>
      <div class="flow-body" id="body"></div>
      <div class="flow-foot" id="foot"></div>`;
    flowEl.querySelector('#close').addEventListener('click', closeFlow);
    step.render(flowEl.querySelector('#body'), flowEl.querySelector('#foot'), next);
  }
  function next() {
    state.todaySteps = Math.min(6, state.todaySteps + 1); save();
    idx++;
    if (idx >= total) return finish(opts);
    show();
  }
  show();
}
function closeFlow() {
  if (flowEl) { flowEl.remove(); flowEl = null; }
  tabbar.style.display = '';
  render();
}
function finish(opts) {
  if (!opts.review) {
    // Streak & Statistik nur bei voller Tagessession
    const t = todayStr();
    if (state.lastSession !== t) {
      state.streak = (state.lastSession === yesterdayStr()) ? state.streak + 1 : 1;
      state.lastSession = t;
      state.stats.sessions += 1;
    }
    state.todaySteps = 6;
  }
  save();
  flowEl.innerHTML = `
    <div class="flow-body"><div class="done">
      <div class="big">🎉</div>
      <h2>${opts.review ? 'Goed geoefend!' : 'Dagsessie voltooid!'}</h2>
      <p class="muted">${opts.review ? 'Je woorden zijn bijgewerkt.' : `Streak: 🔥 ${state.streak} dagen · Tot morgen!`}</p>
      <button class="btn" id="fin" style="max-width:240px;margin-top:10px">Terug naar start</button>
    </div></div>`;
  flowEl.querySelector('#fin').addEventListener('click', () => { activeTab = 'today'; syncTabs(); closeFlow(); });
}

/* ---- Step: SRS review ---- */
function stepReview(cards, label) {
  let i = 0, revealed = false;
  const queue = cards.slice();
  return {
    render(body, foot, done) {
      if (!queue.length) { done(); return; }
      const draw = () => {
        if (i >= queue.length) { done(); return; }
        const v = queue[i];
        body.innerHTML = `
          <div class="step-label">${esc(label)} · ${i + 1}/${queue.length}</div>
          <div class="step-title">Wat betekent dit?</div>
          <div class="flash">
            <div class="word">${esc(v.nl)}</div>
            ${revealed ? `<div class="trans">${esc(v.de)}</div><div class="ex">${esc(v.ex || '')}</div>` : `<div class="muted">Denk na… dan tonen.</div>`}
          </div>`;
        if (!revealed) {
          foot.innerHTML = `<button class="btn ghost" id="say">🔊 Hoor het</button><button class="btn" id="reveal">Antwoord tonen</button>`;
          foot.querySelector('#say').onclick = () => speak(v.nl);
          foot.querySelector('#reveal').onclick = () => { revealed = true; draw(); };
          speak(v.nl);
        } else {
          foot.innerHTML = `<div class="grades">
            <button class="grade again" data-g="again">Opnieuw<small>&lt;1 min</small></button>
            <button class="grade" data-g="hard">Moeilijk<small>morgen</small></button>
            <button class="grade good" data-g="good">Goed<small>paar dagen</small></button>
            <button class="grade" data-g="easy">Makkelijk<small>langer</small></button></div>`;
          foot.querySelectorAll('.grade').forEach(b => b.onclick = () => {
            state.cards[v.id] = schedule(cardOf(v.id), b.dataset.g, Date.now());
            state.stats.reviews += 1; save();
            i++; revealed = false; draw();
          });
        }
      };
      draw();
    },
  };
}

/* ---- Step: dialogue input ---- */
function stepDialogue() {
  return {
    render(body, foot, done) {
      body.innerHTML = `
        <div class="step-label">Luister & lees</div>
        <div class="step-title">${esc(THEME.title)}</div>
        <p class="muted" style="font-size:13.5px">Tik op een zin om hem te horen.</p>
        ${DIALOGUE.map((l, k) => `
          <div class="line" data-i="${k}">
            <div class="who">${esc(l.who)}</div>
            <div><div class="nl">${esc(l.nl)}</div><div class="de">${esc(l.de)}</div></div>
            <div class="spk">🔊</div>
          </div>`).join('')}`;
      body.querySelectorAll('.line').forEach(el => el.onclick = () => speak(DIALOGUE[+el.dataset.i].nl));
      foot.innerHTML = `<button class="btn" id="next">Verder</button>`;
      foot.querySelector('#next').onclick = done;
    },
  };
}

/* ---- Step: speaking ---- */
function stepSpeak() {
  let i = 0;
  return {
    render(body, foot, done) {
      const draw = () => {
        if (i >= SPEAK.length) { done(); return; }
        const s = SPEAK[i];
        const supported = sttSupported();
        body.innerHTML = `
          <div class="step-label">Uitspraak · ${i + 1}/${SPEAK.length}</div>
          <div class="step-title">Zeg dit hardop</div>
          <div class="card"><div class="prompt-nl">${esc(s.nl)}</div><div class="prompt-de">${esc(s.de)}</div>
            <div class="rec">
              <button class="iconbtn" id="hear" aria-label="hoor" style="width:52px;height:52px">🔊</button>
            </div>
          </div>
          <div id="area"></div>`;
        body.querySelector('#hear').onclick = () => speak(s.nl);
        const area = body.querySelector('#area');

        if (supported) {
          area.innerHTML = `<div class="rec"><button class="recbtn" id="mic">🎤</button>
            <span class="muted" id="hint" style="font-size:13px">Tik en spreek</span></div>`;
          const mic = area.querySelector('#mic'), hint = area.querySelector('#hint');
          mic.onclick = () => {
            mic.classList.add('live'); hint.textContent = 'Luisteren…';
            listen({
              onResult: (alts) => {
                const best = Math.max(...alts.map(a => similarity(a, s.nl)));
                showResult(best >= 0.6, alts[0]);
              },
              onError: () => showResult(null, null, true),
              onEnd: () => { mic.classList.remove('live'); },
            });
          };
        } else {
          area.innerHTML = `<div class="field"><label>🎤 Niet ondersteund — typ de zin na:</label>
            <input id="typed" placeholder="Typ hier…" autocomplete="off" /></div>
            <button class="btn small" id="check" style="margin-top:10px">Controleer</button>`;
          area.querySelector('#check').onclick = () => {
            const val = area.querySelector('#typed').value;
            showResult(similarity(val, s.nl) >= 0.6, val);
          };
        }
        function showResult(ok, heard, err) {
          const box = document.createElement('div');
          box.className = 'result ' + (ok ? 'ok' : 'no');
          box.innerHTML = err
            ? '🎤 Ik kon je niet verstaan — probeer opnieuw of sla over.'
            : ok ? `✓ Goed! Ik hoorde: „${esc(heard || '')}"` : `Bijna! Ik hoorde: „${esc(heard || '')}"`;
          area.appendChild(box);
          foot.innerHTML = `<button class="btn ghost" id="retry">Nog eens</button><button class="btn" id="nx">${i === SPEAK.length - 1 ? 'Klaar' : 'Volgende'}</button>`;
          foot.querySelector('#retry').onclick = draw;
          foot.querySelector('#nx').onclick = () => { i++; draw(); };
        }
        foot.innerHTML = `<button class="btn ghost" id="skip">Overslaan</button>`;
        foot.querySelector('#skip').onclick = () => { i++; draw(); };
      };
      draw();
    },
  };
}

/* ---- Step: listening ---- */
function stepListen() {
  let i = 0;
  return {
    render(body, foot, done) {
      const draw = () => {
        if (i >= LISTEN.length) { done(); return; }
        const item = LISTEN[i];
        body.innerHTML = `
          <div class="step-label">Luisteren · ${i + 1}/${LISTEN.length}</div>
          <div class="step-title">Wat hoor je?</div>
          <div class="center" style="margin:10px 0">
            <button class="recbtn" id="play" style="background:var(--blue-2);box-shadow:0 6px 20px rgba(47,111,176,.35)">▶</button>
          </div>
          <p class="center muted">${esc(item.q)}</p>
          <div class="choices">${item.options.map((o, k) => `<button class="choice" data-k="${k}">${esc(o)}</button>`).join('')}</div>`;
        body.querySelector('#play').onclick = () => speak(item.audio);
        speak(item.audio);
        let answered = false;
        body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
          if (answered) return; answered = true;
          const k = +btn.dataset.k;
          body.querySelectorAll('.choice').forEach((b, bi) => {
            if (bi === item.answer) b.classList.add('correct');
            else if (bi === k) b.classList.add('wrong');
          });
          foot.innerHTML = `<button class="btn" id="nx">${i === LISTEN.length - 1 ? 'Verder' : 'Volgende'}</button>`;
          foot.querySelector('#nx').onclick = () => { i++; draw(); };
        });
        foot.innerHTML = `<button class="btn ghost" id="rep">🔊 Nog eens</button>`;
        foot.querySelector('#rep').onclick = () => speak(item.audio);
      };
      draw();
    },
  };
}

/* ---- Step: grammar ---- */
function stepGrammar() {
  return {
    render(body, foot, done) {
      let ci = 0;
      const draw = () => {
        const checksHtml = GRAMMAR.checks.map((c, k) => {
          const state_ = k < ci ? 'done' : k === ci ? 'active' : 'todo';
          return `<div style="margin-top:${k ? 10 : 14}px;opacity:${state_ === 'todo' ? .4 : 1}">
            <div style="font-weight:700;margin-bottom:6px">${esc(c.q)}</div>
            <div class="row" style="gap:8px">${c.options.map((o, oi) =>
              `<button class="btn small ghost chk" data-k="${k}" data-o="${oi}" ${state_ === 'active' ? '' : 'disabled'} style="flex:1">${esc(o)}</button>`).join('')}</div>
          </div>`;
        }).join('');
        body.innerHTML = `
          <div class="step-label">Grammatica</div>
          <div class="gcard">
            <h3>${esc(GRAMMAR.title)}</h3>
            <p>${GRAMMAR.body}</p>
            <p>${GRAMMAR.rule}</p>
          </div>
          <div class="card"><div class="muted" style="font-size:13px;margin-bottom:4px">Snelle check</div>${checksHtml}</div>`;
        body.querySelectorAll('.chk').forEach(b => b.onclick = () => {
          const k = +b.dataset.k, o = +b.dataset.o;
          if (k !== ci) return;
          const ok = o === GRAMMAR.checks[k].answer;
          b.style.borderColor = ok ? 'var(--good)' : 'var(--bad)';
          b.style.color = ok ? 'var(--good)' : 'var(--bad)';
          if (ok) { ci++; setTimeout(draw, 350); }
        });
        foot.innerHTML = `<button class="btn" id="next" ${ci < GRAMMAR.checks.length ? 'disabled' : ''}>Verder</button>`;
        const nb = foot.querySelector('#next'); if (nb && ci >= GRAMMAR.checks.length) nb.onclick = done;
      };
      draw();
    },
  };
}

/* ---- Step: chat ---- */
function stepChat() {
  return {
    render(body, foot, done) {
      body.innerHTML = `
        <div class="step-label">Praten</div>
        <div class="step-title">Bestel iets bij de bakker</div>
        <div class="scen">🎭 ${esc(CHAT.scenarioDe)}</div>
        <div class="msgs" id="msgs" style="margin-top:12px"></div>`;
      foot.innerHTML = `
        <form class="composer" id="cform" style="flex:1"><input id="cin" placeholder="Typ in het Nederlands…" autocomplete="off"/><button class="btn small" type="submit">➤</button></form>`;
      let turns = 0;
      mountChat(body.querySelector('#msgs'), foot.querySelector('#cform'), foot.querySelector('#cin'), () => {
        turns++;
        if (turns >= 2) {
          // Nach 2 Antworten "Klaar"-Button anbieten
          if (!foot.querySelector('#fin')) {
            const b = document.createElement('button');
            b.className = 'btn'; b.id = 'fin'; b.textContent = 'Klaar ✓'; b.style.flex = '0 0 auto';
            b.onclick = done; foot.appendChild(b);
          }
        }
      });
    },
  };
}

/* ------------------------------ Init ------------------------------ */
syncTabs();
render();

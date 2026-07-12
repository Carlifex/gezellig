// ============================================================================
//  Gezellig v2 — App-Steuerung (deutsche UI, Inhalt Niederländisch)
// ============================================================================
import { LESSONS, GRAMMAR, CHAT_SCENARIOS, DAILY_GOALS } from './data.js';
import { statusLabel } from './srs.js';
import { speak, speakSequence, ttsSupported, setTtsEnabled, setTtsRate, sttSupported, listen, similarity, normalize } from './speech.js';
import {
  state, save, levelInfo, dailyTasks, dueVocab, dueCount, reviewCard, completeLesson,
  chatTurn, speakResult, setSetting, resetAll, lessonStatus, milestoneState, takeUnlocks,
  todayXp, dailyGoalXp, goalMetToday, cardOf, ALL_VOCAB, gainXp, weakVocab, startedVocab,
  recordAnswer, historyLast, stats, unstartedVocab, unstartedCount, learnWords,
  recordExam, examState, examPassed,
} from './progress.js';

setTtsEnabled(state.settings.tts);
setTtsRate(state.settings.rate);
function applyTheme(t) {
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme; // auto = System
}
applyTheme(state.settings.theme);

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
  ({ today: renderToday, lessons: renderLessons, vocab: renderVocab, profile: renderProfile }[activeTab] || renderToday)();
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
      <div class="herocar" id="herocar">${TRACKS.map(heroSlide).join('')}</div>
      <div class="cardots" id="cardots">${TRACKS.map((_, i) => `<button class="dot ${i === 0 ? 'on' : ''}" data-i="${i}" aria-label="Cover ${i + 1}"></button>`).join('')}</div>

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
    </div>`;

  app.querySelector('#learn').onclick = () => nextLesson ? openLesson(nextLesson.id) : go('lessons');
  const rv = app.querySelector('#review'); if (rv) rv.onclick = () => openReview();

  // Hero-Carousel: Cover anklicken → Kapitel öffnen; Punkte = durchklicken; Wisch-Sync.
  app.querySelectorAll('.heroslide').forEach(b => b.onclick = () => openTrack(b.dataset.track));
  const car = app.querySelector('#herocar'), dots = [...app.querySelectorAll('#cardots .dot')];
  if (car) {
    const step = () => car.clientWidth || 1;
    dots.forEach(d => d.onclick = () => car.scrollTo({ left: (+d.dataset.i) * step(), behavior: 'smooth' }));
    car.addEventListener('scroll', () => {
      const idx = Math.round(car.scrollLeft / step());
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    }, { passive: true });
  }
}
function taskRow(t) {
  const cur = Math.min(state.daily.counters[t.metric], t.target);
  return `<div class="dtask ${t.done ? 'done' : ''}"><span class="box">${t.done ? '✓' : ''}</span>
    <b>${esc(t.label)}</b><span class="prog">${cur}/${t.target}</span></div>`;
}

/* ============================ LEKTIONEN ============================ */
// Lektions-Tracks: der Story-Bogen plus thematische Sammlungen.
const TRACKS = [
  { key: 'verhaal',  icon: '🧡', level: 'A1', label: 'Familie Kirsch zieht nach Utrecht', heroTitle: 'Familie Kirsch zieht nach Utrecht', hero: 'illustrations/hero.webp', sub: 'Der durchgehende Handlungsbogen — wähle selbst, wo du weitermachst.', chip: 'KAPITEL' },
  { key: 'personen', icon: '🎨', level: 'A2', label: 'Berühmte Persönlichkeiten', heroTitle: 'Berühmte Persönlichkeiten', hero: 'illustrations/cover-personen.webp', sub: 'Zehn Niederländer:innen, die die Welt geprägt haben.',               chip: 'PORTRÄT' },
  { key: 'mythen',   icon: '🌷', level: 'A2', label: 'Mythen & Kuriositäten',     heroTitle: 'Mythen & Kuriositäten',     hero: 'illustrations/cover-mythen.webp', sub: 'Zehn Eigenheiten, die die Niederlande ausmachen.',                    chip: 'FAKT' },
  { key: 'ade',      icon: '🎧', level: 'B1', label: 'Amsterdam Dance Event',     heroTitle: 'Amsterdam Dance Event',     hero: 'illustrations/cover-ade.webp', sub: 'Die Geschichte des größten Dance-Events der Welt.',                   chip: 'ADE' },
  { key: 'feest',    icon: '🎉', level: 'B1', label: 'Niederländische Feierkultur', heroTitle: 'Niederländische Feierkultur', hero: 'illustrations/cover-feest.webp', sub: 'Von Gabber bis Borrel — wie die Niederlande feiern.',               chip: 'FEEST' },
  { key: 'natuurkunde', icon: '⚛️', level: 'C1', label: 'Nederlandse natuurkundigen', heroTitle: 'Licht, Tijd & Ruimte', hero: 'illustrations/cover-natuurkunde.webp', sub: 'Huygens, Lorentz & Zeeman — Physik, Leben und die Politik ihrer Epoche. Höchstes Niveau, viel Fachsprache.', chip: 'PHYSICUS' },
];
const trackLessons = (key) => LESSONS.filter(l => (l.track || 'verhaal') === key);

// Kapitel mit eigenem Bild-Icon (illustrations/icons/<id>.webp); sonst Emoji-Fallback.
const ICON_IDS = new Set([
  // verhaal
  'aankomst','wonen','bakker','boodschappen','tijd','weg','platenzaak','beurs','ontbijt','plantenwinkel','ramen','terras','markt','avond','verjaardag','amsterdam','liquicity','void','optreden',
  // personen
  'per_vangogh','per_rembrandt','per_annefrank','per_cruyff','per_verstappen','per_willemvanoranje','per_erasmus','per_leeuwenhoek','per_escher','per_arminvanbuuren',
  // mythen
  'myth_deich','myth_oranje','myth_polder','myth_tulpen','myth_fietsen','myth_sinterklaas','myth_gedoog','myth_kaas','myth_uitwaaien','myth_koningsdag',
  // ade
  'ade_watis','ade_begin','ade_conference','ade_hoofdstad','ade_tiesto','ade_armin','ade_dutchhouse','ade_venues','ade_top100','ade_vandaag',
  // feest
  'feest_gabber','feest_thunderdome','feest_housewelle','feest_mysteryland','feest_sensation','feest_qdance','feest_awakenings','feest_freeparty','feest_koningsdag','feest_borrel',
  // natuurkunde — Huygens
  'nat_hu1','nat_hu2','nat_hu3','nat_hu4','nat_hu5','nat_hu6','nat_hu7','nat_hu8','nat_hu9','nat_hu10',
  // natuurkunde — Lorentz
  'nat_lo1','nat_lo2','nat_lo3','nat_lo4','nat_lo5','nat_lo6','nat_lo7','nat_lo8','nat_lo9','nat_lo10',
  // natuurkunde — Zeeman
  'nat_ze1','nat_ze2','nat_ze3','nat_ze4','nat_ze5','nat_ze6','nat_ze7','nat_ze8','nat_ze9','nat_ze10',
]);
const lemIcon = (l) => ICON_IDS.has(l.id)
  ? `<img class="lem-img" src="illustrations/icons/${l.id}.webp" alt="" loading="lazy">`
  : l.icon;

// Abgeschlossene Kapitel: ✅ statt Wort; gemeistert: 🏆.
function statusBadge(st) {
  if (st === 'gemeistert') return `<span class="lst done" title="gemeistert">🏆</span>`;
  if (st === 'gelernt')    return `<span class="lst done" title="abgeschlossen">✅</span>`;
  return `<span class="lst neu">neu</span>`;
}

function lessonBtn(l, chip, n) {
  const label = chip === 'KAPITEL' ? `KAPITEL ${l.order}` : `${chip} ${n}`;
  return `<button class="lesson" data-id="${l.id}">
    <span class="lem">${lemIcon(l)}</span>
    <span class="lmain"><span class="lchip">${label}</span><b>${esc(l.title)}</b><span>${esc(l.situation)}</span></span>
    ${statusBadge(lessonStatus(l.id))}</button>`;
}

function renderLessons() {
  const sections = TRACKS.map(t => {
    const ls = trackLessons(t.key);
    if (!ls.length) return '';
    const done = ls.filter(l => lessonStatus(l.id) !== 'neu').length;
    const pct = Math.round(done / ls.length * 100);
    return `<div class="section-title" id="track-${t.key}">${esc(t.label)}</div>
      <div class="section-sub">${esc(t.sub)}</div>
      <div class="tprog"><div class="tprog-bar"><i style="width:${pct}%"></i></div><span>${done}/${ls.length}</span></div>
      <div class="lgrid">${ls.map((l, i) => lessonBtn(l, t.chip, i + 1)).join('')}</div>
      ${examCard(t, ls)}`;
  }).join('');
  app.innerHTML = `<div class="stack">${sections}</div>`;
  app.querySelectorAll('.lesson').forEach(b => b.onclick = () => openLesson(b.dataset.id));
  app.querySelectorAll('.examcard').forEach(b => b.onclick = () => openExam(b.dataset.exam));
}

// Abschlussprüfung eines Kapitels: erscheint am Ende der Lektionsliste.
// Freigeschaltet, wenn alle Lektionen des Kapitels durchgearbeitet sind;
// bestanden ab 80 % richtiger Antworten.
function examUnlocked(ls) { return ls.length > 0 && ls.every(l => lessonStatus(l.id) !== 'neu'); }
function examCard(t, ls) {
  const unlocked = examUnlocked(ls);
  const ex = examState(t.key);
  const passed = !!(ex && ex.passed);
  const cls = passed ? 'passed' : unlocked ? 'ready' : 'locked';
  const icon = passed ? '🏅' : unlocked ? '📝' : '🔒';
  const sub = passed ? `Bestanden — Bestleistung ${ex.bestPct}%`
    : unlocked ? '10 Fragen · ab 80 % richtig bestanden'
    : `Erst alle ${ls.length} Lektionen abschließen`;
  const badge = passed ? '<span class="lst done">🏅</span>'
    : unlocked ? '<span class="lst neu">Start</span>'
    : '<span class="lst lock">🔒</span>';
  return `<button class="examcard ${cls}" data-exam="${t.key}">
    <span class="lem">${icon}</span>
    <span class="lmain"><span class="lchip">ABSCHLUSSPRÜFUNG</span><b>Prüfung: ${esc(t.label)}</b><span>${esc(sub)}</span></span>
    ${badge}</button>`;
}

// Hero-Slide fürs Start-Carousel: Kapitel-Deckblatt mit Titel drin.
// Ohne Bild (hero=''): Platzhalter mit Icon + „Cover folgt".
function heroSlide(t) {
  const ls = trackLessons(t.key);
  const done = ls.filter(l => lessonStatus(l.id) !== 'neu').length;
  const img = t.hero
    ? `<img src="${esc(t.hero)}" alt="" loading="eager" onerror="this.closest('.heroslide').classList.add('noimg')"/>`
    : '';
  return `<button class="heroslide ${t.hero ? '' : 'noimg'}" data-track="${t.key}">
    ${img}<span class="heroslide-ph">${t.icon}</span>
    <div class="hero-cap">
      <div class="hero-top"><span class="hero-lvl">${esc(t.level)}</span><span class="hero-prog">${done}/${ls.length} ✅</span></div>
      <div class="greet hero-title">${esc(t.heroTitle)}</div>
    </div></button>`;
}

// Zu einem Track springen (Lektionen-Tab, zur Sektion scrollen).
function openTrack(key) {
  go('lessons');
  requestAnimationFrame(() => {
    const el = document.getElementById('track-' + key);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ============================ WÖRTER ============================ */
let vocabFilter = 'alle', vocabQuery = '';
function renderVocab() {
  const now = Date.now();
  const q = normalize(vocabQuery);
  const weakIds = new Set(weakVocab(999).map(v => v.id));
  const isMast = (c) => c && c.reps >= 2 && c.S >= 8;
  const match = (v) => {
    const c = state.cards[v.id];
    if (q && !(normalize(v.nl).includes(q) || normalize(v.de).includes(q))) return false;
    switch (vocabFilter) {
      case 'due':        return !!(c && c.reps && c.due <= now);
      case 'neu':        return !c || !c.reps;
      case 'gelernt':    return !!(c && c.reps && !isMast(c));
      case 'gemeistert': return isMast(c);
      case 'schwierig':  return weakIds.has(v.id);
      default:           return true;
    }
  };
  const filters = [['alle', 'Alle'], ['due', 'Fällig'], ['neu', 'Neu'], ['gelernt', 'Gelernt'], ['gemeistert', 'Gemeistert'], ['schwierig', 'Schwierig']];
  const list = ALL_VOCAB.filter(match);
  const rows = list.map(v => {
    const st = statusLabel(state.cards[v.id], now);
    return `<div class="vrow"><div><div class="nl">${esc(v.nl)}</div><div class="de">${esc(v.de)}</div></div>
      <button class="iconbtn play" data-say="${esc(v.nl)}" aria-label="vorlesen">🔊</button>
      <span class="st ${st.cls}">${st.text}</span></div>`;
  }).join('') || '<div class="muted" style="padding:16px;text-align:center">Keine Wörter — anderer Filter oder Suchbegriff?</div>';
  const started = ALL_VOCAB.filter(v => state.cards[v.id] && state.cards[v.id].reps).length;
  const due = dueCount();
  app.innerHTML = `
    <div class="section-title">Wörter</div>
    <div class="section-sub">${started} von ${ALL_VOCAB.length} gestartet · <b style="color:var(--orange-ink)">${due} fällig</b></div>
    <div class="field" style="margin:2px 0 10px"><input id="vq" placeholder="🔎 Suchen (niederländisch oder deutsch)…" value="${esc(vocabQuery)}" autocomplete="off"/></div>
    <div class="seg wrap" id="vf">${filters.map(([k, l]) => `<button data-f="${k}" class="${vocabFilter === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    ${due ? `<button class="btn" id="review" style="margin:12px 0 4px">🔁 ${due} Wörter wiederholen</button>` : ''}
    <button class="btn ghost" id="learnnew" style="margin:8px 0 4px">➕ Neue Wörter lernen (${unstartedCount()} verfügbar)</button>
    <div class="section-sub" style="margin:12px 0 6px">${list.length} ${list.length === 1 ? 'Wort' : 'Wörter'}</div>
    <div class="card" style="padding:6px 16px">${rows}</div>`;
  app.querySelectorAll('.play').forEach(b => b.onclick = () => speak(b.dataset.say));
  const rv = app.querySelector('#review'); if (rv) rv.onclick = () => openReview();
  app.querySelectorAll('#vf button').forEach(b => b.onclick = () => { vocabFilter = b.dataset.f; renderVocab(); });
  const qi = app.querySelector('#vq');
  qi.oninput = () => { vocabQuery = qi.value; const p = qi.selectionStart; renderVocab(); const n = app.querySelector('#vq'); n.focus(); n.setSelectionRange(p, p); };
  const ln = app.querySelector('#learnnew'); if (ln) ln.onclick = () => openLearnNew();
}

// Neue Wörter aus der großen Vokabelbank ins Training holen (Reihenfolge: A1→A2→B1).
function openLearnNew(n = 8) {
  const pool = unstartedVocab(n);
  if (!pool.length) { toast('Alle Wörter sind schon im Training! 🎉', '➕'); return; }
  openFlow([stepLearn(pool)], (fe) => {
    const added = learnWords(pool); flushUnlocks();
    finishScreen(fe, '➕', `${added} neue ${added === 1 ? 'Wort' : 'Wörter'}!`, 'Sie sind jetzt in deinem Training.', 'vocab');
  });
}

/* ============================ PROFIL ============================ */
const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
function statsCard() {
  const s = stats();
  const hist = historyLast(7);
  const maxXp = Math.max(10, ...hist.map(h => h.xp));
  const total = hist.reduce((a, h) => a + h.xp, 0);
  const bars = hist.map(h => {
    const lbl = WD[new Date(h.date + 'T00:00:00').getDay()];
    const pct = Math.round(h.xp / maxXp * 100);
    return `<div class="bar"><div class="bar-fill" style="height:${Math.max(3, pct)}%" title="${h.xp} XP"></div><span>${lbl}</span></div>`;
  }).join('');
  return `
    <div class="section-sub" style="margin:22px 0 8px">Statistik</div>
    <div class="card">
      <div class="stat-head"><b>XP — letzte 7 Tage</b><span class="muted">${total} XP</span></div>
      <div class="chart">${bars}</div>
    </div>
    <div class="statgrid">
      <div class="sg"><b>🔥 ${s.streak}</b><span>Serie (Tage)</span></div>
      <div class="sg"><b>${s.maxStreak}</b><span>Längste Serie</span></div>
      <div class="sg"><b>${s.mastered}</b><span>Wörter gemeistert</span></div>
      <div class="sg"><b>${s.due}</b><span>Jetzt fällig</span></div>
      <div class="sg"><b>${s.accuracy == null ? '—' : s.accuracy + '%'}</b><span>Trefferquote (aktiv)</span></div>
      <div class="sg"><b>${s.started}/${s.total}</b><span>Wörter gestartet</span></div>
    </div>`;
}

function trackBadges() {
  return `<div class="section-sub" style="margin:22px 0 8px">Lernpfad-Abzeichen</div>
    <div class="msgrid">${TRACKS.map(t => {
      const ls = trackLessons(t.key);
      const done = ls.filter(l => lessonStatus(l.id) !== 'neu').length;
      const mast = ls.filter(l => lessonStatus(l.id) === 'gemeistert').length;
      const unlocked = done === ls.length, gold = mast === ls.length;
      const mark = gold ? '🏆' : unlocked ? '✅' : t.icon;
      const txt = gold ? 'Alle gemeistert!' : unlocked ? 'Alle Kapitel geschafft' : `${done}/${ls.length} Kapitel`;
      return `<div class="ms ${unlocked ? '' : 'locked'}"><div class="em">${mark}</div><b>${esc(t.label)}</b><span>${txt}</span></div>`;
    }).join('')}</div>`;
}

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

    ${statsCard()}

    ${trackBadges()}

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
      <div class="field" style="margin-top:8px"><label>🐢 Sprechtempo</label>
        <div class="seg" id="rateseg">${[['0.8', 'Langsam'], ['0.92', 'Normal'], ['1.05', 'Zügig']].map(([v, l]) => `<button data-r="${v}" class="${String(state.settings.rate) === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
      <div class="field"><label>🎨 Erscheinungsbild</label>
        <div class="seg" id="themeseg">${[['auto', 'Auto'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([v, l]) => `<button data-t="${v}" class="${state.settings.theme === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
    </div>
    ${!sttSupported() ? `<div class="warnbar" style="margin-top:14px">🎤 Spracherkennung wird hier nicht unterstützt (z. B. iPhone). Beim Sprechen kannst du stattdessen tippen.</div>` : ''}
    <button class="btn ghost" id="intro" style="margin-top:16px">🚀 Einführung nochmal ansehen</button>
    <button class="btn ghost" id="reset" style="margin-top:10px">Fortschritt zurücksetzen</button>`;

  app.querySelector('#intro').onclick = () => runOnboarding();

  app.querySelectorAll('#goalseg button').forEach(b => b.onclick = () => { setSetting('dailyGoal', b.dataset.g); renderProfile(); });
  app.querySelector('#tts').onclick = () => { const v = !state.settings.tts; setSetting('tts', v); setTtsEnabled(v); renderProfile(); };
  app.querySelectorAll('#rateseg button').forEach(b => b.onclick = () => {
    setSetting('rate', +b.dataset.r); setTtsRate(+b.dataset.r);
    app.querySelectorAll('#rateseg button').forEach(x => x.classList.toggle('on', x === b));
    speak('Hallo, ik heet Carlsson.');
  });
  app.querySelectorAll('#themeseg button').forEach(b => b.onclick = () => {
    setSetting('theme', b.dataset.t); applyTheme(b.dataset.t);
    app.querySelectorAll('#themeseg button').forEach(x => x.classList.toggle('on', x === b));
  });
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

// Abschluss-Screen für kurze Flows (neue Wörter lernen, SRS-Review).
function finishScreen(fe, emoji, title, sub, returnTab) {
  fe.innerHTML = `<div class="flow-body"><div class="done"><div class="big">${emoji}</div><h2>${esc(title)}</h2>
    <p class="muted">${sub}</p><button class="btn" id="fin" style="max-width:240px;margin-top:10px">Zurück</button></div></div>`;
  fe.querySelector('#fin').onclick = () => { go(returnTab || 'today'); closeFlow(); };
}

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

/* ---------- ABSCHLUSSPRÜFUNG (Kapitel-Ende, 80%-Schwelle) ---------- */
// Baut die Prüfungsfragen: Mix aus Vokabel-Quiz (de→nl) und Grammatik-Checks
// aus allen Lektionen des Kapitels.
function buildExamQuestions(key, n = 10) {
  const ls = trackLessons(key);
  const seen = new Set(); const vocab = [];
  ls.forEach(l => (l.vocab || []).forEach(v => { if (v && !seen.has(v.id)) { seen.add(v.id); vocab.push(v); } }));
  const gkeys = [...new Set(ls.map(l => l.grammar).filter(Boolean))];
  const gchecks = [];
  gkeys.forEach(g => (GRAMMAR[g] && GRAMMAR[g].checks || []).forEach(c => gchecks.push(c)));

  const nGram = Math.min(gchecks.length, Math.min(3, Math.max(0, n - 4)));
  const nVocab = Math.min(vocab.length, n - nGram);
  const qs = [];
  shuffle(vocab.slice()).slice(0, nVocab).forEach(v => {
    const distr = shuffle(vocab.filter(x => x.id !== v.id)).slice(0, 3);
    const opts = shuffle([v, ...distr]);
    qs.push({ q: `Was heißt „${esc(v.de)}"?`, options: opts.map(o => esc(o.nl)), answer: opts.indexOf(v) });
  });
  shuffle(gchecks.slice()).slice(0, nGram).forEach(c =>
    qs.push({ q: esc(c.q), options: c.options.map(esc), answer: c.answer }));
  return shuffle(qs);
}

function examStep(question, num, total, score) {
  return { render(body, foot, done) {
    body.innerHTML = `<div class="step-label">Prüfung · Frage ${num}/${total}</div>
      <div class="step-title">${question.q}</div>
      <div class="choices">${question.options.map((o, i) => `<button class="choice" data-i="${i}">${o}</button>`).join('')}</div>`;
    let answered = false;
    body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
      if (answered) return; answered = true;
      const chosen = +btn.dataset.i;
      const ok = chosen === question.answer;
      if (ok) score.correct++;
      recordAnswer(ok);
      body.querySelectorAll('.choice').forEach((b2, i) => {
        if (i === question.answer) b2.classList.add('correct');
        else if (i === chosen) b2.classList.add('wrong');
      });
      foot.innerHTML = `<button class="btn" id="n">${num === total ? 'Auswertung' : 'Weiter'}</button>`;
      foot.querySelector('#n').onclick = done;
    });
    foot.innerHTML = '';
  }};
}

function openExam(key) {
  const track = TRACKS.find(t => t.key === key);
  const ls = trackLessons(key);
  if (!examUnlocked(ls)) { toast(`Erst alle ${ls.length} Lektionen abschließen.`, '🔒'); return; }
  const questions = buildExamQuestions(key, 10);
  const total = questions.length;
  if (!total) { toast('Keine Fragen verfügbar.', '📝'); return; }
  const score = { correct: 0 };
  const steps = questions.map((q, i) => examStep(q, i + 1, total, score));
  openFlow(steps, (fe) => {
    const res = recordExam(key, score.correct, total);
    flushUnlocks();
    examResult(fe, track, res, score.correct, total);
  });
}

function examResult(fe, track, res, correct, total) {
  const pass = res.pass;
  fe.innerHTML = `<div class="flow-body"><div class="done">
    <div class="big">${pass ? '🏅' : '📚'}</div>
    <h2>${pass ? 'Prüfung bestanden!' : 'Noch nicht bestanden'}</h2>
    <p class="muted"><b style="color:${pass ? 'var(--good)' : 'var(--orange-ink)'}">${res.pct}%</b> · ${correct}/${total} richtig${pass ? '' : ' · mindestens 80% nötig'}</p>
    <p class="muted">${pass
      ? (res.firstPass ? `Kapitel „${esc(track.label)}" abgeschlossen! +${res.xpGain} XP` : `Erneut bestanden — Bestleistung ${res.bestPct}%.`)
      : 'Wiederhol ein paar Lektionen und versuch es dann noch einmal.'}</p>
    <div class="row" style="gap:8px;margin-top:12px;width:100%;max-width:300px">
      ${pass ? '' : `<button class="btn ghost" id="retry" style="flex:1">Nochmal</button>`}
      <button class="btn" id="fin" style="flex:1">Zurück</button></div></div></div>`;
  const rt = fe.querySelector('#retry');
  if (rt) rt.onclick = () => { closeFlow(); openExam(track.key); };
  fe.querySelector('#fin').onclick = () => { go('lessons'); closeFlow(); };
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
      <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:4px">
        <p class="muted" style="font-size:13px;margin:0">Tipp auf eine Zeile, um sie zu hören.</p>
        ${ttsSupported() ? '<button class="btn small ghost" id="playall">▶ Ganzer Dialog</button>' : ''}</div>
      ${l.dialogue.map((d, k) => `<div class="line" data-i="${k}"><div class="who">${esc(d.who)}</div>
        <div><div class="nl">${esc(d.nl)}</div><div class="de">${esc(d.de)}</div></div><div class="spk">🔊</div></div>`).join('')}`;
    body.querySelectorAll('.line').forEach(el => el.onclick = () => speak(l.dialogue[+el.dataset.i].nl));
    const pa = body.querySelector('#playall'); if (pa) pa.onclick = () => speakSequence(l.dialogue.map(d => d.nl));
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

/* ---------- REVIEW / SCHWACHSTELLEN (interleaved SRS-Flash) ---------- */
function flashStep(queue, label) {
  let i = 0, revealed = false;
  return { render(body, foot, done) {
    const draw = () => {
      if (i >= queue.length) return done();
      const v = queue[i];
      body.innerHTML = `<div class="step-label">${esc(label)} · ${i + 1}/${queue.length}</div>
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
  }};
}
function runFlashReview(cards, opts) {
  if (!cards.length) { toast(opts.empty, opts.emoji); return; }
  const queue = shuffle(cards.slice());   // gemischt = interleaved
  openFlow([flashStep(queue, opts.label)], (fe) =>
    finishScreen(fe, opts.emoji, opts.title, `${queue.length} Wörter · +${queue.length * 2} XP · 🔥 ${state.streak}`, opts.returnTab));
}
function openReview() {
  runFlashReview(dueVocab(), { label: 'Wiederholen', emoji: '✅', title: 'Wiederholt!', empty: 'Nichts fällig — mach eine Lektion!', returnTab: 'today' });
}
function openWeak() {
  runFlashReview(weakVocab(), { label: 'Schwachstellen', emoji: '🎯', title: 'Stärker geworden!', empty: 'Keine Schwachstellen — stark!', returnTab: 'practice' });
}

/* ---------- ONBOARDING (Erst-Start) ---------- */
function runOnboarding() {
  const goals = Object.entries(DAILY_GOALS);
  const steps = [
    { render(body, foot, done) {
      body.innerHTML = `<div style="text-align:center;padding-top:8px">
        <img src="icons/icon-192.png" alt="" style="width:104px;height:104px;border-radius:24px;box-shadow:var(--shadow)"/>
        <h2 style="margin:18px 0 6px">Welkom bij Gezellig!</h2>
        <p class="muted" style="font-size:15px;line-height:1.5">Deine persönliche Reise, um <b>Niederländisch</b> zu lernen — mit Carlssons Geschichte, Vokabel-Training, Sprechen und echten Gesprächen.</p></div>`;
      foot.innerHTML = `<button class="btn" id="n">Los geht’s</button>`; foot.querySelector('#n').onclick = done;
    }},
    { render(body, foot, done) {
      body.innerHTML = `<div class="step-title">Wie viel Zeit pro Tag?</div>
        <p class="muted" style="font-size:13px;margin-bottom:14px">Nur ein Tagesziel — jederzeit im Profil änderbar.</p>
        <div class="seg" id="g">${goals.map(([k, g]) => `<button data-g="${k}" class="${state.settings.dailyGoal === k ? 'on' : ''}">${g.label}<br><span style="font-size:11px;color:var(--muted)">${g.minutes} Min</span></button>`).join('')}</div>`;
      body.querySelectorAll('#g button').forEach(b => b.onclick = () => { setSetting('dailyGoal', b.dataset.g); body.querySelectorAll('#g button').forEach(x => x.classList.toggle('on', x === b)); });
      foot.innerHTML = `<button class="btn" id="n">Weiter</button>`; foot.querySelector('#n').onclick = done;
    }},
    { render(body, foot, done) {
      body.innerHTML = `<div class="step-title">Stimme &amp; Aussprache 🔊</div>
        <p class="muted" style="font-size:14px;margin-bottom:14px">Gezellig liest dir jedes niederländische Wort vor. Probier’s:</p>
        <div class="card" style="text-align:center"><div class="prompt-nl">Hallo, ik heet Carlsson.</div>
          <div class="rec"><button class="iconbtn" id="say" style="width:56px;height:56px;font-size:24px">🔊</button></div></div>
        ${ttsSupported() ? '' : '<div class="warnbar" style="margin-top:12px">⚠️ Dieses Gerät kann keine Sprachausgabe im Browser — du kannst trotzdem alles lernen.</div>'}
        <div class="toggle" style="margin-top:16px"><span>🔊 Automatisch vorlesen</span><button class="switch ${state.settings.tts ? 'on' : ''}" id="tts"><i></i></button></div>`;
      body.querySelector('#say').onclick = () => speak('Hallo, ik heet Carlsson.');
      body.querySelector('#tts').onclick = () => { const v = !state.settings.tts; setSetting('tts', v); setTtsEnabled(v); body.querySelector('#tts').classList.toggle('on', v); };
      speak('Hallo, ik heet Carlsson.');
      foot.innerHTML = `<button class="btn" id="n">Weiter</button>`; foot.querySelector('#n').onclick = done;
    }},
    { render(body, foot, done) {
      body.innerHTML = `<div class="done"><div class="big">🎉</div><h2>Alles bereit!</h2>
        <p class="muted">Oben auf der Startseite wischst du durch die Kapitel. Beginne mit „Ankunft in Utrecht" — veel plezier!</p></div>`;
      foot.innerHTML = `<button class="btn" id="n">Jetzt starten</button>`; foot.querySelector('#n').onclick = done;
    }},
  ];
  openFlow(steps, () => { localStorage.setItem('gezellig.onboarded', '1'); closeFlow(); go('today'); });
}

/* ---------- utils ---------- */
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- init ---------- */
syncTabs();
render();
// Ladescreen (Splash) sanft ausblenden, sobald die App bereit ist.
(function dismissSplash() {
  const s = document.getElementById('splash');
  if (!s) return;
  const hide = () => { s.classList.add('hide'); setTimeout(() => s.remove(), 600); };
  setTimeout(hide, 900); // kurze, nahtlose Überblendung (nach nativem Launch-Screen)
})();
// Erst-Start-Onboarding: nur für neue Nutzer (kein Fortschritt); sonst still überspringen.
if (!localStorage.getItem('gezellig.onboarded')) {
  if (state.totals.lessonsDone === 0 && !state.lastGoalDate && state.xp === 0) runOnboarding();
  else localStorage.setItem('gezellig.onboarded', '1');
}

// ============================================================================
//  Gezellig v2 — App-Steuerung (deutsche UI, Inhalt Niederländisch)
// ============================================================================
import { LESSONS, GRAMMAR, GRAMMAR_EXAMPLES, CHAT_SCENARIOS, DAILY_GOALS } from './data.js';
import { statusLabel } from './srs.js';
import { speak, speakSequence, ttsSupported, setTtsEnabled, setTtsRate, sttSupported, listen, similarity, normalize } from './speech.js';
import {
  state, save, levelInfo, dailyTasks, dueVocab, dueCount, reviewCard, completeLesson,
  chatTurn, speakResult, setSetting, resetAll, lessonStatus, milestoneState, takeUnlocks,
  todayXp, dailyGoalXp, goalMetToday, cardOf, ALL_VOCAB, gainXp, weakVocab, startedVocab,
  recordAnswer, historyLast, stats, unstartedVocab, unstartedCount, learnWords,
  recordExam, examState, examPassed,
  introWord, trackVocab, trackVocabReady, dailyNewLimit,
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
let activeTrack = null; // null = Kapitelübersicht; sonst Schlüssel des offenen Kapitels

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

/* ---------- toast / unlock notifications ---------- */
let toastEl = null, toastTimer = null;
function toast(msg, icon, iconHtml) {
  if (!toastEl) { toastEl = document.createElement('div'); toastEl.id = 'toast'; document.body.appendChild(toastEl); }
  const iconPart = icon ? (iconHtml ? `<span class="ticon">${icon}</span>` : `<span style="font-size:18px">${icon}</span>`) : '';
  toastEl.innerHTML = iconPart + `<span>${esc(msg)}</span>`;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
function flushUnlocks() {
  const u = takeUnlocks();
  u.forEach((m, i) => setTimeout(() => {
    const icon = MEDAL_ART.has(m.id)
      ? `<img src="illustrations/medals/${m.id}.webp" alt="" style="width:34px;height:34px;object-fit:contain;vertical-align:middle">`
      : (m.icon || '🏅');
    toast(`Meilenstein: ${m.title}`, icon, MEDAL_ART.has(m.id));
  }, 400 + i * 2800));
}

/* ---------- tabs ---------- */
tabbar.hidden = false;
tabbar.querySelectorAll('button').forEach(b =>
  b.addEventListener('click', () => go(b.dataset.tab)));
function syncTabs() { tabbar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tab === activeTab)); }
function go(tab, track) { activeTab = tab; if (tab === 'lessons') activeTrack = track ?? null; syncTabs(); render(); }
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
  const curKey = (nextLesson && nextLesson.track) || 'verhaal';
  const curIdx = Math.max(0, TRACKS.filter(x => trackLessons(x.key).length).findIndex(t => t.key === curKey));
  const heroTracks = TRACKS.filter(x => trackLessons(x.key).length);
  const learnLabel = nextLesson && lessonStatus(nextLesson.id) === 'neu' ? 'Nächste Lektion starten' : 'Weiterlernen';

  app.innerHTML = `
    <div class="stack">
      <div class="herocar" id="herocar">${heroTracks.map(heroSlide).join('')}</div>
      <div class="cardots" id="cardots">${heroTracks.map((_, i) => `<button class="dot ${i === curIdx ? 'on' : ''}" data-i="${i}" aria-label="Cover ${i + 1}"></button>`).join('')}</div>

      <button class="btn learn-cta" id="learn"><span class="learn-ic">${nextLesson ? lemIcon(nextLesson) : '📚'}</span><span>${learnLabel}</span></button>
      ${due ? `<button class="btn secondary" id="review">🔁 ${due} Wörter wiederholen</button>` : ''}

      <div class="card levelcard">
        <div class="levelrow">
          <div class="lvicon">${rankIcon(L)}</div>
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
    // Startseite öffnet direkt beim aktuellen Kapitel.
    requestAnimationFrame(() => { car.scrollLeft = curIdx * step(); });
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
  { key: 'verhaal',  icon: '🧡', level: 'A1', label: 'Familie Kirsch zieht nach Utrecht', heroTitle: 'Familie Kirsch zieht nach Utrecht', hero: 'illustrations/hero.webp', sub: 'Der durchgehende Handlungsbogen: Familie Kirsch zieht nach Utrecht und meistert den ganz normalen Alltag — Wohnung, Bäckerei, Einkaufen, Termine, Markt und erste Ausgehabende. Du wählst selbst, wo du weitermachst.', chip: 'KAPITEL' },
  { key: 'personen', icon: '🎨', level: 'A2', label: 'Ikonen der Niederlande', heroTitle: 'Ikonen der Niederlande', hero: 'illustrations/cover-personen.webp', sub: 'Zehn Niederländer:innen, die die Welt geprägt haben — von Van Gogh und Rembrandt über Cruyff und Verstappen bis Anne Frank und Escher. Eingebettet in ihre Lebensgeschichten tauchst du in Kunst, Sport, Wissenschaft und Geschichte ein.', chip: 'PORTRÄT' },
  { key: 'mythen',   icon: '🌷', level: 'A2', label: 'Mythen & Kuriositäten',     heroTitle: 'Mythen & Kuriositäten',     hero: 'illustrations/cover-mythen.webp', sub: 'Zehn Eigenheiten, die die Niederlande ausmachen — vom Jungen am Deich über Tulpenmanie und Fahrradland bis Sinterklaas, Käse und „uitwaaien". Alltagsmythen rund um Kultur, Wetter und Traditionen.', chip: 'FAKT' },
  { key: 'ade',      icon: '🎧', level: 'B1', label: 'Amsterdam Dance Event',     heroTitle: 'Amsterdam Dance Event',     hero: 'illustrations/cover-ade.webp', sub: 'Die Geschichte des Amsterdam Dance Event, des größten Dance-Events der Welt — von den Anfängen 1996 über Tiësto und Armin van Buuren bis zu legendären Venues und der DJ-Mag-Top-100.', chip: 'ADE' },
  { key: 'feest',    icon: '🎉', level: 'B1', label: 'Niederländische Feierkultur', heroTitle: 'Niederländische Feierkultur', hero: 'illustrations/cover-feest.webp', sub: 'Von Gabber und Thunderdome über Techno und Hardstyle bis zum gemütlichen Borrel in der Kroeg — wie die Niederlande feiern, quer durch Musik, Nachtleben und Geselligkeit.', chip: 'FEEST' },
  { key: 'natuurkunde', icon: '⚛️', level: 'C1', label: 'Nederlandse natuurkundigen', heroTitle: 'Licht, Tijd & Ruimte', hero: 'illustrations/cover-natuurkunde.webp', sub: 'Huygens, Lorentz und Zeeman — drei niederländische Physiker, ihr Leben und die Politik ihrer Epoche, von der Gouden Eeuw bis in die Besatzungszeit.', chip: 'PHYSICUS' },
];
const trackLessons = (key) => LESSONS.filter(l => (l.track || 'verhaal') === key);

// Kurz-Label eines Grammatik-Themas: der Teil vor ":" bzw. "—" (z. B. „Präsens").
function gramShort(key) {
  const t = GRAMMAR[key] && GRAMMAR[key].title;
  return t ? t.split(/[:—]/)[0].trim() : '';
}
// „Das lernst du" je Kapitel: Grammatik-Themen (unique, in Reihenfolge) + Vokabel-Anzahl.
function chapterLearn(key) {
  const ls = trackLessons(key);
  const grammar = [...new Set(ls.map(l => l.grammar).filter(Boolean))].map(gramShort).filter(Boolean);
  const vocab = ls.reduce((s, l) => s + ((l.vocab && l.vocab.length) || 0), 0);
  return { grammar, vocab };
}
// Aufklappbarer „Das lernst du in diesem Kapitel"-Block: Grammatik-Liste + Vokabel-Anzahl.
function chapterLearnCard(key) {
  const { grammar, vocab } = chapterLearn(key);
  if (!grammar.length && !vocab) return '';
  const tags = grammar.map(g => `<li>${esc(g)}</li>`).join('');
  return `<div class="learncard chaplearn">
    <div class="learncard-h">Das lernst du in diesem Kapitel</div>
    ${grammar.length ? `<p class="learncard-row">🧩 Grammatik <b>(${grammar.length})</b></p><ul class="gramtags">${tags}</ul>` : ''}
    ${vocab ? `<p class="learncard-row">🗣️ Vokabeln: <b>${vocab}</b></p>` : ''}
  </div>`;
}

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

// Profil-Embleme: Rang-Badges (illustrations/ranks/lvl-<N>.webp) und Meilenstein-
// Medaillen (illustrations/medals/<id>.webp). Wird ein Level/eine ID hier
// eingetragen, zeigt die App automatisch das Bild statt des Emoji-Fallbacks.
const RANK_ART = new Set([1,2,3,4,5,6,7,8,9,10]);   // illustrations/ranks/lvl-<N>.webp
const MEDAL_ART = new Set(['first_lesson','lessons_10','lessons_40','all_lessons','words_25','words_100','words_500','words_1500','first_chat','speaker_20','reviews_100','reviews_1000','streak_3','streak_7','streak_30','mastered_all']);  // illustrations/medals/<id>.webp
// Lernpfad-Abzeichen mit eigener Badge-Grafik (illustrations/badges/<track>.webp);
// solange leer, zeigt die App das Kapitel-Cover als Fallback.
const BADGE_ART = new Set(['verhaal','personen','mythen','ade','feest','natuurkunde']);  // illustrations/badges/<track>.webp
const rankIcon = (L) => RANK_ART.has(L.level)
  ? `<img class="lvicon-img" src="illustrations/ranks/lvl-${L.level}.webp" alt="">`
  : L.icon;
const medalIcon = (m) => MEDAL_ART.has(m.id)
  ? `<img class="ms-medal-img" src="illustrations/medals/${m.id}.webp" alt="" loading="lazy">`
  : `<div class="em">${m.icon}</div>`;

// Abgeschlossene Kapitel: ✅ statt Wort; gemeistert: 🏆.
function statusBadge(st) {
  if (st === 'gemeistert') return `<span class="lst done" title="gemeistert">🏆</span>`;
  if (st === 'gelernt')    return `<span class="lst done" title="abgeschlossen">✅</span>`;
  return `<span class="lst neu">neu</span>`;
}

// Sequenziell freischalten: eine Lektion ist offen, wenn die vorige abgeschlossen ist.
function lessonUnlocked(l) {
  const ls = trackLessons(l.track || 'verhaal');
  const i = ls.findIndex(x => x.id === l.id);
  return i <= 0 || lessonStatus(ls[i - 1].id) !== 'neu';
}
function lessonBtn(l, chip, n) {
  const label = `LEKTION ${n}`;
  const locked = !lessonUnlocked(l);
  return `<button class="lesson ${locked ? 'locked' : ''}" data-id="${l.id}">
    <span class="lem">${locked ? '🔒' : lemIcon(l)}</span>
    <span class="lmain"><span class="lchip">${label}</span><b>${esc(l.title)}</b><span>${locked ? 'Erst die vorige Lektion abschließen' : esc(l.situation)}</span></span>
    ${locked ? '<span class="lst lock">🔒</span>' : statusBadge(lessonStatus(l.id))}</button>`;
}

// Übersichtskarte je Kapitel: volles Artwork (wie Startseite) + auf-/zuklappbarer Text.
function chapterCard(t) {
  const ls = trackLessons(t.key);
  const done = ls.filter(l => lessonStatus(l.id) !== 'neu').length;
  const ex = examState(t.key);
  const mark = ex && ex.passed ? ' 🏅' : (ls.length && done === ls.length ? ' ✅' : '');
  const img = t.hero
    ? `<img src="${esc(t.hero)}" alt="" loading="lazy" onerror="this.closest('.chaphero').classList.add('noimg')"/>`
    : '';
  return `<div class="chapcard">
    <button class="chaphero ${t.hero ? '' : 'noimg'}" data-track="${t.key}">
      ${img}<span class="heroslide-ph">${t.icon}</span>
      <span class="hero-cap">
        <span class="hero-top"><span class="hero-lvl">${esc(t.level)}</span><span class="hero-prog">${done}/${ls.length}${mark}</span></span>
        <span class="hero-title">${esc(t.label)}</span>
      </span>
    </button>
    <div class="chapbody">
      <p class="chaptext">${esc(t.sub)}</p>
      ${chapterLearnCard(t.key)}
      <button class="chaptext-toggle" type="button" aria-expanded="false">Mehr&nbsp;▾</button>
    </div>
  </div>`;
}

function renderLessons() {
  const t = TRACKS.find(x => x.key === activeTrack);
  // Ohne gewähltes Kapitel: Kapitelübersicht.
  if (!t) {
    app.innerHTML = `<div class="stack">
      <div class="section-title">Kapitel</div>
      <div class="chapgrid">${TRACKS.filter(x => trackLessons(x.key).length).map(chapterCard).join('')}</div>
    </div>`;
    app.querySelectorAll('.chaphero').forEach(b => b.onclick = () => openTrack(b.dataset.track));
    app.querySelectorAll('.chapbody .chaptext-toggle').forEach(bindTextToggle);
    return;
  }
  // Ein Kapitel gewählt: sticky Artwork-Banner + NUR dessen Lektionen.
  const ls = trackLessons(t.key);
  const done = ls.filter(l => lessonStatus(l.id) !== 'neu').length;
  const pct = ls.length ? Math.round(done / ls.length * 100) : 0;
  const ex = examState(t.key);
  const mark = ex && ex.passed ? ' 🏅' : (ls.length && done === ls.length ? ' ✅' : '');
  const img = t.hero
    ? `<img src="${esc(t.hero)}" alt="" loading="eager" onerror="this.closest('.chaphead').classList.add('noimg')"/>`
    : '';
  app.innerHTML = `<div class="stack">
    <div class="chaphead ${t.hero ? '' : 'noimg'}">
      ${img}<span class="heroslide-ph">${t.icon}</span>
      <span class="hero-cap">
        <span class="hero-top">
          <button class="chaphead-back" id="back" type="button">← Alle Kapitel</button>
          <span class="hero-prog">${done}/${ls.length}${mark}</span>
        </span>
        <span class="chaphead-titles">
          <span class="hero-eyebrow">${esc(t.level)}</span>
          <span class="hero-title">${esc(t.label)}</span>
        </span>
      </span>
    </div>
    <div class="chapintro open">
      <p class="chaptext">${esc(t.sub)}</p>
      ${chapterLearnCard(t.key)}
      <button class="chaptext-toggle" type="button" aria-expanded="true">Weniger&nbsp;▲</button>
      <div class="tprog"><div class="tprog-bar"><i style="width:${pct}%"></i></div><span>${done}/${ls.length}</span></div>
    </div>
    <div class="lgrid">${ls.map((l, i) => lessonBtn(l, t.chip, i + 1)).join('')}</div>
    ${examCard(t, ls)}
  </div>`;
  app.querySelector('#back').onclick = () => go('lessons');
  bindTextToggle(app.querySelector('.chapintro .chaptext-toggle'));
  app.querySelectorAll('.lesson').forEach(b => b.onclick = () => openLesson(b.dataset.id));
  app.querySelectorAll('.examcard').forEach(b => b.onclick = () => openExam(b.dataset.exam));
}

// Erklärtext auf-/zuklappen (Übersichtskarten & Kapitel-Kopf).
function bindTextToggle(btn) {
  if (!btn) return;
  btn.onclick = (e) => {
    e.stopPropagation();
    const box = btn.parentElement;
    const open = box.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.innerHTML = open ? 'Weniger&nbsp;▲' : 'Mehr&nbsp;▾';
  };
}

// Abschlussprüfung eines Kapitels: erscheint am Ende der Lektionsliste.
// Freigeschaltet, wenn alle Lektionen des Kapitels durchgearbeitet sind;
// bestanden ab 80 % richtiger Antworten.
// Prüfung freigeschaltet: alle Lektionen durch UND Vokabeln trainiert (Reife ≥ 80 %).
const EXAM_VOCAB_PCT = 80;
function lessonsAllDone(ls) { return ls.length > 0 && ls.every(l => lessonStatus(l.id) !== 'neu'); }
function examUnlocked(key) {
  const ls = trackLessons(key);
  return lessonsAllDone(ls) && trackVocabReady(key).pct >= EXAM_VOCAB_PCT;
}
function examCard(t, ls) {
  const unlocked = examUnlocked(t.key);
  const ex = examState(t.key);
  const passed = !!(ex && ex.passed);
  const cls = passed ? 'passed' : unlocked ? 'ready' : 'locked';
  const icon = passed ? '🏅' : unlocked ? '📝' : '🔒';
  const vr = trackVocabReady(t.key);
  const sub = passed ? `Bestanden — Bestleistung ${ex.bestPct}%`
    : unlocked ? 'Prüfung: ab 80 % richtig bestanden'
    : !lessonsAllDone(ls) ? `Erst alle ${ls.length} Lektionen abschließen`
    : `Vokabeln trainieren: ${vr.ready}/${vr.total} bereit (${vr.pct} %, ${EXAM_VOCAB_PCT} % nötig)`;
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
  const complete = ls.length && done === ls.length;
  const img = t.hero
    ? `<img src="${esc(t.hero)}" alt="" loading="eager" onerror="this.closest('.heroslide').classList.add('noimg')"/>`
    : '';
  // Abgeschlossenes Kapitel → verdientes Badge oben rechts, sonst Fortschritt.
  const corner = complete && BADGE_ART.has(t.key)
    ? `<img class="hero-badge" src="illustrations/badges/${t.key}.webp" alt="Abzeichen">`
    : `<span class="hero-prog">${done}/${ls.length}</span>`;
  return `<button class="heroslide ${t.hero ? '' : 'noimg'}" data-track="${t.key}">
    ${img}<span class="heroslide-ph">${t.icon}</span>
    <div class="hero-cap">
      <div class="hero-top">${corner}</div>
      <div class="greet hero-title">${esc(t.heroTitle)}</div>
    </div></button>`;
}

// Ein Kapitel öffnen: Lektionen-Tab, nur dessen Lektionen zeigen.
function openTrack(key) {
  go('lessons', key);
  app.scrollTo ? app.scrollTo(0, 0) : window.scrollTo(0, 0);
}

/* ============================ WÖRTER ============================ */
let vocabFilter = 'alle', vocabQuery = '';
function renderVocab() {
  const now = Date.now();
  const q = normalize(vocabQuery);
  const weakIds = new Set(weakVocab(999).map(v => v.id));
  const isMast = (c) => c && c.S >= 8 && (c.prod || 0) >= 1;
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
  const started = ALL_VOCAB.filter(v => { const c = state.cards[v.id]; return c && c.reps; }).length;
  const mastered = ALL_VOCAB.filter(v => isMast(state.cards[v.id])).length;
  const due = dueCount();
  const newAvail = unstartedCount();
  const weak = weakIds.size;
  app.innerHTML = `
    <div class="section-title">Training</div>
    <div class="section-sub">Übe mit echtem Abruf — Tippen & Wiedererkennen, automatisch bewertet.</div>

    <div class="card practicehub">
      <div class="ph-stats">
        <div><b style="color:var(--orange-ink)">${due}</b><span>fällig</span></div>
        <div><b>${newAvail}</b><span>neu verfügbar</span></div>
        <div><b>${mastered}</b><span>gemeistert</span></div>
      </div>
      <button class="btn" id="practice">💪 Üben${due || newAvail ? ` · ${due} + ${Math.min(newAvail, dailyNewLimit())} neu` : ''}</button>
      ${due || weak ? `<div class="ph-sub">
        ${due ? `<button class="btn ghost" id="review">🔁 Nur wiederholen</button>` : ''}
        ${weak ? `<button class="btn ghost" id="weak">🎯 Wiederholung (Schwachstellen)</button>` : ''}
      </div>` : ''}
    </div>

    <div class="section-sub" style="margin:20px 0 8px">Alle Wörter · ${started}/${ALL_VOCAB.length} im Training</div>
    <div class="field" style="margin:2px 0 10px"><input id="vq" placeholder="🔎 Suchen (niederländisch oder deutsch)…" value="${esc(vocabQuery)}" autocomplete="off"/></div>
    <div class="seg wrap" id="vf">${filters.map(([k, l]) => `<button data-f="${k}" class="${vocabFilter === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <div class="section-sub" style="margin:12px 0 6px">${list.length} ${list.length === 1 ? 'Wort' : 'Wörter'}</div>
    <div class="card" style="padding:6px 16px">${rows}</div>`;
  app.querySelectorAll('.play').forEach(b => b.onclick = () => speak(b.dataset.say));
  const pr = app.querySelector('#practice'); if (pr) pr.onclick = () => openPractice();
  const rv = app.querySelector('#review'); if (rv) rv.onclick = () => openReview();
  const wk = app.querySelector('#weak'); if (wk) wk.onclick = () => openWeak();
  app.querySelectorAll('#vf button').forEach(b => b.onclick = () => { vocabFilter = b.dataset.f; renderVocab(); });
  const qi = app.querySelector('#vq');
  qi.oninput = () => { vocabQuery = qi.value; const p = qi.selectionStart; renderVocab(); const n = app.querySelector('#vq'); n.focus(); n.setSelectionRange(p, p); };
}

// Neue Wörter aus der großen Vokabelbank ins Training holen (Reihenfolge: A1→A2→B1).
function openLearnNew(n = null) {
  const pool = unstartedVocab(n || dailyNewLimit());
  if (!pool.length) { toast('Alle Wörter sind schon im Training! 🎉', '➕'); return; }
  openFlow([stepIntro(pool)], (fe) =>
    finishScreen(fe, '➕', `${pool.length} neue ${pool.length === 1 ? 'Wort' : 'Wörter'}`, 'Mit Abruf eingeführt — jetzt im Training.', 'vocab'));
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
      <div class="sg"><b>${s.started}</b><span>Wörter im Training</span></div>
      <div class="sg"><b>${s.mastered}</b><span>Wörter gemeistert</span></div>
      <div class="sg"><b>${s.due}</b><span>Jetzt fällig</span></div>
      <div class="sg"><b>${s.accuracy == null ? '—' : s.accuracy + '%'}</b><span>Trefferquote</span></div>
      <div class="sg"><b>${s.reviews}</b><span>Wiederholungen</span></div>
      <div class="sg"><b>${s.lessonsDone}/${LESSONS.length}</b><span>Lektionen gemacht</span></div>
    </div>`;
}

function trackBadges() {
  return `<div class="section-sub" style="margin:22px 0 8px">Lernpfad-Abzeichen</div>
    <div class="msgrid">${TRACKS.map(t => {
      const ls = trackLessons(t.key);
      const done = ls.filter(l => lessonStatus(l.id) !== 'neu').length;
      const mast = ls.filter(l => lessonStatus(l.id) === 'gemeistert').length;
      const unlocked = done === ls.length, gold = mast === ls.length;
      const txt = gold ? 'Alle gemeistert!' : unlocked ? 'Kapitel geschafft' : `${done}/${ls.length} Lektionen`;
      const hasBadge = BADGE_ART.has(t.key);
      const src = hasBadge ? `illustrations/badges/${t.key}.webp` : esc(t.hero);
      return `<div class="ms ${unlocked ? '' : 'locked'}">
        <div class="ms-cover ${hasBadge ? 'badge' : ''}">
          <img src="${src}" alt="" loading="lazy" onerror="this.closest('.ms-cover').classList.add('noimg')">
          <span class="em">${t.icon}</span>
        </div>
        <b>${esc(t.label)}</b><span>${txt}</span></div>`;
    }).join('')}</div>`;
}

function renderProfile() {
  const L = levelInfo();
  const s = stats();
  app.innerHTML = `
    <div class="section-title">Mijn reis</div>
    <div class="section-sub">Deine Reise, Abzeichen & Einstellungen</div>

    <div class="card levelcard">
      <div class="levelrow"><div class="lvicon">${rankIcon(L)}</div>
        <div class="lvtxt"><b>Level ${L.level} · ${esc(L.de)}</b><div class="nl">${state.xp} XP gesamt</div></div>
        <div class="lvnum"><b>🔥 ${state.streak}</b><span>Serie · Rekord ${s.maxStreak}</span></div></div>
      <div class="xpbar"><i style="width:${L.pct}%"></i></div>
      <div class="lvnext">${L.next
        ? `Noch <b>${L.next.minXp - state.xp} XP</b> bis Level ${L.next.level} · ${esc(L.next.de)}`
        : 'Höchstes Level erreicht 🎉'}</div>
    </div>

    ${statsCard()}

    ${trackBadges()}

    <div class="section-sub" style="margin:22px 0 8px">Meilensteine</div>
    <div class="msgrid">${milestoneState().map(m =>
      `<div class="ms ${m.unlocked ? '' : 'locked'}">${medalIcon(m)}<b>${esc(m.title)}</b><span>${esc(m.desc)}</span></div>`).join('')}</div>

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
  if (!lessonUnlocked(l)) { toast('Erst die vorherige Lektion abschließen.', '🔒'); return; }
  const steps = [];
  if (l.story) steps.push(stepStory(l));
  steps.push(stepGrammar(l.grammar, 'Grammatik'), stepIntro(l.vocab), stepDialogue(l), stepGrammarCheck(l.grammar));
  if (l.speak && l.speak.length) steps.push(stepSpeak(l.speak));
  if (l.culture) steps.push(stepCulture(l));
  openFlow(steps, (fe) => {
    const res = completeLesson(lessonId);
    flushUnlocks();
    const key = l.track || 'verhaal';
    const tls = trackLessons(key);
    const next = tls[tls.findIndex(x => x.id === lessonId) + 1];
    fe.innerHTML = `<div class="flow-body"><div class="done">
      <div class="big">🎉</div><h2>Lektion geschafft!</h2>
      <p class="muted">${res && res.first ? `+${20 + (res.newWords || 0)} XP · ${res.newWords} Wörter im Training` : 'Wiederholt — gut gemacht!'}</p>
      <p class="muted">🔥 Streak: ${state.streak} · Level-XP: ${state.xp}</p>
      ${next ? `<button class="btn" id="next" style="max-width:280px;margin-top:12px">Weiter → nächste Lektion</button>` : `<button class="btn" id="exam" style="max-width:280px;margin-top:12px">Zur Abschlussprüfung</button>`}
      <button class="btn ghost" id="fin" style="max-width:280px;margin-top:8px">Zurück zum Kapitel</button></div></div>`;
    const nb = fe.querySelector('#next'); if (nb) nb.onclick = () => { closeFlow(); openLesson(next.id); };
    const eb = fe.querySelector('#exam'); if (eb) eb.onclick = () => { closeFlow(); go('lessons', key); setTimeout(() => openExam(key), 60); };
    fe.querySelector('#fin').onclick = () => { closeFlow(); go('lessons', key); };
  });
}

/* ---------- ABSCHLUSSPRÜFUNG (Kapitel-Ende, 80%-Schwelle) ---------- */
// Baut die Prüfungsfragen: Mix aus Vokabel-Quiz (de→nl) und Grammatik-Checks
// aus allen Lektionen des Kapitels.
const TRACK_LVL = { verhaal: 0, personen: 1, mythen: 1, ade: 2, feest: 2, natuurkunde: 3 };
// Prüfung: Umfang & Tipp-Anteil skalieren mit dem Niveau; Mix aus MC-Vokabeln,
// getippten Vokabeln, Grammatik-Checks und (ab B1) ganzen Sätzen. Vokabeln dedupliziert.
function buildExamQuestions(key) {
  const ls = trackLessons(key);
  const lvl = TRACK_LVL[key] ?? 0;
  const seen = new Set(); const vocab = [];
  ls.forEach(l => (l.vocab || []).forEach(v => { if (v && !seen.has(v.id)) { seen.add(v.id); vocab.push(v); } }));
  const gchecks = [];
  [...new Set(ls.map(l => l.grammar).filter(Boolean))].forEach(g =>
    (GRAMMAR[g] && GRAMMAR[g].checks || []).forEach(c => gchecks.push(c)));
  const sentences = [];
  if (lvl >= 2) ls.forEach(l => (l.speak || []).forEach(s => { if (s && s.nl && s.de) sentences.push(s); }));

  const total = Math.min(30, vocab.length + gchecks.length + sentences.length,
    Math.max(14, Math.round(vocab.length * (0.3 + 0.08 * lvl))));
  const typeFrac = [0.2, 0.35, 0.5, 0.65][lvl];
  const nGram = Math.min(gchecks.length, Math.max(2, Math.round(total * 0.2)));
  const nSent = lvl >= 2 ? Math.min(sentences.length, 1 + lvl) : 0;
  const nVocab = Math.max(0, total - nGram - nSent);
  const nType = Math.round(nVocab * typeFrac);

  const qs = [];
  shuffle(vocab.slice()).slice(0, nVocab).forEach((v, i) => {
    if (i < nType) qs.push({ type: 'type', q: `Tippe auf Niederländisch: „${v.de}"`, answer: v.nl });
    else { const opts = mcChoices(v, vocab); qs.push({ type: 'mc', q: `Was heißt „${v.de}"?`, options: opts.map(o => o.nl), answer: opts.indexOf(v) }); }
  });
  shuffle(gchecks.slice()).slice(0, nGram).forEach(c => qs.push({ type: 'mc', q: c.q, options: c.options.slice(), answer: c.answer }));
  shuffle(sentences.slice()).slice(0, nSent).forEach(s => qs.push({ type: 'type', q: `Tippe auf Niederländisch: „${s.de}"`, answer: s.nl }));
  return shuffle(qs);
}

function examStep(question, num, total, score) {
  return { render(body, foot, done) {
    const head = `<div class="step-label">Prüfung · Frage ${num}/${total}</div><div class="step-title">${esc(question.q)}</div>`;
    if (question.type === 'type') {
      body.innerHTML = `${head}<div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="auf Niederländisch…"></div><div id="fb" class="afb"></div>`;
      const inp = body.querySelector('#ans'); inp.focus();
      foot.innerHTML = `<button class="btn" id="chk">Prüfen</button>`;
      const check = () => {
        const r = gradeAnswer(inp.value, question.answer); inp.disabled = true;
        if (r.ok) score.correct++;
        recordAnswer(r.ok);
        body.querySelector('#fb').innerHTML = `<div class="${r.ok ? 'ok' : 'bad'}">${r.ok ? (r.typo ? '✓ Fast — richtig: ' : '✓ Richtig! ') : '✗ '}<b>${esc(question.answer)}</b></div>`;
        foot.innerHTML = `<button class="btn" id="n">${num === total ? 'Auswertung' : 'Weiter'}</button>`;
        foot.querySelector('#n').onclick = done;
      };
      foot.querySelector('#chk').onclick = check;
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    } else {
      body.innerHTML = `${head}<div class="choices">${question.options.map((o, i) => `<button class="choice" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
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
    }
  }};
}

function openExam(key) {
  const track = TRACKS.find(t => t.key === key);
  const ls = trackLessons(key);
  if (!examUnlocked(key)) {
    const vr = trackVocabReady(key);
    if (lessonsAllDone(ls)) {                    // Lektionen durch → gesperrte Prüfung startet das nötige Training
      toast(`Noch ${Math.max(1, EXAM_VOCAB_PCT - vr.pct)} % — trainier die Vokabeln!`, '🔁');
      return openPractice();
    }
    toast(`Erst alle ${ls.length} Lektionen abschließen.`, '🔒');
    return;
  }
  const questions = buildExamQuestions(key);
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
  const bigArt = pass && BADGE_ART.has(track.key)
    ? `<img src="illustrations/badges/${track.key}.webp" alt="" style="width:140px;height:140px;object-fit:contain;filter:drop-shadow(0 8px 22px rgba(0,0,0,.45))">`
    : `<div class="big">${pass ? '🏅' : '📚'}</div>`;
  fe.innerHTML = `<div class="flow-body"><div class="done">
    ${bigArt}
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

// „Das lernst du"-Vorschau: Grammatik-Fokus + neue Vokabeln (dynamisch aus der Lektion).
function learnPreview(l) {
  const g = GRAMMAR[l.grammar];
  const vocab = l.vocab || [];
  const list = vocab.map(v => `<li><b>${esc(v.nl)}</b> — ${esc(v.de)}</li>`).join('');
  if (!g && !vocab.length) return '';
  return `<div class="learncard">
    <div class="learncard-h">Das lernst du in dieser Lektion</div>
    ${g ? `<p class="learncard-row">🧩 Grammatik-Fokus: <b>${esc(g.title)}</b></p>` : ''}
    ${vocab.length ? `<p class="learncard-row">🗣️ Neue Vokabeln: <b>${vocab.length}</b></p><ul class="learncard-vocab">${list}</ul>` : ''}
  </div>`;
}

function stepStory(l) {
  const ls = trackLessons(l.track || 'verhaal');
  const n = ls.findIndex(x => x.id === l.id) + 1;
  return { render(body, foot, done) {
    // Panel 1: Establishing-Illustration über der Text-Karte; ohne Bild Emoji-Fallback.
    const illus = sceneImg(l, 'story');
    const iconInCard = illus ? '' : `<div class="storyicon">${l.icon}</div>`;
    body.innerHTML = `<div class="step-label">Lektion ${n || l.order}</div>
      <div class="step-title">${esc(l.title)}</div>
      ${illus}
      <div class="storycard">${iconInCard}<p>${l.story}</p></div>
      ${learnPreview(l)}`;
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
  const ex = (GRAMMAR_EXAMPLES && GRAMMAR_EXAMPLES[gid]) || [];
  return { render(body, foot, done) {
    body.innerHTML = `<div class="step-label">${esc(label)}</div><div class="step-title">${esc(g.title)}</div>
      <div class="gcard"><p>${g.body}</p><p style="margin-top:8px">${g.rule}</p></div>
      ${ex.length ? `<div class="gexamples"><div class="gex-h">Beispiele</div>
        ${ex.map(e => `<div class="gex"><div class="gex-t"><span class="gex-nl">${esc(e.nl)}</span><span class="gex-de">${esc(e.de)}</span></div>
          <button class="gex-say iconbtn" data-say="${esc(e.nl)}" aria-label="vorlesen">🔊</button></div>`).join('')}</div>` : ''}
      <p class="muted" style="font-size:13px;margin-top:10px">Kurz merken — gleich probierst du es aus.</p>`;
    body.querySelectorAll('.gex-say').forEach(b => b.onclick = () => speak(b.dataset.say));
    foot.innerHTML = `<button class="btn" id="n">Verstanden</button>`;
    foot.querySelector('#n').onclick = done;
  }};
}
/* ---------- Objektive Antwort-Bewertung & Format-nach-Reife ---------- */
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i), cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
const stripArt = (s) => s.replace(/^(de|het|een)\s+/, '');
// { ok, typo } — Artikel de/het/een optional, Tippfehler (Levenshtein ≤1) = „fast".
function gradeAnswer(input, target) {
  const a = normalize(input), t = normalize(target);
  if (!a) return { ok: false, typo: false };
  const a2 = stripArt(a), t2 = stripArt(t);
  if (a === t || a2 === t2) return { ok: true, typo: false };
  if (lev(a2, t2) <= 1) return { ok: true, typo: true };
  return { ok: false, typo: false };
}
// Abruf-Format nach Reife: Wiedererkennen → gestützter Abruf → freie Produktion.
function fmtByCard(card) {
  const S = (card && card.S) || 0, reps = (card && card.reps) || 0;
  if (reps < 2 || S < 2) return 'mc';
  if (S < 8) return 'cued';
  return 'prod';
}
// Distraktoren mit gleicher Oberflächenform wählen (Frage→Frage, ähnliche Länge,
// Artikel) — damit man nicht durch Ausschluss rät.
function mcChoices(v, pool, n = 3) {
  const shape = (s) => { s = String(s).trim(); return { q: /\?$/.test(s), words: s.split(/\s+/).length, art: /^(de|het|een)\s/i.test(s) }; };
  const sv = shape(v.nl);
  const score = (x) => { const sx = shape(x.nl); return (sx.q === sv.q ? 5 : 0) + (Math.abs(sx.words - sv.words) <= 1 ? 2 : 0) + (sx.art === sv.art ? 1 : 0); };
  const others = shuffle(pool.filter(x => x.id !== v.id && x.nl !== v.nl))
    .sort((a, b) => score(b) - score(a)).slice(0, n);
  return shuffle([v, ...others]);
}

// Neues Wort einführen: kodieren → Wiedererkennen (MC) → gestützter Abruf (Tippen).
// Erst nach echtem Abruf kommt es MIT echtem Grade ins SRS (introWord). Nur NEUE Wörter.
function stepIntro(vocab) {
  const pool = vocab.slice();
  return { render(body, foot, done) {
    const queue = vocab.filter(v => !cardOf(v.id).reps);
    let i = 0, phase = 0, mcOk = true;
    const draw = () => {
      if (i >= queue.length) return done();
      const v = queue[i];
      const head = `<div class="step-label">Neues Wort · ${i + 1}/${queue.length}</div>`;
      if (phase === 0) {
        body.innerHTML = `${head}<div class="step-title">Neu: „${esc(v.nl)}"</div>
          <div class="flash"><div class="word">${esc(v.nl)}</div><div class="trans">${esc(v.de)}</div>
            <div class="ex">${esc(v.ex)} — ${esc(v.exDe)}</div>
            ${v.note ? `<div class="ex" style="color:var(--orange-ink)">💡 ${esc(v.note)}</div>` : ''}</div>`;
        speak(v.nl);
        foot.innerHTML = `<button class="btn ghost" id="say">🔊 Hören</button><button class="btn" id="n">Verstanden</button>`;
        foot.querySelector('#say').onclick = () => speak(v.nl);
        foot.querySelector('#n').onclick = () => { phase = 1; draw(); };
      } else if (phase === 1) {
        const opts = mcChoices(v, pool.length >= 4 ? pool : ALL_VOCAB);
        body.innerHTML = `${head}<div class="step-title">Was heißt „${esc(v.de)}"?</div>
          <div class="choices">${opts.map(o => `<button class="choice" data-id="${o.id}">${esc(o.nl)}</button>`).join('')}</div>`;
        let answered = false;
        body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
          if (answered) return; answered = true;
          mcOk = btn.dataset.id === v.id;
          body.querySelectorAll('.choice').forEach(b2 => {
            if (b2.dataset.id === v.id) b2.classList.add('correct');
            else if (b2 === btn) b2.classList.add('wrong');
          });
          if (mcOk) speak(v.nl);
          foot.innerHTML = `<button class="btn" id="n">Weiter</button>`;
          foot.querySelector('#n').onclick = () => { phase = 2; draw(); };
        });
        foot.innerHTML = '';
      } else {
        const hint = stripArt(normalize(v.nl))[0] || '';
        body.innerHTML = `${head}<div class="step-title">Tippe auf Niederländisch: „${esc(v.de)}"</div>
          <div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="beginnt mit „${esc(hint)}…"></div>
          <div id="fb" class="afb"></div>`;
        const inp = body.querySelector('#ans'); inp.focus();
        foot.innerHTML = `<button class="btn" id="chk">Prüfen</button>`;
        const check = () => {
          const r = gradeAnswer(inp.value, v.nl); inp.disabled = true;
          body.querySelector('#fb').innerHTML = `<div class="${r.ok ? 'ok' : 'bad'}">${r.ok ? (r.typo ? '✓ Fast! ' : '✓ Richtig! ') : '✗ '}<b>${esc(v.nl)}</b></div><div class="ex">${esc(v.ex)}</div>`;
          speak(v.nl);
          introWord(v.id, (mcOk && r.ok && !r.typo) ? 'good' : 'hard'); flushUnlocks();
          foot.innerHTML = `<button class="btn" id="n">${i === queue.length - 1 ? 'Fertig' : 'Nächstes Wort'}</button>`;
          foot.querySelector('#n').onclick = () => { i++; phase = 0; mcOk = true; draw(); };
        };
        foot.querySelector('#chk').onclick = check;
        inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
      }
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
// Wiederholung: Format nach Reife, Antwort VERDECKT, OBJEKTIVE Auto-Bewertung
// (Grade aus der Antwort abgeleitet — kein Selbst-Rating mehr).
function reviewStep(queue, label) {
  let i = 0;
  return { render(body, foot, done) {
    const draw = () => {
      if (i >= queue.length) return done();
      const v = queue[i];
      const fmt = fmtByCard(cardOf(v.id));
      const head = `<div class="step-label">${esc(label)} · ${i + 1}/${queue.length}</div>`;
      const finish = (grade, prod) => {
        speak(v.nl);
        reviewCard(v.id, grade, prod); flushUnlocks();
        foot.innerHTML = `<button class="btn" id="n">${i === queue.length - 1 ? 'Fertig' : 'Weiter'}</button>`;
        foot.querySelector('#n').onclick = () => { i++; draw(); };
      };
      if (fmt === 'mc') {
        const opts = mcChoices(v, ALL_VOCAB);
        body.innerHTML = `${head}<div class="step-title">Was heißt „${esc(v.de)}"?</div>
          <div class="choices">${opts.map(o => `<button class="choice" data-id="${o.id}">${esc(o.nl)}</button>`).join('')}</div><div id="fb" class="afb"></div>`;
        let answered = false;
        body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
          if (answered) return; answered = true;
          const ok = btn.dataset.id === v.id;
          body.querySelectorAll('.choice').forEach(b2 => {
            if (b2.dataset.id === v.id) b2.classList.add('correct');
            else if (b2 === btn) b2.classList.add('wrong');
          });
          body.querySelector('#fb').innerHTML = `<div class="ex">${esc(v.nl)} — ${esc(v.ex)}</div>`;
          finish(ok ? 'good' : 'again', false);
        });
        foot.innerHTML = '';
      } else {
        const prod = fmt === 'prod';
        const hint = stripArt(normalize(v.nl))[0] || '';
        body.innerHTML = `${head}<div class="step-title">Tippe auf Niederländisch: „${esc(v.de)}"</div>
          <div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${prod ? 'auf Niederländisch…' : `beginnt mit „${esc(hint)}…"`}"></div>
          <div id="fb" class="afb"></div>`;
        const inp = body.querySelector('#ans'); inp.focus();
        foot.innerHTML = `<button class="btn" id="chk">Prüfen</button>`;
        const check = () => {
          const r = gradeAnswer(inp.value, v.nl); inp.disabled = true;
          body.querySelector('#fb').innerHTML = `<div class="${r.ok ? 'ok' : 'bad'}">${r.ok ? (r.typo ? '✓ Fast! ' : '✓ Richtig! ') : '✗ '}<b>${esc(v.nl)}</b></div><div class="ex">${esc(v.ex)}</div>`;
          finish(!r.ok ? 'again' : r.typo ? 'hard' : 'good', prod && r.ok && !r.typo);
        };
        foot.querySelector('#chk').onclick = check;
        inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
      }
    };
    draw();
  }};
}
function runReview(cards, opts) {
  if (!cards.length) { toast(opts.empty, opts.emoji); return; }
  openFlow([reviewStep(shuffle(cards.slice()), opts.label)], (fe) =>
    finishScreen(fe, opts.emoji, opts.title, `${cards.length} Wörter · 🔥 ${state.streak}`, opts.returnTab));
}
function openReview() {
  runReview(dueVocab(), { label: 'Wiederholen', emoji: '✅', title: 'Wiederholt!', empty: 'Nichts fällig — üb neue Wörter!', returnTab: 'vocab' });
}
function openWeak() {
  runReview(weakVocab(), { label: 'Schwachstellen', emoji: '🎯', title: 'Stärker geworden!', empty: 'Keine Schwachstellen — stark!', returnTab: 'vocab' });
}
// Gemischte Übungseinheit: neue Wörter geblockt einführen, dann fällige Reviews (interleaved).
function openPractice() {
  const news = unstartedVocab(dailyNewLimit());
  const due = dueVocab();
  if (!news.length && !due.length) { toast('Nichts zu üben — alles im grünen Bereich! 🎉', '✅'); return; }
  const steps = [];
  if (news.length) steps.push(stepIntro(news));
  if (due.length) steps.push(reviewStep(shuffle(due.slice()), 'Wiederholen'));
  openFlow(steps, (fe) =>
    finishScreen(fe, '💪', 'Stark geübt!', `${news.length} neu · ${due.length} wiederholt · 🔥 ${state.streak}`, 'vocab'));
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

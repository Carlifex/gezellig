// ============================================================================
//  Gezellig v2 — App-Steuerung (deutsche UI, Inhalt Niederländisch)
// ============================================================================
import { LESSONS, GRAMMAR, GRAMMAR_EXAMPLES, PLURAL_PAIRS, CHAT_SCENARIOS, DAILY_GOALS } from './data.js';
import { CARDS, CARD_ART } from './cards.js';
import { statusLabel } from './srs.js';
import { speak, speakSequence, ttsSupported, setTtsEnabled, setTtsRate, sttSupported, listen, similarity, normalize } from './speech.js';
import {
  state, save, levelInfo, dailyTasks, dueVocab, dueCount, reviewCard, completeLesson,
  chatTurn, speakResult, setSetting, resetAll, lessonStatus, milestoneState, takeUnlocks,
  todayXp, dailyGoalXp, goalMetToday, cardOf, ALL_VOCAB, gainXp, weakVocab, startedVocab,
  recordAnswer, historyLast, stats, unstartedVocab, unstartedCount, learnWords,
  extraVocab, extraVocabCount, extraRemainingToday, EXTRA_DAILY_MAX, reviewXp,
  recordExam, examState, examPassed,
  introWord, trackVocab, trackVocabReady, dailyNewLimit,
  checkpointPassed, passCheckpoint,
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
function syncTabs() {
  tabbar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tab === activeTab));
  const up = document.getElementById('trainUp');
  if (up) up.hidden = examsNeedingVocab().length === 0;
}
function go(tab, track) { activeTab = tab; if (tab === 'lessons') activeTrack = track ?? null; if (tab !== 'vocab') vocabSub = null; syncTabs(); render(); }
function render() {
  ({ today: renderToday, lessons: renderLessons, vocab: renderVocab, profile: renderProfile }[activeTab] || renderToday)();
  window.scrollTo(0, 0);
}

/* ============================ START ============================ */
// Der Haupt-Button auf der Startseite garantiert IMMER Fortschritt:
// 1) nächste freie Lektion  2) fällige/nötige Prüfung  3) Vokabeltraining  4) Weiterlernen.
function homeCTA() {
  const nl = LESSONS.find(l => lessonStatus(l.id) === 'neu' && lessonUnlocked(l));
  if (nl) return { kind: 'lesson', lesson: nl, label: 'Nächste Lektion starten', icon: lemIcon(nl), run: () => openLesson(nl.id) };
  // Alle freien Lektionen durch → wartet eine Prüfung, die schon bereit ist?
  const exReady = TRACKS.find(t => trackLessons(t.key).length && examUnlocked(t.key) && !examPassed(t.key));
  if (exReady) return { kind: 'exam', label: `Prüfung: ${exReady.label}`, icon: '📝', run: () => go('lessons', exReady.key) };
  // Prüfung hängt noch am Vokabeltraining, oder es sind Wörter fällig → ins Training.
  if (examsNeedingVocab().length || dueCount() || unstartedCount()) {
    return { kind: 'train', label: 'Vokabeln trainieren', icon: '🔁', run: () => openPractice() };
  }
  // Sonst: noch nicht gemeisterte Lektion wiederholen, sonst Kapitelübersicht.
  const rl = LESSONS.find(l => lessonStatus(l.id) !== 'gemeistert' && lessonUnlocked(l));
  if (rl) return { kind: 'lesson', lesson: rl, label: 'Weiterlernen', icon: lemIcon(rl), run: () => openLesson(rl.id) };
  return { kind: 'browse', label: 'Zur Kapitelübersicht', icon: '📚', run: () => go('lessons') };
}
// Startseiten-CTA im Look einer Lektionslisten-Zeile (Thumbnail · LEKTION N · Titel · Situation · Status).
function lessonCTA(l) {
  const n = lessonIndex(l) + 1;
  return `<button class="lesson lesson-cta" id="learn" data-id="${esc(l.id)}">
    <span class="lem">${lemIcon(l)}</span>
    <span class="lmain"><span class="lchip">LEKTION ${n}</span><b>${esc(l.title)}</b><span>${esc(l.situation)}</span></span>
    ${statusBadge(lessonStatus(l.id))}</button>`;
}
function renderToday() {
  const L = levelInfo();
  const due = dueCount();
  const goalXp = dailyGoalXp(), tXp = todayXp();
  const gpct = Math.min(100, Math.round(tXp / goalXp * 100));
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Guten Morgen!' : hour < 18 ? 'Guten Tag!' : 'Guten Abend!';
  const heroTracks = TRACKS.filter(x => trackLessons(x.key).length);
  // Aktuelles Kapitel = das am weitesten freigeschaltete (durch bestandene Prüfungen).
  let curIdx = 0;
  heroTracks.forEach((t, i) => { if (trackUnlocked(t.key)) curIdx = i; });
  const cta = homeCTA();

  app.innerHTML = `
    <div class="stack">
      <div class="card levelcard compact">
        <div class="levelrow">
          <div class="lvicon">${rankIcon(L)}</div>
          <div class="lvtxt"><b>Level ${L.level} · ${esc(L.de)}</b><div class="nl">„${esc(L.nl)}"</div></div>
          <div class="lvnum"><b>${state.xp}</b><span>XP</span></div>
        </div>
        <div class="xpbar"><i style="width:${L.pct}%"></i></div>
        <div class="xpmeta"><span>${L.next ? `${L.into} / ${L.span} bis Level ${L.level + 1}` : 'Höchstes Level erreicht'}</span>
          <span>🔥 ${state.streak} ${state.streak === 1 ? 'Tag' : 'Tage'}</span></div>
      </div>

      <div class="herocar" id="herocar">${heroTracks.map(heroSlide).join('')}</div>
      <div class="cardots" id="cardots">${heroTracks.map((_, i) => `<button class="dot ${i === curIdx ? 'on' : ''}" data-i="${i}" aria-label="Cover ${i + 1}"></button>`).join('')}</div>

      ${cta.kind === 'lesson' && cta.lesson ? lessonCTA(cta.lesson) : `<button class="btn learn-cta" id="learn"><span class="learn-ic">${cta.icon}</span><span>${esc(cta.label)}</span></button>`}
      ${due && cta.kind !== 'train' ? `<button class="btn secondary" id="review">🔁 ${due} Wörter wiederholen</button>` : ''}

      <div class="card daycard">
        <div class="daytop">
          <div class="dial" style="--p:${gpct}%"><i>${gpct}%</i></div>
          <div class="txt"><b>Tagesziel</b><div>${tXp} / ${goalXp} XP heute</div></div>
          <div class="streak"><b>🔥 ${state.streak}</b><span>STREAK</span></div>
        </div>
        <div class="daytasks">${dailyTasks().map(taskRow).join('')}</div>
      </div>
    </div>`;

  app.querySelector('#learn').onclick = cta.run;
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
  return `<div class="dtask ${t.done ? 'is-done' : ''}"><span class="box">${t.done ? '✓' : ''}</span>
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

// Kapitel-Mitte (ab dieser Lektion braucht es den Zwischen-Check). Kleine Kapitel: kein Check.
function chapterMid(ls) { return ls.length >= 4 ? Math.ceil(ls.length / 2) : ls.length; }
// Kapitel-Freischaltung: das erste Kapitel ist offen; jedes weitere erst,
// wenn die Prüfung des vorherigen Kapitels bestanden wurde.
function trackUnlocked(key) {
  const idx = TRACKS.findIndex(t => t.key === key);
  if (idx <= 0) return true;
  return examPassed(TRACKS[idx - 1].key);
}
// Vorheriges Kapitel (für Hinweistexte).
function prevTrack(key) {
  const idx = TRACKS.findIndex(t => t.key === key);
  return idx > 0 ? TRACKS[idx - 1] : null;
}
// Freischalten: Kapitel offen UND vorige Lektion durch (sequenziell) UND ggf. Zwischen-Check bestanden.
function lessonUnlocked(l) {
  const key = l.track || 'verhaal';
  if (!trackUnlocked(key)) return false;
  const ls = trackLessons(key);
  const i = ls.findIndex(x => x.id === l.id);
  if (i <= 0) return true;
  if (lessonStatus(ls[i - 1].id) === 'neu') return false;
  const mid = chapterMid(ls);
  if (i >= mid && mid < ls.length && !checkpointPassed(key)) return false;
  return true;
}
// Vokabeln der ersten Kapitelhälfte (für den Zwischen-Check).
function checkpointVocab(key) {
  const ls = trackLessons(key); const mid = chapterMid(ls);
  const seen = new Set(); const out = [];
  ls.slice(0, mid).forEach(l => (l.vocab || []).forEach(v => { if (v && !seen.has(v.id)) { seen.add(v.id); out.push(v); } }));
  return out;
}
function checkpointCard(key) {
  const ls = trackLessons(key); const mid = chapterMid(ls);
  const firstHalfDone = lessonStatus(ls[mid - 1].id) !== 'neu';
  const passed = checkpointPassed(key);
  const cls = passed ? 'passed' : firstHalfDone ? 'ready' : 'locked';
  const icon = passed ? '✅' : firstHalfDone ? '📝' : '🔒';
  const sub = passed ? 'Bestanden — zweite Hälfte frei'
    : firstHalfDone ? 'Pflicht-Check: erste Kapitelhälfte (ab 80 %)'
    : 'Erst die erste Kapitelhälfte abschließen';
  const badge = passed ? '<span class="lst done">✅</span>' : firstHalfDone ? '<span class="lst neu">Start</span>' : '<span class="lst lock">🔒</span>';
  return `<button class="examcard checkpoint ${cls}" data-checkpoint="${key}">
    <span class="lem">${icon}</span>
    <span class="lmain"><span class="lchip">CHECKPOINT</span><b>Zwischen-Check</b><span>${esc(sub)}</span></span>
    ${badge}</button>`;
}
function openCheckpoint(key) {
  const ls = trackLessons(key); const mid = chapterMid(ls);
  if (lessonStatus(ls[mid - 1].id) === 'neu') { toast('Erst die erste Kapitelhälfte abschließen.', '🔒'); return; }
  if (checkpointPassed(key)) { toast('Zwischen-Check schon bestanden ✅', '✅'); return; }
  const vocab = checkpointVocab(key);
  const lvl = TRACK_LVL[key] ?? 0;
  const n = Math.min(vocab.length, 10 + lvl * 2);
  const nType = Math.round(n * [0.3, 0.4, 0.55, 0.7][lvl]);
  const qs = shuffle(vocab.slice()).slice(0, n).map((v, i) => {
    if (i < nType) return { type: 'type', q: `Tippe auf Niederländisch: „${v.de}"`, answer: v.nl };
    const o = mcChoices(v, vocab); return { type: 'mc', q: `Was heißt „${v.de}"?`, options: o.map(x => x.nl), answer: o.indexOf(v) };
  });
  const total = qs.length; const score = { correct: 0 };
  openFlow(qs.map((q, i) => examStep(q, i + 1, total, score)), (fe) => {
    const pct = Math.round(score.correct / total * 100);
    const pass = pct >= 80;
    if (pass) passCheckpoint(key);
    fe.innerHTML = `<div class="flow-body"><div class="done">
      <div class="big">${pass ? '✅' : '📚'}</div><h2>${pass ? 'Zwischen-Check bestanden!' : 'Noch nicht geschafft'}</h2>
      <p class="muted"><b style="color:${pass ? 'var(--good)' : 'var(--orange-ink)'}">${pct}%</b> · ${score.correct}/${total}${pass ? '' : ' · 80 % nötig'}</p>
      <p class="muted">${pass ? 'Die zweite Kapitelhälfte ist jetzt frei.' : 'Wiederhol die Wörter im Training und versuch es nochmal.'}</p>
      <button class="btn" id="fin" style="max-width:280px;margin-top:12px">${pass ? 'Weiter' : 'Zurück'}</button></div></div>`;
    fe.querySelector('#fin').onclick = () => { closeFlow(); go('lessons', key); };
  });
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
  const unlocked = trackUnlocked(t.key);
  const pv = prevTrack(t.key);
  const img = t.hero
    ? `<img src="${esc(t.hero)}" alt="" loading="lazy" onerror="this.closest('.chaphero').classList.add('noimg')"/>`
    : '';
  return `<div class="chapcard">
    <button class="chaphero ${t.hero ? '' : 'noimg'} ${unlocked ? '' : 'locked'}" data-track="${t.key}"${unlocked ? '' : ` title="Erst Prüfung „${esc(pv ? pv.label : '')}" bestehen"`}>
      ${img}<span class="heroslide-ph">${t.icon}</span>
      ${unlocked ? '' : '<span class="chap-lock">🔒</span>'}
      <span class="hero-cap">
        <span class="hero-top"><span class="hero-lvl">${esc(t.level)}</span><span class="hero-prog">${unlocked ? `${done}/${ls.length}${mark}` : ''}</span></span>
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
    <div class="lgrid">${(() => {
      const mid = chapterMid(ls);
      return ls.map((l, i) => {
        const btn = lessonBtn(l, t.chip, i + 1);
        return (mid < ls.length && i === mid - 1) ? btn + checkpointCard(t.key) : btn;
      }).join('');
    })()}</div>
    ${examCard(t, ls)}
  </div>`;
  app.querySelector('#back').onclick = () => go('lessons');
  bindTextToggle(app.querySelector('.chapintro .chaptext-toggle'));
  app.querySelectorAll('.lesson').forEach(b => b.onclick = () => openLesson(b.dataset.id));
  app.querySelectorAll('[data-checkpoint]').forEach(b => b.onclick = () => openCheckpoint(b.dataset.checkpoint));
  app.querySelectorAll('[data-exam]').forEach(b => b.onclick = () => openExam(b.dataset.exam));
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
// Kapitel, deren Lektionen durch sind, aber die Prüfung noch am Vokabeltraining hängt.
// → Training schaltet hier eine Prüfung frei (Pfeil-Hinweis in der Navi + auf der Trainingsseite).
function examsNeedingVocab() {
  return TRACKS.filter(t => {
    const ls = trackLessons(t.key);
    if (!lessonsAllDone(ls)) return false;
    const ex = examState(t.key);
    if (ex && ex.passed) return false;
    return trackVocabReady(t.key).pct < EXAM_VOCAB_PCT;
  });
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
  const unlocked = trackUnlocked(t.key);
  const pv = prevTrack(t.key);
  const img = t.hero
    ? `<img src="${esc(t.hero)}" alt="" loading="eager" onerror="this.closest('.heroslide').classList.add('noimg')"/>`
    : '';
  // Abgeschlossenes Kapitel → verdientes Badge oben rechts, sonst Fortschritt (gesperrt: nichts).
  const corner = !unlocked
    ? ''
    : complete && BADGE_ART.has(t.key)
      ? `<img class="hero-badge" src="illustrations/badges/${t.key}.webp" alt="Abzeichen">`
      : `<span class="hero-prog">${done}/${ls.length}</span>`;
  return `<button class="heroslide ${t.hero ? '' : 'noimg'} ${unlocked ? '' : 'locked'}" data-track="${t.key}"${unlocked ? '' : ` title="Erst Prüfung „${esc(pv ? pv.label : '')}" bestehen"`}>
    ${img}<span class="heroslide-ph">${t.icon}</span>
    ${unlocked ? '' : '<span class="chap-lock">🔒</span>'}
    <div class="hero-cap">
      <div class="hero-top">${corner}</div>
      <div class="greet hero-title">${esc(t.heroTitle)}</div>
    </div></button>`;
}

// Ein Kapitel öffnen: Lektionen-Tab, nur dessen Lektionen zeigen.
function openTrack(key) {
  if (!trackUnlocked(key)) {
    const pv = prevTrack(key);
    toast(pv ? `Erst die Prüfung „${pv.label}" bestehen.` : 'Noch gesperrt.', '🔒');
    return;
  }
  go('lessons', key);
  app.scrollTo ? app.scrollTo(0, 0) : window.scrollTo(0, 0);
}

/* ============================ WÖRTER ============================ */
let vocabFilter = 'alle', vocabQuery = '', vocabSub = null;
function renderVocab() {
  if (vocabSub === 'numbers') return renderNumbers();
  const now = Date.now();
  const q = normalize(vocabQuery);
  const weakIds = new Set(weakVocab(999).map(v => v.id));
  const isMast = (c) => c && c.S >= 8 && (c.prod || 0) >= 1;
  // Dasselbe NL-Wort kann unter mehreren IDs existieren (Lektions-Varianten).
  // Fürs Anzeigen/Filtern zählt die Variante, die tatsächlich im Training ist.
  const nk = (v) => normalize(v.nl);
  const cardIdByNl = {};
  ALL_VOCAB.forEach(v => {
    const c = state.cards[v.id];
    if (c && c.reps && !cardIdByNl[nk(v)]) cardIdByNl[nk(v)] = v.id;
  });
  const matchQ = (v) => !q || normalize(v.nl).includes(q) || normalize(v.de).includes(q);
  const matchLearned = (v) => {
    const cid = cardIdByNl[nk(v)];
    if (!cid) return false;
    const c = state.cards[cid];
    if (!matchQ(v)) return false;
    switch (vocabFilter) {
      case 'due':        return c.due <= now;
      case 'gelernt':    return !isMast(c);
      case 'gemeistert': return isMast(c);
      case 'schwierig':  return weakIds.has(cid);
      default:           return true;
    }
  };
  const filters = [['alle', 'Alle'], ['due', 'Fällig'], ['gelernt', 'Gelernt'], ['gemeistert', 'Gemeistert'], ['schwierig', 'Schwierig']];
  const pillHtml = (v) => {
    const cid = cardIdByNl[nk(v)];
    const id = cid || v.id;
    const pos = (CARDS[id] && CARDS[id].pos) || 'other';
    const disp = (CARDS[id] && CARDS[id].displayNl) || v.nl;
    return `<button class="vpill ${cid ? `pos-${pos}` : 'prev'}" data-card="${esc(id)}">${esc(disp)}</button>`;
  };
  // Kapitel-Gruppen: gelernte Pillen farbig, ungelernte ausgegraut (Preview) —
  // auch für kommende Kapitel. Graue Pillen nur im Filter „Alle".
  let shownLearned = 0, shownPrev = 0;
  const groupHtml = (title, icon, vs, sub) => {
    const seen = new Set();
    const pills = [];
    let learnedCnt = 0;
    for (const v of vs) {
      if (seen.has(nk(v))) continue; seen.add(nk(v));
      const learned = !!cardIdByNl[nk(v)];
      if (learned) learnedCnt++;
      if (learned ? matchLearned(v) : (vocabFilter === 'alle' && matchQ(v))) {
        pills.push({ html: pillHtml(v), learned });
      }
    }
    if (!pills.length) return '';
    shownLearned += pills.filter(p => p.learned).length;
    shownPrev += pills.filter(p => !p.learned).length;
    return `<div class="section-sub vgroup-hd" style="margin:16px 0 6px">${icon} ${esc(title)} <span class="tcount">${learnedCnt}/${seen.size}</span>${sub ? ` <span class="muted">· ${esc(sub)}</span>` : ''}</div>
      <div class="card vpills-card"><div class="vpills">${pills.map(p => p.html).join('')}</div></div>`;
  };
  const chapterGroups = TRACKS.filter(t => trackLessons(t.key).length)
    .map(t => groupHtml(t.label, t.icon, trackVocab(t.key), trackUnlocked(t.key) ? '' : 'Vorschau'))
    .join('');
  // Fundus: Wörter ohne Lektion (große Bank) — hier nur bereits gelernte zeigen.
  const bankLearned = ALL_VOCAB.filter(v => !v.lesson && cardIdByNl[nk(v)] === v.id);
  const bankGroup = groupHtml('Fundus', '📚', bankLearned, 'freie Wörter außerhalb der Kapitel');
  const started = ALL_VOCAB.filter(v => { const c = state.cards[v.id]; return c && c.reps; }).length;
  const due = dueCount();
  const extraAvail = extraVocabCount();
  const quota = extraRemainingToday();
  const acc = stats().accuracy;                      // Gesamt-Trefferquote (null = noch keine Antworten)
  const accLow = acc != null && acc < 50;            // unter 50 % → Erweitern gesperrt
  const nNew = Math.min(extraAvail, quota, dailyNewLimit());
  const growLocked = !extraAvail || !quota || accLow;
  const growHint = accLow ? `Trefferquote unter 50 % — erst mit dem Vokabeltraining festigen.`
    : !quota ? `Tageslimit erreicht: ${EXTRA_DAILY_MAX} neue Vokabeln außerhalb von Lektionen pro Tag.`
    : !extraAvail ? 'Alle freien Wörter sind schon in der Rotation.'
    : `⭐ Jede Abfrage bringt ${reviewXp()} XP — wächst mit deinem Wortschatz · heute noch ${quota}/${EXTRA_DAILY_MAX} frei`;
  // Rücksprung aus dem Erweitern-Flow: Zähler sichtbar vom alten Stand hochzählen.
  let animFrom = null;
  const raw = sessionStorage.getItem('gz.rotAnim');
  if (raw != null) {
    sessionStorage.removeItem('gz.rotAnim');
    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 0 && n < started) animFrom = n;
  }
  app.innerHTML = `
    <div class="section-title">Training</div>
    <div class="trow"><span class="tcount" id="rotchip"><b id="rotnum">${animFrom ?? started}</b> Vokabel${started === 1 ? '' : 'n'} in Rotation</span>${acc != null ? `<span class="tcount" title="Trefferquote">🎯 ${acc} % Treffer</span>` : ''}</div>
    <div class="section-sub">Übe mit echter Abfrage — Tippen & Wiedererkennen, automatisch bewertet.</div>

    <div class="practicehub">
      ${(() => {
        const need = examsNeedingVocab();
        if (!need.length) return '';
        const items = need.map(t => {
          const vr = trackVocabReady(t.key);
          return `<li><b>${esc(t.label)}</b> — noch ${Math.max(1, EXAM_VOCAB_PCT - vr.pct)} % (${vr.ready}/${vr.total} bereit)</li>`;
        }).join('');
        return `<div class="ph-unlock"><span class="ph-unlock-hd">↑ Üben schaltet ${need.length === 1 ? 'diese Prüfung' : 'diese Prüfungen'} frei:</span><ul>${items}</ul></div>`;
      })()}
      <button class="btn" id="learnnew" ${growLocked ? 'disabled' : ''}>➕ Wortschatz um ${nNew || 8} Vokabeln erweitern</button>
      <button class="btn ghost ${examsNeedingVocab().length ? 'unlocks' : ''}" id="practice-known">🔁 Vokabeltraining${due ? ` · ${due} fällig` : ''}${examsNeedingVocab().length ? ' <span class="btn-up" title="schaltet die Prüfung frei">↑</span>' : ''}</button>
      <div class="muted" style="font-size:12px;text-align:center">${growHint}</div>
    </div>

    <div class="section-sub" style="margin:20px 0 8px">Spezial-Training</div>
    <button class="card special-card" id="numbers">
      <span class="sc-ic">🔢</span>
      <span class="sc-txt"><b>Zahlen lernen</b><span>Getallen: 0 bis 1000 — hören, verstehen, tippen</span></span>
      <span class="sc-go">›</span>
    </button>

    <div class="section-sub" style="margin:20px 0 8px">Wörter nach Kapiteln · tippe eine Pille für die Karte</div>
    <div class="field" style="margin:2px 0 10px"><input id="vq" placeholder="🔎 Suchen (niederländisch oder deutsch)…" value="${esc(vocabQuery)}" autocomplete="off"/></div>
    <div class="seg wrap" id="vf">${filters.map(([k, l]) => `<button data-f="${k}" class="${vocabFilter === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <div class="vpleg">${VP_LEGEND.map(([k, lb]) => `<span class="vpleg-i pos-${k}">${lb}</span>`).join('')}<span class="vpleg-i prev">noch nicht gelernt</span></div>
    ${chapterGroups + bankGroup || '<div class="muted" style="padding:14px;text-align:center">Nichts gefunden.</div>'}
    ${chapterGroups + bankGroup ? `<div class="section-sub muted" style="margin:10px 0 0">${shownLearned} gelernt${shownPrev ? ` · ${shownPrev} Vorschau` : ''}</div>` : ''}`;
  app.querySelectorAll('.vpill[data-card]').forEach(r => r.onclick = () => openCard(r.dataset.card));
  const ln = app.querySelector('#learnnew'); if (ln) ln.onclick = () => openLearnNew();
  const pk = app.querySelector('#practice-known'); if (pk) pk.onclick = () => openPracticeKnown();
  const nm = app.querySelector('#numbers'); if (nm) nm.onclick = () => { vocabSub = 'numbers'; renderVocab(); };
  app.querySelectorAll('#vf button').forEach(b => b.onclick = () => { vocabFilter = b.dataset.f; renderVocab(); });
  const qi = app.querySelector('#vq');
  qi.oninput = () => { vocabQuery = qi.value; const p = qi.selectionStart; renderVocab(); const n = app.querySelector('#vq'); n.focus(); n.setSelectionRange(p, p); };
  // Count-up-Animation des Rotations-Zählers (nach dem Erweitern-Flow).
  if (animFrom != null) {
    const chip = app.querySelector('#rotchip'), num = app.querySelector('#rotnum');
    const diff = started - animFrom, dur = 1100;
    chip.classList.add('bump');
    const float = document.createElement('span');
    float.className = 'plusfloat'; float.textContent = `+${diff}`;
    chip.appendChild(float);
    let t0 = null;
    const tick = (t) => {
      if (t0 == null) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      num.textContent = Math.round(animFrom + diff * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => { chip.classList.remove('bump'); float.remove(); }, 400);
    };
    requestAnimationFrame(tick);
  }
}

/* ---------- ZAHLEN LERNEN (Getallen) — eigenes Spezial-Modul ---------- */
function renderNumbers() {
  const chip = (n) => `<button class="numchip" data-say="${esc(dutchNum(n))}"><b>${n}</b><span>${esc(dutchNum(n))}</span></button>`;
  const range = (a, b) => { let s = ''; for (let i = a; i <= b; i++) s += chip(i); return s; };
  const tens = [20, 30, 40, 50, 60, 70, 80, 90].map(chip).join('');
  const comp = [21, 22, 33, 45, 58, 67, 99].map(chip).join('');
  const big = [100, 200, 750, 1000, 2024].map(chip).join('');
  app.innerHTML = `<div class="stack">
    <div class="row" style="align-items:center;gap:10px">
      <button class="btn small ghost" id="back">← Training</button>
      <div class="section-title" style="margin:0">🔢 Zahlen</div>
    </div>
    <div class="gcard">
      <p><b>So funktionieren niederländische Zahlen</b></p>
      <p style="margin-top:6px">Bis <b>20</b> lernt man sie einfach auswendig. Ab <b>21</b> kommt die
      <b>Einer-Zahl zuerst</b>, dann „en", dann der Zehner — genau wie im Deutschen „<i>einund</i>zwanzig":
      <b>een&#8288;en&#8288;twintig</b>.</p>
      <p style="margin-top:6px">Endet die Einer-Zahl auf <b>twee</b> oder <b>drie</b>, wird aus „en" ein
      <b>„ën"</b> (mit Trema): <b>twee&#8288;ën&#8288;twintig</b> (22), <b>drie&#8288;ën&#8288;dertig</b> (33).</p>
      <p style="margin-top:6px" class="muted">Tipp auf jede Zahl, um sie zu hören 🔊</p>
    </div>
    <div class="section-sub">0–12 · die Basis</div><div class="numgrid">${range(0, 12)}</div>
    <div class="section-sub">13–19 · …tien</div><div class="numgrid">${range(13, 19)}</div>
    <div class="section-sub">Zehner · 20–90</div><div class="numgrid">${tens}</div>
    <div class="section-sub">Zusammengesetzt · Einer zuerst</div><div class="numgrid">${comp}</div>
    <div class="section-sub">Große Zahlen · honderd &amp; duizend</div><div class="numgrid">${big}</div>
    <button class="btn learn-cta" id="drill" style="margin-top:8px">▶ Zahlen üben</button>
  </div>`;
  app.querySelector('#back').onclick = () => { vocabSub = null; renderVocab(); };
  app.querySelector('#drill').onclick = () => openNumberDrill();
  app.querySelectorAll('.numchip').forEach(b => b.onclick = () => speak(b.dataset.say));
}
function readNumberQ(n, rnd) {
  const opts = new Set([n]); while (opts.size < 4) opts.add(rnd());
  const options = shuffle([...opts]);
  return { kind: 'read', n, options, answer: options.indexOf(n) };
}
function numberDrillQuestions(count = 10) {
  // NIE nach der Schreibweise fragen — nur Lese-Versteh (Wort → Ziffer wählen)
  // und Hör-Versteh (hören → Ziffer eintippen). User tippt immer nur eine Zahl.
  const qs = [], used = new Set();
  const rnd = () => Math.floor(Math.random() * 100); // 0–99
  let guard = 0;
  while (qs.length < count && guard++ < 300) {
    const n = rnd(); if (used.has(n)) continue; used.add(n);
    const kind = ['read', 'listen'][qs.length % 2];
    if (kind === 'read') qs.push(readNumberQ(n, rnd));
    else qs.push({ kind: 'listen', n });
  }
  return shuffle(qs);
}
function openNumberDrill() {
  const rnd = () => Math.floor(Math.random() * 100);
  let qs = numberDrillQuestions(10);
  // Ohne TTS kein Hör-Versteh → auf Lese-Versteh (Ziffer wählen) umstellen, nie Schreibweise.
  if (!ttsSupported()) qs = qs.map(q => q.kind === 'listen' ? readNumberQ(q.n, rnd) : q);
  const total = qs.length, score = { correct: 0 };
  openFlow(qs.map((q, i) => numDrillStep(q, i + 1, total, score)), (fe) => {
    const pct = Math.round(score.correct / total * 100);
    fe.innerHTML = `<div class="flow-body"><div class="done">
      <div class="big">${pct >= 80 ? '🎉' : '🔢'}</div><h2>${pct}% richtig</h2>
      <p class="muted">${score.correct}/${total} · ${pct >= 80 ? 'Sterk! Je kent je getallen.' : 'Übung macht den Meister.'}</p>
      <button class="btn" id="again" style="max-width:280px;margin-top:12px">Nochmal üben</button>
      <button class="btn ghost" id="fin" style="max-width:280px;margin-top:8px">Fertig</button></div></div>`;
    fe.querySelector('#again').onclick = () => { closeFlow(); openNumberDrill(); };
    fe.querySelector('#fin').onclick = () => closeFlow();
  });
}
function numDrillStep(question, num, total, score) {
  const word = dutchNum(question.n);
  const nextBtn = (foot, done) => { foot.innerHTML = `<button class="btn" id="n">${num === total ? 'Auswertung' : 'Weiter'}</button>`; foot.querySelector('#n').onclick = done; };
  return { render(body, foot, done) {
    const head = `<div class="step-label">Zahlen · ${num}/${total}</div>`;
    if (question.kind === 'read') {
      body.innerHTML = `${head}<div class="step-title">Welche Zahl ist „${esc(word)}"?</div>
        <div class="choices">${question.options.map((o, i) => `<button class="choice" data-i="${i}">${o}</button>`).join('')}</div>`;
      speak(word);
      let answered = false;
      body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
        if (answered) return; answered = true;
        const ok = (+btn.dataset.i) === question.answer; if (ok) score.correct++; recordAnswer(ok);
        body.querySelectorAll('.choice').forEach((b2, i) => { if (i === question.answer) b2.classList.add('correct'); else if (i === +btn.dataset.i) b2.classList.add('wrong'); });
        nextBtn(foot, done);
      });
      foot.innerHTML = '';
    } else if (question.kind === 'listen') {
      body.innerHTML = `${head}<div class="step-title">Hör zu und tippe die Zahl (Ziffern):</div>
        <div style="text-align:center;margin:12px 0"><button class="iconbtn" id="rep" style="width:64px;height:64px;font-size:28px">🔊</button></div>
        <div class="answer"><input id="ans" inputmode="numeric" autocomplete="off" placeholder="z. B. 42"></div><div id="fb" class="afb"></div>`;
      speak(word);
      body.querySelector('#rep').onclick = () => speak(word);
      const inp = body.querySelector('#ans'); inp.focus();
      foot.innerHTML = `<button class="btn" id="chk">Prüfen</button>`;
      const check = () => {
        const ok = inp.value.trim() === String(question.n); inp.disabled = true; if (ok) score.correct++; recordAnswer(ok);
        body.querySelector('#fb').innerHTML = `<div class="${ok ? 'ok' : 'bad'}">${ok ? '✓ Richtig! ' : '✗ '}<b>${question.n} = ${esc(word)}</b></div>`;
        nextBtn(foot, done);
      };
      foot.querySelector('#chk').onclick = check; inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    }
  }};
}

// Neue Wörter in den Fundus holen: nur Begriffe, die NICHT in einer noch
// kommenden Lektion vorkommen (kein Spoiler) — Bank + abgeschlossene Lektionen.
// Gates: Trefferquote ≥ 50 % und max. 80 Extra-Vokabeln pro Tag.
function openLearnNew(n = null) {
  const acc = stats().accuracy;
  if (acc != null && acc < 50) { toast('Trefferquote unter 50 % — erst festigen, dann erweitern.', '🎯'); return; }
  const quota = extraRemainingToday();
  if (!quota) { toast(`Tageslimit erreicht — morgen wieder ${EXTRA_DAILY_MAX} frei.`, '⏳'); return; }
  const pool = extraVocab(Math.min(n || dailyNewLimit(), quota));
  if (!pool.length) { toast('Alle freien Wörter sind schon im Training! 🎉', '➕'); return; }
  // Zählerstand VOR dem Flow merken → beim Rücksprung zählt der Chip sichtbar hoch.
  const before = ALL_VOCAB.reduce((a, v) => a + (state.cards[v.id] && state.cards[v.id].reps ? 1 : 0), 0);
  openFlow([stepIntro(pool), ...practiceModules(pool)], (fe) => {
    sessionStorage.setItem('gz.rotAnim', String(before));
    finishScreen(fe, '➕', `${pool.length} neue ${pool.length === 1 ? 'Wort' : 'Wörter'}`, 'Mit Abfrage eingeführt — jetzt im Fundus.', 'vocab');
  });
}

// Nur bereits bekannte (gestartete) Vokabeln üben: fällige zuerst,
// sonst eine gemischte Runde aus dem gesamten Fundus.
function openPracticeKnown() {
  const due = dueVocab();
  const pool = due.length ? due : shuffle(startedVocab().slice()).slice(0, 12);
  runReview(pool, {
    label: due.length ? 'Wiederholen' : 'Vokabeltraining', emoji: '🔁', title: 'Geübt!',
    empty: 'Noch keine bekannten Wörter — hol dir erst neue!', returnTab: 'vocab',
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

/* ============================================================
 * NEUE LEKTIONS-MODULE (Recall-Leiter) — via Sub-Agenten gebaut,
 * adversarial verifiziert, story-gekoppelt (nutzen l.vocab/speak/dialogue).
 * ============================================================ */
// Rezeptives Tap-to-Pair-Matching: NL links, DE (gemischt) rechts.
// Erst NL antippen, dann DE. Richtiges Paar wird gruen fixiert, falsches kurz rot.
// Alle Paare gefunden -> done(). Nutzt nur vorhandene Helfer (esc, shuffle, recordAnswer, speak, ttsSupported).
function stepMatch(l) {
  // Kurze, gut matchbare Vokabeln waehlen (max. 2 Woerter, nicht zu lang).
  const short = (v) => {
    const s = String(v.nl || '').trim();
    return s && s.split(/\s+/).length <= 2 && s.length <= 16 && String(v.de || '').trim();
  };
  // Dedupe nach deutscher Uebersetzung: verhindert zwei optisch identische DE-Zellen.
  const seenDe = new Set();
  const uniq = (l.vocab || []).filter(v => {
    if (!short(v)) return false;
    const key = normalize(String(v.de || ''));
    if (seenDe.has(key)) return false;
    seenDe.add(key); return true;
  });
  // Bis zu 5 Paare; jedes Paar bekommt einen stabilen, garantiert eindeutigen lokalen Key (_k).
  const pairs = shuffle(uniq.slice()).slice(0, 5).map((v, i) => ({ k: String(i), nl: v.nl, de: v.de }));
  if (pairs.length < 2) return { render(body, foot, done) { done(); } }; // NO-OP: zu wenig Material

  return { render(body, foot, done) {
    const left = shuffle(pairs.slice());   // NL-Reihenfolge
    const right = shuffle(pairs.slice());  // DE-Reihenfolge (unabhaengig gemischt)
    const total = pairs.length;
    let matched = 0, selNl = null, locked = false;

    const head = `<div class="step-label">Paare · Wörter verbinden</div>
      <div class="step-title">Tippe ein niederländisches Wort, dann seine Übersetzung</div>`;
    body.innerHTML = head +
      `<div class="mtch-grid">
        <div class="mtch-col" id="mtchL">${left.map(v =>
          `<button class="mtch-cell" data-k="${esc(v.k)}" data-side="nl">${esc(v.nl)}</button>`).join('')}</div>
        <div class="mtch-col" id="mtchR">${right.map(v =>
          `<button class="mtch-cell" data-k="${esc(v.k)}" data-side="de">${esc(v.de)}</button>`).join('')}</div>
      </div>
      <div class="mtch-prog" id="mtchProg">0/${total}</div>`;
    foot.innerHTML = '';

    // Keys sind reine Zahlen-Strings -> sicher im Attribut-Selektor (kein CSS.escape noetig).
    const cellByK = (side, k) =>
      body.querySelector('.mtch-cell[data-side="' + side + '"][data-k="' + k + '"]');
    const clearSel = () => body.querySelectorAll('.mtch-cell.mtch-sel').forEach(b => b.classList.remove('mtch-sel'));

    const finish = () => {
      body.querySelector('#mtchProg').textContent = 'Alle Paare gefunden ✓';
      foot.innerHTML = '<button class="btn" id="mtchNext">Weiter</button>';
      foot.querySelector('#mtchNext').onclick = done;
    };

    const onNl = (btn) => {
      if (btn.classList.contains('mtch-done') || locked) return;
      clearSel(); btn.classList.add('mtch-sel'); selNl = btn.dataset.k;
      const v = pairs.find(p => p.k === selNl);
      if (v && ttsSupported()) speak(v.nl);
    };

    const onDe = (btn) => {
      if (btn.classList.contains('mtch-done') || locked) return;
      if (selNl == null) { btn.classList.add('mtch-shake'); setTimeout(() => btn.classList.remove('mtch-shake'), 350); return; }
      const ok = btn.dataset.k === selNl;
      recordAnswer(ok);
      if (ok) {
        const nlBtn = cellByK('nl', selNl);
        [nlBtn, btn].forEach(b => { if (b) { b.classList.remove('mtch-sel'); b.classList.add('mtch-done', 'correct'); b.disabled = true; } });
        selNl = null; matched++;
        body.querySelector('#mtchProg').textContent = matched + '/' + total;
        if (matched >= total) finish();
      } else {
        locked = true;
        const nlBtn = cellByK('nl', selNl);
        btn.classList.add('wrong', 'mtch-shake');
        if (nlBtn) nlBtn.classList.add('wrong');
        setTimeout(() => {
          btn.classList.remove('wrong', 'mtch-shake');
          if (nlBtn) nlBtn.classList.remove('wrong');
          clearSel(); selNl = null; locked = false;
        }, 650);
      }
    };

    body.querySelectorAll('.mtch-cell').forEach(btn => {
      btn.onclick = () => { if (btn.dataset.side === 'nl') onNl(btn); else onDe(btn); };
    });
  }};
}

// Lückentext (Cloze) — produktiver gestützte Abfrage.
// Nimmt Vokabel-Beispielsätze (v.ex/v.exDe), blankt das Zielwort im NL-Satz aus,
// zeigt den (farbcodierten) DE-Satz als Hilfe. 3 Items nacheinander.
// Robust: Items ohne auffindbares Zielwort werden übersprungen; keine → NO-OP.
function clozeSpan(ex, nl) {
  if (!ex || !nl) return null;
  const rx = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\// ---- Lektions-Baukasten: Phasen + Anspruchsstufe (Recall-Leiter) ----------');
  const full = String(nl).trim(), bare = stripArt(full).trim();
  const cands = [];
  if (full) cands.push(full);
  if (bare && bare !== full) cands.push(bare);
  const words = bare.split(/\s+/).filter(w => w.length >= 3);
  if (words.length) cands.push(words[words.length - 1]);
  cands.sort((a, b) => b.length - a.length);
  const run = (re) => { const m = re.exec(ex); return m ? { start: m.index, end: m.index + m[0].length, matched: m[0] } : null; };
  for (const c of cands) { const r = run(new RegExp('\\b' + rx(c) + '\\b', 'i')); if (r) return r; }   // exakt
  for (const c of cands) { const r = run(new RegExp('\\b' + rx(c) + '\\w*\\b', 'i')); if (r) return r; } // flektiert
  return null;
}
function stepCloze(l) {
  const vocab = (l && l.vocab) || [];
  const items = [];
  shuffle(vocab.slice()).forEach(v => {
    if (items.length >= 3 || !v || !v.ex || !v.nl) return;
    const span = clozeSpan(v.ex, v.nl);
    if (span) items.push({ v, span });
  });
  if (!items.length) return { render(body, foot, done) { done(); } }; // NO-OP-Fallback
  let i = 0;
  return { render(body, foot, done) {
    const draw = () => {
      if (i >= items.length) return done();
      const { v, span } = items[i];
      const ex = v.ex;
      const before = esc(ex.slice(0, span.start)), after = esc(ex.slice(span.end));
      const cc = ccApply(v.ex, v.exDe || '', [v]);
      const hint = (stripArt(normalize(v.nl))[0] || '');
      const head = `<div class="step-label">Lückentext · ${i + 1}/${items.length}</div>`;
      body.innerHTML = `${head}<div class="step-title">Fülle die Lücke:</div>
        <div class="clz-sent">${before}<span class="clz-gap" id="gap">____</span>${after}</div>
        <div class="clz-hint">🇩🇪 ${cc.de || esc(v.exDe || '')}</div>
        <div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="beginnt mit „${esc(hint)}…“"></div>
        <div id="fb" class="afb"></div>`;
      const inp = body.querySelector('#ans'); inp.focus();
      foot.innerHTML = `<button class="btn" id="chk">Prüfen</button>`;
      const check = () => {
        let r = gradeAnswer(inp.value, span.matched);
        if (!r.ok) { const r2 = gradeAnswer(inp.value, v.nl); if (r2.ok) r = r2; } // Grundform auch ok
        inp.disabled = true; recordAnswer(r.ok);
        const gap = body.querySelector('#gap');
        if (gap) { gap.textContent = span.matched; gap.classList.add(r.ok ? 'clz-ok' : 'clz-bad'); }
        body.querySelector('#fb').innerHTML = `<div class="${r.ok ? 'ok' : 'bad'}">${r.ok ? (r.typo ? '✓ Fast! ' : '✓ Richtig! ') : '✗ '}<b>${esc(span.matched)}</b></div><div class="ex">${esc(v.de)}</div>`;
        if (r.ok) speak(v.nl); else speak(span.matched);
        const sayBtn = ttsSupported() ? `<button class="btn ghost" id="say">🔊 Satz</button>` : '';
        foot.innerHTML = `${sayBtn}<button class="btn" id="n">${i === items.length - 1 ? 'Fertig' : 'Weiter'}</button>`;
        const sb = foot.querySelector('#say'); if (sb) sb.onclick = () => speak(v.ex);
        foot.querySelector('#n').onclick = () => { i++; draw(); };
      };
      foot.querySelector('#chk').onclick = check;
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    };
    draw();
  }};
}

// Produktiver Satzbau: Wort-Chunks gemischt als antippbare Chips ordnen.
// Tap-to-Order (touch-fest, KEIN HTML5-Drag). Quelle: l.speak[].nl, sonst kurze l.dialogue-Zeile.
function stepSentenceBuild(l) {
  // Kandidaten-Satz wählen: 2–9 Wörter, mit DE-Bedeutung.
  const pick = () => {
    const cands = [];
    (l.speak || []).forEach(s => { if (s && s.nl && s.de) { const w = s.nl.trim().split(/\s+/); if (w.length >= 2 && w.length <= 9) cands.push({ nl: s.nl.trim(), de: s.de }); } });
    if (!cands.length) (l.dialogue || []).forEach(d => { if (d && d.nl && d.de) { const w = d.nl.trim().split(/\s+/); if (w.length >= 2 && w.length <= 9) cands.push({ nl: d.nl.trim(), de: d.de }); } });
    return cands.length ? cands[Math.floor(Math.random() * cands.length)] : null;
  };
  const sent = pick();
  if (!sent) return { render(body, foot, done) { done(); } }; // NO-OP: kein passender Satz

  const chunks = sent.nl.split(/\s+/);
  return { render(body, foot, done) {
    // Startreihenfolge mischen (nicht identisch mit Original, falls möglich).
    const idx = chunks.map((_, i) => i);
    let pool = shuffle(idx.slice());
    let guard = 0;
    while (chunks.length > 1 && pool.join() === idx.join() && guard++ < 20) pool = shuffle(idx.slice());
    let placed = [];
    let solved = false;

    body.innerHTML =
      '<div class="step-label">Satzbau · Ordne die Wörter</div>' +
      '<div class="step-title">Bau den niederländischen Satz</div>' +
      '<div class="sbld-de">🇩🇪 ' + esc(sent.de) + '</div>' +
      '<div class="sbld-ans" id="sbld-ans"></div>' +
      '<div class="sbld-pool" id="sbld-pool"></div>' +
      '<div id="fb" class="afb"></div>';
    const ansEl = body.querySelector('#sbld-ans');
    const poolEl = body.querySelector('#sbld-pool');
    const fb = body.querySelector('#fb');

    const setFoot = () => {
      foot.innerHTML = '<button class="btn ghost small" id="rst" style="flex:0 0 auto;width:auto">↺ Zurücksetzen</button>' +
        '<button class="btn" id="chk"' + (placed.length === chunks.length ? '' : ' disabled') + '>Prüfen</button>';
      foot.querySelector('#rst').onclick = () => { if (solved) return; pool = pool.concat(placed); placed = []; draw(); };
      foot.querySelector('#chk').onclick = check;
    };

    const draw = () => {
      // Antwortzeile
      if (!placed.length) {
        ansEl.innerHTML = '<span class="sbld-empty">Tippe die Wörter der Reihe nach an…</span>';
      } else {
        ansEl.innerHTML = placed.map((ci, pos) =>
          '<button class="sbld-chip sbld-in" data-pos="' + pos + '">' + esc(chunks[ci]) + '</button>').join('');
        ansEl.querySelectorAll('.sbld-chip').forEach(b => b.onclick = () => {
          if (solved) return;
          const pos = +b.dataset.pos; pool.push(placed[pos]); placed.splice(pos, 1); draw();
        });
      }
      // Wort-Vorrat
      poolEl.innerHTML = pool.length
        ? pool.map((ci, k) => '<button class="sbld-chip" data-k="' + k + '">' + esc(chunks[ci]) + '</button>').join('')
        : '<span class="sbld-empty">— alle Wörter gesetzt —</span>';
      poolEl.querySelectorAll('.sbld-chip').forEach(b => b.onclick = () => {
        if (solved) return;
        const k = +b.dataset.k; placed.push(pool[k]); pool.splice(k, 1); draw();
      });
      setFoot();
    };

    const check = () => {
      if (solved || placed.length !== chunks.length) return;
      solved = true;
      const guess = placed.map(ci => chunks[ci]).join(' ');
      const ok = normalize(guess) === normalize(sent.nl); // interpunktions-/groß-klein-tolerant
      recordAnswer(ok);
      // Chips wortweise einfärben (dupletten-fest: Wort an Position pos vs. Zielwort an pos)
      ansEl.querySelectorAll('.sbld-chip').forEach((b, pos) => {
        const good = normalize(chunks[placed[pos]]) === normalize(chunks[pos]);
        b.classList.add(good ? 'sbld-ok' : 'sbld-bad');
      });
      fb.innerHTML = ok
        ? '<div class="ok">✓ Perfect! <b>' + esc(sent.nl) + '</b></div>'
        : '<div class="bad">✗ Richtig wäre:</div><div class="ex">' + esc(sent.nl) + '</div>';
      if (ok && ttsSupported()) speak(sent.nl);
      foot.innerHTML = '<button class="btn" id="n">Weiter</button>';
      foot.querySelector('#n').onclick = done;
    };

    draw();
  } };
}

// Hör-Diktat: TTS liest einen kurzen NL-Satz vor, Nutzer tippt ihn nach.
// 🔊 wiederholt. Ohne TTS: Satz 2s sichtbar zeigen, dann ausblenden. bis zu 2 Items.
function stepDictation(l) {
  // Quelle: bevorzugt l.speak (nl+de), sonst kurze Dialogzeilen (<= 8 Wörter).
  const pool = [];
  (l.speak || []).forEach(s => { if (s && s.nl && s.de) pool.push({ nl: s.nl, de: s.de }); });
  if (pool.length < 2 && Array.isArray(l.dialogue)) {
    l.dialogue.forEach(d => {
      if (d && d.nl && d.de && d.nl.trim().split(/\s+/).length <= 8) pool.push({ nl: d.nl, de: d.de });
    });
  }
  // Nach NL dedupen.
  const seen = new Set(), src = [];
  pool.forEach(p => { const k = p.nl.trim().toLowerCase(); if (!seen.has(k)) { seen.add(k); src.push(p); } });
  if (!src.length) return { render(body, foot, done) { done(); } }; // NO-OP: keine Daten
  const items = shuffle(src.slice()).slice(0, 2);
  const supported = ttsSupported();

  let i = 0;
  return { render(body, foot, done) {
    const draw = () => {
      if (i >= items.length) return done();
      const it = items[i];
      const head = `<div class="step-label">Hör-Diktat · ${i + 1}/${items.length}</div>`;
      body.innerHTML = `${head}
        <div class="step-title">Hör zu und tippe, was du hörst</div>
        <div class="dict-play">
          <button class="iconbtn dict-rep" id="rep" style="width:64px;height:64px;font-size:28px">${supported ? '🔊' : '👁'}</button>
          <span class="muted dict-hint" id="hint">${supported ? 'Tippen zum Wiederholen' : 'Tippen: Satz kurz zeigen'}</span>
        </div>
        <div class="dict-show" id="show" aria-hidden="true"></div>
        <div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="auf Niederländisch…"></div>
        <div id="fb" class="afb"></div>`;
      const inp = body.querySelector('#ans');
      const show = body.querySelector('#show');
      let timer = null;
      const present = () => {
        if (supported) { speak(it.nl); }
        else {
          show.textContent = it.nl; show.classList.add('on');
          clearTimeout(timer);
          timer = setTimeout(() => { show.classList.remove('on'); }, 2000);
        }
      };
      body.querySelector('#rep').onclick = present;
      present();
      inp.focus();
      foot.innerHTML = `<button class="btn" id="chk">Prüfen</button>`;
      const check = () => {
        clearTimeout(timer); show.classList.remove('on');
        const r = gradeAnswer(inp.value, it.nl); inp.disabled = true; recordAnswer(r.ok);
        body.querySelector('#fb').innerHTML =
          `<div class="${r.ok ? 'ok' : 'bad'}">${r.ok ? (r.typo ? '✓ Fast — ' : '✓ Richtig! ') : '✗ '}<b>${esc(it.nl)}</b></div>
           <div class="ex">${esc(it.de)}</div>`;
        if (supported) speak(it.nl);
        foot.innerHTML = `<button class="btn" id="n">${i === items.length - 1 ? 'Fertig' : 'Weiter'}</button>`;
        foot.querySelector('#n').onclick = () => { i++; draw(); };
      };
      foot.querySelector('#chk').onclick = check;
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    };
    draw();
  }};
}

/* ============ Interleaved-Konjugation (Grammatik-Härtetest) ============ */
// Kuratierte Konjugationstabelle (App hat keine Verbdaten). Fachlich geprüft,
// inkl. unregelmäßiger Formen. Präsens: ik/jij/hij/wij. Perfectum: Hilfsverb
// (hebben/zijn) + voltooid deelwoord — Hilfsverb wird je Person flektiert.
const CJD_AUX = {
  hebben: { ik: 'heb', jij: 'hebt', hij: 'heeft', wij: 'hebben' },
  zijn:   { ik: 'ben', jij: 'bent', hij: 'is',    wij: 'zijn' }
};
const CJD_VERBS = [
  { inf: 'zijn',   pres: { ik: 'ben',  jij: 'bent',  hij: 'is',    wij: 'zijn'   }, perf: { aux: 'zijn',   part: 'geweest' } },
  { inf: 'hebben', pres: { ik: 'heb',  jij: 'hebt',  hij: 'heeft', wij: 'hebben' }, perf: { aux: 'hebben', part: 'gehad'   } },
  { inf: 'gaan',   pres: { ik: 'ga',   jij: 'gaat',  hij: 'gaat',  wij: 'gaan'   }, perf: { aux: 'zijn',   part: 'gegaan'  } },
  { inf: 'komen',  pres: { ik: 'kom',  jij: 'komt',  hij: 'komt',  wij: 'komen'  }, perf: { aux: 'zijn',   part: 'gekomen' } },
  { inf: 'doen',   pres: { ik: 'doe',  jij: 'doet',  hij: 'doet',  wij: 'doen'   }, perf: { aux: 'hebben', part: 'gedaan'  } },
  { inf: 'maken',  pres: { ik: 'maak', jij: 'maakt', hij: 'maakt', wij: 'maken'  }, perf: { aux: 'hebben', part: 'gemaakt' } },
  { inf: 'wonen',  pres: { ik: 'woon', jij: 'woont', hij: 'woont', wij: 'wonen'  }, perf: { aux: 'hebben', part: 'gewoond' } },
  { inf: 'werken', pres: { ik: 'werk', jij: 'werkt', hij: 'werkt', wij: 'werken' }, perf: { aux: 'hebben', part: 'gewerkt' } },
  { inf: 'willen', pres: { ik: 'wil',  jij: 'wilt',  hij: 'wil',   wij: 'willen' }, perf: { aux: 'hebben', part: 'gewild'  } },
  { inf: 'kunnen', pres: { ik: 'kan',  jij: 'kunt',  hij: 'kan',   wij: 'kunnen' }, perf: { aux: 'hebben', part: 'gekund'  } }
];
// Zulässige Nebenformen (werden zusätzlich als richtig akzeptiert).
const CJD_ALT = { 'willen|jij': ['wil'], 'kunnen|jij': ['kan'] };
const CJD_PERSONS = ['ik', 'jij', 'hij', 'wij'];
const CJD_TLABEL = { pres: 'Präsens', perf: 'Perfekt' };

// Alle akzeptierten Zielformen für ein Item (targets[0] = kanonische Form).
function cjdTargets(it) {
  if (it.t === 'pres') {
    const alt = CJD_ALT[it.v.inf + '|' + it.p] || [];
    return [it.v.pres[it.p]].concat(alt);
  }
  return [CJD_AUX[it.v.perf.aux][it.p] + ' ' + it.v.perf.part];
}
// Tolerantes Grading gegen mehrere Zielformen (bevorzugt exakten Treffer).
function cjdGrade(val, targets) {
  let best = { ok: false, typo: false };
  for (let i = 0; i < targets.length; i++) {
    const r = gradeAnswer(val, targets[i]);
    if (r.ok && !r.typo) return { ok: true, typo: false };
    if (r.ok) best = { ok: true, typo: true };
  }
  return best;
}
// Interleaved: 3 Präsens + 3 Perfekt, über verschiedene Verben, dann gemischt.
function cjdItems() {
  const pres = [], perf = [];
  for (let i = 0; i < CJD_VERBS.length; i++) {
    for (let j = 0; j < CJD_PERSONS.length; j++) {
      pres.push({ v: CJD_VERBS[i], p: CJD_PERSONS[j], t: 'pres' });
      perf.push({ v: CJD_VERBS[i], p: CJD_PERSONS[j], t: 'perf' });
    }
  }
  const pick = (arr, n) => {
    shuffle(arr); const out = [], seen = {};
    for (let k = 0; k < arr.length && out.length < n; k++) {
      if (seen[arr[k].v.inf]) continue; // pro Zeitform verschiedene Verben
      seen[arr[k].v.inf] = 1; out.push(arr[k]);
    }
    return out;
  };
  return shuffle(pick(pres, 3).concat(pick(perf, 3)));
}

// EIN Step, der intern 6 interleaved Konjugations-Items abfragt.
function stepConjDrill(l) {
  const items = cjdItems();
  if (!items.length) return { render(body, foot, done) { done(); } };
  return { render(body, foot, done) {
    let i = 0;
    const show = () => {
      const it = items[i];
      const targets = cjdTargets(it);
      const canon = targets[0];
      let answered = false;
      const head = `<div class="step-label">Konjugation · ${i + 1}/${items.length}</div>`;
      const cue = `<div class="cjd-cue"><span class="pill ${it.t === 'perf' ? 'blue' : 'good'}">${CJD_TLABEL[it.t]}</span>`
        + `<span class="cjd-hint">${it.t === 'perf' ? 'Hilfsverb + voltooid deelwoord' : 'juiste vorm'}</span></div>`;
      body.innerHTML = `${head}<div class="step-title">${esc(it.p)} <span class="cjd-blank">…</span> <span class="cjd-inf">(${esc(it.v.inf)})</span></div>`
        + cue
        + `<div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="op zijn Nederlands…"></div>`
        + `<div id="fb" class="afb"></div>`;
      const inp = body.querySelector('#ans'); inp.focus();
      foot.innerHTML = `<button class="btn" id="chk">Prüfen</button>`;
      const check = () => {
        if (answered) return; answered = true;
        const r = cjdGrade(inp.value, targets); inp.disabled = true; recordAnswer(r.ok);
        const full = `${esc(it.p)} ${esc(canon)}`;
        body.querySelector('#fb').innerHTML =
          `<div class="${r.ok ? 'ok' : 'bad'}">${r.ok ? (r.typo ? '✓ Fast — ' : '✓ Richtig! ') : '✗ '}<b>${full}</b></div>`
          + (it.t === 'perf' ? `<div class="ex">${CJD_TLABEL.perf} von „${esc(it.v.inf)}"</div>` : '');
        if (r.ok && ttsSupported()) speak(it.p + ' ' + canon);
        const last = i === items.length - 1;
        foot.innerHTML = `<button class="btn" id="n">${last ? 'Fertig' : 'Weiter'}</button>`;
        foot.querySelector('#n').onclick = () => { if (last) { done(); } else { i++; show(); } };
      };
      foot.querySelector('#chk').onclick = check;
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    };
    show();
  }};
}

// Integration (Stufe 5-6): "Vervollständige das Gespräch".
// Spielt l.dialogue Zeile für Zeile ab; an 1-2 Stellen wird die echte Antwort
// durch eine MC-Auswahl ersetzt (echte Zeile + plausible Distraktoren aus
// anderen Dialogzeilen/Sprech-Sätzen). Richtige Wahl setzt das Gespräch fort,
// falsche zeigt kurz die richtige Zeile. Nur vorhandene Helfer.
function stepBranchDialogue(l) {
  const NOOP = { render(body, foot, done) { done(); } };
  const dlg = (l && Array.isArray(l.dialogue)) ? l.dialogue.filter(d => d && d.nl && d.de) : [];
  if (dlg.length < 3) return NOOP;

  const norm = s => (s == null ? '' : String(s)).trim();
  const low = s => norm(s).toLowerCase();

  // Distraktor-Pool: alle NL-Zeilen des Dialogs + Sprech-Sätze der Lektion.
  const poolNl = [];
  dlg.forEach(d => poolNl.push(d.nl));
  if (Array.isArray(l.speak)) l.speak.forEach(s => { if (s && s.nl) poolNl.push(s.nl); });

  function distractorsFor(correct, exclude) {
    const c = low(correct), seen = {}, out = [];
    shuffle(poolNl.slice()).forEach(s => {
      const k = low(s);
      if (!k || k === c || seen[k]) return;
      if (exclude && exclude.has(k)) return;
      seen[k] = 1; out.push(s);
    });
    return out;
  }

  // Lücken wählen: bevorzugt "Du"-Zeilen (die Antworten des Lernenden),
  // sonst alle Antwortzeilen ab Index 1. Nur Zeilen mit >=1 Distraktor.
  const all = [];
  for (let i = 1; i < dlg.length; i++) all.push(i);
  const du = all.filter(i => /^du$/i.test(norm(dlg[i].who)));
  let base = (du.length ? du : all).filter(i => distractorsFor(dlg[i].nl, null).length >= 1);
  if (!base.length) return NOOP;
  const gapsArr = base.length <= 2 ? base.slice() : [base[0], base[base.length - 1]];
  const gaps = new Set(gapsArr);
  const gapAns = new Set(gapsArr.map(i => low(dlg[i].nl)));

  return { render(body, foot, done) {
    body.innerHTML = `<div class="step-label">Im Gespräch · Vervollständige das Gespräch</div>
      <div class="step-title">${esc(l.title || 'Gesprek')}</div>
      <p class="muted bdlg-hint">Wähle die passende niederländische Antwort, um das Gespräch fortzusetzen.</p>
      <div class="bdlg-log" id="bdlgLog"></div>
      <div class="bdlg-pick" id="bdlgPick"></div>`;
    const log = body.querySelector('#bdlgLog');
    const pick = body.querySelector('#bdlgPick');
    let pos = 0;

    const appendLine = (d) => {
      const cc = ccApply(d.nl, d.de, l.vocab || []);
      const el = document.createElement('div');
      el.className = 'line bdlg-line';
      el.innerHTML = `<div class="who">${esc(d.who || '')}</div>
        <div><div class="nl">${cc.nl}</div><div class="de">${cc.de}</div></div>
        <div class="spk">🔊</div>`;
      el.onclick = () => speak(d.nl);
      log.appendChild(el);
      if (el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    };

    const finish = () => {
      pick.innerHTML = '';
      foot.innerHTML = `<button class="btn" id="n">Weiter</button>`;
      foot.querySelector('#n').onclick = done;
    };

    const presentGap = (idx) => {
      const d = dlg[idx];
      let distr = distractorsFor(d.nl, gapAns).slice(0, 3);
      if (!distr.length) distr = distractorsFor(d.nl, null).slice(0, 3);
      const opts = shuffle([d.nl].concat(distr));
      pick.innerHTML = `<div class="bdlg-cue">${esc(d.who || 'Du')} …</div>
        <div class="choices">${opts.map((o, i) => `<button class="choice bdlg-choice" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
      foot.innerHTML = '';
      let answered = false;
      pick.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
        if (answered) return; answered = true;
        const chosen = opts[+btn.dataset.i];
        const ok = low(chosen) === low(d.nl);
        recordAnswer(ok);
        pick.querySelectorAll('.choice').forEach((b2, i) => {
          if (low(opts[i]) === low(d.nl)) b2.classList.add('correct');
          else if (i === +btn.dataset.i) b2.classList.add('wrong');
          b2.disabled = true;
        });
        if (ok) speak(d.nl);
        foot.innerHTML = `<button class="btn" id="n">Weiter</button>`;
        foot.querySelector('#n').onclick = () => {
          appendLine(d);          // echte Zeile ins Protokoll übernehmen
          pick.innerHTML = '';
          pos = idx + 1;
          run();
        };
      });
    };

    const run = () => {
      while (pos < dlg.length && !gaps.has(pos)) { appendLine(dlg[pos]); pos++; }
      if (pos >= dlg.length) { finish(); return; }
      presentGap(pos);
    };
    run();
  }};
}

// ---- Lektions-Baukasten: Phasen + Anspruchsstufe (Recall-Leiter) ----------
// Statt einer für ALLE Lektionen identischen Schrittfolge wird die Lektion aus
// Phasen zusammengesetzt. Die Anspruchsstufe (1–6) und Content-Trigger (Grammatik/
// Vokabelthema) steuern, welche Übungs-Module gezogen werden. Neue Module (Matching,
// Cloze, Drag&Drop, Hör-Diktat, Interleaved, Branching) docken hier an einer Phase an.
const STUFE_BY_TRACK = { personen: 5, mythen: 5, ade: 6, feest: 6, natuurkunde: 6 };
// Konjugations-/Zeitform-Grammatiken → später Interleaved-Drill; Wortstellung → Satzbau.
const CONJ_GRAMMAR = new Set(['presens', 'imperfectum', 'perfectum', 'toekomst', 'conditionalis', 'modaal', 'hebbenzijn', 'deelwoord']);
const ORDER_GRAMMAR = new Set(['woordvolgorde', 'bijzin', 'voegwoorden', 'vraagwoorden', 'negatie']);
function lessonStufe(l) {
  if (l.stufe) return l.stufe;
  const key = l.track || 'verhaal';
  if (key === 'verhaal') {
    const i = trackLessons('verhaal').findIndex(x => x.id === l.id);
    return i < 4 ? 1 : i < 9 ? 2 : i < 14 ? 3 : 4;
  }
  return STUFE_BY_TRACK[key] || 3;
}
// Mehrere generative Übungsfragen als aufeinanderfolgende Flow-Schritte (Label „Übung").
function drillSteps(questions, label = 'Übung') {
  const score = { correct: 0 }, total = questions.length;
  return questions.map((q, i) => examStep(q, i + 1, total, score, label));
}
// Baut die Schrittfolge einer Lektion aus Phasen (Kontext→Input→Übung→Integration→Abschluss).
const lessonIndex = (l) => trackLessons(l.track || 'verhaal').findIndex(x => x.id === l.id);
// Wählt EIN story-/grammatik-passendes Übungs-Modul (nicht alle) — bounded, damit
// die Lektion nicht überladen wird und das Modul zur Szene passt. Ohne speziellen
// Grammatik-Trigger wird je Lektion abgewechselt (Parität), damit keine zwei
// aufeinanderfolgenden Lektionen dasselbe Modul ziehen (Interleaving + Abwechslung).
function pickUebung(l, g, stufe) {
  const alt = lessonIndex(l) % 2 === 0;
  if (g === 'getallen') return drillSteps(numberQuestions(3), 'Zahlen');
  if (g === 'meervoud') return drillSteps(pluralQuestions(3), 'Mehrzahl');
  if (ORDER_GRAMMAR.has(g) && stufe >= 2) return [stepSentenceBuild(l)];              // Satzbau bei Wortstellung
  if (CONJ_GRAMMAR.has(g) && stufe >= 3) return alt ? [stepConjDrill(l)] : [stepCloze(l)]; // Konjugation abwechselnd
  if (stufe <= 2) return alt ? [stepMatch(l)] : [stepCloze(l)];                       // früh: rezeptiv/produktiv im Wechsel
  return alt ? [stepCloze(l)] : [stepSentenceBuild(l)];                               // sonst: Cloze/Satzbau im Wechsel
}
function buildLessonSteps(l) {
  if (Array.isArray(l.modules)) return l.modules.map(m => m(l)).filter(Boolean); // Pro-Lektion-Override
  const steps = [], g = l.grammar, stufe = lessonStufe(l);
  // 1) Kontext
  if (l.story) steps.push(stepStory(l));
  // 2) Input
  steps.push(stepGrammar(g, 'Grammatik'), stepIntro(l.vocab));
  // 3) Übung — genau ein passendes Modul (Grammatik/Stufe)
  steps.push(...pickUebung(l, g, stufe));
  // 4) Integration
  if (stufe >= 5 && Array.isArray(l.dialogue) && l.dialogue.length >= 3) {
    steps.push(stepBranchDialogue(l));            // aktives Gespräch statt passivem Lesen (A2+)
  } else {
    steps.push(stepDialogue(l));
    if (stufe >= 3) steps.push(stepDictation(l)); // Hör-Diktat ab Stufe 3
  }
  steps.push(stepGrammarCheck(g));
  if (l.speak && l.speak.length) steps.push(stepSpeak(l.speak));
  // 6) Abschluss
  if (l.culture) steps.push(stepCulture(l));
  return steps;
}
function openLesson(lessonId) {
  const l = LESSONS.find(x => x.id === lessonId);
  if (!lessonUnlocked(l)) { toast('Erst die vorherige Lektion abschließen.', '🔒'); return; }
  const steps = buildLessonSteps(l);
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
  const gkeys = [...new Set(ls.map(l => l.grammar).filter(Boolean))];
  const gchecks = [];
  gkeys.forEach(g => (GRAMMAR[g] && GRAMMAR[g].checks || []).forEach(c => gchecks.push(c)));
  const sentences = [];
  if (lvl >= 2) ls.forEach(l => (l.speak || []).forEach(s => { if (s && s.nl && s.de) sentences.push(s); }));

  const total = Math.min(30, vocab.length + gchecks.length + sentences.length,
    Math.max(14, Math.round(vocab.length * (0.3 + 0.08 * lvl))));
  const typeFrac = [0.2, 0.35, 0.5, 0.65][lvl];
  // Generative Drills: Zahlen/Plural, wenn das Kapitel diese Grammatik enthält.
  const drills = [];
  if (gkeys.includes('getallen')) drills.push(...numberQuestions(3));
  if (gkeys.includes('meervoud')) drills.push(...pluralQuestions(3));
  const nGram = Math.min(gchecks.length, Math.max(2, Math.round(total * 0.2)));
  const nSent = lvl >= 2 ? Math.min(sentences.length, 1 + lvl) : 0;
  const nVocab = Math.max(0, total - nGram - nSent - drills.length);
  const nType = Math.round(nVocab * typeFrac);

  const qs = [];
  shuffle(vocab.slice()).slice(0, nVocab).forEach((v, i) => {
    if (i < nType) qs.push({ type: 'type', q: `Tippe auf Niederländisch: „${v.de}"`, answer: v.nl });
    else { const opts = mcChoices(v, vocab); qs.push({ type: 'mc', q: `Was heißt „${v.de}"?`, options: opts.map(o => o.nl), answer: opts.indexOf(v) }); }
  });
  shuffle(gchecks.slice()).slice(0, nGram).forEach(c => qs.push({ type: 'mc', q: c.q, options: c.options.slice(), answer: c.answer }));
  shuffle(sentences.slice()).slice(0, nSent).forEach(s => qs.push({ type: 'type', q: `Tippe auf Niederländisch: „${s.de}"`, answer: s.nl }));
  qs.push(...drills);
  return shuffle(qs);
}

function examStep(question, num, total, score, label = 'Prüfung') {
  return { render(body, foot, done) {
    const head = `<div class="step-label">${esc(label)} · Frage ${num}/${total}</div><div class="step-title">${esc(question.q)}</div>`;
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
// Abruf-Format nach Reife: Wiedererkennen → gestützte Abfrage → freie Produktion.
function fmtByCard(card) {
  const S = (card && card.S) || 0, reps = (card && card.reps) || 0;
  if (reps < 2 || S < 2) return 'mc';
  if (S < 8) return 'cued';
  return 'prod';
}
// Distraktoren mit gleicher Oberflächenform wählen (Frage→Frage, ähnliche Länge,
// Artikel) — damit man nicht durch Ausschluss rät.
/* ---------- Generative Drills: Zahlen & Plural ---------- */
const NL_ONES = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
const NL_TENS = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];
function dutchNum(n) {
  if (n < 20) return NL_ONES[n];
  if (n < 100) { const t = Math.floor(n / 10), u = n % 10; if (!u) return NL_TENS[t]; return NL_ONES[u] + ((u === 2 || u === 3) ? 'ën' : 'en') + NL_TENS[t]; }
  if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h === 1 ? '' : NL_ONES[h]) + 'honderd' + (r ? dutchNum(r) : ''); }
  if (n < 1000000) { const th = Math.floor(n / 1000), r = n % 1000; return (th === 1 ? '' : dutchNum(th)) + 'duizend' + (r ? dutchNum(r) : ''); }
  return String(n);
}
function numberQuestions(count, max = 100) {
  // Zahlen NIE als Schreibweise abfragen — immer Lese-Versteh: NL-Wort lesen, die
  // richtige ZIFFER wählen (User tippt/wählt nur eine Zahl, nie das ausgeschriebene Wort).
  const out = [], used = new Set();
  let guard = 0;
  while (out.length < count && guard++ < 200) {
    const n = Math.floor(Math.random() * (max + 1));
    if (used.has(n)) continue; used.add(n);
    const opts = new Set([n]);
    while (opts.size < 4) opts.add(Math.floor(Math.random() * (max + 1)));
    const options = shuffle([...opts]);
    out.push({ q: `Welche Zahl ist „${dutchNum(n)}"?`, options: options.map(String), answer: options.indexOf(n) });
  }
  return out;
}
function pluralQuestions(count) {
  return shuffle(PLURAL_PAIRS.slice()).slice(0, count).map(p =>
    ({ type: 'type', q: `Wie heißt die Mehrzahl von „${p.sg}"?`, answer: p.pl }));
}

function mcChoices(v, pool, n = 3) {
  const shape = (s) => { s = String(s).trim(); return { q: /\?$/.test(s), words: s.split(/\s+/).length, art: /^(de|het|een)\s/i.test(s) }; };
  const sv = shape(v.nl);
  const score = (x) => { const sx = shape(x.nl); return (sx.q === sv.q ? 5 : 0) + (Math.abs(sx.words - sv.words) <= 1 ? 2 : 0) + (sx.art === sv.art ? 1 : 0); };
  const others = shuffle(pool.filter(x => x.id !== v.id && x.nl !== v.nl))
    .sort((a, b) => score(b) - score(a)).slice(0, n);
  return shuffle([v, ...others]);
}

/* ---------- VOKABEL-KARTE (Detailansicht: Wortart, Bedeutungen, Grammatik, Bild) ---------- */
const POS_LABEL = { substantief: 'Substantiv', werkwoord: 'Verb', adjectief: 'Adjektiv', bijwoord: 'Adverb', voornaamwoord: 'Pronomen', voorzetsel: 'Präposition', telwoord: 'Zahlwort', voegwoord: 'Konjunktion', tussenwerpsel: 'Interjektion', uitdrukking: 'Ausdruck' };
// Legende für die farbigen Wortart-Pillen (Trainingsliste) — Reihenfolge = Anzeige.
const VP_LEGEND = [['substantief', 'Substantiv'], ['werkwoord', 'Verb'], ['adjectief', 'Adjektiv'], ['bijwoord', 'Adverb'], ['telwoord', 'Zahlwort'], ['voornaamwoord', 'Pronomen'], ['voorzetsel', 'Präposition'], ['uitdrukking', 'Ausdruck']];
function cardHTML(v) {
  const c = CARDS[v.id] || null;
  const disp = (c && c.displayNl) || v.nl;
  const genus = c && c.genus;
  const art = CARD_ART.has(v.id) ? `illustrations/vocab/${v.id}.webp` : '';
  const meanings = (c && c.meanings && c.meanings.length) ? c.meanings : [{ de: v.de, ex: v.ex, exDe: v.exDe }];
  const chips = [];
  if (c && c.pos) chips.push(`<span class="cv-chip pos">${POS_LABEL[c.pos] || c.pos}</span>`);
  if (genus) chips.push(`<span class="cv-chip ${genus}">${genus}-Wort</span>`);
  let gram = '';
  if (c && c.pos === 'werkwoord' && c.conjugation) {
    const j = c.conjugation;
    gram = `<div class="cv-sec"><div class="cv-h">Konjugation</div><table class="cv-conj">
      <tr><td class="t">Präsens</td><td>ik <b>${esc(j.presens.ik)}</b></td><td>jij <b>${esc(j.presens.jij)}</b></td></tr>
      <tr><td></td><td>hij <b>${esc(j.presens.hij)}</b></td><td>wij <b>${esc(j.presens.wij)}</b></td></tr>
      <tr><td class="t">Imperfekt</td><td>ik <b>${esc(j.imperfectum.ik)}</b></td><td>wij <b>${esc(j.imperfectum.wij)}</b></td></tr>
      <tr><td class="t">Perfekt</td><td colspan="2"><b>${esc(j.perfectum.aux)}</b> … <b>${esc(j.perfectum.participle)}</b></td></tr></table></div>`;
  } else if (c && c.pos === 'substantief') {
    gram = `<div class="cv-sec"><div class="cv-h">Deklination</div><div class="cv-decl">
      <div><span>Genus</span><b>${genus === 'het' ? 'het-Wort' : 'de-Wort'}</b></div>
      <div><span>Singular</span><b>${esc(disp)}</b></div>
      <div><span>Plural</span><b>${c.plural ? esc((genus ? 'de ' : '') + c.plural) : '—'}</b></div></div></div>`;
  }
  return `<div class="cardview">
    ${art ? `<div class="cv-art"><img src="${art}" alt="" loading="lazy" onerror="this.closest('.cv-art').remove()"></div>` : ''}
    <div class="cv-head"><div class="cv-word">${esc(disp)}<button class="cv-say iconbtn" data-say="${esc(v.nl)}" aria-label="vorlesen">🔊</button></div>
      ${chips.length ? `<div class="cv-chips">${chips.join('')}</div>` : ''}</div>
    <div class="cv-sec"><div class="cv-h">${meanings.length > 1 ? 'Bedeutungen' : 'Bedeutung'}</div>
      <ol class="cv-mean">${meanings.map(m => `<li><b>${esc(m.de)}</b>${m.ex ? `<div class="cv-ex"><span class="nl">${esc(m.ex)}</span><span class="de">${esc(m.exDe || '')}</span></div>` : ''}</li>`).join('')}</ol></div>
    ${gram}
    ${c && c.usage ? `<div class="cv-sec"><div class="cv-h">Verwendung</div><p class="cv-use">${esc(c.usage)}</p></div>` : ''}
    ${c && c.notes ? `<div class="cv-note">💡 ${esc(c.notes)}</div>` : ''}
  </div>`;
}
function bindCardSay(root) { root.querySelectorAll('.cv-say').forEach(b => b.onclick = () => speak(b.dataset.say)); }
// Standalone-Overlay (Vokabelliste → Karte antippen).
function openCard(id) {
  const v = ALL_VOCAB.find(x => x.id === id); if (!v) return;
  const el = document.createElement('div'); el.className = 'flow cardflow'; document.body.appendChild(el); tabbar.style.display = 'none';
  el.innerHTML = `<div class="flow-top"><button class="iconbtn" id="cclose" aria-label="schließen">✕</button><span class="muted" style="font-size:12px;font-weight:700">Vokabelkarte</span></div>
    <div class="flow-body">${cardHTML(v)}</div>`;
  bindCardSay(el); speak(v.nl);
  el.querySelector('#cclose').onclick = () => { el.remove(); tabbar.style.display = ''; };
}

// Neues Wort einführen: Karte (kodieren) → Wiedererkennen/Abruf (interleaved, wechselnde Formate).
// Erst nach echtem Abruf kommt es MIT echtem Grade ins SRS (introWord). Nur NEUE Wörter.
// Kompaktes Frage-Artwork (nur wenn eine Illustration existiert) — für MC/Audio-Schritte.
function cardArtHTML(v) {
  if (!v || !CARD_ART.has(v.id)) return '';
  return `<div class="q-art"><img src="illustrations/vocab/${esc(v.id)}.webp" alt="" loading="lazy" onerror="this.closest('.q-art').remove()"></div>`;
}
function stepIntro(vocab) {
  const pool = vocab.slice();
  return { render(body, foot, done) {
    const queue = vocab.filter(v => !cardOf(v.id).reps);
    if (!queue.length) return done();
    const supported = ttsSupported();
    const total = queue.length;
    const encode = queue.slice();                 // Kennenlernen: ein Flash je Wort
    const retrieve = shuffle(queue.slice());       // Abruf: interleaved über den ganzen Satz
    // Abruf-Formate wechseln sich ab: Wiedererkennen (hin/zurück), Hören, freier Abruf.
    const FMT = supported ? ['mc', 'audio', 'type', 'mcRev', 'listenType'] : ['mc', 'type', 'mcRev', 'type', 'mc'];
    let stage = 'encode', i = 0;

    const grade = (v, ok, typo) => { recordAnswer(ok); introWord(v.id, (ok && !typo) ? 'good' : 'hard'); flushUnlocks(); };
    const nextBtn = (fn) => { foot.innerHTML = `<button class="btn" id="n">${i === total - 1 ? 'Fertig' : 'Weiter'}</button>`; foot.querySelector('#n').onclick = fn; };
    const advance = () => { i++; if (i >= retrieve.length) return done(); draw(); };
    const audioBtn = () => `<div style="text-align:center;margin:4px 0 12px"><button class="iconbtn" id="rep" style="width:60px;height:60px;font-size:26px">🔊</button></div>`;

    // ---- Kennenlernen ----
    const drawEncode = (v) => {
      body.innerHTML = `<div class="step-label">Neues Wort · ${i + 1}/${total}</div>${cardHTML(v)}`;
      bindCardSay(body); speak(v.nl);
      foot.innerHTML = `<button class="btn" id="n">Verstanden</button>`;
      foot.querySelector('#n').onclick = () => { i++; if (i >= encode.length) { stage = 'retrieve'; i = 0; } draw(); };
    };

    // ---- Abruf (Format wechselt) ----
    const optionStep = (v, prompt, keyField, doSpeak, showArt) => {
      const opts = mcChoices(v, pool.length >= 4 ? pool : ALL_VOCAB);
      body.innerHTML = `<div class="step-label">Abfrage · ${i + 1}/${total}</div>
        <div class="step-title">${prompt}</div>${showArt ? cardArtHTML(v) : ''}${doSpeak ? audioBtn() : ''}
        <div class="choices">${opts.map(o => `<button class="choice" data-id="${o.id}">${esc(o[keyField])}</button>`).join('')}</div>`;
      if (doSpeak) { speak(v.nl); const rp = body.querySelector('#rep'); if (rp) rp.onclick = () => speak(v.nl); }
      let answered = false;
      body.querySelectorAll('.choice').forEach(btn => btn.onclick = () => {
        if (answered) return; answered = true;
        const ok = btn.dataset.id === v.id;
        body.querySelectorAll('.choice').forEach(b2 => { if (b2.dataset.id === v.id) b2.classList.add('correct'); else if (b2 === btn) b2.classList.add('wrong'); });
        if (ok) speak(v.nl);
        grade(v, ok, false);
        nextBtn(advance);
      });
      foot.innerHTML = '';
    };
    const inputStep = (v, prompt, doSpeak, showArt) => {
      const hint = stripArt(normalize(v.nl))[0] || '';
      body.innerHTML = `<div class="step-label">Abfrage · ${i + 1}/${total}</div>
        <div class="step-title">${prompt}</div>${showArt ? cardArtHTML(v) : ''}${doSpeak ? audioBtn() : ''}
        <div class="answer"><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${doSpeak ? 'auf Niederländisch…' : 'beginnt mit „' + esc(hint) + '…“'}"></div>
        <div id="fb" class="afb"></div>`;
      if (doSpeak) { speak(v.nl); const rp = body.querySelector('#rep'); if (rp) rp.onclick = () => speak(v.nl); }
      const inp = body.querySelector('#ans'); inp.focus();
      foot.innerHTML = `<button class="btn" id="chk">Prüfen</button>`;
      const check = () => {
        const r = gradeAnswer(inp.value, v.nl); inp.disabled = true;
        body.querySelector('#fb').innerHTML = `<div class="${r.ok ? 'ok' : 'bad'}">${r.ok ? (r.typo ? '✓ Fast! ' : '✓ Richtig! ') : '✗ '}<b>${esc(v.nl)}</b></div><div class="ex">${esc(v.de)}</div>`;
        speak(v.nl);
        grade(v, r.ok, r.typo);
        nextBtn(advance);
      };
      foot.querySelector('#chk').onclick = check;
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    };
    const drawRetrieve = (v, fmt) => {
      if (fmt === 'mcRev') optionStep(v, `Was bedeutet „${esc(v.nl)}"?`, 'de', false, false);
      else if (fmt === 'audio') optionStep(v, `Welches Wort hörst du?`, 'nl', true, true);
      else if (fmt === 'listenType') inputStep(v, `Hör zu und tippe, was du hörst:`, true, true);
      else if (fmt === 'type') inputStep(v, `Tippe auf Niederländisch: „${esc(v.de)}"`, false, false);
      else optionStep(v, `Was heißt „${esc(v.de)}"?`, 'nl', false, true);
    };

    const draw = () => stage === 'encode' ? drawEncode(encode[i]) : drawRetrieve(retrieve[i], FMT[i % FMT.length]);
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
/* ---------- Zweisprachiges Color-Coding (Wortentsprechungen NL↔DE) ----------
   Grundlage sind die Vokabelpaare der Lektion (hohe Präzision) plus wenige,
   eindeutige Funktionswörter. Gleiche Farbe = gleiche Bedeutung. */
const CC_N = 8;
const CC_FUNC = [
  ['ik', 'ich'], ['jij', 'du'], ['u', 'Sie'], ['wij', 'wir'], ['we', 'wir'], ['jullie', 'ihr'],
  ['en', 'und'], ['maar', 'aber'], ['niet', 'nicht'], ['ook', 'auch'],
  ['ja', 'ja'], ['nee', 'nein'], ['hallo', 'hallo'],
];
const ccEscRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ccNorm = (s) => String(s).replace(/[?!.,;:„""'()]/g, '').replace(/\s+/g, ' ').trim();
const ccVariants = (nl) => String(nl).split('/').map(ccNorm).filter(Boolean);
function ccFindAll(text, phrase) {
  const out = [];
  let re;
  try { re = new RegExp(`(?<![\\p{L}])${ccEscRe(phrase)}(?![\\p{L}])`, 'giu'); }
  catch (_) { return out; }
  let m; while ((m = re.exec(text))) { out.push([m.index, m.index + m[0].length]); if (m.index === re.lastIndex) re.lastIndex++; }
  return out;
}
function ccWrap(text, hits) {
  if (!hits.length) return esc(text);
  hits.sort((a, b) => a.start - b.start);
  let out = '', i = 0;
  for (const h of hits) {
    if (h.start < i) continue;
    out += esc(text.slice(i, h.start));
    out += `<span class="cc cc-${h.color}">${esc(text.slice(h.start, h.end))}</span>`;
    i = h.end;
  }
  return out + esc(text.slice(i));
}
// Färbt NL- und DE-Text so ein, dass zusammengehörige Wörter dieselbe Farbe tragen.
function ccApply(nlText, deText, vocab) {
  const pairs = [];
  (vocab || []).forEach(v => { if (v && v.nl && v.de) ccVariants(v.nl).forEach(nlv => pairs.push([nlv, ccNorm(v.de)])); });
  CC_FUNC.forEach(([n, d]) => pairs.push([ccNorm(n), ccNorm(d)]));
  pairs.sort((a, b) => b[0].length - a[0].length);
  const nlHits = [], deHits = [], usedNl = [], usedDe = [];
  const free = (arr, s, e) => !arr.some(h => s < h.end && e > h.start);
  let color = 0;
  for (const [nlp, dep] of pairs) {
    if (nlp.length < 2 || dep.length < 2) continue;
    const nm = ccFindAll(nlText, nlp).find(([s, e]) => free(usedNl, s, e));
    const dm = ccFindAll(deText, dep).find(([s, e]) => free(usedDe, s, e));
    if (nm && dm) {
      const c = color++ % CC_N;
      nlHits.push({ start: nm[0], end: nm[1], color: c }); usedNl.push({ start: nm[0], end: nm[1] });
      deHits.push({ start: dm[0], end: dm[1], color: c }); usedDe.push({ start: dm[0], end: dm[1] });
    }
  }
  return { nl: ccWrap(nlText, nlHits), de: ccWrap(deText, deHits), n: color };
}

function stepDialogue(l) {
  return { render(body, foot, done) {
    body.innerHTML = `<div class="step-label">Im Gespräch</div><div class="step-title">${esc(l.title)}</div>
      ${sceneImg(l, 'dialogue')}
      <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:4px">
        <p class="muted" style="font-size:13px;margin:0">Tipp auf eine Zeile, um sie zu hören.</p>
        ${ttsSupported() ? '<button class="btn small ghost" id="playall">▶ Ganzer Dialog</button>' : ''}</div>
      ${l.dialogue.map((d, k) => { const cc = ccApply(d.nl, d.de, l.vocab); return `<div class="line" data-i="${k}"><div class="who">${esc(d.who)}</div>
        <div><div class="nl">${cc.nl}</div><div class="de">${cc.de}</div></div><div class="spk">🔊</div></div>`; }).join('')}
      <p class="cc-hint">🎨 Gleiche Farbe = gleiche Bedeutung (Niederländisch ↔ Deutsch).</p>`;
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
        body.innerHTML = `${head}<div class="step-title">Was heißt „${esc(v.de)}"?</div>${cardArtHTML(v)}
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
        body.innerHTML = `${head}<div class="step-title">Tippe auf Niederländisch: „${esc(v.de)}"</div>${cardArtHTML(v)}
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
// Trainings-Zusatzmodule aus dem Sitzungswortschatz: Zuordnungs-Memory (stepMatch),
// Satzergänzung/Lückentext (stepCloze) und Hör-Verstehen (stepDictation). Jedes Modul
// ist selbst NO-OP, wenn zu wenig Material vorhanden ist — dann wird es einfach übersprungen.
function practiceModules(vocab) {
  const uniq = [], seen = new Set();
  (vocab || []).forEach(v => { if (v && !seen.has(v.id)) { seen.add(v.id); uniq.push(v); } });
  if (uniq.length < 2) return [];
  const speak = uniq
    .filter(v => v && v.ex && v.exDe && (() => { const w = String(v.ex).trim().split(/\s+/).length; return w >= 2 && w <= 9; })())
    .map(v => ({ nl: String(v.ex).trim(), de: String(v.exDe).trim() }));
  const l = { vocab: uniq, speak };
  return [stepMatch(l), stepCloze(l), stepDictation(l)];
}
function runReview(cards, opts) {
  if (!cards.length) { toast(opts.empty, opts.emoji); return; }
  openFlow([reviewStep(shuffle(cards.slice()), opts.label), ...practiceModules(cards)], (fe) =>
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
  steps.push(...practiceModules([...news, ...due]));   // Memory · Satzergänzung · Hör-Verstehen
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

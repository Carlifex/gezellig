// ============================================================================
//  Progression & Fortschritt — XP, Level, Meilensteine, Tagesaufgaben, Streak.
//  Local-first: alles in localStorage. Design folgt dem v2-Plan (SDT-gestützt,
//  gentle Streak, evolvierende Meilensteine).
// ============================================================================

import { LEVELS, MILESTONES, DAILY_GOALS, XP, LESSONS } from './data.js';
import { newCard, schedule, isDue, isMastered } from './srs.js';

const KEY = 'gezellig.v2';
const DAYMS = 864e5;
const todayStr = () => new Date().toISOString().slice(0, 10);
const yestStr  = () => new Date(Date.now() - DAYMS).toISOString().slice(0, 10);
const dayIndex = () => Math.floor(Date.now() / DAYMS);

const vocabById = {};
LESSONS.forEach(l => l.vocab.forEach(v => { vocabById[v.id] = { ...v, lesson: l.id }; }));
export const ALL_VOCAB = Object.values(vocabById);

// ---- State ----------------------------------------------------------------
function fresh() {
  return {
    xp: 0, streak: 0, maxStreak: 0, freezes: 1, lastGoalDate: null,
    settings: { tts: true, rate: 0.92, theme: 'auto', dailyGoal: 'normaal', aiEndpoint: '' },
    cards: {}, lessons: {}, milestones: {}, history: {},
    daily: null,
    totals: { reviews: 0, wordsLearned: 0, speakOk: 0, chats: 0, lessonsDone: 0, lessonsMastered: 0, sessions: 0, answers: 0, answersOk: 0 },
  };
}
export let state = load();

function load() {
  let s;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (_) {}
  if (!s || !s.totals) s = fresh();
  // Nachrüsten für ältere Speicherstände:
  if (!s.history) s.history = {};
  if (s.maxStreak == null) s.maxStreak = 0;
  if (s.totals.answers == null) { s.totals.answers = 0; s.totals.answersOk = 0; }
  if (s.settings.rate == null) s.settings.rate = 0.92;
  if (s.settings.theme == null) s.settings.theme = 'auto';
  ensureDay(s);
  return s;
}
export function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

// ---- Daily rollover & tasks ----------------------------------------------
function pickTasks(goalKey) {
  const scale = { locker: 6, normaal: 10, ernst: 15 }[goalKey] || 10;
  const speakN = { locker: 2, normaal: 3, ernst: 4 }[goalKey] || 3;
  const tasks = [
    { id: 'review', label: `${scale} Wörter wiederholen`, metric: 'reviews', target: scale },
    { id: 'lesson', label: '1 Lektion machen', metric: 'lessonsDone', target: 1 },
  ];
  // Dritte Aufgabe rotiert täglich (Abwechslung).
  if (dayIndex() % 2 === 0) tasks.push({ id: 'chat', label: '1 Gespräch führen', metric: 'chats', target: 1 });
  else tasks.push({ id: 'speak', label: `${speakN} Sätze sprechen`, metric: 'speakOk', target: speakN });
  return tasks.map(t => ({ ...t, done: false, rewarded: false }));
}

function ensureDay(s) {
  const t = todayStr();
  if (s.daily && s.daily.date === t) return;
  // Vergangenen Tag ins Verlaufs-Archiv sichern (für die Statistik).
  if (s.daily && s.daily.date && s.daily.date !== t) {
    if (!s.history) s.history = {};
    s.history[s.daily.date] = s.daily.counters;
    // Archiv auf ~120 Tage begrenzen.
    const keys = Object.keys(s.history).sort();
    while (keys.length > 120) delete s.history[keys.shift()];
  }
  // Streak-Pflege beim Tageswechsel (gentle): Freeze deckt eine Lücke.
  if (s.lastGoalDate && s.lastGoalDate !== t && s.lastGoalDate !== yestStr()) {
    // mehr als 1 Tag her → Lücke
    const twoDaysAgo = new Date(Date.now() - 2 * DAYMS).toISOString().slice(0, 10);
    if (s.freezes > 0 && s.lastGoalDate === twoDaysAgo) {
      s.freezes -= 1;                 // Freeze rettet die Serie
      s.lastGoalDate = yestStr();
    } else {
      s.streak = 0;                   // Serie unterbrochen
    }
  }
  s.daily = { date: t, tasks: pickTasks(s.settings.dailyGoal),
              counters: { reviews: 0, lessonsDone: 0, chats: 0, speakOk: 0, newWords: 0, xp: 0 } };
  s.totals.sessions += 0;
}

// ---- Level ----------------------------------------------------------------
export function levelInfo() {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (state.xp >= l.minXp) cur = l;
  const next = LEVELS.find(l => l.minXp > cur.minXp) || null;
  const into = state.xp - cur.minXp;
  const span = next ? next.minXp - cur.minXp : 1;
  return { ...cur, next, into, span, pct: next ? Math.min(100, Math.round(into / span * 100)) : 100 };
}

// ---- XP & daily goal ------------------------------------------------------
let lastUnlocks = [];
export function takeUnlocks() { const u = lastUnlocks; lastUnlocks = []; return u; }

function addXp(n) {
  state.xp += n;
  state.daily.counters.xp += n;
  checkGoal();
}
function checkGoal() {
  const goalXp = DAILY_GOALS[state.settings.dailyGoal].xp;
  if (state.daily.counters.xp >= goalXp && state.lastGoalDate !== todayStr()) {
    // Tagesziel erreicht → Streak fortführen
    state.streak = (state.lastGoalDate === yestStr()) ? state.streak + 1 : 1;
    state.maxStreak = Math.max(state.maxStreak || 0, state.streak);
    state.lastGoalDate = todayStr();
    checkMilestones();
  }
}
export function dailyGoalXp() { return DAILY_GOALS[state.settings.dailyGoal].xp; }
export function todayXp() { return state.daily.counters.xp; }
export function goalMetToday() { return state.lastGoalDate === todayStr(); }

// ---- Milestones -----------------------------------------------------------
function metrics() {
  return {
    lessonsDone: state.totals.lessonsDone,
    lessonsMastered: state.totals.lessonsMastered,
    wordsLearned: state.totals.wordsLearned,
    chats: state.totals.chats,
    speakOk: state.totals.speakOk,
    reviews: state.totals.reviews,
    streak: state.streak,
    level: levelInfo().level,
  };
}
function checkMilestones() {
  const m = metrics();
  for (const ms of MILESTONES) {
    if (!state.milestones[ms.id] && m[ms.metric] >= ms.gte) {
      state.milestones[ms.id] = Date.now();
      lastUnlocks.push(ms);
      state.xp += XP.milestone;   // direkt, ohne erneuten Goal-Check-Loop
      state.daily.counters.xp += XP.milestone;
    }
  }
}
export function milestoneState() {
  return MILESTONES.map(m => ({ ...m, unlocked: !!state.milestones[m.id] }));
}

// ---- Daily tasks ----------------------------------------------------------
function refreshTasks() {
  for (const task of state.daily.tasks) {
    if (!task.done && state.daily.counters[task.metric] >= task.target) {
      task.done = true;
      if (!task.rewarded) { task.rewarded = true; addXp(XP.task); }
    }
  }
}
export function dailyTasks() { return state.daily.tasks; }

// ---- Cards / SRS ----------------------------------------------------------
export const cardOf = (id) => state.cards[id] || newCard();
export function dueVocab(now = Date.now()) {
  return ALL_VOCAB.filter(v => state.cards[v.id] && isDue(state.cards[v.id], now));
}
export function dueCount(now = Date.now()) { return dueVocab(now).length; }

export function reviewCard(id, grade) {
  state.cards[id] = schedule(cardOf(id), grade, Date.now());
  state.totals.reviews += 1;
  state.daily.counters.reviews += 1;
  addXp(XP.review);
  recomputeMastery();
  refreshTasks();
  checkMilestones();
  save();
}

function recomputeMastery() {
  let mastered = 0;
  for (const l of LESSONS) {
    const all = l.vocab.every(v => isMastered(state.cards[v.id]));
    if (state.lessons[l.id]) state.lessons[l.id].mastered = all;
    if (all) mastered += 1;
  }
  state.totals.lessonsMastered = mastered;
}

// ---- Events ---------------------------------------------------------------
export function completeLesson(lessonId) {
  const l = LESSONS.find(x => x.id === lessonId);
  if (!l) return;
  const first = !state.lessons[lessonId] || !state.lessons[lessonId].done;
  state.lessons[lessonId] = state.lessons[lessonId] || {};
  state.lessons[lessonId].done = true;

  let newWords = 0;
  for (const v of l.vocab) {
    if (!state.cards[v.id] || !state.cards[v.id].reps) {
      state.cards[v.id] = schedule(newCard(), 'good', Date.now()); // ins SRS aufnehmen
      newWords += 1;
    }
  }
  if (first) {
    state.totals.lessonsDone += 1;
    state.totals.wordsLearned += newWords;
    state.daily.counters.lessonsDone += 1;
    state.daily.counters.newWords += newWords;
    addXp(XP.lesson + XP.newWord * newWords);
  } else {
    addXp(5); // Wiederholte Lektion: kleiner Bonus
  }
  recomputeMastery();
  refreshTasks();
  checkMilestones();
  save();
  return { newWords, first };
}

export function chatTurn() {
  state.totals.chats += 1;
  state.daily.counters.chats += 1;
  addXp(XP.chat);
  refreshTasks();
  checkMilestones();
  save();
}

export function speakResult(ok) {
  if (ok) {
    state.totals.speakOk += 1;
    state.daily.counters.speakOk += 1;
    addXp(XP.speak);
    refreshTasks();
    checkMilestones();
  }
  save();
}

// ---- Settings -------------------------------------------------------------
export function setSetting(key, val) {
  state.settings[key] = val;
  if (key === 'dailyGoal') {
    // Tagesaufgaben an neues Ziel anpassen (nur die Ziele, Fortschritt bleibt)
    state.daily.tasks = pickTasks(val).map(nt => {
      const old = state.daily.tasks.find(o => o.id === nt.id);
      return old ? { ...nt, done: old.done, rewarded: old.rewarded } : nt;
    });
    refreshTasks();
  }
  save();
}
export function resetAll() { localStorage.removeItem(KEY); state = fresh(); ensureDay(state); save(); }

// Freie Übungs-XP (z. B. Satzbau), ohne SRS-Karte.
export function gainXp(n) { addXp(n); refreshTasks(); save(); }

// Antwort-Trefferquote (aktive Modi: Produzieren, Hören).
export function recordAnswer(ok) {
  state.totals.answers = (state.totals.answers || 0) + 1;
  if (ok) state.totals.answersOk = (state.totals.answersOk || 0) + 1;
  save();
}

// Verlauf der letzten n Tage (heute live aus daily.counters, sonst aus history).
export function historyLast(n = 7) {
  const t = todayStr(), out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAYMS).toISOString().slice(0, 10);
    const src = d === t ? state.daily.counters : (state.history[d] || {});
    out.push({ date: d, xp: src.xp || 0, reviews: src.reviews || 0, newWords: src.newWords || 0 });
  }
  return out;
}
export function stats() {
  const words = ALL_VOCAB.filter(v => state.cards[v.id] && state.cards[v.id].reps);
  const mastered = words.filter(v => state.cards[v.id].S >= 8).length;
  const ans = state.totals.answers || 0, ansOk = state.totals.answersOk || 0;
  return {
    started: words.length, total: ALL_VOCAB.length, mastered,
    due: dueCount(), streak: state.streak, maxStreak: state.maxStreak || 0,
    reviews: state.totals.reviews, speakOk: state.totals.speakOk, chats: state.totals.chats,
    lessonsDone: state.totals.lessonsDone, lessonsMastered: state.totals.lessonsMastered,
    accuracy: ans ? Math.round(ansOk / ans * 100) : null, answers: ans,
  };
}

// „Schwache" Karten: schon gestartet, aber wacklig (Fehler / hohe Schwierigkeit /
// geringe Stabilität). Nach Schwäche sortiert, für den Schwachstellen-Modus.
export function weakVocab(limit = 15) {
  const scored = ALL_VOCAB
    .map(v => ({ v, c: state.cards[v.id] }))
    .filter(x => x.c && x.c.reps)
    .map(x => ({ v: x.v, score: (x.c.lapses || 0) * 3 + Math.max(0, x.c.D - 5) + Math.max(0, 4 - x.c.S) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.v);
  return scored;
}

// Pool für Produktion/Hören: bereits gestartete Wörter (gemischt). Fallback:
// Vokabeln der ersten noch nicht gestarteten Lektion.
export function startedVocab() {
  return ALL_VOCAB.filter(v => state.cards[v.id] && state.cards[v.id].reps);
}

export function lessonStatus(lessonId) {
  const s = state.lessons[lessonId];
  if (!s || !s.done) return 'neu';
  return s.mastered ? 'gemeistert' : 'gelernt';
}

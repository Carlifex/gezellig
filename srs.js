// ============================================================================
//  Spaced Repetition — FSRS-inspiriert (nicht das voll trainierte FSRS-Modell).
//
//  Warum FSRS-inspiriert statt SM-2? Die Recherche zeigt: FSRS schlägt SM-2
//  deutlich, arbeitet mit "Stabilität" (S) & "Schwierigkeit" (D) und einer
//  Ziel-Retention. Wir übernehmen diese Ideen in schlanker Form:
//   - S (Stabilität, Tage): wie lange die Erinnerung hält.
//   - D (Schwierigkeit, 1..10): wie schwer die Karte ist.
//   - TARGET_RETENTION: steuert, wie lang die Intervalle werden.
//  FSRS gibt bewusst LÄNGERE erste Intervalle als SM-2 — das bilden wir nach.
// ============================================================================

const DAY = 24 * 60 * 60 * 1000;
export const TARGET_RETENTION = 0.88;   // Empfehlung 0.85–0.90 für Anfänger

// Faktor, um von "90%-Intervall" (=S) auf das Ziel-Retention-Intervall zu kommen.
// t = S * ln(target)/ln(0.9)
const RET_FACTOR = Math.log(TARGET_RETENTION) / Math.log(0.9);   // ≈ 1.21

export function newCard() {
  return { S: 0, D: 5, due: 0, reps: 0, lapses: 0 };
}

// Erste Bewertung einer neuen Karte → Startwerte (längere erste Intervalle als SM-2).
function firstReview(grade) {
  switch (grade) {
    case 'again': return { S: 0.02, D: 6.5 };   // ~30 min, in derselben Session nochmal
    case 'hard':  return { S: 0.7,  D: 6.0 };
    case 'easy':  return { S: 3.5,  D: 4.0 };
    default:      return { S: 1.6,  D: 5.0 };    // 'good'
  }
}

// Aktualisiert Karte nach einer Bewertung.
export function schedule(card, grade, now) {
  const c = { ...card };
  if (!c.reps) {
    const f = firstReview(grade);
    c.S = f.S; c.D = f.D; c.reps = 1;
    if (grade === 'again') c.lapses += 1;
    c.due = now + intervalMs(c.S, grade);
    return c;
  }

  c.reps += 1;
  if (grade === 'again') {
    c.lapses += 1;
    c.D = clamp(c.D + 1.2, 1, 10);
    c.S = Math.max(0.02, c.S * 0.4);
  } else if (grade === 'hard') {
    c.D = clamp(c.D + 0.1, 1, 10);
    c.S = c.S * 1.15;
  } else if (grade === 'easy') {
    c.D = clamp(c.D - 0.3, 1, 10);
    c.S = c.S * (2.4 + (10 - c.D) * 0.08);
  } else { // good
    c.S = c.S * (1.6 + (10 - c.D) * 0.06);
  }
  c.due = now + intervalMs(c.S, grade);
  return c;
}

function intervalMs(S, grade) {
  if (grade === 'again') return Math.max(1, S) * 60 * 1000; // Minuten statt Tage
  const days = Math.max(1, Math.round(S * RET_FACTOR));
  return days * DAY;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function isDue(card, now) {
  return !card || !card.reps || card.due <= now;
}

// Menschlich lesbarer Status für die Wortliste.
export function statusLabel(card, now) {
  if (!card || card.reps === 0) return { text: 'neu', cls: 'new' };
  if (card.due <= now) return { text: 'fällig', cls: 'due' };
  const days = Math.round((card.due - now) / DAY);
  if (days <= 1) return { text: 'morgen', cls: '' };
  if (days < 30) return { text: days + ' T', cls: '' };
  return { text: Math.round(days / 30) + ' Mon', cls: 'good' };
}

// Ist die Karte "gemeistert"? (stabil genug, dass sie sitzt)
export function isMastered(card) {
  return card && card.reps >= 2 && card.S >= 8;
}

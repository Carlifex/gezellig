// Leichtgewichtiger Spaced-Repetition-Scheduler (SM-2-inspiriert).
// Zustand pro Karte: { ease, interval (Tage), due (timestamp), reps }.
// Bewertungen: 'again' | 'hard' | 'good' | 'easy'

const DAY = 24 * 60 * 60 * 1000;

export function newCard() {
  return { ease: 2.5, interval: 0, due: 0, reps: 0 };
}

// Gibt den aktualisierten Kartenzustand nach einer Bewertung zurück.
export function schedule(card, grade, now) {
  const c = { ...card };
  if (grade === 'again') {
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.interval = 0;               // sofort erneut in dieser Session
    c.reps = 0;
    c.due = now + 1 * 60 * 1000;  // in ~1 Minute wieder fällig
    return c;
  }
  c.reps += 1;
  if (grade === 'hard') c.ease = Math.max(1.3, c.ease - 0.15);
  if (grade === 'easy') c.ease = c.ease + 0.15;

  if (c.reps === 1) {
    c.interval = grade === 'easy' ? 3 : 1;
  } else if (c.reps === 2) {
    c.interval = grade === 'hard' ? 2 : 6;
  } else {
    const factor = grade === 'hard' ? 1.2 : c.ease;
    c.interval = Math.round(c.interval * factor);
  }
  c.interval = Math.max(1, c.interval);
  c.due = now + c.interval * DAY;
  return c;
}

// Ist die Karte jetzt fällig? (neue Karten mit due=0 gelten als fällig)
export function isDue(card, now) {
  return !card || card.due <= now;
}

// Menschlich lesbarer Status für die Vokabelliste.
export function statusLabel(card, now) {
  if (!card || card.reps === 0) return { text: 'neu', cls: 'new' };
  if (card.due <= now) return { text: 'fällig', cls: 'due' };
  const days = Math.round((card.due - now) / DAY);
  return { text: days <= 1 ? 'morgen' : `${days} T`, cls: '' };
}

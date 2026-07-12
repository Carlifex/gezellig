// Sprach-Ausgabe (TTS) und -Erkennung (STT) über die Web Speech API.
// Beide mit Feature-Detection, damit die App auf iOS/Safari nicht abstürzt,
// sondern sauber auf Text-Eingabe zurückfällt.

let voicesReady = false;
if ('speechSynthesis' in window) {
  const load = () => { voicesReady = true; };
  window.speechSynthesis.onvoiceschanged = load;
  load();
}

export const ttsSupported = () => 'speechSynthesis' in window;

let ttsEnabled = true;
export function setTtsEnabled(v) { ttsEnabled = v; }

let ttsRate = 0.92;
export function setTtsRate(r) { ttsRate = r; }

function nlVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => /nl(-|_)?/i.test(v.lang)) || null;
}
function utter(text, rate) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'nl-NL';
  u.rate = rate || ttsRate;
  const nl = nlVoice(); if (nl) u.voice = nl;
  return u;
}

// Spricht einen niederländischen Text. Wählt möglichst eine nl-Stimme.
export function speak(text, rate) {
  if (!ttsSupported() || !ttsEnabled) return;
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter(text, rate));
  } catch (_) { /* ignore */ }
}

// Spricht mehrere Zeilen nacheinander (z. B. einen ganzen Dialog).
export function speakSequence(texts, rate) {
  if (!ttsSupported() || !ttsEnabled) return;
  try {
    window.speechSynthesis.cancel();
    texts.filter(Boolean).forEach(t => window.speechSynthesis.speak(utter(t, rate)));
  } catch (_) { /* ignore */ }
}

function Recognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export const sttSupported = () => !!Recognition();

// Startet eine einmalige Aufnahme. Gibt ein Handle mit stop() zurück.
// onResult(transcript), onError(kind), onEnd() werden aufgerufen.
export function listen({ onResult, onError, onEnd }) {
  const R = Recognition();
  if (!R) { onError && onError('unsupported'); return { stop() {} }; }
  const rec = new R();
  rec.lang = 'nl-NL';
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  let got = false;
  rec.onresult = (e) => {
    got = true;
    const alts = [];
    for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
    onResult && onResult(alts);
  };
  rec.onerror = (e) => onError && onError(e.error || 'error');
  rec.onend = () => { onEnd && onEnd(got); };
  try { rec.start(); } catch (_) { onError && onError('error'); }
  return { stop() { try { rec.stop(); } catch (_) {} } };
}

// Normalisiert einen Satz für den Vergleich (klein, ohne Satzzeichen/Akzente).
export function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Ähnlichkeit zweier Sätze als Wort-Überlappung (0..1).
export function similarity(a, b) {
  const wa = normalize(a).split(' ').filter(Boolean);
  const wb = new Set(normalize(b).split(' ').filter(Boolean));
  if (!wa.length) return 0;
  const hit = wa.filter(w => wb.has(w)).length;
  return hit / Math.max(wa.length, wb.size);
}

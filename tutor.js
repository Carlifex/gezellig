// KI-Gesprächspartner.
//
// Zwei Modi:
//  - "echt": Wenn in den Einstellungen eine Proxy-URL hinterlegt ist, wird dorthin
//            gepostet. Der Proxy hält den Claude-API-Key serverseitig (siehe README).
//  - "mock": Ohne URL läuft ein eingebauter, regelbasierter Bäcker, damit der
//            Prototyp SOFORT ohne Backend/Key funktioniert.

import { CHAT } from './data.js';
import { normalize } from './speech.js';

const LS_KEY = 'gezellig.aiEndpoint';

export function getEndpoint() { return localStorage.getItem(LS_KEY) || ''; }
export function setEndpoint(url) {
  if (url) localStorage.setItem(LS_KEY, url); else localStorage.removeItem(LS_KEY);
}
export function isMock() { return !getEndpoint(); }

// history: [{role:'user'|'assistant', content}], gibt {text, hint} zurück.
export async function reply(history) {
  const url = getEndpoint();
  if (!url) return mockReply(history);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: CHAT.system, messages: history }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    // Erwartet { text: "..." } (oder Anthropic-Format { content:[{text}] }).
    const text = data.text || (data.content && data.content[0] && data.content[0].text) || '…';
    return { text, hint: '' };
  } catch (e) {
    return { text: 'Sorry, de verbinding met de AI werkt even niet.',
             hint: 'Verbindung zum KI-Proxy fehlgeschlagen — im Profil die URL prüfen.' };
  }
}

// --- Mock-Bäcker: einfache, aber lebendige Regel-Logik für das Bakker-Szenario ---
function mockReply(history) {
  const last = [...history].reverse().find(m => m.role === 'user');
  const t = normalize(last ? last.content : '');
  const turns = history.filter(m => m.role === 'user').length;

  const has = (...words) => words.some(w => t.includes(w));

  if (!t) return line('Zegt u het maar!', 'Sagen Sie es ruhig!');

  // Reine Begrüßung (ohne Bestellung) → zurückgrüßen und fragen
  const greeted = has('goedemorgen', 'goedemiddag', 'hallo', 'hoi', 'dag');
  const ordered = has('brood', 'broodje', 'broodjes', 'krentenbol', 'appeltaart', 'taart', 'puntje', 'koffie');
  if (greeted && !ordered) {
    return line('Goedemorgen! Wat mag het zijn?', 'Guten Morgen! Was darf es sein?');
  }
  // Bestellung erkennen (auch wenn zugleich gegrüßt wurde)
  if (ordered) {
    const extra = turns >= 2
      ? line('Prima keuze! Wilt u er nog iets bij?', 'Gute Wahl! Möchten Sie noch etwas dazu?')
      : line('Zeker! Wilt u er nog iets bij?', 'Klar! Möchten Sie noch etwas dazu?');
    return extra;
  }
  // Möchte-Formulierung ohne Produkt
  if (has('wil', 'graag', 'mag ik', 'hebben')) {
    return line('Natuurlijk. Wat wilt u precies?', 'Natürlich. Was möchten Sie genau?');
  }
  // Preis fragen
  if (has('hoeveel', 'kost', 'prijs', 'euro', 'betalen')) {
    return line('Dat is samen drie euro vijftig, alstublieft.', 'Das macht zusammen 3,50 € , bitte.');
  }
  // Nein / das ist alles
  if (has('nee', 'niks', 'niets', 'dat is alles', 'alles')) {
    return line('Prima! Dat is dan drie euro vijftig. Alstublieft!', 'Prima! Das macht dann 3,50 €. Bitteschön!');
  }
  // Danke / Tschüss
  if (has('dank', 'bedankt', 'tot ziens', 'doei', 'dag')) {
    return line('Graag gedaan, fijne dag en tot ziens!', 'Gern geschehen, schönen Tag und auf Wiedersehen!');
  }
  // Deutsch erkannt? sanfter Schubs
  if (has('ich', 'moechte', 'mochte', 'bitte', 'danke', 'brot', 'kaufen')) {
    return line('Probeer het in het Nederlands! Bijvoorbeeld: "Ik wil graag een brood."',
                'Versuch es auf Niederländisch! Zum Beispiel: „Ik wil graag een brood."');
  }
  // Fallback
  return line('Dat snap ik niet helemaal. Wilt u iets bestellen?',
              'Das habe ich nicht ganz verstanden. Möchten Sie etwas bestellen?');
}

function line(text, hint) { return { text, hint }; }

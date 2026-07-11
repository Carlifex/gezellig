# Gezellig 🇳🇱 — Niederländisch lernen (Phase-0-Prototyp)

Eine persönliche, installierbare Web-App (PWA), die einen **deutschen Muttersprachler**
vom Nullpunkt Richtung alltagstaugliches Niederländisch bringt. Dieser Prototyp deckt
**einen kompletten Lern-Tag** am Thema **„Bij de bakker"** (Beim Bäcker) ab.

## Was drin ist (Phase 0)

- **Geführte Tagessession** mit 6 Schritten: Vokabeln aufwärmen → Dialog hören → Aussprache → Hören → Grammatik → freies Gespräch.
- **Spaced-Repetition-Vokabeltrainer** (SM-2-artig), Fortschritt lokal gespeichert (`localStorage`).
- **Text-to-Speech** (nl-NL) für alle Sätze; **Spracherkennung** für das Aussprache-Training, mit **Tipp-Fallback**, falls das Gerät (z. B. iPhone/Safari) keine Browser-Spracherkennung kann.
- **KI-Gesprächspartner**: läuft **sofort ohne Backend** über einen eingebauten Offline-Bäcker (Mock). Für echte, freie Gespräche lässt sich ein Claude-Proxy eintragen (siehe unten).
- **Streak**, Tagesziel und einfache Statistiken.
- **Offline-fähig & installierbar** (Manifest + Service Worker).

Alles ist **Vanilla JavaScript (ES-Module)** — kein Build-Schritt, keine Dependencies.

## Lokal starten

Wegen ES-Modulen und Service Worker über einen kleinen Webserver öffnen (nicht per `file://`):

```bash
cd gezellig
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Auf dem Handy installieren

Am einfachsten via **GitHub Pages**: im Repo unter *Settings → Pages* den Branch
`main` / Ordner `/ (root)` aktivieren. Danach die Pages-URL am Handy öffnen und
über das Browser-Menü **„Zum Startbildschirm hinzufügen"** wählen.

## Echten KI-Gesprächspartner anbinden (optional)

Der API-Key darf **nie** ins Handy. Deshalb ein winziger Proxy, der den Key
serverseitig hält und an die Claude-API weiterreicht. In der App unter
**Profiel → AI-proxy URL** die Endpoint-URL eintragen.

Der Proxy bekommt `{ system, messages }` und soll `{ text }` zurückgeben.
Minimalbeispiel (Cloudflare Worker / Vercel Function, Pseudocode):

```js
export default async function handler(req) {
  const { system, messages } = await req.json();
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,   // serverseitig!
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 300,
      system,
      messages,
    }),
  });
  const data = await r.json();
  return Response.json({ text: data.content?.[0]?.text ?? '' });
}
```

> Wichtig: CORS für die Pages-Domain erlauben und ein simples Rate-Limit setzen.

## Projektstruktur

| Datei | Zweck |
|------|------|
| `index.html` | App-Shell, Tab-Leiste, SW-Registrierung |
| `styles.css` | Design-System (Delfts Blau / Oranje), Hell & Dunkel |
| `app.js` | State, vier Tabs, geführte Tagessession |
| `data.js` | Lerninhalte (Vokabeln, Dialog, Übungen) — hier erweitern |
| `srs.js` | Spaced-Repetition-Scheduler |
| `speech.js` | TTS + Spracherkennung + Satz-Vergleich |
| `tutor.js` | KI-Chat (Mock + Proxy-Anbindung) |
| `sw.js` / `manifest.webmanifest` | Offline & Installierbarkeit |

## Nächste Schritte (Richtung MVP)

- Weitere A1-Themen ergänzen (nur `data.js` erweitern).
- „valse vrienden"- und de/het-Trainer als eigene Decks.
- Echten Claude-Proxy deployen und Rollenspiele ausbauen.
- Optional: IndexedDB statt localStorage, Cloud-Sync, iOS-Sprach-Fallback (Aufnahme → STT-Dienst).

---
Phase-0-Prototyp · Arbeitstitel „Gezellig".

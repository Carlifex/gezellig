# Gezellig 🇳🇱 — Niederländisch lernen (v2)

Eine persönliche, installierbare Web-App (PWA), die einen **deutschen Muttersprachler**
vom Nullpunkt Richtung alltagstaugliches Niederländisch bringt. Die **Oberfläche ist Deutsch**;
nur der zu lernende Stoff ist Niederländisch (immer mit Übersetzung).

Der Aufbau folgt einem evidenzbasierten Plan (siehe `docs/plan-v2.html`, hergeleitet aus einer
verifizierten Recherche zu Gamification, Spaced Repetition und Lektionsstruktur).

## Was drin ist (v2)

- **Lektionen** = je eine Alltagssituation mit ~7 neuen Wörtern und **einem Grammatik-Fokus**
  (nach fundamentaler Priorität für Deutschsprachige). Prinzip „erst blocken, dann mischen":
  neue Wörter geblockt in der Lektion lernen, danach interleaved per SRS wiederholen.
- **Freie Lektions-Landkarte** — du wählst selbst, was du übst (Autonomie = stärkster Motivations-Hebel).
- **Progression**: XP, reise-thematische **Level**, **Meilensteine** über mehrere Kategorien,
  **Tagesaufgaben** und ein **gentle Streak** (zielbasiert, mit Streak-Schutz gegen „Streak-Angst").
- **FSRS-inspirierter** Spaced-Repetition-Scheduler (Stabilität/Schwierigkeit, Ziel-Retention 88 %).
- **Text-to-Speech** (nl-NL) überall; **Spracherkennung** fürs Aussprache-Training mit **Tipp-Fallback**
  (z. B. iPhone/Safari).
- **KI-Gesprächspartner**: läuft sofort ohne Backend (Offline-Bäcker/Mock); für echte Gespräche einen
  Claude-Proxy eintragen (siehe unten).
- **Offline-fähig & installierbar** (Manifest + Service Worker).

Alles ist **Vanilla JavaScript (ES-Module)** — kein Build-Schritt, keine Dependencies.

### Neue Lektion hinzufügen

Erweitern heißt: nur Daten in `data.js` ergänzen. Es gibt dafür eine Claude-Skill `/neue-lektion`
(`.claude/skills/neue-lektion/`), die durchs Format führt.

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
| `index.html` | App-Shell, Tab-Leiste (5 Tabs), SW-Registrierung |
| `styles.css` | Design-System (Delfts Blau / Oranje), Hell & Dunkel |
| `app.js` | Deutsche UI: Start, Lektionen, Wörter, Reden, Profil; Lektions- & Review-Flow |
| `data.js` | Lerninhalte (Lektionen, Grammatik, Level, Meilensteine) — **hier erweitern** |
| `srs.js` | FSRS-inspirierter Spaced-Repetition-Scheduler |
| `progress.js` | XP, Level, Meilensteine, Tagesaufgaben, Streak (local-first) |
| `speech.js` | TTS + Spracherkennung + Satz-Vergleich |
| `tutor.js` | KI-Chat (Mock + Proxy-Anbindung) |
| `docs/plan-v2.html` | Evidenzbasierter Konzept- & Umsetzungsplan |
| `.claude/skills/neue-lektion/` | Claude-Skill zum Hinzufügen neuer Lektionen |
| `sw.js` / `manifest.webmanifest` | Offline & Installierbarkeit |

## Nächste Schritte (Richtung MVP)

- Weitere A1-Themen ergänzen (nur `data.js` erweitern).
- „valse vrienden"- und de/het-Trainer als eigene Decks.
- Echten Claude-Proxy deployen und Rollenspiele ausbauen.
- Optional: IndexedDB statt localStorage, Cloud-Sync, iOS-Sprach-Fallback (Aufnahme → STT-Dienst).

---
Phase-0-Prototyp · Arbeitstitel „Gezellig".

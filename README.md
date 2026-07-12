# Gezellig 🇳🇱 — Niederländisch lernen (v2)

Eine persönliche, installierbare Web-App (PWA), die einen **deutschen Muttersprachler**
vom Nullpunkt Richtung alltagstaugliches Niederländisch bringt. Die **Oberfläche ist Deutsch**;
nur der zu lernende Stoff ist Niederländisch (immer mit Übersetzung).

## Roter Faden (Kern-Lernschleife)

1. **Start** — Streak, Tagesziel, „nächste Lektion", Tagesaufgaben.
2. **Kapitel-Lektion** (fester 8-Schritt-Flow): Story → Grammatik → neue Wörter
   (Flashcards + TTS) → Quiz → Dialog → Grammatik-Check → Aussprache → Kulturkarte.
   Danach: Wörter ins SRS, XP, Streak.
3. **Wörter / SRS** — fällige Karten wiederholen, Filter, „neue Wörter aus der Bank".
4. **Abschlussprüfung** — je Kapitel, nach allen Lektionen freigeschaltet; **≥ 80 %**
   richtig zum Bestehen (🏅).
5. **Nächstes Kapitel** — Niveau steigt: A1 → A2 → B1 → C1.

Prinzip „erst blocken, dann mischen": neue Wörter geblockt lernen, danach
interleaved per **FSRS-inspiriertem** Scheduler wiederholen (Ziel-Retention 88 %).

## Was drin ist

- **Lektions-Kapitel** (Story-Bogen + thematische Sammlungen inkl. C1-Physik-Kapitel),
  freie Landkarte (Autonomie), **XP / Level / Meilensteine / Tagesaufgaben / gentle Streak**.
- **Große Vokabelbank** (~2.5 k Wörter, A1–B1) hinter dem Wörter-Training.
- **Abschlussprüfungen** je Kapitel mit 80 %-Schwelle.
- **Text-to-Speech** (nl-NL) überall; **Spracherkennung** fürs Aussprache-Training
  mit **Tipp-Fallback** (z. B. iPhone/Safari).
- **Offline-fähig & installierbar** (Manifest + Service Worker).

Alles **Vanilla JavaScript (ES-Module)** — kein Build-Schritt, keine Dependencies.

### Neue Lektion hinzufügen

Erweitern heißt: nur Daten in `data.js` ergänzen. Dafür gibt es die Claude-Skill
`/neue-lektion` (`.claude/skills/neue-lektion/`), die durchs Format führt.

## Lokal starten

Wegen ES-Modulen und Service Worker über einen kleinen Webserver öffnen (nicht `file://`):

```bash
cd gezellig
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Auf dem Handy installieren

Via **GitHub Pages**: *Settings → Pages* → Branch `main` / Ordner `/ (root)`.
Danach die Pages-URL am Handy öffnen und **„Zum Startbildschirm hinzufügen"**.

## Projektstruktur

| Datei | Zweck |
|------|------|
| `index.html` | App-Shell, Tab-Leiste (4 Tabs: Start, Lektionen, Wörter, Profil), SW-Registrierung |
| `styles.css` | Design-System (Delfts Blau / Oranje), Hell & Dunkel |
| `app.js` | Deutsche UI: Start, Lektionen (+ Prüfung), Wörter, Profil; Lektions- & Review-Flow |
| `data.js` | Lerninhalte (Lektionen, Grammatik, Level, Meilensteine) — **hier erweitern** |
| `vocab-bank.js` | Große Vokabelbank (A1–B1) fürs Wörter-Training |
| `srs.js` | FSRS-inspirierter Spaced-Repetition-Scheduler |
| `progress.js` | XP, Level, Meilensteine, Tagesaufgaben, Streak, **Prüfungen** (local-first) |
| `speech.js` | TTS + Spracherkennung + Satz-Vergleich |
| `alpha/` | **Geparkte Features** (KI-Chat, freie Übungs-Drills) — nicht verdrahtet, s. `alpha/BACKLOG.md` |
| `.claude/skills/neue-lektion/` | Claude-Skill zum Hinzufügen neuer Lektionen |
| `sw.js` / `manifest.webmanifest` | Offline & Installierbarkeit |
| `BACKLOG.md` | Aufräum-/Refactor-Plan & Feature-Ideen |

> **Canon / Produktion:** Welt-Bibel, Fragenkatalog, Art-/Bild-Pipeline und die
> Charakter-Referenzen liegen **privat** in `Carlifex/claude-global-skills`
> (`gezellig-produktion/`). Dieses öffentliche Repo referenziert nur darauf
> (`docs/welt-bibel.md`).

## Nächste Schritte

Siehe **`BACKLOG.md`** (Aufräum-Pakete, offene Entscheidungen, Feature-Ideen).

---
Arbeitstitel „Gezellig".

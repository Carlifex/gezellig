# Gezellig — Backlog & Aufräum-Plan

> Gemeinsames Arbeitsdokument. Wir gehen die Pakete einzeln durch.
> Status-Legende: ☐ offen · ◐ in Arbeit · ☑ erledigt
> **Wichtiger Kontext:** `Carlifex/gezellig` ist ein **ÖFFENTLICHES** Repo.
> Alles Persönliche/Produktionsbezogene soll raus. Privates Ziel-Repo:
> `Carlifex/claude-global-skills` (privat, Schreibzugriff vorhanden).

---

## 🧵 Roter Faden (Playthrough-Schema) — die App, auf die wir eindampfen

Die Kern-Lernschleife, die bleibt:

1. **Startseite** — Streak, Tagesziel, „nächste Lektion", Tagesaufgaben
2. **Kapitel-Lektion** (8-Schritt-Flow) — Story → Grammatik → neue Wörter
   (Flashcards+TTS) → Quiz → Dialog → Grammatik-Check → Aussprache →
   Kulturkarte → *ins SRS + XP + Streak*
3. **Wörter / SRS** — fällige Karten wiederholen (FSRS), Filter, „neue Wörter"
4. **Abschlussprüfung** — nach allen Kapitel-Lektionen frei, ≥ 80 % → 🏅
5. **Nächstes Kapitel** — Niveaustufe steigt:
   verhaal (A1) → personen/mythen (A2) → ade/feest (B1) → natuurkunde (C1)

**Behaltene Dateien:** `index.html`, `app.js`, `data.js`, `progress.js`,
`srs.js`, `speech.js`, `vocab-bank.js`, `styles.css`, `sw.js`,
`manifest.webmanifest`, `illustrations/*.webp` (10, alle genutzt),
`icons/{icon-192,icon-512,maskable-512,apple-touch-icon}.png`, `README.md`,
`.claude/skills/neue-lektion/`.

---

## A · Datei-Leichen & ungenutzte Scripte → löschen

- ☑ **A1** `icons/app-source.png` — Quell-PNG, von nichts referenziert.
- ☑ **A2** `docs/plan-v2.html` — alter Projektplan (20 K), obsolet.
- ☑ **A3** `tools/generate-illustrations.mjs` — Build-Tool, nicht Teil der App
      (gehört zur Bild-Pipeline → mit Produktions-Assets nach C).
- ☑ **A4** `cover-natuurkunde.webp` ist in `app.js` (TRACKS) referenziert, fehlt
      aber auf Disk → Emoji-Fallback greift. Sauber lösen: `hero: ''` setzen
      (bewusster Platzhalter) **oder** Cover erzeugen.
- Hinweis: **Keine toten JS-Module** — alle 8 werden importiert & genutzt.

## B · Grafiken, die nicht direkt zur App gehören → löschen

- ☑ **B1** `reference/` — **63 MB** Charakter-Referenzen & Style-Sheets
      (carlsson 25 M, eni 18 M, nalani 11 M, schmuser 5.4 M, ref-*.jpg).
      Nicht Teil der ausgelieferten App. **Personenbezogen → aus public raus.**
- ☑ **B2** `icons/app-source.png` (= A1).
- Behalten: `illustrations/*.webp` + die 4 `icons/*.png` (App nutzt sie).

## C · Welt-Bibel & private Docs → privates Skill-Repo (nur referenzieren)

Ziel: `Carlifex/claude-global-skills`. Vorschlag-Layout dort:
`gezellig/` (Projektordner) mit den verschobenen Dateien.
In gezellig bleibt nur ein **Referenz-Pointer** (`docs/welt-bibel.md` → Stub).

- ☑ **C1** `docs/welt-bibel.md` (12 K) → privat. **(explizit vom Nutzer gewünscht)**
- ☑ **C2** `docs/carlsson-eni-antworten.md` (eure 50 Antworten!) → privat.
      *Datenschutz: liegt aktuell öffentlich.*
- ☑ **C3** `docs/fragenkatalog-carlsson-eni.md` → privat.
- ☑ **C4** Produktions-Docs → privat (nicht löschen, damit die Bild-Pipeline
      erhalten bleibt): `art-direction.md`, `panel-komposition.md`,
      `prompt-lab.md`, `szenen-rezepte.md`, `chatgpt-bilder-anleitung.md`.
- ☑ **C5** In gezellig `docs/welt-bibel.md` durch Pointer-Stub ersetzen:
      „Welt-Bibel liegt jetzt privat in claude-global-skills/gezellig/…".

## D · Off-thread Funktionen → `/alpha` + Backlog (aus der App entfernen)

Diese Features sind funktionsfähig, gehören aber nicht zum narrativen roten
Faden. **Nicht wegwerfen — nach `/alpha/` parken** (vollständiger Code bleibt
erhalten, reaktivierbar) und aus Navigation/Flow entkoppeln.

- ☑ **D1 — Reden (KI-Chat)**: `renderChat`, `mountChat` (app.js) + Modul
      `tutor.js`. Braucht API-Endpoint; offline nur Mock.
      → `alpha/chat.js` + `alpha/tutor.js`. Tab „Reden" aus `index.html`.
- ☑ **D2 — Üben (4 freie Drills)**: `renderPractice`, `openGrammar`,
      `grammarPool`, `openProduce`, `openBuild`, `openListen`,
      `buildSentencePool`, `answerMatches`, `finishScreen` (app.js).
      → `alpha/practice.js`. Tab „Üben" aus `index.html`.
- ☑ **D3 — Verdrahtung entfernen**: `render()`-Dispatch (chat/practice),
      Tabbar in `index.html`, Startseiten-Buttons `#practice`/`#quickchat`
      (renderToday), Endpoint-Einstellung in `renderProfile`,
      `tutor.js` aus `sw.js`-ASSETS, Imports in app.js.
- ☑ **D4 — `alpha/BACKLOG.md`**: beschreibt jedes geparkte Feature +
      Reaktivierungs-Schritte.
- ⚠️ Risiko: entfernt 2 von 6 Tabs → App-Umfang ändert sich sichtbar.
      Nach Umbau: Playwright-Smoke-Test des Kernpfads.

## E · Nachziehen / Verifikation

- ☑ **E1** `sw.js`-CACHE bumpen (→ v28) nach dem Umbau.
- ☑ **E2** Syntax-Check + Playwright: Kernpfad (Lektion → Prüfung → SRS) grün.
- ☑ **E3** `README.md` an den neuen (schlankeren) Umfang anpassen.

---

## 🔒 Offene Entscheidung (dein Call)

- ☐ **P1 — Git-History**: Da gezellig **public** ist, bleiben gelöschte Dateien
      (Welt-Bibel, reference/) in der **History weiter öffentlich abrufbar**.
      „Fernzugriff wirklich verhindern" braucht eine von zwei Maßnahmen:
      - **(a)** Repo `gezellig` auf **privat** stellen (einfachste, sicherste
        Lösung; öffentliche URL entfällt), **oder**
      - **(b)** History-Scrub (force-push, rewrite) — invasiv, bricht Clones.
      → Ich mache das **nicht** ohne dein explizites OK.

---

## 💡 Feature-Ideen (später, nicht dringend)

- ☐ Illustrationen für neue Kapitel (Kap. 6+, personen/mythen/ade/feest/
      natuurkunde-Cover) — via Bild-Pipeline im privaten Repo.
- ☐ Charakter-Anker-Bilder in Story-Steps einbinden.
- ☐ Fragenkatalog Block E + Q28/Q30 (pausiert, personenbezogen).

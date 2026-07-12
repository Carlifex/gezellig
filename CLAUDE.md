# CLAUDE.md — Arbeitskontext Gezellig

## Zwei-Repo-Aufbau (WICHTIG — immer beachten)

Dieses Projekt wird über **zwei** Repositories gepflegt:

1. **`Carlifex/gezellig`** — **ÖFFENTLICH**. Die ausgelieferte Lern-App (PWA).
   - Push-Ziel: Branch `main`. Deployment via **GitHub Pages**.
   - Enthält **nur** den App-Code + genutzte Assets. Nichts Persönliches/
     Produktionsbezogenes — auch nicht in der Git-History (wurde bereinigt).

2. **`Carlifex/claude-global-skills`** — **PRIVAT**. Canon, Produktion & Skills.
   - Unterordner **`gezellig-produktion/`**: Welt-Bibel, Fragenkatalog +
     persönliche Antworten (Carlsson & Eni), Art-/Bild-Pipeline-Docs,
     `reference/` (Charakter-Referenzblätter), Build-Tools, Icon-Quelle.
   - In der Session unter `/workspace/claude-global-skills` eingebunden
     (via `add_repo`, falls nicht präsent).

## Arbeitsregeln

- **App-Code, UI, Lerninhalte** → immer ins **öffentliche** `gezellig`-Repo.
- **Welt-Bibel, Canon, persönliche Daten, Bild-/Art-Pipeline, Referenzgrafiken**
  → **nur** ins **private** `claude-global-skills/gezellig-produktion/`.
  Von `gezellig` aus nur **referenzieren** (`docs/welt-bibel.md` ist ein Pointer).
- **Neue Inhalte** (Illustrationen, Story-Anker, Charaktere) werden **aus der
  privaten Welt-Bibel** erzeugt.
- **Niemals** Persönliches/Produktionsbezogenes ins öffentliche Repo committen
  (auch keine Klartext-Antworten aus dem Fragenkatalog).

## App-Architektur (Kurzreferenz)

- Vanilla-PWA, ES-Module, **kein Build-Schritt**. Service Worker `sw.js`
  (Cache-Version bei App-Änderungen bumpen).
- Roter Faden: Start → Kapitel-Lektion (8-Schritt-Flow) → Wörter/SRS →
  Abschlussprüfung (≥ 80 %) → nächstes Kapitel (A1→C1).
- `alpha/` = **geparkte** Features (KI-Chat, freie Übungs-Drills), nicht
  verdrahtet; Reaktivierung siehe `alpha/BACKLOG.md`.
- Offenes Backlog & Feature-Ideen: `BACKLOG.md`.

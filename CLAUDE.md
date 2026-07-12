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

## Artwork-Prompts erstellen (Verfahren)

**Ich (Claude) erzeuge KEINE Pixel** — ich liefere **fertige, präzise Prompts**.
Die Pixel entstehen extern: lokal (Fooocus img2img, Sheet als Basis, niedriger
Denoise) **oder** per Bild-API. Fertige Datei ins Repo → App zeigt sie automatisch.

**Quellen liegen PRIVAT** in `claude-global-skills/gezellig-produktion/docs/`
(bei Bedarf `add_repo`): **`prompt-template.md` (KANONISCHE Prompt-Vorlage — daran
strikt orientieren!)**, `welt-bibel.md` (Canon), `prompt-lab.md`, `szenen-rezepte.md`,
`art-direction.md`; kombinierte Referenz-Blätter in `.../reference/_sheets/scene-<id>.jpg`.

**Kanonische Prompt-Struktur (Reihenfolge einhalten, `prompt-template.md`):**
1. **Referenz-Blatt beschreiben:** „Im angehängten Referenz-Blatt siehst du … links
   Ganzkörper (Statur, Kleidung), rechts sein [Ausdruck] Gesichtsausdruck. Nutze das
   Blatt strikt als Charakter- UND Stilreferenz." → **1 kombiniertes Blatt je Szene.**
2. **Stil = Malstil des Blattes:** malerisches Anime-Artbook, sichtbare weiche
   Pinselstrukturen, große vereinfachte Farbflächen; **kein** Cel-Shading/Fotorealismus.
   **NIE** Franchise-/Künstlernamen.
3. **Likeness ZWINGEND** (Gesicht/Brille/Bart/Frisur/Statur exakt, nicht idealisieren).
4. **WICHTIGES DETAIL:** B&W-Px-Over-Ears (auf Ohren / um Hals, szenenabhängig).
5. **PERSPEKTIVE** konkret & dynamisch (POV/Untersicht/schräg), Vordergrund angeschnitten.
6. **FOKUS/DETAILGRAD:** Hauptfigur einziges scharfes Element, Rest lockerer.
7. **Motiv + GESAMTER Story-Inhalt:** ALLE Story-Elemente + **konkrete Requisiten**
   ausbuchstabieren (Marken/Objekte benennen, Pflanzen mit Art). **„KEIN lesbares Logo/
   Text".** **Nichts vereinfachen.**
8. **Farben:** szenen-spezifischer Licht-/Farbabsatz (Palette Cyan/Türkis/Magenta/
   Violett/warmes Orange; kühle Schatten, leuchtende Lichter, Rimlights, Bloom).
9. **Framing:** „klar im Fokus, mit etwas Rand ringsum … **Querformat (Landscape, ca.
   3:2)**." — **volle Szene mit malerischem Hintergrund, NICHT freigestellt.**
10. **Vermeiden:** fotoreal glatte Haut, 3D-/Kino-Poster, **Teal-und-Orange-Grading**,
    Color-Powder-Explosion, Lens-Flare, verzerrte Hände, erfundene Logos/Text,
    Comic-Lineart/Cel-Shading, anderer/attraktiverer Mensch.

> **VERWORFEN** (alte Regeln): freigestellt/transparentes PNG, Hochformat 4:5,
> separater „Stil-Block v2" ans Ende. → Ersetzt durch volle Szene, **Querformat ~3:2**,
> Stil in den Prompt eingewoben. Referenz = **ein** kombiniertes `scene-<id>.jpg`.

**Ich (Claude) erzeuge KEINE Pixel** — ich liefere fertige Prompts + je Szene EIN
kombiniertes Referenz-Blatt (PIL-Montage).

**Auslieferung (Nutzer-Wunsch, minimale Browserarbeit — IMMER so):**
- **Referenz-Blätter:** temporär ins **öffentliche** Repo unter `_refs/<id>-<sha8>.jpg`
  (unique Name → sauberer Browser-Download), direkter Link
  `https://raw.githubusercontent.com/carlifex/gezellig/main/_refs/<name>`. **Löschen,
  sobald eine brauchbare Grafik erstellt ist** (git rm; ggf. später History-Scrub der
  `_refs/`, da temp-public sonst in der History bleibt).
- **Prompts:** je Prompt als **eigener Code-Block** im Chat (Copy-Button) **und**
  dauerhaft in der **privaten `welt-bibel.md`** (Abschnitt „Bild-Prompts", Code-Blöcke).

**Ablage (App nutzt automatisch):** `illustrations/<lektions-id>.webp` (Cover
`illustrations/cover-<track>.webp`), Querformat, WebP ~Q80, **< 200 KB**.
`data.js` je Lektion `images.story`; TRACKS `hero`. Fehlt die Datei → Emoji-Fallback.

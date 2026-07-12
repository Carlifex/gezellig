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
(bei Bedarf `add_repo`): `welt-bibel.md` (Canon), `prompt-lab.md`
(**Stil-Block v2** + Iterations-Log), `szenen-rezepte.md`, `panel-komposition.md`,
`art-direction.md`; Charakter-Referenzblätter in `.../reference/`.

**So baust du einen brauchbaren Prompt (Reihenfolge im Prompt einhalten):**
1. **Canon holen** aus der privaten Welt-Bibel (Figur, Requisiten, Szene) —
   nie aus dem Gedächtnis erfinden.
2. **Stil-Block v2 voranstellen** (kanonisch aus `prompt-lab.md`): malerisches
   Anime-Artbook, kräftige Palette (Cyan/Ultramarin/Türkis/Limette/Magenta/
   Violett/warmes Orange), cineastisches Neonlicht, Rimlight, leicht melancholisch.
   **NIEMALS** Franchise-/Titel-Namen (kein „Arcane"/„Spider-Verse" …) und
   **keine** echten Künstlernamen — beschreibend bleiben.
3. **Referenzblätter anhängen** (1–2 aus `reference/`): i. d. R.
   `<figur>/neutral/front` + ein passender Ausdruck. **„Bearbeiten statt Neu"**:
   angehängte Figur exakt behalten, nur Szene ergänzen. **Neuer Chat je Iteration.**
4. **Likeness ZWINGEND:** Gesicht/Brille/Bart/Frisur/Statur 1:1 aus Referenz,
   **nicht idealisieren/verschönern**, kein anderer Mensch.
5. **Streng realistisch:** korrekte Anatomie (zwei Hände, je fünf Finger);
   Schlüssel-Objekte plausibel proportioniert (DJ-Pult, Fahrrad, Theke …).
6. **Komposition:** dynamisch statt Standard-Frontale (Dreiviertel/Untersicht,
   Action, echter Ausdruck) — symmetrische Frontalen wirken generisch.
7. **Freistellung:** transparenter Hintergrund (PNG mit Alpha), **kein Rahmen,
   keine Szene**; Neon nur als Bounce/Rimlight auf der Figur. **Hochformat 4:5.**
8. **Anti-Slop-Negatives (immer):** fotoreal-glatte Haut, 3D-/Kino-Poster-Look,
   **Teal-und-Orange-Colorgrading**, Color-Powder-/Staub-Explosion,
   Lens-Flare/Bloom-Overkill, Gesicht idealisieren, verzerrte/zusätzliche Hände,
   erfundene Geräte/Logos/Text, zusätzliche Personen, Comic-Lineart/Cel-Shading.

**Ablage (App nutzt automatisch):** `illustrations/<lektions-id>.webp`
(oder Cover `illustrations/cover-<track>.webp`), **4:5**, WebP ~Q80, **< 200 KB**.
In `data.js` steckt je Lektion das Feld `images.story`; TRACKS haben `hero`.
Fehlt die Datei → Emoji-Fallback, kein Bruch.

**Erkenntnis (aus `prompt-lab.md`):** matt-malerischer Stil + exakte Likeness +
echte Transparenz zusammen sind ein **ChatGPT-Deckel** (nicht Prompt-Bug).
Wenn ChatGPT „sloppt": neuer Chat, nur EIN Referenzbild, „bearbeiten statt neu" —
oder lokal Fooocus img2img mit dem Sheet als Basis.

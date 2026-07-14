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

## Projekt-Stand / Fortschritt (Snapshot: 2026-07-14)

> Lebendes Protokoll. Bei jedem größeren Baustein aktualisieren. Service Worker `gezellig-v100`,
> Dev-Branch `claude/gezellig-app-dev-uuc809`.

### Deployment & Frische
- **Auto-Update aktiv** (`index.html`): registriert SW, ruft `reg.update()` bei Start +
  minütlich; bei `controllerchange` **einmaliger** `location.reload()` (Guard `hadController`,
  damit Erstinstallation nicht neu lädt). → App hält sich selbst aktuell, **kein manuelles
  Cache-Leeren** mehr. Achtung Android-PWA: „aus Recents fortsetzen" ≠ Reload; für den
  Umstieg auf eine neue index.html einmal **kaltstarten** (aus Recents wegwischen) oder
  Pull-to-refresh.
- **SW-Strategie** (`sw.js`): Navigation + Code (js/css/json/html) **network-first**
  (online immer frisch, Cache nur Offline-Reserve); Bilder/Medien **cache-first +
  Hintergrund-Refresh**. **CACHE-Version bei jeder App-Änderung bumpen** (aktuell v98).
- Deploy = FF-Push Dev→`main` (`git push origin <dev>:main`), Pages zieht in 1–2 Min nach.

### Karteikarten-System (`cards.js`, NEU)
- Export `CARDS` (**2435** angereicherte Karten von Ziel ~2937) + `CARD_ART` (Set von IDs
  mit Illustration, aktuell **69**). Schema je Karte: `lemma, displayNl, pos, genus?, plural?,
  meanings:[{de,ex,exDe}], conjugation?, usage, notes?, illustratable?`. Kondensiert auf
  **Grundformen** (Verben→Infinitiv, Substantive→Nom.Sg. außer plurale tantum). Umlaut-
  normalisiert, **kein** artPrompt in der ausgelieferten Datei.
- **Kartenansicht** (`openCard(id)` in `app.js`): Overlay mit Artwork, POS-Chips,
  Bedeutungen (Polysemie), Konjugationstabelle (Verben) bzw. Deklination (Substantive),
  Usage, Notes. Wird in **Training** UND in **Lektionen** (Encode-Schritt) zur Einführung genutzt.
- **Enrichment-Rest: ~601 Karten offen** (Session-Limit gestoppt). Pipeline liegt in
  `scratchpad/enrich-wf.js` (Batches à 8, Enrich→adversariale Verify, `general-purpose`,
  effort high). Roh-Inputs `scratchpad/vb/b*.json` (368 Dateien) bzw. `inputs-all.json`
  (2937 deduped). Resultate aus `tasks/*.output` (`p.result.cards`) konsolidieren, NICHT aus
  Journalen. Bei Fortsetzung: cards.js neu erzeugen und mergen.

### Trainingsseite (umgebaut)
- Vokabelliste = **nur bereits gelernte** Wörter (`state.cards[id].reps`). Darstellung als
  **kompakte, klickbare Wortart-Pillen** (`.vpill.pos-<pos>`, Farbe je Wortart, Legende
  `.vpleg`); **Klick öffnet die Karte** (`openCard`). Wortzähler `N/Total` steht oben im
  **Header** neben „Training" (`.tcount`).
- **Zusatzmodule im Training** (`practiceModules`): jede Session (openPractice / runReview /
  openLearnNew) hängt **Zuordnungs-Memory** (stepMatch), **Satzergänzung/Lückentext**
  (stepCloze) und **Hör-Verstehen** (stepDictation) an — aus dem Sitzungswortschatz, selbst-NO-OP.
- **Zahlen** (`numberQuestions` in Lektionen, `numberDrillQuestions` im Training): **nie**
  Schreibweise — nur **Lese-Versteh** (NL-Wort → Ziffer wählen) und **Hör-Versteh** (hören →
  Ziffer tippen). User trägt immer nur eine Zahl ein.
- „Abruf" heißt jetzt überall **„Abfrage"**.
- Hinweis „↑ Üben schaltet Prüfung frei" wenn `examsNeedingVocab()`; Tab-Pfeil bei Bedarf.

### Lektions-Vokabeln (Kapitel 1 / verhaal erweitert)
Alle 19 verhaal-Lektionen von 7–8 auf **11–17 Vokabeln** erweitert (+153 thematische A1–A2-
Einträge, via Subagenten erzeugt, dedupliziert gegen Bestand). Format je Eintrag
`{ id, nl, de, ex, exDe }`, ID-Präfix je Lektion (a_/wo_/ra_ …).
- Von den 153: **87 gab es schon in der Vokabelbank** (→ Lektionseintrag auf bestehende Bank-ID
  umgebogen; 53 davon hatten bereits eine Karte), **66 waren wirklich neu**.
- **Enrichment-Sprint**: die 100 kartenlosen (34 Bank-ohne-Karte + 66 neu) via 10 Agenten zu
  Karten angereichert und in `cards.js` gemergt. → **alle 153 neuen Wörter haben jetzt eine Karte**
  (mit Wortart-Farbe). Nur noch 4 *ursprüngliche* Wörter ohne Karte (de plant, lekker, de kaas, samen).

### Neue Lernmodule (6, story-passend eingebaut)
`stepMatch`, `stepCloze`, `stepSentenceBuild`, `stepDictation`, `stepConjDrill`,
`stepBranchDialogue`. Progression über `lessonStufe(l)` (1–6) + `pickUebung()` (Getallen→
Zahl, meervoud→Plural, CONJ/ORDER-Grammatik-abhängig, Stufe-/Index-Alternation). Vokabel-
Einführung `stepIntro` = Kennenlernen (cardHTML) + interleaved Abruf (FMT-Rotation).
Zweisprachiges **Color-Coding** NL↔DE (`ccApply`/`CC_FUNC`).

### Artwork-Fortschritt (Vokabel-Illustrationen)
- **49 Karten bebildert** in `illustrations/vocab/<id>.webp` (Wörter 1–50 des Katalogs
  komplett + `de rok`/`bk_255`). Ablage-Konvention: Querformat 1024px, WebP ~Q82, **<200 KB**;
  ID = CARDS-Key (String, z. B. `on_koffie`), NICHT numerisch.
- **Prompt-Vorrat**: `scratchpad/prompts50.json` (erste 50) bzw. privat
  `gezellig-produktion/docs/vokabel-artprompts.json` (~1050). Wichtig: **Upload-Reihenfolge
  ist geshuffelt** → jedes gelieferte Bild per **Inhalt** zuordnen (Thumbnail-Grid ansehen),
  nicht per Position.
- **Nächster Prompt-Block: ab #51** (av_avond/kom sind bereits vergeben & bebildert).

### Erledigte Meilensteine (Tasks #1–#12, ohne #11)
Content-Fixes, Profil-Tab, Icons, Wiederholung+Prüfungskopplung, Startseite (Kapitel/Badge/
Button), sequenzielle Freischaltung, „Lektion geschafft"-Screen, formgleiche MC-Distraktoren,
Color-Coding, mehr Grammatik-Beispiele, knackigeres Prüfungsformat, Kapitel-Gating
(neues Kapitel erst nach bestandener Vorprüfung), Vokabel-Dedup (nl-equivalence).

### Offene Punkte
- **#11** Vokabeltraining vertiefen (Progression/Umfang/verbindliche Checks) — teils erledigt.
- **#13** Kapitel 2: Carlsson/Eni einbauen, chronologisch sortieren.
- **#14** Dialog-Avatare für Charaktere.
- **#15** mehr Wort-/Lektions-Illustrationen (läuft: 49 da, Rest offen).
- **Enrichment-Rest ~601 Karten** (s. o.).

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

**Auslieferung (Nutzer-Wunsch, minimale Browserarbeit — IMMER exakt so):**
Pro Lieferung immer **beides** liefern: (1) das Referenzmaterial als **einen** Link,
(2) die Prompts **einzeln inline**.
- **Referenzmaterial (Referenz-Blatt):** temporär ins Repo unter `_refs/<id>-<sha8>.jpg`,
  auf den **Arbeits-/Dev-Branch** committen und als **ein einziger one-click Raw-Link**
  schicken (kein main-Push nötig — nur Referenzmaterial). Link-Form für Branch mit
  Slash: `https://raw.githubusercontent.com/carlifex/gezellig/refs/heads/<branch>/_refs/<name>`.
  **Löschen, sobald eine brauchbare Grafik erstellt ist** (git rm; ggf. später
  History-Scrub der `_refs/`).
- **Prompts:** **JEDER Prompt EINZELN inline im Chat als eigenes kopierbares Code-Element**
  (ein Code-Block pro Prompt, mit Copy-Button). **NICHT** als Sammel-Datei/-Link und
  **nicht** mehrere Prompts in einem Block. Optional zusätzlich dauerhaft in der privaten
  `welt-bibel.md` (Abschnitt „Bild-Prompts").
- **Nach jedem größeren Baustein** fragen, ob nach `main` gepusht/live geschaltet werden soll.

**Ablage (App nutzt automatisch):** `illustrations/<lektions-id>.webp` (Cover
`illustrations/cover-<track>.webp`), Querformat, WebP ~Q80, **< 200 KB**.
`data.js` je Lektion `images.story`; TRACKS `hero`. Fehlt die Datei → Emoji-Fallback.

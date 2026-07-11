---
name: neue-lektion
description: Fügt der Gezellig-App eine neue A1-Lektion hinzu (Alltagssituation + ~7 Vokabeln + ein Grammatik-Fokus + Dialog + Sprech-Sätze). Nutze diese Skill, wenn der Nutzer eine neue Lektion, ein neues Thema oder eine neue Alltagssituation zur Niederländisch-App hinzufügen möchte.
---

# Neue Lektion zu Gezellig hinzufügen

Ziel: eine neue Lektion konsistent ins Datenmodell einfügen, ohne die App-Logik anzufassen.
Erweitern = nur Daten ergänzen (`data.js`).

## Ablauf

1. **Situation klären.** Frage (falls unklar) nach der Alltagssituation (z. B. „Im Restaurant",
   „Beim Arzt", „Small Talk übers Wetter") und, wenn nicht genannt, welcher Grammatik-Fokus passt.

2. **Grammatik-Fokus wählen.** Verwende einen bestehenden Schlüssel aus `GRAMMAR` in `data.js`
   (`woordvolgorde`, `dehet`, `presens`, `vragen`, `verkleining`, `modaal`, `hebbenzijn`, `negatie`).
   Braucht die Lektion ein neues Grammatikthema, lege zuerst einen neuen `GRAMMAR`-Eintrag an
   (deutsche Erklärung: `title`, `body`, `rule`, 2–3 `checks` mit `answer`-Index).

3. **Lektion an `LESSONS` anhängen** (in `data.js`), exakt in diesem Format:

   ```js
   {
     id: 'restaurant', order: 7, icon: '🍽️',
     title: 'Im Restaurant',                 // DEUTSCH (UI)
     situation: 'Du bestellst Essen und Trinken.',   // DEUTSCH
     grammar: 'modaal',                       // Schlüssel aus GRAMMAR
     vocab: [                                 // ~7 Einträge, eindeutige ids mit Präfix
       { id: 'r_menu', nl: 'de kaart', de: 'die Speisekarte',
         ex: 'Mag ik de kaart?', exDe: 'Kann ich die Karte haben?' },
       // ... insgesamt ~7 ...
       // optional pro Wort: note: 'Falscher Freund: …'
     ],
     dialogue: [                              // 3–5 Zeilen; who = DEUTSCH, nl/de = Inhalt
       { who: 'Kellner', nl: 'Wat wilt u drinken?', de: 'Was möchten Sie trinken?' },
       { who: 'Du', nl: 'Een biertje, alstublieft.', de: 'Ein Bierchen, bitte.' },
     ],
     speak: [                                 // 2 Sätze zum Nachsprechen
       { nl: 'Mag ik de kaart?', de: 'Kann ich die Karte haben?' },
     ],
     // listen: [ { audio, q, options:[...], answer:index } ]  // optional
   }
   ```

## Regeln & Konventionen

- **Sprache:** UI-Felder (`title`, `situation`, `who`, `de`, `exDe`, `note`) sind **Deutsch**.
  Zu lernender Stoff (`nl`, `ex`) ist **Niederländisch**. Immer beides angeben.
- **Vokabel-`id`s** müssen global eindeutig sein → Lektions-Präfix verwenden (`r_…`, `a_…`).
  Artikel mit ins `nl` schreiben (`de kaart`, `het glas`), da de/het gelernt wird.
- **~7 Vokabeln** pro Lektion (Arbeitsgedächtnis-Grenze, siehe `docs/plan-v2.html`).
- **`order`** fortlaufend vergeben. Meilenstein `all_lessons` prüft `lessonsMastered` gegen
  die Gesamtzahl der Lektionen automatisch — kein Extra-Schritt nötig.
- Bei verwechselbaren Paaren (de/het, hebben/zijn, niet/geen) ruhig `note` setzen; die werden
  im interleaved Review gezielt geübt.

## Prüfen

- Kurz sicherstellen, dass `data.js` valides JS bleibt (keine fehlenden Kommata).
- Wenn möglich lokal testen: `python3 -m http.server` im Repo, App öffnen, neue Lektion in
  „Lektionen" starten und einmal durchspielen. Danach committen.
- Für eine teilbare Handy-Preview den Inline-Build neu erzeugen (siehe Projekt-Historie:
  alle Module ohne `import`/`export` zu einer HTML mit `<style>`+`<script>` zusammenführen).

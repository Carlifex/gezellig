# Alpha — geparkte Features (nicht in der App verdrahtet)

Diese Features funktionieren, gehören aber **nicht zum roten Faden**
(Story-Lektion → Vokabeln/SRS → Abschlussprüfung). Sie wurden aus `app.js`
ausgelagert und aus Navigation/Flow entkoppelt, damit die App auf die
Kern-Lernschleife fokussiert bleibt. Der Code ist vollständig erhalten und
reaktivierbar.

## Enthalten

### `chat.js` + `tutor.js` — Reden (KI-Gesprächspartner)
Freies Chat-Szenario mit einem KI-Bäcker/-Partner. Braucht einen KI-Proxy
(`aiEndpoint`); ohne Endpoint läuft ein Offline-Mock. `tutor.js` kapselt den
API-Call (`reply`, `isMock`, `getEndpoint`, `setEndpoint`).

### `practice.js` — Üben (4 freie Drills)
- **Grammatik-Trainer** (`openGrammar`, `grammarPool`)
- **Produktion** DE→NL tippen (`openProduce`, `answerMatches`)
- **Sätze bauen** (`openBuild`, `buildSentencePool`)
- **Hören** (`openListen`)
Ergänzende Übungsmodi, nicht an die Story gebunden.

## Reaktivieren — Checkliste
- ☐ Gewünschte Funktionen aus `alpha/*.js` zurück nach `app.js` kopieren.
- ☐ `tutor.js` zurück ins Root; Import in `app.js` wiederherstellen.
- ☐ `render()`-Dispatch ergänzen: `practice: renderPractice, chat: renderChat`.
- ☐ Tabs in `index.html` wieder aufnehmen (`practice`, `chat`).
- ☐ Startseiten-Buttons (`#practice`, `#quickchat`) + Handler in `renderToday`.
- ☐ KI-Proxy-Feld in `renderProfile` (`#ep` + `getEndpoint`/`setEndpoint`).
- ☐ `./tutor.js` (und ggf. weitere) in `sw.js`-ASSETS.
- ☐ Hinweis: `finishScreen` lebt in `app.js` (Kern nutzt es) — nicht duplizieren.
- ☐ Cache in `sw.js` bumpen, Smoke-Test.

## Abhängigkeiten (aus `app.js` / Modulen)
esc · openFlow · closeFlow · finishScreen · go · toast · shuffle · state ·
GRAMMAR · CHAT_SCENARIOS · LESSONS · startedVocab · gainXp · reviewCard ·
recordAnswer · flushUnlocks · speak · speakSequence · ttsSupported ·
sttSupported · listen · similarity · normalize · isMock · tutorReply

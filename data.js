// ============================================================================
//  Gezellig v2 — Lerninhalte & Systemdaten
//  UI-Sprache: Deutsch. Lernsprache (Inhalt): Niederländisch, immer mit
//  deutscher Übersetzung, weil der Nutzer absoluter Anfänger ist.
// ============================================================================

// ---------------------------------------------------------------------------
//  GRAMMATIK — kompakte deutsche Erklärungen, nach fundamentaler Priorität.
//  (Reihenfolge aus kontrastiver Linguistik DE↔NL, siehe Plan.)
// ---------------------------------------------------------------------------
export const GRAMMAR = {
  woordvolgorde: {
    title: 'Satzbau: das Verb steht an Position 2',
    body: 'Wie im Deutschen steht im normalen Aussagesatz das <b>gebeugte Verb an zweiter Stelle</b>. Das macht dir den Einstieg leicht — es fühlt sich fast wie Deutsch an.',
    rule: 'Beispiel: <span class="hl">Ik</span> <span class="hl2">woon</span> in Berlijn. — „Ich wohne in Berlin." Erst das Subjekt, dann das Verb.',
    checks: [
      { q: 'Was ist richtig?', options: ['Ik heet Chris.', 'Ik Chris heet.'], answer: 0 },
      { q: 'Was ist richtig?', options: ['Woon ik in Keulen.', 'Ik woon in Keulen.'], answer: 1 },
    ],
  },
  dehet: {
    title: 'de of het? — die zwei Artikel',
    body: 'Das Niederländische hat nur <b>zwei</b> bestimmte Artikel: <b>de</b> (für der/die) und <b>het</b> (für das). Welcher gilt, muss man pro Wort lernen — die größte Stolperfalle für Deutsche.',
    rule: 'Goldene Regel: Jede Verkleinerung auf <span class="hl">-je</span> ist <span class="hl">immer het</span>: het broodje, het kopje.',
    checks: [
      { q: '___ brood', options: ['de', 'het'], answer: 1 },
      { q: '___ bakker', options: ['de', 'het'], answer: 0 },
      { q: '___ broodje', options: ['de', 'het'], answer: 1 },
    ],
  },
  presens: {
    title: 'Präsens: Verben im Jetzt',
    body: 'Regelmäßige Verben: <b>ik</b> + Wortstamm, <b>jij/hij</b> + Stamm+<b>t</b>, <b>wij/jullie/zij</b> + Infinitiv. Beispiel „wonen" (wohnen): ik woon, jij woont, wij wonen.',
    rule: 'Wichtig sind die zwei unregelmäßigen: <span class="hl">zijn</span> (sein): ik ben, jij bent, hij is. <span class="hl">hebben</span> (haben): ik heb, jij hebt, hij heeft.',
    checks: [
      { q: 'ich bin = ik ___', options: ['ben', 'is', 'bent'], answer: 0 },
      { q: 'er wohnt = hij ___', options: ['woon', 'woont', 'wonen'], answer: 1 },
    ],
  },
  vragen: {
    title: 'Fragen & Inversion',
    body: 'Ja/Nein-Fragen: das <b>Verb steht vorne</b>. „Woon jij in Amsterdam?" Bei W-Fragen kommt das Fragewort zuerst, dann das Verb: „Waar woon je?"',
    rule: 'Stellst du etwas anderes voran (z. B. die Zeit), dreht sich die Reihenfolge um (Inversion): <span class="hl">Vandaag ga ik</span> naar de stad. — nicht „Vandaag ik ga".',
    checks: [
      { q: 'Frage: „Wohnst du hier?"', options: ['Jij woont hier?', 'Woon jij hier?'], answer: 1 },
      { q: 'Richtig?', options: ['Morgen ik werk.', 'Morgen werk ik.'], answer: 1 },
    ],
  },
  verkleining: {
    title: 'Verkleinerung mit -je',
    body: 'Niederländer verkleinern sehr gern — meist mit <b>-je</b> (oder -tje, -pje). Es klingt freundlich/klein: broodje (Brötchen), kopje (Tässchen), biertje (Bierchen).',
    rule: 'Zwei Dinge merken: die Verkleinerung ist <span class="hl">immer het</span>, und der Plural bekommt <span class="hl">-s</span>: het broodje → de broodjes.',
    checks: [
      { q: 'Verkleinerung von „kop" (Tasse)', options: ['kopje', 'kopie'], answer: 0 },
      { q: 'Artikel: ___ broodje', options: ['de', 'het'], answer: 1 },
    ],
  },
  modaal: {
    title: 'Modalverben: wollen, können, müssen, dürfen',
    body: 'Modalverben machen Sätze alltagstauglich. Das Modalverb steht an Position 2, das <b>zweite Verb wandert ans Satzende</b> (Infinitiv) — wie im Deutschen.',
    rule: '<span class="hl">willen</span> (wollen): ik wil · <span class="hl">kunnen</span> (können): ik kan · <span class="hl">moeten</span> (müssen): ik moet · <span class="hl">mogen</span> (dürfen): ik mag. Beispiel: „Ik wil een brood <span class="hl2">kopen</span>."',
    checks: [
      { q: 'Ich möchte bezahlen = Ik wil ___', options: ['betalen', 'betaal'], answer: 0 },
      { q: '„Darf ich?" =', options: ['Mag ik?', 'Moet ik?'], answer: 0 },
    ],
  },
  hebbenzijn: {
    title: 'hebben & zijn — haben & sein',
    body: 'Die zwei wichtigsten Verben. <b>hebben</b> (haben): ik heb, jij hebt, hij heeft, wij hebben. <b>zijn</b> (sein): ik ben, jij bent, hij is, wij zijn.',
    rule: '„Es gibt" heißt <span class="hl">er is</span> (Singular) / <span class="hl">er zijn</span> (Plural): „Er is een winkel." — „Er zijn twee kamers."',
    checks: [
      { q: 'wir haben = wij ___', options: ['hebben', 'zijn', 'heeft'], answer: 0 },
      { q: 'es gibt zwei = er ___ twee', options: ['is', 'zijn'], answer: 1 },
    ],
  },
  negatie: {
    title: 'Verneinen: niet oder geen?',
    body: 'Zwei Verneinungen, die es im Deutschen so nicht getrennt gibt. <b>geen</b> verneint ein Nomen mit unbestimmtem/keinem Artikel (= „kein"). <b>niet</b> verneint alles andere (Verben, Adjektive, bestimmte Nomen).',
    rule: '<span class="hl">geen</span>: „Ik heb geen brood." (kein Brot). <span class="hl">niet</span>: „Ik woon hier niet." (nicht).',
    checks: [
      { q: 'Ich habe kein Geld = Ik heb ___ geld', options: ['geen', 'niet'], answer: 0 },
      { q: 'Das weiß ich nicht = Dat weet ik ___', options: ['geen', 'niet'], answer: 1 },
    ],
  },
};

// ---------------------------------------------------------------------------
//  LEKTIONEN — je eine Alltagssituation, ~7 neue Wörter, 1 Grammatik-Fokus.
//  Rollen-Labels sind deutsch (UI), die Sätze niederländisch (Inhalt).
// ---------------------------------------------------------------------------
export const LESSONS = [
  {
    id: 'kennismaken', order: 1, icon: '👋',
    title: 'Begrüßen & sich vorstellen',
    situation: 'Du triffst jemanden zum ersten Mal.',
    grammar: 'woordvolgorde',
    vocab: [
      { id: 'k_hallo', nl: 'hallo', de: 'hallo', ex: 'Hallo, hoe gaat het?', exDe: 'Hallo, wie geht es?' },
      { id: 'k_benik', nl: 'ik ben', de: 'ich bin', ex: 'Ik ben Chris.', exDe: 'Ich bin Chris.' },
      { id: 'k_heet', nl: 'ik heet', de: 'ich heiße', ex: 'Ik heet Sofie.', exDe: 'Ich heiße Sofie.' },
      { id: 'k_hoeheet', nl: 'hoe heet je?', de: 'wie heißt du?', ex: 'Hoe heet je?', exDe: 'Wie heißt du?' },
      { id: 'k_aangenaam', nl: 'aangenaam', de: 'freut mich', ex: 'Aangenaam kennis te maken.', exDe: 'Freut mich, dich kennenzulernen.' },
      { id: 'k_komuit', nl: 'ik kom uit', de: 'ich komme aus', ex: 'Ik kom uit Duitsland.', exDe: 'Ich komme aus Deutschland.' },
      { id: 'k_totziens', nl: 'tot ziens', de: 'auf Wiedersehen', ex: 'Tot ziens!', exDe: 'Auf Wiedersehen!' },
    ],
    dialogue: [
      { who: 'Sofie', nl: 'Hallo! Hoe heet je?', de: 'Hallo! Wie heißt du?' },
      { who: 'Du', nl: 'Hallo, ik heet Chris. En jij?', de: 'Hallo, ich heiße Chris. Und du?' },
      { who: 'Sofie', nl: 'Ik ben Sofie. Aangenaam!', de: 'Ich bin Sofie. Freut mich!' },
      { who: 'Sofie', nl: 'Waar kom je vandaan?', de: 'Woher kommst du?' },
      { who: 'Du', nl: 'Ik kom uit Duitsland.', de: 'Ich komme aus Deutschland.' },
    ],
    speak: [
      { nl: 'Hallo, ik heet Chris.', de: 'Hallo, ich heiße Chris.' },
      { nl: 'Ik kom uit Duitsland.', de: 'Ich komme aus Deutschland.' },
    ],
  },
  {
    id: 'bakker', order: 2, icon: '🥖',
    title: 'Beim Bäcker',
    situation: 'Du bestellst etwas in der Bäckerei.',
    grammar: 'dehet',
    vocab: [
      { id: 'b_brood', nl: 'het brood', de: 'das Brot', ex: 'Ik koop een vers brood.', exDe: 'Ich kaufe ein frisches Brot.' },
      { id: 'b_broodje', nl: 'het broodje', de: 'das Brötchen', ex: 'Mag ik twee broodjes?', exDe: 'Kann ich zwei Brötchen haben?' },
      { id: 'b_graag', nl: 'ik wil graag', de: 'ich möchte gerne', ex: 'Ik wil graag een krentenbol.', exDe: 'Ich möchte gerne ein Rosinenbrötchen.' },
      { id: 'b_alstublieft', nl: 'alstublieft', de: 'bitte (höflich)', ex: 'Een brood, alstublieft.', exDe: 'Ein Brot, bitte.' },
      { id: 'b_dankuwel', nl: 'dank u wel', de: 'danke (höflich)', ex: 'Dank u wel!', exDe: 'Danke!' },
      { id: 'b_hoeveel', nl: 'hoeveel kost het?', de: 'wie viel kostet es?', ex: 'Hoeveel kost het brood?', exDe: 'Wie viel kostet das Brot?' },
      { id: 'b_lekker', nl: 'lekker', de: 'lecker', ex: 'Dat ziet er lekker uit.', exDe: 'Das sieht lecker aus.' },
    ],
    dialogue: [
      { who: 'Bäcker', nl: 'Goedemorgen! Wat mag het zijn?', de: 'Guten Morgen! Was darf es sein?' },
      { who: 'Du', nl: 'Ik wil graag twee broodjes, alstublieft.', de: 'Ich möchte gerne zwei Brötchen, bitte.' },
      { who: 'Bäcker', nl: 'Wilt u er nog iets bij?', de: 'Möchten Sie noch etwas dazu?' },
      { who: 'Du', nl: 'Nee, dat is alles. Hoeveel kost het?', de: 'Nein, das ist alles. Wie viel kostet es?' },
      { who: 'Bäcker', nl: 'Dat is drie euro vijftig. Dank u wel!', de: 'Das macht 3,50 €. Danke!' },
    ],
    speak: [
      { nl: 'Ik wil graag een brood.', de: 'Ich möchte gerne ein Brot.' },
      { nl: 'Hoeveel kost het?', de: 'Wie viel kostet es?' },
    ],
    listen: [
      { audio: 'Dat is samen vier euro vijftig.', q: 'Wie viel kostet die Bestellung?', options: ['4,50 €', '5,40 €', '14,50 €'], answer: 0 },
    ],
  },
  {
    id: 'tijd', order: 3, icon: '🕒',
    title: 'Zeit & Termine',
    situation: 'Du fragst nach der Uhrzeit und machst einen Termin aus.',
    grammar: 'presens',
    vocab: [
      { id: 't_hoelaat', nl: 'hoe laat is het?', de: 'wie spät ist es?', ex: 'Hoe laat is het nu?', exDe: 'Wie spät ist es jetzt?' },
      { id: 't_tijd', nl: 'de tijd', de: 'die Zeit', ex: 'Ik heb geen tijd.', exDe: 'Ich habe keine Zeit.' },
      { id: 't_vandaag', nl: 'vandaag', de: 'heute', ex: 'Vandaag werk ik.', exDe: 'Heute arbeite ich.' },
      { id: 't_morgen', nl: 'morgen', de: 'morgen', ex: 'Tot morgen!', exDe: 'Bis morgen!' },
      { id: 't_afspraak', nl: 'de afspraak', de: 'der Termin', ex: 'Ik heb een afspraak.', exDe: 'Ich habe einen Termin.' },
      { id: 't_uur', nl: 'om drie uur', de: 'um drei Uhr', ex: 'De afspraak is om drie uur.', exDe: 'Der Termin ist um drei Uhr.' },
      { id: 't_wanneer', nl: 'wanneer', de: 'wann', ex: 'Wanneer heb je tijd?', exDe: 'Wann hast du Zeit?' },
    ],
    dialogue: [
      { who: 'Du', nl: 'Hallo, wanneer heb je tijd?', de: 'Hallo, wann hast du Zeit?' },
      { who: 'Anna', nl: 'Morgen om drie uur, is dat goed?', de: 'Morgen um drei Uhr, ist das gut?' },
      { who: 'Du', nl: 'Ja, prima. Tot morgen!', de: 'Ja, prima. Bis morgen!' },
    ],
    speak: [
      { nl: 'Hoe laat is het?', de: 'Wie spät ist es?' },
      { nl: 'Ik heb een afspraak om drie uur.', de: 'Ich habe einen Termin um drei Uhr.' },
    ],
  },
  {
    id: 'boodschappen', order: 4, icon: '🛒',
    title: 'Einkaufen',
    situation: 'Du machst Besorgungen im Supermarkt.',
    grammar: 'verkleining',
    vocab: [
      { id: 'bo_winkel', nl: 'de winkel', de: 'der Laden', ex: 'De winkel is open.', exDe: 'Der Laden ist offen.' },
      { id: 'bo_boodschappen', nl: 'boodschappen doen', de: 'einkaufen', ex: 'Ik ga boodschappen doen.', exDe: 'Ich gehe einkaufen.' },
      { id: 'bo_melk', nl: 'de melk', de: 'die Milch', ex: 'Ik koop melk.', exDe: 'Ich kaufe Milch.' },
      { id: 'bo_kaas', nl: 'de kaas', de: 'der Käse', ex: 'Hollandse kaas is lekker.', exDe: 'Holländischer Käse ist lecker.' },
      { id: 'bo_kopje', nl: 'een kopje', de: 'ein Tässchen', ex: 'Een kopje koffie, graag.', exDe: 'Ein Tässchen Kaffee, bitte.' },
      { id: 'bo_samen', nl: 'alles samen', de: 'alles zusammen', ex: 'Alles samen, alstublieft.', exDe: 'Alles zusammen, bitte.' },
      { id: 'bo_betalen', nl: 'pinnen', de: 'mit Karte zahlen', ex: 'Ik wil pinnen.', exDe: 'Ich möchte mit Karte zahlen.', note: 'In NL zahlt man meist per „pinnen" (Karte).' },
    ],
    dialogue: [
      { who: 'Du', nl: 'Ik ga even boodschappen doen.', de: 'Ich gehe kurz einkaufen.' },
      { who: 'Verkäufer', nl: 'Is dat alles?', de: 'Ist das alles?' },
      { who: 'Du', nl: 'Ja, alles samen. Ik wil graag pinnen.', de: 'Ja, alles zusammen. Ich möchte mit Karte zahlen.' },
    ],
    speak: [
      { nl: 'Ik ga boodschappen doen.', de: 'Ich gehe einkaufen.' },
      { nl: 'Een kopje koffie, alstublieft.', de: 'Ein Tässchen Kaffee, bitte.' },
    ],
  },
  {
    id: 'weg', order: 5, icon: '🧭',
    title: 'Nach dem Weg fragen',
    situation: 'Du hast dich verlaufen und fragst nach dem Weg.',
    grammar: 'modaal',
    vocab: [
      { id: 'w_waaris', nl: 'waar is...?', de: 'wo ist...?', ex: 'Waar is het station?', exDe: 'Wo ist der Bahnhof?' },
      { id: 'w_links', nl: 'links', de: 'links', ex: 'Ga naar links.', exDe: 'Geh nach links.' },
      { id: 'w_rechts', nl: 'rechts', de: 'rechts', ex: 'De winkel is rechts.', exDe: 'Der Laden ist rechts.' },
      { id: 'w_rechtdoor', nl: 'rechtdoor', de: 'geradeaus', ex: 'Loop rechtdoor.', exDe: 'Geh geradeaus.', note: 'Falscher Freund: „rechtdoor" heißt geradeaus, nicht „rechts durch".' },
      { id: 'w_straat', nl: 'de straat', de: 'die Straße', ex: 'Welke straat is dit?', exDe: 'Welche Straße ist das?' },
      { id: 'w_station', nl: 'het station', de: 'der Bahnhof', ex: 'Het station is dichtbij.', exDe: 'Der Bahnhof ist in der Nähe.' },
      { id: 'w_moetik', nl: 'moet ik...?', de: 'muss ich...?', ex: 'Moet ik hier links?', exDe: 'Muss ich hier links?' },
    ],
    dialogue: [
      { who: 'Du', nl: 'Pardon, waar is het station?', de: 'Entschuldigung, wo ist der Bahnhof?' },
      { who: 'Frau', nl: 'Ga rechtdoor en dan naar rechts.', de: 'Geh geradeaus und dann nach rechts.' },
      { who: 'Du', nl: 'Moet ik hier links of rechts?', de: 'Muss ich hier links oder rechts?' },
      { who: 'Frau', nl: 'Naar rechts. Het is dichtbij.', de: 'Nach rechts. Es ist in der Nähe.' },
    ],
    speak: [
      { nl: 'Waar is het station?', de: 'Wo ist der Bahnhof?' },
      { nl: 'Moet ik hier links?', de: 'Muss ich hier links?' },
    ],
  },
  {
    id: 'wonen', order: 6, icon: '🏡',
    title: 'Wohnen & Nachbarschaft',
    situation: 'Du sprichst mit deinem neuen Nachbarn.',
    grammar: 'hebbenzijn',
    vocab: [
      { id: 'wo_huis', nl: 'het huis', de: 'das Haus', ex: 'Dit is mijn huis.', exDe: 'Das ist mein Haus.' },
      { id: 'wo_buurman', nl: 'de buurman', de: 'der Nachbar', ex: 'De buurman is aardig.', exDe: 'Der Nachbar ist nett.' },
      { id: 'wo_wonen', nl: 'wonen', de: 'wohnen', ex: 'Ik woon hier.', exDe: 'Ich wohne hier.' },
      { id: 'wo_kamer', nl: 'de kamer', de: 'das Zimmer', ex: 'Het huis heeft drie kamers.', exDe: 'Das Haus hat drei Zimmer.' },
      { id: 'wo_hebik', nl: 'ik heb', de: 'ich habe', ex: 'Ik heb een grote kamer.', exDe: 'Ich habe ein großes Zimmer.' },
      { id: 'wo_eris', nl: 'er is / er zijn', de: 'es gibt', ex: 'Er is een tuin.', exDe: 'Es gibt einen Garten.' },
      { id: 'wo_geen', nl: 'geen', de: 'kein', ex: 'Ik heb geen auto.', exDe: 'Ich habe kein Auto.' },
    ],
    dialogue: [
      { who: 'Nachbar', nl: 'Hallo buurman! Woon je hier nieuw?', de: 'Hallo Nachbar! Wohnst du hier neu?' },
      { who: 'Du', nl: 'Ja, ik heb een huis met drie kamers.', de: 'Ja, ich habe ein Haus mit drei Zimmern.' },
      { who: 'Nachbar', nl: 'Leuk! Is er ook een tuin?', de: 'Schön! Gibt es auch einen Garten?' },
      { who: 'Du', nl: 'Nee, er is geen tuin.', de: 'Nein, es gibt keinen Garten.' },
    ],
    speak: [
      { nl: 'Ik woon hier.', de: 'Ich wohne hier.' },
      { nl: 'Er is geen tuin.', de: 'Es gibt keinen Garten.' },
    ],
  },
];

// ---------------------------------------------------------------------------
//  KI-GESPRÄCH — Szenario „Bäcker" (Mock + optionaler Claude-Proxy)
// ---------------------------------------------------------------------------
export const CHAT = {
  scenarioDe: 'Du stehst beim Bäcker. Begrüße ihn und bestell etwas auf Niederländisch.',
  opener: 'Goedemorgen! Welkom bij de bakker. Wat mag het zijn?',
  openerHint: 'Guten Morgen! Willkommen beim Bäcker. Was darf es sein?',
  system: [
    'Je bent een vriendelijke Nederlandse bakker in een taalapp.',
    'De gebruiker is een Duitstalige beginner (niveau A1) die Nederlands leert.',
    'Praat langzaam en in korte, simpele zinnen. Blijf in de rol van de bakker.',
    'Corrigeer grote fouten vriendelijk en kort. Als de gebruiker vastloopt,',
    'geef een korte hint in het Duits tussen haakjes. Houd antwoorden kort (1-2 zinnen).',
  ].join(' '),
};

// ---------------------------------------------------------------------------
//  PROGRESSION — Level (Reise-Etappen), Meilensteine, XP-Werte, Tagesziele
// ---------------------------------------------------------------------------

// Level als Stationen einer Reise durch die Niederlande (narrative Rahmung).
export const LEVELS = [
  { level: 1, minXp: 0,    nl: 'Aankomst',       de: 'Ankunft',           icon: '🛬' },
  { level: 2, minXp: 80,   nl: 'De buurt',       de: 'Die Nachbarschaft', icon: '🏘️' },
  { level: 3, minXp: 200,  nl: 'De winkel',      de: 'Der Laden',         icon: '🛒' },
  { level: 4, minXp: 380,  nl: 'Op straat',      de: 'Auf der Straße',    icon: '🚲' },
  { level: 5, minXp: 620,  nl: 'Thuis',          de: 'Zuhause',           icon: '🏡' },
  { level: 6, minXp: 920,  nl: 'Aan het werk',   de: 'Bei der Arbeit',    icon: '💼' },
  { level: 7, minXp: 1300, nl: 'Onder vrienden', de: 'Unter Freunden',    icon: '🍻' },
  { level: 8, minXp: 1800, nl: 'Helemaal thuis', de: 'Ganz zu Hause',     icon: '🎉' },
];

// Meilensteine — bewusst über mehrere Kategorien & Stufen verteilt,
// damit immer ein NEUES, anderes Ziel wartet (gegen Neuheitsverfall).
export const MILESTONES = [
  { id: 'first_lesson', icon: '🎓', title: 'Erster Schritt',   desc: 'Erste Lektion abgeschlossen', metric: 'lessonsDone', gte: 1 },
  { id: 'words_10',     icon: '📗', title: '10 Wörter',        desc: '10 Vokabeln gelernt',          metric: 'wordsLearned', gte: 10 },
  { id: 'words_25',     icon: '📘', title: '25 Wörter',        desc: '25 Vokabeln gelernt',          metric: 'wordsLearned', gte: 25 },
  { id: 'words_50',     icon: '📚', title: '50 Wörter',        desc: '50 Vokabeln gelernt',          metric: 'wordsLearned', gte: 50 },
  { id: 'first_chat',   icon: '💬', title: 'Erstes Gespräch',  desc: 'Mit dem Bäcker geredet',       metric: 'chats', gte: 1 },
  { id: 'speaker_20',   icon: '🗣️', title: 'Aussprache-Profi', desc: '20 Sätze richtig gesprochen',  metric: 'speakOk', gte: 20 },
  { id: 'reviews_100',  icon: '✨', title: 'Fleißig',          desc: '100 Wiederholungen gemacht',   metric: 'reviews', gte: 100 },
  { id: 'streak_3',     icon: '🔥', title: '3 Tage am Stück',  desc: '3-Tage-Streak erreicht',       metric: 'streak', gte: 3 },
  { id: 'streak_7',     icon: '🔥', title: 'Eine Woche',       desc: '7-Tage-Streak erreicht',       metric: 'streak', gte: 7 },
  { id: 'streak_30',    icon: '🏆', title: 'Ein Monat!',       desc: '30-Tage-Streak erreicht',      metric: 'streak', gte: 30 },
  { id: 'halfway',      icon: '🗺️', title: 'Halbe Reise',      desc: 'Level 5 erreicht',             metric: 'level', gte: 5 },
  { id: 'all_lessons',  icon: '🌷', title: 'Alle Situationen', desc: 'Alle 6 Lektionen gemeistert',  metric: 'lessonsMastered', gte: 6 },
];

// Tagesziel-Stufen (Autonomie: der Nutzer wählt die Intensität selbst).
export const DAILY_GOALS = {
  locker:  { label: 'Locker', minutes: 5,  xp: 30 },
  normaal: { label: 'Normal', minutes: 10, xp: 60 },
  ernst:   { label: 'Ernst',  minutes: 15, xp: 100 },
};

export const XP = {
  review: 2,      // pro wiederholtem Wort
  newWord: 1,     // pro neu gelerntem Wort
  lesson: 20,     // Lektion abgeschlossen
  chat: 3,        // pro Gesprächsrunde
  speak: 4,       // Satz richtig gesprochen
  task: 10,       // Tagesaufgabe erledigt
  milestone: 15,  // Meilenstein freigeschaltet
};

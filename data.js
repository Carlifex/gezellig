// ============================================================================
//  Gezellig v2 — Lerninhalte mit durchgehender Geschichte
//  UI-Sprache: Deutsch. Lernsprache (Inhalt): Niederländisch (immer mit
//  Übersetzung). Du bist "Carlsson" — die Lektionen erzählen einen Bogen.
// ============================================================================

// ---------------------------------------------------------------------------
//  GRAMMATIK — kompakte deutsche Erklärungen, nach fundamentaler Priorität.
// ---------------------------------------------------------------------------
export const GRAMMAR = {
  woordvolgorde: {
    title: 'Satzbau: das Verb an Position 2',
    body: 'Wie im Deutschen steht im Aussagesatz das <b>gebeugte Verb an zweiter Stelle</b>. Das macht den Einstieg leicht — es fühlt sich fast wie Deutsch an.',
    rule: 'Beispiel: <span class="hl">Ik</span> <span class="hl2">woon</span> in Utrecht. Erst das Subjekt, dann das Verb.',
    checks: [
      { q: 'Was ist richtig?', options: ['Ik heet Carlsson.', 'Ik Carlsson heet.'], answer: 0 },
      { q: 'Was ist richtig?', options: ['Woon ik in Utrecht.', 'Ik woon in Utrecht.'], answer: 1 },
    ],
  },
  hebbenzijn: {
    title: 'hebben & zijn — haben & sein',
    body: 'Die zwei wichtigsten Verben. <b>hebben</b> (haben): ik heb, jij hebt, hij heeft, wij hebben. <b>zijn</b> (sein): ik ben, jij bent, hij is, wij zijn.',
    rule: '„Es gibt" heißt <span class="hl">er is</span> (Singular) / <span class="hl">er zijn</span> (Plural): „Er is een kat." — „Er zijn te veel planten."',
    checks: [
      { q: 'wir haben = wij ___', options: ['hebben', 'zijn', 'heeft'], answer: 0 },
      { q: 'es gibt zwei = er ___ twee', options: ['is', 'zijn'], answer: 1 },
    ],
  },
  dehet: {
    title: 'de of het? — die zwei Artikel',
    body: 'Das Niederländische hat nur <b>zwei</b> bestimmte Artikel: <b>de</b> (der/die) und <b>het</b> (das). Welcher gilt, muss man pro Wort lernen — die größte Stolperfalle für Deutsche.',
    rule: 'Goldene Regel: Jede Verkleinerung auf <span class="hl">-je</span> ist <span class="hl">immer het</span>: het broodje, het kopje.',
    checks: [
      { q: '___ brood', options: ['de', 'het'], answer: 1 },
      { q: '___ bakker', options: ['de', 'het'], answer: 0 },
      { q: '___ broodje', options: ['de', 'het'], answer: 1 },
    ],
  },
  verkleining: {
    title: 'Verkleinerung mit -je',
    body: 'Niederländer verkleinern gern — meist mit <b>-je</b> (oder -tje, -pje). Es klingt freundlich/klein: broodje (Brötchen), kopje (Tässchen), biertje (Bierchen).',
    rule: 'Zwei Dinge merken: die Verkleinerung ist <span class="hl">immer het</span>, und der Plural bekommt <span class="hl">-s</span>: het broodje → de broodjes.',
    checks: [
      { q: 'Verkleinerung von „kop" (Tasse)', options: ['kopje', 'kopie'], answer: 0 },
      { q: 'Artikel: ___ broodje', options: ['de', 'het'], answer: 1 },
    ],
  },
  modaal: {
    title: 'Modalverben: wollen, können, müssen, dürfen',
    body: 'Modalverben machen Sätze alltagstauglich. Das Modalverb steht an Position 2, das <b>zweite Verb wandert ans Satzende</b> (Infinitiv) — wie im Deutschen.',
    rule: '<span class="hl">willen</span> (wollen): ik wil · <span class="hl">kunnen</span> (können): ik kan · <span class="hl">moeten</span> (müssen): ik moet · <span class="hl">mogen</span> (dürfen): ik mag.',
    checks: [
      { q: 'Ich muss links = Ik moet naar ___', options: ['links', 'rechts'], answer: 0 },
      { q: '„Darf ich?" =', options: ['Mag ik?', 'Moet ik?'], answer: 0 },
    ],
  },
  presens: {
    title: 'Präsens: Verben im Jetzt',
    body: 'Regelmäßige Verben: <b>ik</b> + Wortstamm, <b>jij/hij</b> + Stamm+<b>t</b>, <b>wij/jullie/zij</b> + Infinitiv. Beispiel „werken": ik werk, jij werkt, wij werken.',
    rule: 'Sehr häufig: <span class="hl">komen</span> (kommen): ik kom, jij komt. Zeitangaben stehen gern vorne — dann folgt Inversion: „Vandaag <span class="hl2">kom</span> ik.".',
    checks: [
      { q: 'ich komme = ik ___', options: ['kom', 'komt', 'komen'], answer: 0 },
      { q: 'er arbeitet = hij ___', options: ['werk', 'werkt', 'werken'], answer: 1 },
    ],
  },
  mening: {
    title: 'Meinung sagen: vinden & leuk',
    body: 'Um zu sagen, wie du etwas findest: <b>ik vind</b> + Sache + Eigenschaft. „Ik vind drum-and-bass <b>leuk</b>." <b>leuk</b> = toll, <b>mooi</b> = schön, <b>saai</b> = langweilig.',
    rule: 'Für „mögen/lieben": <span class="hl">ik hou van</span> (+ van). „Ik hou van muziek." Und <span class="hl">leuk</span> ist das meistgenutzte Wort der Niederlande — für fast alles Positive.',
    checks: [
      { q: 'Ich finde das schön = Ik vind het ___', options: ['mooi', 'saai'], answer: 0 },
      { q: 'Ich mag Musik = Ik hou ___ muziek', options: ['van', 'met'], answer: 0 },
    ],
  },
  negatie: {
    title: 'Verneinen: niet oder geen?',
    body: '<b>geen</b> verneint ein Nomen mit unbestimmtem/keinem Artikel (= „kein"). <b>niet</b> verneint alles andere (Verben, Adjektive, bestimmte Nomen).',
    rule: '<span class="hl">geen</span>: „Ik heb geen tijd." (keine Zeit). <span class="hl">niet</span>: „Ik ben niet zenuwachtig." (nicht nervös).',
    checks: [
      { q: 'Ich habe keine Zeit = Ik heb ___ tijd', options: ['geen', 'niet'], answer: 0 },
      { q: 'Das weiß ich nicht = Dat weet ik ___', options: ['geen', 'niet'], answer: 1 },
    ],
  },
  toekomst: {
    title: 'Zukunft: gaan + Infinitiv',
    body: 'Die einfachste Zukunft: <b>gaan</b> (gehen) + Infinitiv am Satzende — wie „ich werde… / ich gehe…". „Ik <b>ga</b> vanavond <b>draaien</b>." (Ich lege heute Abend auf.)',
    rule: 'gaan: ik ga, jij gaat, hij gaat, wij gaan. Das zweite Verb steht <span class="hl">im Infinitiv am Ende</span>: „We <span class="hl">gaan</span> een biertje <span class="hl2">drinken</span>."',
    checks: [
      { q: 'Ich werde spielen = Ik ga ___', options: ['spelen', 'speel'], answer: 0 },
      { q: 'Richtig?', options: ['Ik ga draaien vanavond.', 'Ik ga vanavond draaien.'], answer: 1 },
    ],
  },
  getallen: {
    title: 'Zahlen: von 0 bis 100',
    body: 'Grundzahlen: <b>een, twee, drie, vier, vijf, zes, zeven, acht, negen, tien</b>. Zehner: twintig (20), dertig (30), veertig (40), vijftig (50).',
    rule: 'Wie im Deutschen: Einer vor Zehner mit <span class="hl">-en-</span>: <span class="hl">eenentwintig</span> (21), <span class="hl">tweeëndertig</span> (32). Preise: „€3,50" = <span class="hl2">drie euro vijftig</span>.',
    checks: [
      { q: '21 =', options: ['eenentwintig', 'twintigeneen'], answer: 0 },
      { q: '„vijf" bedeutet', options: ['vier', 'fünf'], answer: 1 },
    ],
  },
  meervoud: {
    title: 'Mehrzahl: -en oder -s',
    body: 'Die meisten Nomen bilden den Plural mit <b>-en</b> (plant → planten, huis → huizen). Wörter auf -e, -el, -er und Verkleinerungen auf -je nehmen <b>-s</b> (tafel → tafels, broodje → broodjes).',
    rule: 'Faustregel: <span class="hl">-en</span> ist Standard, <span class="hl">-s</span> nach unbetonter Endsilbe/Verkleinerung. Achtung Schreibweise: kat → ka<span class="hl2">tt</span>en, boom → bo<span class="hl2">m</span>en.',
    checks: [
      { q: 'plant → (Plural)', options: ['planten', 'plants'], answer: 0 },
      { q: 'broodje → (Plural)', options: ['broodjes', 'broodjen'], answer: 0 },
    ],
  },
  bijvoeglijk: {
    title: 'Adjektive: das -e am Ende',
    body: 'Adjektive bekommen meist ein <b>-e</b>: „een <b>mooie</b> plant", „de <b>lekkere</b> ramen". Kein -e nur bei einem <b>het</b>-Wort mit unbestimmtem Artikel.',
    rule: 'Merke die Ausnahme: <span class="hl">een + het-Wort → kein -e</span> („een lekker broodje"). Sonst fast immer <span class="hl">-e</span>: „het kleine huis", „de grote kat".',
    checks: [
      { q: 'de ___ plant (mooi)', options: ['mooie', 'mooi'], answer: 0 },
      { q: 'een ___ broodje (lekker)', options: ['lekker', 'lekkere'], answer: 0 },
    ],
  },
  graag: {
    title: 'Vorlieben: graag, liever, het liefst',
    body: 'Mit <b>graag</b> (gern) drückst du Vorlieben aus: „Ik drink <b>graag</b> koffie." Steigerung: <b>liever</b> (lieber), <b>het liefst</b> (am liebsten).',
    rule: '„Ich möchte gern" = <span class="hl">ik wil graag</span>. „Ich hätte lieber Tee" = „Ik wil <span class="hl">liever</span> thee." graag/liever stehen meist direkt nach dem Verb.',
    checks: [
      { q: 'lieber =', options: ['liever', 'graag'], answer: 0 },
      { q: 'Ich trinke gern Kaffee = Ik drink ___ koffie', options: ['graag', 'liever'], answer: 0 },
    ],
  },
  bezit: {
    title: 'Besitz: mein, dein, unser',
    body: 'Possessivpronomen: <b>mijn</b> (mein), <b>jouw/je</b> (dein), <b>zijn</b> (sein), <b>haar</b> (ihr), <b>onze/ons</b> (unser), <b>hun</b> (ihr, Plural).',
    rule: '<span class="hl">onze</span> vor de-Wörtern, <span class="hl">ons</span> vor het-Wörtern: „onze kat", aber „ons huis". „je" ist die unbetonte Form von „jouw".',
    checks: [
      { q: 'unsere Katze = ___ kat', options: ['onze', 'ons'], answer: 0 },
      { q: 'unser Haus = ___ huis', options: ['ons', 'onze'], answer: 0 },
    ],
  },
  voegwoorden: {
    title: 'Verbinden: en, maar, want, omdat',
    body: 'Sätze verbinden: <b>en</b> (und), <b>maar</b> (aber), <b>want</b> (denn), <b>omdat</b> (weil). Nach en/maar/want bleibt die Wortstellung normal (Verb an 2).',
    rule: 'Aber Achtung: nach <span class="hl">omdat</span> wandert das Verb ans <span class="hl">Satzende</span> — wie im Deutschen mit „weil": „Ik ben blij <span class="hl">omdat</span> je er <span class="hl2">bent</span>."',
    checks: [
      { q: 'weil =', options: ['omdat', 'maar'], answer: 0 },
      { q: 'Nach „omdat" steht das Verb…', options: ['am Satzende', 'an Position 2'], answer: 0 },
    ],
  },
  vraagwoorden: {
    title: 'Fragen stellen: wie, wat, waar…',
    body: 'Die wichtigsten Fragewörter: <b>wie</b> (wer), <b>wat</b> (was), <b>waar</b> (wo), <b>wanneer</b> (wann), <b>hoe</b> (wie), <b>waarom</b> (warum), <b>hoeveel</b> (wie viele).',
    rule: 'Bei W-Fragen steht das <span class="hl">Verb direkt nach dem Fragewort</span>: „<span class="hl">Waar</span> <span class="hl2">is</span> het station?", „<span class="hl">Hoe laat</span> <span class="hl2">gaat</span> de trein?"',
    checks: [
      { q: 'wo =', options: ['waar', 'wanneer'], answer: 0 },
      { q: 'wann =', options: ['wanneer', 'waarom'], answer: 0 },
    ],
  },
  perfectum: {
    title: 'Vergangenheit: het perfectum',
    body: 'Über Vergangenes spricht man meist im Perfekt: <b>hebben/zijn</b> + Partizip. Das Partizip bildet man oft mit <b>ge-</b> + Stamm + <b>-t/-d</b>: maken → <b>gemaakt</b>, spelen → <b>gespeeld</b>.',
    rule: 'Das Partizip steht <span class="hl">am Satzende</span>: „Ik <span class="hl">heb</span> een track <span class="hl2">gemaakt</span>." Bewegung/Zustandswechsel nimmt <span class="hl">zijn</span>: „We <span class="hl">zijn</span> naar Amsterdam <span class="hl2">geweest</span>."',
    checks: [
      { q: 'ich habe gemacht = ik heb ___', options: ['gemaakt', 'maken'], answer: 0 },
      { q: 'Das Partizip steht…', options: ['am Satzende', 'an Position 2'], answer: 0 },
    ],
  },
};

// ---------------------------------------------------------------------------
//  LEKTIONEN — 9 Beats einer Geschichte. Jede: story (DE), Situation, ~7
//  Vokabeln, 1 Grammatik-Fokus, Dialog, Sprech-Sätze, Kulturkarte.
//  Rollen-Labels deutsch (UI), Sätze niederländisch (Inhalt).
// ---------------------------------------------------------------------------
export const LESSONS = [
  {
    id: 'aankomst', order: 1, icon: '📦',
    title: 'Ankunft in Utrecht',
    images: { story: 'illustrations/aankomst.webp' },
    situation: 'Ihr zieht ein — und die Nachbarin klopft.',
    story: 'Kiste an Kiste in der neuen Wohnung in Utrecht. Du bist Carlsson: 36, frisch aus Deutschland, im Kopf schon halb DJ. Deine Frau Eni packt Pflanzen aus, der Kater „der Schmuser" sitzt bereits im leersten Karton. Da klopft es — die Nachbarin. Und dir fällt ein: Du sprichst noch kein Wort Niederländisch.',
    grammar: 'woordvolgorde',
    vocab: [
      { id: 'a_hallo', nl: 'hallo', de: 'hallo', ex: 'Hallo, ik ben nieuw hier.', exDe: 'Hallo, ich bin neu hier.' },
      { id: 'a_benik', nl: 'ik ben', de: 'ich bin', ex: 'Ik ben Carlsson.', exDe: 'Ich bin Carlsson.' },
      { id: 'a_heet', nl: 'ik heet', de: 'ich heiße', ex: 'Ik heet Carlsson.', exDe: 'Ich heiße Carlsson.' },
      { id: 'a_hoeheet', nl: 'hoe heet je?', de: 'wie heißt du?', ex: 'Hoe heet je?', exDe: 'Wie heißt du?' },
      { id: 'a_aangenaam', nl: 'aangenaam', de: 'freut mich', ex: 'Aangenaam!', exDe: 'Freut mich!' },
      { id: 'a_komuit', nl: 'ik kom uit', de: 'ich komme aus', ex: 'Ik kom uit Duitsland.', exDe: 'Ich komme aus Deutschland.' },
      { id: 'a_nieuw', nl: 'nieuw hier', de: 'neu hier', ex: 'We zijn nieuw hier.', exDe: 'Wir sind neu hier.' },
    ],
    dialogue: [
      { who: 'Nachbarin', nl: 'Hallo! Zijn jullie de nieuwe buren?', de: 'Hallo! Seid ihr die neuen Nachbarn?' },
      { who: 'Du', nl: 'Ja, hallo. Ik heet Carlsson, ik kom uit Duitsland.', de: 'Ja, hallo. Ich heiße Carlsson, ich komme aus Deutschland.' },
      { who: 'Nachbarin', nl: 'Welkom in Utrecht! Ik ben Marieke.', de: 'Willkommen in Utrecht! Ich bin Marieke.' },
      { who: 'Du', nl: 'Aangenaam, Marieke!', de: 'Freut mich, Marieke!' },
    ],
    speak: [
      { nl: 'Hallo, ik heet Carlsson.', de: 'Hallo, ich heiße Carlsson.' },
      { nl: 'Ik kom uit Duitsland.', de: 'Ich komme aus Deutschland.' },
    ],
    culture: {
      title: 'Willkommen in Utrecht',
      text: 'Utrecht ist eine der ältesten Städte der Niederlande, berühmt für den <b>Domtoren</b> (mit 112 m der höchste Kirchturm des Landes) und für Grachten mit tiefer liegenden <b>„werven"</b> — Kaianlagen mit Cafés direkt am Wasser. Es ist eine junge Studentenstadt: quirlig, aber gemütlich.',
    },
  },
  {
    id: 'wonen', order: 2, icon: '🐈',
    title: 'Das neue Zuhause & der Kater',
    images: { story: 'illustrations/wonen.webp' },
    situation: 'Auspacken, Schmuser randaliert — und es klingelt: ein Paket.',
    story: 'Die Wohnung wird langsam ein Zuhause — oder ein Dschungel: Eni hängt Makramee auf, überall stehen Pflanzen. Der Schmuser nimmt Anlauf, springt an die Wand und reißt ausgerechnet das schönste Stück herunter. Genau da klingelt es: ein Paketbote steht mit einem Karton vor der Tür — und erkundigt sich prompt nach den Katzen. Du verstehst nur ein Wort: „kat".',
    grammar: 'hebbenzijn',
    vocab: [
      { id: 'wo_huis', nl: 'het huis', de: 'das Haus', ex: 'Dit is ons huis.', exDe: 'Das ist unser Haus.' },
      { id: 'wo_kat', nl: 'de kat', de: 'die Katze', ex: 'De kat heet Nalani.', exDe: 'Die Katze heißt Nalani.', note: 'Ein Kater ist „de kater" — wie der Schmuser.' },
      { id: 'wo_wonen', nl: 'wonen', de: 'wohnen', ex: 'Wij wonen nu in Utrecht.', exDe: 'Wir wohnen jetzt in Utrecht.' },
      { id: 'wo_kamer', nl: 'de kamer', de: 'das Zimmer', ex: 'Het huis heeft drie kamers.', exDe: 'Das Haus hat drei Zimmer.' },
      { id: 'wo_hebik', nl: 'ik heb', de: 'ich habe', ex: 'Ik heb een kleine studio.', exDe: 'Ich habe ein kleines Studio.' },
      { id: 'wo_eris', nl: 'er is / er zijn', de: 'es gibt', ex: 'Er zijn veel planten.', exDe: 'Es gibt viele Pflanzen.' },
      { id: 'wo_geen', nl: 'geen', de: 'kein', ex: 'Er is geen tuin.', exDe: 'Es gibt keinen Garten.' },
    ],
    dialogue: [
      { who: 'Bote', nl: 'Een pakketje! Mooie kat, is dat een kater?', de: 'Ein Päckchen! Schöne Katze, ist das ein Kater?' },
      { who: 'Du', nl: 'Ja! Hij heet de Schmuser. En we hebben ook een kat, Nalani.', de: 'Ja! Er heißt der Schmuser. Und wir haben auch eine Katze, Nalani.' },
      { who: 'Bote', nl: 'Leuk! Hebben jullie een tuin?', de: 'Schön! Habt ihr einen Garten?' },
      { who: 'Du', nl: 'Nee, er is geen tuin. Maar er zijn veel planten!', de: 'Nein, es gibt keinen Garten. Aber es gibt viele Pflanzen!' },
    ],
    speak: [
      { nl: 'Wij wonen in Utrecht.', de: 'Wir wohnen in Utrecht.' },
      { nl: 'Er is geen tuin.', de: 'Es gibt keinen Garten.' },
    ],
    culture: {
      title: 'Gezelligheid & die schmalen Häuser',
      text: '<b>Gezelligheid</b> ist das wichtigste niederländische Wort — eine Mischung aus Gemütlichkeit, Geborgenheit und guter Runde, unübersetzbar. Typisch auch: sehr schmale Häuser mit großen Fenstern und oft <b>offenen Gardinen</b> — man zeigt gern, wie gezellig es drinnen ist. Der Haken oben an der Fassade? Zum Hochziehen der Möbel, weil die Treppen so eng sind.',
    },
  },
  {
    id: 'bakker', order: 3, icon: '🥖',
    title: 'Beim Bäcker',
    images: { story: 'illustrations/bakker.webp' },
    situation: 'Dein erster Alleingang auf Niederländisch.',
    story: 'Erster Alleingang auf Niederländisch: Brötchen holen. Simpel, denkst du — bis dir direkt vor der Theke einfällt, dass du keine Ahnung hast, ob es <i>der</i> oder <i>das</i> brood heißt. Der Bäcker wartet freundlich. Hinter dir wird die Schlange länger. Jetzt bloß nichts Deutsches sagen.',
    grammar: 'dehet',
    vocab: [
      { id: 'b_brood', nl: 'het brood', de: 'das Brot', ex: 'Ik wil een vers brood.', exDe: 'Ich möchte ein frisches Brot.' },
      { id: 'b_broodje', nl: 'het broodje', de: 'das Brötchen', ex: 'Mag ik twee broodjes?', exDe: 'Kann ich zwei Brötchen haben?' },
      { id: 'b_graag', nl: 'ik wil graag', de: 'ich möchte gerne', ex: 'Ik wil graag een broodje.', exDe: 'Ich möchte gerne ein Brötchen.' },
      { id: 'b_alstublieft', nl: 'alstublieft', de: 'bitte (höflich)', ex: 'Een brood, alstublieft.', exDe: 'Ein Brot, bitte.' },
      { id: 'b_dankuwel', nl: 'dank u wel', de: 'danke (höflich)', ex: 'Dank u wel!', exDe: 'Danke!' },
      { id: 'b_hoeveel', nl: 'hoeveel kost het?', de: 'wie viel kostet es?', ex: 'Hoeveel kost het?', exDe: 'Wie viel kostet es?' },
      { id: 'b_lekker', nl: 'lekker', de: 'lecker', ex: 'Dat ziet er lekker uit.', exDe: 'Das sieht lecker aus.' },
    ],
    dialogue: [
      { who: 'Bäcker', nl: 'Goedemorgen! Wat mag het zijn?', de: 'Guten Morgen! Was darf es sein?' },
      { who: 'Du', nl: 'Ik wil graag een brood en twee broodjes, alstublieft.', de: 'Ich möchte gerne ein Brot und zwei Brötchen, bitte.' },
      { who: 'Bäcker', nl: 'Dat is samen drie euro. Anders nog iets?', de: 'Das macht zusammen drei Euro. Sonst noch etwas?' },
      { who: 'Du', nl: 'Nee, dat is alles. Dank u wel!', de: 'Nein, das ist alles. Danke!' },
    ],
    speak: [
      { nl: 'Ik wil graag een brood.', de: 'Ich möchte gerne ein Brot.' },
      { nl: 'Hoeveel kost het?', de: 'Wie viel kostet es?' },
    ],
    culture: {
      title: 'Brot, Hagelslag & das Fahrrad',
      text: 'Zum Frühstück essen Niederländer gern Brot mit <b>hagelslag</b> — Schokostreuseln, ganz offiziell auch für Erwachsene. Kaffee gibt es überall und meist als Filterkaffee mit einem Keks daneben. Und man holt die Brötchen natürlich <b>op de fiets</b> (mit dem Rad) — Autos sind in der Innenstadt oft nur im Weg.',
    },
  },
  {
    id: 'boodschappen', order: 4, icon: '🛒',
    title: 'Einkaufen im Albert Heijn',
    images: { story: 'illustrations/boodschappen.webp' },
    situation: 'Material für Enis Messe — und Bargeld an der Kasse.',
    story: 'Eni braucht Material für ihren Stand auf der DIY-Messe, und du brauchst Snacks für die Studio-Nacht. Also: Albert Heijn, der Supermarkt an jeder Ecke. An der Kasse zückst du selbstbewusst Bargeld. Die Kassiererin schaut dich an, als hättest du mit Muscheln bezahlen wollen. „Pinnen?"',
    grammar: 'verkleining',
    vocab: [
      { id: 'bo_winkel', nl: 'de winkel', de: 'der Laden', ex: 'De winkel is dichtbij.', exDe: 'Der Laden ist in der Nähe.' },
      { id: 'bo_boodschappen', nl: 'boodschappen doen', de: 'einkaufen', ex: 'Ik ga boodschappen doen.', exDe: 'Ich gehe einkaufen.' },
      { id: 'bo_melk', nl: 'de melk', de: 'die Milch', ex: 'We hebben melk nodig.', exDe: 'Wir brauchen Milch.' },
      { id: 'bo_kaas', nl: 'de kaas', de: 'der Käse', ex: 'Hollandse kaas is lekker.', exDe: 'Holländischer Käse ist lecker.' },
      { id: 'bo_kopje', nl: 'een kopje', de: 'ein Tässchen', ex: 'Een kopje koffie, graag.', exDe: 'Ein Tässchen Kaffee, bitte.' },
      { id: 'bo_samen', nl: 'alles samen', de: 'alles zusammen', ex: 'Alles samen, alstublieft.', exDe: 'Alles zusammen, bitte.' },
      { id: 'bo_pinnen', nl: 'pinnen', de: 'mit Karte zahlen', ex: 'Ik wil pinnen.', exDe: 'Ich möchte mit Karte zahlen.', note: 'In NL zahlt fast jeder mit Karte — „pinnen".' },
    ],
    dialogue: [
      { who: 'Kassiererin', nl: 'Dat is samen twaalf euro. Pinnen?', de: 'Das macht zusammen zwölf Euro. Mit Karte?' },
      { who: 'Du', nl: 'Eh… ja, ik wil pinnen. Alstublieft.', de: 'Äh… ja, ich möchte mit Karte zahlen. Bitte.' },
      { who: 'Kassiererin', nl: 'Prima. Wil je een tasje?', de: 'Prima. Möchtest du ein Tütchen?' },
      { who: 'Du', nl: 'Nee, dank je. Dat is alles.', de: 'Nein, danke. Das ist alles.' },
    ],
    speak: [
      { nl: 'Ik ga boodschappen doen.', de: 'Ich gehe einkaufen.' },
      { nl: 'Ik wil pinnen, alstublieft.', de: 'Ich möchte mit Karte zahlen, bitte.' },
    ],
    culture: {
      title: 'Pinnen & die direkte Art',
      text: 'Bargeld ist in den Niederlanden fast verschwunden — man zahlt <b>„pinnen"</b> (mit Karte), selbst Kleinstbeträge. Und wundere dich nicht über die <b>Direktheit</b>: Ein „nein" ist hier kein Affront, sondern Ehrlichkeit. Ein Leitspruch fasst die Mentalität: <i>„Doe maar gewoon, dan doe je al gek genoeg"</i> — „Sei einfach normal, das ist verrückt genug."',
    },
  },
  {
    id: 'weg', order: 5, icon: '🚲',
    title: 'Auf dem Rad — und verfahren',
    images: { story: 'illustrations/weg.webp' },
    situation: 'Du suchst den Plattenladen und verirrst dich.',
    story: 'Du willst zum Plattenladen „Ferry\'s Records". Natürlich auf dem Rad — hier fährt einfach jeder. Nach zehn Minuten stehst du an einer Gracht, die du sicher schon dreimal gesehen hast. Ein Rentner auf einem uralten Hollandrad rollt vorbei. Zeit, deinen ersten Satz zu wagen: „Pardon…"',
    grammar: 'modaal',
    vocab: [
      { id: 'w_waaris', nl: 'waar is...?', de: 'wo ist...?', ex: 'Waar is de platenzaak?', exDe: 'Wo ist der Plattenladen?' },
      { id: 'w_links', nl: 'links', de: 'links', ex: 'Ga naar links.', exDe: 'Geh nach links.' },
      { id: 'w_rechts', nl: 'rechts', de: 'rechts', ex: 'De winkel is rechts.', exDe: 'Der Laden ist rechts.' },
      { id: 'w_rechtdoor', nl: 'rechtdoor', de: 'geradeaus', ex: 'Fiets rechtdoor.', exDe: 'Fahr geradeaus.', note: 'Falscher Freund: „rechtdoor" = geradeaus, nicht „rechts durch".' },
      { id: 'w_fiets', nl: 'de fiets', de: 'das Fahrrad', ex: 'Ik ga met de fiets.', exDe: 'Ich fahre mit dem Rad.' },
      { id: 'w_gracht', nl: 'de gracht', de: 'die Gracht', ex: 'De gracht is mooi.', exDe: 'Die Gracht ist schön.' },
      { id: 'w_moetik', nl: 'moet ik...?', de: 'muss ich...?', ex: 'Moet ik hier links?', exDe: 'Muss ich hier links?' },
    ],
    dialogue: [
      { who: 'Du', nl: 'Pardon, waar is de platenzaak? Moet ik links of rechts?', de: 'Entschuldigung, wo ist der Plattenladen? Muss ich links oder rechts?' },
      { who: 'Rentner', nl: 'Fiets rechtdoor langs de gracht, dan de tweede rechts.', de: 'Fahr geradeaus die Gracht entlang, dann die zweite rechts.' },
      { who: 'Du', nl: 'Dus rechtdoor en dan rechts. Dank u wel!', de: 'Also geradeaus und dann rechts. Danke!' },
      { who: 'Rentner', nl: 'Geen dank. Succes!', de: 'Keine Ursache. Viel Erfolg!' },
    ],
    speak: [
      { nl: 'Waar is de platenzaak?', de: 'Wo ist der Plattenladen?' },
      { nl: 'Moet ik hier links?', de: 'Muss ich hier links?' },
    ],
    culture: {
      title: 'Ein Land unter dem Meer',
      text: 'Ein Viertel der Niederlande liegt <b>unter dem Meeresspiegel</b> — das Land wurde über Jahrhunderte mit Deichen, Poldern und Windmühlen dem Wasser abgerungen. Daher der Spruch: <i>„Gott schuf die Welt, aber die Niederländer schufen die Niederlande."</i> Weil alles so flach ist, ist das <b>Fahrrad</b> König: Es gibt mehr Räder als Menschen.',
    },
  },
  {
    id: 'tijd', order: 6, icon: '🕒',
    title: 'Der Termin im Studio',
    situation: 'Ein Producer hat eine Stunde frei — heute um drei.',
    story: 'Ein lokaler Producer, Sander, hat eine Stunde Studiozeit frei — heute um drei. In den Niederlanden ist ein <i>afspraak</i> ein <i>afspraak</i>: zu spät kommen ist keine Option. Du checkst zum dritten Mal die Uhr, während der Schmuser seelenruhig auf deinem Kopfhörer schläft.',
    grammar: 'presens',
    vocab: [
      { id: 't_hoelaat', nl: 'hoe laat is het?', de: 'wie spät ist es?', ex: 'Hoe laat is het nu?', exDe: 'Wie spät ist es jetzt?' },
      { id: 't_tijd', nl: 'de tijd', de: 'die Zeit', ex: 'Ik heb weinig tijd.', exDe: 'Ich habe wenig Zeit.' },
      { id: 't_vandaag', nl: 'vandaag', de: 'heute', ex: 'Vandaag heb ik een afspraak.', exDe: 'Heute habe ich einen Termin.' },
      { id: 't_uur', nl: 'om drie uur', de: 'um drei Uhr', ex: 'De afspraak is om drie uur.', exDe: 'Der Termin ist um drei Uhr.' },
      { id: 't_afspraak', nl: 'de afspraak', de: 'der Termin', ex: 'Een afspraak is een afspraak.', exDe: 'Ein Termin ist ein Termin.' },
      { id: 't_kom', nl: 'ik kom', de: 'ich komme', ex: 'Ik kom om drie uur.', exDe: 'Ich komme um drei Uhr.' },
      { id: 't_telaat', nl: 'te laat', de: 'zu spät', ex: 'Ik ben nooit te laat.', exDe: 'Ich bin nie zu spät.' },
    ],
    dialogue: [
      { who: 'Sander', nl: 'Hé Carlsson! Hoe laat kom je?', de: 'Hey Carlsson! Um wie viel Uhr kommst du?' },
      { who: 'Du', nl: 'Ik kom om drie uur. Op tijd!', de: 'Ich komme um drei Uhr. Pünktlich!' },
      { who: 'Sander', nl: 'Mooi. Niet te laat, hè? We hebben maar een uur.', de: 'Schön. Nicht zu spät, ja? Wir haben nur eine Stunde.' },
      { who: 'Du', nl: 'Geen zorgen. Tot straks!', de: 'Keine Sorge. Bis gleich!' },
    ],
    speak: [
      { nl: 'Ik kom om drie uur.', de: 'Ich komme um drei Uhr.' },
      { nl: 'Hoe laat is het?', de: 'Wie spät ist es?' },
    ],
    culture: {
      title: 'Ein Termin ist ein Termin',
      text: 'Die Niederländer planen gern und genau — die <b>agenda</b> (der Kalender) ist heilig. Selbst ein Kaffee wird oft Tage vorher verabredet: <i>„Zullen we een afspraak maken?"</i> Pünktlichkeit gilt als Höflichkeit, und spontanes Vorbeikommen kann irritieren. Wer zu spät kommt, sagt besser rechtzeitig Bescheid.',
    },
  },
  {
    id: 'platenzaak', order: 7, icon: '🎧',
    title: 'In der Plattenszene',
    situation: 'Ferry\'s Records — und ein Angebot.',
    story: 'Ferry\'s Records riecht nach Vinyl und Kaffee. Ihr redet über <b>Blackout</b> im TivoliVredenburg, über <b>Liquicity</b>, über <b>Black Sun Empire</b> — die übrigens aus Utrecht kommen. Dein Herz schlägt schneller. Dann sagt Ferry beiläufig: „Es gibt einen Newcomer-Slot bei der nächsten Nacht. Wenn dein Track fertig ist."',
    grammar: 'mening',
    vocab: [
      { id: 'p_vind', nl: 'ik vind', de: 'ich finde', ex: 'Ik vind deze plaat goed.', exDe: 'Ich finde diese Platte gut.' },
      { id: 'p_leuk', nl: 'leuk', de: 'toll / schön', ex: 'Dat is echt leuk!', exDe: 'Das ist echt toll!' },
      { id: 'p_mooi', nl: 'mooi', de: 'schön', ex: 'Wat een mooie track.', exDe: 'Was für ein schöner Track.' },
      { id: 'p_muziek', nl: 'de muziek', de: 'die Musik', ex: 'Ik hou van deze muziek.', exDe: 'Ich liebe diese Musik.' },
      { id: 'p_plaat', nl: 'de plaat', de: 'die (Schall-)Platte', ex: 'Deze plaat is uit Utrecht.', exDe: 'Diese Platte ist aus Utrecht.' },
      { id: 'p_draaien', nl: 'draaien', de: 'auflegen', ex: 'Ik wil hier draaien.', exDe: 'Ich will hier auflegen.', note: 'draaien = wörtlich „drehen" → Platten auflegen / DJen.' },
      { id: 'p_optreden', nl: 'het optreden', de: 'der Auftritt', ex: 'Mijn eerste optreden!', exDe: 'Mein erster Auftritt!' },
    ],
    dialogue: [
      { who: 'Ferry', nl: 'Wat voor muziek maak je?', de: 'Was für Musik machst du?' },
      { who: 'Du', nl: 'Drum-and-bass. Ik vind Black Sun Empire echt mooi.', de: 'Drum & Bass. Ich finde Black Sun Empire echt schön.' },
      { who: 'Ferry', nl: 'Leuk! Wil je een keer draaien? Er is een newcomer-slot.', de: 'Toll! Willst du mal auflegen? Es gibt einen Newcomer-Slot.' },
      { who: 'Du', nl: 'Echt? Ja! Ik hou van drum-and-bass.', de: 'Echt? Ja! Ich liebe Drum & Bass.' },
    ],
    speak: [
      { nl: 'Ik vind deze muziek mooi.', de: 'Ich finde diese Musik schön.' },
      { nl: 'Ik wil draaien.', de: 'Ich will auflegen.' },
    ],
    culture: {
      title: 'Die Niederlande & die elektronische Musik',
      text: 'Die Niederlande sind eine Supermacht elektronischer Musik. In Rotterdam entstand in den 90ern der harte <b>gabber</b>/Hardcore, und beim Drum & Bass sind niederländische Acts weltberühmt: <b>Black Sun Empire</b> aus Utrecht, <b>Noisia</b> aus Groningen. Die <b>Liquicity</b>-Community startete als YouTube-Kanal und füllt heute Festivals — melodischer, emotionaler D&B.',
    },
  },
  {
    id: 'beurs', order: 8, icon: '🌷',
    title: 'Enis große Messe',
    situation: 'Du hilfst am DIY-Stand — statt am Track zu arbeiten.',
    story: 'Enis großer Tag: die Wohn- & DIY-Messe. Du hast versprochen zu helfen — ausgerechnet heute, wo dein Track fast fertig ist. Zwischen Makramee, Topfpflanzen und Tulpen versuchst du, nicht ständig aufs Handy zu schauen. „Geen stress", sagt Eni und drückt dir eine Gießkanne in die Hand. Leicht gesagt.',
    grammar: 'negatie',
    vocab: [
      { id: 'be_beurs', nl: 'de beurs', de: 'die Messe', ex: 'De beurs is heel druk.', exDe: 'Die Messe ist sehr voll.' },
      { id: 'be_plant', nl: 'de plant', de: 'die Pflanze', ex: 'Eni houdt van planten.', exDe: 'Eni liebt Pflanzen.' },
      { id: 'be_tuin', nl: 'de tuin', de: 'der Garten', ex: 'Een tuin op het balkon.', exDe: 'Ein Garten auf dem Balkon.' },
      { id: 'be_helpen', nl: 'helpen', de: 'helfen', ex: 'Ik help bij de stand.', exDe: 'Ich helfe am Stand.' },
      { id: 'be_druk', nl: 'druk', de: 'viel los / gestresst', ex: 'Het is heel druk.', exDe: 'Es ist sehr viel los.' },
      { id: 'be_niet', nl: 'niet', de: 'nicht', ex: 'Ik ben niet gestrest.', exDe: 'Ich bin nicht gestresst.' },
      { id: 'be_geen', nl: 'geen stress', de: 'kein Stress', ex: 'Geen stress, zegt Eni.', exDe: 'Kein Stress, sagt Eni.' },
    ],
    dialogue: [
      { who: 'Eni', nl: 'Kun je even helpen? Het is zo druk!', de: 'Kannst du kurz helfen? Es ist so voll!' },
      { who: 'Du', nl: 'Ja, natuurlijk. Maar ik ben een beetje zenuwachtig voor mijn track.', de: 'Ja, natürlich. Aber ich bin ein bisschen nervös wegen meines Tracks.' },
      { who: 'Eni', nl: 'Geen stress! Vandaag help je mij, niet de muziek.', de: 'Kein Stress! Heute hilfst du mir, nicht der Musik.' },
      { who: 'Du', nl: 'Oké, oké. Geen telefoon meer.', de: 'Okay, okay. Kein Handy mehr.' },
    ],
    speak: [
      { nl: 'Ik help bij de stand.', de: 'Ich helfe am Stand.' },
      { nl: 'Ik ben niet gestrest.', de: 'Ich bin nicht gestresst.' },
    ],
    culture: {
      title: 'Tulpen, Gärten & die Tulpenmanie',
      text: 'Blumen und Gärtnern stecken tief in der Kultur. Berühmt ist die <b>Tulpenmanie</b> von 1637: Tulpenzwiebeln wurden teurer als Häuser — die erste Spekulationsblase der Geschichte. Heute liebt man kleine Stadtgärten und <b>volkstuinen</b> (Schrebergärten). Und am <b>Koningsdag</b> (Königstag) wird das ganze Land zum Flohmarkt in Orange.',
    },
  },
  {
    id: 'ontbijt', order: 9, icon: '🥐',
    title: 'Fancy Frühstück im Café',
    situation: 'Chic frühstücken — und die Rechnung verstehen.',
    story: 'Sonntagmorgen, ihr gönnt euch ein schickes Frühstück in einem Café am Wasser. Avocado-Toast, frisch gepresster Saft, richtig guter Kaffee. Eni bestellt souverän, du willst mithalten — bis die Kellnerin die Preise nennt und du zum ersten Mal niederländische Zahlen im Kopf zusammenrechnen musst.',
    grammar: 'getallen',
    vocab: [
      { id: 'on_ontbijt', nl: 'het ontbijt', de: 'das Frühstück', ex: 'Het ontbijt is heerlijk.', exDe: 'Das Frühstück ist köstlich.' },
      { id: 'on_koffie', nl: 'de koffie', de: 'der Kaffee', ex: 'Twee koffie, alstublieft.', exDe: 'Zwei Kaffee, bitte.' },
      { id: 'on_thee', nl: 'de thee', de: 'der Tee', ex: 'Ik neem een thee.', exDe: 'Ich nehme einen Tee.' },
      { id: 'on_sap', nl: 'het sap', de: 'der Saft', ex: 'Vers sap, lekker!', exDe: 'Frischer Saft, lecker!' },
      { id: 'on_rekening', nl: 'de rekening', de: 'die Rechnung', ex: 'De rekening, alstublieft.', exDe: 'Die Rechnung, bitte.' },
      { id: 'on_euro', nl: 'euro', de: 'Euro', ex: 'Dat is negen euro.', exDe: 'Das sind neun Euro.' },
      { id: 'on_afrekenen', nl: 'afrekenen', de: 'zahlen / abrechnen', ex: 'Mag ik afrekenen?', exDe: 'Kann ich zahlen?' },
    ],
    dialogue: [
      { who: 'Kellnerin', nl: 'Goedemorgen! Wat willen jullie bestellen?', de: 'Guten Morgen! Was möchtet ihr bestellen?' },
      { who: 'Du', nl: 'Twee koffie, een vers sap en avocadotoast, graag.', de: 'Zwei Kaffee, einen frischen Saft und Avocado-Toast, bitte.' },
      { who: 'Kellnerin', nl: 'Prima. Dat is samen achttien euro vijftig.', de: 'Prima. Das macht zusammen achtzehn Euro fünfzig.' },
      { who: 'Du', nl: 'Mag ik pinnen? Dank u wel!', de: 'Kann ich mit Karte zahlen? Danke!' },
    ],
    speak: [
      { nl: 'Twee koffie, alstublieft.', de: 'Zwei Kaffee, bitte.' },
      { nl: 'Mag ik de rekening?', de: 'Kann ich die Rechnung haben?' },
    ],
    culture: {
      title: 'Koffie, gezelligheid & de tikkie',
      text: 'Kaffeetrinken ist ein sozialer Kern — dazu gehört <b>gezelligheid</b>, dieses unübersetzbare Gefühl von Gemütlichkeit und Beisammensein. Die Rechnung teilt man locker per <b>„tikkie"</b> (eine Bezahl-App): „Ik stuur je een tikkie." Trinkgeld ist nett, aber kein Muss — meist rundet man einfach auf.',
    },
  },
  {
    id: 'plantenwinkel', order: 10, icon: '🪴',
    title: 'Im Pflanzenladen',
    situation: 'Eni im Pflanzenhimmel — du trägst.',
    story: 'Eni hat einen neuen Pflanzenladen entdeckt, und für dich heißt das: Trägerdienst. Zwischen Dutzenden Monsteras, Farnen und Kakteen strahlt sie wie ein Kind. „Nur eine", hattest du gesagt. Ihr geht mit drei Töpfen und einer Rechnung raus, über die du lieber nicht sprichst.',
    grammar: 'meervoud',
    vocab: [
      { id: 'pl_plant', nl: 'de plant', de: 'die Pflanze', ex: 'Deze plant is mooi.', exDe: 'Diese Pflanze ist schön.' },
      { id: 'pl_planten', nl: 'de planten', de: 'die Pflanzen', ex: 'Zoveel planten hier!', exDe: 'So viele Pflanzen hier!' },
      { id: 'pl_pot', nl: 'de pot', de: 'der Topf', ex: 'Een pot voor de plant.', exDe: 'Ein Topf für die Pflanze.' },
      { id: 'pl_bloem', nl: 'de bloemen', de: 'die Blumen', ex: 'Rode bloemen.', exDe: 'Rote Blumen.' },
      { id: 'pl_water', nl: 'water geven', de: 'gießen', ex: 'Ik geef de planten water.', exDe: 'Ich gieße die Pflanzen.' },
      { id: 'pl_groen', nl: 'groen', de: 'grün', ex: 'Alles is lekker groen.', exDe: 'Alles ist schön grün.' },
      { id: 'pl_hoeveel', nl: 'hoeveel', de: 'wie viele', ex: 'Hoeveel planten wil je?', exDe: 'Wie viele Pflanzen willst du?' },
    ],
    dialogue: [
      { who: 'Verkäuferin', nl: 'Zoek je iets speciaals?', de: 'Suchst du etwas Bestimmtes?' },
      { who: 'Eni', nl: 'Ik hou van planten! Deze monstera\'s zijn prachtig.', de: 'Ich liebe Pflanzen! Diese Monsteras sind wunderschön.' },
      { who: 'Verkäuferin', nl: 'Ze hebben veel licht nodig, en niet te veel water.', de: 'Sie brauchen viel Licht, und nicht zu viel Wasser.' },
      { who: 'Du', nl: 'Eén plant, zei je... nu zijn het er drie.', de: 'Eine Pflanze, sagtest du... jetzt sind es drei.' },
    ],
    speak: [
      { nl: 'Deze planten zijn mooi.', de: 'Diese Pflanzen sind schön.' },
      { nl: 'Ik geef de planten water.', de: 'Ich gieße die Pflanzen.' },
    ],
    culture: {
      title: 'Ein Volk von Gärtnern',
      text: 'Die Niederlande sind der weltgrößte Blumen-Exporteur — in <b>Aalsmeer</b> steht die größte Blumenauktion der Welt. Zimmerpflanzen (<b>kamerplanten</b>) sind ein riesiger Trend, und im Frühling pilgert das halbe Land in den <b>Keukenhof</b>, den berühmten Tulpenpark. Grün gehört hier einfach zum Zuhause.',
    },
  },
  {
    id: 'ramen', order: 11, icon: '🍜',
    title: 'Bei Takumi Ramen',
    situation: 'Dampfende Schüsseln bei Takumi Ramen.',
    story: 'Abendessen bei Takumi Ramen in Utrecht — winzig, immer voll, immer gut. Die Schüsseln dampfen, Eni pustet auf ihre scharfe Miso-Ramen, du versuchst, mit Stäbchen würdevoll auszusehen. „Lekker" ist das erste Wort, das dir mühelos rausrutscht.',
    grammar: 'bijvoeglijk',
    vocab: [
      { id: 'ra_ramen', nl: 'de ramen', de: 'die Ramen', ex: 'De ramen is heerlijk.', exDe: 'Die Ramen ist köstlich.' },
      { id: 'ra_lekker', nl: 'lekker', de: 'lecker', ex: 'Wat lekker!', exDe: 'Wie lecker!' },
      { id: 'ra_warm', nl: 'warm', de: 'warm', ex: 'De soep is heel warm.', exDe: 'Die Suppe ist sehr warm.' },
      { id: 'ra_pittig', nl: 'pittig', de: 'scharf (würzig)', ex: 'Mijn ramen is pittig.', exDe: 'Meine Ramen ist scharf.' },
      { id: 'ra_honger', nl: 'honger hebben', de: 'Hunger haben', ex: 'Ik heb honger.', exDe: 'Ich habe Hunger.' },
      { id: 'ra_kom', nl: 'een lekkere kom', de: 'eine leckere Schüssel', ex: 'Een lekkere kom ramen.', exDe: 'Eine leckere Schüssel Ramen.' },
      { id: 'ra_smaakt', nl: 'het smaakt', de: 'es schmeckt', ex: 'Het smaakt goed!', exDe: 'Es schmeckt gut!' },
    ],
    dialogue: [
      { who: 'Kellner', nl: 'Al gekozen? De miso ramen is heel populair.', de: 'Schon gewählt? Die Miso-Ramen ist sehr beliebt.' },
      { who: 'Eni', nl: 'Ik neem de pittige miso. Lekker warm!', de: 'Ich nehme die scharfe Miso. Schön warm!' },
      { who: 'Du', nl: 'Voor mij de ramen met kip, alstublieft.', de: 'Für mich die Ramen mit Huhn, bitte.' },
      { who: 'Kellner', nl: 'Goede keuze! Eet smakelijk.', de: 'Gute Wahl! Guten Appetit.' },
    ],
    speak: [
      { nl: 'De ramen is heel lekker.', de: 'Die Ramen ist sehr lecker.' },
      { nl: 'Ik heb honger.', de: 'Ich habe Hunger.' },
    ],
    culture: {
      title: 'Eten & „eet smakelijk"',
      text: 'Vor dem Essen wünscht man sich <b>„eet smakelijk"</b> (guten Appetit). Die niederländische Küche ist bodenständig (Brot mittags, warm abends), aber die Städte sind extrem international — Utrecht ist voll mit Ramen, Poke und surinamischen Lokalen. Und <b>„lekker"</b> ist das Zauberwort: Essen, Wetter, Musik — fast alles kann „lekker" sein.',
    },
  },
  {
    id: 'terras', order: 12, icon: '🍺',
    title: 'Op het terras',
    situation: 'Ein Bierchen in der Sonne — „op het terras".',
    story: 'Erster richtig warmer Tag, und die halbe Stadt sitzt draußen. Ihr ergattert einen Platz auf einem <i>terras</i> an der Gracht. „Borrel-Zeit", grinst Eni. Du bestellst dein erstes <i>biertje</i> auf Niederländisch — und lernst, dass man hier beim Anstoßen jedem in die Augen schaut.',
    grammar: 'graag',
    vocab: [
      { id: 'te_terras', nl: 'het terras', de: 'die (Außen-)Terrasse', ex: 'We zitten op het terras.', exDe: 'Wir sitzen auf der Terrasse.' },
      { id: 'te_biertje', nl: 'het biertje', de: 'das Bierchen', ex: 'Een biertje, graag.', exDe: 'Ein Bierchen, bitte.' },
      { id: 'te_wijn', nl: 'de wijn', de: 'der Wein', ex: 'Ik wil liever wijn.', exDe: 'Ich möchte lieber Wein.' },
      { id: 'te_graag', nl: 'graag', de: 'gern', ex: 'Heel graag!', exDe: 'Sehr gern!' },
      { id: 'te_liever', nl: 'liever', de: 'lieber', ex: 'Ik drink liever thee.', exDe: 'Ich trinke lieber Tee.' },
      { id: 'te_proost', nl: 'proost!', de: 'prost!', ex: 'Proost, op Utrecht!', exDe: 'Prost, auf Utrecht!' },
      { id: 'te_gezellig', nl: 'gezellig', de: 'gemütlich / schön', ex: 'Wat gezellig hier!', exDe: 'Wie gemütlich hier!' },
    ],
    dialogue: [
      { who: 'Kellner', nl: 'Willen jullie iets drinken?', de: 'Möchtet ihr etwas trinken?' },
      { who: 'Du', nl: 'Ja, graag. Een biertje voor mij.', de: 'Ja, gern. Ein Bierchen für mich.' },
      { who: 'Eni', nl: 'Ik wil liever een wit wijntje.', de: 'Ich möchte lieber einen Weißwein.' },
      { who: 'Kellner', nl: 'Komt eraan. Gezellig!', de: 'Kommt sofort. Schön!' },
    ],
    speak: [
      { nl: 'Een biertje, graag.', de: 'Ein Bierchen, bitte.' },
      { nl: 'Ik drink liever wijn.', de: 'Ich trinke lieber Wein.' },
    ],
    culture: {
      title: 'De borrel & „proost"',
      text: 'Der <b>borrel</b> — ein zwangloses Feierabend-Getränk mit Freunden oder Kollegen — ist eine Institution, oft mit <b>bitterballen</b> (frittierte Fleischbällchen mit Senf). Beim Anstoßen schaut man sich in die Augen und sagt <b>„proost"</b>. Und das Wort <b>gezellig</b> beschreibt genau diese Stimmung — quasi der Nationalcharakter in einem Wort.',
    },
  },
  {
    id: 'markt', order: 13, icon: '🧀',
    title: 'Auf dem Samstagsmarkt',
    situation: 'Käse, Blumen, Stroopwafels.',
    story: 'Samstag ist Markttag. Zwischen Käseständen, Blumeneimern und dem Duft frischer <i>stroopwafels</i> übst du, nach Mengen und Preisen zu fragen. Der Käsehändler schneidet dir ein Stück <i>oude kaas</i> ab und zwinkert: „Voor de buurman-tarief." Nachbarschafts-Preis.',
    grammar: 'getallen',
    vocab: [
      { id: 'ma_markt', nl: 'de markt', de: 'der Markt', ex: 'De markt is op zaterdag.', exDe: 'Der Markt ist am Samstag.' },
      { id: 'ma_kaas', nl: 'de kaas', de: 'der Käse', ex: 'Oude kaas is lekker.', exDe: 'Alter Käse ist lecker.' },
      { id: 'ma_stuk', nl: 'een stuk', de: 'ein Stück', ex: 'Een stuk kaas, graag.', exDe: 'Ein Stück Käse, bitte.' },
      { id: 'ma_kilo', nl: 'een kilo', de: 'ein Kilo', ex: 'Een kilo appels.', exDe: 'Ein Kilo Äpfel.' },
      { id: 'ma_stroopwafel', nl: 'de stroopwafel', de: 'die Stroopwafel', ex: 'Verse stroopwafels!', exDe: 'Frische Stroopwafeln!' },
      { id: 'ma_hoeveelkost', nl: 'hoeveel kost dat?', de: 'wie viel kostet das?', ex: 'Hoeveel kost dat?', exDe: 'Wie viel kostet das?' },
      { id: 'ma_vers', nl: 'vers', de: 'frisch', ex: 'Alles is vers vandaag.', exDe: 'Alles ist frisch heute.' },
    ],
    dialogue: [
      { who: 'Händler', nl: 'Zegt u het maar! Verse kaas vandaag.', de: 'Sagen Sie ruhig! Frischer Käse heute.' },
      { who: 'Du', nl: 'Een stuk oude kaas, graag. Hoeveel kost dat?', de: 'Ein Stück alten Käse, bitte. Wie viel kostet das?' },
      { who: 'Händler', nl: 'Dat is vier euro vijftig. Iets anders?', de: 'Das sind vier Euro fünfzig. Sonst noch etwas?' },
      { who: 'Du', nl: 'Ja, twee stroopwafels. Dank u wel!', de: 'Ja, zwei Stroopwafeln. Danke!' },
    ],
    speak: [
      { nl: 'Hoeveel kost dat?', de: 'Wie viel kostet das?' },
      { nl: 'Een stuk kaas, graag.', de: 'Ein Stück Käse, bitte.' },
    ],
    culture: {
      title: 'Kaas, markt & stroopwafels',
      text: 'Käse ist Nationalstolz: <b>Gouda</b> und <b>Edam</b> kennt die ganze Welt, und „oude kaas" (gereift) ist würzig-kräftig. Auf dem <b>Wochenmarkt</b> kauft man frisch und günstig. Und die <b>stroopwafel</b> — zwei dünne Waffeln mit Sirup dazwischen — stammt aus Gouda; frisch vom Markt, noch warm, ist sie unschlagbar.',
    },
  },
  {
    id: 'avond', order: 14, icon: '🛋️',
    title: 'Abends chillen mit den Schmusis',
    situation: 'Couch, YouTube, zwei Katzen — Feierabend.',
    story: 'Ein ruhiger Abend zu Hause. Ihr liegt auf eurer riesigen Couch, auf dem Laptop läuft ein Liquicity-Mix auf YouTube, und beide Katzen haben beschlossen, dass eure Beine ihnen gehören. Der Schmuser schnurrt auf deinem Bauch, Nalani putzt sich auf Enis Schoß. „Dit is ons huis", sagt Eni leise. Zuhause.',
    grammar: 'bezit',
    vocab: [
      { id: 'av_avond', nl: 'de avond', de: 'der Abend', ex: 'Een rustige avond.', exDe: 'Ein ruhiger Abend.' },
      { id: 'av_bank', nl: 'de bank', de: 'das Sofa', ex: 'Onze bank is groot.', exDe: 'Unser Sofa ist groß.' },
      { id: 'av_mijn', nl: 'mijn', de: 'mein', ex: 'Mijn kat slaapt.', exDe: 'Meine Katze schläft.' },
      { id: 'av_onze', nl: 'onze', de: 'unser(e)', ex: 'Onze katten zijn lief.', exDe: 'Unsere Katzen sind lieb.' },
      { id: 'av_kijken', nl: 'kijken', de: 'schauen', ex: 'We kijken YouTube.', exDe: 'Wir schauen YouTube.' },
      { id: 'av_moe', nl: 'moe', de: 'müde', ex: 'Ik ben moe.', exDe: 'Ich bin müde.' },
      { id: 'av_samen', nl: 'samen', de: 'zusammen', ex: 'Samen op de bank.', exDe: 'Zusammen auf dem Sofa.' },
    ],
    dialogue: [
      { who: 'Eni', nl: 'Wat wil je kijken? Jouw keuze vanavond.', de: 'Was willst du schauen? Deine Wahl heute Abend.' },
      { who: 'Du', nl: 'Een dj-set op YouTube. Onze katten zitten al klaar.', de: 'Ein DJ-Set auf YouTube. Unsere Katzen sitzen schon bereit.' },
      { who: 'Eni', nl: 'De Schmuser ligt op jouw buik, Nalani op mijn schoot.', de: 'Der Schmuser liegt auf deinem Bauch, Nalani auf meinem Schoß.' },
      { who: 'Du', nl: 'Dit is ons huis. Gezellig, hè?', de: 'Das ist unser Zuhause. Gemütlich, oder?' },
    ],
    speak: [
      { nl: 'Onze katten zijn lief.', de: 'Unsere Katzen sind lieb.' },
      { nl: 'We kijken samen YouTube.', de: 'Wir schauen zusammen YouTube.' },
    ],
    culture: {
      title: 'Gezellig thuis & „niksen"',
      text: 'Die Niederländer haben ein Wort für entspanntes Nichtstun: <b>niksen</b> — bewusst mal gar nichts tun. Zusammen mit <b>gezelligheid</b> ist ein gemütlicher Couch-Abend fast Kulturgut. Übrigens bleiben abends viele Gardinen offen — ein Erbe des calvinistischen „ich habe nichts zu verbergen".',
    },
  },
  {
    id: 'verjaardag', order: 15, icon: '🎂',
    title: 'Eine niederländische Geburtstagsfeier',
    situation: 'Der berüchtigte Geburtstags-Kreis.',
    story: 'Enis Freundin hat Geburtstag, und du erlebst dein erstes echtes niederländisches <i>verjaardag</i>: Alle sitzen im Kreis, und du gratulierst nicht nur dem Geburtstagskind, sondern <b>allen</b> — „gefeliciteerd met je vriendin!" Es gibt Kaffee und genau ein Stück Kuchen. Willkommen in einer sehr niederländischen Tradition.',
    grammar: 'voegwoorden',
    vocab: [
      { id: 'vj_verjaardag', nl: 'de verjaardag', de: 'der Geburtstag', ex: 'Fijne verjaardag!', exDe: 'Schönen Geburtstag!' },
      { id: 'vj_gefeliciteerd', nl: 'gefeliciteerd', de: 'herzlichen Glückwunsch', ex: 'Gefeliciteerd!', exDe: 'Herzlichen Glückwunsch!' },
      { id: 'vj_taart', nl: 'de taart', de: 'die Torte', ex: 'Een stukje taart?', exDe: 'Ein Stückchen Torte?' },
      { id: 'vj_cadeau', nl: 'het cadeau', de: 'das Geschenk', ex: 'Een cadeau voor haar.', exDe: 'Ein Geschenk für sie.' },
      { id: 'vj_want', nl: 'want', de: 'denn', ex: 'Ik ben blij, want het is feest.', exDe: 'Ich bin froh, denn es ist Feier.' },
      { id: 'vj_omdat', nl: 'omdat', de: 'weil', ex: 'Ik lach omdat het gezellig is.', exDe: 'Ich lache, weil es gemütlich ist.' },
      { id: 'vj_feest', nl: 'het feest', de: 'die Feier', ex: 'Wat een leuk feest!', exDe: 'Was für eine schöne Feier!' },
    ],
    dialogue: [
      { who: 'Du', nl: 'Gefeliciteerd met je verjaardag!', de: 'Herzlichen Glückwunsch zum Geburtstag!' },
      { who: 'Freundin', nl: 'Dank je wel! Wil je koffie en taart?', de: 'Danke dir! Möchtest du Kaffee und Torte?' },
      { who: 'Du', nl: 'Heel graag, want ik hou van taart.', de: 'Sehr gern, denn ich liebe Torte.' },
      { who: 'Gast', nl: 'En jij ook gefeliciteerd, met je vrouw!', de: 'Und dir auch Glückwunsch, zu deiner Frau!' },
    ],
    speak: [
      { nl: 'Gefeliciteerd met je verjaardag!', de: 'Herzlichen Glückwunsch zum Geburtstag!' },
      { nl: 'Ik ben blij, want het is feest.', de: 'Ich bin froh, denn es ist Feier.' },
    ],
    culture: {
      title: 'Der Kreis & das Gratulieren',
      text: 'Der <b>Kreis-Geburtstag</b> ist berüchtigt: Man sitzt im Stuhlkreis und gratuliert nicht nur dem Geburtstagskind, sondern <b>jedem</b> im Raum („gefeliciteerd met je zus/vriend"). Dazu Kaffee und meist nur <b>ein</b> Stück Kuchen — ein zweites zu nehmen, gilt fast als gewagt. Fremd, aber urgemütlich.',
    },
  },
  {
    id: 'amsterdam', order: 16, icon: '🚆',
    title: 'Ausflug nach Amsterdam',
    situation: 'Mit dem Zug nach Amsterdam — Fragen über Fragen.',
    story: 'Ein Tagesausflug nach Amsterdam. Ihr nehmt den <i>trein</i> ab Utrecht Centraal — 25 Minuten. Grachten, Museen, viel zu viele Fahrräder und noch mehr Touristen. Du übst, nach dem Weg, der Uhrzeit und dem richtigen Gleis zu fragen. „Waar", „hoe laat", „welk spoor" — heute bist du der mit den Fragen.',
    grammar: 'vraagwoorden',
    vocab: [
      { id: 'am_trein', nl: 'de trein', de: 'der Zug', ex: 'De trein naar Amsterdam.', exDe: 'Der Zug nach Amsterdam.' },
      { id: 'am_station', nl: 'het station', de: 'der Bahnhof', ex: 'Waar is het station?', exDe: 'Wo ist der Bahnhof?' },
      { id: 'am_spoor', nl: 'het spoor', de: 'das Gleis', ex: 'Welk spoor?', exDe: 'Welches Gleis?' },
      { id: 'am_waar', nl: 'waar', de: 'wo', ex: 'Waar gaan we heen?', exDe: 'Wo gehen wir hin?' },
      { id: 'am_hoelaat', nl: 'hoe laat', de: 'wie spät / wann', ex: 'Hoe laat gaat de trein?', exDe: 'Wann fährt der Zug?' },
      { id: 'am_kaartje', nl: 'het kaartje', de: 'das Ticket', ex: 'Een kaartje naar Amsterdam.', exDe: 'Ein Ticket nach Amsterdam.' },
      { id: 'am_uitstappen', nl: 'uitstappen', de: 'aussteigen', ex: 'We stappen hier uit.', exDe: 'Wir steigen hier aus.' },
    ],
    dialogue: [
      { who: 'Du', nl: 'Pardon, hoe laat gaat de trein naar Amsterdam?', de: 'Entschuldigung, wann fährt der Zug nach Amsterdam?' },
      { who: 'Beamter', nl: 'Om tien over tien, van spoor vijf.', de: 'Um zehn nach zehn, von Gleis fünf.' },
      { who: 'Du', nl: 'En waar koop ik een kaartje?', de: 'Und wo kaufe ich ein Ticket?' },
      { who: 'Beamter', nl: 'Bij de automaat, daar rechts. Goede reis!', de: 'Am Automaten, da rechts. Gute Reise!' },
    ],
    speak: [
      { nl: 'Hoe laat gaat de trein?', de: 'Wann fährt der Zug?' },
      { nl: 'Waar koop ik een kaartje?', de: 'Wo kaufe ich ein Ticket?' },
    ],
    culture: {
      title: 'De trein, OV & Amsterdam',
      text: 'Die Niederlande sind winzig und bestens vernetzt: Mit dem <b>trein</b> (NS) ist man von Utrecht in 25 Minuten in Amsterdam. Bezahlt wird bargeldlos mit <b>OV-chipkaart</b> oder Bankkarte — einfach ein- und auschecken. Amsterdam ist Hauptstadt und Postkarte zugleich, aber viele finden Utrecht <b>gezelliger</b> — kleiner, entspannter, weniger Touristen.',
    },
  },
  {
    id: 'liquicity', order: 17, icon: '🎆',
    title: 'Liquicity & die alte Crew',
    situation: 'Bässe am See — und plötzlich Berlin.',
    story: 'Liquicity Festival. Bässe, Sonnenuntergang über dem See, und mitten in der Menge — deine alte Crew aus Berlin, die du seit Jahren nicht gesehen hast. Umarmungen, Grinsen, alte Geschichten. Zum ersten Mal erzählst du auf Niederländisch, was du früher gemacht hast.',
    grammar: 'perfectum',
    vocab: [
      { id: 'li_festival', nl: 'het festival', de: 'das Festival', ex: 'Het festival is geweldig.', exDe: 'Das Festival ist großartig.' },
      { id: 'li_vroeger', nl: 'vroeger', de: 'früher', ex: 'Vroeger woonde ik in Berlijn.', exDe: 'Früher wohnte ich in Berlin.' },
      { id: 'li_gezien', nl: 'ik heb gezien', de: 'ich habe gesehen', ex: 'Ik heb de crew gezien!', exDe: 'Ich habe die Crew gesehen!' },
      { id: 'li_gedraaid', nl: 'we hebben gedraaid', de: 'wir haben aufgelegt', ex: 'We hebben samen gedraaid.', exDe: 'Wir haben zusammen aufgelegt.' },
      { id: 'li_geleden', nl: 'lang geleden', de: 'lange her', ex: 'Dat is lang geleden.', exDe: 'Das ist lange her.' },
      { id: 'li_vrienden', nl: 'de vrienden', de: 'die Freunde', ex: 'Oude vrienden!', exDe: 'Alte Freunde!' },
      { id: 'li_gemist', nl: 'ik heb je gemist', de: 'ich habe dich vermisst', ex: 'Ik heb jullie gemist.', exDe: 'Ich habe euch vermisst.' },
    ],
    dialogue: [
      { who: 'Freund', nl: 'Carlsson?! Wat doe jij hier?', de: 'Carlsson?! Was machst du hier?' },
      { who: 'Du', nl: 'Ik woon nu in Utrecht. Ik heb jullie gemist!', de: 'Ich wohne jetzt in Utrecht. Ich habe euch vermisst!' },
      { who: 'Freund', nl: 'Weet je nog, we hebben samen gedraaid in Berlijn.', de: 'Weißt du noch, wir haben zusammen in Berlin aufgelegt.' },
      { who: 'Du', nl: 'Natuurlijk! Dat is lang geleden. Zo gaaf om jullie te zien.', de: 'Natürlich! Das ist lange her. So cool, euch zu sehen.' },
    ],
    speak: [
      { nl: 'Ik heb jullie gemist.', de: 'Ich habe euch vermisst.' },
      { nl: 'We hebben samen gedraaid.', de: 'Wir haben zusammen aufgelegt.' },
    ],
    culture: {
      title: 'Liquicity & de festivalzomer',
      text: 'Der niederländische <b>Festivalsommer</b> ist legendär: Von <b>Liquicity</b> (melodischer Drum & Bass am See) über Lowlands bis Awakenings gibt es fast jedes Wochenende ein Festival. <b>Liquicity</b> begann als YouTube-Kanal aus den Niederlanden und wurde zur weltweiten Community. Man kommt für die Musik — und bleibt für die <b>gezelligheid</b> auf der Wiese.',
    },
  },
  {
    id: 'void', order: 18, icon: '🔮',
    title: 'The Void — erste Reihe',
    situation: 'Frontrow, Bässe und Bänder-Tausch.',
    story: 'The Void Festival, ihr steht ganz vorne an der Rail. Die Bässe treffen dich mitten in die Brust, Eni tanzt neben dir wie entfesselt. Ein Mädchen aus der Menge reicht euch selbstgemachte <i>kandi</i>-Bänder rüber — die Rave-Tradition des Tauschens. Ihr tauscht zurück. Heute Abend seid ihr Teil von etwas.',
    grammar: 'toekomst',
    vocab: [
      { id: 'vo_feesten', nl: 'feesten', de: 'feiern', ex: 'We gaan feesten!', exDe: 'Wir werden feiern!' },
      { id: 'vo_dansen', nl: 'dansen', de: 'tanzen', ex: 'Ik ga de hele nacht dansen.', exDe: 'Ich werde die ganze Nacht tanzen.' },
      { id: 'vo_bas', nl: 'de bas', de: 'der Bass', ex: 'De bas is zwaar!', exDe: 'Der Bass ist heftig!' },
      { id: 'vo_vooraan', nl: 'vooraan', de: 'ganz vorne', ex: 'We staan vooraan.', exDe: 'Wir stehen ganz vorne.' },
      { id: 'vo_bandje', nl: 'het bandje', de: 'das Armband', ex: 'Een bandje ruilen.', exDe: 'Ein Armband tauschen.' },
      { id: 'vo_ruilen', nl: 'ruilen', de: 'tauschen', ex: 'Zullen we ruilen?', exDe: 'Sollen wir tauschen?' },
      { id: 'vo_nacht', nl: 'de nacht', de: 'die Nacht', ex: 'De hele nacht!', exDe: 'Die ganze Nacht!' },
    ],
    dialogue: [
      { who: 'Mädchen', nl: 'Hoi! Wil je een bandje ruilen?', de: 'Hi! Willst du ein Armband tauschen?' },
      { who: 'Du', nl: 'Ja, gaaf! Hier, deze is voor jou.', de: 'Ja, cool! Hier, das ist für dich.' },
      { who: 'Eni', nl: 'We gaan de hele nacht dansen, toch?', de: 'Wir werden die ganze Nacht tanzen, oder?' },
      { who: 'Du', nl: 'Zeker! Vooraan, samen. Dit is zo gaaf.', de: 'Klar! Ganz vorne, zusammen. Das ist so cool.' },
    ],
    speak: [
      { nl: 'We gaan de hele nacht dansen.', de: 'Wir werden die ganze Nacht tanzen.' },
      { nl: 'Zullen we ruilen?', de: 'Sollen wir tauschen?' },
    ],
    culture: {
      title: 'PLUR, kandi & de ravecultuur',
      text: 'In der Rave-Kultur steht <b>PLUR</b> für „Peace, Love, Unity, Respect" — und das Tauschen selbstgemachter <b>kandi</b>-Bänder ist ein kleines Freundschaftsritual. Die Niederlande sind ein Herzland harter elektronischer Musik; Events wie <b>Blackout</b> ziehen Fans aus ganz Europa. Vorne an der <b>rail</b> zu stehen, ist ein Ritterschlag.',
    },
  },
  {
    id: 'optreden', order: 19, icon: '🔊',
    title: 'Hinter den Decks',
    situation: 'Blackout-Nacht im TivoliVredenburg — dein Slot.',
    story: 'TivoliVredenburg, Blackout-Nacht. Deine Hände zittern, zu Hause hat der Schmuser zur Feier des Tages ein Kabel durchgekaut, und Eni steht vorne und strahlt. Der Vorgänger dreht ab, Ferry nickt dir zu: „Ga maar." Du gehst hinter die Decks — und zum ersten Mal fragst du dich nicht mehr, ob du hierhergehörst.',
    grammar: 'toekomst',
    vocab: [
      { id: 'o_gaik', nl: 'ik ga', de: 'ich werde / ich gehe', ex: 'Ik ga nu draaien.', exDe: 'Ich lege jetzt auf.' },
      { id: 'o_vanavond', nl: 'vanavond', de: 'heute Abend', ex: 'Vanavond speel ik.', exDe: 'Heute Abend spiele ich.' },
      { id: 'o_spelen', nl: 'spelen', de: 'spielen', ex: 'Ik ga een set spelen.', exDe: 'Ich werde ein Set spielen.' },
      { id: 'o_zenuw', nl: 'zenuwachtig', de: 'nervös', ex: 'Ik ben een beetje zenuwachtig.', exDe: 'Ich bin ein bisschen nervös.' },
      { id: 'o_klaar', nl: 'klaar', de: 'fertig / bereit', ex: 'Ben je klaar?', exDe: 'Bist du bereit?' },
      { id: 'o_samen', nl: 'samen', de: 'zusammen', ex: 'We doen het samen.', exDe: 'Wir machen es zusammen.' },
      { id: 'o_gaaf', nl: 'gaaf', de: 'geil / cool', ex: 'Dit is zo gaaf!', exDe: 'Das ist so cool!' },
    ],
    dialogue: [
      { who: 'Ferry', nl: 'Ben je klaar? Je gaat nu.', de: 'Bist du bereit? Du bist jetzt dran.' },
      { who: 'Du', nl: 'Ik ben een beetje zenuwachtig, maar ik ga het doen.', de: 'Ich bin ein bisschen nervös, aber ich mache es.' },
      { who: 'Eni', nl: 'Je gaat het geweldig doen! Ik ben trots op je.', de: 'Du machst das großartig! Ich bin stolz auf dich.' },
      { who: 'Du', nl: 'Dank je. Vanavond spelen we samen, Utrecht!', de: 'Danke. Heute Abend spielen wir zusammen, Utrecht!' },
    ],
    speak: [
      { nl: 'Ik ga vanavond draaien.', de: 'Ich lege heute Abend auf.' },
      { nl: 'Dit is zo gaaf!', de: 'Das ist so cool!' },
    ],
    culture: {
      title: 'TivoliVredenburg & feiern auf Niederländisch',
      text: 'Das <b>TivoliVredenburg</b> in Utrecht ist einer der spektakulärsten Konzert-Komplexe Europas — fünf Säle übereinander, von Klassik bis Drum & Bass. Gefeiert wird zusammen und unkompliziert; man verabschiedet sich mit einem lockeren <b>„doei!"</b>. Und wenn etwas richtig gut war, ist es <b>„gaaf"</b> oder <b>„vet"</b>. Welkom thuis, Carlsson.',
    },
  },
  {"id": "per_vangogh", "order": 20, "track": "personen", "icon": "🎨", "title": "Vincent van Gogh", "situation": "Der berühmte Maler und die Sterne", "story": "Vincent van Gogh war ein niederländischer Maler mit einem schweren Leben. Er malte über 800 Bilder, aber verkaufte fast keines davon. Heute ist <b>Die Sternennacht</b> eines der berühmtesten Gemälde der Welt.", "grammar": "presens", "vocab": [{"id": "pe1_schilder", "nl": "de schilder", "de": "der Maler", "ex": "Vincent is een beroemde schilder.", "exDe": "Vincent ist ein berühmter Maler."}, {"id": "pe1_schilderij", "nl": "het schilderij", "de": "das Gemälde", "ex": "Het schilderij is heel mooi.", "exDe": "Das Gemälde ist sehr schön."}, {"id": "pe1_ster", "nl": "de ster", "de": "der Stern", "ex": "Ik zie een ster aan de hemel.", "exDe": "Ich sehe einen Stern am Himmel."}, {"id": "pe1_verf", "nl": "de verf", "de": "die Farbe", "ex": "Hij gebruikt veel gele verf.", "exDe": "Er benutzt viel gelbe Farbe."}, {"id": "pe1_oor", "nl": "het oor", "de": "das Ohr", "ex": "Hij verloor een deel van zijn oor.", "exDe": "Er verlor einen Teil seines Ohrs."}, {"id": "pe1_verdrietig", "nl": "verdrietig", "de": "traurig", "ex": "Vincent was vaak verdrietig.", "exDe": "Vincent war oft traurig."}, {"id": "pe1_beroemd", "nl": "beroemd", "de": "berühmt", "ex": "Nu is hij heel beroemd.", "exDe": "Jetzt ist er sehr berühmt."}], "dialogue": [{"who": "Tom", "nl": "Ken je het schilderij De sterrennacht?", "de": "Kennst du das Gemälde Die Sternennacht?"}, {"who": "Anna", "nl": "Ja, dat is van Vincent van Gogh.", "de": "Ja, das ist von Vincent van Gogh."}, {"who": "Tom", "nl": "Hij verkocht bijna geen schilderijen.", "de": "Er verkaufte fast keine Gemälde."}, {"who": "Anna", "nl": "Wat verdrietig! Nu is hij wereldberoemd.", "de": "Wie traurig! Jetzt ist er weltberühmt."}], "speak": [{"nl": "Vincent van Gogh is een beroemde schilder.", "de": "Vincent van Gogh ist ein berühmter Maler."}, {"nl": "Ik vind zijn schilderijen mooi.", "de": "Ich finde seine Gemälde schön."}], "culture": {"title": "De sterrennacht", "text": "Van Gogh schilderde <b>De sterrennacht</b> in 1889 in Frankrijk. Tijdens zijn leven verkocht hij bijna geen werk. Vandaag hangen zijn schilderijen in musea over de hele wereld."}},
  {"id": "per_rembrandt", "order": 21, "track": "personen", "icon": "🖼️", "title": "Rembrandt van Rijn", "situation": "Meister des Goldenen Zeitalters", "story": "Rembrandt van Rijn gilt als der größte Maler des niederländischen Goldenen Zeitalters. Berühmt ist er für sein Spiel mit <b>Licht und Schatten</b>. Sein Meisterwerk <i>Die Nachtwache</i> hängt heute im Rijksmuseum.", "grammar": "perfectum", "vocab": [{"id": "pe2_meester", "nl": "de meester", "de": "der Meister", "ex": "Rembrandt was een grote meester.", "exDe": "Rembrandt war ein großer Meister."}, {"id": "pe2_licht", "nl": "het licht", "de": "das Licht", "ex": "Hij heeft mooi licht geschilderd.", "exDe": "Er hat schönes Licht gemalt."}, {"id": "pe2_schaduw", "nl": "de schaduw", "de": "der Schatten", "ex": "In het schilderij zie je veel schaduw.", "exDe": "Im Gemälde sieht man viel Schatten."}, {"id": "pe2_eeuw", "nl": "de eeuw", "de": "das Jahrhundert", "ex": "Hij leefde in de zeventiende eeuw.", "exDe": "Er lebte im siebzehnten Jahrhundert."}, {"id": "pe2_portret", "nl": "het portret", "de": "das Porträt", "ex": "Hij heeft veel portretten gemaakt.", "exDe": "Er hat viele Porträts gemacht."}, {"id": "pe2_gouden", "nl": "gouden", "de": "golden", "ex": "Dit was de Gouden Eeuw.", "exDe": "Das war das Goldene Zeitalter."}, {"id": "pe2_nachtwacht", "nl": "de Nachtwacht", "de": "die Nachtwache", "ex": "De Nachtwacht is heel groot.", "exDe": "Die Nachtwache ist sehr groß."}], "dialogue": [{"who": "Lisa", "nl": "Heb je De Nachtwacht al gezien?", "de": "Hast du Die Nachtwache schon gesehen?"}, {"who": "Ben", "nl": "Ja, ik heb het in Amsterdam bekeken.", "de": "Ja, ich habe sie in Amsterdam angeschaut."}, {"who": "Lisa", "nl": "Rembrandt heeft het in 1642 geschilderd.", "de": "Rembrandt hat sie 1642 gemalt."}, {"who": "Ben", "nl": "Het is echt een meesterwerk.", "de": "Es ist wirklich ein Meisterwerk."}], "speak": [{"nl": "Rembrandt heeft veel schilderijen gemaakt.", "de": "Rembrandt hat viele Gemälde gemacht."}, {"nl": "De Nachtwacht hangt in Amsterdam.", "de": "Die Nachtwache hängt in Amsterdam."}], "culture": {"title": "De Gouden Eeuw", "text": "Rembrandt van Rijn leefde in de <b>Gouden Eeuw</b>, de zeventiende eeuw. Zijn beroemdste werk is <b>De Nachtwacht</b> uit 1642. Het hangt in het Rijksmuseum in Amsterdam."}},
  {"id": "per_annefrank", "order": 22, "track": "personen", "icon": "📖", "title": "Anne Frank", "situation": "Ein Tagebuch aus dem Versteck", "story": "Anne Frank war ein jüdisches Mädchen, das sich während des Zweiten Weltkriegs in Amsterdam versteckte. In ihrem <b>Tagebuch</b> schrieb sie über ihre Ängste und Hoffnungen. Sie starb 1945 in einem Konzentrationslager, doch ihre Worte leben weiter.", "grammar": "woordvolgorde", "vocab": [{"id": "pe3_dagboek", "nl": "het dagboek", "de": "das Tagebuch", "ex": "Anne schreef in haar dagboek.", "exDe": "Anne schrieb in ihr Tagebuch."}, {"id": "pe3_oorlog", "nl": "de oorlog", "de": "der Krieg", "ex": "Er was oorlog in Europa.", "exDe": "Es war Krieg in Europa."}, {"id": "pe3_onderduiken", "nl": "onderduiken", "de": "untertauchen", "ex": "De familie moest onderduiken.", "exDe": "Die Familie musste untertauchen."}, {"id": "pe3_bang", "nl": "bang", "de": "ängstlich", "ex": "Anne was vaak bang.", "exDe": "Anne hatte oft Angst."}, {"id": "pe3_meisje", "nl": "het meisje", "de": "das Mädchen", "ex": "Anne was een joods meisje.", "exDe": "Anne war ein jüdisches Mädchen."}, {"id": "pe3_schrijven", "nl": "schrijven", "de": "schreiben", "ex": "Zij wilde later schrijven.", "exDe": "Sie wollte später schreiben."}, {"id": "pe3_vrijheid", "nl": "de vrijheid", "de": "die Freiheit", "ex": "Zij droomde van vrijheid.", "exDe": "Sie träumte von Freiheit."}], "dialogue": [{"who": "Emma", "nl": "Wie was Anne Frank?", "de": "Wer war Anne Frank?"}, {"who": "Jan", "nl": "Zij was een meisje uit Amsterdam.", "de": "Sie war ein Mädchen aus Amsterdam."}, {"who": "Emma", "nl": "In de oorlog schreef zij een dagboek.", "de": "Im Krieg schrieb sie ein Tagebuch."}, {"who": "Jan", "nl": "Nu lezen mensen het over de hele wereld.", "de": "Jetzt lesen es Menschen auf der ganzen Welt."}], "speak": [{"nl": "Anne Frank schreef een beroemd dagboek.", "de": "Anne Frank schrieb ein berühmtes Tagebuch."}, {"nl": "In Amsterdam staat het Anne Frank Huis.", "de": "In Amsterdam steht das Anne-Frank-Haus."}], "culture": {"title": "Het Anne Frank Huis", "text": "Anne Frank dook met haar familie onder in een <b>achterhuis</b> in Amsterdam. Daar schreef zij haar beroemde dagboek. Vandaag is het gebouw een museum aan de Prinsengracht."}},
  {"id": "per_cruyff", "order": 23, "track": "personen", "icon": "⚽", "title": "Johan Cruyff", "situation": "Eine Legende des Fußballs", "story": "Johan Cruyff war die größte Legende des niederländischen Fußballs. Mit seinem eleganten Stil und dem <b>Totaalvoetbal</b> begeisterte er die Welt. Als Spieler und später als Trainer prägte er Ajax und den FC Barcelona.", "grammar": "graag", "vocab": [{"id": "pe4_voetballer", "nl": "de voetballer", "de": "der Fußballer", "ex": "Cruyff was een geweldige voetballer.", "exDe": "Cruyff war ein großartiger Fußballer."}, {"id": "pe4_doelpunt", "nl": "het doelpunt", "de": "das Tor", "ex": "Hij maakte een mooi doelpunt.", "exDe": "Er machte ein schönes Tor."}, {"id": "pe4_ploeg", "nl": "de ploeg", "de": "die Mannschaft", "ex": "Zijn ploeg was Ajax.", "exDe": "Seine Mannschaft war Ajax."}, {"id": "pe4_winnen", "nl": "winnen", "de": "gewinnen", "ex": "Ajax wilde altijd winnen.", "exDe": "Ajax wollte immer gewinnen."}, {"id": "pe4_speler", "nl": "de speler", "de": "der Spieler", "ex": "Hij was speler nummer veertien.", "exDe": "Er war Spieler Nummer vierzehn."}, {"id": "pe4_trainer", "nl": "de trainer", "de": "der Trainer", "ex": "Later werd hij trainer.", "exDe": "Später wurde er Trainer."}, {"id": "pe4_snel", "nl": "snel", "de": "schnell", "ex": "Hij was heel snel op het veld.", "exDe": "Er war sehr schnell auf dem Feld."}], "dialogue": [{"who": "Sofie", "nl": "Speel jij graag voetbal?", "de": "Spielst du gern Fußball?"}, {"who": "Max", "nl": "Ja, heel graag! Cruyff is mijn held.", "de": "Ja, sehr gern! Cruyff ist mein Held."}, {"who": "Sofie", "nl": "Hij speelde bij Ajax en Barcelona.", "de": "Er spielte bei Ajax und Barcelona."}, {"who": "Max", "nl": "Hij vond mooi voetbal belangrijk.", "de": "Ihm war schöner Fußball wichtig."}], "speak": [{"nl": "Johan Cruyff speelde graag mooi voetbal.", "de": "Johan Cruyff spielte gern schönen Fußball."}, {"nl": "Ik kijk graag naar voetbal.", "de": "Ich schaue gern Fußball."}], "culture": {"title": "Totaalvoetbal", "text": "Johan Cruyff maakte het <b>totaalvoetbal</b> beroemd. Bij deze stijl kunnen alle spelers elke positie spelen. Met Ajax en het Nederlands elftal veranderde hij het voetbal voor altijd."}},
  {"id": "per_verstappen", "order": 24, "track": "personen", "icon": "🏎️", "title": "Max Verstappen", "situation": "Weltmeister in der Formel 1", "story": "Max Verstappen ist ein niederländischer Formel-1-Fahrer und einer der erfolgreichsten der Geschichte. Schon mit 17 Jahren fuhr er sein erstes Rennen. Als mehrfacher <b>Weltmeister</b> begeistert er die „Orange Army\" seiner Fans.", "grammar": "toekomst", "vocab": [{"id": "pe5_coureur", "nl": "de coureur", "de": "der Rennfahrer", "ex": "Max is een Nederlandse coureur.", "exDe": "Max ist ein niederländischer Rennfahrer."}, {"id": "pe5_race", "nl": "de race", "de": "das Rennen", "ex": "Hij wint vaak de race.", "exDe": "Er gewinnt oft das Rennen."}, {"id": "pe5_auto", "nl": "de auto", "de": "das Auto", "ex": "Zijn auto is heel snel.", "exDe": "Sein Auto ist sehr schnell."}, {"id": "pe5_kampioen", "nl": "de kampioen", "de": "der Meister", "ex": "Max is kampioen geworden.", "exDe": "Max ist Meister geworden."}, {"id": "pe5_wereldkampioen", "nl": "de wereldkampioen", "de": "der Weltmeister", "ex": "Hij is meerdere keren wereldkampioen.", "exDe": "Er ist mehrfach Weltmeister."}, {"id": "pe5_circuit", "nl": "het circuit", "de": "die Rennstrecke", "ex": "Het circuit ligt in Zandvoort.", "exDe": "Die Rennstrecke liegt in Zandvoort."}, {"id": "pe5_jong", "nl": "jong", "de": "jung", "ex": "Hij was heel jong in de Formule 1.", "exDe": "Er war sehr jung in der Formel 1."}], "dialogue": [{"who": "Tim", "nl": "Denk je dat Max morgen wint?", "de": "Denkst du, dass Max morgen gewinnt?"}, {"who": "Lisa", "nl": "Ja, hij zal vast winnen.", "de": "Ja, er wird bestimmt gewinnen."}, {"who": "Tim", "nl": "Hij is al meerdere keren wereldkampioen.", "de": "Er ist schon mehrfach Weltmeister."}, {"who": "Lisa", "nl": "In de toekomst wint hij nog veel races.", "de": "In der Zukunft gewinnt er noch viele Rennen."}], "speak": [{"nl": "Max Verstappen zal weer een race winnen.", "de": "Max Verstappen wird wieder ein Rennen gewinnen."}, {"nl": "Ik ga zondag naar de Formule 1 kijken.", "de": "Ich werde am Sonntag Formel 1 schauen."}], "culture": {"title": "De Formule 1", "text": "Max Verstappen is een van de beste coureurs ter wereld. Hij werd meerdere keren <b>wereldkampioen</b> in de Formule 1. In Zandvoort rijdt hij voor duizenden Nederlandse fans."}},
  {"id": "per_willemvanoranje", "order": 25, "track": "personen", "icon": "👑", "title": "Willem van Oranje", "situation": "Der Vater des Vaterlandes", "story": "Willem van Oranje führte im 16. Jahrhundert den Aufstand der Niederlande gegen die spanische Herrschaft an. Deshalb gilt er als <b>Vater des Vaterlandes</b>. Die niederländische Nationalhymne, das Wilhelmus, ist ihm gewidmet.", "grammar": "getallen", "vocab": [{"id": "pe6_prins", "nl": "de prins", "de": "der Fürst", "ex": "Willem was een prins van Oranje.", "exDe": "Willem war ein Fürst von Oranien."}, {"id": "pe6_opstand", "nl": "de opstand", "de": "der Aufstand", "ex": "Hij leidde de opstand tegen Spanje.", "exDe": "Er führte den Aufstand gegen Spanien."}, {"id": "pe6_land", "nl": "het land", "de": "das Land", "ex": "Hij hield van zijn land.", "exDe": "Er liebte sein Land."}, {"id": "pe6_vader", "nl": "de vader", "de": "der Vater", "ex": "Men noemt hem de vader des vaderlands.", "exDe": "Man nennt ihn den Vater des Vaterlandes."}, {"id": "pe6_vijand", "nl": "de vijand", "de": "der Feind", "ex": "Spanje was de vijand.", "exDe": "Spanien war der Feind."}, {"id": "pe6_strijden", "nl": "strijden", "de": "kämpfen", "ex": "Het volk moest lang strijden.", "exDe": "Das Volk musste lange kämpfen."}, {"id": "pe6_vrij", "nl": "vrij", "de": "frei", "ex": "Hij wilde een vrij land.", "exDe": "Er wollte ein freies Land."}], "dialogue": [{"who": "Anna", "nl": "Wanneer leefde Willem van Oranje?", "de": "Wann lebte Willem van Oranje?"}, {"who": "Piet", "nl": "Hij werd geboren in vijftienhonderddrieëndertig.", "de": "Er wurde 1533 geboren."}, {"who": "Anna", "nl": "En hij stierf in Delft, toch?", "de": "Und er starb in Delft, oder?"}, {"who": "Piet", "nl": "Ja, in vijftienhonderdvierentachtig.", "de": "Ja, 1584."}], "speak": [{"nl": "Willem van Oranje is de vader des vaderlands.", "de": "Willem van Oranje ist der Vater des Vaterlandes."}, {"nl": "Hij leefde meer dan vierhonderd jaar geleden.", "de": "Er lebte vor mehr als vierhundert Jahren."}], "culture": {"title": "De Vader des Vaderlands", "text": "Willem van Oranje leidde de <b>opstand</b> tegen de Spaanse koning. Daarom noemen de Nederlanders hem de „vader des vaderlands\". Het Wilhelmus, het volkslied, gaat over hem."}},
  {"id": "per_erasmus", "order": 26, "track": "personen", "icon": "📚", "title": "Erasmus von Rotterdam", "situation": "Ein Gelehrter der Renaissance", "story": "Erasmus von Rotterdam war einer der bedeutendsten Gelehrten und <b>Humanisten</b> der Renaissance. Sein witziges Buch <i>Das Lob der Torheit</i> ist bis heute berühmt. Er reiste durch ganz Europa und setzte sich für Bildung und Frieden ein.", "grammar": "mening", "vocab": [{"id": "pe7_geleerde", "nl": "de geleerde", "de": "der Gelehrte", "ex": "Erasmus was een beroemde geleerde.", "exDe": "Erasmus war ein berühmter Gelehrter."}, {"id": "pe7_boek", "nl": "het boek", "de": "das Buch", "ex": "Hij schreef veel boeken.", "exDe": "Er schrieb viele Bücher."}, {"id": "pe7_wijs", "nl": "wijs", "de": "weise", "ex": "Hij was een wijze man.", "exDe": "Er war ein weiser Mann."}, {"id": "pe7_denken", "nl": "denken", "de": "denken", "ex": "Ik denk dat hij slim was.", "exDe": "Ich denke, dass er klug war."}, {"id": "pe7_kennis", "nl": "de kennis", "de": "das Wissen", "ex": "Kennis was heel belangrijk voor hem.", "exDe": "Wissen war ihm sehr wichtig."}, {"id": "pe7_vrede", "nl": "de vrede", "de": "der Frieden", "ex": "Erasmus hield van vrede.", "exDe": "Erasmus liebte den Frieden."}, {"id": "pe7_schrijver", "nl": "de schrijver", "de": "der Schriftsteller", "ex": "Hij was ook een goede schrijver.", "exDe": "Er war auch ein guter Schriftsteller."}], "dialogue": [{"who": "Lena", "nl": "Wat vind jij van Erasmus?", "de": "Was hältst du von Erasmus?"}, {"who": "Bram", "nl": "Ik vind hem heel interessant.", "de": "Ich finde ihn sehr interessant."}, {"who": "Lena", "nl": "Hij schreef Lof der Zotheid, denk ik.", "de": "Er schrieb Das Lob der Torheit, glaube ich."}, {"who": "Bram", "nl": "Ja, volgens mij is dat zijn bekendste boek.", "de": "Ja, meiner Meinung nach ist das sein bekanntestes Buch."}], "speak": [{"nl": "Ik vind Erasmus een wijze man.", "de": "Ich finde Erasmus einen weisen Mann."}, {"nl": "Volgens mij was hij heel slim.", "de": "Meiner Meinung nach war er sehr klug."}], "culture": {"title": "Lof der Zotheid", "text": "Erasmus van Rotterdam was een van de beroemdste <b>humanisten</b> van Europa. Zijn bekendste boek heet <b>Lof der Zotheid</b>. Hij schreef in het Latijn en pleitte voor vrede en verdraagzaamheid."}},
  {"id": "per_leeuwenhoek", "order": 27, "track": "personen", "icon": "🔬", "title": "Antoni van Leeuwenhoek", "situation": "Der Blick in eine unsichtbare Welt", "story": "Antoni van Leeuwenhoek war ein neugieriger Tuchhändler aus <b>Delft</b>. Mit selbstgebauten Mikroskopen entdeckte er eine unsichtbare Welt aus Bakterien und winzigen Lebewesen. Damit wurde er zum Begründer der <b>Mikrobiologie</b>.", "grammar": "meervoud", "vocab": [{"id": "pe8_microscoop", "nl": "de microscoop", "de": "das Mikroskop", "ex": "Hij maakte veel microscopen.", "exDe": "Er baute viele Mikroskope."}, {"id": "pe8_druppel", "nl": "de druppel", "de": "der Tropfen", "ex": "In de druppels zaten kleine diertjes.", "exDe": "In den Tropfen waren kleine Tierchen."}, {"id": "pe8_diertje", "nl": "het diertje", "de": "das Tierchen", "ex": "Hij zag kleine diertjes in het water.", "exDe": "Er sah kleine Tierchen im Wasser."}, {"id": "pe8_lens", "nl": "de lens", "de": "die Linse", "ex": "Zijn lenzen waren heel goed.", "exDe": "Seine Linsen waren sehr gut."}, {"id": "pe8_ontdekking", "nl": "de ontdekking", "de": "die Entdeckung", "ex": "Zijn ontdekkingen waren belangrijk.", "exDe": "Seine Entdeckungen waren wichtig."}, {"id": "pe8_klein", "nl": "klein", "de": "klein", "ex": "De dingen waren heel klein.", "exDe": "Die Dinge waren sehr klein."}, {"id": "pe8_wetenschapper", "nl": "de wetenschapper", "de": "der Wissenschaftler", "ex": "Hij was een echte wetenschapper.", "exDe": "Er war ein echter Wissenschaftler."}], "dialogue": [{"who": "Noor", "nl": "Wie ontdekte de kleine diertjes in water?", "de": "Wer entdeckte die kleinen Tierchen im Wasser?"}, {"who": "Daan", "nl": "Dat was Antoni van Leeuwenhoek uit Delft.", "de": "Das war Antoni van Leeuwenhoek aus Delft."}, {"who": "Noor", "nl": "Hij maakte zelf zijn microscopen, toch?", "de": "Er baute seine Mikroskope selbst, oder?"}, {"who": "Daan", "nl": "Ja, met heel goede lenzen.", "de": "Ja, mit sehr guten Linsen."}], "speak": [{"nl": "Van Leeuwenhoek zag kleine diertjes in het water.", "de": "Van Leeuwenhoek sah kleine Tierchen im Wasser."}, {"nl": "Hij maakte veel kleine microscopen.", "de": "Er baute viele kleine Mikroskope."}], "culture": {"title": "De vader van de microbiologie", "text": "Antoni van Leeuwenhoek uit <b>Delft</b> maakte zelf zeer sterke microscopen. Als eerste zag hij bacteriën en andere kleine diertjes, die hij „diertjes\" noemde. Daarom heet hij de vader van de <b>microbiologie</b>."}},
  {"id": "per_escher", "order": 28, "track": "personen", "icon": "♾️", "title": "M.C. Escher", "situation": "Kunst mit unmöglichen Figuren", "story": "M.C. Escher war ein niederländischer Grafiker, der mit unserer Wahrnehmung spielte. Er zeichnete <b>unmögliche Figuren</b>: Treppen, die endlos nach oben führen, und Hände, die sich selbst zeichnen. Seine Werke verbinden Kunst und Mathematik auf einzigartige Weise.", "grammar": "dehet", "vocab": [{"id": "pe9_kunstenaar", "nl": "de kunstenaar", "de": "der Künstler", "ex": "De kunstenaar heet Escher.", "exDe": "Der Künstler heißt Escher."}, {"id": "pe9_trap", "nl": "de trap", "de": "die Treppe", "ex": "De trap gaat omhoog en omlaag.", "exDe": "Die Treppe geht hoch und runter."}, {"id": "pe9_tekening", "nl": "de tekening", "de": "die Zeichnung", "ex": "De tekening is heel bijzonder.", "exDe": "Die Zeichnung ist sehr besonders."}, {"id": "pe9_onmogelijk", "nl": "onmogelijk", "de": "unmöglich", "ex": "Het is een onmogelijke figuur.", "exDe": "Es ist eine unmögliche Figur."}, {"id": "pe9_vorm", "nl": "de vorm", "de": "die Form", "ex": "De vormen passen precies in elkaar.", "exDe": "Die Formen passen genau ineinander."}, {"id": "pe9_hand", "nl": "de hand", "de": "die Hand", "ex": "Op de tekening tekent de hand zichzelf.", "exDe": "Auf der Zeichnung zeichnet die Hand sich selbst."}, {"id": "pe9_wereld", "nl": "de wereld", "de": "die Welt", "ex": "Het is een vreemde wereld.", "exDe": "Es ist eine seltsame Welt."}], "dialogue": [{"who": "Fleur", "nl": "Kijk, de trap gaat nergens heen!", "de": "Schau, die Treppe führt nirgendwohin!"}, {"who": "Sem", "nl": "Dat is een tekening van Escher.", "de": "Das ist eine Zeichnung von Escher."}, {"who": "Fleur", "nl": "Hoe maakt hij zoiets onmogelijks?", "de": "Wie macht er so etwas Unmögliches?"}, {"who": "Sem", "nl": "Hij speelde graag met vormen en wiskunde.", "de": "Er spielte gern mit Formen und Mathematik."}], "speak": [{"nl": "De tekeningen van Escher zijn heel bijzonder.", "de": "Die Zeichnungen von Escher sind sehr besonders."}, {"nl": "Het is een wereld vol onmogelijke figuren.", "de": "Es ist eine Welt voller unmöglicher Figuren."}], "culture": {"title": "Onmogelijke figuren", "text": "M.C. Escher was een Nederlandse <b>graficus</b>. Hij tekende trappen die nooit eindigen en figuren die niet kunnen bestaan. Zijn werk verbindt kunst met <b>wiskunde</b>."}},
  {"id": "per_arminvanbuuren", "order": 29, "track": "personen", "icon": "🎚️", "title": "Armin van Buuren", "situation": "Ein DJ und A State of Trance", "story": "Armin van Buuren ist einer der berühmtesten <b>Trance-DJs</b> der Welt. Mit seiner Radioshow <i>A State of Trance</i> erreicht er wöchentlich Millionen Hörer in vielen Ländern. Mehrfach wurde er zum besten DJ der Welt gewählt.", "grammar": "modaal", "vocab": [{"id": "pe10_muziek", "nl": "de muziek", "de": "die Musik", "ex": "Ik wil naar zijn muziek luisteren.", "exDe": "Ich will seine Musik hören."}, {"id": "pe10_dansen", "nl": "dansen", "de": "tanzen", "ex": "Iedereen kan op zijn muziek dansen.", "exDe": "Alle können zu seiner Musik tanzen."}, {"id": "pe10_podium", "nl": "het podium", "de": "die Bühne", "ex": "Hij mag op grote podia staan.", "exDe": "Er darf auf großen Bühnen stehen."}, {"id": "pe10_optreden", "nl": "het optreden", "de": "der Auftritt", "ex": "Vanavond moet hij optreden.", "exDe": "Heute Abend muss er auftreten."}, {"id": "pe10_luisteren", "nl": "luisteren", "de": "hören", "ex": "Je kunt zijn show online luisteren.", "exDe": "Man kann seine Show online hören."}, {"id": "pe10_draaien", "nl": "draaien", "de": "auflegen", "ex": "Hij kan urenlang platen draaien.", "exDe": "Er kann stundenlang Platten auflegen."}, {"id": "pe10_publiek", "nl": "het publiek", "de": "das Publikum", "ex": "Het publiek wil meer muziek.", "exDe": "Das Publikum will mehr Musik."}], "dialogue": [{"who": "Roos", "nl": "Wil je naar Armin van Buuren luisteren?", "de": "Willst du Armin van Buuren hören?"}, {"who": "Kees", "nl": "Ja, ik kan de hele dag naar trance luisteren.", "de": "Ja, ich kann den ganzen Tag Trance hören."}, {"who": "Roos", "nl": "Hij heeft een show: A State of Trance.", "de": "Er hat eine Show: A State of Trance."}, {"who": "Kees", "nl": "We moeten een keer naar zijn optreden gaan!", "de": "Wir müssen mal zu seinem Auftritt gehen!"}], "speak": [{"nl": "Armin van Buuren kan heel goed muziek maken.", "de": "Armin van Buuren kann sehr gut Musik machen."}, {"nl": "Ik wil naar zijn show luisteren.", "de": "Ich will seine Show hören."}], "culture": {"title": "A State of Trance", "text": "Armin van Buuren is een van de bekendste <b>dj's</b> ter wereld. Zijn radioshow <b>A State of Trance</b> heeft miljoenen luisteraars. Meerdere keren was hij nummer één in de lijst van beste dj's."}},
  {"id": "myth_deich", "order": 30, "track": "mythen", "icon": "🕳️", "title": "Der Junge mit dem Finger im Deich", "situation": "Ein Held, den es nie gab", "story": "Jedes Kind kennt den tapferen Jungen, der mit seinem Finger ein Loch im Deich verschloss und so ganz Holland rettete. Doch die Wahrheit ist überraschend: Diese Geschichte stammt gar nicht aus den Niederlanden, sondern aus einem <b>amerikanischen Roman</b> von 1865. Lange Zeit kannten die Niederländer selbst diese Legende überhaupt nicht.", "grammar": "perfectum", "vocab": [{"id": "my1_jongen", "nl": "de jongen", "de": "der Junge", "ex": "De jongen ziet een gat in de dijk.", "exDe": "Der Junge sieht ein Loch im Deich."}, {"id": "my1_vinger", "nl": "de vinger", "de": "der Finger", "ex": "Hij stopt zijn vinger in het gat.", "exDe": "Er steckt seinen Finger in das Loch."}, {"id": "my1_dijk", "nl": "de dijk", "de": "der Deich", "ex": "De dijk beschermt het land.", "exDe": "Der Deich schützt das Land."}, {"id": "my1_gat", "nl": "het gat", "de": "das Loch", "ex": "Er is een gat in de muur.", "exDe": "Es ist ein Loch in der Mauer."}, {"id": "my1_redden", "nl": "redden", "de": "retten", "ex": "De jongen wil het dorp redden.", "exDe": "Der Junge will das Dorf retten."}, {"id": "my1_verhaal", "nl": "het verhaal", "de": "die Geschichte", "ex": "Het verhaal is heel bekend.", "exDe": "Die Geschichte ist sehr bekannt."}, {"id": "my1_verzonnen", "nl": "verzonnen", "de": "erfunden", "ex": "Het verhaal is verzonnen.", "exDe": "Die Geschichte ist erfunden."}], "dialogue": [{"who": "Touristin", "nl": "Is dit de jongen van de dijk?", "de": "Ist das der Junge vom Deich?"}, {"who": "Einheimischer", "nl": "Ja, maar dat verhaal komt uit Amerika.", "de": "Ja, aber diese Geschichte kommt aus Amerika."}, {"who": "Touristin", "nl": "Echt? Ik heb het altijd geloofd.", "de": "Wirklich? Ich habe es immer geglaubt."}, {"who": "Einheimischer", "nl": "Een schrijfster heeft het bedacht.", "de": "Eine Schriftstellerin hat es sich ausgedacht."}], "speak": [{"nl": "Ik heb het verhaal gelezen.", "de": "Ich habe die Geschichte gelesen."}, {"nl": "De jongen heeft het dorp gered.", "de": "Der Junge hat das Dorf gerettet."}], "culture": {"title": "Ein amerikanischer Mythos", "text": "Die Geschichte des Jungen stammt aus dem <b>amerikanischen Roman „Hans Brinker\"</b> von Mary Mapes Dodge aus dem Jahr 1865. In den Niederlanden war sie lange unbekannt. Heute steht in Spaarndam eine Statue, die vor allem Touristen anzieht."}},
  {"id": "myth_oranje", "order": 31, "track": "mythen", "icon": "🟠", "title": "Warum alles orange ist", "situation": "Die Farbe eines ganzen Landes", "story": "Bei einem Fußballspiel oder einem Feiertag färbt sich das ganze Land <b>orange</b>. Dabei ist die Nationalflagge rot-weiß-blau! Die Farbe geht auf das Königshaus <i>Oranien-Nassau</i> zurück und wurde so zum Symbol der ganzen Nation.", "grammar": "dehet", "vocab": [{"id": "my2_oranje", "nl": "oranje", "de": "orange", "ex": "Alles is oranje tijdens het WK.", "exDe": "Alles ist orange während der WM."}, {"id": "my2_koning", "nl": "de koning", "de": "der König", "ex": "De koning woont in Den Haag.", "exDe": "Der König wohnt in Den Haag."}, {"id": "my2_koningin", "nl": "de koningin", "de": "die Königin", "ex": "De koningin heet Máxima.", "exDe": "Die Königin heißt Máxima."}, {"id": "my2_kleur", "nl": "de kleur", "de": "die Farbe", "ex": "Oranje is een mooie kleur.", "exDe": "Orange ist eine schöne Farbe."}, {"id": "my2_vlag", "nl": "de vlag", "de": "die Flagge", "ex": "De vlag is rood, wit en blauw.", "exDe": "Die Flagge ist rot, weiß und blau."}, {"id": "my2_land", "nl": "het land", "de": "das Land", "ex": "Het land houdt van oranje.", "exDe": "Das Land liebt Orange."}, {"id": "my2_voetbal", "nl": "het voetbal", "de": "der Fußball", "ex": "Het voetbal is heel populair.", "exDe": "Fußball ist sehr beliebt."}], "dialogue": [{"who": "Kind", "nl": "Waarom dragen we oranje?", "de": "Warum tragen wir Orange?"}, {"who": "Vater", "nl": "Oranje is de kleur van de koning.", "de": "Orange ist die Farbe des Königs."}, {"who": "Kind", "nl": "Maar de vlag is toch blauw?", "de": "Aber die Flagge ist doch blau?"}, {"who": "Vater", "nl": "Ja, de vlag is anders dan de kleur.", "de": "Ja, die Flagge ist anders als die Farbe."}], "speak": [{"nl": "Ik draag een oranje shirt.", "de": "Ich trage ein orangefarbenes Shirt."}, {"nl": "De koning heet Willem-Alexander.", "de": "Der König heißt Willem-Alexander."}], "culture": {"title": "Das Haus Oranien", "text": "Die Farbe Orange geht auf das <b>Haus Oranien-Nassau</b> und Willem van Oranje im 16. Jahrhundert zurück. Der Name stammt vom Fürstentum Orange in Südfrankreich. Die Flagge ist rot-weiß-blau, doch Orange ist die Farbe der Königsfamilie und der Nationalmannschaften."}},
  {"id": "myth_polder", "order": 32, "track": "mythen", "icon": "🌬️", "title": "Windmühlen & Land aus dem Meer", "situation": "Wie ein Land dem Wasser abgerungen wurde", "story": "Ein großer Teil der Niederlande liegt <b>unter dem Meeresspiegel</b>. Jahrhundertelang pumpten Windmühlen das Wasser aus dem Land, damit die Menschen dort leben und arbeiten konnten. Ein bekannter Spruch sagt: <i>„Gott schuf die Welt, aber die Niederländer schufen die Niederlande.\"</i>", "grammar": "hebbenzijn", "vocab": [{"id": "my3_molen", "nl": "de molen", "de": "die Windmühle", "ex": "De molen staat aan het water.", "exDe": "Die Mühle steht am Wasser."}, {"id": "my3_polder", "nl": "de polder", "de": "der Polder", "ex": "De polder ligt onder de zeespiegel.", "exDe": "Der Polder liegt unter dem Meeresspiegel."}, {"id": "my3_zee", "nl": "de zee", "de": "das Meer", "ex": "De zee is dichtbij.", "exDe": "Das Meer ist nah."}, {"id": "my3_water", "nl": "het water", "de": "das Wasser", "ex": "Het water gaat weg door de molen.", "exDe": "Das Wasser geht durch die Mühle weg."}, {"id": "my3_grond", "nl": "de grond", "de": "der Boden", "ex": "De grond is hier heel nat.", "exDe": "Der Boden ist hier sehr nass."}, {"id": "my3_droog", "nl": "droog", "de": "trocken", "ex": "Het land is nu droog.", "exDe": "Das Land ist jetzt trocken."}, {"id": "my3_bouwen", "nl": "bouwen", "de": "bauen", "ex": "Ze bouwen een sterke dijk.", "exDe": "Sie bauen einen starken Deich."}], "dialogue": [{"who": "Touristin", "nl": "Waarom staan hier zoveel molens?", "de": "Warum stehen hier so viele Mühlen?"}, {"who": "Führer", "nl": "De molens hebben het water weggepompt.", "de": "Die Mühlen haben das Wasser weggepumpt."}, {"who": "Touristin", "nl": "Dus dit land is nieuw?", "de": "Also ist dieses Land neu?"}, {"who": "Führer", "nl": "Ja, wij hebben het van de zee gemaakt.", "de": "Ja, wir haben es dem Meer abgerungen."}], "speak": [{"nl": "Wij zijn naar Kinderdijk gegaan.", "de": "Wir sind nach Kinderdijk gefahren."}, {"nl": "De molen heeft het water gepompt.", "de": "Die Mühle hat das Wasser gepumpt."}], "culture": {"title": "Land aus dem Meer", "text": "Etwa ein Viertel der Niederlande liegt <b>unter dem Meeresspiegel</b>. Jahrhundertelang pumpten Windmühlen das Wasser aus den Poldern, und Deiche schützen das Land. Die Windmühlen von Kinderdijk gehören heute zum UNESCO-Welterbe."}},
  {"id": "myth_tulpen", "order": 33, "track": "mythen", "icon": "🌷", "title": "Die Tulpenmanie von 1637", "situation": "Als Blumen so teuer wie Häuser waren", "story": "Im 17. Jahrhundert wurden Tulpen zu einem Luxusobjekt. Für eine einzige seltene <b>Zwiebel</b> zahlten manche Menschen so viel wie für ein ganzes Haus! Im Februar 1637 brachen die Preise plötzlich zusammen — es war eine der ersten <i>Spekulationsblasen</i> der Geschichte.", "grammar": "getallen", "vocab": [{"id": "my4_tulp", "nl": "de tulp", "de": "die Tulpe", "ex": "De tulp is een mooie bloem.", "exDe": "Die Tulpe ist eine schöne Blume."}, {"id": "my4_bloem", "nl": "de bloem", "de": "die Blume", "ex": "Ik koop een bloem voor mijn moeder.", "exDe": "Ich kaufe eine Blume für meine Mutter."}, {"id": "my4_bol", "nl": "de bol", "de": "die Blumenzwiebel", "ex": "De bol kost heel veel geld.", "exDe": "Die Zwiebel kostet sehr viel Geld."}, {"id": "my4_geld", "nl": "het geld", "de": "das Geld", "ex": "Hij heeft veel geld.", "exDe": "Er hat viel Geld."}, {"id": "my4_duur", "nl": "duur", "de": "teuer", "ex": "De tulp was heel duur.", "exDe": "Die Tulpe war sehr teuer."}, {"id": "my4_kopen", "nl": "kopen", "de": "kaufen", "ex": "Mensen wilden veel bollen kopen.", "exDe": "Die Leute wollten viele Zwiebeln kaufen."}, {"id": "my4_prijs", "nl": "de prijs", "de": "der Preis", "ex": "De prijs was heel hoog.", "exDe": "Der Preis war sehr hoch."}], "dialogue": [{"who": "Käufer", "nl": "Hoeveel kost deze bol?", "de": "Wie viel kostet diese Zwiebel?"}, {"who": "Verkäufer", "nl": "Duizend gulden, een goede prijs!", "de": "Tausend Gulden, ein guter Preis!"}, {"who": "Käufer", "nl": "Dat is zo veel als een huis!", "de": "Das ist so viel wie ein Haus!"}, {"who": "Verkäufer", "nl": "In 1637 was dat heel normaal.", "de": "1637 war das ganz normal."}], "speak": [{"nl": "De bol kost duizend gulden.", "de": "Die Zwiebel kostet tausend Gulden."}, {"nl": "Ik koop drie tulpen.", "de": "Ich kaufe drei Tulpen."}], "culture": {"title": "Die erste Spekulationsblase", "text": "In den 1630er Jahren wurden Tulpenzwiebeln zu begehrten Luxusobjekten; seltene Zwiebeln kosteten zeitweise so viel wie ein Grachtenhaus. Im <b>Februar 1637</b> brachen die Preise plötzlich zusammen. Die Tulpenmanie gilt als eine der ersten Spekulationsblasen der Geschichte."}},
  {"id": "myth_fietsen", "order": 34, "track": "mythen", "icon": "🚲", "title": "Mehr Fahrräder als Menschen", "situation": "Ein Land auf zwei Rädern", "story": "In den Niederlanden gibt es tatsächlich <b>mehr Fahrräder als Einwohner</b>. Rund 23 Millionen Räder rollen durch ein Land mit etwa 18 Millionen Menschen. Das Fahrrad ist hier kein Sport, sondern der ganz normale Weg zur Arbeit, zur Schule und zum Einkaufen.", "grammar": "meervoud", "vocab": [{"id": "my5_fiets", "nl": "de fiets", "de": "das Fahrrad", "ex": "Ik ga met de fiets.", "exDe": "Ich fahre mit dem Fahrrad."}, {"id": "my5_fietsen", "nl": "fietsen", "de": "Rad fahren", "ex": "Wij fietsen elke dag.", "exDe": "Wir fahren jeden Tag Rad."}, {"id": "my5_wiel", "nl": "het wiel", "de": "das Rad", "ex": "De fiets heeft twee wielen.", "exDe": "Das Fahrrad hat zwei Räder."}, {"id": "my5_weg", "nl": "de weg", "de": "der Weg", "ex": "Op de wegen zijn veel fietsers.", "exDe": "Auf den Wegen sind viele Radfahrer."}, {"id": "my5_fietser", "nl": "de fietser", "de": "der Radfahrer", "ex": "De fietser wacht voor het licht.", "exDe": "Der Radfahrer wartet vor der Ampel."}, {"id": "my5_stad", "nl": "de stad", "de": "die Stadt", "ex": "In de steden staan veel fietsen.", "exDe": "In den Städten stehen viele Fahrräder."}, {"id": "my5_snel", "nl": "snel", "de": "schnell", "ex": "De fiets is snel in de stad.", "exDe": "Das Fahrrad ist schnell in der Stadt."}], "dialogue": [{"who": "Besucher", "nl": "Wat zijn hier veel fietsen!", "de": "Was für viele Fahrräder hier sind!"}, {"who": "Einheimische", "nl": "Ja, wij hebben meer fietsen dan mensen.", "de": "Ja, wir haben mehr Fahrräder als Menschen."}, {"who": "Besucher", "nl": "Heeft iedereen een fiets?", "de": "Hat jeder ein Fahrrad?"}, {"who": "Einheimische", "nl": "De meeste mensen hebben er twee.", "de": "Die meisten Leute haben zwei."}], "speak": [{"nl": "Ik heb twee fietsen.", "de": "Ich habe zwei Fahrräder."}, {"nl": "In de stad staan veel fietsen.", "de": "In der Stadt stehen viele Fahrräder."}], "culture": {"title": "Ein Land auf Rädern", "text": "In den Niederlanden gibt es <b>mehr Fahrräder als Einwohner</b> — etwa 23 Millionen Räder für rund 18 Millionen Menschen. Es gibt ein dichtes Netz aus Radwegen (fietspaden). Für viele Menschen ist das Rad das normale Verkehrsmittel im Alltag."}},
  {"id": "myth_sinterklaas", "order": 35, "track": "mythen", "icon": "🎁", "title": "Sinterklaas", "situation": "Der Ursprung des Weihnachtsmanns", "story": "Mitte November kommt <b>Sinterklaas</b> mit dem Dampfschiff angeblich aus Spanien, und am 5. Dezember bringt er den Kindern Geschenke. Über niederländische Auswanderer kam diese Figur nach Amerika — aus <i>„Sinterklaas\"</i> wurde dort <i>„Santa Claus\"</i>.", "grammar": "graag", "vocab": [{"id": "my6_cadeau", "nl": "het cadeau", "de": "das Geschenk", "ex": "Ik krijg een cadeau.", "exDe": "Ich bekomme ein Geschenk."}, {"id": "my6_pakje", "nl": "het pakje", "de": "das Päckchen", "ex": "Er ligt een pakje voor de deur.", "exDe": "Ein Päckchen liegt vor der Tür."}, {"id": "my6_schoen", "nl": "de schoen", "de": "der Schuh", "ex": "De kinderen zetten hun schoen.", "exDe": "Die Kinder stellen ihren Schuh."}, {"id": "my6_pepernoot", "nl": "de pepernoot", "de": "das Pfeffernüsschen", "ex": "Ik eet graag pepernoten.", "exDe": "Ich esse gern Pfeffernüsschen."}, {"id": "my6_stoomboot", "nl": "de stoomboot", "de": "das Dampfschiff", "ex": "Sinterklaas komt met de stoomboot.", "exDe": "Sinterklaas kommt mit dem Dampfschiff."}, {"id": "my6_vieren", "nl": "vieren", "de": "feiern", "ex": "Wij vieren Sinterklaas.", "exDe": "Wir feiern Sinterklaas."}, {"id": "my6_geven", "nl": "geven", "de": "geben", "ex": "Sinterklaas geeft cadeaus.", "exDe": "Sinterklaas gibt Geschenke."}], "dialogue": [{"who": "Kind", "nl": "Ik vier heel graag Sinterklaas.", "de": "Ich feiere sehr gern Sinterklaas."}, {"who": "Mutter", "nl": "Zet je schoen maar bij de deur.", "de": "Stell doch deinen Schuh an die Tür."}, {"who": "Kind", "nl": "Krijg ik dan een cadeau?", "de": "Bekomme ich dann ein Geschenk?"}, {"who": "Mutter", "nl": "Misschien, als je lief bent.", "de": "Vielleicht, wenn du lieb bist."}], "speak": [{"nl": "Ik eet graag pepernoten.", "de": "Ich esse gern Pfeffernüsschen."}, {"nl": "De kinderen zetten hun schoen.", "de": "Die Kinder stellen ihren Schuh."}], "culture": {"title": "Vom Sinterklaas zum Santa Claus", "text": "Sinterklaas geht auf den <b>Heiligen Nikolaus</b> zurück und wird am 5. Dezember („pakjesavond\") gefeiert. Niederländische Siedler brachten die Figur nach Neu-Amsterdam (New York), wo aus „Sinterklaas\" der „Santa Claus\" wurde. Die traditionelle Begleitfigur „Zwarte Piet\" ist seit Jahren umstritten; vielerorts werden heute Figuren mit Rußflecken („roetveegpiet\") verwendet."}},
  {"id": "myth_gedoog", "order": 36, "track": "mythen", "icon": "⚖️", "title": "Gedoogbeleid & die Toleranz-Politik", "situation": "Nicht erlaubt, aber geduldet", "story": "Viele denken, in den Niederlanden sei einfach alles erlaubt. Tatsächlich ist der Verkauf weicher Drogen offiziell <b>nicht legal</b> — er wird aber unter strengen Bedingungen geduldet. Diese pragmatische Haltung nennt man <i>„gedoogbeleid\"</i>.", "grammar": "modaal", "vocab": [{"id": "my7_regel", "nl": "de regel", "de": "die Regel", "ex": "Er is een duidelijke regel.", "exDe": "Es gibt eine klare Regel."}, {"id": "my7_mogen", "nl": "mogen", "de": "dürfen", "ex": "Kinderen mogen niet naar binnen.", "exDe": "Kinder dürfen nicht hinein."}, {"id": "my7_verboden", "nl": "verboden", "de": "verboten", "ex": "Roken is hier verboden.", "exDe": "Rauchen ist hier verboten."}, {"id": "my7_toestaan", "nl": "toestaan", "de": "erlauben, dulden", "ex": "De stad staat het onder regels toe.", "exDe": "Die Stadt duldet es unter Regeln."}, {"id": "my7_coffeeshop", "nl": "de coffeeshop", "de": "der Coffeeshop", "ex": "De coffeeshop is in het centrum.", "exDe": "Der Coffeeshop ist im Zentrum."}, {"id": "my7_volwassen", "nl": "volwassen", "de": "erwachsen", "ex": "Alleen volwassen mensen mogen naar binnen.", "exDe": "Nur erwachsene Menschen dürfen hinein."}, {"id": "my7_streng", "nl": "streng", "de": "streng", "ex": "De regels zijn heel streng.", "exDe": "Die Regeln sind sehr streng."}], "dialogue": [{"who": "Tourist", "nl": "Mag alles hier zomaar?", "de": "Ist hier alles einfach erlaubt?"}, {"who": "Einheimischer", "nl": "Nee, er zijn strenge regels.", "de": "Nein, es gibt strenge Regeln."}, {"who": "Tourist", "nl": "Maar het is toch niet verboden?", "de": "Aber es ist doch nicht verboten?"}, {"who": "Einheimischer", "nl": "De overheid staat het onder voorwaarden toe.", "de": "Der Staat duldet es unter Bedingungen."}], "speak": [{"nl": "Kinderen mogen niet naar binnen.", "de": "Kinder dürfen nicht hinein."}, {"nl": "De regels zijn hier heel streng.", "de": "Die Regeln sind hier sehr streng."}], "culture": {"title": "Gedoogbeleid — die Duldung", "text": "In den Niederlanden ist der Verkauf weicher Drogen in lizenzierten Coffeeshops offiziell <b>nicht legal</b>, wird aber unter strengen Bedingungen geduldet („gedoogd\"). Diese Politik der pragmatischen Duldung heißt „gedoogbeleid\". Es gelten Altersgrenzen und feste Regeln."}},
  {"id": "myth_kaas", "order": 37, "track": "mythen", "icon": "🧀", "title": "„Kaaskoppen\" & die Käsekultur", "situation": "Warum die Niederländer Käseköpfe heißen", "story": "Spöttisch werden die Niederländer manchmal <b>„kaaskoppen\"</b> (Käseköpfe) genannt. Eine Erklärung sagt, dass Bauern früher Käseformen als Kopfschutz getragen hätten. Sicher ist: Käse wie <i>Gouda</i> und <i>Edam</i> sind weltberühmt.", "grammar": "bijvoeglijk", "vocab": [{"id": "my8_kaas", "nl": "de kaas", "de": "der Käse", "ex": "Ik eet graag oude kaas.", "exDe": "Ich esse gern alten Käse."}, {"id": "my8_oud", "nl": "oud", "de": "alt", "ex": "Oude kaas is sterk van smaak.", "exDe": "Alter Käse ist kräftig im Geschmack."}, {"id": "my8_jong", "nl": "jong", "de": "jung, mild", "ex": "Jonge kaas is zacht.", "exDe": "Junger Käse ist mild."}, {"id": "my8_markt", "nl": "de markt", "de": "der Markt", "ex": "De kaasmarkt is in Alkmaar.", "exDe": "Der Käsemarkt ist in Alkmaar."}, {"id": "my8_lekker", "nl": "lekker", "de": "lecker", "ex": "Deze kaas is heel lekker.", "exDe": "Dieser Käse ist sehr lecker."}, {"id": "my8_geel", "nl": "geel", "de": "gelb", "ex": "De gele kaas ligt op tafel.", "exDe": "Der gelbe Käse liegt auf dem Tisch."}, {"id": "my8_stuk", "nl": "het stuk", "de": "das Stück", "ex": "Ik neem een stuk kaas.", "exDe": "Ich nehme ein Stück Käse."}], "dialogue": [{"who": "Käufer", "nl": "Ik zoek een lekkere kaas.", "de": "Ich suche einen leckeren Käse."}, {"who": "Verkäufer", "nl": "Houdt u van jonge of oude kaas?", "de": "Mögen Sie jungen oder alten Käse?"}, {"who": "Käufer", "nl": "Een oude kaas, alstublieft.", "de": "Einen alten Käse, bitte."}, {"who": "Verkäufer", "nl": "Deze gele kaas uit Gouda is heerlijk.", "de": "Dieser gelbe Käse aus Gouda ist köstlich."}], "speak": [{"nl": "Ik wil een stuk oude kaas.", "de": "Ich möchte ein Stück alten Käse."}, {"nl": "De jonge kaas is heel zacht.", "de": "Der junge Käse ist sehr mild."}], "culture": {"title": "Das Land der Kaaskoppen", "text": "Die Niederländer werden scherzhaft <b>„kaaskoppen\"</b> (Käseköpfe) genannt. Eine Erklärung besagt, Bauern hätten früher Käseformen als Kopfschutz getragen. Käsesorten wie Gouda und Edam sind weltbekannt; historische Käsemärkte gibt es in Alkmaar, Gouda und Edam."}},
  {"id": "myth_uitwaaien", "order": 38, "track": "mythen", "icon": "🌧️", "title": "Regen, Wind & „uitwaaien\"", "situation": "Sich vom Wind durchpusten lassen", "story": "Das Wetter in den Niederlanden ist oft grau, nass und windig. Doch dafür gibt es ein schönes Wort: <b>„uitwaaien\"</b>. Man geht bewusst nach draußen, meist ans Meer, um sich vom Wind den Kopf freipusten zu lassen.", "grammar": "woordvolgorde", "vocab": [{"id": "my9_weer", "nl": "het weer", "de": "das Wetter", "ex": "Het weer is vandaag slecht.", "exDe": "Das Wetter ist heute schlecht."}, {"id": "my9_regen", "nl": "de regen", "de": "der Regen", "ex": "Er komt veel regen.", "exDe": "Es kommt viel Regen."}, {"id": "my9_wind", "nl": "de wind", "de": "der Wind", "ex": "De wind is hard vandaag.", "exDe": "Der Wind ist heute stark."}, {"id": "my9_uitwaaien", "nl": "uitwaaien", "de": "sich auspusten lassen", "ex": "Wij gaan aan zee uitwaaien.", "exDe": "Wir gehen am Meer frische Luft schnappen."}, {"id": "my9_paraplu", "nl": "de paraplu", "de": "der Regenschirm", "ex": "Neem je paraplu mee.", "exDe": "Nimm deinen Regenschirm mit."}, {"id": "my9_koud", "nl": "koud", "de": "kalt", "ex": "Het is koud en nat.", "exDe": "Es ist kalt und nass."}, {"id": "my9_strand", "nl": "het strand", "de": "der Strand", "ex": "Wij lopen op het strand.", "exDe": "Wir laufen am Strand."}], "dialogue": [{"who": "Freund", "nl": "Vandaag gaan we naar het strand.", "de": "Heute gehen wir zum Strand."}, {"who": "Freundin", "nl": "Maar het waait heel hard!", "de": "Aber es weht sehr stark!"}, {"who": "Freund", "nl": "Daarom gaan we juist uitwaaien.", "de": "Gerade deshalb gehen wir frische Luft schnappen."}, {"who": "Freundin", "nl": "Goed, ik neem mijn jas mee.", "de": "Gut, ich nehme meine Jacke mit."}], "speak": [{"nl": "Morgen gaan wij uitwaaien aan zee.", "de": "Morgen gehen wir am Meer frische Luft schnappen."}, {"nl": "Vandaag is het weer slecht.", "de": "Heute ist das Wetter schlecht."}], "culture": {"title": "Uitwaaien — sich auspusten lassen", "text": "<b>„Uitwaaien\"</b> beschreibt eine typisch niederländische Gewohnheit: Man geht hinaus in den Wind, oft ans Meer, um den Kopf freizubekommen und sich zu erholen. Das Wetter ist in den Niederlanden häufig windig und regnerisch, denn das Land liegt direkt an der Nordsee."}},
  {"id": "myth_koningsdag", "order": 39, "track": "mythen", "icon": "👑", "title": "Koningsdag & der Flohmarkt", "situation": "Ein ganzes Land in Orange", "story": "Am 27. April feiert das Land <b>Koningsdag</b>, den Geburtstag des Königs. Alle tragen Orange, und überall wird gefeiert. Das Besondere: An diesem Tag darf jeder auf der Straße gebrauchte Sachen verkaufen — der landesweite <i>„vrijmarkt\"</i>.", "grammar": "toekomst", "vocab": [{"id": "my10_feest", "nl": "het feest", "de": "das Fest", "ex": "Morgen is er een groot feest.", "exDe": "Morgen gibt es ein großes Fest."}, {"id": "my10_verjaardag", "nl": "de verjaardag", "de": "der Geburtstag", "ex": "Het is de verjaardag van de koning.", "exDe": "Es ist der Geburtstag des Königs."}, {"id": "my10_vrijmarkt", "nl": "de vrijmarkt", "de": "der Flohmarkt", "ex": "Op de vrijmarkt verkopen we spullen.", "exDe": "Auf dem Flohmarkt verkaufen wir Sachen."}, {"id": "my10_verkopen", "nl": "verkopen", "de": "verkaufen", "ex": "Ik ga mijn oude spullen verkopen.", "exDe": "Ich werde meine alten Sachen verkaufen."}, {"id": "my10_spullen", "nl": "de spullen", "de": "die Sachen", "ex": "Wij leggen onze spullen op een kleed.", "exDe": "Wir legen unsere Sachen auf eine Decke."}, {"id": "my10_straat", "nl": "de straat", "de": "die Straße", "ex": "De hele straat is oranje.", "exDe": "Die ganze Straße ist orange."}, {"id": "my10_muziek", "nl": "de muziek", "de": "die Musik", "ex": "Overal is muziek en feest.", "exDe": "Überall ist Musik und Fest."}], "dialogue": [{"who": "Nachbar", "nl": "Wat ga je op Koningsdag doen?", "de": "Was wirst du am Königstag machen?"}, {"who": "Nachbarin", "nl": "Ik ga mijn oude spullen verkopen.", "de": "Ich werde meine alten Sachen verkaufen."}, {"who": "Nachbar", "nl": "Op de vrijmarkt in de stad?", "de": "Auf dem Flohmarkt in der Stadt?"}, {"who": "Nachbarin", "nl": "Ja, en daarna gaan we feesten.", "de": "Ja, und danach werden wir feiern."}], "speak": [{"nl": "Morgen gaan wij naar de vrijmarkt.", "de": "Morgen gehen wir zum Flohmarkt."}, {"nl": "Ik zal veel spullen verkopen.", "de": "Ich werde viele Sachen verkaufen."}], "culture": {"title": "Koningsdag — das Oranje-Fest", "text": "<b>Koningsdag</b> wird am 27. April gefeiert, dem Geburtstag von König Willem-Alexander. Das ganze Land kleidet sich in Orange und feiert. Besonders ist der „vrijmarkt\": An diesem Tag darf jeder ohne Genehmigung oder Steuer gebrauchte Sachen auf der Straße verkaufen."}},
  {"id": "ade_watis", "order": 40, "track": "ade", "icon": "🎧", "title": "Was ist das ADE?", "situation": "Das größte Dance-Event der Welt", "story": "Jeden <b>Oktober</b> verwandelt sich Amsterdam in die Hauptstadt der elektronischen Musik. Das <i>Amsterdam Dance Event</i>, kurz ADE, ist das größte Clubfestival und die wichtigste Konferenz für Dance-Musik der Welt. Fünf Tage lang spielen DJs in der ganzen Stadt.", "grammar": "presens", "vocab": [{"id": "ad1_feest", "nl": "het feest", "de": "das Fest / die Party", "ex": "Het feest begint vanavond.", "exDe": "Die Party beginnt heute Abend."}, {"id": "ad1_muziek", "nl": "de muziek", "de": "die Musik", "ex": "Ik hou van elektronische muziek.", "exDe": "Ich mag elektronische Musik."}, {"id": "ad1_stad", "nl": "de stad", "de": "die Stadt", "ex": "Amsterdam is een mooie stad.", "exDe": "Amsterdam ist eine schöne Stadt."}, {"id": "ad1_dansen", "nl": "dansen", "de": "tanzen", "ex": "Wij dansen de hele nacht.", "exDe": "Wir tanzen die ganze Nacht."}, {"id": "ad1_oktober", "nl": "oktober", "de": "Oktober", "ex": "Het ADE is in oktober.", "exDe": "Das ADE ist im Oktober."}, {"id": "ad1_groot", "nl": "groot", "de": "groß", "ex": "Het festival is heel groot.", "exDe": "Das Festival ist sehr groß."}, {"id": "ad1_wereld", "nl": "de wereld", "de": "die Welt", "ex": "Het is het grootste feest van de wereld.", "exDe": "Es ist die größte Party der Welt."}], "dialogue": [{"who": "Freund", "nl": "Weet jij wat het ADE is?", "de": "Weißt du, was das ADE ist?"}, {"who": "Freundin", "nl": "Ja, het is een groot dansfeest in Amsterdam.", "de": "Ja, es ist ein großes Tanzfest in Amsterdam."}, {"who": "Freund", "nl": "Wanneer is het precies?", "de": "Wann ist es genau?"}, {"who": "Freundin", "nl": "Elk jaar in oktober.", "de": "Jedes Jahr im Oktober."}], "speak": [{"nl": "Het ADE is in Amsterdam.", "de": "Das ADE ist in Amsterdam."}, {"nl": "Ik hou van muziek.", "de": "Ich mag Musik."}], "culture": {"title": "Fünf Tage Musik", "text": "Das <b>Amsterdam Dance Event</b> findet jedes Jahr im Oktober statt und dauert fünf Tage. In dieser Zeit gibt es hunderte Events an über hundert Orten in der ganzen Stadt."}},
  {"id": "ade_begin", "order": 41, "track": "ade", "icon": "💡", "title": "Die Anfänge & Idee", "situation": "Eine Konferenz für die Branche", "story": "Das ADE begann <b>1996</b> als kleine Konferenz für die Dance-Industrie. Die Idee war einfach: Menschen aus der Musikbranche sollten sich treffen und Geschäfte machen. Aus dem kleinen Treffen wurde bald ein riesiges Event.", "grammar": "perfectum", "vocab": [{"id": "ad2_idee", "nl": "het idee", "de": "die Idee", "ex": "Dat is een goed idee.", "exDe": "Das ist eine gute Idee."}, {"id": "ad2_beginnen", "nl": "beginnen", "de": "beginnen / anfangen", "ex": "Het ADE is klein begonnen.", "exDe": "Das ADE hat klein angefangen."}, {"id": "ad2_klein", "nl": "klein", "de": "klein", "ex": "Vroeger was het feest klein.", "exDe": "Früher war das Fest klein."}, {"id": "ad2_werk", "nl": "het werk", "de": "die Arbeit", "ex": "Muziek is zijn werk.", "exDe": "Musik ist seine Arbeit."}, {"id": "ad2_ontmoeten", "nl": "ontmoeten", "de": "treffen", "ex": "Wij ontmoeten veel mensen.", "exDe": "Wir treffen viele Menschen."}, {"id": "ad2_jaar", "nl": "het jaar", "de": "das Jahr", "ex": "Het ADE begon in het jaar 1996.", "exDe": "Das ADE begann im Jahr 1996."}], "dialogue": [{"who": "Student", "nl": "Wanneer is het ADE begonnen?", "de": "Wann hat das ADE angefangen?"}, {"who": "Lehrerin", "nl": "In 1996, als een kleine conferentie.", "de": "1996, als eine kleine Konferenz."}, {"who": "Student", "nl": "Waarom is het begonnen?", "de": "Warum hat es angefangen?"}, {"who": "Lehrerin", "nl": "Mensen uit de muziek wilden elkaar ontmoeten.", "de": "Menschen aus der Musik wollten sich treffen."}], "speak": [{"nl": "Het is klein begonnen.", "de": "Es hat klein angefangen."}, {"nl": "Ik heb veel mensen ontmoet.", "de": "Ich habe viele Menschen getroffen."}], "culture": {"title": "Von der Konferenz zum Festival", "text": "Das ADE startete <b>1996</b> vor allem als Fachkonferenz für die Dance-Branche. Der Businessteil ist bis heute ein wichtiger Kern des Events, auch wenn heute die Partys bekannter sind."}},
  {"id": "ade_conference", "order": 42, "track": "ade", "icon": "🏢", "title": "Conference vs. Festival", "situation": "Tagsüber Business, nachts feiern", "story": "Das ADE hat zwei Gesichter. <b>Tagsüber</b> gibt es die Conference mit Workshops und Vorträgen für die Branche. <b>Nachts</b> wird die ganze Stadt zur Tanzfläche. So treffen sich Arbeit und Party.", "grammar": "woordvolgorde", "vocab": [{"id": "ad3_dag", "nl": "de dag", "de": "der Tag", "ex": "Overdag zijn er lezingen.", "exDe": "Tagsüber gibt es Vorträge."}, {"id": "ad3_nacht", "nl": "de nacht", "de": "die Nacht", "ex": "In de nacht dansen we.", "exDe": "In der Nacht tanzen wir."}, {"id": "ad3_leren", "nl": "leren", "de": "lernen", "ex": "Overdag leer je veel.", "exDe": "Tagsüber lernst du viel."}, {"id": "ad3_praten", "nl": "praten", "de": "reden / sprechen", "ex": "De dj's praten over muziek.", "exDe": "Die DJs reden über Musik."}, {"id": "ad3_samen", "nl": "samen", "de": "zusammen", "ex": "Wij gaan samen naar het feest.", "exDe": "Wir gehen zusammen zur Party."}, {"id": "ad3_avond", "nl": "de avond", "de": "der Abend", "ex": "In de avond begint de show.", "exDe": "Am Abend beginnt die Show."}, {"id": "ad3_moe", "nl": "moe", "de": "müde", "ex": "Na de nacht ben ik moe.", "exDe": "Nach der Nacht bin ich müde."}], "dialogue": [{"who": "Freund", "nl": "Wat doe je overdag op het ADE?", "de": "Was machst du tagsüber beim ADE?"}, {"who": "Freundin", "nl": "Overdag ga ik naar de lezingen.", "de": "Tagsüber gehe ich zu den Vorträgen."}, {"who": "Freund", "nl": "En 's nachts?", "de": "Und nachts?"}, {"who": "Freundin", "nl": "'s Nachts dans ik in de clubs.", "de": "Nachts tanze ich in den Clubs."}], "speak": [{"nl": "Overdag leer ik veel.", "de": "Tagsüber lerne ich viel."}, {"nl": "'s Nachts dansen we samen.", "de": "Nachts tanzen wir zusammen."}], "culture": {"title": "Zwei Programme in einem", "text": "Das ADE teilt sich in das <b>ADE Conference</b>-Programm am Tag und das <b>Festival</b> in der Nacht. Fachleute besuchen Panels und Networking-Events, während abends die Clubs und Konzerthallen öffnen."}},
  {"id": "ade_hoofdstad", "order": 43, "track": "ade", "icon": "🌍", "title": "Welthauptstadt der Musik", "situation": "Amsterdam und elektronische Musik", "story": "Warum gerade Amsterdam? Die Stadt hat viele Clubs, gute Verbindungen und eine offene Kultur. Für eine Woche gilt Amsterdam als die <b>Welthauptstadt</b> der elektronischen Musik. DJs aus aller Welt kommen hierher.", "grammar": "dehet", "vocab": [{"id": "ad4_hoofdstad", "nl": "de hoofdstad", "de": "die Hauptstadt", "ex": "Amsterdam is de hoofdstad.", "exDe": "Amsterdam ist die Hauptstadt."}, {"id": "ad4_land", "nl": "het land", "de": "das Land", "ex": "Nederland is een klein land.", "exDe": "Die Niederlande ist ein kleines Land."}, {"id": "ad4_club", "nl": "de club", "de": "der Club", "ex": "De club is heel bekend.", "exDe": "Der Club ist sehr bekannt."}, {"id": "ad4_open", "nl": "open", "de": "offen / geöffnet", "ex": "De stad is heel open.", "exDe": "Die Stadt ist sehr offen."}, {"id": "ad4_komen", "nl": "komen", "de": "kommen", "ex": "Veel dj's komen naar Amsterdam.", "exDe": "Viele DJs kommen nach Amsterdam."}, {"id": "ad4_beroemd", "nl": "beroemd", "de": "berühmt", "ex": "De stad is beroemd om muziek.", "exDe": "Die Stadt ist berühmt für Musik."}], "dialogue": [{"who": "Tourist", "nl": "Waarom is Amsterdam zo bekend?", "de": "Warum ist Amsterdam so bekannt?"}, {"who": "Einheimischer", "nl": "De stad heeft veel goede clubs.", "de": "Die Stadt hat viele gute Clubs."}, {"who": "Tourist", "nl": "Komen er dj's uit de hele wereld?", "de": "Kommen DJs aus der ganzen Welt?"}, {"who": "Einheimischer", "nl": "Ja, Amsterdam is de hoofdstad van de dance.", "de": "Ja, Amsterdam ist die Hauptstadt der Dance-Musik."}], "speak": [{"nl": "De stad is beroemd.", "de": "Die Stadt ist berühmt."}, {"nl": "Het land is klein.", "de": "Das Land ist klein."}], "culture": {"title": "Warum Amsterdam?", "text": "Amsterdam hat eine lange Clubtradition und eine dichte Szene aus Labels, Studios und Veranstaltern. Während des ADE gilt die Stadt als <b>Zentrum der elektronischen Musik</b> und zieht Besucher aus über hundert Ländern an."}},
  {"id": "ade_tiesto", "order": 44, "track": "ade", "icon": "⭐", "title": "Tiësto & Dutch Trance", "situation": "Der Aufstieg eines Superstars", "story": "<b>Tiësto</b> ist einer der bekanntesten DJs der Welt. In den frühen 2000er Jahren machte er den <i>Dutch Trance</i> berühmt. Er spielte auf riesigen Bühnen und wurde zum Vorbild für viele junge DJs aus den Niederlanden.", "grammar": "toekomst", "vocab": [{"id": "ad5_beroemd", "nl": "beroemd", "de": "berühmt", "ex": "Tiësto is heel beroemd.", "exDe": "Tiësto ist sehr berühmt."}, {"id": "ad5_optreden", "nl": "het optreden", "de": "der Auftritt", "ex": "Zijn optreden is vanavond.", "exDe": "Sein Auftritt ist heute Abend."}, {"id": "ad5_podium", "nl": "het podium", "de": "die Bühne", "ex": "De dj staat op het podium.", "exDe": "Der DJ steht auf der Bühne."}, {"id": "ad5_snel", "nl": "snel", "de": "schnell", "ex": "De muziek is heel snel.", "exDe": "Die Musik ist sehr schnell."}, {"id": "ad5_luisteren", "nl": "luisteren", "de": "hören / zuhören", "ex": "Ik luister naar trance.", "exDe": "Ich höre Trance."}, {"id": "ad5_ster", "nl": "de ster", "de": "der Star", "ex": "Hij is een grote ster.", "exDe": "Er ist ein großer Star."}, {"id": "ad5_beginnen", "nl": "starten", "de": "starten / anfangen", "ex": "De show start om tien uur.", "exDe": "Die Show startet um zehn Uhr."}], "dialogue": [{"who": "Fan", "nl": "Ga je Tiësto zien op het ADE?", "de": "Gehst du Tiësto beim ADE sehen?"}, {"who": "Freund", "nl": "Ja, ik zal naar zijn optreden gaan.", "de": "Ja, ich werde zu seinem Auftritt gehen."}, {"who": "Fan", "nl": "Hij is echt een grote ster.", "de": "Er ist wirklich ein großer Star."}, {"who": "Freund", "nl": "Zeker! Het wordt een geweldige avond.", "de": "Klar! Es wird ein toller Abend."}], "speak": [{"nl": "Ik zal naar het optreden gaan.", "de": "Ich werde zum Auftritt gehen."}, {"nl": "Hij is een grote ster.", "de": "Er ist ein großer Star."}], "culture": {"title": "Ein DJ als Weltstar", "text": "Tiësto stammt aus <b>Breda</b> und half, den melodischen Dutch Trance weltweit populär zu machen. Er war einer der ersten DJs, der Stadien und riesige Arenen füllte."}},
  {"id": "ade_armin", "order": 45, "track": "ade", "icon": "📻", "title": "Armin van Buuren", "situation": "„A State of Trance\"", "story": "<b>Armin van Buuren</b> ist ein weiterer berühmter Trance-DJ aus den Niederlanden. Seine Radiosendung <i>A State of Trance</i> hört man in vielen Ländern. Fünfmal wurde er zur Nummer eins der Welt gewählt.", "grammar": "bezit", "vocab": [{"id": "ad6_radio", "nl": "de radio", "de": "das Radio", "ex": "Ik hoor hem op de radio.", "exDe": "Ich höre ihn im Radio."}, {"id": "ad6_show", "nl": "de show", "de": "die Show / Sendung", "ex": "Zijn show is heel bekend.", "exDe": "Seine Sendung ist sehr bekannt."}, {"id": "ad6_uur", "nl": "het uur", "de": "die Stunde", "ex": "De show duurt een uur.", "exDe": "Die Sendung dauert eine Stunde."}, {"id": "ad6_favoriet", "nl": "favoriet", "de": "Lieblings- / favorit", "ex": "Armin is mijn favoriete dj.", "exDe": "Armin ist mein Lieblings-DJ."}, {"id": "ad6_nummer", "nl": "het nummer", "de": "der Song / die Nummer", "ex": "Dit nummer is nieuw.", "exDe": "Dieser Song ist neu."}, {"id": "ad6_horen", "nl": "horen", "de": "hören", "ex": "Ik hoor zijn show elke week.", "exDe": "Ich höre seine Sendung jede Woche."}], "dialogue": [{"who": "Freundin", "nl": "Ken jij A State of Trance?", "de": "Kennst du A State of Trance?"}, {"who": "Freund", "nl": "Ja, dat is de show van Armin.", "de": "Ja, das ist die Sendung von Armin."}, {"who": "Freundin", "nl": "Ik hoor zijn muziek elke week.", "de": "Ich höre seine Musik jede Woche."}, {"who": "Freund", "nl": "Het is ook mijn favoriete show.", "de": "Es ist auch meine Lieblingssendung."}], "speak": [{"nl": "Dat is mijn favoriete dj.", "de": "Das ist mein Lieblings-DJ."}, {"nl": "Ik hoor zijn show op de radio.", "de": "Ich höre seine Sendung im Radio."}], "culture": {"title": "Trance im Radio", "text": "Armin van Buuren aus <b>Leiden</b> moderiert die Radioshow <b>A State of Trance</b>, die seit 2001 läuft und Millionen Hörer weltweit erreicht. Er wurde mehrfach zum weltbesten DJ gewählt."}},
  {"id": "ade_dutchhouse", "order": 46, "track": "ade", "icon": "🔊", "title": "Der Dutch-House-Sound", "situation": "Afrojack, Hardwell & Sidney Samson", "story": "Um 2010 entstand ein neuer Sound: der <b>Dutch House</b>. DJs wie <i>Afrojack</i>, <i>Hardwell</i> und <i>Sidney Samson</i> machten ihn weltweit bekannt. Der Sound ist hart, laut und perfekt für große Festivals.", "grammar": "meervoud", "vocab": [{"id": "ad7_geluid", "nl": "het geluid", "de": "der Sound / Klang", "ex": "Het geluid is heel hard.", "exDe": "Der Sound ist sehr hart."}, {"id": "ad7_dj", "nl": "de dj's", "de": "die DJs", "ex": "Er zijn veel Nederlandse dj's.", "exDe": "Es gibt viele niederländische DJs."}, {"id": "ad7_hard", "nl": "hard", "de": "hart / laut", "ex": "De muziek is heel hard.", "exDe": "Die Musik ist sehr laut."}, {"id": "ad7_maken", "nl": "maken", "de": "machen", "ex": "Zij maken nieuwe muziek.", "exDe": "Sie machen neue Musik."}, {"id": "ad7_liedjes", "nl": "de liedjes", "de": "die Lieder", "ex": "Ik ken zijn liedjes.", "exDe": "Ich kenne seine Lieder."}, {"id": "ad7_nieuw", "nl": "nieuw", "de": "neu", "ex": "Dit is een nieuwe stijl.", "exDe": "Das ist ein neuer Stil."}, {"id": "ad7_stijl", "nl": "de stijl", "de": "der Stil", "ex": "De Dutch House is een stijl.", "exDe": "Der Dutch House ist ein Stil."}], "dialogue": [{"who": "Freund", "nl": "Ken jij Afrojack en Hardwell?", "de": "Kennst du Afrojack und Hardwell?"}, {"who": "Freundin", "nl": "Ja, dat zijn Nederlandse dj's.", "de": "Ja, das sind niederländische DJs."}, {"who": "Freund", "nl": "Hun geluid is heel hard.", "de": "Ihr Sound ist sehr hart."}, {"who": "Freundin", "nl": "Ik hou van hun liedjes.", "de": "Ich mag ihre Lieder."}], "speak": [{"nl": "Er zijn veel dj's.", "de": "Es gibt viele DJs."}, {"nl": "Ik ken hun liedjes.", "de": "Ich kenne ihre Lieder."}], "culture": {"title": "Ein Sound erobert die Welt", "text": "Der <b>Dutch House</b> prägte um 2010 die großen Festivalbühnen weltweit. Produzenten wie Afrojack, Hardwell und Sidney Samson (mit dem Hit „Riverside\") machten den harten, energischen Sound international bekannt."}},
  {"id": "ade_venues", "order": 47, "track": "ade", "icon": "🏛️", "title": "Legendäre Venues", "situation": "Paradiso, Melkweg & De Marktkantine", "story": "Amsterdam hat viele berühmte Clubs. Das <b>Paradiso</b> ist eine alte Kirche, in der heute Konzerte stattfinden. Auch das <i>Melkweg</i> und <i>De Marktkantine</i> sind wichtige Orte für Musik und Tanz beim ADE.", "grammar": "bijvoeglijk", "vocab": [{"id": "ad8_kerk", "nl": "de kerk", "de": "die Kirche", "ex": "Paradiso is een oude kerk.", "exDe": "Paradiso ist eine alte Kirche."}, {"id": "ad8_zaal", "nl": "de zaal", "de": "der Saal", "ex": "De zaal is groot en mooi.", "exDe": "Der Saal ist groß und schön."}, {"id": "ad8_oud", "nl": "oud", "de": "alt", "ex": "Het gebouw is heel oud.", "exDe": "Das Gebäude ist sehr alt."}, {"id": "ad8_plek", "nl": "de plek", "de": "der Ort", "ex": "Dit is een bekende plek.", "exDe": "Das ist ein bekannter Ort."}, {"id": "ad8_gebouw", "nl": "het gebouw", "de": "das Gebäude", "ex": "Het gebouw is mooi.", "exDe": "Das Gebäude ist schön."}, {"id": "ad8_bekend", "nl": "bekend", "de": "bekannt", "ex": "Melkweg is een bekende club.", "exDe": "Melkweg ist ein bekannter Club."}], "dialogue": [{"who": "Tourist", "nl": "Wat is het Paradiso?", "de": "Was ist das Paradiso?"}, {"who": "Einheimische", "nl": "Het is een oude kerk met concerten.", "de": "Es ist eine alte Kirche mit Konzerten."}, {"who": "Tourist", "nl": "Zijn er meer bekende plekken?", "de": "Gibt es mehr bekannte Orte?"}, {"who": "Einheimische", "nl": "Ja, de Melkweg en De Marktkantine.", "de": "Ja, das Melkweg und De Marktkantine."}], "speak": [{"nl": "Het is een oude kerk.", "de": "Es ist eine alte Kirche."}, {"nl": "Dit is een bekende plek.", "de": "Das ist ein bekannter Ort."}], "culture": {"title": "Musik in alten Mauern", "text": "Das <b>Paradiso</b> ist eine ehemalige Kirche aus dem 19. Jahrhundert und heute einer der berühmtesten Konzertorte Amsterdams. Auch das <b>Melkweg</b> gehört zu den wichtigen Bühnen des ADE."}},
  {"id": "ade_top100", "order": 48, "track": "ade", "icon": "🏆", "title": "DJ Mag Top 100", "situation": "Die niederländische Dominanz", "story": "Jedes Jahr wählt das Magazin <b>DJ Mag</b> die hundert besten DJs der Welt. Erstaunlich oft stehen <i>Niederländer</i> ganz oben auf der Liste. Für ein kleines Land ist das ein großer Erfolg.", "grammar": "getallen", "vocab": [{"id": "ad9_lijst", "nl": "de lijst", "de": "die Liste", "ex": "Hij staat op de lijst.", "exDe": "Er steht auf der Liste."}, {"id": "ad9_beste", "nl": "de beste", "de": "der Beste", "ex": "Zij is de beste dj.", "exDe": "Sie ist die beste DJane."}, {"id": "ad9_honderd", "nl": "honderd", "de": "hundert", "ex": "Er zijn honderd dj's.", "exDe": "Es gibt hundert DJs."}, {"id": "ad9_stemmen", "nl": "stemmen", "de": "abstimmen / wählen", "ex": "Mensen stemmen op hun dj.", "exDe": "Menschen stimmen für ihren DJ."}, {"id": "ad9_eerste", "nl": "eerste", "de": "erster", "ex": "Hij is de eerste op de lijst.", "exDe": "Er ist der Erste auf der Liste."}, {"id": "ad9_winnen", "nl": "winnen", "de": "gewinnen", "ex": "Wie gaat er winnen?", "exDe": "Wer wird gewinnen?"}], "dialogue": [{"who": "Freund", "nl": "Wie is nummer een op de lijst?", "de": "Wer ist Nummer eins auf der Liste?"}, {"who": "Freundin", "nl": "Vaak een Nederlandse dj.", "de": "Oft ein niederländischer DJ."}, {"who": "Freund", "nl": "Hoeveel dj's staan op de lijst?", "de": "Wie viele DJs stehen auf der Liste?"}, {"who": "Freundin", "nl": "Honderd dj's, elk jaar.", "de": "Hundert DJs, jedes Jahr."}], "speak": [{"nl": "Er zijn honderd dj's.", "de": "Es gibt hundert DJs."}, {"nl": "Hij is de eerste op de lijst.", "de": "Er ist der Erste auf der Liste."}], "culture": {"title": "Ein kleines Land ganz oben", "text": "Die <b>DJ Mag Top 100</b> ist eine jährliche Publikumsabstimmung über die populärsten DJs der Welt. Niederländische DJs wie Armin van Buuren, Tiësto, Hardwell und Martin Garrix belegten dort immer wieder Spitzenplätze."}},
  {"id": "ade_vandaag", "order": 49, "track": "ade", "icon": "🎉", "title": "Das ADE heute", "situation": "Hunderttausende Besucher", "story": "Heute ist das ADE das <b>größte Clubfestival der Welt</b>. Jedes Jahr kommen hunderttausende Menschen aus vielen Ländern nach Amsterdam. Ich finde, es ist ein wunderbares Fest für die Musik.", "grammar": "mening", "vocab": [{"id": "ad10_bezoeker", "nl": "de bezoeker", "de": "der Besucher", "ex": "Er zijn veel bezoekers.", "exDe": "Es gibt viele Besucher."}, {"id": "ad10_druk", "nl": "druk", "de": "voll / los", "ex": "Het is heel druk in de stad.", "exDe": "Es ist sehr voll in der Stadt."}, {"id": "ad10_leuk", "nl": "leuk", "de": "schön / nett", "ex": "Ik vind het feest leuk.", "exDe": "Ich finde das Fest schön."}, {"id": "ad10_denken", "nl": "denken", "de": "denken / finden", "ex": "Ik denk dat het geweldig is.", "exDe": "Ich denke, dass es toll ist."}, {"id": "ad10_vinden", "nl": "vinden", "de": "finden (meinen)", "ex": "Wij vinden de muziek mooi.", "exDe": "Wir finden die Musik schön."}, {"id": "ad10_geweldig", "nl": "geweldig", "de": "großartig", "ex": "Het ADE is geweldig.", "exDe": "Das ADE ist großartig."}, {"id": "ad10_veel", "nl": "veel", "de": "viel(e)", "ex": "Er komen veel mensen.", "exDe": "Es kommen viele Menschen."}], "dialogue": [{"who": "Freundin", "nl": "Wat vind jij van het ADE?", "de": "Was findest du vom ADE?"}, {"who": "Freund", "nl": "Ik vind het geweldig!", "de": "Ich finde es großartig!"}, {"who": "Freundin", "nl": "Het is wel heel druk.", "de": "Es ist aber sehr voll."}, {"who": "Freund", "nl": "Ja, maar dat vind ik juist leuk.", "de": "Ja, aber genau das finde ich schön."}], "speak": [{"nl": "Ik vind het geweldig.", "de": "Ich finde es großartig."}, {"nl": "Er komen veel bezoekers.", "de": "Es kommen viele Besucher."}], "culture": {"title": "Das größte Clubfestival der Welt", "text": "Heute gilt das ADE als das <b>größte Clubfestival der Welt</b> und zieht jedes Jahr mehrere hunderttausend Besucher aus über hundert Ländern an. Hunderte DJs treten an fünf Tagen in der ganzen Stadt auf."}},
  {"id": "feest_gabber", "order": 50, "track": "feest", "icon": "🎧", "title": "Gabber & der Rotterdam-Hardcore", "situation": "Wie in Rotterdam der Hardcore entstand", "story": "Anfang der 90er entstand in <b>Rotterdam</b> ein harter, schneller Sound: der <b>Gabber</b>. Es war die raue Antwort der Hafenstadt auf die feine House-Szene aus Amsterdam. Das Wort <i>gabber</i> bedeutet eigentlich einfach „Kumpel“.", "grammar": "presens", "vocab": [{"id": "fe1_gabber", "nl": "de gabber", "de": "der Gabber / Kumpel", "ex": "Hij is een echte gabber.", "exDe": "Er ist ein echter Gabber."}, {"id": "fe1_hardcore", "nl": "de hardcore", "de": "der Hardcore (Musikstil)", "ex": "Ik luister naar hardcore.", "exDe": "Ich höre Hardcore."}, {"id": "fe1_snel", "nl": "snel", "de": "schnell", "ex": "De muziek is heel snel.", "exDe": "Die Musik ist sehr schnell."}, {"id": "fe1_dansen", "nl": "dansen", "de": "tanzen", "ex": "Wij dansen de hele nacht.", "exDe": "Wir tanzen die ganze Nacht."}, {"id": "fe1_stad", "nl": "de stad", "de": "die Stadt", "ex": "Rotterdam is een grote stad.", "exDe": "Rotterdam ist eine große Stadt."}, {"id": "fe1_muziek", "nl": "de muziek", "de": "die Musik", "ex": "Ik hou van deze muziek.", "exDe": "Ich mag diese Musik."}, {"id": "fe1_kaal", "nl": "kaal", "de": "kahl / Glatze", "ex": "Veel gabbers zijn kaal.", "exDe": "Viele Gabber haben eine Glatze."}], "dialogue": [{"who": "Freund", "nl": "Hé gabber, hou jij van hardcore?", "de": "Hey Kumpel, magst du Hardcore?"}, {"who": "Fan", "nl": "Ja, ik luister elke dag naar deze muziek.", "de": "Ja, ich höre diese Musik jeden Tag."}, {"who": "Freund", "nl": "De beat is echt heel snel.", "de": "Der Beat ist wirklich sehr schnell."}, {"who": "Fan", "nl": "Daarom dansen wij zo hard.", "de": "Deshalb tanzen wir so heftig."}], "speak": [{"nl": "Ik hou van hardcore.", "de": "Ich mag Hardcore."}, {"nl": "De muziek is heel snel.", "de": "Die Musik ist sehr schnell."}], "culture": {"title": "Rotterdam gegen Amsterdam", "text": "Gabber entstand Anfang der 1990er in <b>Rotterdam</b> als härtere Gegenbewegung zur Amsterdamer House-Szene. Das Wort kommt aus dem Bargoens (vom jiddischen <i>chaver</i>) und bedeutet „Freund“. Typisch waren Glatzen, Trainingsanzüge und Nike Air Max."}},
  {"id": "feest_thunderdome", "order": 51, "track": "feest", "icon": "💀", "title": "Thunderdome", "situation": "Der legendäre Hardcore-Rave", "story": "1992 stieg das erste <b>Thunderdome</b>, organisiert von der Firma ID&T. Der grinsende <b>Totenkopf</b> wurde zum berühmtesten Symbol der Hardcore-Szene. Die CD-Sammlungen verkauften sich millionenfach.", "grammar": "perfectum", "vocab": [{"id": "fe2_feest", "nl": "het feest", "de": "die Party / das Fest", "ex": "Het feest is begonnen.", "exDe": "Die Party hat begonnen."}, {"id": "fe2_schedel", "nl": "de schedel", "de": "der Totenkopf / Schädel", "ex": "De schedel is het logo.", "exDe": "Der Totenkopf ist das Logo."}, {"id": "fe2_logo", "nl": "het logo", "de": "das Logo", "ex": "Iedereen kent dit logo.", "exDe": "Jeder kennt dieses Logo."}, {"id": "fe2_beroemd", "nl": "beroemd", "de": "berühmt", "ex": "Thunderdome is heel beroemd.", "exDe": "Thunderdome ist sehr berühmt."}, {"id": "fe2_kaartje", "nl": "het kaartje", "de": "die Eintrittskarte", "ex": "Ik heb een kaartje gekocht.", "exDe": "Ich habe eine Karte gekauft."}, {"id": "fe2_geweest", "nl": "geweest", "de": "gewesen", "ex": "Ik ben op het feest geweest.", "exDe": "Ich bin auf der Party gewesen."}, {"id": "fe2_herinnering", "nl": "de herinnering", "de": "die Erinnerung", "ex": "Dat is een mooie herinnering.", "exDe": "Das ist eine schöne Erinnerung."}], "dialogue": [{"who": "Fan", "nl": "Ben jij bij Thunderdome geweest?", "de": "Warst du bei Thunderdome?"}, {"who": "Freundin", "nl": "Ja, ik heb een kaartje gekocht.", "de": "Ja, ich habe eine Karte gekauft."}, {"who": "Fan", "nl": "De schedel op het podium was groot.", "de": "Der Totenkopf auf der Bühne war groß."}, {"who": "Freundin", "nl": "Het is een mooie herinnering geworden.", "de": "Es ist eine schöne Erinnerung geworden."}], "speak": [{"nl": "Ik ben op het feest geweest.", "de": "Ich bin auf der Party gewesen."}, {"nl": "Ik heb een kaartje gekocht.", "de": "Ich habe eine Karte gekauft."}], "culture": {"title": "Der grinsende Totenkopf", "text": "Das erste <b>Thunderdome</b> fand 1992 statt und wurde von ID&T veranstaltet. Der Totenkopf-Zauberer als Maskottchen und die vielen <b>CD-Compilations</b> machten die Marke weit über die Niederlande hinaus bekannt."}},
  {"id": "feest_housewelle", "order": 52, "track": "feest", "icon": "🎹", "title": "Die Housewelle", "situation": "Anfang der 90er kommt House", "story": "Anfang der 90er erreichte die <b>House</b>-Musik die Niederlande und veränderte die Nächte für immer. 1992 wurde die Party-Firma <b>ID&T</b> gegründet. Die DJs mit ihren Platten wurden zu neuen Stars.", "grammar": "toekomst", "vocab": [{"id": "fe3_house", "nl": "de house", "de": "die House-Musik", "ex": "House komt uit Amerika.", "exDe": "House kommt aus Amerika."}, {"id": "fe3_plaat", "nl": "de plaat", "de": "die Schallplatte", "ex": "De dj draait een nieuwe plaat.", "exDe": "Der DJ legt eine neue Platte auf."}, {"id": "fe3_dj", "nl": "de dj", "de": "der DJ", "ex": "De dj wordt heel populair.", "exDe": "Der DJ wird sehr beliebt."}, {"id": "fe3_nieuw", "nl": "nieuw", "de": "neu", "ex": "Dit is een nieuwe stijl.", "exDe": "Das ist ein neuer Stil."}, {"id": "fe3_draaien", "nl": "draaien", "de": "auflegen / drehen", "ex": "Hij zal vanavond draaien.", "exDe": "Er wird heute Abend auflegen."}, {"id": "fe3_publiek", "nl": "het publiek", "de": "das Publikum", "ex": "Het publiek zal dansen.", "exDe": "Das Publikum wird tanzen."}, {"id": "fe3_populair", "nl": "populair", "de": "beliebt", "ex": "House wordt heel populair.", "exDe": "House wird sehr beliebt."}], "dialogue": [{"who": "Freundin", "nl": "Wie zal er vanavond draaien?", "de": "Wer wird heute Abend auflegen?"}, {"who": "Freund", "nl": "Een dj met veel nieuwe platen.", "de": "Ein DJ mit vielen neuen Platten."}, {"who": "Freundin", "nl": "Dan zal het publiek zeker dansen.", "de": "Dann wird das Publikum bestimmt tanzen."}, {"who": "Freund", "nl": "House wordt hier heel populair.", "de": "House wird hier sehr beliebt."}], "speak": [{"nl": "De dj zal vanavond draaien.", "de": "Der DJ wird heute Abend auflegen."}, {"nl": "Het publiek zal dansen.", "de": "Das Publikum wird tanzen."}], "culture": {"title": "Eine neue Nacht", "text": "Anfang der 1990er verbreitete sich <b>House</b> aus Chicago und Detroit rasant in den Niederlanden. 1992 gründeten junge Veranstalter die Firma <b>ID&T</b>, die später viele große Festivals prägen sollte."}},
  {"id": "feest_mysteryland", "order": 53, "track": "feest", "icon": "🎪", "title": "Mysteryland", "situation": "Eines der ältesten Festivals", "story": "<b>Mysteryland</b> wird seit <b>1993</b> gefeiert und gilt als eines der ältesten laufenden Festivals der Niederlande. Es findet im Haarlemmermeer statt, wo tausende Besucher tanzen. Zahlen und Jahre gehören zu diesem Festival wie die Musik.", "grammar": "getallen", "vocab": [{"id": "fe4_festival", "nl": "het festival", "de": "das Festival", "ex": "Het festival is elk jaar.", "exDe": "Das Festival ist jedes Jahr."}, {"id": "fe4_jaar", "nl": "het jaar", "de": "das Jahr", "ex": "Het bestaat al veel jaar.", "exDe": "Es besteht schon viele Jahre."}, {"id": "fe4_oud", "nl": "oud", "de": "alt", "ex": "Dit festival is heel oud.", "exDe": "Dieses Festival ist sehr alt."}, {"id": "fe4_duizend", "nl": "duizend", "de": "tausend", "ex": "Er komen duizend mensen.", "exDe": "Es kommen tausend Menschen."}, {"id": "fe4_bezoeker", "nl": "de bezoeker", "de": "der Besucher", "ex": "De bezoekers dansen samen.", "exDe": "Die Besucher tanzen zusammen."}, {"id": "fe4_terrein", "nl": "het terrein", "de": "das Gelände", "ex": "Het terrein is heel groot.", "exDe": "Das Gelände ist sehr groß."}, {"id": "fe4_kaartjes", "nl": "de kaartjes", "de": "die Karten", "ex": "De kaartjes zijn snel weg.", "exDe": "Die Karten sind schnell weg."}], "dialogue": [{"who": "Freund", "nl": "Sinds welk jaar bestaat Mysteryland?", "de": "Seit welchem Jahr gibt es Mysteryland?"}, {"who": "Freundin", "nl": "Al sinds negentien drieënnegentig.", "de": "Schon seit neunzehndreiundneunzig."}, {"who": "Freund", "nl": "Wow, dan is het echt heel oud.", "de": "Wow, dann ist es wirklich sehr alt."}, {"who": "Freundin", "nl": "Er komen duizenden bezoekers.", "de": "Es kommen tausende Besucher."}], "speak": [{"nl": "Het festival bestaat sinds 1993.", "de": "Das Festival gibt es seit 1993."}, {"nl": "Er komen duizend bezoekers.", "de": "Es kommen tausend Besucher."}], "culture": {"title": "Ein Klassiker seit 1993", "text": "<b>Mysteryland</b> findet seit 1993 statt und zählt zu den ältesten noch bestehenden Musikfestivals der Niederlande. Ausgetragen wird es im Haarlemmermeer, nahe dem ehemaligen Floriade-Gelände."}},
  {"id": "feest_sensation", "order": 54, "track": "feest", "icon": "🤍", "title": "Sensation", "situation": "Die ganz weiße Nacht", "story": "Bei <b>Sensation</b> gilt eine strenge Regel: alle tragen <b>Weiß</b>. Das Konzept startete im Jahr 2000 in der Amsterdam Arena und wurde weltberühmt. Weiße Kleidung, schöne Lichter und eine große Show gehören zusammen.", "grammar": "bijvoeglijk", "vocab": [{"id": "fe5_wit", "nl": "wit", "de": "weiß", "ex": "Iedereen draagt witte kleding.", "exDe": "Alle tragen weiße Kleidung."}, {"id": "fe5_kleding", "nl": "de kleding", "de": "die Kleidung", "ex": "De kleding moet wit zijn.", "exDe": "Die Kleidung muss weiß sein."}, {"id": "fe5_mooi", "nl": "mooi", "de": "schön", "ex": "Het is een mooie show.", "exDe": "Es ist eine schöne Show."}, {"id": "fe5_licht", "nl": "het licht", "de": "das Licht", "ex": "De witte lichten zijn prachtig.", "exDe": "Die weißen Lichter sind wunderschön."}, {"id": "fe5_groot", "nl": "groot", "de": "groß", "ex": "Het is een groot feest.", "exDe": "Es ist eine große Party."}, {"id": "fe5_show", "nl": "de show", "de": "die Show", "ex": "De show is spectaculair.", "exDe": "Die Show ist spektakulär."}, {"id": "fe5_regel", "nl": "de regel", "de": "die Regel", "ex": "Er is een strenge regel.", "exDe": "Es gibt eine strenge Regel."}], "dialogue": [{"who": "Freundin", "nl": "Wat trek je aan voor Sensation?", "de": "Was ziehst du für Sensation an?"}, {"who": "Freund", "nl": "Een witte broek en een wit shirt.", "de": "Eine weiße Hose und ein weißes Shirt."}, {"who": "Freundin", "nl": "Alles moet wit zijn, dat is de regel.", "de": "Alles muss weiß sein, das ist die Regel."}, {"who": "Freund", "nl": "De witte lichten zijn echt mooi.", "de": "Die weißen Lichter sind wirklich schön."}], "speak": [{"nl": "Iedereen draagt witte kleding.", "de": "Alle tragen weiße Kleidung."}, {"nl": "Het is een grote, mooie show.", "de": "Es ist eine große, schöne Show."}], "culture": {"title": "Be part of the night, wear white", "text": "Das Konzept <b>Sensation</b> startete im Jahr 2000 in der Amsterdam Arena. Berühmt wurde vor allem <i>Sensation White</i> mit strengem weißen Dresscode; später kam auch die dunkle Variante <i>Sensation Black</i> dazu."}},
  {"id": "feest_qdance", "order": 55, "track": "feest", "icon": "⚡", "title": "Q-dance & Hardstyle", "situation": "Defqon.1 und der harte Sound", "story": "Die Firma <b>Q-dance</b> machte den <b>Hardstyle</b> groß, einen harten und melodischen Stil. Ihr Festival <b>Defqon.1</b> in Biddinghuizen ist berühmt für die „Power Hour“ und riesiges Feuerwerk. Hier will jeder springen und feiern.", "grammar": "modaal", "vocab": [{"id": "fe6_hardstyle", "nl": "de hardstyle", "de": "der Hardstyle", "ex": "Ik wil naar hardstyle luisteren.", "exDe": "Ich will Hardstyle hören."}, {"id": "fe6_willen", "nl": "willen", "de": "wollen", "ex": "Wij willen naar Defqon.", "exDe": "Wir wollen zu Defqon."}, {"id": "fe6_moeten", "nl": "moeten", "de": "müssen", "ex": "Je moet een kaartje kopen.", "exDe": "Du musst eine Karte kaufen."}, {"id": "fe6_mogen", "nl": "mogen", "de": "dürfen", "ex": "Hier mag je hard springen.", "exDe": "Hier darfst du kräftig springen."}, {"id": "fe6_springen", "nl": "springen", "de": "springen", "ex": "Iedereen wil springen.", "exDe": "Jeder will springen."}, {"id": "fe6_geluid", "nl": "het geluid", "de": "der Klang / das Geräusch", "ex": "Het geluid is heel hard.", "exDe": "Der Klang ist sehr laut."}, {"id": "fe6_vuurwerk", "nl": "het vuurwerk", "de": "das Feuerwerk", "ex": "Het vuurwerk is spectaculair.", "exDe": "Das Feuerwerk ist spektakulär."}], "dialogue": [{"who": "Freund", "nl": "Wil jij naar Defqon.1 gaan?", "de": "Willst du zu Defqon.1 gehen?"}, {"who": "Freundin", "nl": "Ja, maar we moeten snel kaartjes kopen.", "de": "Ja, aber wir müssen schnell Karten kaufen."}, {"who": "Freund", "nl": "Tijdens de power hour mag je hard springen.", "de": "Während der Power Hour darfst du kräftig springen."}, {"who": "Freundin", "nl": "En het vuurwerk wil ik echt zien!", "de": "Und das Feuerwerk will ich unbedingt sehen!"}], "speak": [{"nl": "Wij willen naar Defqon.", "de": "Wir wollen zu Defqon."}, {"nl": "Je moet een kaartje kopen.", "de": "Du musst eine Karte kaufen."}], "culture": {"title": "Hardstyle aus den Niederlanden", "text": "Der Veranstalter <b>Q-dance</b> wurde 1999 gegründet und prägte den <b>Hardstyle</b>. Das Festival <b>Defqon.1</b> läuft seit 2003 in Biddinghuizen und ist bekannt für seine spektakuläre Abschluss-Show, die „Power Hour“."}},
  {"id": "feest_awakenings", "order": 56, "track": "feest", "icon": "🌀", "title": "Awakenings & Techno", "situation": "Die niederländische Techno-Szene", "story": "<b>Awakenings</b> ist seit 1997 der wichtigste Name für <b>Techno</b> in den Niederlanden. Ob in dunklen Hallen oder draußen bei Spaarnwoude: hier zählt der harte, gerade Beat. Techno-Fans lieben das dunkle, hypnotische Gefühl.", "grammar": "woordvolgorde", "vocab": [{"id": "fe7_techno", "nl": "de techno", "de": "der Techno", "ex": "Vanavond luister ik naar techno.", "exDe": "Heute Abend höre ich Techno."}, {"id": "fe7_beat", "nl": "de beat", "de": "der Beat", "ex": "De beat is heel strak.", "exDe": "Der Beat ist sehr straff."}, {"id": "fe7_donker", "nl": "donker", "de": "dunkel", "ex": "In de hal is het donker.", "exDe": "In der Halle ist es dunkel."}, {"id": "fe7_hal", "nl": "de hal", "de": "die Halle", "ex": "De hal zit helemaal vol.", "exDe": "Die Halle ist ganz voll."}, {"id": "fe7_ritme", "nl": "het ritme", "de": "der Rhythmus", "ex": "Ik voel het ritme goed.", "exDe": "Ich spüre den Rhythmus gut."}, {"id": "fe7_ondergronds", "nl": "ondergronds", "de": "underground", "ex": "Techno is soms ondergronds.", "exDe": "Techno ist manchmal Underground."}, {"id": "fe7_hard", "nl": "hard", "de": "laut / hart", "ex": "De muziek staat heel hard.", "exDe": "Die Musik ist sehr laut."}], "dialogue": [{"who": "Freundin", "nl": "Vanavond gaan wij naar Awakenings.", "de": "Heute Abend gehen wir zu Awakenings."}, {"who": "Freund", "nl": "Mooi, techno vind ik geweldig.", "de": "Schön, Techno finde ich großartig."}, {"who": "Freundin", "nl": "In de hal is het lekker donker.", "de": "In der Halle ist es angenehm dunkel."}, {"who": "Freund", "nl": "Daar voel ik het ritme het best.", "de": "Da spüre ich den Rhythmus am besten."}], "speak": [{"nl": "Vanavond ga ik naar techno luisteren.", "de": "Heute Abend gehe ich Techno hören."}, {"nl": "In de hal is het donker.", "de": "In der Halle ist es dunkel."}], "culture": {"title": "Techno hat einen Namen", "text": "<b>Awakenings</b> begann 1997 und wurde zur wichtigsten Marke für <b>Techno</b> in den Niederlanden. Bekannt sind sowohl die Indoor-Events im Amsterdamer Gashouder als auch das große Open-Air bei Spaarnwoude."}},
  {"id": "feest_freeparty", "order": 57, "track": "feest", "icon": "🚧", "title": "Free Partys", "situation": "Die illegalen Raves von früher", "story": "Nicht jede Party hatte eine Genehmigung: <b>Free Partys</b> waren oft <b>illegal</b> und geheim. Man traf sich an einem versteckten Ort, baute ein Soundsystem auf und tanzte, bis die Polizei kam. Genau das machte den Reiz aus.", "grammar": "negatie", "vocab": [{"id": "fe8_illegaal", "nl": "illegaal", "de": "illegal", "ex": "Het feest is illegaal.", "exDe": "Die Party ist illegal."}, {"id": "fe8_verboden", "nl": "verboden", "de": "verboten", "ex": "Dat feest is verboden.", "exDe": "Diese Party ist verboten."}, {"id": "fe8_politie", "nl": "de politie", "de": "die Polizei", "ex": "De politie komt niet meteen.", "exDe": "Die Polizei kommt nicht sofort."}, {"id": "fe8_geheim", "nl": "geheim", "de": "geheim", "ex": "De plek is geheim.", "exDe": "Der Ort ist geheim."}, {"id": "fe8_plek", "nl": "de plek", "de": "der Ort / die Stelle", "ex": "Niemand kent de plek.", "exDe": "Niemand kennt den Ort."}, {"id": "fe8_vrij", "nl": "vrij", "de": "frei", "ex": "Iedereen voelt zich vrij.", "exDe": "Alle fühlen sich frei."}, {"id": "fe8_niet", "nl": "niet", "de": "nicht", "ex": "Wij hebben geen kaartje nodig.", "exDe": "Wir brauchen keine Karte."}], "dialogue": [{"who": "Freund", "nl": "Waar is het feest vanavond?", "de": "Wo ist die Party heute Abend?"}, {"who": "Freundin", "nl": "Dat weet ik niet, de plek is geheim.", "de": "Das weiß ich nicht, der Ort ist geheim."}, {"who": "Freund", "nl": "Hebben we een kaartje nodig?", "de": "Brauchen wir eine Karte?"}, {"who": "Freundin", "nl": "Nee, maar het is wel illegaal.", "de": "Nein, aber es ist illegal."}], "speak": [{"nl": "Het is niet legaal.", "de": "Es ist nicht legal."}, {"nl": "Wij hebben geen kaartje nodig.", "de": "Wir brauchen keine Karte."}], "culture": {"title": "Tanzen ohne Erlaubnis", "text": "<b>Free Partys</b> waren illegale Raves ohne offizielle Genehmigung, oft an versteckten Orten mit mobilen Soundsystemen. Sie standen für Freiheit und eine do-it-yourself-Kultur, wurden aber immer wieder von der Polizei aufgelöst."}},
  {"id": "feest_koningsdag", "order": 58, "track": "feest", "icon": "👑", "title": "Koningsdag", "situation": "Das ganze Land wird orange", "story": "Am <b>27. April</b> feiert das Land den Geburtstag des Königs: <b>Koningsdag</b>. Alle tragen Orange, verkaufen auf dem <i>vrijmarkt</i> ihre Sachen und feiern auf Booten in den Grachten. Schon die Nacht davor, die <b>Koningsnacht</b>, ist eine riesige Party.", "grammar": "meervoud", "vocab": [{"id": "fe9_koning", "nl": "de koning", "de": "der König", "ex": "De koning is jarig.", "exDe": "Der König hat Geburtstag."}, {"id": "fe9_oranje", "nl": "oranje", "de": "orange", "ex": "Iedereen draagt oranje kleren.", "exDe": "Alle tragen orange Kleidung."}, {"id": "fe9_vrijmarkt", "nl": "de vrijmarkt", "de": "der Flohmarkt", "ex": "Op de vrijmarkt verkoop ik spullen.", "exDe": "Auf dem Flohmarkt verkaufe ich Sachen."}, {"id": "fe9_boot", "nl": "de boot", "de": "das Boot", "ex": "Er varen veel boten in de gracht.", "exDe": "Es fahren viele Boote in der Gracht."}, {"id": "fe9_kroon", "nl": "de kroon", "de": "die Krone", "ex": "Kinderen dragen papieren kronen.", "exDe": "Kinder tragen Kronen aus Papier."}, {"id": "fe9_verjaardag", "nl": "de verjaardag", "de": "der Geburtstag", "ex": "Het is de verjaardag van de koning.", "exDe": "Es ist der Geburtstag des Königs."}, {"id": "fe9_straten", "nl": "de straten", "de": "die Straßen", "ex": "De straten zijn vol met mensen.", "exDe": "Die Straßen sind voller Menschen."}], "dialogue": [{"who": "Freundin", "nl": "Wat doe jij op Koningsdag?", "de": "Was machst du an Koningsdag?"}, {"who": "Freund", "nl": "Ik verkoop spullen op de vrijmarkt.", "de": "Ich verkaufe Sachen auf dem Flohmarkt."}, {"who": "Freundin", "nl": "Draag je ook oranje kleren?", "de": "Trägst du auch orange Kleidung?"}, {"who": "Freund", "nl": "Natuurlijk, en 's avonds gaan we op de boten.", "de": "Natürlich, und abends gehen wir auf die Boote."}], "speak": [{"nl": "Iedereen draagt oranje kleren.", "de": "Alle tragen orange Kleidung."}, {"nl": "De straten zijn vol met mensen.", "de": "Die Straßen sind voller Menschen."}], "culture": {"title": "Oranje boven!", "text": "<b>Koningsdag</b> wird am 27. April gefeiert, dem Geburtstag von König Willem-Alexander (früher war es der <i>Koninginnedag</i> am 30. April). Typisch sind orange Kleidung, der <b>vrijmarkt</b> und in Amsterdam die vielen Boote auf den Grachten."}},
  {"id": "feest_borrel", "order": 59, "track": "feest", "icon": "🍻", "title": "Borrel & Kroeg", "situation": "Gemütliches Feiern im Alltag", "story": "Nicht jedes Feiern ist ein Rave: Der <b>borrel</b> ist ein gemütliches Treffen bei einem Getränk, oft in der <b>kroeg</b>, dem Pub. Am liebsten sitzt man in einem alten „braunen Café“ mit Freunden. Das ist echte <i>gezelligheid</i>.", "grammar": "graag", "vocab": [{"id": "fe10_borrel", "nl": "de borrel", "de": "der Umtrunk", "ex": "Wij drinken graag een borrel.", "exDe": "Wir trinken gern einen Umtrunk."}, {"id": "fe10_kroeg", "nl": "de kroeg", "de": "die Kneipe / der Pub", "ex": "Ik ga graag naar de kroeg.", "exDe": "Ich gehe gern in die Kneipe."}, {"id": "fe10_biertje", "nl": "het biertje", "de": "das Bierchen", "ex": "Neem jij ook een biertje?", "exDe": "Nimmst du auch ein Bierchen?"}, {"id": "fe10_gezellig", "nl": "gezellig", "de": "gemütlich", "ex": "Het is hier heel gezellig.", "exDe": "Es ist hier sehr gemütlich."}, {"id": "fe10_proost", "nl": "proost", "de": "prost", "ex": "Proost, op onze vriendschap!", "exDe": "Prost, auf unsere Freundschaft!"}, {"id": "fe10_vrienden", "nl": "de vrienden", "de": "die Freunde", "ex": "Ik zit graag met vrienden.", "exDe": "Ich sitze gern mit Freunden."}, {"id": "fe10_cafe", "nl": "het café", "de": "das Café / die Kneipe", "ex": "Dat bruine café is heel oud.", "exDe": "Diese braune Kneipe ist sehr alt."}], "dialogue": [{"who": "Freund", "nl": "Ga je mee naar de kroeg?", "de": "Kommst du mit in die Kneipe?"}, {"who": "Freundin", "nl": "Ja graag, ik lust wel een biertje.", "de": "Ja gern, ich hätte Lust auf ein Bierchen."}, {"who": "Freund", "nl": "In dat bruine café is het altijd gezellig.", "de": "In dieser braunen Kneipe ist es immer gemütlich."}, {"who": "Freundin", "nl": "Proost, op een fijne avond!", "de": "Prost, auf einen schönen Abend!"}], "speak": [{"nl": "Ik ga graag naar de kroeg.", "de": "Ich gehe gern in die Kneipe."}, {"nl": "Het is hier heel gezellig.", "de": "Es ist hier sehr gemütlich."}], "culture": {"title": "Gezelligheid im braunen Café", "text": "Der <b>borrel</b> ist ein zwangloses Treffen bei einem Getränk, oft in einer <i>kroeg</i>. Besonders beliebt sind die <b>bruine cafés</b> mit dunklem Holz und gemütlicher Atmosphäre. Das unübersetzbare Wort <i>gezelligheid</i> steht für genau dieses warme Miteinander."}}
];

// ---------------------------------------------------------------------------
//  KI-GESPRÄCH — Szenario „Bäcker" (Mock + optionaler Claude-Proxy)
// ---------------------------------------------------------------------------
const CHAT_COMMON =
  'De gebruiker is een Duitstalige beginner (niveau A1-A2) die Nederlands leert. ' +
  'Praat langzaam en in korte, simpele zinnen. Blijf in je rol. ' +
  'Corrigeer grote fouten kort en vriendelijk. Als de gebruiker vastloopt, ' +
  'geef een korte hint in het Duits tussen haakjes. Houd antwoorden kort (1-2 zinnen).';

// Mehrere Gesprächs-Szenarien. „mockReplies" speisen den Offline-Übungsmodus,
// wenn kein KI-Proxy hinterlegt ist.
export const CHAT_SCENARIOS = [
  {
    id: 'bakker', icon: '🥖', label: 'Beim Bäcker',
    scenarioDe: 'Du stehst beim Bäcker. Begrüße ihn und bestell etwas auf Niederländisch.',
    opener: 'Goedemorgen! Welkom bij de bakker. Wat mag het zijn?',
    openerHint: 'Guten Morgen! Willkommen beim Bäcker. Was darf es sein?',
    example: 'Ik wil graag een brood.',
    system: 'Je bent een vriendelijke Nederlandse bakker in een taalapp. ' + CHAT_COMMON,
  },
  {
    id: 'kassa', icon: '🛒', label: 'An der Kasse',
    scenarioDe: 'Du stehst an der Kasse im Albert Heijn. Bezahle deinen Einkauf.',
    opener: 'Hallo! Dat is samen twaalf euro. Wilt u pinnen?',
    openerHint: 'Hallo! Das macht zusammen 12 Euro. Möchten Sie mit Karte zahlen?',
    example: 'Ja, ik wil pinnen.',
    system: 'Je bent een vriendelijke kassamedewerker bij de supermarkt Albert Heijn. Je vraagt of de klant wil pinnen en of hij een tasje wil. ' + CHAT_COMMON,
    mockReplies: [
      { text: 'Prima. Wilt u een tasje erbij?', hint: 'Prima. Möchten Sie eine Tüte dazu?' },
      { text: 'Alstublieft, hier is uw bon. Fijne dag!', hint: 'Bitte, hier ist Ihr Kassenbon. Schönen Tag!' },
      { text: 'Geen probleem. Tot ziens!', hint: 'Kein Problem. Auf Wiedersehen!' },
    ],
  },
  {
    id: 'weg', icon: '🚲', label: 'Nach dem Weg fragen',
    scenarioDe: 'Du hast dich verfahren. Frag einen Passanten nach dem Weg (z. B. zum Plattenladen).',
    opener: 'Hoi! Je ziet er zoekend uit. Kan ik je helpen?',
    openerHint: 'Hi! Du siehst suchend aus. Kann ich dir helfen?',
    example: 'Waar is de platenzaak?',
    system: 'Je bent een vriendelijke voorbijganger in Utrecht die de weg wijst. Gebruik woorden als links, rechts, rechtdoor en de gracht. ' + CHAT_COMMON,
    mockReplies: [
      { text: 'Ga hier rechtdoor en dan de tweede straat links.', hint: 'Geh hier geradeaus und dann die zweite Straße links.' },
      { text: 'Het is vlakbij, langs de gracht.', hint: 'Es ist ganz nah, an der Gracht entlang.' },
      { text: 'Graag gedaan! Succes en een fijne dag.', hint: 'Gern geschehen! Viel Erfolg und einen schönen Tag.' },
    ],
  },
  {
    id: 'terras', icon: '🍺', label: 'Auf dem Terras',
    scenarioDe: 'Du sitzt auf einem Terras an der Gracht. Bestell etwas zu trinken.',
    opener: 'Hoi, welkom! Wat wil je drinken?',
    openerHint: 'Hi, willkommen! Was möchtest du trinken?',
    example: 'Een biertje, graag.',
    system: 'Je bent een vriendelijke ober op een terras in Utrecht. Je neemt de bestelling op. ' + CHAT_COMMON,
    mockReplies: [
      { text: 'Lekker! Wil je er iets bij eten?', hint: 'Lecker! Möchtest du etwas dazu essen?' },
      { text: 'Komt eraan! Alvast gezellig.', hint: 'Kommt sofort! Schon mal viel Spaß.' },
      { text: 'Ik breng het zo. Proost!', hint: 'Ich bringe es gleich. Prost!' },
    ],
  },
  {
    id: 'platenzaak', icon: '🎧', label: 'Im Plattenladen',
    scenarioDe: 'Du bist bei „Ferry\'s Records". Rede mit Ferry über Musik.',
    opener: 'Hey! Zoek je iets speciaals vandaag?',
    openerHint: 'Hey! Suchst du heute etwas Bestimmtes?',
    example: 'Ik zoek drum-and-bass.',
    system: 'Je bent Ferry, de eigenaar van een platenzaak in Utrecht. Je houdt van drum-and-bass en praat graag over muziek. ' + CHAT_COMMON,
    mockReplies: [
      { text: 'Goede keuze! Hou je van Black Sun Empire?', hint: 'Gute Wahl! Magst du Black Sun Empire?' },
      { text: 'Deze plaat is echt gaaf, uit Utrecht.', hint: 'Diese Platte ist echt cool, aus Utrecht.' },
      { text: 'Kom je een keer draaien? Er is een newcomer-slot.', hint: 'Kommst du mal auflegen? Es gibt einen Newcomer-Slot.' },
    ],
  },
];

// Rückwärtskompatibel: CHAT = erstes Szenario (Bäcker).
export const CHAT = CHAT_SCENARIOS[0];

// ---------------------------------------------------------------------------
//  PROGRESSION — Level (Story-Etappen), Meilensteine, XP-Werte, Tagesziele
// ---------------------------------------------------------------------------
export const LEVELS = [
  { level: 1, minXp: 0,    nl: 'Aankomst',          de: 'Ankunft',            icon: '📦' },
  { level: 2, minXp: 80,   nl: 'Het nieuwe huis',   de: 'Das neue Zuhause',   icon: '🐈' },
  { level: 3, minXp: 200,  nl: 'Op de fiets',       de: 'Auf dem Rad',        icon: '🚲' },
  { level: 4, minXp: 380,  nl: 'In de studio',      de: 'Im Studio',          icon: '🎚️' },
  { level: 5, minXp: 620,  nl: 'De scene',          de: 'Die Szene',          icon: '🎧' },
  { level: 6, minXp: 920,  nl: 'Bijna klaar',       de: 'Fast fertig',        icon: '🎛️' },
  { level: 7, minXp: 1300, nl: 'Achter de decks',   de: 'Hinter den Decks',   icon: '🔊' },
  { level: 8, minXp: 1800, nl: 'Thuis in Utrecht',  de: 'Zuhause in Utrecht', icon: '🧡' },
];

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
  { id: 'halfway',      icon: '🎧', title: 'In der Szene',     desc: 'Level 5 erreicht',             metric: 'level', gte: 5 },
  { id: 'all_lessons',  icon: '🔊', title: 'Achter de decks',  desc: 'Alle 9 Lektionen gemeistert',  metric: 'lessonsMastered', gte: 9 },
];

export const DAILY_GOALS = {
  locker:  { label: 'Locker', minutes: 5,  xp: 30 },
  normaal: { label: 'Normal', minutes: 10, xp: 60 },
  ernst:   { label: 'Ernst',  minutes: 15, xp: 100 },
};

export const XP = {
  review: 2, newWord: 1, lesson: 20, chat: 3, speak: 4, task: 10, milestone: 15,
};

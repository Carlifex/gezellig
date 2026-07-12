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
    id: 'optreden', order: 9, icon: '🔊',
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

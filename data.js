// Lerninhalte für Phase 0 — Thema "Bij de bakker" (Beim Bäcker).
// nl = Niederländisch, de = Deutsch, ex = Beispielsatz, note = Hinweis (z. B. valse vriend)

export const THEME = {
  id: 'bakker',
  title: 'Bij de bakker',
  titleDe: 'Beim Bäcker',
};

export const VOCAB = [
  { id: 'bakker',     nl: 'de bakker',       de: 'der Bäcker',            ex: 'De bakker is heel aardig.' },
  { id: 'brood',      nl: 'het brood',       de: 'das Brot',              ex: 'Ik koop een vers brood.' },
  { id: 'broodje',    nl: 'het broodje',     de: 'das Brötchen',          ex: 'Mag ik twee broodjes?', note: 'Verkleinerung auf -je → immer het.' },
  { id: 'bakkerij',   nl: 'de bakkerij',     de: 'die Bäckerei',          ex: 'De bakkerij is open.' },
  { id: 'goedemorgen',nl: 'goedemorgen',     de: 'guten Morgen',          ex: 'Goedemorgen, meneer!' },
  { id: 'graag',      nl: 'ik wil graag',    de: 'ich möchte gerne',      ex: 'Ik wil graag een krentenbol.' },
  { id: 'alstublieft',nl: 'alstublieft',     de: 'bitte (höflich)',       ex: 'Een brood, alstublieft.', note: 'Höfliche Form; locker: alsjeblieft.' },
  { id: 'dankuwel',   nl: 'dank u wel',      de: 'danke (höflich)',       ex: 'Dank u wel, tot ziens!' },
  { id: 'krentenbol', nl: 'de krentenbol',   de: 'das Rosinenbrötchen',   ex: 'Een krentenbol is lekker.' },
  { id: 'appeltaart', nl: 'de appeltaart',   de: 'der Apfelkuchen',       ex: 'Een puntje appeltaart, graag.' },
  { id: 'puntje',     nl: 'een puntje',      de: 'ein Stück (Kuchen)',    ex: 'Mag ik een puntje taart?' },
  { id: 'vers',       nl: 'vers',            de: 'frisch',                ex: 'Het brood is vers.', note: 'Falscher Freund: NICHT "der Vers".' },
  { id: 'lekker',     nl: 'lekker',          de: 'lecker',                ex: 'Dat ziet er lekker uit.' },
  { id: 'hoeveel',    nl: 'hoeveel kost het',de: 'wie viel kostet es',    ex: 'Hoeveel kost het brood?' },
  { id: 'alles',      nl: 'dat is alles',    de: 'das ist alles',         ex: 'Dat is alles, dank u.' },
  { id: 'totziens',   nl: 'tot ziens',       de: 'auf Wiedersehen',       ex: 'Tot ziens en fijne dag!' },
];

export const DIALOGUE = [
  { who: 'Bakker', nl: 'Goedemorgen! Wat mag het zijn?',                   de: 'Guten Morgen! Was darf es sein?' },
  { who: 'Klant',  nl: 'Goedemorgen. Ik wil graag twee broodjes, alstublieft.', de: 'Guten Morgen. Ich möchte gerne zwei Brötchen, bitte.' },
  { who: 'Bakker', nl: 'Wilt u er nog iets bij?',                          de: 'Möchten Sie noch etwas dazu?' },
  { who: 'Klant',  nl: 'Ja, een krentenbol en een puntje appeltaart.',     de: 'Ja, ein Rosinenbrötchen und ein Stück Apfelkuchen.' },
  { who: 'Bakker', nl: 'Dat is samen vier euro vijftig.',                  de: 'Das macht zusammen vier Euro fünfzig.' },
  { who: 'Klant',  nl: 'Alstublieft. Dank u wel!',                         de: 'Bitteschön. Danke!' },
  { who: 'Bakker', nl: 'Dank u wel, tot ziens!',                           de: 'Danke, auf Wiedersehen!' },
];

export const SPEAK = [
  { nl: 'Goedemorgen, ik wil graag een brood.', de: 'Guten Morgen, ich möchte gerne ein Brot.' },
  { nl: 'Mag ik twee broodjes, alstublieft?',   de: 'Kann ich zwei Brötchen haben, bitte?' },
  { nl: 'Hoeveel kost het?',                    de: 'Wie viel kostet es?' },
];

export const LISTEN = [
  {
    audio: 'Dat is samen vier euro vijftig.',
    q: 'Wie viel kostet die Bestellung?',
    options: ['4,50 €', '5,40 €', '14,50 €'],
    answer: 0,
  },
  {
    audio: 'Wilt u er nog iets bij?',
    q: 'Was fragt der Bäcker?',
    options: ['Ob du bezahlen willst', 'Ob du noch etwas dazu möchtest', 'Ob das alles war'],
    answer: 1,
  },
];

export const GRAMMAR = {
  title: 'de of het? — die zwei Artikel',
  body: 'Im Niederländischen gibt es nur zwei bestimmte Artikel: <b>de</b> (der/die) und <b>het</b> (das). Welcher gilt, muss man pro Wort lernen — aber es gibt eine goldene Regel:',
  rule: 'Jede Verkleinerung auf <span class="hl">-je</span> ist <span class="hl">immer het</span>: het broodje, het puntje, het taartje.',
  checks: [
    { q: '___ brood',   options: ['de', 'het'], answer: 1 },
    { q: '___ bakker',  options: ['de', 'het'], answer: 0 },
    { q: '___ broodje', options: ['de', 'het'], answer: 1 },
  ],
};

// System-Prompt für den echten Claude-Proxy (siehe README). Der Mock-Tutor nutzt eigene Logik.
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

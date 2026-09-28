import type { BagItem, PreparationItem, Priority } from "./types";

type CatalogGroup = {
  group: "mama" | "beba";
  category: string;
  priority?: Priority;
  phases?: ("before" | "hospital" | "after")[];
  items: [name: string, quantity?: string, note?: string][];
};

const catalogGroups: CatalogGroup[] = [
  {
    group: "mama", category: "Odjeća i obuća", phases: ["before", "hospital", "after"], items: [
      ["Trudničke hlače", "2–3 para"], ["Trudničke tajice", "2–3 para"], ["Trudničke majice", "3–5 kom"],
      ["Grudnjaci za dojenje", "2–3 kom", "Mekani, bez žice i s praktičnim kopčama."], ["Trudničke najlonke", "2–3 para"],
      ["Trudničke haljine", "2–3 kom"], ["Spavaćice za porod i dojenje", "3–4 kom"], ["Neklizajuće čarape", "2–3 para"],
      ["Trudničke gaćice", "7–14 kom"], ["Udobne tenisice", "1 par"], ["Papuče", "1 par"], ["Gumene natikače", "1 par"], ["Ogrtač", "1 kom"],
    ],
  },
  {
    group: "mama", category: "Dodaci za trudnoću", priority: "useful", phases: ["before", "hospital", "after"], items: [
      ["Trudnički pojas", "1 kom"], ["Trudnički jastuk", "1 kom", "Može kasnije poslužiti i kao jastuk za dojenje."],
      ["Pilates lopta", "1 kom", "Veličinu odaberi prema svojoj visini."], ["Ruksak za porod i poslije poroda", "1 kom"], ["Torba za porod", "1 kom"],
    ],
  },
  {
    group: "mama", category: "Kozmetika, higijena i njega", phases: ["hospital", "after"], items: [
      ["Ručnici", "4 kom", "2 velika i 2 manja."], ["Higijenski ulošci nakon poroda", "2–3 pakiranja"], ["Mrežaste gaćice", "7–10 kom"],
      ["Higijenske gaćice za inkontinenciju", "1 pakiranje"], ["Jednokratne nepropusne podloge", "5–10 kom"],
      ["Sprej ili gel za intimnu njegu", "1 kom"], ["Pjena za perineum", "1 kom"], ["Hamamelis oblozi", "1 pakiranje"],
      ["Peribottle", "1 kom"], ["Mast ili krema za hemoroide", "1 kom", "Prije uporabe provjeri s liječnikom."],
      ["Termalna voda u spreju", "1 sprej"],
      ["Vlažne maramice", "1 pakiranje"], ["Vlažni toaletni papir", "1 pakiranje"], ["Dezinfekcijske maramice", "1 pakiranje"],
      ["Pasta i četkica za zube", "1 set"], ["Šampon i gel za tuširanje", "1 putni set"], ["Češalj ili četka", "1 kom"],
      ["Gumice, špangice ili traka za kosu", "2–3 kom"], ["Balzam za usne", "1 kom"], ["Krema ili mlijeko za tijelo", "1 kom"],
      ["Krema za ruke", "1 kom"], ["Dezodorans", "1 kom"], ["Malo ogledalce", "1 kom"], ["Vodootporna maskara", "1 kom", "Opcionalno."],
      ["Krema ili ulje protiv strija", "1 kom"], ["Krema ili gel za umorne noge", "1 kom"], ["Krema za suhu kožu ili svrbež trbuha", "1 kom"],
    ],
  },
  {
    group: "mama", category: "Lijekovi i suplementi", phases: ["before", "hospital", "after"], items: [
      ["Prenatalni vitamini i minerali", "Po potrebi", "Koristi prema preporuci liječnika."],
      ["Lijekovi po preporuci ginekologa", "Prema terapiji"], ["Magnezij", "Prema preporuci liječnika"],
      ["Probiotici", "1–2 kutije"], ["Čaj za trudnice", "1 kutija"], ["Paracetamol", "1 pakiranje"], ["Brufen", "1 pakiranje", "Samo prema medicinskoj preporuci."],
    ],
  },
  {
    group: "mama", category: "Dodaci za dojenje", phases: ["hospital", "after"], items: [
      ["Jastučići za dojenje", "1 pakiranje"], ["Električna pumpa za izdajanje", "1 kom", "Nabavi po potrebi; ne mora se kupiti unaprijed."],
      ["Mast za bradavice", "1 tubica"], ["Komprese za bradavice", "1 pakiranje"], ["Silikonske zaštite za bradavice", "1 pakiranje"],
      ["Mekani jastuk za sjedenje", "1 kom"],
    ],
  },
  {
    group: "mama", category: "Hrana i piće", priority: "useful", phases: ["hospital"], items: [
      ["Banane", "2–3 kom"], ["Kruške", "2–3 kom"], ["Kiwi", "2–3 kom"], ["Datulje", "5–10 kom"],
      ["Suho voće", "1 manja vrećica"], ["Orašasti plodovi", "1 manja vrećica"], ["Energetske pločice", "2–3 kom"],
      ["Voćne kašice u vrećici", "2–3 kom"], ["Čokoladica", "1–2 kom"], ["Krekeri, pereci, štapići ili grisini", "1–2 pakiranja"],
      ["Žvakaće gume", "1 pakiranje"], ["Voda sa sportskim čepom ili slamkom", "1–2 boce"], ["100 % sok od jabuke", "1 boca"],
      ["Sok od šljive", "1 manja boca"], ["Čaj od mente", "1 pakiranje"], ["Čaj od komorača ili anisa", "1 pakiranje"],
      ["Donat Mg", "1 boca"], ["Izotonični napitak ili kokosova voda", "1 boca"], ["Instant zobene kašice", "1–2 vrećice"],
    ],
  },
  {
    group: "mama", category: "Ostalo bitno", priority: "useful", phases: ["hospital", "after"], items: [
      ["Vrećica za prljavo rublje", "1–2 kom"], ["Higijenske vrećice", "1 pakiranje"], ["Boca s cjevčicom", "1 kom"],
      ["Maska za oči", "1 kom"], ["Čepići za uši", "1 par"], ["Powerbank", "1 kom"], ["Slušalice", "1 kom"],
      ["Glazbena playlista", "1 lista"], ["Bilježnica i olovka", "1 set"], ["Mali ventilator ili lepeza", "1 kom"],
      ["Papirnate ili pamučne maramice", "1 pakiranje"], ["Sitni euri za automate", "5–10 €"], ["Dekica od muslina", "1 kom"],
      ["Termofor", "1 kom"], ["Naočale", "1 kom"], ["Mala stvar za sreću", "1 kom"],
    ],
  },
  {
    group: "mama", category: "Usluge i podrška", priority: "useful", phases: ["before", "hospital", "after"], items: [
      ["Pediker", "Prema potrebi"], ["Psiholog", "Prema potrebi"], ["Fizioterapeut", "Prema potrebi"], ["Frizer", "Prema potrebi"],
      ["Masaža za trudnice", "Prema potrebi"], ["Joga ili pilates za trudnice", "1–2 puta tjedno"], ["Doula podrška", "Prema dogovoru"], ["Tečaj za trudnice", "1–2 tečaja"],
    ],
  },
  {
    group: "mama", category: "Pokloni i zahvale", priority: "later", phases: ["before", "hospital", "after"], items: [
      ["Bombonijera", "1–2 kom"], ["Kava", "1–2 pakiranja"], ["Čokolada", "1–2 kom"], ["Keksi", "1–2 pakiranja"], ["Zahvalnica", "Po potrebi"],
    ],
  },
  {
    group: "beba", category: "Namještaj i tekstil", phases: ["before"], items: [
      ["Krevetić", "1 kom"], ["Madrac", "1 kom"], ["Gnijezdo za krevetić", "1 kom", "Koristi samo pod nadzorom."],
      ["Dodatni krevetić uz bračni krevet", "1 kom"], ["Plahte", "3–4 kom"], ["Vodootporna zaštita za madrac", "2 kom"],
      ["Dekica", "1–2 kom"], ["Muslin prekrivač za ljeto", "1 kom"], ["Komoda", "1 kom"], ["Boja za zid", "Po potrebi"],
      ["Ormar", "1 kom"], ["Nihaljka ili bouncer", "1 kom"], ["Kutija za igračke", "1 kom"], ["Tepih", "1 kom"],
      ["Kolica", "1 komplet"], ["Autosjedalica 0+", "1 kom", "Provjeri i-Size i sigurnosne testove; ne kupuj rabljenu nepoznate povijesti."],
      ["Jastuk za dojenje", "1 kom"], ["Podloga za previjanje", "1 kom"], ["Presvlaka za podlogu za previjanje", "2 kom"],
      ["Košara za prljavo rublje", "1 kom"], ["Police ili organizatori", "Po potrebi"], ["Zavjese za zamračenje", "1 set"],
      ["Podloga za igru", "1 kom"], ["Baby gym", "1 kom"],
    ],
  },
  {
    group: "beba", category: "Elektronika", priority: "useful", phases: ["before", "after"], items: [
      ["Sterilizator za bočice i dude", "1 kom"], ["Vrećice za sterilizaciju", "1 pakiranje"], ["Grijač za bočice", "1 kom"],
      ["Aparat za pripremu adaptiranog mlijeka", "1 kom"], ["Grijač vode za bočice", "1 kom"], ["Digitalni toplomjer", "1 kom"],
      ["Termometar za vodu", "1 kom"], ["Inhalator", "1 kom"], ["Aspirator za nos", "1 kom"], ["Baby monitor", "1 kom"],
      ["Noćna lampa ili prigušeno svjetlo", "1 kom"], ["Ovlaživač zraka", "1 kom"], ["Pročišćivač zraka", "1 kom", "Opcionalno."],
      ["Digitalna vaga za bebe", "1 kom", "Opcionalno."], ["Projektor za strop s melodijama", "1 kom", "Opcionalno."],
    ],
  },
  {
    group: "beba", category: "Kozmetika i higijena", phases: ["before", "hospital", "after"], items: [
      ["Krema za pelensko područje", "1 kom"], ["Blagi šampon za bebe", "1 kom"], ["Blagi gel za pranje", "1 kom"],
      ["Ulje ili losion za tijelo", "1 kom"], ["Bademovo ulje", "1 kom"], ["Pamučne tetra pelene", "10–15 kom"],
      ["Blazinice", "1 pakiranje"], ["Fiziološka otopina", "1 pakiranje ampula"], ["Sterilne komprese ili komplet za njegu pupka", "1 set"],
      ["Set za manikuru", "1 set"], ["Četka za kosu", "1 kom"], ["Pelene različitih veličina", "Manja pakiranja"],
      ["Ručnici s kapuljačom", "2–3 kom"], ["Čistač za nos, uši i nokte", "1 set"], ["Kozmetička baby torbica", "1 kom"],
      ["Kadica za kupanje", "1 kom"], ["Stalak za kupanje", "1 kom"], ["Deterdžent za bočice i dude", "1 kom"],
      ["Četka za bočice", "1 kom"], ["Vlažne maramice", "1 pakiranje"], ["Flasteri za bebe", "1 pakiranje"],
      ["Baby deterdžent za rublje", "1 pakiranje"], ["Stalak za sušenje bočica i dudica", "1 kom"],
      ["Krema ili mast za suhu kožu", "1 kom"], ["Spužva ili mekana krpica za kupanje", "1 kom"],
    ],
  },
  {
    group: "beba", category: "Medicinske potrepštine", phases: ["after"], items: [
      ["Kapi protiv grčeva", "Po preporuci pedijatra"], ["Antiseptik", "1 kom"], ["Mala ljekarnička torbica", "1 kom"], ["Sobni toplomjer", "1 kom"],
    ],
  },
  {
    group: "beba", category: "Odjeća prvih mjeseci", phases: ["before", "hospital", "after"], items: [
      ["Bodiji kratkih i dugih rukava", "8–10 kom, veličine 56 i 62"], ["Pamučne pidžamice", "5–6 kom, veličine 56 i 62"],
      ["Hlačice s mekanim strukom", "3–4 para"], ["Kombinezoni ili kompletići", "2–3 kom"], ["Vreća za spavanje", "1 kom"],
      ["Čarapice", "5–6 pari"], ["Kapica", "1–2 kom"], ["Lagana jaknica", "1 kom"], ["Rukavice protiv grebanja", "1–2 para", "Opcionalno."],
    ],
  },
  {
    group: "beba", category: "Knjige i igračke", priority: "later", phases: ["after"], items: [
      ["Slikovnice", "1–2 kom"], ["Kontrastne kartice", "1 set"], ["Podloga za igru", "1 kom"], ["Baby gym", "1 kom"], ["Zvečka ili grizalica", "1 kom"],
    ],
  },
  {
    group: "beba", category: "Praktični dodaci", priority: "useful", phases: ["before", "after"], items: [
      ["Bočice", "1–2 kom"], ["Dude", "1–2 kom"], ["Broš ili kopča za dudu", "1 kom"], ["Adaptirano mlijeko", "Po preporuci pedijatra"],
      ["Četka za pranje bočica", "1 kom"], ["Vrećice za zamrzavanje mlijeka", "1 pakiranje"], ["Mrežica protiv komaraca za kolica", "1 kom"],
      ["Kopča ili narukvica protiv komaraca", "1 kom", "Samo proizvod primjeren dobi."], ["Organizatori za ladice", "Po potrebi"],
      ["Baby sling ili nosiljka", "1 kom", "Odaberi anatomski model za novorođenče."], ["Torba ili ruksak za kolica", "1 kom"],
      ["Zaštitne navlake za kolica ili autosjedalicu", "1–2 kom"], ["Termosica za vodu", "1 kom"], ["Sjenilo za kolica", "1 kom"], ["Sjenila za prozore u autu", "1 set"],
    ],
  },
];

const essentialItems = new Set([
  "Grudnjaci za dojenje", "Spavaćice za porod i dojenje", "Trudničke gaćice", "Papuče", "Gumene natikače",
  "Higijenski ulošci nakon poroda", "Mrežaste gaćice", "Jednokratne nepropusne podloge", "Pasta i četkica za zube",
  "Šampon i gel za tuširanje", "Mast za bradavice", "Jastučići za dojenje", "Vrećica za prljavo rublje",
  "Krevetić", "Madrac", "Plahte", "Vodootporna zaštita za madrac", "Kolica", "Autosjedalica 0+",
  "Podloga za previjanje", "Digitalni toplomjer", "Aspirator za nos", "Krema za pelensko područje",
  "Pamučne tetra pelene", "Fiziološka otopina", "Sterilne komprese ili komplet za njegu pupka",
  "Pelene različitih veličina", "Ručnici s kapuljačom", "Bodiji kratkih i dugih rukava", "Pamučne pidžamice",
  "Čarapice", "Kapica",
]);

export const preparationCatalog: PreparationItem[] = catalogGroups.flatMap((section, sectionIndex) =>
  section.items.map(([name, quantity, note], itemIndex) => ({
    id: `pdf-${section.group}-${sectionIndex + 1}-${itemIndex + 1}`,
    name,
    group: section.group,
    category: section.category,
    priority: essentialItems.has(name) ? "essential" : section.priority ?? "useful",
    status: "need",
    quantity,
    note,
    phases: section.phases,
    plannedCost: 0,
    paidCost: 0,
  })),
);

const bagGroups: [bag: string, items: string[]][] = [
  ["Prijem", ["Dokumenti: osobna, zdravstvena, nalazi, plan poroda i potvrda krvne grupe", "Papuče", "Spavaćica za porod", "Veliki ručnik", "Vlažne maramice", "Higijenski ulošci nakon poroda", "Mrežaste gaćice"]],
  ["Rađaona", ["Balzam za usne", "Sprej za nos ili otopina morske vode", "Papirnate maramice", "Mobitel", "Dugi kabel za punjenje", "Tablete protiv žgaravice", "Mali ventilator ili lepeza", "Mirisni sprej ili eterično ulje", "Čarape", "Gumice ili špangice", "Mali talisman ili sitnica za sreću", "Žvakaće gume", "Termalna voda u spreju"]],
  ["Mama", ["Spavaćice za dojenje (2–3)", "Ogrtač", "Udobni donji dio ili pidžama", "Udobne pamučne gaćice", "Grudnjaci za dojenje (2–3)", "Potkošulje za dojenje (1–2)", "Čarape", "Gumene natikače za tuširanje", "Higijenski ulošci nakon poroda", "Vlažne i dezinfekcijske maramice", "Rola toaletnog papira", "Dodatne mrežaste gaćice", "Jednokratne podloge", "Kozmetička torbica", "Pjena ili sprej za perineum ili hamamelis oblozi", "Peribottle", "Mast za bradavice", "Silikonske zaštite za bradavice", "Mast ili krema za hemoroide", "Lijekovi i suplementi koje koristiš", "Paracetamol ili Brufen u originalnom pakiranju", "Čepići za uši", "Maska za oči", "Powerbank", "Slušalice", "Boca sa slamkom", "Bilježnica i olovka", "Hrana i grickalice", "Pića"]],
  ["Beba", ["Pelene za novorođenče", "Vlažne maramice", "Tetra pelene male (2)", "Tetra pelena velika (1)", "Krema za guzu", "Duda (1–2)"]],
  ["Pratnja", ["Udobna odjeća i obuća", "Boca s vodom ili energetski napitak", "Grickalice ili energetske pločice", "Mobitel i punjač s dugim kabelom", "Slušalice", "Dekica ili pulover", "Osnovni higijenski pribor", "Bilježnica i olovka", "Sterilna haljina za jednokratnu upotrebu"]],
  ["Za izlazak", ["Haljina ili udobna odjeća za mamu", "Grudnjak za dojenje", "Čarape za mamu", "Tenisice ili udobna obuća", "Sunčane naočale", "Naušnice ili feel-good sitnica", "Bodi kratkih rukava", "Bodi dugih rukava", "Hlačice ili pidžamica", "Čarapice za bebu", "Kapica", "Kombinezon ili slojevita odjeća", "Dekica za izlazak", "Autosjedalica ili jaje"]],
];

export const bagCatalog: BagItem[] = bagGroups.flatMap(([bag, items], bagIndex) => items.map((name, itemIndex) => ({
  id: `pdf-bag-${bagIndex + 1}-${itemIndex + 1}`,
  bag,
  name,
  packed: false,
})));

export const categoryGuides: Record<string, string> = {
  "Odjeća i obuća": "Biraj mekane, praktične i lako perive komade koje možeš koristiti u više faza. Ne kupuj sve odjednom.",
  "Dodaci za trudnoću": "Odaberi samo ono što ti donosi stvarnu udobnost; prednost imaju stvari koje ćeš koristiti i nakon poroda.",
  "Kozmetika, higijena i njega": "Za početak odaberi nekoliko blagih proizvoda za higijenu i oporavak. Ostalo možeš kupiti prema potrebi.",
  "Lijekovi i suplementi": "Lijekove i suplemente koristi isključivo prema uputama liječnika.",
  "Dodaci za dojenje": "Za početak su dovoljni jastučići i mast; ostalo nabavi tek ako se pokaže potrebnim.",
  "Hrana i piće": "Ponesi nekoliko provjerenih, originalno zapakiranih zalogaja i napitaka koje zaista voliš.",
  "Ostalo bitno": "Ove stavke nisu nužne. Dodaj samo ono što znaš da ćeš koristiti.",
  "Usluge i podrška": "Zapiši usluge, osobe ili edukacije koje želiš dogovoriti prije ili nakon poroda.",
  "Pokloni i zahvale": "Poklon nije obaveza; iskrena poruka ili mala gesta sasvim su dovoljni.",
  "Namještaj i tekstil": "Prvo riješi sigurnu osnovu: krevetić, madrac, plahte, autosjedalicu i kolica. Ostalo dodaj prema prostoru i navikama.",
  Elektronika: "Kupuj postupno. Pouzdan toplomjer, aspirator i blago noćno svjetlo važniji su od velike količine uređaja.",
  "Kozmetika i higijena": "Kreni s pelenama, tetra pelenama, kremom, fiziološkom i ručnicima; biraj proizvode bez parfema.",
  "Medicinske potrepštine": "Drži samo osnovu, a preparate koristi uz preporuku pedijatra.",
  "Odjeća prvih mjeseci": "Najviše kupuj veličine 56 i 62, a najmanje veličine samo nekoliko komada. Prilagodi slojeve sezoni.",
  "Knjige i igračke": "U prvim tjednima dovoljni su kontrasti, jedna slikovnica i sigurna podloga; bebi ne treba mnogo podražaja.",
  "Praktični dodaci": "Počni s malom količinom i dokupuj prema stvarnim potrebama bebe i vašem načinu života.",
};

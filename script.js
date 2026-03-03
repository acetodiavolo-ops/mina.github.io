// ==================== GLOBAL VARIABLES (hoisted to top) ====================
let carouselIndices = { en: 0, al: 0, it: 0 };
let autoPlayIntervals = { en: null, al: null, it: null };
let langIndex = 0;
const langBtnText = document.getElementById('langBtnText');

// ==================== LANGUAGE CONTENT ====================
const content = {
  en: {
    hero: {
      preTitle: "Two decades of precision",
      title: "<h1 class=\"text-5xl md:text-6xl font-bold mt-4 mb-6 leading-tight hero-title\">Watch Repair & <span class=\"gold\">Key Copy</span> in Durres</h1>",
      description: "Family-owned since 2002. We specialize in quartz watches and all types of keys. Battery replacement <span class=\"font-bold gold\">under 2 minutes</span> – quality you can trust.",
      btn1: "Visit Our Workshop",
      btn2: "Discover Services",
      badges: ["💰 Affordable quality", "⚡ Most repairs in under 15 min"]
    },
    promise: [
      { icon: "fa-bolt", title: "Fast Service", desc: "Battery in under 2 min" },
      { icon: "fa-cogs", title: "Expert Craftsmanship", desc: "Over 20 years experience" },
      { icon: "fa-euro-sign", title: "Fair Prices", desc: "No hidden fees" },
      { icon: "fa-check-circle", title: "Guaranteed Work", desc: "Quality you can trust" }
    ],
    trust: [
      { icon: "fa-calendar-alt", title: "Since 2002", desc: "years", dataLang: "en", value: "years" },
      { icon: "fa-clock", title: "350K+", desc: "Watches repaired" },
      { icon: "fa-key", title: "700K+", desc: "Keys copied" },
      { icon: "fa-smile", title: "15K+", desc: "Happy customers" }
    ],
    badge: "Over {years} Years of Experience",
    why: [
      { icon: "fa-gem", title: "Skills Honed Over Decades", desc: "Family-owned craftsmanship with over 20 years of experience. Every watch and key receives personal attention." },
      { icon: "fa-microscope", title: "Precision Equipment", desc: "Professional key cutting machines and watch diagnostics – accuracy to the micron." },
      { icon: "fa-hand-holding-heart", title: "Personal Attention", desc: "We treat your items as if they were our own. No job is too small, and most repairs are done while you wait." }
    ],
    workshop: {
      title: "The <span class=\"gold\">Craftsman's Workshop</span>",
      heading: "Where Precision Meets Passion",
      text: "Step into our family workshop – a space filled with the hum of machinery, the gleam of polished tools, and over twenty years of dedication. Every surface tells a story of watches revived and keys crafted. This is where your timepieces and security are entrusted to hands that truly care."
    },
    services: [
      { icon: "fa-battery-three-quarters", title: "Watch Battery Replacement", desc: "Quick, careful replacement for quartz watches of all brands. We test and guarantee. Takes <span class=\"font-bold gold\">under 2 minutes</span>." },
      { icon: "fa-clock", title: "Strap & Bracelet Fitting", desc: "Leather, metal, nylon – we fit and adjust any strap. Wide selection available while you wait." },
      { icon: "fa-cogs", title: "Watch Servicing", desc: "We specialize in quartz movements, and can also service mechanical and automatic watches depending on the repair needed." },
      { icon: "fa-hourglass-half", title: "Clock Repair", desc: "Wall clocks, mantel clocks, grandfather clocks – we restore timepieces of all sizes." },
      { icon: "fa-key", title: "Key Copy Services", desc: "Standard, security, and restricted keys – duplicated with precision using original blanks. (No car keys)" },
      { icon: "fa-shield-alt", title: "High‑Security Keys", desc: "Advanced cutting for dimple and tubular keys. We do not copy car keys or laser keys." }
    ],
    equipment: [
      { icon: "fa-cog", title: "Precision Key Cutting", desc: "Professional key cutting machines for standard, security, and dimple keys." },
      { icon: "fa-microscope", title: "Watch Inspection Microscopes", desc: "High‑magnification digital microscopes for detailed diagnostics." },
      { icon: "fa-tachometer-alt", title: "Timing Machines", desc: "Advanced timegraphers to regulate mechanical watches with extreme accuracy." }
    ],
    process: [
      { icon: "fa-search", title: "1. Diagnosis", desc: "We inspect your watch or key with professional tools to identify the exact requirement." },
      { icon: "fa-tools", title: "2. Precision Work", desc: "Using specialized machinery, we perform the repair or duplication with micron accuracy." },
      { icon: "fa-check-circle", title: "3. Quality Check", desc: "Every piece is tested thoroughly before being returned to you." }
    ],
    gallery: {
      title: "Our <span class=\"gold\">Workshop in Real Life</span>",
      desc: "Step inside our family workshop – every image is a real, unedited moment.",
      items: [
        { src: "https://i.postimg.cc/XqTkpvHm/bc00c411-3cfc-41e7-96ed-da34c9246e1f.jpg", webp: "https://i.postimg.cc/XqTkpvHm/bc00c411-3cfc-41e7-96ed-da34c9246e1f.webp", alt: "Iglisi Watch & Key shop sign in Durres", title: "Shop sign" },
        { src: "https://i.postimg.cc/NjtP4ND6/73a4af5a-44ee-4f97-af3d-745b265ca9c7.jpg", webp: "https://i.postimg.cc/NjtP4ND6/73a4af5a-44ee-4f97-af3d-745b265ca9c7.webp", alt: "Watch repair workbench at Iglisi workshop", title: "Workbench" },
        { src: "https://i.postimg.cc/LsCCmmpv/4321b2b5-af19-4888-980f-c95829f43af2.jpg", webp: "https://i.postimg.cc/LsCCmmpv/4321b2b5-af19-4888-980f-c95829f43af2.webp", alt: "Key cutting machines at Iglisi in Durres", title: "Key machines" },
        { src: "https://i.postimg.cc/wv1WvnxR/639d7b56-b8fb-4627-9405-0ec70ad24985.jpg", webp: "https://i.postimg.cc/wv1WvnxR/639d7b56-b8fb-4627-9405-0ec70ad24985.webp", alt: "Watch repair equipment and tools", title: "Watch repair equipment" },
        { src: "https://i.postimg.cc/d3d4RdyL/3807368a-ccf3-42ab-bf49-bffea24d52df.jpg", webp: "https://i.postimg.cc/d3d4RdyL/3807368a-ccf3-42ab-bf49-bffea24d52df.webp", alt: "Interior of Iglisi watch repair workshop", title: "Workshop interior" },
        { src: "https://i.postimg.cc/4N6Wm6G2/baeedd7f-fd23-4141-b683-fad2b4ee32ce.jpg", webp: "https://i.postimg.cc/4N6Wm6G2/baeedd7f-fd23-4141-b683-fad2b4ee32ce.webp", alt: "Key blanks display at Iglisi key copy service", title: "Key blanks" }
      ]
    },
    reviews: {
      title: "What Our <span class=\"gold\">Customers Say</span>",
      slides: [
        { stars: 5, text: "I'd recommend him to everyone living in Durres. Really appreciate the work and professionalism he shows. 10/10", author: "Feta Dosti" },
        { stars: 5, text: "Took my watch in for repair and he fixed it perfectly. Fast, reliable, and really knows his craft. Very satisfied.", author: "Kristian Pando" },
        { stars: 5, text: "Sent my watch to get it fixed. Got it back in a day. Amazing work", author: "Deni Tabaku" },
        { stars: 5, text: "I had a very good experience with this service. The repair was done with care and within the time frame I was told. Communication was clear throughout the process. I would recommend it to anyone looking for watch repair in Durres.", author: "Elis Xhaferaj" }
      ],
      googleReview: "Leave a Review on Google"
    },
    faq: [
      { q: "How long does a watch battery replacement take?", a: "Usually <span class=\"font-bold gold\">under 2 minutes</span> while you wait." },
      { q: "Do you repair all types of watches?", a: "We specialize in quartz watches, and we can also service mechanical and automatic watches depending on the repair needed." },
      { q: "What types of keys can you copy?", a: "We copy standard house keys, office keys, and high‑security keys. We do not copy car keys." }
    ],
    contact: {
      title: "Get In <span class=\"gold\">Touch</span>",
      visit: "Visit our workshop",
      address: "Rruga Aleksander Goga, Durres 2001, Albania",
      primary: "Primary:",
      secondary: "Secondary:",
      hours: "Mon–Sat: 8:30 AM – 8:30 PM<br>Sunday: Closed",
      mapBtn: "Open in Google Maps",
      whatsappBtn: "WhatsApp",
      dirBtn: "Get Directions"
    }
  },
  al: {
    hero: {
      preTitle: "Dy dekada precizion",
      title: "<h1 class=\"text-5xl md:text-6xl font-bold mt-4 mb-6 leading-tight hero-title\">Riparim Orash & <span class=\"gold\">Kopje Çelësash</span> në Durrës</h1>",
      description: "Biznes familjar që nga 2002. Specializohemi në ora kuarci dhe të gjitha llojet e çelësave. Ndërrim baterie <span class=\"font-bold gold\">nën 2 minuta</span> – cilësi e besueshme.",
      btn1: "Vizitoni Punishten",
      btn2: "Shërbimet Tona",
      badges: ["💰 Cilësi e përballueshme", "⚡ Shumica nën 15 min"]
    },
    promise: [
      { icon: "fa-bolt", title: "Shërbim i Shpejtë", desc: "Bateria nën 2 min" },
      { icon: "fa-cogs", title: "Mjeshtëri Eksperte", desc: "Mbi 20 vjet përvojë" },
      { icon: "fa-euro-sign", title: "Çmime të Drejta", desc: "Pa kosto të fshehura" },
      { icon: "fa-check-circle", title: "Punë e Garantuar", desc: "Cilësi e besueshme" }
    ],
    trust: [
      { icon: "fa-calendar-alt", title: "Që nga 2002", desc: "vjet", dataLang: "al", value: "vjet" },
      { icon: "fa-clock", title: "350K+", desc: "Ora të riparuara" },
      { icon: "fa-key", title: "700K+", desc: "Çelësa të kopjuar" },
      { icon: "fa-smile", title: "15K+", desc: "Klientë të kënaqur" }
    ],
    badge: "Mbi {years} Vjet Përvojë",
    why: [
      { icon: "fa-gem", title: "Aftësi të Përpunuara", desc: "Mjeshtëri familjare me mbi 20 vjet përvojë. Çdo orë dhe çelës merr vëmendje personale." },
      { icon: "fa-microscope", title: "Pajisje Precize", desc: "Makineri profesionale për prerje çelësash dhe diagnostikim orësh – saktësi në mikron." },
      { icon: "fa-hand-holding-heart", title: "Kujdes Personal", desc: "I trajtojmë sendet tuaja sikur të ishin tonat. Shumica e riparimeve bëhen ndërsa prisni." }
    ],
    workshop: {
      title: "Punishtja e <span class=\"gold\">Mjeshtrit</span>",
      heading: "Ku Precisioni Takon Pasionin",
      text: "Hyni në punishten tonë familjare – një hapësirë e mbushur me zhurmën e makinerive, shkëlqimin e mjeteve të lëmuara dhe mbi njëzet vjet përkushtim. Çdo sipërfaqe tregon një histori orësh të ringjallura dhe çelësash të punuar. Këtu, koha dhe siguria juaj i besohen duarve që kujdesen vërtet."
    },
    services: [
      { icon: "fa-battery-three-quarters", title: "Ndërrim Baterie Ore", desc: "Zëvendësim i shpejtë për ora kuarci. Testim dhe garanci. <span class=\"font-bold gold\">Nën 2 minuta</span>." },
      { icon: "fa-clock", title: "Vendosje Rripash", desc: "Lëkurë, metal, najlon – vendosim çdo lloj rripi. Gama të ndryshme në dispozicion." },
      { icon: "fa-cogs", title: "Servis Orësh", desc: "Specializohemi në mekanizma kuarci, por mund të servisojmë edhe orë mekanike/automatike." },
      { icon: "fa-hourglass-half", title: "Riparim Orësh Muri", desc: "Ora muri, oxhaku, orët e gjyshërve – restaurimi i të gjitha llojeve." },
      { icon: "fa-key", title: "Kopje Çelësash", desc: "Standard, sigurie dhe të kufizuar – kopjuar me saktësi. (Jo çelësa makine)" },
      { icon: "fa-shield-alt", title: "Çelësa Sigurie të Lartë", desc: "Prerje e avancuar për çelësa dimple dhe tubular. Nuk bëjmë kopje të çelësave të makinave." }
    ],
    equipment: [
      { icon: "fa-cog", title: "Prerje Precize e Çelësave", desc: "Makineri profesionale për çelësa standard, sigurie dhe dimple." },
      { icon: "fa-microscope", title: "Mikroskopë Inspektimi", desc: "Mikroskopë dixhitalë me zmadhim të lartë për diagnostikim të detajuar." },
      { icon: "fa-tachometer-alt", title: "Makina Matëse të Kohës", desc: "Timegrapher të avancuar për rregullimin e orëve mekanike me saktësi ekstreme." }
    ],
    process: [
      { icon: "fa-search", title: "1. Diagnostikimi", desc: "Inspektojmë orën ose çelësin me mjete profesionale për të identifikuar nevojën e saktë." },
      { icon: "fa-tools", title: "2. Puna Precize", desc: "Duke përdorur makineri të specializuara, kryejmë riparimin ose kopjimin me saktësi mikronike." },
      { icon: "fa-check-circle", title: "3. Kontrolli i Cilësisë", desc: "Çdo pjesë testohet tërësisht para se t'ju kthehet." }
    ],
    gallery: {
      title: "Punishtja <span class=\"gold\">Jonë në Jetë Reale</span>",
      desc: "Hyni në punishten tonë familjare – çdo foto është një moment i vërtetë, i paprekur.",
      items: [
        { src: "https://i.postimg.cc/XqTkpvHm/bc00c411-3cfc-41e7-96ed-da34c9246e1f.jpg", webp: "https://i.postimg.cc/XqTkpvHm/bc00c411-3cfc-41e7-96ed-da34c9246e1f.webp", alt: "Tabela e dyqanit Iglisi në Durrës", title: "Tabela e dyqanit" },
        { src: "https://i.postimg.cc/NjtP4ND6/73a4af5a-44ee-4f97-af3d-745b265ca9c7.jpg", webp: "https://i.postimg.cc/NjtP4ND6/73a4af5a-44ee-4f97-af3d-745b265ca9c7.webp", alt: "Banka e punës për riparim orash", title: "Banka e punës" },
        { src: "https://i.postimg.cc/LsCCmmpv/4321b2b5-af19-4888-980f-c95829f43af2.jpg", webp: "https://i.postimg.cc/LsCCmmpv/4321b2b5-af19-4888-980f-c95829f43af2.webp", alt: "Makineri për kopje çelësash", title: "Makineri për çelësa" },
        { src: "https://i.postimg.cc/wv1WvnxR/639d7b56-b8fb-4627-9405-0ec70ad24985.jpg", webp: "https://i.postimg.cc/wv1WvnxR/639d7b56-b8fb-4627-9405-0ec70ad24985.webp", alt: "Pajisje për riparim orash", title: "Pajisje për orë" },
        { src: "https://i.postimg.cc/d3d4RdyL/3807368a-ccf3-42ab-bf49-bffea24d52df.jpg", webp: "https://i.postimg.cc/d3d4RdyL/3807368a-ccf3-42ab-bf49-bffea24d52df.webp", alt: "Brendësia e punishtes Iglisi", title: "Brendësia e punishtes" },
        { src: "https://i.postimg.cc/4N6Wm6G2/baeedd7f-fd23-4141-b683-fad2b4ee32ce.jpg", webp: "https://i.postimg.cc/4N6Wm6G2/baeedd7f-fd23-4141-b683-fad2b4ee32ce.webp", alt: "Çelësa të ndryshëm në punishte", title: "Çelësa të ndryshëm" }
      ]
    },
    reviews: {
      title: "Çfarë <span class=\"gold\">Thonë Klientët</span>",
      slides: [
        { stars: 5, text: "I'd recommend him to everyone living in Durres. Really appreciate the work and professionalism he shows. 10/10", author: "Feta Dosti" },
        { stars: 5, text: "Took my watch in for repair and he fixed it perfectly. Fast, reliable, and really knows his craft. Very satisfied.", author: "Kristian Pando" },
        { stars: 5, text: "Sent my watch to get it fixed. Got it back in a day. Amazing work", author: "Deni Tabaku" },
        { stars: 5, text: "I had a very good experience with this service. The repair was done with care and within the time frame I was told. Communication was clear throughout the process. I would recommend it to anyone looking for watch repair in Durres.", author: "Elis Xhaferaj" }
      ],
      googleReview: "Shkruaj një Koment në Google"
    },
    faq: [
      { q: "Sa kohë duhet për të ndërruar baterinë e orës?", a: "Zakonisht <span class=\"font-bold gold\">nën 2 minuta</span>, ndërsa prisni." },
      { q: "A riparoni të gjitha llojet e orëve?", a: "Specializohemi në ora kuarci, por mund të riparojmë edhe orë mekanike/automatike në varësi të nevojës." },
      { q: "Çfarë lloj çelësash kopjoni?", a: "Kopjojmë çelësa standard shtëpie, zyre dhe çelësa sigurie. Nuk kopjojmë çelësa makine." }
    ],
    contact: {
      title: "Na <span class=\"gold\">Kontaktoni</span>",
      visit: "Vizitoni punishten tonë",
      address: "Rruga Aleksandër Goga, Durrës 2001, Shqipëri",
      primary: "Kryesor:",
      secondary: "Sekondar:",
      hours: "Hën–Sht: 8:30 – 20:30<br>Die: Mbyllur",
      mapBtn: "Hap në Google Maps",
      whatsappBtn: "WhatsApp",
      dirBtn: "Merr Drejtime"
    }
  },
  it: {
    hero: {
      preTitle: "Due decenni di precisione",
      title: "<h1 class=\"text-5xl md:text-6xl font-bold mt-4 mb-6 leading-tight hero-title\">Riparazione Orologi & <span class=\"gold\">Duplicazione Chiavi</span> a Durazzo</h1>",
      description: "Azienda familiare dal 2002. Specializzati in orologi al quarzo e tutti i tipi di chiavi. Sostituzione batteria <span class=\"font-bold gold\">in meno di 2 minuti</span> – qualità affidabile.",
      btn1: "Visita il Laboratorio",
      btn2: "Scopri i Servizi",
      badges: ["💰 Qualità accessibile", "⚡ La maggior parte in meno di 15 min"]
    },
    promise: [
      { icon: "fa-bolt", title: "Servizio Veloce", desc: "Batteria in meno di 2 min" },
      { icon: "fa-cogs", title: "Artigianato Esperto", desc: "Oltre 20 anni di esperienza" },
      { icon: "fa-euro-sign", title: "Prezzi Onesti", desc: "Nessun costo nascosto" },
      { icon: "fa-check-circle", title: "Lavoro Garantito", desc: "Qualità affidabile" }
    ],
    trust: [
      { icon: "fa-calendar-alt", title: "Dal 2002", desc: "anni", dataLang: "it", value: "anni" },
      { icon: "fa-clock", title: "350K+", desc: "Orologi riparati" },
      { icon: "fa-key", title: "700K+", desc: "Chiavi duplicate" },
      { icon: "fa-smile", title: "15K+", desc: "Clienti soddisfatti" }
    ],
    badge: "Oltre {years} Anni di Esperienza",
    why: [
      { icon: "fa-gem", title: "Competenze Affinate", desc: "Artigianato familiare con oltre 20 anni di esperienza. Ogni orologio e chiave riceve attenzione personale." },
      { icon: "fa-microscope", title: "Attrezzature di Precisione", desc: "Macchinari professionali per il taglio delle chiavi e la diagnostica degli orologi – precisione al micron." },
      { icon: "fa-hand-holding-heart", title: "Attenzione Personale", desc: "Trattiamo i vostri oggetti come fossero nostri. La maggior parte delle riparazioni vengono eseguite in attesa." }
    ],
    workshop: {
      title: "L'Officina del <span class=\"gold\">Maestro</span>",
      heading: "Dove la Precisione Incontra la Passione",
      text: "Entrate nel nostro laboratorio di famiglia – uno spazio pieno del ronzio dei macchinari, del luccichio degli attrezzi lucidati e di oltre vent'anni di dedizione. Ogni superficie racconta una storia di orologi riportati in vita e chiavi realizzate. Qui, il vostro tempo e la vostra sicurezza sono affidati a mani che si prendono cura davvero."
    },
    services: [
      { icon: "fa-battery-three-quarters", title: "Sostituzione Batteria", desc: "Sostituzione rapida per orologi al quarzo. Testiamo e garantiamo. <span class=\"font-bold gold\">In meno di 2 minuti</span>." },
      { icon: "fa-clock", title: "Montaggio Cinturini", desc: "Pelle, metallo, nylon – montiamo e regoliamo qualsiasi cinturino. Ampia selezione disponibile." },
      { icon: "fa-cogs", title: "Manutenzione Orologi", desc: "Specializzati in movimenti al quarzo, ma possiamo riparare anche orologi meccanici/automatici." },
      { icon: "fa-hourglass-half", title: "Riparazione Orologi da Parete", desc: "Orologi da parete, da camino, a pendolo – restauriamo tutti i tipi." },
      { icon: "fa-key", title: "Duplicazione Chiavi", desc: "Chiavi standard, di sicurezza e limitate – duplicate con precisione. (Non chiavi auto)" },
      { icon: "fa-shield-alt", title: "Chiavi ad Alta Sicurezza", desc: "Taglio avanzato per chiavi dimple e tubolari. Non copiamo chiavi auto o laser." }
    ],
    equipment: [
      { icon: "fa-cog", title: "Taglio Chiavi di Precisione", desc: "Macchine professionali per chiavi standard, di sicurezza e dimple." },
      { icon: "fa-microscope", title: "Microscopi per Ispezione", desc: "Microscopi digitali ad alto ingrandimento per una diagnostica dettagliata." },
      { icon: "fa-tachometer-alt", title: "Macchine per la Misura del Tempo", desc: "Timegrapher avanzati per regolare gli orologi meccanici con precisione assoluta." }
    ],
    process: [
      { icon: "fa-search", title: "1. Diagnosi", desc: "Ispezioniamo il vostro orologio o chiave con strumenti professionali." },
      { icon: "fa-tools", title: "2. Lavoro di Precisione", desc: "Utilizzando macchinari specializzati, eseguiamo la riparazione con precisione al micron." },
      { icon: "fa-check-circle", title: "3. Controllo Qualità", desc: "Ogni pezzo viene testato accuratamente prima di essere restituito." }
    ],
    gallery: {
      title: "Il Nostro <span class=\"gold\">Laboratorio dal Vivo</span>",
      desc: "Entrate nel nostro laboratorio di famiglia – ogni immagine è un momento reale.",
      items: [
        { src: "https://i.postimg.cc/XqTkpvHm/bc00c411-3cfc-41e7-96ed-da34c9246e1f.jpg", webp: "https://i.postimg.cc/XqTkpvHm/bc00c411-3cfc-41e7-96ed-da34c9246e1f.webp", alt: "Insegna del negozio Iglisi a Durazzo", title: "Insegna del negozio" },
        { src: "https://i.postimg.cc/NjtP4ND6/73a4af5a-44ee-4f97-af3d-745b265ca9c7.jpg", webp: "https://i.postimg.cc/NjtP4ND6/73a4af5a-44ee-4f97-af3d-745b265ca9c7.webp", alt: "Banco da lavoro per riparazione orologi", title: "Banco da lavoro" },
        { src: "https://i.postimg.cc/LsCCmmpv/4321b2b5-af19-4888-980f-c95829f43af2.jpg", webp: "https://i.postimg.cc/LsCCmmpv/4321b2b5-af19-4888-980f-c95829f43af2.webp", alt: "Macchine per duplicazione chiavi", title: "Macchine per chiavi" },
        { src: "https://i.postimg.cc/wv1WvnxR/639d7b56-b8fb-4627-9405-0ec70ad24985.jpg", webp: "https://i.postimg.cc/wv1WvnxR/639d7b56-b8fb-4627-9405-0ec70ad24985.webp", alt: "Attrezzature per riparazione orologi", title: "Attrezzature per orologi" },
        { src: "https://i.postimg.cc/d3d4RdyL/3807368a-ccf3-42ab-bf49-bffea24d52df.jpg", webp: "https://i.postimg.cc/d3d4RdyL/3807368a-ccf3-42ab-bf49-bffea24d52df.webp", alt: "Interno del laboratorio Iglisi", title: "Interno del laboratorio" },
        { src: "https://i.postimg.cc/4N6Wm6G2/baeedd7f-fd23-4141-b683-fad2b4ee32ce.jpg", webp: "https://i.postimg.cc/4N6Wm6G2/baeedd7f-fd23-4141-b683-fad2b4ee32ce.webp", alt: "Esposizione di chiavi nel laboratorio", title: "Esposizione chiavi" }
      ]
    },
    reviews: {
      title: "Cosa Dicono i <span class=\"gold\">Nostri Clienti</span>",
      slides: [
        { stars: 5, text: "Lo consiglio a tutti quelli che vivono a Durazzo. Apprezzo davvero il lavoro e la professionalità che mostra. 10/10", author: "Feta Dosti" },
        { stars: 5, text: "Ho portato il mio orologio per una riparazione e l'ha riparato perfettamente. Veloce, affidabile e conosce davvero il suo mestiere.", author: "Kristian Pando" },
        { stars: 5, text: "Ho mandato il mio orologio per farlo riparare. Me lo hanno restituito in un giorno. Lavoro fantastico.", author: "Deni Tabaku" },
        { stars: 5, text: "Ho avuto un'esperienza molto positiva con questo servizio. La riparazione è stata eseguita con cura e nei tempi concordati. Lo consiglierei a chiunque.", author: "Elis Xhaferaj" }
      ],
      googleReview: "Lascia una Recensione su Google"
    },
    faq: [
      { q: "Quanto tempo per sostituire la batteria?", a: "<span class=\"font-bold gold\">Meno di 2 minuti</span> mentre aspetti." },
      { q: "Riparate tutti i tipi di orologi?", a: "Specializzati in orologi al quarzo, ma possiamo riparare anche orologi meccanici/automatici." },
      { q: "Che tipi di chiavi copiate?", a: "Copiamo chiavi standard per casa, ufficio e chiavi di sicurezza. Non copiamo chiavi auto." }
    ],
    contact: {
      title: "Mettiti in <span class=\"gold\">Contatto</span>",
      visit: "Visita il nostro laboratorio",
      address: "Rruga Aleksander Goga, Durazzo 2001, Albania",
      primary: "Principale:",
      secondary: "Secondario:",
      hours: "Lun–Sab: 8:30 – 20:30<br>Dom: Chiuso",
      mapBtn: "Apri in Google Maps",
      whatsappBtn: "WhatsApp",
      dirBtn: "Indicazioni"
    }
  }
};

// ==================== RENDERING FUNCTION ====================
function renderLang(lang) {
  const c = content[lang];
  const container = document.getElementById('content-container');
  if (!container) return;

  const startYear = 2002;
  const currentYear = new Date().getFullYear();
  const years = currentYear - startYear;

  let html = `
    <!-- HERO -->
    <section class="hero-bg relative py-16 border-b border-gray-200">
      <div class="hero-overlay"></div>
      <div class="hero-content max-w-7xl mx-auto px-6 text-center text-white">
        <span class="gold uppercase tracking-widest text-sm font-semibold">${c.hero.preTitle}</span>
        ${c.hero.title}
        <p class="text-xl text-gray-200 max-w-3xl mx-auto mb-8">${c.hero.description}</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a href="#contact-${lang}" class="btn-primary">${c.hero.btn1}</a>
          <a href="#services-${lang}" class="btn-secondary">${c.hero.btn2}</a>
        </div>
        <div class="mt-6 flex justify-center items-center gap-2 text-white/80">
          <span class="text-sm">${c.hero.badges[0]}</span>
          <span class="mx-2">•</span>
          <span class="text-sm">${c.hero.badges[1]}</span>
        </div>
      </div>
    </section>

    <!-- SERVICE PROMISE -->
    <section class="pt-16 pb-8 bg-white/70" data-aos="fade-up">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${c.promise.map(p => `
            <div class="promise-card">
              <i class="fas ${p.icon} promise-icon"></i>
              <h3 class="font-bold text-lg">${p.title}</h3>
              <p class="text-gray-500 text-sm">${p.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- TRUST BADGES -->
    <section class="pb-16 pt-8 bg-white/70" data-aos="fade-up">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${c.trust.map((t, idx) => {
            if (idx === 0) {
              return `<div class="trust-badge block"><i class="fas ${t.icon} text-3xl gold mb-2"></i><h3 class="font-bold text-xl">${t.title}</h3><p class="text-gray-500 text-sm years-exp" data-lang="${t.dataLang}">${years}+ ${t.value}</p></div>`;
            } else {
              return `<div class="trust-badge block"><i class="fas ${t.icon} text-3xl gold mb-2"></i><h3 class="font-bold text-xl">${t.title}</h3><p class="text-gray-500 text-sm">${t.desc}</p></div>`;
            }
          }).join('')}
        </div>
        <div class="mt-6 pt-16 text-center">
          <span class="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gold shadow-sm">
            <i class="fas fa-star text-gold"></i>
            <span class="font-semibold badge-years" data-lang="${lang}">${c.badge.replace('{years}', years)}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="py-24 bg-white" data-aos="fade-up">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">Why <span class="gold">Choose Us</span></h2>
        <div class="grid md:grid-cols-3 gap-8">
          ${c.why.map(w => `
            <div class="service-card"><i class="fas ${w.icon} text-4xl gold mb-6"></i><h3 class="text-2xl font-bold mb-3">${w.title}</h3><p class="text-gray-600">${w.desc}</p></div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- WORKSHOP -->
    <section class="py-24 bg-gray-50" data-aos="fade-up">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">${c.workshop.title}</h2>
        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div class="md:w-1/3">
            <picture>
              <source srcset="https://i.postimg.cc/NjtP4ND6/73a4af5a-44ee-4f97-af3d-745b265ca9c7.webp" type="image/webp">
              <img src="https://i.postimg.cc/NjtP4ND6/73a4af5a-44ee-4f97-af3d-745b265ca9c7.jpg" alt="${c.gallery.items[1].alt}" class="rounded-2xl shadow-xl border border-gray-200" loading="lazy">
            </picture>
          </div>
          <div class="md:w-2/3">
            <p class="text-2xl font-bold mb-4">${c.workshop.heading}</p>
            <p class="text-gray-600 text-lg leading-relaxed">${c.workshop.text}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section id="services-${lang}" class="py-24 bg-white" data-aos="fade-up">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">Our <span class="gold">Services</span></h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${c.services.map(s => `
            <div class="service-card"><div class="w-14 h-14 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center mb-6"><i class="fas ${s.icon} text-2xl gold"></i></div><h3 class="text-2xl font-bold mb-3">${s.title}</h3><p class="text-gray-500">${s.desc}</p></div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- EQUIPMENT -->
    <section class="py-24 bg-gray-50" data-aos="fade-up">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">Our <span class="gold">Equipment</span></h2>
        <div class="grid md:grid-cols-3 gap-8">
          ${c.equipment.map(e => `
            <div class="equipment-card text-center"><i class="fas ${e.icon} equipment-icon"></i><h3 class="text-2xl font-bold mb-3">${e.title}</h3><p class="text-gray-600">${e.desc}</p></div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="py-24 bg-white" data-aos="fade-up">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">Our <span class="gold">Process</span></h2>
        <div class="space-y-8">
          ${c.process.map((p, idx) => `
            <div class="timeline-item" data-aos="fade-right" ${idx > 0 ? `data-aos-delay="${idx*100}"` : ''}>
              <div class="timeline-icon"><i class="fas ${p.icon}"></i></div>
              <div><h3 class="text-2xl font-bold mb-2">${p.title}</h3><p class="text-gray-600">${p.desc}</p></div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- GALLERY -->
    <section class="py-24 bg-gray-50" data-aos="fade-up">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">${c.gallery.title}</h2>
        <p class="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">${c.gallery.desc}</p>
        <div class="gallery-grid">
          ${c.gallery.items.map(img => `
            <a href="${img.src}" data-lightbox="workshop-${lang}" data-title="${img.title}">
              <picture>
                <source srcset="${img.webp}" type="image/webp">
                <img class="gallery-thumb" src="${img.src}" alt="${img.alt}" loading="lazy">
              </picture>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- REVIEWS CAROUSEL -->
    <section id="reviews-${lang}" class="py-24 bg-white" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-quart">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">${c.reviews.title}</h2>
        <div class="carousel-container relative" data-carousel="${lang}">
          <div class="carousel-track" id="carousel-${lang}">
            ${c.reviews.slides.map(r => `
              <div class="carousel-slide">
                <div class="review-card">
                  <div class="flex items-center mb-4 star-large">
                    ${Array(5).fill(0).map(() => '<i class="fas fa-star gold"></i>').join('')}
                    <span class="ml-2 text-gray-500 text-sm">5.0</span>
                  </div>
                  <p class="text-gray-700 text-lg italic mb-6">"${r.text}"</p>
                  <p class="font-bold text-gold">– ${r.author}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="carousel-btn prev" onclick="moveCarousel('${lang}', -1)" aria-label="Previous slide">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
          </button>
          <button class="carousel-btn next" onclick="moveCarousel('${lang}', 1)" aria-label="Next slide">
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
          </button>
          <div class="carousel-dots" id="dots-${lang}"></div>
        </div>
        <div class="text-center mt-8">
          <a href="https://search.google.com/local/reviews?placeid=ChIJU3JyAljB0RMRdoAB2vYR5oo" target="_blank" class="btn-primary"><i class="fab fa-google mr-2"></i>${c.reviews.googleReview}</a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-24 bg-gray-50" data-aos="fade-up">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">Frequently Asked <span class="gold">Questions</span></h2>
        <div class="space-y-2">
          ${c.faq.map(f => `
            <div class="faq-item">
              <div class="faq-question" onclick="toggleFaq(this)" role="button" tabindex="0" aria-expanded="false">
                <span>${f.q}</span>
                <i class="fas fa-chevron-down gold" aria-hidden="true"></i>
              </div>
              <div class="faq-answer">
                <p>${f.a}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact-${lang}" class="py-24 bg-gray-50" data-aos="fade-up">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl text-center mb-16 section-title">${c.contact.title}</h2>
        <div class="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h3 class="text-2xl font-bold mb-6">${c.contact.visit}</h3>
            <div class="space-y-5 text-gray-600">
              <p class="flex items-start space-x-4"><i class="fas fa-map-pin gold text-xl mt-1 w-6"></i><span>${c.contact.address}</span></p>
              <p class="flex items-center space-x-4"><i class="fas fa-phone-alt gold w-6"></i><span><strong>${c.contact.primary}</strong> <a href="tel:+355676360510">+355 67 636 0510</a></span></p>
              <p class="flex items-center space-x-4"><i class="fas fa-phone-alt gold w-6"></i><span><strong>${c.contact.secondary}</strong> <a href="tel:+355675716090">+355 67 571 6090</a></span></p>
              <p class="flex items-center space-x-4"><i class="fas fa-envelope gold w-6"></i><span><a href="mailto:iglisi@watch.al">iglisi@watch.al</a></span></p>
              <p class="flex items-center space-x-4"><i class="fas fa-clock gold w-6"></i><span>${c.contact.hours}</span></p>
            </div>
            <div class="mt-8 flex flex-wrap gap-4">
              <a href="https://www.google.com/maps/place/?q=place_id:ChIJU3JyAljB0RMRdoAB2vYR5oo" target="_blank" class="btn-primary"><i class="fab fa-google mr-2"></i>${c.contact.mapBtn}</a>
              <a href="https://wa.me/355676360510" target="_blank" class="btn-secondary"><i class="fab fa-whatsapp mr-2"></i>${c.contact.whatsappBtn}</a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=41.3201564,19.4453564" target="_blank" class="btn-secondary"><i class="fas fa-directions mr-2"></i>${c.contact.dirBtn}</a>
            </div>
          </div>
          <div>
            <iframe class="w-full h-80 rounded-2xl border border-gray-200" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2991.418269398786!2d19.4431676!3d41.3201564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134fd18602527253%3A0x8ae611f6da018076!2sOrendreqes%20%26%20Kopje%20Celsash%20Igli!5e0!3m2!1sen!2s!4v1700000000000" allowfullscreen="" loading="lazy"></iframe>
          </div>
        </div>
      </div>
    </section>
  `;

  container.innerHTML = html;

  // Update dynamic year elements
  document.querySelectorAll('.years-exp[data-lang="' + lang + '"]').forEach(el => {
    el.textContent = `${years}+ ${el.dataset.lang === 'en' ? 'years' : (el.dataset.lang === 'al' ? 'vjet' : 'anni')}`;
  });
  document.querySelectorAll('.badge-years[data-lang="' + lang + '"]').forEach(el => {
    el.textContent = c.badge.replace('{years}', years);
  });

  initCarousel(lang);
  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ==================== LANGUAGE SWITCHING ====================
function switchToLang(langCode) {
  renderLang(langCode);
  if (langBtnText) langBtnText.innerText = langCode.toUpperCase();
  langIndex = { en:0, al:1, it:2 }[langCode];
  localStorage.setItem('preferredLang', langCode);
}

window.toggleLang = function() {
  const newLang = langIndex === 0 ? 'al' : (langIndex === 1 ? 'it' : 'en');
  switchToLang(newLang);
};

// ==================== GEO DETECTION (JSONP) ====================
window.handleGeoResponse = function(data) {
  const country = data.country_code;
  let targetLang = 'en';
  if (country === 'IT') targetLang = 'it';
  else if (country === 'AL' || country === 'XK') targetLang = 'al';
  switchToLang(targetLang);
  delete window.handleGeoResponse;
  const script = document.querySelector('script[src*="ipapi.co/json"]');
  if (script) document.head.removeChild(script);
};

(function() {
  const savedLang = localStorage.getItem('preferredLang');
  if (savedLang && ['en','al','it'].includes(savedLang)) {
    switchToLang(savedLang);
  }
  const script = document.createElement('script');
  script.src = 'https://ipapi.co/json/?callback=handleGeoResponse';
  script.onerror = function() {
    console.log('GeoIP failed, staying with saved or English');
    if (!savedLang) switchToLang('en');
    document.head.removeChild(script);
  };
  document.head.appendChild(script);
})();

// ==================== CAROUSEL FUNCTIONS ====================
function updateCarousel(lang) {
  const track = document.getElementById(`carousel-${lang}`);
  if (!track) return;
  const slides = track.children;
  const slideCount = slides.length;
  const index = carouselIndices[lang] % slideCount;
  track.style.transform = `translateX(-${index * 100}%)`;

  const dotsContainer = document.getElementById(`dots-${lang}`);
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('span');
      dot.className = `carousel-dot ${i === index ? 'active' : ''}`;
      dot.onclick = (function(i) {
        return function() {
          carouselIndices[lang] = i;
          updateCarousel(lang);
          restartAutoPlay(lang);
        };
      })(i);
      dotsContainer.appendChild(dot);
    }
  }
}

window.moveCarousel = function(lang, direction) {
  const track = document.getElementById(`carousel-${lang}`);
  if (!track) return;
  const slideCount = track.children.length;
  carouselIndices[lang] = (carouselIndices[lang] + direction + slideCount) % slideCount;
  updateCarousel(lang);
  restartAutoPlay(lang);
};

function startAutoPlay(lang) {
  if (autoPlayIntervals[lang]) clearInterval(autoPlayIntervals[lang]);
  autoPlayIntervals[lang] = setInterval(() => {
    const container = document.querySelector(`[data-carousel="${lang}"]`);
    if (container && container.matches(':hover')) return;
    moveCarousel(lang, 1);
  }, 5000);
}

function stopAutoPlay(lang) {
  if (autoPlayIntervals[lang]) {
    clearInterval(autoPlayIntervals[lang]);
    autoPlayIntervals[lang] = null;
  }
}

function restartAutoPlay(lang) {
  stopAutoPlay(lang);
  startAutoPlay(lang);
}

function initCarousel(lang) {
  updateCarousel(lang);
  restartAutoPlay(lang);
}

// Attach hover listeners once
document.querySelectorAll('[data-carousel]').forEach(container => {
  const lang = container.dataset.carousel;
  container.addEventListener('mouseenter', () => stopAutoPlay(lang));
  container.addEventListener('mouseleave', () => startAutoPlay(lang));
  container.addEventListener('touchstart', () => stopAutoPlay(lang), { passive: true });
  container.addEventListener('touchend', () => startAutoPlay(lang));
});

// ==================== AOS INIT ====================
AOS.init({
  duration: 800,
  once: true,
  offset: 100
});

// ==================== LIGHTBOX OPTIONS (safe check) ====================
if (typeof lightbox !== 'undefined' && lightbox.option) {
  lightbox.option({
    resizeDuration: 200,
    wrapAround: true,
    albumLabel: 'Image %1 of %2',
    alwaysShowNavOnTouchDevices: true,
    showImageNumberLabel: true
  });
}

// ==================== BACK TO TOP ====================
window.addEventListener('scroll', function() {
  const backToTop = document.getElementById('backToTop');
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

// ==================== SCROLL PROGRESS ====================
window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
});

// ==================== FAQ TOGGLE ====================
window.toggleFaq = function(element) {
  const answer = element.nextElementSibling;
  const isOpen = answer.classList.contains('open');

  if (!isOpen) {
    answer.style.maxHeight = '1000px';
    const scrollHeight = answer.scrollHeight;
    answer.style.maxHeight = scrollHeight + 'px';
  } else {
    answer.style.maxHeight = '0';
  }

  answer.classList.toggle('open');
  element.classList.toggle('open');
  element.setAttribute('aria-expanded', !isOpen);
};

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Keyboard support for FAQ
  document.addEventListener('keydown', function(e) {
    if (e.target.closest('.faq-question') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleFaq(e.target.closest('.faq-question'));
    }
  });
});

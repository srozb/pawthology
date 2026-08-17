// Katalog leków. Rozszerzanie = nowy wpis.
// groupId     — grupa terapeutyczna (dopasowanie do diseases.recommendedGroups)
// dosingType  — "systemic" (suwak mg, ocena R-DOSE-*) | "topical" (brak oceny dawki)
// speciesToxic — gatunkowo toksyczny (KAŻDA dawka → R-DRUG-SPECIES-TOXIC); tu odwołanie do species.toxicDrugs
// antibiotic  — napędza R-ABX-IRRATIONAL (gdy disease.bacterialInfection=false) / R-ABX-INDICATED (gdy true)
// reviewStatus: "draft" = dane do weryfikacji (F2) | "llm-audited" = zweryfikowane przez internet
export const drugs = [
  {
    id: "chlorhexidine",
    minLevel: 1,
    inn: "Chlorheksydyna",
    groupId: "antiseptic-topical",
    groupPl: "Antyseptyk miejscowy", groupEn: "Topical antiseptic",
    tooltipPl: "Antyseptyk do odkażania rany - nie jest antybiotykiem, nie wybiera oporności (AMR).",
    tooltipEn: "Topical antiseptic for wound disinfection — not an antibiotic, does not drive AMR.",
    routePl: "miejscowo", routeEn: "topical",
    dosingType: "topical",
    dosing: {
      dog: { unitNotePl: "roztwór 0.05–2%", frequencyPl: "1–2× dziennie" },
      cat: { unitNotePl: "roztwór 0.05–2% (nie do oczu)", frequencyPl: "1–2× dziennie" },
      snake: { unitNotePl: "płukanie jamy ustnej 0,05% roztworem", frequencyPl: "1–2× dziennie, 5–7 dni" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Chlorheksydyna to antyseptyk miejscowy - odkaża ranę i skórę, zabijając bakterie na powierzchni. W odróżnieniu od antybiotyku działa z zewnątrz i nie wnika głęboko w tkanki, dlatego nie wybiera oporności (AMR). To klasyk odkażania w weterynarii i medycynie.\n\nJest silnie działająca i szybko zabija większość bakterii, a także niektóre wirusy i grzyby. Stosuje się ją na czyste rany, do płukania jam i do przygotowania skóry przed zabiegiem. Ma jedno ważne ograniczenie: jest ototoksyczna - do ucha podana może uszkodzić słuch, dlatego do uszu się jej nie stosuje.\n\nW grze to właściwy wybór do odkażania otarcia i rany bez infekcji bakteryjnej. Błędem jest sięgać po antybiotyk tam, gdzie wystarczy antyseptyk - bo to nadużywanie napędza oporność (AMR).",
    infoEn: "Chlorhexidine is a topical antiseptic — it disinfects wounds and skin by killing bacteria on the surface. Unlike an antibiotic it acts from outside and does not penetrate deep into tissues, so it does not drive resistance (AMR). It is a mainstay of disinfection in both veterinary and human medicine.\n\nIt is potent and quickly kills most bacteria, as well as some viruses and fungi. It is used on clean wounds, for irrigating cavities and for prepping skin before procedures. It has one important limit: it is ototoxic — placed in the ear it can damage hearing, so it is never used in ears.\n\nIn the game it is the right choice for disinfecting an abrasion or a wound without a bacterial infection. The mistake is to reach for an antibiotic where an antiseptic would suffice — because that overuse drives resistance (AMR).",
    wikiPl: "https://pl.wikipedia.org/wiki/Chlorheksydyna",
    wikiEn: "https://en.wikipedia.org/wiki/Chlorhexidine",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-07"]
  },
  {
    id: "povidone-iodine",
    minLevel: 1,
    inn: "Powidon-jod",
    groupId: "antiseptic-topical",
    groupPl: "Antyseptyk miejscowy", groupEn: "Topical antiseptic",
    tooltipPl: "Antyseptyk jodowy; u kotów jod wchłania się przez skórę - ostrożnie, na duże rany nie.",
    tooltipEn: "Iodine antiseptic; cats absorb iodine through skin — caution, not on large wounds.",
    routePl: "miejscowo", routeEn: "topical",
    dosingType: "topical",
    dosing: {
      dog: { unitNotePl: "roztwór 1%", frequencyPl: "1–2× dziennie" },
      cat: { unitNotePl: "roztwór 1% - ostrożnie (wchłanianie jodu)", frequencyPl: "1× dziennie" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Powidon-jod to antyseptyk uwalniający jod - jeden z najstarszych i najpewniejszych środków odkażających. Działa szeroko: na bakterie, wirusy, grzyby, a nawet przetrwalniki. Jak chlorheksydyna jest antyseptykiem, nie antybiotykiem, więc nie wybiera oporności (AMR).\n\nStosuje się go na rany i skórę, ale u kota trzeba ostrożnie: koty wchłaniają jod przez skórę, zwłaszcza na dużych powierzchniach, co może zaburzyć tarczycę. Dlatego u kota stosuje się go punktowo, a nie na rozległe rany.\n\nTo dobry wybór do odkażania rany u psa; u kota z rozwagą. Jak każdy antyseptyk nie zastępuje antybiotyku przy rozległej infekcji bakteryjnej - ale w większości powierzchownych ran wystarcza i oszczędza florę.",
    infoEn: "Povidone-iodine is an antiseptic that releases iodine — one of the oldest and most reliable disinfectants. It acts broadly: on bacteria, viruses, fungi and even spores. Like chlorhexidine it is an antiseptic, not an antibiotic, so it does not drive resistance (AMR).\n\nIt is used on wounds and skin, but in cats one must be careful: cats absorb iodine through the skin, especially over large areas, which can disturb the thyroid. So in cats it is used spot-wise, not on extensive wounds.\n\nIt is a good choice for disinfecting a wound in dogs; in cats, with judgment. Like any antiseptic it does not replace an antibiotic for a widespread bacterial infection — but for most superficial wounds it is enough and it spares the flora.",
    wikiPl: "https://pl.wikipedia.org/wiki/Jodopowidon",
    wikiEn: "https://en.wikipedia.org/wiki/Povidone-iodine",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-08"]
  },
  {
    id: "ear-drops-complex",
    minLevel: 1,
    inn: "Gentamicyna + klotrimazol + betametazon",
    groupId: "ear-drops",
    groupPl: "Krople do uszu (złożone)", groupEn: "Ear drops (complex)",
    tooltipPl: "Miejscowe leczenie zapalenia ucha wg cytologii - celuje w bakterie i drożdże, steryd gasi stan zapalny.",
    tooltipEn: "Topical otitis treatment per cytology — targets bacteria and yeast, steroid calms inflammation.",
    routePl: "do ucha", routeEn: "otic",
    dosingType: "topical",
    dosing: {
      dog: { unitNotePl: "kilkanaście kropli / ucho", frequencyPl: "1–2× dziennie 5–7 dni" },
      cat: { unitNotePl: "kilkanaście kropli / ucho", frequencyPl: "1–2× dziennie 5–7 dni" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Złożone krople do uszu łączą trzy składniki: antybiotyk, lek przeciwgrzybiczy i steryd. Każdy ma swoje zadanie - antybiotyk zwalcza bakterie, przeciwgrzybiczy drożdżaki, a steryd gasi obrzęk i stan zapalny, który utrudniałby podawanie kropli.\n\nDobiera się je wg cytologii ucha - bo jeśli dominują drożdżaki (Malassezia), antybiotyk w kroplach jest zbędny, a jeśli bakterie, przeciwgrzybiczy nie pomaga. Steryd jest kluczowy na początku: spuchnięty kanał nie przyjmuje kropli, a steryd go otwiera. Działanie miejscowo oszczędza florę jelitową.\n\nTo leczenie celowane, typowe dla zapalenia ucha. Nie zastępuje leczenia ogólnoustrojowego przy ciężkim, głębokim zapaleniu - ale dla większości przypadków wystarcza i unika niepotrzebnego antybiotyku ogólnoustrojowego, który napędza oporność (AMR).",
    infoEn: "Complex ear drops combine three ingredients: an antibiotic, an antifungal and a steroid. Each has its job — the antibiotic fights bacteria, the antifungal fights yeast, and the steroid calms the swelling and inflammation that would make giving drops difficult.\n\nThey are chosen per ear cytology — because if yeast (Malassezia) dominate, the antibiotic in the drops is needless, and if bacteria dominate, the antifungal does not help. The steroid is key at the start: a swollen canal will not take drops, and the steroid opens it. The topical action spares the gut flora.\n\nIt is targeted treatment, typical for ear inflammation. It does not replace systemic treatment for a severe, deep inflammation — but for most cases it suffices and avoids a needless systemic antibiotic that drives resistance (AMR).",
    wikiPl: "https://pl.wikipedia.org/wiki/Zapalenie_ucha_zewn%C4%99trznego",
    wikiEn: "https://en.wikipedia.org/wiki/Otitis_externa",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-09"]
  },
  {
    id: "amoxicillin-clavulanate",
    minLevel: 1,
    inn: "Amoksycylina z kwasem klawulanowym",
    groupId: "antibiotic",
    groupPl: "Antybiotyk (β-laktam)", groupEn: "Antibiotic (β-lactam)",
    tooltipPl: "Antybiotyk szerokiego spektrum; TYLKO przy potwierdzonej infekcji bakteryjnej - nie na uraz.",
    tooltipEn: "Broad-spectrum antibiotic; ONLY for confirmed bacterial infection — not for trauma.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 12.5, max: 25 }, frequencyPl: "2× dziennie 5–7 dni" },
      cat: { mgPerKg: { min: 12.5, max: 25 }, frequencyPl: "2× dziennie 5–7 dni" }
    },
    speciesToxic: ["rabbit", "guinea-pig"],
    antibiotic: true,
    infoPl: "Amoksycylina z kwasem klawulanowym to antybiotyk β-laktamowy szerokiego spektrum - penicylina w połączeniu z inhibitorem, który chroni ją przed enzymami niszczącymi β-laktam. Działa na wiele bakterii, dlatego jest pierwszym wyborem przy potwierdzonej infekcji bakteryjnej.\n\nJest skuteczna przy infekcjach skóry, ran, zębów i dróg moczowych. Ma jednak jedną krytyczną pułapkę gatunkową: u królika doustna postać jest toksyczna. Królik zależy od flory jelitowej, a β-laktam ją niszczy - może wywołać śmiertelną enterotoksemię. Dlatego u królika β-laktam i cefalosporyna doustnie są zakazane.\n\nTo uzasadniony antybiotyk - ale tylko przy potwierdzonej infekcji bakteryjnej. Podawany na wszelki wypadek, bez infekcji, napędza oporność (AMR), a u królika zagraża życiu. Uczy, że szerokie spektrum to nie zawsze zaleta.",
    infoEn: "Amoxicillin with clavulanic acid is a broad-spectrum β-lactam antibiotic — a penicillin paired with an inhibitor that protects it from the enzymes that destroy β-lactams. It acts on many bacteria, which is why it is a first choice for a confirmed bacterial infection.\n\nIt is effective for skin, wound, dental and urinary infections. It has one critical species trap: in rabbits the oral form is toxic. The rabbit depends on its gut flora, and a β-lactam destroys it — it can trigger fatal enterotoxemia. So in rabbits oral β-lactam and cephalosporin are forbidden.\n\nIt is a justified antibiotic — but only for a confirmed bacterial infection. Given just in case, without infection, it drives resistance (AMR), and in a rabbit it is life-threatening. It teaches that broad spectrum is not always a virtue.",
    wikiPl: "https://pl.wikipedia.org/wiki/Amoksycylina",
    wikiEn: "https://en.wikipedia.org/wiki/Co-amoxiclav",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-01", "C-SPC-03", "C-SPC-04"]
  },
  {
    id: "metronidazole",
    minLevel: 1,
    inn: "Metronidazol",
    groupId: "antibiotic",
    groupPl: "Antybiotyk / Przeciwpierwotniakowy", groupEn: "Antibiotic / antiprotozoal",
    tooltipPl: "Działa na beztlenowce i pierwotniaki; używany przy infekcji beztlenowcowej, nie na robaki.",
    tooltipEn: "Covers anaerobes and protozoa; used for anaerobic infection, not for helminths.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 10, max: 20 }, frequencyPl: "1–2× dziennie 5–7 dni" },
      cat: { mgPerKg: { min: 10, max: 15 }, frequencyPl: "1–2× dziennie 5–7 dni" }
    },
    speciesToxic: [],
    antibiotic: true,
    infoPl: "Metronidazol to antybiotyk o specyficznym profilu - działa na beztlenowce i pierwotniaki, a nie na bakterie tlenowe. Stosuje się go przy infekcjach beztlenowcowych, na przykład w ropniu lub jamie ustnej, oraz przy niektórych biegunkach, jak wywołanych Giardią.\n\nWłaśnie dlatego nie zastąpi fenbendazolu przy nicieniach ani kropli przy pchłach - to zupełnie inny cel. U królika stosuje się go ostrożnie z uzasadnieniem, bo choć nie jest β-laktam, nadal ingeruje w florę.\n\nMetronidazol przypomina, że antybiotyk to nie jeden lek na wszystko - każdy ma swój cel. Podawany celowo, przy potwierdzonej infekcji bakteryjnej beztlenowcami, jest uzasadniony i nie napędza oporności (AMR). Podany na chybił-trafił - wręcz przeciwnie.",
    infoEn: "Metronidazole is an antibiotic with a specific profile — it acts on anaerobes and protozoa, not on aerobic bacteria. It is used for anaerobic infections such as an abscess or the oral cavity, and for some diarrheas such as those caused by Giardia.\n\nThat is exactly why it will not replace fenbendazole for nematodes or drops for fleas — it is a completely different target. In rabbits it is used cautiously with justification, because although it is not a β-lactam it still interferes with the flora.\n\nMetronidazole reminds you that an antibiotic is not one drug for everything — each has its target. Given purposefully, for a confirmed anaerobic bacterial infection, it is justified and does not drive resistance (AMR). Given hit-or-miss — quite the opposite.",
    wikiPl: "https://pl.wikipedia.org/wiki/Metronidazol",
    wikiEn: "https://en.wikipedia.org/wiki/Metronidazole",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-02"]
  },
  {
    id: "cefalexin",
    minLevel: 1,
    inn: "Cefaleksyna",
    groupId: "antibiotic",
    groupPl: "Antybiotyk (cefalosporyna)", groupEn: "Antibiotic (cephalosporin)",
    tooltipPl: "Cefalosporyna I generacji; infekcje skórne i zakażenia ran, gdy potwierdzone bakterie.",
    tooltipEn: "First-gen cephalosporin; skin and wound infections when bacteria confirmed.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 10, max: 30 }, frequencyPl: "2× dziennie 5–7 dni" },
      cat: { mgPerKg: { min: 10, max: 20 }, frequencyPl: "2× dziennie 5–7 dni" }
    },
    speciesToxic: ["rabbit", "guinea-pig"],
    antibiotic: true,
    infoPl: "Cefaleksyna to cefalosporyna I generacji - antybiotyk skuteczny na bakterie skórne i zakażenia ran. Często wybierana przy infekcjach skóry, bo dobrze działa w tkankach powierzchniowych.\n\nJak wszystkie cefalosporyny i β-laktamy, u królika doustnie jest toksyczna - niszczy florę jelitową i może wywołać śmiertelną enterotoksemię. Dlatego u królika jest zakazana. U psa i kota jest bezpieczna, ale tylko przy potwierdzonej infekcji bakteryjnej.\n\nCefaleksyna uczy rozróżniać grupy antybiotyków: to cefalosporyna, nie penicylina, i ma inny profil. Podawana bez infekcji napędza oporność (AMR); u królika jest po prostu zabójcza. To lek na bakterie skórne i zakażenia ran - wybierany, gdy infekcja jest potwierdzona.",
    infoEn: "Cefalexin is a first-generation cephalosporin — an antibiotic effective against skin bacteria and wound infections. It is often chosen for skin infections because it works well in superficial tissues.\n\nLike all cephalosporins and β-lactams, in rabbits the oral form is toxic — it destroys the gut flora and can trigger fatal enterotoxemia. So it is forbidden in rabbits. In dogs and cats it is safe, but only for a confirmed bacterial infection.\n\nCefalexin teaches you to tell antibiotic groups apart: it is a cephalosporin, not a penicillin, with a different profile. Given without an infection it drives resistance (AMR); in a rabbit it is simply lethal.",
    wikiPl: "https://pl.wikipedia.org/wiki/Cefaleksyna",
    wikiEn: "https://en.wikipedia.org/wiki/Cefalexin",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-03", "C-SPC-03", "C-SPC-04"]
  },
  {
    id: "enrofloxacin",
    minLevel: 1,
    inn: "Enrofloksacyna",
    groupId: "antibiotic",
    groupPl: "Antybiotyk (fluorochinolon)", groupEn: "Antibiotic (fluoroquinolone)",
    tooltipPl: "Fluorochinolon; u młodych zwierząt uszkadza chrząstkę stawową, u kotów wysokie dawki uszkadzają siatkówkę. Lek rezerwy.",
    tooltipEn: "Fluoroquinolone; in young animals damages joint cartilage, in cats high doses — retina. Reserve drug.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 5, max: 10 }, frequencyPl: "1× dziennie" },
      cat: { mgPerKg: { min: 5, max: 5 }, frequencyPl: "1× dziennie (rygorystycznie, retinotoksyczny)" },
      hamster: { mgPerKg: { min: 5, max: 10 }, frequencyPl: "2× dziennie 5–7 dni" },
      snake: { mgPerKg: { min: 5, max: 10 }, frequencyPl: "co 24–48 godz. (powolny metabolizm gadów)" }
    },
    speciesToxic: [],
    antibiotic: true,
    infoPl: "Enrofloksacyna to fluorochinolon - antybiotyk rezerwy o silnym działaniu na bakterie tlenowe, w tym Pseudomonas. Stosuje się ją, gdy antybiotyki pierwszego rzutu nie działają, bo rzadko napotyka oporność.\n\nMa dwa ważne ograniczenia gatunkowo-wiekowe: u młodych, rosnących zwierząt uszkadza chrząstkę stawową, dlatego u szczeniąt i kociąt się jej unika. U kota wysokie dawki są retinotoksyczne - mogą uszkodzić siatkówkę, dlatego dawkowanie u kota jest rygorystyczne. Zaletą jest, że w przeciwieństwie do β-laktamów jest u królika stosowana ostrożnie z uzasadnieniem.\n\nTo lek rezerwy - nie na każdą infekcję bakteryjną. Uzasadniony przy opornych przypadkach, ale podawany lekko napędza oporność (AMR), a u młodych i kotów niesie ryzyko, które się waży z zyskiem.",
    infoEn: "Enrofloxacin is a fluoroquinolone — a reserve antibiotic with strong action on aerobic bacteria, including Pseudomonas. It is used when first-line antibiotics fail, because it rarely meets resistance.\n\nIt has two important age- and species-related limits: in young, growing animals it damages joint cartilage, so it is avoided in puppies and kittens. In cats high doses are retinotoxic — they can damage the retina, so cat dosing is strict. Its advantage is that, unlike β-lactams, it is used in rabbits cautiously with justification.\n\nIt is a reserve drug — not for every bacterial infection. Justified for resistant cases, but given lightly it drives resistance (AMR), and in the young and in cats it carries a risk that must be weighed against the benefit.",
    wikiPl: "https://pl.wikipedia.org/wiki/Enrofloksacyna",
    wikiEn: "https://en.wikipedia.org/wiki/Enrofloxacin",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-04", "C-DRG-21"]
  },
  {
    id: "fenbendazole",
    minLevel: 1,
    inn: "Fenbendazol",
    groupId: "antiparasitic",
    groupPl: "Przeciwpasożytniczy (benzimidazol)", groupEn: "Antiparasitic (benzimidazole)",
    tooltipPl: "Na nicienie i Giardię; daje się w serii 3 dni, nie jednorazowo.",
    tooltipEn: "Against nematodes and Giardia; given as a 3-day course, not a single dose.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      // 50 mg/kg to dawka celowa (MVM/Plumb); pasmo gry 45–55 daje tolerancję ±10%
      // — fenbendazol ma bardzo szeroki margines bezpieczeństwa, a punktowe min==max
      // było nietrafialne przy kroku suwaka (50×2 kg = 100 mg, suwak lądował 99.6/100.2).
      dog: { mgPerKg: { min: 45, max: 55 }, frequencyPl: "1× dziennie przez 3 dni" },
      cat: { mgPerKg: { min: 45, max: 55 }, frequencyPl: "1× dziennie przez 3 dni" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Fenbendazol to przeciwpasożytniczy z grupy benzimidazoli - działa na nicienie i pierwotniaka Giardię. Nie jest antybiotykiem, więc nie wybiera oporności bakteryjnej (AMR) i nie niszczy flory.\n\nKluczowa jest forma podania: daje się go w serii 3 dni, nie jednorazowo - bo cykl pasożytów sprawia, że jednorazowa dawka nie łapie wszystkich stadiów. Działa na dorosłe robaki, ale nie od razu na jaja, dlatego powtarza się.\n\nTo właściwy lek przy biegunce pasożytniczej od nicieni. Błędem jest podawanie antybiotyku na pasożyty - antybiotyk nie działa na robaki i niszczy florę, która właśnie jest uszkodzona i potrzebuje spokoju. Fenbendazol celuje w winowajcę. Działa po serii dni, nie jednorazowo - cierpliwość jest częścią leczenia pasożytów.",
    infoEn: "Fenbendazole is an antiparasitic of the benzimidazole group — effective against nematodes and the protozoan Giardia. It is not an antibiotic, so it does not drive bacterial resistance (AMR) and does not harm the flora.\n\nThe way it is given is key: it is given as a 3-day course, not a single dose — because the parasite cycle means a one-off dose does not catch all the stages. It acts on adult worms but not at once on the eggs, which is why it is repeated.\n\nIt is the right drug for parasitic diarrhea from nematodes. The mistake is to give an antibiotic for parasites — an antibiotic does not work against worms and it harms the flora that, already damaged, needs rest. Fenbendazole hits the culprit.",
    wikiPl: "https://pl.wikipedia.org/wiki/Fenbendazol",
    wikiEn: "https://en.wikipedia.org/wiki/Fenbendazole",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-10"]
  },
  {
    id: "praziquantel",
    minLevel: 1,
    inn: "Prazykwantel",
    groupId: "antiparasitic",
    groupPl: "Przeciwpasożytniczy (tasiemce)", groupEn: "Antiparasitic (cestodes)",
    tooltipPl: "Na tasiemce; nie działa na nicienie ani pchły.",
    tooltipEn: "Against tapeworms; not effective against nematodes or fleas.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 5, max: 5 }, frequencyPl: "jednorazowo" },
      cat: { mgPerKg: { min: 5, max: 5 }, frequencyPl: "jednorazowo" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Prazykwantel to przeciwpasożytniczy na tasiemce - działa niemal wyłącznie na tasiemce, a nie na nicienie ani pchły. Działa paradoksalnie: zmusza tasiemca do skurczu, który odsłania go przed układem odpornościowym.\n\nWłaśnie dlatego przed podaniem warto wiedzieć, z jakim pasożytem ma się do czynienia - bo prazykwantel na glisty nie zadziała, a fenbendazol na tasiemce nie. Diagnoza, często przez badanie kału, decyduje o wyborze leku.\n\nPrazykwantel to nie antybiotyk - nie wybiera oporności bakteryjnej (AMR). Ale podany bez rozpoznania, gdy to nie tasiemce, jest po prostu zmarnowany. Uczy, że w odrobaczaniu cel to wszystko. Bez potwierdzenia tasiemca (badanie kału) lek jest strzelaniem w ciemno.",
    infoEn: "Praziquantel is an antiparasitic against tapeworms — it acts almost exclusively on cestodes, not on nematodes or fleas. It works paradoxically: it forces the tapeworm into a spasm that exposes it to the immune system.\n\nThat is exactly why it helps to know which parasite you are dealing with before giving it — praziquantel will not work on roundworms, and fenbendazole will not work on tapeworms. The diagnosis, often through a fecal exam, decides the choice of drug.\n\nPraziquantel is not an antibiotic — it does not drive bacterial resistance (AMR). But given without a diagnosis, when it is not tapeworms, it is simply wasted. It teaches that in deworming the target is everything.",
    wikiPl: "https://pl.wikipedia.org/wiki/Prazykwantel",
    wikiEn: "https://en.wikipedia.org/wiki/Praziquantel",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-11"]
  },
  {
    id: "pyrantel",
    minLevel: 1,
    inn: "Pyrantel",
    groupId: "antiparasitic",
    groupPl: "Przeciwpasożytniczy (nicienie)", groupEn: "Antiparasitic (nematodes)",
    tooltipPl: "Na glisty; bezpieczny, często u szczeniąt i kociąt.",
    tooltipEn: "Against roundworms; safe, common in puppies and kittens.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 5, max: 10 }, frequencyPl: "jednorazowo, powtórzyć po 2 tyg." },
      cat: { mgPerKg: { min: 5, max: 10 }, frequencyPl: "jednorazowo, powtórzyć po 2 tyg." }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Pyrantel to przeciwpasożytniczy na glisty, czyli nicienie - bezpieczny i często stosowany u szczeniąt i kociąt, bo ma szeroki margines. Działa na robaki w jelitach, porażając ich mięśnie.\n\nNie działa na tasiemce ani pchły - to inny cel. Podaje się go jednorazowo, powtarzając po dwóch tygodniach, by złapać robaki, które właśnie się wylęgły z jaj. Jest wygodny, bo często w tabletkach dla młodych zwierząt.\n\nPyrantel to nie antybiotyk - nie wybiera oporności bakteryjnej (AMR). To dobry, bezpieczny lek na glisty, ale jak każdy przeciwpasożytniczy działa tylko wtedy, gdy naprawdę są pasożyty - potwierdź badaniem kału, zanim odrobaczysz. Pyrantel celuje w nicienie - przy tasiemcach i pchłach jest bezużyteczny.",
    infoEn: "Pyrantel is an antiparasitic against roundworms, that is nematodes — safe and often used in puppies and kittens because it has a wide margin. It acts on worms in the intestines by paralysing their muscles.\n\nIt does not work on tapeworms or fleas — it is a different target. It is given once, repeated after two weeks to catch worms that have just hatched from eggs. It is convenient, often in tablets for young animals.\n\nPyrantel is not an antibiotic — it does not drive bacterial resistance (AMR). It is a good, safe drug against roundworms, but like any antiparasitic it works only when parasites are truly present — a diagnosis by fecal exam before you deworm.",
    wikiPl: "https://pl.wikipedia.org/wiki/Pyrantel",
    wikiEn: "https://en.wikipedia.org/wiki/Pyrantel",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-12"]
  },
  {
    id: "emodepside",
    minLevel: 1,
    inn: "Emodepsyd",
    groupId: "antiparasitic",
    groupPl: "Przeciwpasożytniczy (spot-on)", groupEn: "Antiparasitic (spot-on)",
    tooltipPl: "Spot-on na nicienie u kota; nakłada się na skórę karku, nie doustnie.",
    tooltipEn: "Spot-on for nematodes in cats; applied to neck skin, not orally.",
    routePl: "na skórę (kark)", routeEn: "topical (neck)",
    dosingType: "topical",
    dosing: {
      cat: { unitNotePl: "3 mg/kg na skórę (kropelka)", frequencyPl: "jednorazowo" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Emodepsyd to przeciwpasożytniczy w formie spot-on - nakłada się go na skórę karku, nie doustnie. Działa na nicienie u kota, co jest wygodne dla zwierząt trudnych do podania tabletki.\n\nNakłada się go kroplą na skórę karku, skąd wchłania się i rozprowadza. Działa kilka tygodni. Dla kota, który się opiera tabletce, to często jedyna praktyczna droga odrobaczania.\n\nEmodepsyd to nie antybiotyk - nie wybiera oporności bakteryjnej (AMR). Działa tylko na nicienie, więc przed podaniem warto potwierdzić przez badanie kału, że to właśnie one są winowajcą. To lek na nicienie kota - nie ma sensu podawać go na tasiemce. Sprawdź najpierw badanie kału, zanim sięgniesz po spot-on.",
    infoEn: "Emodepside is an antiparasitic in a spot-on form — it is applied to the skin of the neck, not orally. It acts on nematodes in cats, which is convenient for animals hard to tablet.\n\nIt is applied as a drop to the neck skin, where it absorbs and distributes. It works for several weeks. For a cat that fights a tablet, it is often the only practical route for deworming.\n\nEmodepside is not an antibiotic — it does not drive bacterial resistance (AMR). It works only on nematodes, so before giving it helps to confirm through a fecal exam that they are indeed the culprit.",
    wikiPl: "https://en.wikipedia.org/wiki/Emodepside",
    wikiEn: "https://en.wikipedia.org/wiki/Emodepside",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-13"]
  },
  {
    id: "selamectin",
    minLevel: 1,
    inn: "Selamektyna",
    groupId: "antiparasitic",
    groupPl: "Przeciwpasożytniczy (spot-on)", groupEn: "Antiparasitic (spot-on)",
    tooltipPl: "Spot-on na pchły, roztocza i nicienie; na skórę karku, miesięcznie.",
    tooltipEn: "Spot-on for fleas, mites and nematodes; on neck skin, monthly.",
    routePl: "na skórę (kark)", routeEn: "topical (neck)",
    dosingType: "topical",
    dosing: {
      dog: { unitNotePl: "6–12 mg/kg na skórę", frequencyPl: "miesięcznie" },
      cat: { unitNotePl: "6–12 mg/kg na skórę", frequencyPl: "miesięcznie" },
      "guinea-pig": { unitNotePl: "6–12 mg/kg na skórę (off-label)", frequencyPl: "powtarzać co 3–4 tyg. (2–3 dawki)" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Selamektyna to przeciwpasożytniczy spot-on o szerokim spektrum - działa na pchły, roztocza i nicienie jednocześnie. Nakłada się ją na skórę karku, zwykle miesięcznie.\n\nWygodna, bo jeden preparat pokrywa kilka celów: pchły, roztocza ucha i nicienie. Stosuje się ją u psów i kotów, jest bezpieczna w zalecanych dawkach. Działa przez wchłanianie przez skórę i rozprowadzanie w sierści.\n\nSelamektyna to nie antybiotyk - nie wybiera oporności bakteryjnej (AMR). To dobry wybór na zarażenie pchłami z jednoczesną ochroną przed innymi pasożytami, ale przed podaniem zawsze warto potwierdzić, co się leczy. Nakłada się ją na skórę karku, zwykle raz w miesiącu jako profilaktykę lub leczenie.",
    infoEn: "Selamectin is a broad-spectrum antiparasitic spot-on — it acts on fleas, mites and nematodes at once. It is applied to the skin of the neck, usually monthly.\n\nConvenient, because one product covers several targets: fleas, ear mites and nematodes. It is used in dogs and cats and is safe at recommended doses. It works by absorbing through the skin and distributing through the coat.\n\nSelamectin is not an antibiotic — it does not drive bacterial resistance (AMR). It is a good choice for a flea infestation combined with protection against other parasites, but before giving it always helps to confirm what is being treated.",
    wikiPl: "https://en.wikipedia.org/wiki/Selamectin",
    wikiEn: "https://en.wikipedia.org/wiki/Selamectin",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-14", "C-DRG-20"]
  },
  {
    id: "fluralaner",
    minLevel: 1,
    inn: "Fluralaner",
    groupId: "antiparasitic",
    groupPl: "Przeciwpasożytniczy (izoksazolina)", groupEn: "Antiparasitic (isoxazoline)",
    tooltipPl: "Tabletka na pchły i kleszcze; działa długo (12 tyg.). Skuteczna na pchły doustnie.",
    tooltipEn: "Oral tablet for fleas and ticks; long-acting (12 wk). Effective against fleas orally.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 25, max: 56 }, frequencyPl: "jednorazowo" },
      cat: { mgPerKg: { min: 40, max: 93 }, frequencyPl: "jednorazowo" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Fluralaner to izoksazolina w tabletce doustnej - działa na pchły i kleszcze, i to długo: jedna dawka starcza na ok. 12 tygodni. To nowa grupa leków, która zmieniła walkę z pchłami.\n\nDziała na układ nerwowy pchły, nie na bakterie - dlatego to nie antybiotyk i nie wybiera oporności bakteryjnej (AMR). Wygodna, bo nie trzeba pamiętać o comiesięcznym podaniu: jedna tabletka na kwartał. Skuteczna zarówno na pchły, jak i kleszcze.\n\nFluralaner to właściwy nowoczesny wybór przy zarażeniu pchłami. Błędem jest podawać antybiotyk na pchły - antybiotyk nie działa na owady i tylko napędza oporność (AMR). Fluralaner celuje w to, co naprawdę trzeba.",
    infoEn: "Fluralaner is an isoxazoline in an oral tablet — it acts on fleas and ticks, and for long: one dose lasts about 12 weeks. It is a new drug class that changed the fight against fleas.\n\nIt acts on the flea's nervous system, not on bacteria — which is why it is not an antibiotic and does not drive bacterial resistance (AMR). Convenient, because there is no monthly dosing to remember: one tablet a quarter. Effective against both fleas and ticks.\n\nFluralaner is the right modern choice for a flea infestation. The mistake is to give an antibiotic for fleas — an antibiotic does not work against insects and only drives resistance (AMR). Fluralaner targets what actually needs targeting.",
    wikiPl: "https://en.wikipedia.org/wiki/Fluralaner",
    wikiEn: "https://en.wikipedia.org/wiki/Fluralaner",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-15"]
  },
  {
    id: "meloxicam",
    minLevel: 1,
    inn: "Meloksykam",
    groupId: "nsaid",
    groupPl: "Przeciwzapalne i przeciwbólowe", groupEn: "NSAID (anti-inflammatory/analgesic)",
    tooltipPl: "Niesteroidowy lek przeciwzapalny; przeciwbólowy, ale obciąża nerki i przewód pokarmowy.",
    tooltipEn: "Non-steroidal anti-inflammatory; analgesic, but burdens kidneys and GI tract.",
    routePl: "p.o. / s.c.", routeEn: "oral / s.c.",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 0.1, max: 0.1 }, frequencyPl: "1× dziennie (dawka nasycająca 0.2, potem 0.1)" },
      cat: { mgPerKg: { min: 0.05, max: 0.1 }, frequencyPl: "1× dziennie, krótko (nephrotoks.)" },
      rabbit: { mgPerKg: { min: 0.3, max: 0.6 }, frequencyPl: "1× dziennie, krótko (analgezja dentystyczna)" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Meloksykam to niesteroidowy lek przeciwzapalny (NSAID) - przeciwbólowy i przeciwzapalny, jeden z najczęstszych w weterynarii. Działa blokując enzymy zapalenia, co gasi ból i obrzęk.\n\nMa jednak cenę: obciąża nerki i przewód pokarmowy, dlatego u kota podaje się go krótko, a u kota z chorą nerką ostrożnie. U królika jest stosowany do analgezji dentystycznej przy malokluzji, w dawce 0,3–0,6 mg/kg, krótko i z obserwacją. Nie jest antybiotykiem - nie działa na infekcję bakteryjną.\n\nMeloksykam uczy, że analgezja to część leczenia, nie dodatek - ból zwalnia gojenie. Ale jak każdy NSAID wymaga ostrożności u nerek i żołądka, zwłaszcza u kota, u którego margines jest wąski.",
    infoEn: "Meloxicam is a non-steroidal anti-inflammatory drug (NSAID) — analgesic and anti-inflammatory, one of the most common in veterinary medicine. It works by blocking the enzymes of inflammation, which calms pain and swelling.\n\nIt has a price, though: it burdens the kidneys and the GI tract, so in cats it is given briefly and in a cat with kidney disease cautiously. In rabbits it is used for dental analgesia in malocclusion, at 0.3–0.6 mg/kg, briefly and under observation. It is not an antibiotic — it does not act on a bacterial infection.\n\nMeloxicam teaches that analgesia is part of treatment, not an add-on — pain slows healing. But like any NSAID it needs care for the kidneys and stomach, especially in the cat, where the margin is narrow.",
    wikiPl: "https://pl.wikipedia.org/wiki/Meloksykam",
    wikiEn: "https://en.wikipedia.org/wiki/Meloxicam",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-16", "C-DRG-RAB-01"]
  },
  {
    id: "carprofen",
    minLevel: 1,
    inn: "Karprofen",
    groupId: "nsaid",
    groupPl: "Przeciwzapalne i przeciwbólowe (pies)", groupEn: "NSAID (dog)",
    tooltipPl: "NSAID dla psów; przeciwbólowy przy urazie. Koty: bardzo wąski margines, ostrożnie.",
    tooltipEn: "NSAID for dogs; analgesic for trauma. Cats: very narrow margin, caution.",
    routePl: "p.o. / s.c.", routeEn: "oral / s.c.",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 2.2, max: 4.4 }, frequencyPl: "1–2× dziennie" },
      cat: { mgPerKg: { min: 2, max: 2 }, frequencyPl: "jednorazowo (rygorystycznie)" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Karprofen to NSAID dla psów - przeciwbólowy przy urazie. U kota ma bardzo wąski margines bezpieczeństwa - podaje się go rygorystycznie, jednorazowo lub krótko.\n\nDziała jak inne NSAID: blokuje enzymy zapalenia, gasząc ból i obrzęk po urazie. U psa jest częstym wyborem przy bólu urazowym, bo ma dogodny margines. U kota ten margines jest tak wąski, że dawkowanie musi być rygorystyczne, a podanie wielodniowe ryzykowne.\n\nKarprofen nie jest antybiotykiem - nie działa na infekcję bakteryjną. Przypomina, że NSAID lubi nerki i żołądek, a u kota ostrożność to nie opcja, lecz konieczność. To analgetyk, nie lek na infekcję - wybieraj go przy bólu urazowym, nigdy „na wszelki wypadek”.",
    infoEn: "Carprofen is an NSAID for dogs — analgesic for trauma. In cats it has a very narrow safety margin — given strictly, once or for a short course.\n\nIt works like other NSAIDs: it blocks the enzymes of inflammation, calming pain and swelling after trauma. In dogs it is a common choice for trauma pain, because it has a comfortable margin. In cats that margin is so narrow that dosing must be strict and multi-day use risky.\n\nCarprofen is not an antibiotic — it does not act on a bacterial infection. It reminds you that NSAIDs burden the kidneys and stomach, and in the cat caution is not an option but a necessity.",
    wikiPl: "https://en.wikipedia.org/wiki/Carprofen",
    wikiEn: "https://en.wikipedia.org/wiki/Carprofen",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-17"]
  },
  {
    id: "buprenorphine",
    minLevel: 1,
    inn: "Buprenorfina",
    groupId: "opioid",
    groupPl: "Opioid (silny analgetyk)", groupEn: "Opioid (strong analgesic)",
    tooltipPl: "Silny analgetyk opioidowy; u kota podjęzykowo (transmukosalnie). Na ból urazowy.",
    tooltipEn: "Strong opioid analgesic; in cats sublingual (transmucosal). For trauma pain.",
    routePl: "s.l. / i.m. / i.v.", routeEn: "s.l. / i.m. / i.v.",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 0.01, max: 0.03 }, frequencyPl: "co 6–8 h" },
      cat: { mgPerKg: { min: 0.01, max: 0.03 }, frequencyPl: "co 6–8 h (transmukosalnie)" },
      rabbit: { mgPerKg: { min: 0.01, max: 0.05 }, frequencyPl: "co 6–8 h (sedacja/analgezja)" }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Buprenorfina to opioid - silny analgetyk na ból urazowy. U kota podaje się ją podjęzykowo (transmukosalnie), co jest wygodne i skuteczne. U królika stosowana do sedacji i analgezji (0,01–0,05 mg/kg).\n\nOpioidy działają na receptory w układzie nerwowym, zmieniając odbiór bólu, a nie jego przyczynę. Dlatego są częścią leczenia urazu (złamanie, po zabiegu), ale nie zastępują leczenia przyczyny. Buprenorfina ma ryzyko depresji oddechowej mniejsze niż starsze opioidy, co czyni ją bezpieczniejszą.\n\nBuprenorfina nie jest antybiotykiem - nie działa na infekcję bakteryjną. Przypomina, że kontrola bólu to część opieki, a nie dodatek - zwierzę bez bólu goi się lepiej.",
    infoEn: "Buprenorphine is an opioid — a strong analgesic for trauma pain. In cats it is given sublingually (transmucosal), which is convenient and effective. In rabbits it is used for sedation and analgesia (0.01–0.05 mg/kg).\n\nOpioids act on receptors in the nervous system, changing the perception of pain rather than its cause. That is why they are part of trauma care (a fracture, after surgery), but they do not replace treating the cause. Buprenorphine carries a lower risk of respiratory depression than older opioids, making it safer.\n\nBuprenorphine is not an antibiotic — it does not act on a bacterial infection. It reminds you that pain control is part of care, not an add-on — an animal without pain heals better.",
    wikiPl: "https://pl.wikipedia.org/wiki/Buprenorfina",
    wikiEn: "https://en.wikipedia.org/wiki/Buprenorphine",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-18", "C-DRG-RAB-02"]
  },
  {
    id: "acetaminophen",
    minLevel: 1,
    inn: "Acetaminofen (paracetamol)",
    groupId: "otc-human-analgesic",
    groupPl: "Analgetyk ludzki (OTC)", groupEn: "Human analgesic (OTC)",
    tooltipPl: "Ludzki lek z apteki. U KOTA TOKSYCZNY - zniszczenie wątroby i metHb. U psa wąski margines - nie podawać.",
    tooltipEn: "Human pharmacy drug. TOXIC IN CATS — liver damage and methemoglobinemia. Narrow margin in dogs — do not use.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 0, max: 0 }, unitNotePl: "niepolecany w weterynarii", frequencyPl: "-" }
    },
    speciesToxic: ["cat"],
    antibiotic: false,
    infoPl: "Acetaminofen (paracetamol) to ludzki lek z apteki. U KOTA jest TOKSYCZNY - uszkadza wątrobę i powoduje methemoglobinemię; u psa ma wąski margines. W weterynarii nie podaje się ludzkich analgetyków bez wskazania lekarza.\n\nKoty nie metabolizują paracetamolu tak jak człowiek - brakuje im enzymu, który go rozkłada, dlatego lek kumuluje się i uszkadza czerwone krwinki (methemoglobinemia) oraz wątrobę (hepatotoksyczność). U psa margines jest wąski, ale mniej dramatyczny.\n\nAcetaminofen to klasyczna lekcja: to, co u człowieka jest łagodnym analgetykiem, u zwierząt bywa trucizną. Nigdy nie sięgaj po ludzkie leki z apteczki dla zwierzęcia - weterynaryjne odpowiedniki mają znany margines bezpieczeństwa. Acetaminofen to przypomnienie, że każdy gatunek metabolizuje leki inaczej.",
    infoEn: "Acetaminophen (paracetamol) is a human pharmacy drug. In CATS it is TOXIC — it damages the liver and causes methemoglobinemia; in dogs it has a narrow margin. In veterinary medicine human analgesics are not given without a vet's indication.\n\nCats do not metabolize paracetamol the way humans do — they lack the enzyme that breaks it down, so the drug accumulates and damages red blood cells (methemoglobinemia) and the liver (hepatotoxicity). In dogs the margin is narrow but less dramatic.\n\nAcetaminophen is a classic lesson: what is a mild analgesic in humans can be a poison in animals. Never reach for human medicines from the home cabinet for an animal — veterinary equivalents have a known safety margin.",
    wikiPl: "https://pl.wikipedia.org/wiki/Paracetamol",
    wikiEn: "https://en.wikipedia.org/wiki/Paracetamol",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-TOX-01"]
  },
  {
    id: "ibuprofen",
    minLevel: 1,
    inn: "Ibuprofen",
    groupId: "otc-human-analgesic",
    groupPl: "Ludzki lek przeciwbólowy (OTC)", groupEn: "Human NSAID (OTC)",
    tooltipPl: "Ludzki NSAID z apteki. TOKSYCZNY u psa i kota - wrzody żołądka, niewydolność nerek. Nigdy.",
    tooltipEn: "Human NSAID from pharmacy. TOXIC in dogs and cats — gastric ulcers, kidney failure. Never.",
    routePl: "p.o.", routeEn: "oral",
    dosingType: "systemic",
    dosing: {
      dog: { mgPerKg: { min: 0, max: 0 }, unitNotePl: "toksyczny", frequencyPl: "-" },
      cat: { mgPerKg: { min: 0, max: 0 }, unitNotePl: "toksyczny", frequencyPl: "-" }
    },
    speciesToxic: ["dog", "cat"],
    antibiotic: false,
    infoPl: "Ibuprofen to ludzki NSAID z apteki. U psa i kota jest TOKSYCZNY - powoduje wrzody żołądka i niewydolność nerek. Nigdy nie podawać z domowej apteczki - u zwierząt stosuje się weterynaryjne NSAID o znanym marginesie.\n\nKoty i psy metabolizują ibuprofen inaczej niż człowiek - nawet zwykła dawka z apteczki może wywołać krwawienie z żołądka i ostrą niewydolność nerek. U kota ryzyko jest szczególnie wysokie, bo jego nerki są wrażliwe na NSAID.\n\nIbuprofen to klasyczna lekcja: to, co u człowieka jest łagodnym lekiem, u zwierząt bywa trucizną. Nigdy nie sięgaj po ludzkie leki z apteczki dla zwierzęcia - weterynaryjne NSAID mają znany margines bezpieczeństwa.",
    infoEn: "Ibuprofen is a human NSAID from the pharmacy. In dogs and cats it is TOXIC — it causes gastric ulcers and kidney failure. Never give it from the home medicine cabinet — animals receive veterinary NSAIDs with a known safety margin.\n\nDogs and cats metabolize ibuprofen differently than humans — even an ordinary dose from the cabinet can trigger stomach bleeding and acute kidney failure. In cats the risk is especially high, because their kidneys are sensitive to NSAIDs.\n\nIbuprofen is a classic lesson: what is a mild drug in humans can be a poison in animals. Never reach for human medicines from the cabinet for an animal — veterinary NSAIDs have a known safety margin.",
    wikiPl: "https://pl.wikipedia.org/wiki/Ibuprofen",
    wikiEn: "https://en.wikipedia.org/wiki/Ibuprofen",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-TOX-02"]
  }
  ,
  {
    id: "imidocarb",
    minLevel: 3,
    inn: "Imidokarb",
    groupId: "antiprotozoal",
    groupPl: "Przeciwpierwotniakowy", groupEn: "Antiprotozoal",
    tooltipPl: "Lek na pierwotniaki krwi (Babesia) - zabija piroplazmy w erytrocytach.",
    tooltipEn: "Drug for blood protozoa (Babesia) — kills piroplasms inside erythrocytes.",
    routePl: "i.m. / s.c.", routeEn: "i.m. / s.c.",
    dosingType: "systemic",
    dosing: {
      dog: {
        mgPerKg: { min: 5, max: 6 },
        frequencyPl: "jedna dawka i.m., powtórzenie za 2 tygodnie"
      }
    },
    speciesToxic: [],
    antibiotic: false,
    infoPl: "Imidokarb to lek przeciwpierwotniakowy stosowany w babeszjozie (piroplazmozie) psa - chorobie przenoszonej przez kleszcze, w której pierwotniak Babesia wnika do erytrocytów i je niszczy, wywołując anemię. Imidokarb zabija piroplazmy wewnątrz krwinek czerwonych; podaje się go domięśniowo lub podskórnie, zwykle w jednej dawce z powtórzeniem za dwa tygodnie.\n\nDawka u psa wynosi 5–6 mg/kg masy ciała. Lek ma wąski margines bezpieczeństwa - przedawkowanie wywołuje ślinotok, wymioty i objawy cholinergiczne, dlatego liczy się mg/kg dokładnie tak jak przy antybiotyku: dawka mg = mg/kg × waga kg. Nie jest antybiotykiem - nie działa na bakterie, a podanie go na zwykłą infekcję bakteryjną byłoby błędem.\n\nImidokarb łączy diagnostykę z leczeniem: rozmaz krwi potwierdza Babesię, a ten lek ją zabija. Razem z kontrolą pasożytów w środowisku i prewencją kleszczową uczy, że kleszcz to nie tylko swędzący punkcik - to wektor śmiertelnej choroby, którą można leczyć skierowanym lekiem, a najlepiej w ogóle nie dopuścić do zakażenia.",
    infoEn: "Imidocarb is an anti-protozoal drug used in canine babesiosis — a tick-borne disease in which the Babesia protozoan enters erythrocytes and destroys them, causing anemia. Imidocarb kills the piroplasms inside the red cells; it is given intramuscularly or subcutaneously, usually as a single dose repeated after two weeks.\n\nThe dose in the dog is 5–6 mg per kilogram body weight. The drug has a narrow safety margin — overdose causes salivation, vomiting and cholinergic signs, so the mg/kg is counted exactly as with an antibiotic: dose mg = mg/kg × weight kg. It is not an antibiotic — it does not act on bacteria, and giving it for an ordinary bacterial infection would be a mistake.\n\nImidocarb links diagnostics with treatment: the blood smear confirms Babesia, and this drug kills it. Together with environmental parasite control and tick prevention it teaches that a tick is not just an itchy speck — it is the vector of a lethal disease that can be treated with a targeted drug, and best of all prevented.",
    wikiPl: "https://en.wikipedia.org/wiki/Imidocarb",
    wikiEn: "https://en.wikipedia.org/wiki/Imidocarb",
    reviewStatus: "llm-audited", reviewDate: "2026-08-10", sources: ["S-MVM"], claimIds: ["C-DRG-19"]
  },
{
      "id": "ivermectin",
      "minLevel": 1,
      "inn": "Iwermektyna",
      "groupId": "antiparasitic",
      "groupPl": "Przeciwpasożytniczy (makrocykliczny lakton)",
      "groupEn": "Antiparasitic (macrocyclic lactone)",
      "tooltipPl": "Na roztocza i nicienie u ptaków i małych zwierząt; spot-on lub doustnie.",
      "tooltipEn": "Against mites and nematodes in birds and small animals; spot-on or oral.",
      "routePl": "spot-on/p.o.",
      "routeEn": "topical/oral",
      "dosingType": "topical",
      "dosing": {
        "parrot": {
          "unitNotePl": "1 kropla spot-on na skórę karku, powtórzyć za 2 tygodnie",
          "unitNoteEn": "1 drop spot-on on nape skin, repeat in 2 weeks",
          "frequencyPl": "jednorazowo, powtórzyć za 2 tyg."
        }
      },
      "speciesToxic": ["tortoise"],
      "antibiotic": false,
      "infoPl": "Iwermektyna to przeciwpasożytniczy lek z grupy makrocyklicznych laktonów — działa na roztocza (Knemidokoptes, Sarcoptes) i nicienie. U ptaków podaje się ją jako spot-on (jedna kropla na skórę karku), powtarzając po 2 tygodniach na roztocza, które wylęgły się z jaj. Ma szeroki margines bezpieczeństwa w zalecanej dawce.\n\nPodręcznikowo (Merck Veterinary Manual) dawkowanie to 0,2 mg/kg p.o. lub i.m. W praktyce awiaryjnej u małych ptaków (papużki, nimfy) często stosuje się rozwodniony roztwór spot-on na skórę karku — dawka p.o./i.m. u ptaka 30–90 g jest trudna do precyzyjnego odmierzenia bez rozcieńczenia, a spot-on omija ten problem.\n\nTo lek z wyboru na świerzb twarzowy papużek — przywraca dziób do normy, gdy połączy się go ze spiłowaniem. Nie jest antybiotykiem — nie wybiera oporności bakteryjnej (AMR), bo jej cel to pasożyty, nie bakterie. Podaje się ją na skórę, nie doustnie, więc u małego ptaka nie wymaga obliczania mg/kg — jedna kropla wystarcza.",
      "infoEn": "Ivermectin is an antiparasitic from the macrocyclic lactone class — it acts on mites (Knemidokoptes, Sarcoptes) and nematodes. In birds it is given as a spot-on (one drop on nape skin), repeated after 2 weeks to catch mites that hatched from eggs. It has a wide safety margin at the recommended dose.\n\nPer the Merck Veterinary Manual the dose is 0.2 mg/kg PO or IM. In avian practice with small birds (budgerigars, cockatiels) a diluted spot-on on nape skin is often used instead — the PO/IM dose for a 30–90 g bird is hard to measure precisely without dilution, and the spot-on bypasses that problem.\n\nIt is the drug of choice for scaly face mites in budgerigars — it restores the beak to normal when combined with a trim. It is not an antibiotic — it does not drive bacterial resistance (AMR), because its target is parasites, not bacteria. It is applied to the skin, not orally, so for a small bird it needs no mg/kg calculation — one drop suffices.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Iwermektyna",
      "wikiEn": "https://en.wikipedia.org/wiki/Ivermectin",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM",
        "S-PLUMB"
      ],
      "claimIds": [
        "C-DRG-22"
      ]
    },
{
      "id": "calcium-gluconate",
      "minLevel": 2,
      "inn": "Głukonian wapnia",
      "groupId": "calcium",
      "groupPl": "Wapń (preparat wapniowy)",
      "groupEn": "Calcium (calcium preparation)",
      "tooltipPl": "Wapń na hipokalcemię i zatrzymanie jaja; wzmacnia skurcze jajowodu.",
      "tooltipEn": "Calcium for hypocalcemia and egg binding; strengthens oviduct contractions.",
      "routePl": "p.o. / i.v.",
      "routeEn": "oral / intravenous",
      "dosingType": "systemic",
      "dosing": {
        "parrot": {
          "mgPerKg": { "min": 50, "max": 100 },
          "unitNotePl": "50-100 mg/kg p.o. lub i.v. (powoli); w nagłej hipokalcemii i.v./i.o. powoli",
          "unitNoteEn": "50-100 mg/kg PO or IV (slowly); for acute hypocalcemia IV/IO slowly",
          "frequencyPl": "jednorazowo, w razie potrzeby powtórzyć"
        }
      },
      "speciesToxic": [],
      "infoPl": "Głukonian wapnia to preparat wapniowy kluczowy w zatrzymaniu jaja u ptaków. Hipokalcemia — niski poziom wapnia we krwi — osłabia skurcze mięśni gładkich jajowodu, przez co jajo utknęło. Podanie wapnia często wystarcza, by samica zniosła jajo bez operacji. Dawka u ptaków to 50–100 mg/kg p.o. lub i.v. (powoli), w nagłej hipokalcemii i.v. lub doszpikowo (i.o.).\n\nWapń podaje się zawsze PRZED oksytocyną. Oksytocyna wywołuje skurcze, ale bez wapnia są one słabe i nieskuteczne — a czasem szkodliwe. Wapń wzmacnia skurcz, a dopiero potem oksytocyna może go napędzić.\n\nW grze to lek pierwszego rzutu przy zatrzymaniu jaja — wzmacnia skurcz jajowodu i pozwala jaju przejść. Antybiotyk i NSAID są przeciwwskazane: to nie infekcja, a leki te obciążają nerki i układ pokarmowy ptaka.\n\nTen lek uczy, że w medycynie ptaków wapń to często pierwszy i najważniejszy krok — a operacja to ostateczność.",
      "infoEn": "Calcium gluconate is a calcium preparation key in egg binding of birds. Hypocalcemia — low blood calcium — weakens the smooth-muscle contractions of the oviduct, so the egg gets stuck. Giving calcium often suffices for the hen to pass the egg without surgery. The dose in birds is 50–100 mg/kg PO or IV (slowly); for acute hypocalcemia IV or intraosseous (IO).\n\nCalcium is always given BEFORE oxytocin. Oxytocin triggers contractions, but without calcium they are weak and ineffective — and sometimes harmful. Calcium strengthens the contraction, and only then can oxytocin drive it.\n\nIn the game it is the first-line drug for egg binding — it strengthens the oviduct contraction and lets the egg pass. Antibiotics and NSAIDs are contraindicated: this is not an infection, and these drugs burden the kidneys and GI tract of the bird.\n\nThis drug teaches that in avian medicine calcium is often the first and most important step — and surgery is the last resort.",
      "wikiPl": "https://en.wikipedia.org/wiki/Calcium_gluconate",
      "wikiEn": "https://en.wikipedia.org/wiki/Calcium_gluconate",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM",
        "S-PLUMB"
      ],
      "claimIds": [
        "C-DRG-23"
      ]
    },
  {
    "id": "calcium-carbonate",
    "minLevel": 2,
    "inn": "Węglan wapnia",
    "groupId": "vitamin-mineral",
    "groupPl": "Suplement wapnia",
    "groupEn": "Calcium supplement",
    "tooltipPl": "Doustny preparat wapnia na MBD u gadów — uzupełnia niedobór i mineralizuje kości i pancerz.",
    "tooltipEn": "Oral calcium preparation for MBD in reptiles — replenishes deficiency and mineralizes bones and shell.",
    "routePl": "p.o.",
    "routeEn": "oral",
    "dosingType": "systemic",
    "dosing": {
      "tortoise": {
        "mgPerKg": { "min": 100, "max": 300 },
        "frequencyPl": "1× dziennie, 2–4 tygodnie"
      }
    },
    "speciesToxic": [],
    "antibiotic": false,
    "infoPl": "Węglan wapnia to doustny preparat uzupełniający niedobór wapnia — pierwiastka niezbędnego do mineralizacji kości i pancerza u gadów. W chorobie metabolicznej kości (MBD) wapń jest niedoborowy, bo bez witaminy D3 (i UVB) organizm nie wchłania go z pokarmu. Suplementacja doustna omija ten problem, dostarczając wapnia bezpośrednio.\n\nWapń nie ma wąskiego marginesu terapeutycznego — ma szerokie okno bezpieczeństwa, bo nadmiar wydalany jest przez nerki i jelita. Dlatego pasmo dawki jest szerokie (100–300 mg/kg), a dokładne trafienie w suwaku mniej krytyczne niż przy lekach o wąskim marginesie (NSAID, opioidy). Terapia trwa tygodniami — kość się przebudowuje powoli.\n\nWęglan wapnia to nie antybiotyk i nie działa na patogeny — leczy niedobór, nie infekcję. Podanie antybiotyku na MBD to błąd: choroba jest metaboliczna, nie bakteryjna, a antybiotyk napędza oporność (AMR) bez korzyści.",
    "infoEn": "Calcium carbonate is an oral preparation that replenishes calcium deficiency — the element essential for bone and shell mineralization in reptiles. In metabolic bone disease (MBD) calcium is deficient, because without vitamin D3 (and UVB) the body cannot absorb it from food. Oral supplementation bypasses this problem by delivering calcium directly.\n\nCalcium is not therapeutically narrow — it has a wide safety window, because the excess is excreted by the kidneys and gut. That is why the dose band is wide (100–300 mg/kg) and hitting the exact value on the slider is less critical than with narrow-margin drugs (NSAIDs, opioids). Therapy lasts weeks — bone rebuilds slowly.\n\nCalcium carbonate is not an antibiotic and does not act on pathogens — it treats a deficiency, not an infection. Giving an antibiotic for MBD is a mistake: the disease is metabolic, not bacterial, and an antibiotic drives resistance (AMR) with no benefit.",
    "wikiPl": "https://pl.wikipedia.org/wiki/W%C4%99glan_wapnia",
    "wikiEn": "https://en.wikipedia.org/wiki/Calcium_carbonate",
    "reviewStatus": "draft",
    "reviewDate": null,
    "sources": ["S-MVM"],
    "claimIds": ["C-DRG-24"]
  },
  {
    "id": "vitamin-d3",
    "minLevel": 2,
    "inn": "Cholekalcyferol (witamina D3)",
    "groupId": "vitamin-mineral",
    "groupPl": "Witamina D3",
    "groupEn": "Vitamin D3",
    "tooltipPl": "Witamina D3 — umożliwia wchłanianie wapnia z jelita; bez niej kości i pancerz się nie mineralizują.",
    "tooltipEn": "Vitamin D3 — enables intestinal calcium absorption; without it bones and shell cannot mineralize.",
    "routePl": "p.o.",
    "routeEn": "oral",
    "dosingType": "topical",
    "dosing": {
      "tortoise": {
        "unitNotePl": "100–400 IU doustnie, co 7 dni",
        "frequencyPl": "co 7 dni, 3–4 dawki"
      }
    },
    "speciesToxic": [],
    "antibiotic": false,
    "infoPl": "Witamina D3 (cholekalcyferol) to klucz do wchłaniania wapnia — bez niej jelito nie przyswaja wapnia z pokarmu, a kości i pancerz się nie mineralizują. W naturze żółw syntetyzuje witaminę D3 w skórze pod promieniowaniem UVB (280–315 nm). W niewoli, bez lampy UVB, synteza ustaje i prowadzi do choroby metabolicznej kości (MBD).\n\nDawkowanie witaminy D3 podaje się w jednostkach międzynarodowych (IU), nie w mg — dlatego w grze dawkowanie jest opisowe (topical), bez suwaka mg/kg. W skórze żółwia z lampą UVB witamina D3 powstaje endogennie, więc u zdrowego, dobrze oświetlonego żółwia suplement nie jest potrzebny.\n\nWitamina D3 to nie antybiotyk — nie działa na bakterie. Podanie antybiotyku na MBD to błąd: choroba metaboliczna nie jest infekcją. Leczenie MBD opiera się na trzech elementach: wapń + witamina D3 + korekcja oświetlenia UVB i diety. Bez UVB suplementacja wapnia i D3 musi trwać dłużej.",
    "infoEn": "Vitamin D3 (cholecalciferol) is the key to calcium absorption — without it the gut cannot absorb calcium from food, and bones and shell fail to mineralize. In nature a tortoise synthesizes vitamin D3 in its skin under UVB radiation (280–315 nm). In captivity, without a UVB lamp, synthesis stops and metabolic bone disease (MBD) follows.\n\nVitamin D3 is dosed in international units (IU), not in mg — that is why in the game the dosing is descriptive (topical), without an mg/kg slider. In the skin of a tortoise with a UVB lamp vitamin D3 is made endogenously, so a healthy, well-lit tortoise does not need supplementation.\n\nVitamin D3 is not an antibiotic — it does not act on bacteria. Giving an antibiotic for MBD is a mistake: a metabolic disease is not an infection. Treatment of MBD is a trio: calcium + vitamin D3 + correction of UVB lighting and diet. Without UVB the calcium and D3 supplementation must last longer.",
    "wikiPl": "https://pl.wikipedia.org/wiki/Witamina_D",
    "wikiEn": "https://en.wikipedia.org/wiki/Vitamin_D",
    "reviewStatus": "draft",
    "reviewDate": null,
    "sources": ["S-MVM"],
    "claimIds": ["C-DRG-25"]
  },
  {
    "id": "prednisolone",
    "minLevel": 3,
    "inn": "Prednizolon",
    "groupId": "endocrine",
    "groupPl": "Glikokortykosteroid (endokrynny)",
    "groupEn": "Glucocorticoid (endocrine)",
    "tooltipPl": "Podnosi glukozę we krwi przez stymulację glukoneogenezy — lek pierwszego rzutu w insulinomie (hipoglikemia) u fretek.",
    "tooltipEn": "Raises blood glucose by stimulating gluconeogenesis — first-line drug for insulinoma (hypoglycemia) in ferrets.",
    "routePl": "p.o.",
    "routeEn": "oral",
    "dosingType": "systemic",
    "dosing": {
      "ferret": {
        "mgPerKg": { "min": 0.5, "max": 2 },
        "frequencyPl": "2× dziennie"
      }
    },
    "speciesToxic": [],
    "antibiotic": false,
    "infoPl": "Prednizolon to glikokortykosteroid — lek, który stymuluje glukoneogenezę (produkcję glukozy z białek i tłuszczów w wątrobie), podnosząc poziom cukru we krwi. W insulinomie u fretek to lek pierwszego rzutu: guz wysepek trzustki nadmiernie wydziela insulinę, glukoza spada, a prednizolon ją podnosi, kontrolując objawy hipoglikemii.\n\nLeczenie prednizolonem jest paliatywne — kontroluje objawy, ale nie leczy guza. Dawkę zwiększa się, gdy objawy wracają. Długotrwałe stosowanie niesie skutki uboczne sterydów: immunosupresja (osłabiona odporność), zwiększone pragnienie i oddawanie moczu, zmiany skórne.\n\nTo nie antybiotyk — nie działa na bakterie. Podanie antybiotyku na insulinom to błąd: choroba nie jest infekcją. Insulinoma to nowotwór metaboliczny, a prednizolon to lek endokrynny, który reguluje glukozę, a nie zabija patogen.",
    "infoEn": "Prednisolone is a glucocorticoid — a drug that stimulates gluconeogenesis (production of glucose from proteins and fats in the liver), raising blood sugar. In insulinoma in ferrets it is the first-line drug: the pancreatic beta-cell tumor over-secretes insulin, glucose drops, and prednisolone raises it back, controlling the signs of hypoglycemia.\n\nTreatment with prednisolone is palliative — it controls signs but does not cure the tumor. The dose is increased when signs recur. Long-term use carries steroid side effects: immunosuppression (weakened immunity), increased thirst and urination, skin changes.\n\nIt is not an antibiotic — it does not act on bacteria. Giving an antibiotic for insulinoma is a mistake: the disease is not an infection. Insulinoma is a metabolic tumor, and prednisolone is an endocrine drug that regulates glucose, not a drug that kills pathogens.",
    "wikiPl": "https://pl.wikipedia.org/wiki/Prednizolon",
    "wikiEn": "https://en.wikipedia.org/wiki/Prednisolone",
    "reviewStatus": "draft",
    "reviewDate": null,
    "sources": ["S-MVM"],
    "claimIds": ["C-DRG-26"]
  },
  {
    "id": "diazoxide",
    "minLevel": 3,
    "inn": "Diazoksyd",
    "groupId": "endocrine",
    "groupPl": "Inhibitor uwalniania insuliny",
    "groupEn": "Insulin-release inhibitor",
    "tooltipPl": "Hamuje uwalnianie insuliny z komórek beta trzustki — lek drugiego rzutu w insulinomie, gdy prednizolon nie wystarcza; droższy.",
    "tooltipEn": "Inhibits insulin release from pancreatic beta cells — second-line for insulinoma when prednisolone is inadequate; more expensive.",
    "routePl": "p.o.",
    "routeEn": "oral",
    "dosingType": "systemic",
    "dosing": {
      "ferret": {
        "mgPerKg": { "min": 5, "max": 30 },
        "frequencyPl": "2× dziennie (tytułować do efektu)"
      }
    },
    "speciesToxic": [],
    "antibiotic": false,
    "infoPl": "Diazoksyd to lek hamujący uwalnianie insuliny — otwiera kanały potasowe zależne od ATP (K-ATP) w komórkach beta trzustki, co zamyka kanały wapniowe i blokuje wydzielanie insuliny. Mniej insuliny = wyższa glukoza. W insulinomie u fretek to lek drugiego rzutu: stosuje się go, gdy prednizolon już nie wystarcza, a objawy hipoglikemii wracają.\n\nDawkę dobiera się do efektu — zaczyna się od najniższej (5 mg/kg) i zwiększa, aż glukoza się ustabilizuje. Diazoksyd jest droższy od prednizolonu i często łączy się go z prednizolonem, gdy żaden z leków sam nie działa.\n\nTo nie antybiotyk — nie działa na bakterie. Insulinoma to nowotwór endokrynny, a diazoksyd to lek regulujący wydzielanie insuliny, a nie lek przeciwdrobnoustrojowy. Podanie antybiotyku na insulinom to błąd: choroba nie jest infekcją.",
    "infoEn": "Diazoxide is a drug that inhibits insulin release — it opens ATP-sensitive potassium channels (K-ATP) in the pancreatic beta cells, which closes calcium channels and blocks insulin secretion. Less insulin = higher glucose. In insulinoma in ferrets it is the second-line drug: it is used when prednisolone is no longer enough and the signs of hypoglycemia recur.\n\nThe dose is titrated to effect — starting at the lowest (5 mg/kg) and increasing until glucose stabilizes. Diazoxide is more expensive than prednisolone and is often combined with it when neither drug alone works.\n\nIt is not an antibiotic — it does not act on bacteria. Insulinoma is an endocrine tumor, and diazoxide is a drug that regulates insulin secretion, not an antimicrobial. Giving an antibiotic for insulinoma is a mistake: the disease is not an infection.",
    "wikiPl": "https://pl.wikipedia.org/wiki/Diazoksyd",
    "wikiEn": "https://en.wikipedia.org/wiki/Diazoxide",
    "reviewStatus": "draft",
    "reviewDate": null,
    "sources": ["S-MVM"],
    "claimIds": ["C-DRG-27"]
  }
];

// Metadane grup leków — opis sekcji (co to za grupa, kiedy się stosuje w weterynarii).
// Kolejność = kolejność wyświetlania w leczeniu. image = banner grupy (img/drug-groups/...).
export const drugGroups = [
  {
    id: "antiseptic-topical",
    labelPl: "Antyseptyki miejscowe", labelEn: "Topical antiseptics",
    descPl: "Odkażają ranę i skórę z zewnątrz, nie wnikają w tkanki i nie wybierają oporności (AMR) - klasyk do czystych ran i przygotowania skóry.",
    descEn: "Disinfect wound and skin from the outside, do not penetrate tissue and do not drive resistance (AMR) — a mainstay for clean wounds and skin prep.",
    image: "drug-groups/antiseptic-topical.webp"
  },
  {
    id: "ear-drops",
    labelPl: "Krople do uszu (złożone)", labelEn: "Ear drops (complex)",
    descPl: "Miejscowe leczenie zapalenia ucha - łączą antybiotyk, lek przeciwgrzybiczy i steryd dobierane wg cytologii.",
    descEn: "Topical otitis treatment — combine an antibiotic, an antifungal and a steroid chosen per cytology.",
    image: "drug-groups/ear-drops.webp"
  },
  {
    id: "antibiotic",
    labelPl: "Antybiotyki", labelEn: "Antibiotics",
    descPl: "Leki przeciwbakteryjne - uzasadnione tylko przy potwierdzonej infekcji bakteryjnej; nadużycie napędza oporność (AMR).",
    descEn: "Antibacterial drugs — justified only by confirmed bacterial infection; overuse drives resistance (AMR).",
    image: "drug-groups/antibiotic.webp"
  },
  {
    id: "antiparasitic",
    labelPl: "Leki przeciwpasożytnicze", labelEn: "Antiparasitics",
    descPl: "Przeciwnicieniowe, przeciwtasiemcowe i przeciwko ektopasożytom (pchły, kleszcze) - dobór wg grupy pasożyta.",
    descEn: "Anti-nematode, anti-tapeworm and against ectoparasites (fleas, ticks) — chosen per parasite group.",
    image: "drug-groups/antiparasitic.webp"
  },
  {
    id: "nsaid",
    labelPl: "Przeciwzapalne i przeciwbólowe", labelEn: "NSAIDs (anti-inflammatory/analgesic)",
    descPl: "Niesteroidowe leki przeciwzapalne - przeciwbólowe i przeciwzapalne; ostrożnie u kotów i przy chorobach nerek.",
    descEn: "Non-steroidal anti-inflammatories — analgesic and anti-inflammatory; caution in cats and kidney disease.",
    image: "drug-groups/nsaid.webp"
  },
  {
    id: "opioid",
    labelPl: "Opioidy", labelEn: "Opioids",
    descPl: "Silne analgetyki - przy silnym bólu (uraz, zabieg); rezerwa z powodu sedacji i depresji oddechowej.",
    descEn: "Strong analgesics — for severe pain (trauma, procedure); reserved due to sedation and respiratory depression.",
 image: "drug-groups/opioid.webp"
  },
  {
    id: "otc-human-analgesic",
    labelPl: "Ludzkie leki OTC (przeciwwskazane)", labelEn: "Human OTC analgesics (contraindicated)",
    descPl: "Ibuprofen, paracetamol - toksyczne dla zwierząt; nigdy bez weterynarza. W grze jako pułapka edukacyjna.",
    descEn: "Ibuprofen, acetaminophen — toxic to animals; never without a vet. In the game as an educational trap.",
    image: "drug-groups/otc-human-analgesic.webp"
  }
  ,
  {
    id: "antiprotozoal",
    labelPl: "Przeciwpierwotniakowe", labelEn: "Antiprotozoal",
    descPl: "Leki na pierwotniaki krwi i tkanek (Babesia) - zabijają patogen wewnątrz komórek, nie są antybiotykami.",
    descEn: "Drugs for blood and tissue protozoa (Babesia) — kill the pathogen inside cells, not antibiotics.",
    image: "drug-groups/antiprotozoal.webp"
  },
{
      "id": "calcium",
      "labelPl": "Wapń",
      "labelEn": "Calcium",
      "descPl": "Preparaty wapnia — kluczowe w hipokalcemii i zatrzymaniu jaja u ptaków.",
      "descEn": "Calcium preparations — key in hypocalcemia and egg binding in birds.",
      "image": "drug-groups/calcium.webp"
    },
  {
      "id": "vitamin-mineral",
      "labelPl": "Suplementy mineralno-witaminowe",
      "labelEn": "Mineral-vitamin supplements",
      "descPl": "Suplementy wapnia i witaminy D3 — kluczowe w chorobie metabolicznej kości (MBD) u gadów: uzupełniają niedobór i umożliwiają mineralizację kości i pancerza.",
      "descEn": "Calcium and vitamin D3 supplements — key in metabolic bone disease (MBD) in reptiles: they replenish the deficiency and enable bone and shell mineralization.",
      "image": "drug-groups/vitamin-mineral.webp"
    },
  {
    id: "endocrine",
    labelPl: "Leki endokrynne", labelEn: "Endocrine drugs",
    descPl: "Leki regulujące hormony i poziom glukozy — np. w insulinomie (hipoglikemia) u fretek: prednizolon podnosi glukozę, diazoksyd hamuje uwalnianie insuliny.",
    descEn: "Drugs that regulate hormones and glucose — e.g. for insulinoma (hypoglycemia) in ferrets: prednisolone raises glucose, diazoxide inhibits insulin release.",
    image: "drug-groups/endocrine.webp"
  }
];

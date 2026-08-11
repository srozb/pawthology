// Gatunki pacjentów. Rozszerzanie = nowy wpis. reviewStatus w claims.md (C-SPC-*).
export const species = [
  {
    id: "dog",
    labelPl: "Pies",
    labelEn: "Dog",
    weightRangeKg: { min: 2, max: 60 },
    // Leki gatunkowo toksyczne — KAŻDA dawka szkodliwa (R-DRUG-SPECIES-TOXIC).
    toxicDrugs: ["ibuprofen"],
    notesPl: "Psy tolerują wąskie spektrum leków ludzkich; ibuprofen toksyczny.",
    notesEn: "Dogs tolerate a narrow range of human drugs; ibuprofen is toxic.",
    infoPl: "Psy to najczęstsi pacjenci małych zwierząt - od otarć po pchły, każdy przypadek inny.\n\nTypowe problemy: otarcia i rany po spacerze lub wypadku, zapalenie ucha (zwłaszcza u ras z opadającymi uszami i po pływaniu), urazy naruszeniowe - złamania po potrąceniu, oraz zarażenie pchłami. Każde z nich ma swoje leczenie: rana potrzebuje antyseptyku, ucho - kropli po cytologii, uraz - szyny i analgezji, a pchły - leku przeciwpasożytniczego.\n\nAntybiotyk jest uzasadniony tylko przy potwierdzonej infekcji bakteryjnej - nie przy czystym urazie. Podany na wszelki wypadek napędza oporność (AMR) bez korzyści dla pacjenta.",
    infoEn: "Dogs are the most common small-animal patients — from abrasions to fleas, every case is different.\n\nTypical problems: abrasions and wounds after a walk or accident, ear inflammation (especially in floppy-eared breeds and after swimming), traumatic injuries such as fractures after being hit, and flea infestations. Each has its own treatment: a wound needs an antiseptic, an ear needs drops after cytology, an injury needs a splint and analgesia, and fleas need an antiparasitic.\n\nAn antibiotic is justified only for confirmed bacterial infection — not for a clean injury. Given just in case, it drives resistance (AMR) with no benefit to the patient.",
    wikiPl: "https://pl.wikipedia.org/wiki/Pies_domowy",
    wikiEn: "https://en.wikipedia.org/wiki/Dog",
    claimIds: ["C-SPC-02"]
  },
  {
    id: "cat",
    labelPl: "Kot",
    labelEn: "Cat",
    weightRangeKg: { min: 2, max: 8 },
    toxicDrugs: ["acetaminophen", "ibuprofen"],
    notesPl: "Koty słabo glukuronidują - wiele leków ludzkich (paracetamol, ibuprofen) jest toksycznych.",
    notesEn: "Cats poorly glucuronidate — many human drugs (acetaminophen, ibuprofen) are toxic.",
    infoPl: "Koty słabo metabolizują niektóre leki - ich wątroba ma słabą glukuronidację, dlatego paracetamol i ibuprofen z domowej apteczki są dla nich trucizną.\n\nCzęste problemy to biegunki (wychodzące koty łapią myszy - nicienie i pierwotniaki), pchły i alergia pchła, oraz choroby nerek u starszych kotów. Biegunkę pasożytniczą leczy się odrobaczaniem, a antybiotyk bez potwierdzenia jest błędem - niszczy florę jelitową i napędza oporność (AMR).\n\nDlatego u kota każdy lek ludzki z apteczki to ryzyko: sięgaj po weterynaryjne odpowiedniki o znanym marginesie bezpieczeństwa.",
    infoEn: "Cats poorly metabolize some drugs — their liver has weak glucuronidation, so acetaminophen and ibuprofen from the home medicine cabinet are poison to them.\n\nCommon problems are diarrhea (outdoor cats catch mice — nematodes and protozoa), fleas and flea allergy, and kidney disease in older cats. Parasitic diarrhea is treated with deworming, and an antibiotic without confirmation is a mistake — it destroys the gut flora and drives resistance (AMR).\n\nThat is why any human medicine from the cabinet is a risk in a cat: reach for veterinary equivalents with a known safety margin.",
    wikiPl: "https://pl.wikipedia.org/wiki/Kot_domowy",
    wikiEn: "https://en.wikipedia.org/wiki/Cat",
    claimIds: ["C-SPC-01"]
  },
  {
    id: "rabbit",
    labelPl: "Królik",
    labelEn: "Rabbit",
    weightRangeKg: { min: 1, max: 5 },
    // Doustne antybiotyki β-laktamowe i cefalosporyny zabijają florę jelitową królika → śmiertelna enterotoxemia.
    toxicDrugs: ["amoxicillin-clavulanate", "cefalexin"],
    notesPl: "Króliki mają delikatną florę jelitową - doustne antybiotyki β-laktamowe i cefalosporyny mogą wywołać śmiertelną enterotoksemię. Zęby rosną przez całe życie (elodontyczne).",
    notesEn: "Rabbits have delicate gut flora — oral β-lactam and cephalosporin antibiotics can cause fatal enterotoxemia. Teeth grow continuously (elodont).",
    infoPl: "Króliki to pacjenci szczególni - ich anatomia i metabolizm różnią się od psa i kota, dlatego leczenie wymaga ostrożności.\n\nZęby (siekiacze i trzonowce) są elodontyczne - rosną przez całe życie, więc przerost i malokluzja są częste i wymagają korygowania. Flora jelitowa jest delikatna: doustne antybiotyki β-laktamowe i cefalosporyny (np. amoksycylina, cefaleksyna) niszczą ją i mogą wywołać śmiertelną enterotoksemię.\n\nDlatego u królika bezpieczniejsze są wybrane fluorochinolony (enrofloksacyna) i metronidazol - zawsze ostrożnie, krótko i z uzasadnieniem. Każdy doustny antybiotyk to u królika decyzja wysokiego ryzyka.",
    infoEn: "Rabbits are special patients — their anatomy and metabolism differ from dogs and cats, so treatment demands caution.\n\nTheir teeth (incisors and cheek teeth) are elodont — they grow continuously, so overgrowth and malocclusion are common and need correction. The gut flora is delicate: oral β-lactam and cephalosporin antibiotics (e.g. amoxicillin, cefalexin) destroy it and can cause fatal enterotoxemia.\n\nThat is why safer choices in rabbits include selected fluoroquinolones (enrofloxacin) and metronidazole — always used cautiously, briefly, and with justification. Any oral antibiotic in a rabbit is a high-risk decision.",
    wikiPl: "https://pl.wikipedia.org/wiki/Kr%C3%B3lik_domowy",
    wikiEn: "https://en.wikipedia.org/wiki/Domestic_rabbit",
    claimIds: ["C-SPC-03"]
  },
  {
    id: "guinea-pig",
    labelPl: "Świnka morska", labelEn: "Guinea pig",
    weightRangeKg: { min: 0.3, max: 1.5 },
    // Jak królik: hindgut fermenter z delikatną florą. Doustne β-laktamy/cefalosporyny → śmiertelna enterotoksemia.
    toxicDrugs: ["amoxicillin-clavulanate", "cefalexin"],
    notesPl: "Świnki morskie mają delikatną florę jelitową (jak królik) - doustne antybiotyki β-laktamowe i cefalosporyny mogą wywołać śmiertelną enterotoksemię. Nie syntezują witaminy C - muszą ją dostawać z pokarmu.",
    notesEn: "Guinea pigs have delicate gut flora (like rabbits) - oral β-lactam and cephalosporin antibiotics can cause fatal enterotoxemia. They cannot synthesize vitamin C and must obtain it from the diet.",
    infoPl: "Świnki morskie to, jak króliki, hindgut fermenters - zależą od delikatnej flory jelitowej, którą doustne antybiotyki β-laktamowe i cefalosporyny (amoksycylina, cefaleksyna) niszczą, wywołując śmiertelną enterotoksemię. Dlatego u świnki te leki są zakazane, a bezpieczniejsze są wybrane fluorochinolony (enrofloksacyna) - zawsze ostrożnie i z uzasadnieniem.\n\nDruga osobliwość: świnka morska, jak człowiek i w przeciwieństwie do większości ssaków, nie syntezuje witaminy C. Jej brak w diecie to szkorbut - osłabienie, krwawienia z dziąseł, złe gojenie ran. Dlatego karma dla świnki musi mieć witaminę C, a karma dla królika czy chomika nie wystarczy.\n\nCzęste problemy to roztocza (Trixacarus - nasilony świąd, łysienie), grzybica skóry (przenoszona na człowieka) i przerost zębów (zęby elodontyczne, jak u królika). Każdy doustny antybiotyk u świnki to decyzja wysokiego ryzyka - jak u królika.",
    infoEn: "Guinea pigs, like rabbits, are hindgut fermenters - they depend on a delicate gut flora that oral β-lactam and cephalosporin antibiotics (amoxicillin, cefalexin) destroy, causing fatal enterotoxemia. So in guinea pigs these drugs are forbidden, and selected fluoroquinolones (enrofloxacin) are safer - always cautiously and with justification.\n\nA second peculiarity: the guinea pig, like humans and unlike most mammals, cannot synthesize vitamin C. Its lack in the diet causes scurvy - weakness, bleeding gums, poor wound healing. So guinea pig food must contain vitamin C; rabbit or hamster food does not suffice.\n\nCommon problems are mites (Trixacarus - intense itching, hair loss), skin ringworm (transmissible to humans) and dental overgrowth (elodont teeth, like the rabbit). Any oral antibiotic in a guinea pig is a high-risk decision - as in the rabbit.",
    wikiPl: "https://pl.wikipedia.org/wiki/%C5%9Awinka_morska",
    wikiEn: "https://en.wikipedia.org/wiki/Guinea_pig",
    claimIds: ["C-SPC-04"]
  },
  {
    id: "hamster",
    labelPl: "Chomik", labelEn: "Hamster",
    weightRangeKg: { min: 0.03, max: 0.2 },
    toxicDrugs: [],
    notesPl: "Młode chomiki syryjskie są podatne na chorobę mokrego ogona - nagła, często śmiertelna biegunka. Zęby rosną przez całe życie (elodontyczne).",
    notesEn: "Young Syrian hamsters are prone to wet tail - sudden, often fatal diarrhea. Teeth grow continuously (elodont).",
    infoPl: "Chomiki to popularne małe zwierzęta, a chomik syryjski (złoty) jest zwykle samotnikiem - trzymanie dwóch razem to stres i walka. Mają policzki-poduszki do noszenia pokarmu i zęby elodontyczne, które rosną przez całe życie, więc przerost i problemy policzkowe bywają częste.\n\nNajbardziej znana choroba chomika to choroba mokrego ogona - nagła, wodnista biegunka u młodych, odstawionych od matki lub zestresowanych chomików syryjskich. Jest bakteryjna (Lawsonia atakuje jelito cienkie) i postępuje błyskawicznie - bez antybiotyku i płynów chomik ginie w 24-48 godzin. Tu antybiotyk (enrofloksacyna) jest wskazany i ratuje życie, co jest ważnym kontrastem z chorobami, gdzie antybiotyk szkodzi.\n\nChomiki tolerują więcej leków niż królik czy świnka morska, ale każdy lek liczy się wg wagi - chomik waży około 100 gramów, więc dawka to ułamek miligrama. Stres, dieta i samotność to trzy filary zdrowia chomika.",
    infoEn: "Hamsters are popular small pets, and the Syrian (golden) hamster is usually a solitary animal - keeping two together means stress and fighting. They have cheek pouches for carrying food and elodont teeth that grow throughout life, so overgrowth and pouch problems are common.\n\nThe best-known hamster disease is wet tail - sudden, watery diarrhea in young, weaned or stressed Syrian hamsters. It is bacterial (Lawsonia attacks the small intestine) and progresses rapidly - without an antibiotic and fluids the hamster dies in 24-48 hours. Here an antibiotic (enrofloxacin) is indicated and life-saving, an important contrast with diseases where an antibiotic harms.\n\nHamsters tolerate more drugs than a rabbit or guinea pig, but every drug is counted by weight - a hamster weighs about 100 grams, so a dose is a fraction of a milligram. Stress, diet and solitude are the three pillars of hamster health.",
    wikiPl: "https://pl.wikipedia.org/wiki/Chomik",
    wikiEn: "https://en.wikipedia.org/wiki/Hamster",
    claimIds: ["C-SPC-05"]
  },
  {
    id: "parrot",
    labelPl: "Papuga", labelEn: "Parrot",
    weightRangeKg: { min: 0.025, max: 0.1 },
    toxicDrugs: [],
    notesPl: "Papugi (np. papużka falista, nimfa) to ptaki stadne i inteligentne. Przerost dzioba często związany jest ze świerzbem (Knemidokoptes) lub niedoborem. Samice mogą nieść niezapłodnione jaja, a zatrzymanie jaja (dystocia) to stan zagrażający życiu.",
    notesEn: "Parrots (e.g. budgerigar, cockatiel) are social, intelligent birds. Beak overgrowth is often linked to mites (Knemidokoptes) or deficiency. Females may lay unfertilized eggs, and egg binding (dystocia) is a life-threatening emergency.",
    infoPl: "Papugi to ptaki towarzyszące o dużej inteligencji emocjonalnej - żyją w stadzie, potrzebują stymulacji i towarzystwa. Najpopularniejsze gatunki w domach to papużka falista (melopsitta) i nimfa (kakadya). Małe ptaki mają szybki metabolizm - choroba postępuje szybko, a pacjent potrafi wymagać pomocy w kilka godzin.\n\nPrzerost dzioba to częsty powód wizyty pielęgnacyjnej (spiłowanie, przycinanie lotek). Uczy jednak uwagi: przerost rzadko jest czysto mechaniczny - najczęściej to świerzb (Knemidokoptes pilae) lub niedobór pokarmowy. Zawsze warto zbadać ptaka, a nie tylko spiłować dziób.\n\nZatrzymanie jaja (dystocia) u samic to stan nagły: samica siedzi na dnie klatki, napina się, osłabia. Najczęstszą przyczyną jest hipokalcemia - dlatego leczenie zaczyna się od wsparcia i wapnia, a nie od noża. Operacja (salpingotomia) to ostateczność.",
    infoEn: "Parrots are companion birds of high emotional intelligence - they live in flocks, need stimulation and company. The most common pet species are the budgerigar (melopsitta) and the cockatiel (kakadya). Small birds have fast metabolism - disease progresses quickly, and a patient can need help within hours.\n\nBeak overgrowth is a common reason for a grooming visit (trimming, wing clip). It teaches attention, however: overgrowth is rarely purely mechanical - most often it is scaly face mites (Knemidokoptes pilae) or a nutritional deficiency. One should always examine the bird, not just trim the beak.\n\nEgg binding (dystocia) in females is an emergency: the hen sits on the cage floor, strains, weakens. The most common cause is hypocalcemia - so treatment begins with support and calcium, not with a knife. Surgery (salpingotomy) is the last resort.",
    wikiPl: "https://pl.wikipedia.org/wiki/Papuga",
    wikiEn: "https://en.wikipedia.org/wiki/Parrot",
    claimIds: ["C-SPC-06"]
  }
];
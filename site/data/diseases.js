// Jednostki chorobowe (różnicowanie + wskazania/kontra).
// requiredExams    — bez ich (≥1) R-EXAM-MISSED → diagnoza niemożliwa.
// supportiveExams  — pomagają, ale nie obowiązkowe (R-EXAM-NEEDED częściowo).
// recommendedGroups — groupId leków pierwszej linii (R-DRUG-GROUP-MATCH).
// contraindicatedGroups — groupId, które szkodzą przy tej chorobie (R-DRUG-CONTRAINDICATED).
// optionalExams   — rozsądne badanie bazowe (np. badanie ogólne), NIE karane jako zbędne, ale bez nagrody.
// Każde zlecone badanie spoza {required, supportive, optional} = R-EXAM-REDUNDANT (-).
// bacterialInfection — napędza R-ABX-INDICATED (true) / R-ABX-IRRATIONAL (false).
// infoPl/infoEn — akapity oddzielone "\n\n" (renderer dzieli na <p>); ~3 akapity, wpleść terminy glossary.
export const diseases = [
  {
    id: "uncomplicated-abrasion",
    labelPl: "Niepowikłane otarcie", labelEn: "Uncomplicated abrasion",
    requiredExams: ["wound-inspection"],
    supportiveExams: ["wound-swab-cytology"],
    recommendedGroups: ["antiseptic-topical"],
    contraindicatedGroups: [],
    bacterialInfection: false,
    optionalExams: ["physical-exam"],
    infoPl: "Niepowikłane otarcie to powierzchowne zarysowanie skóry - naskórek uszkodzony, ale rana czysta: brak ropy, brak obrzęku, brak brzydkiego zapachu. To najlżejsza z ran: boli, ale goi się sama, jeśli utrzymać ją w czystości. W weterynarii to klasyczny przykład urazu, który nie wymaga antybiotyku.\n\nSercem postępowania jest antyseptyk miejscowy - zabić bakterie na powierzchni, zanim wnikną głębiej. Antyseptyk to nie antybiotyk: działa z zewnątrz i nie wywołuje oporności (AMR). Otarcie wygląda często gorzej, niż jest - obrzęk i zaczerwienienie po urazie są normalne przez dobę; dopiero ropa, gorąca skóra i narastający ból sygnalizują infekcję bakteryjną.\n\nDlatego otarcie uczy najważniejszej zasady: antybiotyk „na wszelki wypadek” to błąd. Bez infekcji nie ma czego leczyć, a każda niepotrzebna dawka szkodzi florze i napędza oporność (AMR). Czysta rana, antyseptyk i czas - to wystarczy.",
    infoEn: "An uncomplicated abrasion is a superficial scratch of the skin — the epidermis is damaged but the wound is clean: no pus, no swelling, no foul smell. It is the mildest of wounds: it hurts, but heals on its own if kept clean. In veterinary practice it is the classic example of an injury that does not need an antibiotic.\n\nThe core of management is a topical antiseptic — kill bacteria on the surface before they invade deeper. An antiseptic is not an antibiotic: it acts from outside and does not drive resistance (AMR). An abrasion often looks worse than it is — swelling and redness right after injury are normal for a day; only pus, hot skin and growing pain signal a bacterial infection.\n\nThat is why the abrasion teaches the key rule: an antibiotic “just in case” is a mistake. With no infection there is nothing to treat, and every needless dose harms the flora and drives resistance (AMR). A clean wound, an antiseptic and time — that is enough.",
    wikiPl: "https://pl.wikipedia.org/wiki/Rana",
    wikiEn: "https://en.wikipedia.org/wiki/Abrasion_(medicine)",
    claimIds: ["C-DIS-01"]
  },
  {
    id: "wound-infection",
    labelPl: "Infekcja rany", labelEn: "Wound infection",
    requiredExams: ["wound-inspection", "wound-swab-cytology"],
    supportiveExams: [],
    recommendedGroups: ["antiseptic-topical", "antibiotic"],
    contraindicatedGroups: [],
    bacterialInfection: true,
    optionalExams: ["physical-exam"],
    infoPl: "Infekcja rany to moment, w którym uraz przestaje być tylko urazem - bakterie wniknęły i namnożyły się w tkance. Rana zmienia charakter: pojawia się ropna wydzielina, obrzęk staje się gorący i bolesny, skóra wokół czerwienieje. To już nie kwestia czystości - to infekcja bakteryjna, której organizm sam nie pokona.\n\nRozstrzygającym badaniem jest wymaz z rany i cytologia: pod mikroskopem widać bakterie i komórki zapalne, a to potwierdza, że antybiotyk jest uzasadniony. Bez tego dowodu łatwo podać antybiotyk odruchowo - a to właśnie nadużywanie napędza oporność (AMR). Wymaz pozwala też celowo dobrać lek, zamiast strzelać w ciemno.\n\nLeczenie łączy antyseptyk miejscowy z antybiotykiem ogólnoustrojowym. Uzasadniony antybiotyk - ten podany po potwierdzeniu infekcji - chroni właśnie przed AMR: używamy go wtedy, gdy naprawdę pomaga, a nie „na wszelki wypadek”. To różnica między leczeniem a zamiataniem problemu pod dywan.",
    infoEn: "A wound infection is the moment an injury stops being just an injury — bacteria have entered and multiplied in the tissue. The wound changes character: purulent discharge appears, the swelling turns hot and tender, the surrounding skin reddens. It is no longer a matter of cleanliness — it is a bacterial infection the body will not clear on its own.\n\nThe decisive test is a wound swab and cytology: under the microscope bacteria and inflammatory cells are visible, confirming that an antibiotic is justified. Without that proof it is easy to give an antibiotic reflexively — and that overuse drives resistance (AMR). A swab also lets you choose a targeted drug instead of shooting in the dark.\n\nTreatment combines a topical antiseptic with a systemic antibiotic. A justified antibiotic — one given after confirming infection — is exactly what protects against AMR: we use it when it truly helps, not “just in case”. That is the difference between treatment and sweeping the problem under the rug.",
    wikiPl: "https://pl.wikipedia.org/wiki/Zaka%C5%BCenie",
    wikiEn: "https://en.wikipedia.org/wiki/Wound_infection",
    claimIds: ["C-DIS-02"]
  },
  {
    id: "abscess",
    labelPl: "Ropień", labelEn: "Abscess",
    requiredExams: ["wound-inspection"],
    supportiveExams: ["wound-swab-cytology"],
    recommendedGroups: ["antibiotic"],
    contraindicatedGroups: [],
    bacterialInfection: true,
    optionalExams: ["physical-exam"],
    infoPl: "Ropień to zamknięta kolekcja ropy pod skórą - jak balonik pełen bakterii i komórek zapalnych, odizolowany od reszty ciała. Często pojawia się po ugryzieniu lub kłutej ranie, zwłaszcza u kotów wychodzących: flora z pysku napastnika wnika pod skórę i tam, w cieple i bez powietrza, rośnie.\n\nCharakterystyczny jest pulsujący ból i miękka, gorąca opuchlizna, czasem z fistulą - dziurką, przez którą sączy się ropa. Sam antybiotyk nie wystarczy: ropę trzeba opróżnić (drenaż), bo do zamkniętej jamy lek słabo dociera. Wymaz i cytologia pomagają dobrać celowany antybiotyk ogólnoustrojowy.\n\nTo infekcja bakteryjna, więc antybiotyk jest uzasadniony - ale dopiero po drenażu. Ropień uczy, że w weterynarii czasem trzeba najpierw otworzyć i opróżnić, a leki dopiero wspierają gojenie. Bez drenażu nawet najlepszy antybiotyk zawiedzie.",
    infoEn: "An abscess is a closed collection of pus under the skin — like a balloon full of bacteria and inflammatory cells, walled off from the rest of the body. It often appears after a bite or a puncture wound, especially in outdoor cats: flora from the attacker's mouth slips under the skin and, in warmth and without air, grows.\n\nThe hallmark is a throbbing pain and a soft, hot swelling, sometimes with a fistula — a small hole leaking pus. An antibiotic alone is not enough: the pus must be drained, because drugs penetrate a closed cavity poorly. A swab and cytology help choose a targeted systemic antibiotic.\n\nIt is a bacterial infection, so an antibiotic is justified — but only after drainage. The abscess teaches that in veterinary work one sometimes has to open and empty first, and drugs only then support healing. Without drainage even the best antibiotic fails.",
    wikiPl: "https://pl.wikipedia.org/wiki/Ropie%C5%84",
    wikiEn: "https://en.wikipedia.org/wiki/Abscess",
    claimIds: ["C-DIS-03"]
  },
  {
    id: "otitis-externa",
    labelPl: "Zapalenie ucha zewnętrznego", labelEn: "Otitis externa",
    requiredExams: ["otoscopy", "ear-cytology"],
    supportiveExams: [],
    recommendedGroups: ["ear-drops"],
    contraindicatedGroups: [],
    bacterialInfection: true,
    optionalExams: ["physical-exam"],
    infoPl: "Zapalenie ucha zewnętrznego to stan zapalny kanału słuchowego - wąskiego tunelu prowadzącego do błony bębenkowej. Nazywane „uchem pływaka”, bo lubi wilgoć: woda w uchu po pływaniu tworzy ciepłe, mokre środowisko, w którym rosną drożdżaki i bakterie. Szczególnie często u psów o opadających uszach - słabe przewiewanie dodatkowo ogrzewa kanał.\n\nCzęstym winowajcą jest Malassezia - drożdżak, który naturalnie bywa w uchu, ale w cieple i wilgoci się rozrasta. Otoskopia pozwala zajrzeć do kanału i ocenić błonę bębenkową, a cytologia wydzieliny rozstrzyga: czy dominują drożdżaki, czy bakterie. Bez cytologii leczy się w ciemno - a te dwa światy wymagają różnych leków.\n\nLeczenie to krople do uszu łączące antybiotyk, lek przeciwgrzybiczy i steryd - dobierane wg cytologii. Steryd gasi obrzęk (spuchnięty kanał nie przyjmuje kropli), przeciwgrzybiczy zwalcza drożdżaki, antybiotyk bakterie. To klasyczny przykład celowanego leczenia miejscowego, które oszczędza florę i nie napędza oporności (AMR).",
    infoEn: "Otitis externa is inflammation of the ear canal — the narrow tunnel leading to the eardrum. It is called “swimmer's ear” because it loves moisture: water in the ear after swimming makes a warm, wet environment where yeast and bacteria grow. It is especially common in floppy-eared dogs — poor airflow keeps the canal even warmer.\n\nA frequent culprit is Malassezia — a yeast that normally lives in the ear but overgrows in warmth and damp. Otoscopy lets you look into the canal and assess the eardrum, while cytology of the discharge settles the question: are yeast or bacteria dominant? Without cytology you treat in the dark — and these two worlds need different drugs.\n\nTreatment is ear drops combining an antibiotic, an antifungal and a steroid — chosen per cytology. The steroid calms the swelling (a swollen canal will not take drops), the antifungal fights the yeast, the antibiotic the bacteria. It is a classic example of targeted topical treatment that spares the flora and does not drive resistance (AMR).",
    wikiPl: "https://pl.wikipedia.org/wiki/Zapalenie_ucha_zewn%C4%99trznego",
    wikiEn: "https://en.wikipedia.org/wiki/Otitis_externa",
    claimIds: ["C-DIS-04"]
  },
  {
    id: "diarrhea-parasitic",
    labelPl: "Biegunka pasożytnicza (nicienie)", labelEn: "Parasitic diarrhea (nematodes)",
    requiredExams: ["fecal-exam"],
    supportiveExams: [],
    recommendedGroups: ["antiparasitic"],
    contraindicatedGroups: [],
    bacterialInfection: false,
    optionalExams: ["physical-exam"],
    infoPl: "Biegunka pasożytnicza to biegunka, w której winowajcą nie jest dieta ani bakteria, lecz pasożyty - najczęściej nicienie takie jak Toxocara (glista). Częsta u kotów wychodzących i psów bez odrobaczania: jaja pasożytów są w glebie, a zwierzę łapie je, liżąc łapy lub jedząc trawę.\n\nCechą pasożytów jest to, że nie widać ich gołym okiem - dorosłe robaki bywają w wymiocinach lub kale, ale jaja są mikroskopijne. Dlatego rozstrzygającym badaniem jest badanie kału: pod mikroskopem widać charakterystyczne jaja. To ono rozdziela biegunkę pasożytniczą od bakteryjnej - a to dwa zupełnie różne sposoby leczenia.\n\nLeczy się odrobaczaniem (np. fenbendazol - benzimidazol przez 3 dni), NIE antybiotykiem. Antybiotyk nie działa na robaki i niszczy florę jelitową, którą właśnie uszkodziły pasożyty - a ona potrzebuje spokoju. To klasyczna lekcja: najpierw zidentyfikuj winowajcę, potem dobierz lek, który go trafia.",
    infoEn: "Parasitic diarrhea is diarrhea whose culprit is neither diet nor bacteria but parasites — most often nematodes such as Toxocara (roundworms). It is common in outdoor cats and un-dewormed dogs: parasite eggs live in the soil, and the animal picks them up by licking its paws or eating grass.\n\nThe thing about parasites is that you cannot see them with the naked eye — adult worms may turn up in vomit or stool, but the eggs are microscopic. That is why the decisive test is a fecal exam: under the microscope the characteristic eggs are visible. It is what separates parasite-driven diarrhea from bacteria-driven diarrhea — and these need completely different treatments.\n\nIt is treated with deworming (e.g. fenbendazole — a benzimidazole given as a 3-day course), NOT with an antibiotic. An antibiotic does not work against worms and it damages the gut flora, which — already hurt by the parasites — needs rest. It is the classic lesson: identify the culprit first, then choose a drug that actually hits it.",
    wikiPl: "https://pl.wikipedia.org/wiki/Biegunka",
    wikiEn: "https://en.wikipedia.org/wiki/Diarrhea",
    claimIds: ["C-DIS-05"]
  },
  {
    id: "diarrhea-bacterial",
    labelPl: "Biegunka bakteryjna", labelEn: "Bacterial diarrhea",
    requiredExams: ["fecal-exam"],
    supportiveExams: [],
    recommendedGroups: ["antibiotic", "antiparasitic"],
    contraindicatedGroups: [],
    bacterialInfection: true,
    optionalExams: ["physical-exam"],
    infoPl: "Biegunka bakteryjna to infekcja jelitowa wywołana przez bakterie - organizm w ten sposób próbuje wypłukać patogen. W przeciwieństwie do biegunki dietetycznej, często towarzyszą jej objawy ogólnoustrojowe: gorączka, krew w kale, osłabienie. To sygnał, że sprawa jest poważniejsza niż „coś nietypowego zjadł”.\n\nBadanie kału pomaga wykluczyć pasożyty jako przyczynę - to kluczowe, bo biegunka pasożytnicza i bakteryjna wyglądają podobnie, a leczy się je inaczej. W ciężkich przypadkach (gorączka, krew, osłabienie) antybiotyk jest uzasadniony: organizm sam nie poradzi sobie z patogennymi bakteriami.\n\nTu antybiotyk ma sens - jest infekcja bakteryjna, więc to uzasadnione użycie, które nie napędza oporności (AMR), bo leczy rzeczywisty cel. Biegunka bakteryjna to przypomnienie, że „antybiotyk = błąd” nie jest regułą absolutną: błędem jest antybiotyk bez infekcji, nie antybiotyk przy potwierdzonej infekcji.",
    infoEn: "Bacterial diarrhea is an intestinal infection caused by bacteria — the body's way of trying to flush the pathogen out. Unlike dietary diarrhea, it often comes with systemic signs: fever, blood in the stool, lethargy. That signals the matter is more serious than “ate something funny”.\n\nA fecal exam helps rule out parasites as the cause — crucial, because parasitic and bacterial diarrhea look alike but are treated differently. In severe cases (fever, blood, lethargy) an antibiotic is justified: the body will not manage pathogenic bacteria on its own.\n\nHere an antibiotic makes sense — there is a bacterial infection, so it is a justified use that does not drive resistance (AMR), because it treats a real target. Bacterial diarrhea is the reminder that “antibiotic = mistake” is not an absolute rule: the mistake is an antibiotic without infection, not an antibiotic with a confirmed one.",
    wikiPl: "https://pl.wikipedia.org/wiki/Biegunka",
    wikiEn: "https://en.wikipedia.org/wiki/Diarrhea",
    claimIds: ["C-DIS-06"]
  },
  {
    id: "diarrhea-dietary",
    labelPl: "Biegunka dietetyczna", labelEn: "Dietary diarrhea",
    requiredExams: ["fecal-exam"],
    supportiveExams: [],
    recommendedGroups: [],
    contraindicatedGroups: ["antibiotic"],
    bacterialInfection: false,
    optionalExams: ["physical-exam"],
    infoPl: "Biegunka dietetyczna to biegunka po nagłej zmianie pokarmu lub zjedzeniu czegoś nietypowego - organizm nie zdążył dostosować się do nowej diety. To najłagodniejsza z biegunek: bez gorączki, bez krwi, bez osłabienia. Często ustępuje sama, gdy jelita odpoczną.\n\nBadanie kału pomaga odróżnić ją od biegunki pasożytniczej i bakteryjnej - w dietetycznej nie ma ani jaj, ani patogennych bakterii. To ważne, bo różnica decyduje o leczeniu: tutaj nie ma infekcji bakteryjnej ani pasożytów, więc nie ma czego zabić lekiem.\n\nLeczy się ją dietą - łagodna dieta, powolny powrót do normalnego pokarmu, czasem probiotyki. Antybiotyk jest tu przeciwwskazany: to nie infekcja, a antybiotyk niszczy florę jelitową, która właśnie się regeneruje. To bywa najtrudniejsza lekcja - powstrzymać się od „zrobić coś”, gdy właściwym działaniem jest odczekać i karmić łagodnie.",
    infoEn: "Dietary diarrhea follows a sudden food change or eating something unusual — the body has not had time to adjust to the new diet. It is the mildest of diarrheas: no fever, no blood, no lethargy. It often resolves on its own once the intestines rest.\n\nA fecal exam helps tell it apart from parasitic and bacterial diarrhea — in the dietary form there are neither eggs nor pathogenic bacteria. That matters, because the difference decides the treatment: here there is no bacterial infection and no parasites, so there is nothing for a drug to kill.\n\nIt is managed with diet — a bland diet, a gradual return to normal food, sometimes probiotics. An antibiotic is contraindicated here: it is not an infection, and an antibiotic damages the gut flora that is precisely trying to recover. This can be the hardest lesson — to resist the urge to “do something” when the right action is to wait and feed blandly.",
    wikiPl: "https://pl.wikipedia.org/wiki/Biegunka",
    wikiEn: "https://en.wikipedia.org/wiki/Diarrhea",
    claimIds: ["C-DIS-07"]
  },
  {
    id: "fracture",
    labelPl: "Złamanie kości", labelEn: "Bone fracture",
    requiredExams: ["radiograph"],
    supportiveExams: [],
    recommendedGroups: ["opioid", "nsaid"],
    contraindicatedGroups: [],
    bacterialInfection: false,
    optionalExams: ["physical-exam"],
    infoPl: "Złamanie kości to przerwanie ciągłości kości, zwykle po urazie - upadek, potrącenie, nieszczęśliwy skok. To uraz mechaniczny, nie infekcja: kość pękła pod siłą, której organizm nie wytrzymał. RTG jest rozstrzygające - pokazuje miejsce, kształt i przemieszczenie odłamów, a to decyduje o dalszym postępowaniu.\n\nLeczenie to stabilizacja - opatrunek usztywniający, gips lub chirurgia (szyny, płytki) - aby odłamom pozwolić zrosnąć się w bezruchu. Ból przy złamaniu jest silny, dlatego opioid lub NSAID jest częścią leczenia, nie dodatkiem. Bez kontroli bólu zwierzę się nie uspokaja, a stres opóźnia gojenie.\n\nPrzy złamaniu zamkniętym bez infekcji antybiotyk jest błędem - to uraz, nie infekcja bakteryjna, więc nie ma czego leczyć, a niepotrzebna dawka napędza oporność (AMR). Złamanie uczy rozróżniać uraz od infekcji - to dwa różne światy, wymagające zupełnie różnych leków.",
    infoEn: "A bone fracture is a break in the continuity of a bone, usually after trauma — a fall, a collision, an unlucky jump. It is a mechanical injury, not an infection: the bone snapped under a force the body could not withstand. A radiograph is decisive — it shows the location, the shape and the displacement of the fragments, and that determines what comes next.\n\nTreatment is stabilization — a splint, a cast, or surgery (pins, plates) — so the fragments can knit in stillness. Fracture pain is severe, which is why an opioid or an NSAID is part of treatment, not an add-on. Without pain control the animal cannot settle, and stress slows healing.\n\nFor a closed fracture without infection an antibiotic is a mistake — it is an injury, not a bacterial infection, so there is nothing to treat and a needless dose drives resistance (AMR). The fracture teaches you to tell injury apart from infection — two different worlds that need completely different drugs.",
    wikiPl: "https://pl.wikipedia.org/wiki/Z%C5%82amanie_ko%C5%9Bci",
    wikiEn: "https://en.wikipedia.org/wiki/Bone_fracture",
    claimIds: ["C-DIS-08"]
  },
  {
    id: "flea-infestation",
    labelPl: "Zarażenie pchłami", labelEn: "Flea infestation",
    requiredExams: ["flea-comb"],
    supportiveExams: [],
    recommendedGroups: ["antiparasitic"],
    contraindicatedGroups: [],
    bacterialInfection: false,
    optionalExams: ["physical-exam"],
    infoPl: "Zarażenie pchłami to jedna z najczęstszych chorób zewnętrznych u psów i kotów - szczególnie tych z adopcji lub bez odrobaczania. Pchły to małe owady wysysające krew; ich ukąszenia swędzą, a silna inwazja u młodego zwierzęcia może prowadzić nawet do anemii. Często nie widać ich gołym okiem - poruszają się szybko w sierści.\n\nRozstrzygającym badaniem jest grzebień i oględziny: drobnoząbkowy grzebień wyczesuje pchły i „flea dirt” - ich odchody, wyglądające jak czarne okruszki. To ważny trop: flea dirt rozpuszczony na wilgotnym waciku zostawia rdzawą smugę krwi, co potwierdza, że to pchły, nie brud. Same pchły to pasożyty, nie bakterie.\n\nLeczy się preparatem przeciwko pchłom - np. fluralaner (doustna izoksazolina działająca 12 tygodni) lub selamektyna (spot-on na skórę karku). Antybiotyk nie ma sensu - to nie infekcja bakteryjna. Błąd „antybiotyk na pchły” łączy dwa grzechy: nie leczy i napędza oporność (AMR).",
    infoEn: "Flea infestation is one of the most common external conditions in dogs and cats — especially adopted or un-dewormed ones. Fleas are tiny blood-sucking insects; their bites itch, and a heavy infestation in a young animal can even lead to anemia. They are often invisible to the naked eye — they move fast through the coat.\n\nThe decisive test is a flea comb and inspection: a fine-toothed comb pulls out fleas and “flea dirt” — their droppings that look like black specks. It is a useful clue: flea dirt dissolved on a damp cotton ball leaves a rusty smear of blood, confirming fleas rather than plain dirt. Fleas themselves are parasites, not bacteria.\n\nIt is treated with a flea product — e.g. fluralaner (an oral isoxazoline lasting 12 weeks) or selamectin (a spot-on applied to the neck skin). An antibiotic makes no sense — it is not a bacterial infection. The mistake of “an antibiotic for fleas” combines two sins: it does not treat and it drives resistance (AMR).",
    wikiPl: "https://pl.wikipedia.org/wiki/Pch%C5%82y",
    wikiEn: "https://en.wikipedia.org/wiki/Pulicosis",
    claimIds: ["C-DIS-09"]
  },
  {
    id: "sprain",
    labelPl: "Skręcenie / naderwanie", labelEn: "Sprain / strain",
    requiredExams: ["physical-exam"],
    supportiveExams: ["radiograph"],
    recommendedGroups: ["nsaid", "opioid"],
    contraindicatedGroups: [],
    bacterialInfection: false,
    claimIds: ["C-DIS-10"],
    infoPl: "Skręcenie to naderwanie więzadeł wokół stawu po urazie - więzadła, które stabilizują staw, rozciągnęły się lub naderwały, ale kość została cała. Dlaczego więc boli i kuleje tak samo jak złamanie? Bo tkanki wokół stawu są gęsto unerwione i każdy ruch pociąga uszkodzone włókna.\n\nRozstrzygnąć skręcenie od złamania pomaga RTG: kość cała to skręcenie lub naderwanie, kość pęknięta to złamanie. To ważne, bo leczenie jest różne - złamanie często wymaga stabilizacji chirurgicznej, skręcenie odpoczynku i czasu. Badanie ogólne ocenia też, czy nie ma innej możliwości, np. zwichnięcia.\n\nLeczy się analgezją (NSAID, czasem opioid) i odpoczynkiem - więzadła goją się powoli, tygodniami, i trzeba dać im czas, zanim staw znów przyjmie pełne obciążenie. Antybiotyk nie jest wskazany - to uraz zamknięty bez infekcji bakteryjnej, więc nie ma dla antybiotyku celu.",
    infoEn: "A sprain is a stretch or tear of the ligaments around a joint after trauma — the ligaments that stabilize the joint have stretched or torn, but the bone stayed whole. So why does it hurt and limp as much as a fracture? Because the tissues around the joint are densely innervated, and every movement pulls on the damaged fibres.\n\nA radiograph helps tell a sprain apart from a fracture: an intact bone means a sprain or strain, a cracked bone means a fracture. That matters, because the treatment differs — a fracture often needs surgical stabilization, a sprain needs rest and time. A physical exam also checks for other possibilities, such as a dislocation.\n\nIt is treated with analgesia (an NSAID, sometimes an opioid) and rest — ligaments heal slowly, over weeks, and need time before the joint can take full load again. An antibiotic is not indicated — it is a closed injury without a bacterial infection, so there is no target for an antibiotic.",
    wikiPl: "https://pl.wikipedia.org/wiki/Skr%C4%99cenie",
    wikiEn: "https://en.wikipedia.org/wiki/Sprain"
  },
  {
    id: "malocclusion",
    labelPl: "Przerost siekaczy / malokluzja", labelEn: "Incisor malocclusion / overgrowth",
    requiredExams: ["physical-exam"],
    supportiveExams: ["radiograph"],
    recommendedGroups: ["opioid", "nsaid"],
    contraindicatedGroups: ["antibiotic"],
    bacterialInfection: false,
    optionalExams: [],
    infoPl: "Przerost siekaczy, czyli malokluzja, to zaburzenie zgryzu, w którym zęby nie ścierają się równo i rosną za długo. Szczególnie u królików, bo ich zęby są elodontyczne - rosną przez całe życie, więc bez prawidłowego ścierania zakrzywiają się i ranią pysk. To nie ból zęba w ludzkim sensie - to mechaniczne drażnienie, które uniemożliwia jedzenie.\n\nObjawem jest ślinienie, chudnięcie i to, że królik przestaje jeść siano - a to z kolei zatrzymuje jelita, co u królika bywa groźne. RTG pomaga ocenić korzenie i wykluczyć ropień przy korzeniu. Leczenie to korekcja zębowa - przycięcie lub szlifowanie siekaczy - oraz analgezja, bo zabieg boli.\n\nAntybiotyk jest przeciwwskazany: nie ma infekcji, a u królika doustne antybiotyki - β-laktam i cefalosporyna - są toksyczne - niszczą florę jelitową i wywołują śmiertelną enterotoksemię. Malokluzja to klasyczna lekcja weterynarii gatunkowej: to, co u psa bywa rutyną, u królika bywa zabójcze.",
    infoEn: "Incisor overgrowth, or malocclusion, is a bite disorder in which the teeth do not wear evenly and grow too long. It is especially common in rabbits, because their teeth are elodont — they grow continuously, so without proper wear they curve and injure the mouth. It is not a toothache in the human sense — it is mechanical irritation that makes eating impossible.\n\nThe signs are drooling, weight loss and a rabbit that stops eating hay — which in turn slows the gut, often dangerously in rabbits. A radiograph helps assess the roots and rule out a root abscess. Treatment is dental correction — trimming or burring the incisors — plus analgesia, because the procedure hurts.\n\nAn antibiotic is contraindicated: there is no infection, and in rabbits oral β-lactam and cephalosporin antibiotics are toxic — they destroy the gut flora and trigger fatal enterotoxemia. Malocclusion is a classic lesson in species-specific medicine: what is routine in a dog can be lethal in a rabbit.",
    wikiPl: "https://pl.wikipedia.org/wiki/Zgryz",
    wikiEn: "https://en.wikipedia.org/wiki/Malocclusion",
    claimIds: ["C-DIS-11"]
  }
  ,
  {
    id: "feline-herpesvirus",
    labelPl: "Katar koci (herpeswirus)", labelEn: "Feline herpesvirus rhinotracheitis",
    requiredExams: ["physical-exam", "eye-exam"],
    supportiveExams: [],
    recommendedGroups: [],
    contraindicatedGroups: ["antibiotic"],
    bacterialInfection: false,
    optionalExams: [],
    infoPl: "Katar koci to wirusowa infekcja górnych dróg oddechowych kota wywołana herpeswirusiem kota (FHV-1) - jednym z najczęstszych patogenów u kociąt i kotów narażonych na stres, ze schronisk i wielokotnych domów. Objawia się kichaniem, wyciekiem z nosa, zapaleniem spojówek i owrzodzeniami rogówki, a u małych kociąt gorączką i odmową jedzenia. To samoograniczająca się choroba wirusowa - organizm zwalcza ją sam w 1–2 tygodnie, gdy kot ma siły i odpowiednie warunki.\n\nLeczenie jest wspomagające, nie przeciwinfekcyjne: nawilżanie, izolacja od innych kotów (wirus jest zaraźliwy), higiena, zachęcanie do jedzenia i leczenie oka maścią. Antybiotyk NIE działa na wirusa - to najważniejsza lekcja: podanie antybiotyku na katar to błąd, który nie leczy, a napędza oporność (AMR) i niszczy florę. Antybiotyk wchodzi w grę dopiero przy wtórnym nadkażeniu bakteryjnym (ropny wyciek, owrzodzenia), rozstrzygnięte badaniem - nie z góry.\n\nKatar koci uczy, że infekcja nie znaczy antybiotyk: wirus, bakteria, pierwotniak i pasożyt to różni wrogowie, i każdy ma inne leczenie. Powstrzymanie się od antybiotyku, gdy choroba jest wirusowa, to akt mądrości - i szacunku do leków, które naprawdę ratują życie.",
    infoEn: "Feline viral rhinotracheitis is an upper respiratory infection of cats caused by the feline herpesvirus (FHV-1) — one of the most common pathogens in kittens and in cats from stress, shelters and multi-cat homes. It presents with sneezing, nasal discharge, conjunctivitis and corneal ulcers, and in small kittens with fever and refusal to eat. It is a self-limiting viral disease — the body clears it in 1–2 weeks when the cat has strength and proper conditions.\n\nTreatment is supportive, not anti-infective: humidification, isolation from other cats (the virus is contagious), hygiene, encouraging eating, and treating the eye with ointment. An antibiotic does NOT act on the virus — this is the central lesson: giving an antibiotic for a cold is a mistake that does not cure, drives resistance (AMR) and damages the flora. An antibiotic enters only with a secondary bacterial infection (purulent discharge, ulcers), settled by exam — never up front.\n\nFeline herpesvirus teaches that infection does not mean antibiotic: virus, bacterium, protozoan and worm are different enemies, each with its own treatment. Withholding an antibiotic when the disease is viral is an act of wisdom — and of respect for the drugs that truly save lives.",
    wikiPl: "https://pl.wikipedia.org/wiki/Herpeswirus",
    wikiEn: "https://en.wikipedia.org/wiki/Feline_herpesvirus",
    claimIds: ["C-DIS-12"]
  },
  {
    id: "babesiosis",
    labelPl: "Babeszjoza (piroplazmoza)", labelEn: "Babesiosis",
    requiredExams: ["physical-exam", "blood-smear"],
    supportiveExams: ["blood-panel"],
    recommendedGroups: ["antiprotozoal"],
    contraindicatedGroups: [],
    bacterialInfection: false,
    optionalExams: [],
    infoPl: "Babeszjoza (piroplazmoza) to choroba odkleszczowa psa wywołana pierwotniakiem Babesia canis, który kleszcz przekazuje ze śliną podczas wkłucia. Pierwotniak wnika do erytrocytów i je niszczy, wywołując anemię hemolityczną - stąd blade śluzówki, gorączka, apatia i ciemny mocz (hemoglobinuria). Bez leczenia babeszjoza często prowadzi do śmierci, zwłaszcza u psa z osłabionym układem odpornościowym.\n\nDiagnostyka to rozmaz krwi: pod mikroskopem widać gruszkowate piroplazmy wewnątrz erytrocytów. Leczenie to lek przeciwpierwotniakowy (imidokarb), a nie antybiotyk - Babesia to pierwotniak, nie bakteria, więc antybiotyk beta-laktamowy na nią nie działa. Podanie antybiotyku na babeszjozę to błąd i strata czasu, gdy pacjent traci krwinki. Profilaktyka to ochrona przed kleszczami - preparaty spot-on, obroże i sprawdzanie po spacerze w lesie.\n\nBabeszjoza uczy trzech rzeczy naraz: że kleszcz to wektor śmiertelnej choroby (nie tylko swędzenie), że pierwotniak to inna klasa patogenu niż bakteria (inny lek), i że rozmaz krwi potrafi rozstrzygnąć diagnozę, której zewnątrz nie widać.",
    infoEn: "Babesiosis is a tick-borne disease of dogs caused by the protozoan Babesia canis, which the tick transmits in its saliva during the bite. The protozoan enters erythrocytes and destroys them, causing hemolytic anemia — hence pale mucous membranes, fever, lethargy and dark urine (hemoglobinuria). Untreated babesiosis is often fatal, especially in a dog with weakened immunity.\n\nDiagnosis is by blood smear: under the microscope one sees pear-shaped piroplasms inside erythrocytes. Treatment is an anti-protozoal drug (imidocarb), not an antibiotic — Babesia is a protozoan, not a bacterium, so a beta-lactam antibiotic does not act on it. Giving an antibiotic for babesiosis is a mistake and a loss of time while the patient loses red cells. Prevention is tick control — spot-on products, collars and checking after a forest walk.\n\nBabesiosis teaches three things at once: that a tick is the vector of a lethal disease (not just an itch), that a protozoan is a different class of pathogen than a bacterium (different drug), and that a blood smear can settle a diagnosis that is invisible from the outside.",
    wikiPl: "https://pl.wikipedia.org/wiki/Babeszjoza",
    wikiEn: "https://en.wikipedia.org/wiki/Babesiosis",
    claimIds: ["C-DIS-13"]
  },
  {
    id: "feline-cystitis",
    labelPl: "Choroba dolnych dróg moczowych kota (FLUTD)", labelEn: "Feline lower urinary tract disease (FLUTD)",
    requiredExams: ["physical-exam", "urinalysis"],
    supportiveExams: [],
    recommendedGroups: ["opioid"],
    contraindicatedGroups: ["antibiotic"],
    bacterialInfection: false,
    drugIsSupportive: true,
    optionalExams: [],
    infoPl: "Choroba dolnych dróg moczowych kota (FLUTD, z ang. feline lower urinary tract disease) to wspólna nazwa dla sterylnego zapalenia pęcherza i kamicy: krew w moczu, częste wizyty w kuwecie i bolesne parcie - ale bez bakterii. Najczęstszą postacią jest kocie idiopatyczne zapalenie pęcherza (FIC) - sterylne zapalenie napędzane stresem (zmiana w domu, gość, inny kot); odrębną postacią jest kamica struwitowa - kryształy w moczu, które rozróżnia badanie osadu. Koty są szczególnie podatne, bo piją mało i mają skoncentrowany mocz.\n\nLeczenie zaczyna się od badania moczu: pokazuje krew (krwinkomocz) i kryształy, ale brak bakterii - więc w sterylnym zapaleniu nie podaje się antybiotyku (to nie infekcja). Dostaje analgetyk (buprenorfina, opioid) na ból, a opiekun zwiększa przyjmowanie wody: mokra karma, fontanna, więcej kuwet. Stres się redukuje: stała rutyna, miejsca do wspinania, mniej konfliktów. Antybiotyk bez bakterii napędza oporność (AMR) i nie leczy - to częsty błąd, bo krew w moczu wygląda jak infekcja.\n\nTa choroba uczy, że krew nie znaczy infekcja, że stres może wywołać chorobę somatyczną, i że najważniejszy lek to czasem po prostu więcej wody i spokoju - a nie najmocniejszy antybiotyk z apteki.",
    infoEn: "Feline lower urinary tract disease (FLUTD) is a lower urinary tract condition of cats in which blood appears in the urine, with frequent litter-box visits and painful straining — but without bacteria. The most common form is FIC: sterile bladder inflammation driven by stress (a change at home, a guest, another cat), while struvite urolithiasis is crystals in the urine. Cats are especially prone, because they drink little and have concentrated urine.\n\nTreatment starts with urinalysis: it shows blood (hematuria) and crystals, but NO bacteria — so FIC gets no antibiotic (it is not an infection). It gets an analgesic (buprenorphine, an opioid) for pain, and the carer increases water intake: wet food, a fountain, more litter boxes. Stress is reduced: a stable routine, climbing places, fewer conflicts. An antibiotic without bacteria drives resistance (AMR) and does not treat — a common mistake, because blood in the urine looks like an infection.\n\nFIC teaches that blood does not mean infection, that stress can trigger a somatic disease, and that the most important medicine is sometimes simply more water and calm — not the strongest antibiotic from the pharmacy.",
    wikiPl: "https://en.wikipedia.org/wiki/Feline_lower_urinary_tract_disease",
    wikiEn: "https://en.wikipedia.org/wiki/Feline_lower_urinary_tract_disease",
    claimIds: ["C-DIS-14"]
  }
,
  {
    id: "roundworm-infestation",
    labelPl: "Glistnica kocia",
    labelEn: "Roundworm infestation (Toxocara cati)",
    requiredExams: ["fecal-exam"],
    supportiveExams: [],
    recommendedGroups: ["antiparasitic"],
    contraindicatedGroups: [],
    bacterialInfection: false,
    optionalExams: ["physical-exam"],
    infoPl: "Glistnica to inwazja nicieni - Toxocara cati u kota i Toxocara canis u psa - pasożytujących w jelicie. Dorosłe glisty są białe, długie na kilka centymetrów; samica składa jaja wydalane z kałem. Zjawisko jest powszechne u kociąt i szczeniąt z adopcji oraz zwierząt bez odrobaczania - jaja przetrwają w środowisku latami. Objawia się okrągłym, napiętym brzuchem, gorszą kondycją, czasem wymiotami z glistą lub wykryciem jej w kale.\n\nRozstrzygającym badaniem jest badanie kału (parazytologia): mikroskopowo widać jaja glisty. Leczenie to lek przeciwpasożytniczy - fenbendazol (doustny, 50 mg/kg przez 3 dni) lub selamektyna (spot-on na kark). Antybiotyk nie ma sensu - to nie bakterie, lecz nicienie; inna grupa leków, inny mechanizm.\n\nGlistnica uczy, że odrobaczanie to profilaktyka i terapia jednocześnie. Lek przeciwpasożytniczy dobiera się do gatunku i pasożyta - nie ma jednego uniwersalnego. Kontrola kału po 2 tygodniach potwierdza skuteczność. Obowiązuje też odrobaczanie wszystkich zwierząt w domu i oczyszczenie środowiska.",
    infoEn: "Roundworm infestation is an invasion of nematodes — Toxocara cati in cats and Toxocara canis in dogs — parasitizing the intestine. Adult roundworms are white, several centimeters long; the female lays eggs shed in feces. It is common in adopted kittens and puppies and in un-dewormed animals — eggs survive in the environment for years. It presents with a pot-bellied abdomen, poor condition, sometimes vomiting a worm or finding one in the feces.\n\nThe decisive test is a fecal exam (parasitology): roundworm eggs are seen under the microscope. Treatment is an antiparasitic — fenbendazole (oral, 50 mg/kg for 3 days) or selamectin (a spot-on at the neck). An antibiotic makes no sense — these are nematodes, not bacteria; a different drug class and a different mechanism.\n\nRoundworm infestation teaches that deworming is both prevention and therapy. The antiparasitic is chosen by species and by the parasite — there is no single universal one. A fecal check after 2 weeks confirms success. Deworming all pets in the home and treating the environment is also required.",
    wikiPl: "https://pl.wikipedia.org/wiki/Toxocara_canis",
    wikiEn: "https://en.wikipedia.org/wiki/Toxocara",
    claimIds: ["C-DIS-15"]
  },
  {
    id: "guinea-pig-mange",
    labelPl: "Świerzbowica świnki (roztocza Trixacarus)", labelEn: "Guinea pig mange (Trixacarus caviae)",
    requiredExams: ["skin-scrape"],
    supportiveExams: [],
    recommendedGroups: ["antiparasitic"],
    contraindicatedGroups: [],
    bacterialInfection: false,
    optionalExams: ["physical-exam"],
    infoPl: "Świerzbowica świnki morskiej to choroba skóry wywołana roztoczem Trixacarus caviae, który drąży naskórek i powoduje nasilony, nie do zniesienia świąd. Świnka drapie się wciąż, łysieje, a skóra łuszczy się i strupieje; w ciężkiej postaci od swędzenia dochodzi do drgawek. Choroba jest bardzo zaraźliwa dla innych świnek i przejściowo zaraźliwa dla człowieka (swędzące krostki na rękach).\n\nRozstrzygającym badaniem są zeskrobiny skórne: pod mikroskopem widać roztocza i ich jaja w zeskrobinach. Leczenie to lek przeciwpasożytniczy (selamektyna spot-on na kark), powtarzany co kilka tygodni, a nie antybiotyk - roztocza to pasożyty, nie bakterie, więc antybiotyk nie działa i napędza oporność (AMR). Trzeba też odrobaczyć wszystkie świnki w kontakcie.\n\nŚwierzbowica uczy, że świąd i łysienie to nie infekcja bakteryjna - i że roztocza to osobna klasa wroga, do którego idzie inny lek. Zeskrobiny skórne to tanie badanie, które oszczędza błędnego antybiotyku i da ulgę zwierzęciu, które dosłownie drapie się do krwi.",
    infoEn: "Guinea pig mange is a skin disease caused by the mite Trixacarus caviae, which burrows into the epidermis and causes intense, unbearable itching. The guinea pig scratches constantly, loses hair, and the skin scales and crusts; in severe forms the itching triggers seizures. The disease is highly contagious to other guinea pigs and transiently transmissible to humans (itchy papules on the hands).\n\nThe decisive test is a skin scrape: under the microscope mites and their eggs are visible in the scrapings. Treatment is an antiparasitic (selamectin spot-on at the neck), repeated every few weeks, not an antibiotic - mites are parasites, not bacteria, so an antibiotic does not work and drives resistance (AMR). All guinea pigs in contact must be treated too.\n\nMange teaches that itching and hair loss are not a bacterial infection - and that mites are a separate class of enemy, met with a different drug. A skin scrape is a cheap test that saves a misguided antibiotic and brings relief to an animal that is literally scratching itself raw.",
    wikiPl: "https://pl.wikipedia.org/wiki/%C5%9Awierzbowce",
    wikiEn: "https://en.wikipedia.org/wiki/Sarcoptic_mange",
    claimIds: ["C-DIS-16"]
  },
  {
    id: "hamster-wet-tail",
    labelPl: "Choroba mokrego ogona", labelEn: "Wet tail (proliferative ileitis)",
    requiredExams: ["physical-exam"],
    supportiveExams: ["fecal-exam"],
    recommendedGroups: ["antibiotic"],
    contraindicatedGroups: [],
    bacterialInfection: true,
    optionalExams: [],
    infoPl: "Choroba mokrego ogona, nazywana też potocznie ciekłym chomikiem, to ostra, wodnista biegunka młodych chomików syryjskich, wywołana przez bakterię Lawsonia intracellularis, która atakuje jelito cienkie (przerost i zapalenie jelita krętego). Pojawia się nagle u odstawionych od matki, przeprowadzonych lub zestresowanych maluchów - stres osłabia florę i otwiera drogę bakterii. Bez leczenia chomik ginie w 24-48 godzin z odwodnienia i zatrucia.\n\nRozpoznaje się ją głównie klinicznie: nagła wodnista biegunka, mokry, przemoczony zad i ogon, apatia i odmowa jedzenia u młodego chomika syryjskiego to niemal pewna choroba mokrego ogona. Badanie kału jest wspomagające - wyklucza pasożyty, ale to obraz i wiek decydują.\n\nLeczenie to antybiotyk (enrofloksacyna, bezpieczna u chomika) podawany doustnie oraz płyny i ciepło. Tu antybiotyk jest wskazany i ratuje życie - to ważny kontrast z chorobami, gdzie antybiotyk szkodzi (FIC, katar koci). Choroba mokrego ogona uczy, że antybiotyk to nie zawsze błąd: błędem jest antybiotyk bez infekcji, nie antybiotyk przy potwierdzonej bakteryjnej, która bez niego zabija.",
    infoEn: "Wet tail is an acute, watery diarrhea of young Syrian hamsters caused by the bacterium Lawsonia intracellularis, which attacks the small intestine (proliferative ileitis). It appears suddenly in weaned, moved or stressed youngsters - stress weakens the flora and opens the door to the bacterium. Without treatment the hamster dies in 24-48 hours from dehydration and toxemia.\n\nIt is diagnosed mainly clinically: sudden watery diarrhea, a wet soaked rear and tail, lethargy and refusal to eat in a young Syrian hamster is almost certainly wet tail. A fecal exam is supportive - it rules out parasites - but the picture and the age decide.\n\nTreatment is an antibiotic (enrofloxacin, safe in hamsters) given orally, plus fluids and warmth. Here the antibiotic is indicated and life-saving - an important contrast with diseases where an antibiotic harms (FIC, feline cold). Wet tail teaches that an antibiotic is not always a mistake: the mistake is an antibiotic without infection, not an antibiotic with a confirmed bacterial one that would kill without it.",
    wikiPl: "https://pl.wikipedia.org/wiki/Choroba_mokrego_ogona",
    wikiEn: "https://en.wikipedia.org/wiki/Wet_tail",
    claimIds: ["C-DIS-17"]
  },
  {
    id: "poisoning",
    labelPl: "Zatrucie (toksykoza)", labelEn: "Poisoning (toxicosis)",
    requiredExams: ["physical-exam"],
    supportiveExams: [],
    recommendedGroups: [],
    contraindicatedGroups: ["antibiotic"],
    bacterialInfection: false,
    optionalExams: ["fecal-exam"],
    infoPl: "Zatrucie to ostre uszkodzenie po połknięciu toksyny - spleśniałego lub zepsutego pokarmu (mykotoksyny), trującej rośliny, pestycydu lub środka chemicznego z domu. U chomika objawia się nagle: wodnista biegunka, osowiałość, odmowa jedzenia i odwodnienie, czasem drżenia lub drgawki zależnie od trucizny. Chomiki (jak większość gryzoni) nie potrafią wymiotować, więc toksyna zostaje w jelitach.\n\nRozpoznaje się je przede wszystkim z wywiadu - co i kiedy zwierzę mogło połknąć - oraz z obrazu klinicznego. Badanie kału wyklucza pasożyty, lecz nie wskaże trucizny; ostatecznym dowodem bywa toksykologia, lecz w ostrej praktyce rzadko się na nią czeka.\n\nLeczenie to usunięcie źródła, nawodnienie i ciepło, w razie świeżego spożycia węgiel aktywny, a przy znanej truciznie antidotum. Antybiotyk nie leczy zatrucia - nie ma tu bakterii do zabicia, a niszczenie flory w osłabionym jelicie może zaszkodzić. To ważny kontrast z chorobą mokrego ogona, gdzie antybiotyk ratuje życie.",
    infoEn: "Poisoning is acute damage after swallowing a toxin — moldy or spoiled feed (mycotoxins), a toxic plant, a pesticide or a household chemical. In a hamster it appears suddenly: watery diarrhea, lethargy, refusal to eat and dehydration, sometimes tremors or seizures depending on the poison. Hamsters (like most rodents) cannot vomit, so the toxin stays in the gut.\n\nIt is diagnosed mainly from the history — what and when the animal could have swallowed — and the clinical picture. A fecal exam rules out parasites but will not reveal the poison; toxicology is the final proof, but in acute practice one rarely waits for it.\n\nTreatment is removing the source, rehydration and warmth, activated charcoal if ingestion was recent, and an antidote if the poison is known. An antibiotic does not treat poisoning — there is no bacterium to kill, and damaging the flora in a weakened gut can harm. This is an important contrast with wet tail, where the antibiotic saves lives.",
    wikiPl: "https://pl.wikipedia.org/wiki/Zatrucie",
    wikiEn: "https://en.wikipedia.org/wiki/Poisoning",
    claimIds: ["C-DIS-18"]
  },
{
      "id": "gi-foreign-body",
      "labelPl": "Ciało obce w jelicie (obturacja)",
      "labelEn": "Gastrointestinal foreign body (obstruction)",
      "requiredExams": [
        "physical-exam",
        "radiograph"
      ],
      "supportiveExams": [
        "blood-panel"
      ],
      "recommendedGroups": [
        "antibiotic",
        "opioid"
      ],
      "contraindicatedGroups": [
        "nsaid"
      ],
      "bacterialInfection": true,  // enterotomia = otwarcie jelita = ryzyko bakteryjne = antybiotyk wskazany (profilaktycznie)
      "drugIsSupportive": true,
      "optionalExams": [],
      "infoPl": "Ciało obce w jelicie to mechaniczna obturacja — połknięty przedmiot (zabawka, skarpeta, kość) zatyka światło jelita, zatrzymując pasaż treści. Klasyczny obraz to wymioty po jedzeniu lub piciu, osowiałość, tkliwy brzuch i postawa zgarbiona. Młode psy wszystko biorą do pyska — beagle, labradory i szczenięta są szczególnie podatne.\n\nRozstrzygającym badaniem jest RTG: poszerzone pętle jelita z nagromadzonym płynem i gazem powyżej przeszkody, czasem widoczny sam cień ciała obcego. Leczenie to pilna operacja — enterotomia: otwarcie jelita, usunięcie ciała obcego, zszycie ściany. Antybiotyk jest osłaniający (zapobiega infekcji po otwarciu jelita), a nie leczący — on nie usuwa przeszkody. NSAID są przeciwwskazane: odwodnienie i obturacja zwiększają ryzyko uszkodzenia nerek i krwawienia z GI.\n\nTa choroba uczy trzech rzeczy: że młode psy jedzą wszystko i obturacja to stan nagły, że antybiotyk nie zastępuje operacji (to nie infekcja, to mechanika), i że czekanie jest błędem — niedokrwienie jelita prowadzi do martwicy i zapalenia otrzewnej w kilka godzin.",
      "infoEn": "A gastrointestinal foreign body is a mechanical obstruction — a swallowed object (toy, sock, bone) blocks the intestinal lumen, halting the passage of contents. The classic picture is vomiting after eating or drinking, lethargy, a tender belly, and a hunched posture. Young dogs put everything in their mouths — beagles, labradors, and puppies are especially prone.\n\nThe decisive test is a radiograph: distended intestinal loops with accumulated fluid and gas above the blockage, sometimes the shadow of the foreign body itself. Treatment is emergency surgery — enterotomy: opening the intestine, removing the foreign body, suturing the wall. Antibiotics are prophylactic (preventing post-op infection), not curative — they do not remove the blockage. NSAIDs are contraindicated: dehydration and obstruction increase the risk of kidney damage and GI bleeding.\n\nThis disease teaches three things: that young dogs eat everything and obstruction is an emergency, that an antibiotic does not replace surgery (this is mechanics, not infection), and that waiting is a mistake — intestinal ischemia leads to necrosis and peritonitis within hours.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Cia%C5%82o_obce",
      "wikiEn": "https://en.wikipedia.org/wiki/Bowel_obstruction",
      "claimIds": [
        "C-DIS-19"
      ]
    },
{
      "id": "metaldehyde-toxicity",
      "labelPl": "Zatrucie metaldehydem (trutka na ślimaki)",
      "labelEn": "Metaldehyde toxicity (slug bait poisoning)",
      "requiredExams": [
        "physical-exam"
      ],
      "supportiveExams": [],
      "recommendedGroups": [],
      "contraindicatedGroups": [
        "antibiotic",
        "nsaid",
        "opioid"
      ],
      "bacterialInfection": false,
      "drugIsSupportive": false,
      "optionalExams": [],
      "infoPl": "Metaldehyd to składnik trutki na ślimaki i ślimaczki — silnie toksyczny dla psów i kotów. Powoduje ślinotok, niepokój, drżenia mięśniowe, a następnie drgawki i hipertermię. Nie ma odtrutki.\n\nLeczenie to dekontaminacja: wywołanie wymiotów TYLKO gdy spożycie było niedawne (<1–2 h) i pacjent jest bezobjawowy (bez drżeń, bez objawów neurologicznych). Gdy objawy już wystąpiły, wymioty są przeciwwskazane (ryzyko zachłyśnięcia) i leczenie sprowadza się do płynów, chłodzenia i kontroli drgawek.\n\nKluczowa lekcja toksykologiczna: kot NIE jest małym psem. Apomorfina — standardowy lek wymiotny u psa — u kota jest nieskuteczna lub niebezpieczna. U kota stosuje się agonistę alfa-2 (ksylazyna, deksmedetomidyna). Antybiotyk, NSAID i opioid są przeciwwskazane — to nie infekcja, leki maskują objawy i obciążają nerki i wątrobę.\n\nZatrucie metaldehydem uczy, że czas jest lekiem: wczesna dekontaminacja ratuje życie, a spóźnione objawy oznaczają hospitalizację. Profilaktyka to trzymanie trutki z dala od zwierząt.",
      "infoEn": "Metaldehyde is the active ingredient in slug and snail bait — highly toxic to dogs and cats. It causes salivation, anxiety, muscle tremors, then seizures and hyperthermia. There is no antidote.\n\nTreatment is decontamination: inducing vomiting ONLY when ingestion was recent (<1–2 h) and the patient is asymptomatic (no tremors, no neurological signs). Once symptoms appear, emesis is contraindicated (aspiration risk) and treatment means fluids, cooling and seizure control.\n\nThe key toxicology lesson: a cat is NOT a small dog. Apomorphine — the standard emetic in dogs — is ineffective or dangerous in cats. In cats, an alpha-2 agonist (xylazine, dexmedetomidine) is used. Antibiotics, NSAIDs and opioids are contraindicated — this is not an infection, the drugs mask symptoms and burden the kidneys and liver.\n\nMetaldehyde toxicity teaches that time is the medicine: early decontamination saves lives, while delayed symptoms mean hospitalization. Prevention is keeping bait away from pets.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Metaldehyd",
      "wikiEn": "https://en.wikipedia.org/wiki/Metaldehyde",
      "claimIds": [
        "C-DIS-20"
      ]
    },
{
      "id": "scaly-face-mites",
      "labelPl": "Świerzb twarzowy (Knemidokoptes)",
      "labelEn": "Scaly face mites (Knemidokoptes pilae)",
      "requiredExams": [
        "physical-exam",
        "skin-scrape"
      ],
      "supportiveExams": [],
      "recommendedGroups": [
        "antiparasitic"
      ],
      "contraindicatedGroups": [
        "antibiotic"
      ],
      "bacterialInfection": false,
      "drugIsSupportive": false,
      "optionalExams": [],
      "infoPl": "Świerzb twarzowy papużek to choroba wywołana roztoczem Knemidokoptes pilae, który drąży naskórek dzioba, woskówki i stopy, tworząc charakterystyczne, porowate skorupki o strukturze plastra miodu. Dziób rośnie krzywo, nie domyka się i utrudnia jedzenie. Poza tym ptak jest żywy i aktywny — to choroba skóry, nie stan ogólny.\n\nRozstrzygającym badaniem są zeskrobiny skórne: pod mikroskopem widać roztocza i ich jaja. Leczenie to lek przeciwpasożytniczy (iwermektyna spot-on, jedna kropla na skórę karku), powtarzany po 2 tygodniach, oraz spiłowanie dzioba jako zabieg wspomagający — przywraca funkcję, ale nie leczy. Samo spiłowanie to błąd: roztocza rosną dalej i dziób znów przerośnie. Antybiotyk nie działa na roztocza — to pasożyty, nie bakterie.\n\nTa choroba uczy, że przerost dzioba u papug rzadko jest „tylko mechaniczny” — zawsze warto szukać roztoczy i potwierdzić je zeskrobinami. Tani test ratuje ptaka przed błędnym antybiotykiem i wielokrotnym, niepotrzebnym spiłowaniem.",
      "infoEn": "Scaly face in budgerigars is caused by the mite Knemidokoptes pilae, which burrows into the epidermis of the beak, cere and feet, producing characteristic porous, honeycomb-textured crusts. The beak grows crooked, fails to close and hinders eating. The bird is otherwise bright and active — this is a skin disease, not a systemic one.\n\nThe decisive test is a skin scrape: under the microscope mites and their eggs are visible. Treatment is an antiparasitic (ivermectin spot-on, one drop on nape skin), repeated after 2 weeks, plus beak trimming as a supportive procedure — it restores function but does not cure. Trimming alone is a mistake: the mites keep growing and the beak overgrows again. An antibiotic does not act on mites — they are parasites, not bacteria.\n\nThis disease teaches that beak overgrowth in parrots is rarely “just mechanical” — always look for mites and confirm them with a scrape. A cheap test saves the bird from a misguided antibiotic and from repeated, unnecessary trimming.",
      "wikiPl": "https://en.wikipedia.org/wiki/Knemidocoptiasis",
      "wikiEn": "https://en.wikipedia.org/wiki/Knemidocoptiasis",
      "claimIds": [
        "C-DIS-21"
      ]
    },
{
      "id": "egg-binding",
      "labelPl": "Zatrzymanie jaja (dystocia)",
      "labelEn": "Egg binding (dystocia)",
      "requiredExams": [
        "physical-exam",
        "radiograph"
      ],
      "supportiveExams": [
        "blood-panel"
      ],
      "recommendedGroups": [
        "calcium"
      ],
      "contraindicatedGroups": [
        "nsaid",
        "antibiotic"
      ],
      "bacterialInfection": false,
      "drugIsSupportive": false,
      "optionalExams": [],
      "infoPl": "Zatrzymanie jaja (dystocia) to stan zagrażający życiu u samic ptaków, w którym jajo utknęło w jajowodzie i nie może zostać zniesione. Samica siedzi na dnie klatki, napina się, ma osłabione nogi (jajo uciska nerwy) i powiększony brzuch. Najczęstszą przyczyną jest hipokalcemia — niski poziom wapnia we krwi osłabia skurcze mięśni gładkich jajowodu, które wypychają jajo.\n\nLeczenie przebiega etapami. Pierwszym krokiem jest wsparcie: ciepło, wilgoć, płyny i wapń. Sam wapń często wystarcza, by samica zniosła jajo bez interwencji. Oksytocynę stosuje się ostrożnie i dopiero po wapniu — bez wapnia skurcze są słabe i nieskuteczne. Pomoc ręczna (lub owocenteza — opróżnienie jaja, by przeszło) to kolejny krok. Operacja (salpingotomia) to ostateczność, stosowana dopiero, gdy wapń i pomoc zawodzą. Nigdy nie wolno wyciągać jaja na siłę — to grozi rozerwaniem jajowodu.\n\nZatrzymanie jaja uczy, że wapń to pierwszy krok, a operacja ostatni. Hipokalcemia to zwykła przyczyna, a profilaktyka to wapń w diecie (kość morska, bloki mineralne) i ograniczenie ciągłego znoszenia jaj (mniej godzin światła, usunięcie bodźców gniazdowych).",
      "infoEn": "Egg binding (dystocia) is a life-threatening condition in female birds in which an egg is stuck in the oviduct and cannot be laid. The hen sits on the cage floor, strains, has weak legs (the egg compresses nerves), and an enlarged abdomen. The most common cause is hypocalcemia — low blood calcium weakens the smooth-muscle contractions of the oviduct that push the egg out.\n\nTreatment is stepwise. The first step is support: warmth, humidity, fluids, and calcium. Calcium alone often suffices for the hen to pass the egg without intervention. Oxytocin is used cautiously and only after calcium — without it the contractions are weak and ineffective. Manual assistance (or ovocentesis — collapsing the egg so it can pass) is the next step. Surgery (salpingotomy) is the last resort, used only when calcium and assistance fail. The egg must never be pulled by force — this can rupture the oviduct.\n\nEgg binding teaches that calcium is the first step and surgery the last. Hypocalcemia is the usual cause, and prevention is dietary calcium (cuttlebone, mineral blocks) and limiting chronic egg-laying (fewer daylight hours, removing nesting stimuli).",
      "wikiPl": "https://en.wikipedia.org/wiki/Egg_binding",
      "wikiEn": "https://en.wikipedia.org/wiki/Egg_binding",
      "claimIds": [
        "C-DIS-22"
      ]
    }
,
{
  "id": "gastroenteritis",
  "labelPl": "Nieżyt żołądkowo-jelitowy",
  "labelEn": "Gastroenteritis",
  "requiredExams": [
    "physical-exam"
  ],
  "supportiveExams": [],
  "recommendedGroups": [],
  "contraindicatedGroups": [],
  "bacterialInfection": false,
  "drugIsSupportive": false,
  "optionalExams": [],
  "infoPl": "Nieżyt żołądkowo-jelitowy to zapalenie błony śluzowej żołądka i jelita — wymioty, biegunka, osowiałość. Najczęściej samoograniczający, wywołany nagłą zmianą diety, resztkami ze stołu lub łagodnym wirusem. Leczenie zachowawcze: głodówka, płyny, łagodna dieta — antybiotyk NIE wskazany (to nie infekcja bakteryjna).\n\nW grze to dystraktor dla przypadku ciała obcego — wymioty i osowiałość wspólne, ale brak bólu brzucha przy palpacji i brak ciała obcego w RTG. Błąd to uznanie obturacji za nieżyt i czekanie — pacjent traci czas, gdy jelito ulega martwicy.",
  "infoEn": "Gastroenteritis is inflammation of the stomach and intestinal lining — vomiting, diarrhea, lethargy. Most often self-limiting, triggered by a sudden diet change, table scraps or a mild virus. Conservative treatment: fasting, fluids, bland diet — an antibiotic is NOT indicated (it is not a bacterial infection).\n\nIn the game it is a distractor for a foreign body case — vomiting and lethargy overlap, but there is no abdominal pain on palpation and no foreign body on radiograph. The error is calling an obstruction gastritis and waiting — the patient loses time while the bowel necroses.",
  "wikiPl": "https://pl.wikipedia.org/wiki/Nie%C5%BCyt_%C5%BCo%C5%82%C4%85dkowo-jelitowy",
  "wikiEn": "https://en.wikipedia.org/wiki/Gastroenteritis",
  "claimIds": [
    "C-DIS-19"
  ]
},
{
  "id": "pancreatitis",
  "labelPl": "Zapalenie trzustki",
  "labelEn": "Pancreatitis",
  "requiredExams": [
    "physical-exam",
    "blood-panel"
  ],
  "supportiveExams": [],
  "recommendedGroups": [
    "opioid"
  ],
  "contraindicatedGroups": [
    "nsaid"
  ],
  "bacterialInfection": false,
  "drugIsSupportive": true,
  "optionalExams": [],
  "infoPl": "Zapalenie trzustki to stan zapalny gruczołu trzustkowego — silny ból brzucha (postawa modlitewna), wymioty, apatia. Częste u psów po tłustym posiłku. Rozstrzyga panel krwi (lipaza/amylaza/Spec cPL). Leczenie: analgetyk (opioid, nie NSAID — uszkadza nerki przy zapaleniu), płyny IV, głodówka.\n\nW grze dystraktor dla ciała obcego — ból i wymioty wspólne, ale panel krwi i brak ciała obcego w RTG rozróżniają. Błąd to operacja jelita przy zapaleniu trzustki (nie trzeba) albo NSAID przy trzustce (toksyczne).",
  "infoEn": "Pancreatitis is inflammation of the pancreas — severe abdominal pain (praying posture), vomiting, apathy. Common in dogs after a fatty meal. A blood panel settles it (lipase/amylase/Spec cPL). Treatment: an analgesic (opioid, not an NSAID — it harms the kidneys in inflammation), IV fluids, fasting.\n\nIn the game a distractor for a foreign body — pain and vomiting overlap, but the blood panel and no foreign body on radiograph distinguish them. The error is operating on the bowel for pancreatitis (unnecessary) or giving an NSAID for the pancreas (toxic).",
  "wikiPl": "https://pl.wikipedia.org/wiki/Zapalenie_trzustki",
  "wikiEn": "https://en.wikipedia.org/wiki/Pancreatitis",
  "claimIds": [
    "C-DIS-19"
  ]
},
{
  "id": "intestinal-parasites",
  "labelPl": "Pasożyty jelitowe",
  "labelEn": "Intestinal parasites",
  "requiredExams": [
    "fecal-exam"
  ],
  "supportiveExams": [],
  "recommendedGroups": [
    "antiparasitic"
  ],
  "contraindicatedGroups": [],
  "bacterialInfection": false,
  "drugIsSupportive": false,
  "optionalExams": [
    "physical-exam"
  ],
  "infoPl": "Pasożyty jelitowe (glisty, tasiemce) wywołują biegunkę, czasem wymioty, okrągły brzuch i gorszą kondycję — zwłaszcza u szczeniąt i psów z adopcji. Rozstrzyga badanie kału (jaja pod mikroskopem). Leczenie: lek przeciwpasożytniczy (fenbendazol, prazikwantel).\n\nW grze dystraktor dla ciała obcego — wymioty i osowiałość wspólne, ale brak bólu brzucha i brak ciała obcego w RTG. Błąd to odrobaczanie przy obturacji (nie pomoże, jelito zablokowane) zamiast operacji.",
  "infoEn": "Intestinal parasites (roundworms, tapeworms) cause diarrhea, sometimes vomiting, a pot belly and poor condition — especially in puppies and rescue dogs. A fecal exam settles it (eggs under the microscope). Treatment: an antiparasitic (fenbendazole, praziquantel).\n\nIn the game a distractor for a foreign body — vomiting and lethargy overlap, but there is no abdominal pain and no foreign body on radiograph. The error is deworming for an obstruction (it won't help — the bowel is blocked) instead of operating.",
  "wikiPl": "https://pl.wikipedia.org/wiki/Glistnica",
  "wikiEn": "https://en.wikipedia.org/wiki/Parasitic_disease",
  "claimIds": [
    "C-DIS-19"
  ]
},
{
  "id": "beak-overgrowth-mechanical",
  "labelPl": "Przerost dzioba (mechaniczny)",
  "labelEn": "Beak overgrowth (mechanical)",
  "requiredExams": [
    "physical-exam"
  ],
  "supportiveExams": [],
  "recommendedGroups": [],
  "contraindicatedGroups": [
    "antibiotic"
  ],
  "bacterialInfection": false,
  "drugIsSupportive": false,
  "optionalExams": [
    "skin-scrape"
  ],
  "infoPl": "Czysto mechaniczny przerost dzioba to rzadka sytuacja, w której dziób rośnie szybciej niż się ściera, bez roztoczy ani niedoboru — np. zły zgryz, brak twardych przedmiotów do ścierania. Leczenie to spiłowanie dzioba, bez leków.\n\nW grze dystraktor dla świerzbu twarzowego — przerost wspólne, ale brak łusek, brak swędzenia i brak roztoczy w zeskrobinach. Błąd to spiłowanie bez zbadania — ukryty świerzb wraca, bo roztocza nadal przerastają dziób.",
  "infoEn": "Purely mechanical beak overgrowth is rare — the beak grows faster than it wears, with no mites and no deficiency — e.g. a bad bite, no hard items to wear against. Treatment is beak trimming alone, no drug.\n\nIn the game a distractor for scaly face mites — overgrowth overlaps, but there are no crusts, no itching, and no mites in the scrape. The error is trimming without examining — a hidden scaly face mite infestation returns, because the mites keep overgrowing the beak.",
  "wikiPl": "https://pl.wikipedia.org/wiki/Dzi%C3%B3b",
  "wikiEn": "https://en.wikipedia.org/wiki/Beak",
  "claimIds": [
    "C-DIS-21"
  ]
},
{
  "id": "nutritional-deficiency",
  "labelPl": "Niedobór pokarmowy (wit. A/wapń)",
  "labelEn": "Nutritional deficiency (vit. A/calcium)",
  "requiredExams": [
    "physical-exam"
  ],
  "supportiveExams": [
    "blood-panel"
  ],
  "recommendedGroups": [],
  "contraindicatedGroups": [
    "antibiotic"
  ],
  "bacterialInfection": false,
  "drugIsSupportive": false,
  "optionalExams": [],
  "infoPl": "Niedobór pokarmowy — zwłaszcza witaminy A lub wapnia — może zmieniać dziób i skórę ptaka, naśladując świerzb. Rozstrzyga wywiad dietetyczny i panel krwi. Leczenie to korekta diety (suplementacja), nie lek przeciwpasożytniczy.\n\nW grze dystraktor dla świerzbu twarzowego — łuskowaty dziób wspólne, ale brak roztoczy w zeskrobinach. Błąd to iwermektyna przy niedoborze (nie pomoże) zamiast suplementacji.",
  "infoEn": "A nutritional deficiency — especially of vitamin A or calcium — can alter a bird's beak and skin, mimicking mites. A diet history and blood panel settle it. Treatment is diet correction (supplementation), not an antiparasitic.\n\nIn the game a distractor for scaly face mites — a scaly beak overlaps, but there are no mites in the scrape. The error is giving ivermectin for a deficiency (it won't help) instead of supplementing.",
  "wikiPl": "https://pl.wikipedia.org/wiki/Awitaminoza",
  "wikiEn": "https://en.wikipedia.org/wiki/Vitamin_A_deficiency",
  "claimIds": [
    "C-DIS-21"
  ]
},
{
  "id": "fungal-infection",
  "labelPl": "Grzybica skóry",
  "labelEn": "Fungal skin infection (dermatophytosis)",
  "requiredExams": [
    "skin-scrape"
  ],
  "supportiveExams": [],
  "recommendedGroups": [],
  "contraindicatedGroups": [
    "antibiotic"
  ],
  "bacterialInfection": false,
  "drugIsSupportive": false,
  "optionalExams": [
    "physical-exam"
  ],
  "infoPl": "Grzybica skóry (dermatofytoza) u ptaków wywołuje łuskowate zmiany na dziobie i skórze, podobne do świerzbu — ale to grzyb, nie roztocz. Zeskrobiny pokazują strzępki grzybni, nie roztocza. Leczenie to lek przeciwgrzybiczy (inna grupa), nie przeciwpasożytniczy.\n\nW grze dystraktor dla świerzbu twarzowego — łuskowaty dziób wspólne, ale zeskrobiny pokazują grzybnię, nie roztocza. Błąd to iwermektyna na grzybicę (nie działa) zamiast leku przeciwgrzybiczego.",
  "infoEn": "A fungal skin infection (dermatophytosis) in birds causes scaly lesions on the beak and skin, like mites — but it is a fungus, not a mite. A skin scrape shows fungal hyphae, not mites. Treatment is an antifungal (a different drug class), not an antiparasitic.\n\nIn the game a distractor for scaly face mites — a scaly beak overlaps, but the scrape shows hyphae, not mites. The error is giving ivermectin for a fungus (it doesn't work) instead of an antifungal.",
  "wikiPl": "https://pl.wikipedia.org/wiki/Grzybica",
  "wikiEn": "https://en.wikipedia.org/wiki/Dermatophytosis",
  "claimIds": [
    "C-DIS-21"
  ]
},
{
  "id": "cloacal-prolapse",
  "labelPl": "Wypadnięcie kloaki",
  "labelEn": "Cloacal prolapse",
  "requiredExams": [
    "physical-exam"
  ],
  "supportiveExams": [],
  "recommendedGroups": [],
  "contraindicatedGroups": [],
  "bacterialInfection": false,
  "drugIsSupportive": false,
  "optionalExams": [
    "radiograph"
  ],
  "infoPl": "Wypadnięcie kloaki to stan, w którym tkanka kloaki (końcowy odcinek jelita, jajowodu lub moczowodu) wysuwa się na zewnątrz — nagła masa z wylotu kloaki. Stan nagły: tkanka wysycha i ulega martwicy. Leczenie: pilne nawrócenie, nawilżenie, szwy zatrzymujące, czasem operacja.\n\nW grze dystraktor dla zatrzymania jaja — samica na dnie klatki wspólne, ale wypadnięcie pokazuje wysuniętą tkankę, nie napinanie. Błąd to podanie wapnia na wypadnięcie (nie pomoże, tkanka musi być nawrócona).",
  "infoEn": "Cloacal prolapse is a condition in which cloacal tissue (the terminal intestine, oviduct or ureter) protrudes outward — a sudden mass from the vent. It is an emergency: the tissue dries and necroses. Treatment: urgent replacement, lubrication, retention sutures, sometimes surgery.\n\nIn the game a distractor for egg binding — a hen on the cage floor overlaps, but prolapse shows protruding tissue, not straining. The error is giving calcium for a prolapse (it won't help — the tissue must be replaced).",
  "wikiPl": "https://pl.wikipedia.org/wiki/Kloaka",
  "wikiEn": "https://en.wikipedia.org/wiki/Cloaca",
  "claimIds": [
    "C-DIS-22"
  ]
},
{
  "id": "egg-yolk-peritonitis",
  "labelPl": "Zapalenie otrzewnej z żółtka",
  "labelEn": "Egg-yolk peritonitis",
  "requiredExams": [
    "physical-exam",
    "radiograph"
  ],
  "supportiveExams": [
    "blood-panel"
  ],
  "recommendedGroups": [
    "antibiotic"
  ],
  "contraindicatedGroups": [
    "nsaid"
  ],
  "bacterialInfection": true,
  "drugIsSupportive": false,
  "optionalExams": [],
  "infoPl": "Zapalenie otrzewnej z żółtka to powikłanie znoszenia jaj — żółtko dostaje się do jamy brzusznej, wywołując zapalenie (często wtórnie zakaźne). Samica osowiała, brzuch powiększony, gorączkuje. Leczenie: antybiotyk, płyny IV, pilna operacja (wypłukanie jamy brzusznej, usunięcie jajnika/jajowodu).\n\nW grze dystraktor dla zatrzymania jaja — samica na dnie klatki wspólne, ale peritonitis to powikłanie (żółtko w jamie brzusznej), nie zatrzymanie. Błąd to podanie wapnia na zapalenie otrzewnej (nie pomoże, potrzebny antybiotyk + operacja).",
  "infoEn": "Egg-yolk peritonitis is a complication of egg-laying — yolk leaks into the abdominal cavity, causing inflammation (often secondarily infected). The hen is lethargic, the abdomen enlarged, feverish. Treatment: an antibiotic, IV fluids, emergency surgery (flush the abdomen, remove the ovary/oviduct).\n\nIn the game a distractor for egg binding — a hen on the cage floor overlaps, but peritonitis is a complication (yolk in the abdomen), not a stuck egg. The error is giving calcium for peritonitis (it won't help — an antibiotic and surgery are needed).",
  "wikiPl": "https://pl.wikipedia.org/wiki/Zapalenie_otrzewnej",
  "wikiEn": "https://en.wikipedia.org/wiki/Peritonitis",
  "claimIds": [
    "C-DIS-22"
  ]
},
  {
  "id": "metabolic-bone-disease",
  "labelPl": "Choroba metaboliczna kości (MBD)",
  "labelEn": "Metabolic bone disease",
  "requiredExams": ["physical-exam", "radiograph"],
  "supportiveExams": [],
  "recommendedGroups": ["vitamin-mineral"],
  "contraindicatedGroups": ["antibiotic"],
  "bacterialInfection": false,
  "drugIsSupportive": false,
  "optionalExams": ["blood-panel"],
  "infoPl": "Choroba metaboliczna kości (MBD) to grupa zaburzeń kości wywołanych niedoborem wapnia i witaminy D3 — najczęściej z braku promieniowania UVB w niewoli. Bez UVB gad nie syntetyzuje witaminy D3 w skórze, a bez D3 jelito nie wchłania wapnia z pokarmu. Kości i pancerz stają się miękkie, kończyny wyginają się, a płytki pancerza piramidują. To najczęstsza choroba gadów w niewoli.\n\nMBD nie jest infekcją — to choroba metaboliczna, „niedoborowa”. Antybiotyk na MBD to błąd: nie działa na przyczynę (niedobór), a napędza oporność (AMR). Leczenie to trzy elementy: doustny wapń, witamina D3 i korekcja warunków — lampa UVB, dieta bogata w wapń, gradient temperatur. Wikipedia potwierdza: MBD jest „commonly reversible once the underlying defect has been treated” — odwracalna po usunięciu przyczyny.\n\nDiagnoza to badanie kliniczne (miękki pancerz, osłabione kończyny) i RTG (zubożona struktura kości). Bez RTG nie widać, jak daleko poszła demineralizacja. MBD uczy, że w gadzie fundament zdrowia to warunki, nie leki — i że antybiotyk nie leczy wszystkiego.",
  "infoEn": "Metabolic bone disease (MBD) is a group of bone disorders caused by calcium and vitamin D3 deficiency — most often from lack of UVB radiation in captivity. Without UVB a reptile cannot synthesize vitamin D3 in its skin, and without D3 the gut cannot absorb calcium from food. Bones and shell become soft, limbs bow, and shell plates pyramid. It is the most common disease of captive reptiles.\n\nMBD is not an infection — it is a metabolic, “deficiency” disease. An antibiotic for MBD is a mistake: it does not address the cause (deficiency) and drives resistance (AMR). Treatment is a trio: oral calcium, vitamin D3, and correction of conditions — a UVB lamp, a calcium-rich diet, a temperature gradient. Wikipedia confirms MBD is “commonly reversible once the underlying defect has been treated” — reversible after the cause is removed.\n\nDiagnosis is clinical exam (soft shell, weak limbs) and a radiograph (depleted bone structure). Without an X-ray one cannot see how far demineralization has gone. MBD teaches that in a reptile the foundation of health is the environment, not drugs — and that an antibiotic does not treat everything.",
  "wikiPl": "https://pl.wikipedia.org/wiki/Choroba_metaboliczna_ko%C5%9Bci",
  "wikiEn": "https://en.wikipedia.org/wiki/Metabolic_bone_disease",
  "claimIds": ["C-DIS-23"]
},
  {
    "id": "insulinoma",
    "labelPl": "Insulinoma (guz wysepek trzustki)",
    "labelEn": "Insulinoma",
    "requiredExams": ["blood-panel"],
    "supportiveExams": [],
    "optionalExams": ["physical-exam"],
    "recommendedGroups": ["endocrine"],
    "contraindicatedGroups": ["antibiotic"],
    "bacterialInfection": false,
    "infoPl": "Insulinoma to guz neuroendokrynny trzustki wywodzący się z komórek beta wysepek trzustkowych, które produkują insulinę. Guz wydziela insulinę niezależnie od poziomu glukozy — pompuje insulinę nawet gdy cukier we krwi jest już niski, co prowadzi do hipoglikemii. To najczęstszy nowotwór u fretek (typowo wiek 4-5 lat). Wikipedia potwierdza: \"Insulinoma...is the most common form of cancer in ferrets.\"\n\nObjawy hipoglikemii to osłabienie tylnych łap, ślinotok, drżenia, a w skrajnych przypadkach drgawki i kolaps — nasilają się na czczo i przy wysiłku. Rozpoznanie to niski poziom glukozy na czczo (poniżej 60 mg/dL) w panelu biochemicznym — nie wymaga osobnego badania, glukoza jest w standardowym panelu.\n\nLeczenie jest paliatywne: prednizolon podnosi glukozę (glukoneogeneza), diazoksyd hamuje wydzielanie insuliny (K-ATP). To NIE infekcja bakteryjna — antybiotyk jest przeciwwskazany. Insulinoma to choroba metaboliczna/endokrynna, a nie zakaźna. Jedynym potencjalnym lekarstwem jest chirurgia (usunięcie guzu), ale to procedura specjalistyczna (referral).",
    "infoEn": "Insulinoma is a neuroendocrine tumor of the pancreas arising from the beta cells of the islets of Langerhans, which produce insulin. The tumor secretes insulin regardless of glucose level — it pumps insulin even when blood sugar is already low, causing hypoglycemia. It is the most common cancer in ferrets (typically ages 4-5). Wikipedia confirms: \"Insulinoma...is the most common form of cancer in ferrets.\"\n\nSigns of hypoglycemia are hind-leg weakness, drooling, tremors, and in severe cases seizures and collapse — they worsen with fasting and exercise. Diagnosis is a low fasting blood glucose (below 60 mg/dL) on a biochemistry panel — no separate exam is needed, glucose is in the standard panel.\n\nTreatment is palliative: prednisolone raises glucose (gluconeogenesis), diazoxide inhibits insulin release (K-ATP). This is NOT a bacterial infection — antibiotics are contraindicated. Insulinoma is a metabolic/endocrine disease, not an infectious one. The only potential cure is surgery (tumor removal), but that is a specialist (referral) procedure.",
    "wikiPl": "https://pl.wikipedia.org/wiki/Insulinoma",
    "wikiEn": "https://en.wikipedia.org/wiki/Insulinoma",
    "claimIds": ["C-DIS-24"]
  },
  {
    "id": "infectious-stomatitis",
    "labelPl": "Zapalenie jamy ustnej (stomatitis)",
    "labelEn": "Infectious stomatitis (mouth rot)",
    "requiredExams": ["physical-exam"],
    "supportiveExams": [],
    "optionalExams": [],
    "recommendedGroups": ["antibiotic", "antiseptic-topical"],
    "contraindicatedGroups": [],
    "bacterialInfection": true,
    "infoPl": "Zapalenie jamy ustnej (stomatitis, potocznie „mouth rot”) to bakteryjna infekcja błony śluzowej jamy ustnej u węży. Bakterie (często Gram-ujemne, np. Pseudomonas) namnażają się w jamie ustnej, gdy odporność spada — zwykle z powodu błędów w hodowli: zbyt niska temperatura (zwalnia metabolizm i odporność), zła higiena terrarium lub uraz jamy ustnej. Nieleczona infekcja szerzy się, niszczy tkanki i może przejść w zakażenie ogólnoustrojowe — bywa śmiertelna.\n\nObjawy to ślinotok, obrzęk i przekrwienie błony śluzowej, oraz masa serowata (caseous) zalegająca w jamie ustnej — to martwa tkanka i ropa. Wąż odmawia jedzenia, bo boli go otwieranie pyska. Rozpoznanie to badanie kliniczne (oględziny jamy ustnej), a leczenie łączy trzy elementy: oczyszczenie jamy ustnej i martwiktomię (usunięcie masy serowatej), miejscowy antyseptyk (chlorheksydyna) oraz ogólnoustrojowy antybiotyk (enrofloksacyna, skuteczna na Gram-ujemne).\n\nTo infekcja bakteryjna — antybiotyk jest tu wskazany, w przeciwieństwie do chorób metabolicznych (MBD) czy endokrynnych (insulinoma), gdzie antybiotyk szkodzi. Stomatitis uczy, że wąż odmawiający jedzenia w chłodnym terrarium to pacjent, a higiena i temperatura to lek zapobiegawczy.",
    "infoEn": "Infectious stomatitis (commonly “mouth rot”) is a bacterial infection of the oral mucosa in snakes. Bacteria (often Gram-negative, e.g. Pseudomonas) proliferate in the mouth when immunity drops — usually from poor husbandry: too-low temperature (slows metabolism and immunity), poor enclosure hygiene, or mouth injury. Untreated, the infection spreads, destroys tissue, and can become systemic — it can be fatal.\n\nSigns are drooling, swelling and redness of the mucosa, and caseous (cheese-like) material pooling in the mouth — dead tissue and pus. The snake refuses to eat because opening the mouth hurts. Diagnosis is clinical (oral examination), and treatment combines three elements: oral cavity cleaning and debridement (removing the caseous debris), topical antiseptic (chlorhexidine), and a systemic antibiotic (enrofloxacin, effective against Gram-negatives).\n\nThis is a bacterial infection — antibiotics ARE indicated here, unlike metabolic (MBD) or endocrine (insulinoma) diseases where antibiotics harm. Stomatitis teaches that a snake refusing food in a cool enclosure is a patient, and that hygiene and temperature are preventive medicine.",
    "wikiPl": "https://en.wikipedia.org/wiki/Stomatitis",
    "wikiEn": "https://en.wikipedia.org/wiki/Stomatitis",
    "claimIds": ["C-DIS-25"]
  }

];
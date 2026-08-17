// Słownik pojęć weterynaryjnych/farmakologicznych. Dwa poziomy wyjaśnienia:
//   simplePl/simpleEn — jedno zdanie, prawdziwe, dostępne 9-latce (bez fałszowania)
//   fullPl/fullEn     — pełne wyjaśnienie dla dorosłego/studenta (mechanizm, zakres)
// `term` = DOKŁADNIE tak jak pojawia się w polskim tekście gry (detekcja case-insensitive
// po granicach słowa w UI). Terminy medycznie-krytyczne mają `source` (URL MVM) i verified:true.
// Klasyfikacja: definicje = Verified (ze źródłem) lub Computed (z danych gry); nie fictionalized.

export const GLOSSARY = [
  {
    id: "g-antiseptic",
    term: "antyseptyk", termEn: "antiseptic",
    forms: ["antyseptyku", "antyseptykiem", "antyseptyki", "antyseptyków"],
    simplePl: "Substancja odkażająca ranę i zabijająca zarazki na powierzchni - to nie antybiotyk.",
    fullPl: "Antyseptyk miejscowy niszczy drobnoustroje na powierzchni tkanek; w przeciwieństwie do antybiotyku nie wnika do organizmu i nie napędza oporności (AMR).",
    simpleEn: "A substance that disinfects a wound and kills germs on the surface — it's not an antibiotic.",
    fullEn: "A topical antiseptic destroys microorganisms on tissue surfaces; unlike an antibiotic it does not enter the body and does not drive antimicrobial resistance (AMR).",
    source: null, verified: false
  },
  {
    id: "g-antibiotic",
    term: "antybiotyk", termEn: "antibiotic",
    forms: ["antybiotyku", "antybiotykiem", "antybiotyki", "antybiotyków", "antybiotykami"],
    simplePl: "Lek, który zabija bakterie - nie działa na wirusy, pasożyty ani urazy.",
    fullPl: "Antybiotyk niszczy bakterie lub hamuje ich wzrost; skuteczny tylko przy infekcji bakteryjnej. Nadużywanie (np. przy urazie) napędza oporność (AMR) i naraża na skutki uboczne bez korzyści.",
    simpleEn: "A medicine that kills bacteria — it doesn't work on viruses, parasites or injuries.",
    fullEn: "An antibiotic kills or inhibits bacteria; effective only for bacterial infection. Overuse (e.g. for trauma) drives resistance (AMR) and risks side effects without benefit.",
    source: null, verified: false
  },
  {
    id: "g-amr",
    term: "oporność", termEn: "antimicrobial resistance",
    forms: ["oporności", "opornością", "opornościom"],
    simplePl: "Zdolność bakterii do przetrwania leku, który wcześniej je zabijał - przez nadużywanie antybiotyków.",
    fullPl: "Oporność na antybiotyki (AMR) powstaje, gdy bakterie przystosowują się do przeżycia pod wpływem leku. Nadmierne i nieuzasadnione podawanie antybiotyków (np. przy urazie bez infekcji) przyspiesza AMR, utrudniając leczenie w przyszłości.",
    simpleEn: "The ability of bacteria to survive a drug that used to kill them — caused by overusing antibiotics.",
    fullEn: "Antimicrobial resistance (AMR) arises when bacteria adapt to survive drug exposure. Excessive and unjustified antibiotic use (e.g. for trauma without infection) accelerates AMR, making future treatment harder.",
    source: null, verified: false
  },
  {
    id: "g-amr-abbr",
    term: "AMR", termEn: "AMR",
    simplePl: "Skrót od oporności na antybiotyki - bakterie uczą się przeżywać lek.",
    fullPl: "AMR (Antimicrobial Resistance) - oporność na leki przeciwdrobnoustrojowe; bakterie przystosowują się do antybiotyków, przez co leki przestają działać.",
    simpleEn: "Short for antibiotic resistance — bacteria learn to survive the drug.",
    fullEn: "AMR (Antimicrobial Resistance) — microbes adapt to antibiotics so the drugs stop working.",
    source: null, verified: false
  },
  {
    id: "g-nsaid",
    term: "NSAID", termEn: "NSAID",
    simplePl: "Lek przeciwzapalny i przeciwbólowy (niesteroidowy) - np. meloksykam, karprofen. Obciąża nerki i żołądek.",
    fullPl: "NSAID (Niesteroidowy Lek Przeciwzapalny) łagodzi ból i stan zapalny (np. meloksykam, karprofen). Działa przez hamowanie cyklooksygenazy (COX); obciąża nerki i przewód pokarmowy - u kotów wąski margines bezpieczeństwa.",
    simpleEn: "An anti-inflammatory and pain medicine (non-steroidal) — e.g. meloxicam, carprofen. Strains kidneys and stomach.",
    fullEn: "NSAID (Non-Steroidal Anti-Inflammatory Drug) relieves pain and inflammation (e.g. meloxicam, carprofen) by inhibiting cyclooxygenase (COX); it burdens kidneys and GI tract — cats have a narrow safety margin.",
    source: null, verified: false
  },
  {
    id: "g-opioid",
    term: "opioid", termEn: "opioid",
    forms: ["opioidy", "opioidów", "opioidami", "opioidem"],
    simplePl: "Silny lek przeciwbólowy na ostry ból (np. uraz) - np. buprenorfina.",
    fullPl: "Opioid to silny analgetyk działający na receptory opioidowe; stosowany przy silnym bólu (np. złamanie). Buprenorfina u kota podawana podjęzykowo (transmukosalnie).",
    simpleEn: "A strong pain medicine for severe pain (e.g. trauma) — e.g. buprenorphine.",
    fullEn: "An opioid is a strong analgesic acting on opioid receptors; used for severe pain (e.g. fracture). Buprenorphine in cats is given sublingually (transmucosally).",
    source: null, verified: false
  },
  {
    id: "g-steroid",
    term: "steryd", termEn: "steroid",
    forms: ["sterydy", "sterydów", "sterydem", "sterydami"],
    simplePl: "Lek gaszący stan zapalny - w kroplach do uszu łagodzi obrzęk i swędzenie.",
    fullPl: "Steryd (glikokortykoid) silnie hamuje stan zapalny i reakcję immunologiczną; w kroplach do uszu zmniejsza obrzęk i świąd. Nie działa na infekcję - może jedynie maskować przyczynę.",
    simpleEn: "A medicine that calms inflammation — in ear drops it reduces swelling and itching.",
    fullEn: "A steroid (glucocorticoid) strongly suppresses inflammation and immune response; in ear drops it reduces swelling and itching. It does not treat infection and may mask the cause.",
    source: null, verified: false
  },
  {
    id: "g-antifungal",
    term: "przeciwgrzybiczy", termEn: "antifungal",
    simplePl: "Lek zabijający grzyby i drożdże - np. w uchu, gdy cytologia pokaże drożdże.",
    fullPl: "Lek przeciwgrzybiczy niszczy grzyby i drożdże (np. Malassezia); stosowany miejscowo w zapaleniu ucha, gdy cytologia potwierdza drożdże.",
    simpleEn: "A medicine that kills fungi and yeast — e.g. in the ear when cytology shows yeast.",
    fullEn: "An antifungal destroys fungi and yeast (e.g. Malassezia); used topically in otitis when cytology confirms yeast.",
    source: null, verified: false
  },
  {
    id: "g-mgkg",
    term: "mg/kg", termEn: "mg/kg",
    simplePl: "Tyle miligramów leku na każdy kilogram wagi zwierzęcia. Dawka = mg/kg × waga (kg).",
    fullPl: "Stosunek dawki do masy ciała: miligramy leku na kilogram wagi. Dawka całkowita (mg) = mg/kg × waga (kg). Bez zważenia nie da się obliczyć bezpiecznej dawki.",
    simpleEn: "Milligrams of drug per kilogram of the animal's weight. Dose = mg/kg × weight (kg).",
    fullEn: "Drug-to-bodyweight ratio: milligrams of drug per kilogram of weight. Total dose (mg) = mg/kg × weight (kg). Without weighing, a safe dose cannot be calculated.",
    source: null, verified: false
  },
  {
    id: "g-dosing",
    term: "dawkowanie", termEn: "dosing",
    simplePl: "Ile leku i jak często podać - zależy od wagi zwierzęcia.",
    fullPl: "Dawkowanie określa ilość leku (mg), częstość i drogę podania; u zwierząt dawka zależy od masy ciała (mg/kg).",
    simpleEn: "How much medicine and how often to give it — depends on the animal's weight.",
    fullEn: "Dosing specifies the amount of drug (mg), frequency, and route; in animals the dose depends on body weight (mg/kg).",
    source: null, verified: false
  },
  {
    id: "g-route",
    term: "droga podania", termEn: "route of administration",
    simplePl: "Sposób podania leku: doustnie, na skórę, do ucha, we wstrzyknięciu.",
    fullPl: "Droga podania określa, jak lek trafia do organizmu: p.o. (doustnie), miejscowo (na skórę/ranę), do ucha, i.m./i.v./s.c. (wstrzyknięcie). Wybór drogi wpływa na skuteczność i bezpieczeństwo.",
    simpleEn: "How the medicine is given: by mouth, on the skin, in the ear, by injection.",
    fullEn: "The route of administration determines how the drug enters the body: oral (p.o.), topical, otic, i.m./i.v./s.c. (injection). The route affects efficacy and safety.",
    source: null, verified: false
  },
  {
    id: "g-po",
    term: "p.o.", termEn: "p.o.",
    simplePl: "Skrót: podanie doustne - lek do pyska (połknięcie).",
    fullPl: "p.o. (per os) - podanie doustne; lek połykany, wchłaniany z przewodu pokarmowego.",
    simpleEn: "Abbreviation: by mouth — the medicine is swallowed.",
    fullEn: "p.o. (per os) — oral administration; the drug is swallowed and absorbed from the GI tract.",
    source: null, verified: false
  },
  {
    id: "g-topical",
    term: "miejscowo", termEn: "topical",
    simplePl: "Lek nakładany na skórę lub ranę - nie wchłania się w organizm.",
    fullPl: "Podanie miejscowe (topical) - lek działa na powierzchni (skóra, rana, ucho); minimalnie wchłania się do krwiobiegu. Dawka nie jest liczona w mg/kg.",
    simpleEn: "Medicine applied to the skin or wound — it doesn't enter the body.",
    fullEn: "Topical administration — the drug acts on the surface (skin, wound, ear) and is minimally absorbed into the bloodstream. The dose is not calculated as mg/kg.",
    source: null, verified: false
  },
  {
    id: "g-systemic",
    term: "ogólnoustrojowo", termEn: "systemic",
    simplePl: "Lek działający w całym ciele - połykany lub wstrzykiwany, trafia do krwi.",
    fullPl: "Działanie ogólnoustrojowe (systemic) - lek trafia do krwiobiegu i działa w całym organizmie (p.o., i.m., i.v.); wymaga precyzyjnego dawkowania mg/kg.",
    simpleEn: "A medicine that works throughout the body — swallowed or injected, it enters the blood.",
    fullEn: "Systemic action — the drug enters the bloodstream and works throughout the body (oral, i.m., i.v.); requires precise mg/kg dosing.",
    source: null, verified: false
  },
  {
    id: "g-glucuronidation",
    term: "glukuronidacja", termEn: "glucuronidation",
    forms: ["glukuronidacji", "glukuronidacją"],
    simplePl: "Sposób, jakim organizm rozkłada niektóre leki. Koty robią to słabo - dlatego wiele leków ludzkich jest dla nich trucizną.",
    fullPl: "Glukuronidacja to proces metaboliczny (koniugacja z kwasem glukuronowym), którym wątroba rozkłada wiele leków. Koty mają niedobór glukuronylotransferaz - dlatego acetaminofen i inne leki są u nich toksyczne (metHb, uszkodzenie wątroby).",
    simpleEn: "A way the body breaks down some drugs. Cats do this poorly — so many human medicines are poison to them.",
    fullEn: "Glucuronidation is a metabolic pathway (conjugation with glucuronic acid) by which the liver clears many drugs. Cats are deficient in glucuronyl transferases — hence acetaminophen and other drugs are toxic in cats (methemoglobinemia, hepatotoxicity).",
    source: "https://www.merckvetmanual.com/toxicology/toxicoses-from-human-analgesics/toxicoses-from-human-analgesics-in-animals",
    verified: true
  },
  {
    id: "g-methb",
    term: "methemoglobinemia", termEn: "methemoglobinemia",
    simplePl: "Zatrucie krwi: czerwone krwinki nie niosą tlenu - zwierzę sinieje i dusi się. Tak działa acetaminofen u kota.",
    fullPl: "Methemoglobinemia (metHb) - hemoglobina utlenia się do methemoglobiny, która nie transportuje tlenu; powoduje sinicę i niedotlenienie. Charakterystyczne dla zatrucia acetaminofenem u kota.",
    simpleEn: "Blood poisoning: red cells can't carry oxygen — the animal turns blue and suffocates. This is what acetaminophen does to cats.",
    fullEn: "Methemoglobinemia (metHb) — hemoglobin oxidizes to methemoglobin, which cannot carry oxygen; it causes cyanosis and hypoxia. Characteristic of acetaminophen toxicosis in cats.",
    source: "https://www.merckvetmanual.com/toxicology/toxicoses-from-human-analgesics/toxicoses-from-human-analgesics-in-animals",
    verified: true
  },
  {
    id: "g-methb-abbr",
    term: "metHb", termEn: "metHb",
    simplePl: "Skrót od methemoglobina - zła wersja hemoglobiny, która nie niesie tlenu.",
    fullPl: "metHb (methemoglobina) - utleniona forma hemoglobiny, która nie wiąże tlenu; jej nagromadzenie (methemoglobinemia) to objaw zatrucia acetaminofenem u kota.",
    simpleEn: "Short for methemoglobin — the bad form of hemoglobin that can't carry oxygen.",
    fullEn: "metHb (methemoglobin) — the oxidized form of hemoglobin that cannot bind oxygen; its accumulation (methemoglobinemia) signals acetaminophen poisoning in cats.",
    source: "https://www.merckvetmanual.com/toxicology/toxicoses-from-human-analgesics/toxicoses-from-human-analgesics-in-animals",
    verified: true
  },
  {
    id: "g-nephrotoxic",
    term: "nephrotoksyczny", termEn: "nephrotoxic",
    simplePl: "Szkodliwy dla nerek - niektóre leki (np. NSAID) obciążają nerki, u kotów szczególnie.",
    fullPl: "Nephrotoksyczność - uszkodzenie nerek; NSAID i niektóre antybiotyki obciążają nerki, dlatego u kotów (wrażliwych na odwodnienie) stosuje się je ze szczególną ostrożnością.",
    simpleEn: "Harmful to the kidneys — some drugs (e.g. NSAIDs) strain the kidneys, especially in cats.",
    fullEn: "Nephrotoxicity — kidney damage; NSAIDs and some antibiotics burden the kidneys, requiring special caution in cats (sensitive to dehydration).",
    source: null, verified: false
  },
  {
    id: "g-hepatotoxic",
    term: "hepatotoksyczny", termEn: "hepatotoxic",
    simplePl: "Szkodliwy dla wątroby - np. acetaminofen u kota niszczy wątrobę.",
    fullPl: "Hepatotoksyczność - uszkodzenie wątroby; acetaminofen u kota powoduje martwicę wątroby obok methemoglobinemii.",
    simpleEn: "Harmful to the liver — e.g. acetaminophen in cats destroys the liver.",
    fullEn: "Hepatotoxicity — liver damage; acetaminophen in cats causes hepatic necrosis alongside methemoglobinemia.",
    source: "https://www.merckvetmanual.com/toxicology/toxicoses-from-human-analgesics/toxicoses-from-human-analgesics-in-animals",
    verified: true
  },
  {
    id: "g-species-toxic",
    term: "toksyczny gatunkowo", termEn: "species-toxic",
    simplePl: "Lek, który dla jednego zwierzęcia jest lekiem, a dla innego (inny gatunek) - trucizną. Np. paracetamol dla człowieka jest bezpieczny, dla kota trucizną.",
    fullPl: "Toksyczność gatunkowa - ten sam lek może być bezpieczny dla jednego gatunku, a toksyczny dla innego (różnice metaboliczne, np. deficyt glukuronidacji u kota). Acetaminofen: człowiek i pies - bezpieczny w wąskim zakresie, kot - toksyczny. Ibuprofen: pies i kot - toksyczny.",
    simpleEn: "A drug that is medicine for one animal but poison for another species. E.g. paracetamol is fine for humans but poison for cats.",
    fullEn: "Species toxicity — the same drug may be safe in one species but toxic in another (metabolic differences, e.g. cats' glucuronidation deficit). Acetaminophen: human and dog — safe in a narrow range; cat — toxic. Ibuprofen: dog and cat — toxic.",
    source: "https://www.merckvetmanual.com/toxicology/toxicoses-from-human-analgesics/toxicoses-from-human-analgesics-in-animals",
    verified: true
  },
  {
    id: "g-contraindicated",
    term: "przeciwwskazany", termEn: "contraindicated",
    simplePl: "Lek, którego nie wolno podać w danej chorobie - może zaszkodzić.",
    fullPl: "Przeciwwskazanie - sytuacja, w której podanie leku jest zakazane (choroba, gatunek, interakcja), bo szkoda przewyższa korzyść. Np. antybiotyk przy biegunce dietetycznej.",
    simpleEn: "A medicine that must not be given for a certain illness — it can cause harm.",
    fullEn: "A contraindication is a situation where a drug must not be given (disease, species, interaction) because harm outweighs benefit. E.g. an antibiotic for dietary diarrhea.",
    source: null, verified: false
  },
  {
    id: "g-fluoroquinolone",
    term: "fluorochinolon", termEn: "fluoroquinolone",
    forms: ["fluorochinolony", "fluorochinolonów", "fluorochinolonom", "fluorochinolonami"],
    simplePl: "Silny antybiotyk rezerwy; u młodych zwierząt psuje chrząstkę stawów, u kotów w dużych dawkach - wzrok.",
    fullPl: "Fluorochinolony (np. enrofloksacyna) to antybiotyki rezerwy; u młodych zwierząt w fazie wzrostu uszkadzają chrząstkę stawową, u kotów w dużych dawkach powodują degenerację siatkówki i ślepotę.",
    simpleEn: "A strong reserve antibiotic; in young animals it damages joint cartilage, in cats high doses — vision.",
    fullEn: "Fluoroquinolones (e.g. enrofloxacin) are reserve antibiotics; in growing young animals they damage joint cartilage, in cats high doses cause retinal degeneration and blindness.",
    source: "https://www.merckvetmanual.com/pharmacology/antibacterial-agents/quinolones-including-fluoroquinolones-for-use-in-animals",
    verified: true
  },
  {
    id: "g-beta-lactam",
    term: "β-laktam", termEn: "beta-lactam",
    forms: ["β-laktamy", "β-laktamowy", "β-laktamowe", "β-laktamów", "β-laktamami"],
    simplePl: "Grupa antybiotyków (np. penicyliny) - zabijają bakterie niszcząc ich ścianę.",
    fullPl: "Antybiotyki β-laktamowe (penicyliny, np. amoksycylina z kwasem klawulanowym) niszczą ścianę komórkową bakterii; klawulanian chroni lek przed enzymami bakterii. Szerokie spektrum.",
    simpleEn: "A group of antibiotics (e.g. penicillins) — they kill bacteria by destroying their wall.",
    fullEn: "Beta-lactam antibiotics (penicillins, e.g. amoxicillin with clavulanate) destroy the bacterial cell wall; clavulanate protects the drug from bacterial enzymes. Broad spectrum.",
    source: "https://www.merckvetmanual.com/pharmacology/antibacterial-agents/penicillins-use-in-animals",
    verified: true
  },
  {
    id: "g-cephalosporin",
    term: "cefalosporyna", termEn: "cephalosporin",
    forms: ["cefalosporyny", "cefalosporyną", "cefalosporyn", "cefalosporynami"],
    simplePl: "Antybiotyk zabijający bakterie przez ścianę komórkową; często na infekcje skóry i ran.",
    fullPl: "Cefalosporyny (np. cefaleksyna, I generacji) to antybiotyki β-laktamowe niszczące ścianę bakterii; stosowane w infekcjach skórnych i zakażeniach ran.",
    simpleEn: "An antibiotic that kills bacteria via their cell wall; often for skin and wound infections.",
    fullEn: "Cephalosporins (e.g. cephalexin, first generation) are beta-lactam antibiotics destroying the bacterial wall; used for skin and wound infections.",
    source: "https://www.merckvetmanual.com/pharmacology/antibacterial-agents/cephalosporins-and-cephamycins-use-in-animals",
    verified: true
  },
  {
    id: "g-benzimidazole",
    term: "benzimidazol", termEn: "benzimidazole",
    forms: ["benzimidazole", "benzimidazolem", "benzimidazolów"],
    simplePl: "Lek na nicienie i Giardię (np. fenbendazol) - daje się go kilka dni z rzędu.",
    fullPl: "Benzimidazole (np. fenbendazol) to lek przeciwpasożytniczy działający na nicienie i pierwotniaki (Giardia); podawany w serii 3 dni, nie jednorazowo.",
    simpleEn: "A medicine against roundworms and Giardia (e.g. fenbendazole) — given for several days in a row.",
    fullEn: "Benzimidazoles (e.g. fenbendazole) are antiparasitic drugs acting on nematodes and protozoa (Giardia); given as a 3-day course, not a single dose.",
    source: null, verified: false
  },
  {
    id: "g-isoxazoline",
    term: "izoksazolina", termEn: "isoxazoline",
    forms: ["izoksazoliny", "izoksazoliną", "izoksazolin", "izoksazolinami"],
    simplePl: "Nowoczesny lek na pchły i kleszcze (np. fluralaner) - tabletka działa długo.",
    fullPl: "Izoksazoliny (np. fluralaner) to nowoczesne leki przeciwpasożytnicze na pchły i kleszcze; podawane doustnie, działają długo (do 12 tyg.) przez blokadę układu nerwowego owadów.",
    simpleEn: "A modern medicine against fleas and ticks (e.g. fluralaner) — a tablet is long-acting.",
    fullEn: "Isoxazolines (e.g. fluralaner) are modern antiparasitics against fleas and ticks; given orally, long-acting (up to 12 wk) by blocking the insect nervous system.",
    source: null, verified: false
  },
  {
    id: "g-spot-on",
    term: "spot-on", termEn: "spot-on",
    simplePl: "Krople na skórę karku - lek wchłania się przez skórę, nie przez pysk.",
    fullPl: "Spot-on - preparat nakładany na skórę karku (niestrumieniową); lek wchłania się przez skórę i rozprowadza w łoju. Wygodny, miesięczny (np. selamektyna, emodepsyd).",
    simpleEn: "Drops on the neck skin — the medicine absorbs through the skin, not by mouth.",
    fullEn: "Spot-on — a preparation applied to the non-spinal neck skin; the drug absorbs through skin and distributes in sebum. Convenient, monthly (e.g. selamectin, emodepside).",
    source: null, verified: false
  },
  {
    id: "g-cytology",
    term: "cytologia", termEn: "cytology",
    forms: ["cytologii", "cytologię", "cytologią", "cytologie"],
    simplePl: "Badanie komórek pod mikroskopem - pokazuje, czy w ranie lub uchu są bakterie lub drożdże.",
    fullPl: "Cytologia - mikroskopowe badanie rozmazu (z rany, ucha); identyfikuje bakterie, drożdże (Malassezia) i komórki zapalne, co kieruje wyborem leku.",
    simpleEn: "Examining cells under a microscope — shows whether bacteria or yeast are in a wound or ear.",
    fullEn: "Cytology — microscopic examination of a smear (from wound, ear); identifies bacteria, yeast (Malassezia) and inflammatory cells, guiding drug choice.",
    source: null, verified: false
  },
  {
    id: "g-otoscopy",
    term: "otoskopia", termEn: "otoscopy",
    forms: ["otoskopii", "otoskopią"],
    simplePl: "Spojrzenie do ucha specjalną lampką - pokazuje kanał słuchowy i błonę bębenkową.",
    fullPl: "Otoskopia - badanie kanału słuchowego i błony bębenkowej otoskopem; pozwala ocenić obrzęk, wydzielinę, ciała obce przed doborem leku do ucha.",
    simpleEn: "Looking into the ear with a special light — shows the ear canal and eardrum.",
    fullEn: "Otoscopy — examination of the ear canal and eardrum with an otoscope; allows assessment of swelling, discharge, foreign bodies before selecting ear medication.",
    source: null, verified: false
  },
  {
    id: "g-radiography",
    term: "RTG", termEn: "radiograph",
    simplePl: "Prześwietlenie (rentgen) - zdjęcie pokazujące kości, np. czy są złamane.",
    fullPl: "RTG (radiografia, prześwietlenie rentgenowskie) - obraz struktur wewnętrznych (kości, zwichnięcia, złamania, ciała obce); podstawowe badanie urazów kostnych.",
    simpleEn: "An X-ray — a picture showing bones, e.g. whether they are broken.",
    fullEn: "Radiography (X-ray) — an image of internal structures (bones, dislocations, fractures, foreign bodies); the primary exam for bone injuries.",
    source: null, verified: false
  },
  {
    id: "g-fecal-exam",
    term: "badanie kału", termEn: "fecal exam",
    forms: ["badania kału", "badaniu kału", "badaniem kału"],
    simplePl: "Badanie kupki pod mikroskopem - pokazuje jaja pasożytów, które powodują biegunkę.",
    fullPl: "Badanie kału (parazytologiczne) - mikroskopowe wykrycie jaj pasożytów, cyst (np. Giardia) i patogenów; kieruje wyborem między leczeniem przeciwpasożytniczym a antybiotykiem.",
    simpleEn: "Examining stool under a microscope — shows parasite eggs that cause diarrhea.",
    fullEn: "Fecal exam (parasitological) — microscopic detection of parasite eggs, cysts (e.g. Giardia) and pathogens; guides the choice between antiparasitic and antibiotic treatment.",
    source: null, verified: false
  },
  {
    id: "g-nematodes",
    term: "nicienie", termEn: "nematodes",
    forms: ["nicieni", "nicieniami", "nicieniom", "nicienia"],
    simplePl: "Robaki okrągłe (glisty) - żyją w jelitach i mogą powodować biegunkę, zwłaszcza u młodych.",
    fullPl: "Nicienie (glisty, np. Toxocara) - pasożyty jelitowe; powodują biegunkę i spadek kondycji, zwłaszcza u młodych zwierząt. Leczenie: benzimidazole (fenbendazol), nie antybiotyk.",
    simpleEn: "Roundworms — they live in the gut and can cause diarrhea, especially in the young.",
    fullEn: "Nematodes (roundworms, e.g. Toxocara) — intestinal parasites causing diarrhea and poor condition, especially in young animals. Treatment: benzimidazoles (fenbendazole), not antibiotics.",
    source: null, verified: false
  },
  {
    id: "g-cestodes",
    term: "tasiemce", termEn: "cestodes",
    forms: ["tasiemców", "tasiemcem", "tasiemcom", "tasiemca"],
    simplePl: "Płaskie robaki w jelitach - często od zjedzenia pcheł lub myszy. Leczy się prazykwantelem.",
    fullPl: "Tasiemce (cestody) - płaskie pasożyty jelitowe; zarażenie często przez pchły lub zjedzenie drobnicy. Leczenie: prazykwantel (nie działa na nicienie ani pchły).",
    simpleEn: "Flatworms in the gut — often from eating fleas or mice. Treated with praziquantel.",
    fullEn: "Cestodes (tapeworms) — flat intestinal parasites; infection often via fleas or eating prey. Treatment: praziquantel (not effective against nematodes or fleas).",
    source: null, verified: false
  },
  {
    id: "g-malassezia",
    term: "Malassezia", termEn: "Malassezia",
    simplePl: "Drożdże (grzyby) żyjące w uchu - gdy ich za dużo, ucho boli, swędzi i cuchnie.",
    fullPl: "Malassezia to drożdżaki bytujące w przewodzie słuchowym; ich namnożenie (w stale wilgotnym uchu) powoduje zapalenie ucha, swędzenie i ciemną wydzielinę. Rozpoznanie: cytologia.",
    simpleEn: "Yeast (fungi) living in the ear — when there are too many, the ear hurts, itches and smells.",
    fullEn: "Malassezia are yeasts inhabiting the ear canal; their overgrowth (in a persistently moist ear) causes otitis, itching and dark discharge. Diagnosis: cytology.",
    source: null, verified: false
  },
  {
    id: "g-cartilage",
    term: "chrząstka stawowa", termEn: "joint cartilage",
    forms: ["chrząstkę stawową", "chrząstki stawowej", "chrząstką stawową", "chrząstek stawowych"],
    simplePl: "Śliskie tworzywo w stawach, dzięki któremu kości gładko się poruszają. Niektóre antybiotyki psują ją u młodych.",
    fullPl: "Chrząstka stawowa pokrywa powierzchnie stawowe, umożliwiając płynny ruch. Fluorochinolony uszkadzają ją u młodych zwierząt w fazie wzrostu - stąd przeciwwskazanie u szczeniąt i kociąt.",
    simpleEn: "The slippery tissue in joints that lets bones move smoothly. Some antibiotics damage it in the young.",
    fullEn: "Joint cartilage covers articular surfaces, enabling smooth movement. Fluoroquinolones damage it in growing young animals — hence contraindication in puppies and kittens.",
    source: "https://www.merckvetmanual.com/pharmacology/antibacterial-agents/quinolones-including-fluoroquinolones-for-use-in-animals",
    verified: true
  },
  {
    id: "g-retina",
    term: "retina", termEn: "retina",
    simplePl: "Warstwa w oku, która widzi - uszkodzona, powoduje ślepotę. Duże dawki niektórych leków szkodzą jej u kotów.",
    fullPl: "Retina (siatkówka) - warstwa światłoczuła oka; u kotów wysokie dawki fluorochinolonów (enrofloksacyna) mogą powodować jej degenerację i ślepotę.",
    simpleEn: "The light-sensing layer of the eye — if damaged, it causes blindness. High doses of some drugs harm it in cats.",
    fullEn: "The retina is the light-sensitive layer of the eye; in cats high doses of fluoroquinolones (enrofloxacin) can cause retinal degeneration and blindness.",
    source: "https://www.merckvetmanual.com/pharmacology/antibacterial-agents/quinolones-including-fluoroquinolones-for-use-in-animals",
    verified: true
  },
  {
    id: "g-bacterial-infection",
    term: "infekcja bakteryjna", termEn: "bacterial infection",
    forms: ["infekcji bakteryjnej", "infekcję bakteryjną", "infekcją bakteryjną", "infekcje bakteryjne"],
    simplePl: "Choroba wywołana przez bakterie - tylko wtedy antybiotyk ma sens. Uraz ani pasożyty to nie infekcja bakteryjna.",
    fullPl: "Infekcja bakteryjna - choroba, w której bakterie są przyczyną (potwierdzona badaniem, np. cytologią). Antybiotyk jest uzasadniony tylko wtedy; przy urazie, pasożytach lub biegunce dietetycznej jest irracjonalny (AMR).",
    simpleEn: "An illness caused by bacteria — only then does an antibiotic make sense. Trauma and parasites are not bacterial infections.",
    fullEn: "A bacterial infection is a disease where bacteria are the cause (confirmed by an exam, e.g. cytology). An antibiotic is justified only then; for trauma, parasites or dietary diarrhea it is irrational (AMR).",
    source: null, verified: false
  },
  {
    id: "g-parasites",
    term: "pasożyty", termEn: "parasites",
    forms: ["pasożytów", "pasożytami", "pasożytem", "pasożytom"],
    simplePl: "Stworzenia żyjące kosztem zwierzęcia - np. pchły na skórze, nicienie w jelitach. Leczy się je lekami przeciwpasożytniczymi, nie antybiotykiem.",
    fullPl: "Pasożyty (zewnętrzne: pchły, kleszcze; wewnętrzne: nicienie, tasiemce) żyją kosztem gospodarza; leczone lekami przeciwpasożytniczymi (benzimidazole, izoksazoliny, spot-on), nie antybiotykiem.",
    simpleEn: "Creatures living off the animal — e.g. fleas on the skin, worms in the gut. They are treated with antiparasitics, not antibiotics.",
    fullEn: "Parasites (external: fleas, ticks; internal: nematodes, cestodes) live at the host's expense; treated with antiparasitics (benzimidazoles, isoxazolines, spot-on), not antibiotics.",
    source: null, verified: false
  },
  {
    id: "g-flora",
    term: "flora", termEn: "flora",
    forms: ["florę", "flory", "florą", "florze", "flory bakteryjnej"],
    simplePl: "Bakterie żyjące w jelitach i na skórze - pomagają trawić i bronią przed wrogami. Antybiotyk może je zniszczyć.",
    fullPl: "Flora bakteryjna (mikrobiom) to zbiór pożytecznych bakterii jelitowych i skórnych; chroni przed patogenami i pomaga trawić. Antybiotyk szerokiego spektrum niszczy florę, co u królika może wywołać śmiertelną enterotoksemię, a u psa i kota biegunkę.",
    simpleEn: "Bacteria living in the gut and on the skin — they help digest and fight off enemies. An antibiotic can destroy them.",
    fullEn: "Bacterial flora (microbiome) is the set of beneficial gut and skin bacteria; it protects against pathogens and aids digestion. A broad-spectrum antibiotic destroys the flora, which in rabbits can trigger fatal enterotoxemia and in dogs and cats diarrhea.",
    source: null, verified: false
  },
  {
    id: "g-enterotoxemia",
    term: "enterotoksemia", termEn: "enterotoxemia",
    forms: ["enterotoksemii", "enterotoksemie", "enterotoksemę"],
    simplePl: "Śmiertelne zatrucie jelitowe u królika - gdy antybiotyk zabije pożyteczne bakterie, w ich miejsce wkraczają trujące.",
    fullPl: "Enterotoksemia u królika: antybiotyki doustne (zwłaszcza β-laktamy, np. amoksycylina) niszczą florę jelitową, co pozwala bakteriom Clostridium wyprodukować toksyny wchłaniane do krwi - śmierć w ciągu godzin. Dlatego u królika antybiotyki doustne są zakazane.",
    simpleEn: "A fatal intestinal poisoning in rabbits — when an antibiotic kills the good bacteria, poisonous ones take their place.",
    fullEn: "Enterotoxemia in rabbits: oral antibiotics (especially beta-lactams, e.g. amoxicillin) destroy the gut flora, allowing Clostridium bacteria to produce toxins absorbed into the blood — death within hours. Hence oral antibiotics are forbidden in rabbits.",
    source: "https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/disorders-of-rabbits",
    verified: true
  },
  {
    id: "g-yeast",
    term: "drożdżaki", termEn: "yeast",
    forms: ["drożdżaków", "drożdżakami", "drożdżaka", "drożdżaki"],
    simplePl: "Grzyby żyjące w uchu i na skórze - gdy ich za dużo, ucho swędzi i cuchnie. Nie leczy się ich antybiotykiem.",
    fullPl: "Drożdżaki (np. Malassezia) to grzyby bytujące w przewodzie słuchowym i na skórze; ich namnożenie powoduje zapalenie ucha. Leczy się je lekiem przeciwgrzybiczym, nie antybiotykiem - antybiotyk przeciwnie, może je napędzić niszcząc florę bakteryjną.",
    simpleEn: "Fungi living in the ear and on the skin — when there are too many, the ear itches and smells. They are not treated with an antibiotic.",
    fullEn: "Yeasts (e.g. Malassezia) are fungi inhabiting the ear canal and skin; their overgrowth causes otitis. They are treated with an antifungal, not an antibiotic — an antibiotic can in fact worsen them by destroying the bacterial flora.",
    source: null, verified: false
  },
  {
    id: "g-swab",
    term: "wymaz", termEn: "swab",
    forms: ["wymazu", "wymazem", "wymazy"],
    simplePl: "Próbkę z rany lub ucha bierze się patyczkiem - tak pobiera się materiał do cytologii.",
    fullPl: "Wymaz (swab) to pobranie próbki z rany, ucha lub skóry sterylnym patyczkiem; materiał rozmazuje się na szkiełku i bada pod mikroskopem (cytologia), co wskazuje bakterie lub drożdżaki.",
    simpleEn: "A sample from a wound or ear taken with a stick — that is how material for cytology is collected.",
    fullEn: "A swab is a sample taken from a wound, ear or skin with a sterile stick; the material is smeared on a slide and examined under a microscope (cytology), revealing bacteria or yeasts.",
    source: null, verified: false
  },
  {
    id: "g-pseudomonas",
    term: "Pseudomonas", termEn: "Pseudomonas",
    simplePl: "Bakteria oporna na wiele antybiotyków - bywa w uchu i ranach. Często wymaga leku rezerwy.",
    fullPl: "Pseudomonas aeruginosa to bakteria o naturalnej oporności na wiele antybiotyków (wiele β-laktamów); w przewlekłym zapaleniu ucha i ranach bywa głównym patogenem. Lekami wyboru są fluorochinolony lub aminoglikozydy - po potwierdzeniu cytologią.",
    simpleEn: "A bacterium resistant to many antibiotics — sometimes in the ear and wounds. It often needs a reserve drug.",
    fullEn: "Pseudomonas aeruginosa is a bacterium with natural resistance to many antibiotics (many beta-lactams); in chronic otitis and wounds it can be the main pathogen. Drugs of choice are fluoroquinolones or aminoglycosides — after cytology confirms it.",
    source: null, verified: false
  },
  {
    id: "g-eardrum",
    term: "błona bębenkowa", termEn: "eardrum",
    forms: ["błony bębenkowej", "błonę bębenkową", "błoną bębenkową"],
    simplePl: "Cienka błona w uchu, która odbiera dźwięk - trzeba sprawdzić otoskopem, czy jest cała, zanim poda się krople.",
    fullPl: "Błona bębenkowa oddziela przewód słuchowy od ucha środkowego; otoskopia ocenia, czy jest nienaruszona. Gdy jest pęknięta, niektóre krople do ucha mogą uszkodzić ucho wewnętrzne (ototoksyczność), dlatego najpierw otoskopia, potem leki.",
    simpleEn: "A thin membrane in the ear that catches sound — you check with an otoscope that it's intact before giving drops.",
    fullEn: "The eardrum (tympanic membrane) separates the ear canal from the middle ear; otoscopy assesses whether it is intact. When it's ruptured, some ear drops can damage the inner ear (ototoxicity), hence otoscopy first, drugs second.",
    source: null, verified: false
  },
  {
    id: "g-elodont",
    term: "elodontyczne", termEn: "elodont",
    forms: ["elodontycznych", "elodontycznego", "elodontyczne"],
    simplePl: "Zęby, które rosną przez całe życie - tak królik ma zęby tnące i trzonowe. Gdy się nie ścierają, powstaje malokluzja.",
    fullPl: "Zęby elodontyczne rosną przez całe życie zwierzęcia (królik, gryzoń), w przeciwieństwie do zębów psa i kota. Gdy nie ścierają się prawidłowo (brak siana, złe ułożenie), przerastają i powodują malokluzję - ból i trudności w jedzeniu.",
    simpleEn: "Teeth that grow throughout life — a rabbit's incisors and molars are like this. When they don't wear down, malocclusion results.",
    fullEn: "Elodont teeth grow throughout the animal's life (rabbit, rodent), unlike dog and cat teeth. When they don't wear properly (no hay, misalignment), they overgrow and cause malocclusion — pain and difficulty eating.",
    source: "https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/disorders-of-rabbits",
    verified: true
  }
  ,
  {
    id: "g-protozoan", term: "pierwotniak", termEn: "protozoan",
    forms: ["pierwotniaki","pierwotniaków","pierwotniaka","pierwotniakiem","piroplazmy","piroplazma","piroplazmą","piroplazm"],
    simplePl: "Jednokomórkowy organizm zwierzęcy; niektóre są pasożytami (np. Babesia we krwi).",
    simpleEn: "A single-celled animal organism; some are parasites (e.g. Babesia in the blood).",
    fullPl: "Pierwotniaki (Protozoa) to jednokomórkowe organizmy eukariotyczne; wiele gatunków żyje jako pasożyty u zwierząt. Babesia to pierwotniak wewnątrzkomórkowy niszczący erytrocyty - inne leki niż antybiotyk (imidokarb).",
    fullEn: "Protozoa are single-celled eukaryotic organisms; many species live as parasites in animals. Babesia is an intracellular protozoan that destroys erythrocytes — requiring a different drug than an antibiotic (imidocarb).",
    source: null, verified: false
  },
  {
    id: "g-anemia", term: "anemia", termEn: "anemia",
    forms: ["anemii","anemią","anemie","anemii","niedokrwistość"],
    simplePl: "Zbyt mało czerwonych krwinek lub hemoglobiny - blade śluzówki, słabość.",
    simpleEn: "Too few red blood cells or hemoglobin — pale mucous membranes, weakness.",
    fullPl: "Anemia (niedokrwistość) to stan, w którym krew ma za mało erytrocytów lub hemoglobiny, by przenieść wystarczająco dużo tlenu. W babeszjozie powstaje hemolitycznie - pierwotniak niszczy krwinki; objawem są blade śluzówki i osowiałość.",
    fullEn: "Anemia is a state in which the blood has too few erythrocytes or hemoglobin to carry enough oxygen. In babesiosis it is hemolytic — the protozoan destroys red cells; pale mucous membranes and lethargy follow.",
    source: null, verified: false
  },
  {
    id: "g-fluorescein", term: "fluoresceina", termEn: "fluorescein",
    forms: ["fluoresceiną","fluoresceiny","fluoresceinę","fluoresceinowy","fluorescein"],
    simplePl: "Barwnik, który wybarwia uszkodzoną rogówkę oka na zielono - test na owrzodzenia.",
    simpleEn: "A dye that stains damaged cornea green — a test for ulcers.",
    fullPl: "Fluoresceina to barwnik stosowany w okulistyce weterynaryjnej: kropla na oko wybarwia uszkodzoną (pozbawioną nabłonka) rogówkę na zielono, ujawniając owrzodzenia i zadrapania niewidoczne gołym okiem. Podstawa badania oka przy katarze kocim.",
    fullEn: "Fluorescein is a dye used in veterinary ophthalmology: a drop on the eye stains damaged (epithelium-denuded) cornea green, revealing ulcers and abrasions invisible to the naked eye. A mainstay of eye exam in feline viral rhinotracheitis.",
    source: null, verified: false
  },
  {
    id: "g-struvite", term: "struwit", termEn: "struvite",
    forms: ["struwitu","struwitem","struwity","struwitów","struwitowa","struwitowe"],
    simplePl: "Kryształ w moczu (fosforan amonowo-magnezowy); częsty u kotów, może tworzyć kamienie.",
    simpleEn: "A crystal in urine (magnesium ammonium phosphate); common in cats, can form stones.",
    fullPl: "Struwit (fosforan amonowo-magnezowy, MgNH4PO4) to najczęstszy rodzaj kryształów i kamieni moczowych u kota. Tworzy się w zasadowym, skoncentrowanym moczu - dlatego mokra karma i więcej wody rozcieńczają mocz i zapobiegają kamicy struwitowej.",
    fullEn: "Struvite (magnesium ammonium phosphate, MgNH4PO4) is the most common type of urinary crystal and stone in the cat. It forms in alkaline, concentrated urine — hence wet food and more water dilute the urine and prevent struvite urolithiasis.",
    source: null, verified: false
  },
  {
    id: "g-hematuria", term: "hematuria", termEn: "hematuria",
    forms: ["hematurii","hematurią","krwinkomocz","krwinkomoczu"],
    simplePl: "Krew w moczu - objaw, nie diagnoza; może być bez infekcji (sterylne zapalenie pęcherza).",
    simpleEn: "Blood in the urine — a sign, not a diagnosis; can be without infection (FIC).",
    fullPl: "Hematuria (krwinkomocz) to obecność krwinek czerwonych w moczu. W kocim sterylnym zapaleniu pęcherza krew pochodzi z podrażnionej, sterylnej śluzówki pęcherza - bez bakterii, więc antybiotyk nie jest wskazany. Badanie moczu rozróżnia krew od infekcji.",
    fullEn: "Hematuria is the presence of red blood cells in the urine. In feline FIC the blood comes from an irritated, sterile bladder mucosa — without bacteria, so an antibiotic is not indicated. Urinalysis tells blood apart from infection.",
    source: null, verified: false
  },
  {
    id: "g-tick", term: "kleszcz", termEn: "tick",
    forms: ["kleszcze","kleszczy","kleszcza","kleszczem","kleszczu","kleszczowa","kleszczowy","kleszczowe"],
    simplePl: "Stawonóg, który przyczepia się do skóry i przenosi choroby (Babesia, Lyme).",
    simpleEn: "An arthropod that attaches to skin and transmits diseases (Babesia, Lyme).",
    fullPl: "Kleszcz to stawonóg (pajęczak) żywiący się krwią; podczas wkłucia przekazuje ze śliną patogeny - pierwotniaka Babesia (babeszjoza), bakterie Borrelia (borelioza), anaplazmę. Dlatego prewencja kleszczowa i szybkie usuwanie są kluczowe u psa.",
    fullEn: "A tick is a blood-feeding arachnid; during the bite it transmits pathogens in saliva — the Babesia protozoan (babesiosis), Borrelia bacteria (Lyme disease), anaplasmae. Hence tick prevention and prompt removal are key in the dog.",
    source: null, verified: false
  },
  {
    id: "g-herpesvirus", term: "herpeswirus", termEn: "herpesvirus",
    forms: ["herpeswirusa","herpeswirusy","herpeswirusów","herpeswirusowy","herpeswirusowa","herpeswirusa kota","herpeswirusiem","herpeswirusiem kota","herpeswirusu"],
    simplePl: "Grupa wirusów; herpeswirus kota (FHV-1) wywołuje katar koci - antybiotyk nie działa.",
    simpleEn: "A group of viruses; feline herpesvirus (FHV-1) causes feline viral rhinotracheitis — antibiotics do not work.",
    fullPl: "Herpeswirusy to rodzina wirusów; herpeswirus kota typu 1 (FHV-1) jest główną przyczyną kataru kociego (wirusowego zapalenia górnych dróg oddechowych i spojówek). Jak każdy wirus nie reaguje na antybiotyk - leczenie jest wspomagające, a antybiotyk wchodzi w grę dopiero przy wtórnym nadkażeniu bakteryjnym.",
    fullEn: "Herpesviruses are a family of viruses; feline herpesvirus 1 (FHV-1) is the main cause of feline viral rhinotracheitis (viral upper respiratory and conjunctival inflammation). Like any virus it does not respond to antibiotic — treatment is supportive, and an antibiotic enters only with a secondary bacterial infection.",
    source: null, verified: false
  },
  {
    id: "g-capillary-refill", term: "czas nawrotu kapilarnego", termEn: "capillary refill time",
    forms: ["czasu nawrotu kapilarnego","czasem nawrotu kapilarnego","nawrotu kapilarnego","CRT"],
    simplePl: "Czas, w jaki blaknie i wraca kolor błony śluzowej po naciśnięciu - mierzy perfuzję (dotlenienie tkanek).",
    simpleEn: "The time the mucous membrane takes to blanch and regain colour after pressure — it measures perfusion (tissue oxygenation).",
    fullPl: "Czas nawrotu kapilarnego (CRT, capillary refill time) to prosta próba perfuzji: naciskasz palcem na dziąsło (lub wargę), zwalniasz i liczysz, po ilu sekundach różowy kolor wraca. Prawidłowo poniżej 2 sekund. Wydłużony (powyżej 2–3 s) lub brak nawrotu oznacza słabe dotlenienie tkanek - najczęściej z powodu odwodnienia, wstrząsu, anemii lub niewydolności krążenia. Szybki, darmowy wskaźnik stanu pacjenta używany w badaniu ogólnym.",
    fullEn: "Capillary refill time (CRT) is a simple perfusion test: you press a finger on the gum (or lip), release and count the seconds until the pink colour returns. Normal is under 2 seconds. A prolonged refill (over 2–3 s) or absent refill means poor tissue oxygenation — most often from dehydration, shock, anemia or circulatory failure. A fast, free bedside indicator of the patient's status used in the physical exam.",
    source: null, verified: false
  },
  {
    id: "g-conservative-tx", term: "leczenie zachowawcze", termEn: "conservative treatment",
    forms: ["leczenia zachowawczego","leczeniu zachowawczym","leczeniem zachowawczym"],
    simplePl: "Leczenie bez operacji - lek, opatrunek, odpoczynek; stosowane, gdy nie trzeba operować.",
    simpleEn: "Treatment without surgery — drugs, dressings, rest; used when an operation is not needed.",
    fullPl: "Leczenie zachowawcze to postępowanie bez interwencji chirurgicznej: leki, opatrunek usztywniający, odpoczynek, przeciwbólowe. Stosuje się je, gdy problem da się rozwiązać bez operacji - np. złamanie stabilne można unieruchomić szyną, zamiast operować. Przeciwieństwem jest leczenie operacyjne. Wybór zależy od charakteru urazu lub choroby.",
    fullEn: "Conservative treatment is management without surgery: drugs, a stabilising bandage, rest, analgesia. It is used when the problem can be solved without an operation — e.g. a stable fracture can be splinted rather than operated. The opposite is surgical treatment. The choice depends on the nature of the injury or disease.",
    source: null, verified: false
  },
  {
    id: "g-femur", term: "kość udowa", termEn: "femur",
    forms: ["kości udowej","kości udowe","kości udowych","kością udową","udowej"],
    simplePl: "Najdłuższa kość uda; jej złamanie wymaga stabilizacji (szyna lub operacja).",
    simpleEn: "The longest thigh bone; its fracture needs stabilisation (splint or surgery).",
    fullPl: "Kość udowa (femur) to najsilniejsza i najdłuższa kość kończyny tylnej psa i kota. Złamanie kości udowej często jest przemieszczające (odłamy rozsuwane przez mięśnie) i wymaga stabilizacji operacyjnej (osteosynteza: płytki, szpikulce) lub, w wybranych przypadkach, unieruchomienia zachowawczego. Urazy kości udowej powstają w wyniku potrącenia lub upadku z wysokości.",
    fullEn: "The femur is the strongest and longest bone of the hindlimb in dogs and cats. A femoral fracture is often displaced (fragments pulled apart by muscles) and needs surgical stabilisation (osteosynthesis: plates, intramedullary pins) or, in selected cases, conservative immobilisation. Femur injuries result from being hit by a car or a fall from a height.",
    source: null, verified: false
  },
  {
    id: "g-conjunctivitis", term: "zapalenie spojówek", termEn: "conjunctivitis",
    forms: ["zapaleniem spojówek","zapalenia spojówek","spojówek","spojówki","spojówkami"],
    simplePl: "Zaczerwienienie i obrzęk błony wyściełającej oko (spojówki) - często przy katarze kocim.",
    simpleEn: "Redness and swelling of the membrane lining the eye (conjunctiva) — common in feline viral rhinotracheitis.",
    fullPl: "Zapalenie spojówek to stan zapalny cienkiej błony pokrywającej wnętrze powiek i białko oka (spojówki). Objawia się zaczerwienieniem, obrzękiem i wyciekiem. U kota często towarzyszy katarowi kocemu (FHV-1) i wchodzi w jego obraz; badanie okulistyczne rozstrzyga, czy obok zapalenia spojówek są owrzodzenia rogówki.",
    fullEn: "Conjunctivitis is inflammation of the thin membrane covering the inner eyelids and the white of the eye (conjunctiva). It presents with redness, swelling and discharge. In cats it often accompanies feline viral rhinotracheitis (FHV-1) and is part of its picture; an eye exam settles whether corneal ulcers accompany the conjunctivitis.",
    source: null, verified: false
  },
  {
    id: "g-corneal-ulcer", term: "owrzodzenie rogówki", termEn: "corneal ulcer",
    forms: ["owrzodzenia rogówki","owrzodzeniem rogówki","owrzodzeniami rogówki","owrzodzeń rogówki","owrzodzenia dendrytyczne"],
    simplePl: "Uszkodzenie nabłonka rogówki - barwi się fluoresceiną; u kota typowe dla FHV-1.",
    simpleEn: "A defect of the corneal epithelium — it stains with fluorescein; in cats typical of FHV-1.",
    fullPl: "Owrzodzenie rogówki to ubytek nabłonka rogówki (przezroczystej przedniej warstwy oka). Wykrywa je test fluoresceinowy: barwnik wsiąka w uszkodzony nabłonek i świeci na zielono. U kota dendrytyczne (gałęziaste) owrzodzenia rogówki są patognomoniczne dla herpeswirusa kota (FHV-1). Nieleczone mogą zagrażać wzrokowi, dlatego badanie okulistyczne jest kluczowe przy katarze kocim.",
    fullEn: "A corneal ulcer is a defect of the corneal epithelium (the clear front layer of the eye). It is detected by the fluorescein test: the dye pools in the damaged epithelium and glows green. In cats dendritic (branching) corneal ulcers are pathognomonic for feline herpesvirus (FHV-1). Untreated they can threaten sight, which is why an eye exam is key in feline viral rhinotracheitis.",
    source: null, verified: false
  },
  {
    id: "g-ph", term: "pH", termEn: "pH",
    forms: ["pH"],
    simplePl: "Pokazuje, jak kwaśne lub zasadowe jest coś - na przykład mocz. 7 to obojętne, poniżej kwaśne, powyżej zasadowe.",
    fullPl: "pH to skala od 0 do 14 określająca kwasowość roztworu: 7 to odczyn obojętny, poniżej 7 kwaśny, powyżej 7 zasadowy. W weterynarii najczęściej mierzy się pH moczu: u zdrowego kota mocz jest lekko kwaśny (ok. 6,0-6,5). Kryształy struwitu tworzą się w moczu zasadowym, dlatego dieta moczowa zakwasza mocz, by je rozpuścić. pH krwi utrzymuje się w wąskim zakresie 7,35-7,45 - jego przekroczenie zagraża życiu.",
    simpleEn: "Measures how acidic or alkaline something is - like urine. 7 is neutral, below is acidic, above is alkaline.",
    fullEn: "pH is a 0-14 scale of acidity: 7 is neutral, below 7 acidic, above 7 alkaline. In veterinary medicine urine pH is measured: in healthy cats it is slightly acidic (around 6.0-6.5). Struvite crystals form in alkaline urine, so a urinary diet acidifies the urine to dissolve them. Blood pH stays in a narrow 7.35-7.45 range - leaving it threatens life.",
    source: null, verified: false
  },
  {
    id: "g-mange",
    term: "świerzbowica", termEn: "mange",
    forms: ["świerzbowicy", "świerzbowicą", "świerzbowice", "świerzbowicę"],
    simplePl: "Choroba skóry wywołana przez roztocza - powoduje świąd, łysienie i strupy; leczy się lekiem przeciwpasożytniczym, nie antybiotykiem.",
    fullPl: "Świerzbowica to pasożytnicza choroba skóry wywołana przez roztocza (np. Trixacarus u świnki, Sarcoptes u psa, Demodex). Roztocza drążą naskórek i wywołują nasilony świąd; diagnozuje się ją zeskrobinami skórnymi pod mikroskopem. Leczy się lekiem przeciwpasożytniczym (selamektyna, iwermektyna), a nie antybiotykiem - roztocza to pasożyty, nie bakterie.",
    simpleEn: "A skin disease caused by mites — it causes itching, hair loss and crusts; it is treated with an antiparasitic, not an antibiotic.",
    fullEn: "Mange is a parasitic skin disease caused by mites (e.g. Trixacarus in the guinea pig, Sarcoptes in the dog, Demodex). The mites burrow into the epidermis and cause intense itching; it is diagnosed with a skin scrape under the microscope. It is treated with an antiparasitic (selamectin, ivermectin), not an antibiotic — mites are parasites, not bacteria.",
    source: null, verified: false
  },
  {
    id: "g-skin-scrape",
    term: "zeskrobiny skórne", termEn: "skin scrape",
    forms: ["zeskrobin", "zeskrobiny", "zeskrobinami", "zeskrobinach", "zeskrobinę"],
    simplePl: "Badanie, w którym zeskrobuje się płytko naskórek i ogląda pod mikroskopem, by znaleźć roztocza lub grzyby.",
    fullPl: "Zeskrobiny skórne to mikroskopowe badanie naskórka: ostrym narzędziem zeskrobuje się płytko zmienioną skórę, rozprasza próbkę na szkiełku z kroplą oleju i ogląda pod mikroskopem. Wykrywa roztocza (Trixacarus, Demodex, Sarcoptes) i grzyby. To badanie pierwszej linii przy świądzie i łysieniu, bo rozstrzyga, czy to pasożyty, grzybica czy alergia - a to trzy różne leczenia.",
    simpleEn: "A test in which a thin layer of epidermis is scraped and examined under the microscope to find mites or fungi.",
    fullEn: "A skin scrape is a microscopic exam of the epidermis: a sharp instrument lightly scrapes the affected skin, the sample is dispersed on a slide with a drop of oil and examined under the microscope. It detects mites (Trixacarus, Demodex, Sarcoptes) and fungi. It is a first-line test for itching and hair loss because it settles whether the cause is parasites, ringworm or allergy — and these are three different treatments.",
    source: null, verified: false
  },
  {
    id: "g-mites",
    term: "roztocza", termEn: "mites",
    forms: ["roztocz", "roztoczom", "roztoczami", "roztoczy", "roztocza"],
    simplePl: "Drobne pajęczaki żyjące na skórze; niektóre wywołują świerzbowicę. Gołym okiem ich nie widać.",
    fullPl: "Roztocza to drobne pajęczaki (spokrewnione z pająkami, nie z owadami); wiele gatunków żyje na skórze zwierząt. Pasożytnicze roztocza jak Trixacarus (świnka), Sarcoptes (pies, świerzbowica) czy Demodex drążą naskórek i wywołują świąd oraz łysienie. Są mikroskopijne - widoczne dopiero pod mikroskopem w zeskrobinach. Leczy się je lekiem przeciwpasożytniczym, nie antybiotykiem.",
    simpleEn: "Tiny arachnids living on the skin; some cause mange. They cannot be seen with the naked eye.",
    fullEn: "Mites are tiny arachnids (related to spiders, not insects); many species live on animal skin. Parasitic mites such as Trixacarus (guinea pig), Sarcoptes (dog, scabies) and Demodex burrow into the epidermis and cause itching and hair loss. They are microscopic — visible only under the microscope in skin scrapings. They are treated with an antiparasitic, not an antibiotic.",
    source: null, verified: false
  },
  {
    id: "g-wet-tail",
    term: "choroba mokrego ogona", termEn: "wet tail",
    forms: ["choroba mokrego ogona", "chorobę mokrego ogona", "choroby mokrego ogona", "ciekły chomik", "wet tail", "wet-tail"],
    simplePl: "Ostra, często śmiertelna biegunka młodych chomików syryjskich; bakteryjna - leczy się antybiotykiem i płynami.",
    fullPl: "Choroba mokrego ogona, nazywana też potocznie ciekłym chomikiem, to ostra, wodnista biegunka młodych, zestresowanych chomików syryjskich, wywołana przez bakterię Lawsonia intracellularis atakującą jelito cienkie (przerostowe zapalenie jelita krętego). Postępuje błyskawicznie - bez antybiotyku (enrofloksacyna) i płynów chomik ginie w 24-48 godzin. Tu antybiotyk jest wskazany i ratuje życie, co kontrastuje z chorobami, gdzie antybiotyk szkodzi (FIC, katar koci).",
    simpleEn: "An acute, often fatal diarrhea of young Syrian hamsters; it is bacterial — treated with an antibiotic and fluids.",
    fullEn: "Wet tail is an acute, watery diarrhea of young, stressed Syrian hamsters caused by the bacterium Lawsonia intracellularis attacking the small intestine (proliferative ileitis). It progresses rapidly — without an antibiotic (enrofloxacin) and fluids the hamster dies in 24-48 hours. Here the antibiotic is indicated and life-saving, in contrast with diseases where an antibiotic harms (FIC, feline cold).",
    source: null, verified: false
  },
  {
    id: "g-vitamin-c",
    term: "witamina C", termEn: "vitamin C",
    forms: ["witaminy C", "witaminą C", "witaminie C", "witaminę C"],
    simplePl: "Witamina, której świnka morska (jak człowiek) nie potrafi sama wytwarzać - musi ją dostawać z pokarmu, inaczej choruje na szkorbut.",
    fullPl: "Większość ssaków syntezuje witaminę C w wątrobie, lecz świnka morska (jak człowiek i niektóre naczelne) tego nie potrafi - musi dostawać ją z diety. Jej brak to szkorbut: osłabienie, krwawienia z dziąseł i złe gojenie ran. Dlatego karma dla świnki morskiej musi zawierać witaminę C, a karma dla królika czy chomika nie wystarczy - to ważny powód, by nie podawać karmy króliczej śwince.",
    simpleEn: "A vitamin that the guinea pig (like humans) cannot make itself — it must get it from food, otherwise it develops scurvy.",
    fullEn: "Most mammals synthesize vitamin C in the liver, but the guinea pig (like humans and some primates) cannot — it must obtain it from the diet. Its lack causes scurvy: weakness, bleeding gums and poor wound healing. So guinea pig food must contain vitamin C, and rabbit or hamster food does not suffice — an important reason not to feed rabbit food to a guinea pig.",
    source: null, verified: false
  },
  {
    id: "g-lawsonia",
    term: "Lawsonia", termEn: "Lawsonia",
    forms: ["Lawsonii", "Lawsonią", "Lawsonie"],
    simplePl: "Bakteria atakująca jelito cienkie chomika i wywołująca chorobę mokrego ogona - ostrą, śmiertelną biegunkę.",
    fullPl: "Lawsonia intracellularis to bakteria wewnątrzkomórkowa atakująca jelito cienkie; u młodych chomików syryjskich wywołuje przerostowe zapalenie jelita krętego (chorobę mokrego ogona) - nagłą, wodnistą biegunkę. Stres (odstąpienie od matki, przeprowadzka) otwiera jej drogę. Leczy się ją antybiotykiem (enrofloksacyna) i płynami - tu antybiotyk jest wskazany, bo infekcja jest potwierdzona i bez leczenia zabija.",
    simpleEn: "A bacterium that attacks the hamster's small intestine and causes wet tail — an acute, fatal diarrhea.",
    fullEn: "Lawsonia intracellularis is an intracellular bacterium attacking the small intestine; in young Syrian hamsters it causes proliferative ileitis (wet tail) — sudden, watery diarrhea. Stress (weaning, moving) opens the door to it. It is treated with an antibiotic (enrofloxacin) and fluids — here the antibiotic is indicated, because the infection is confirmed and kills without treatment.",
    source: null, verified: false
  },
{
      "id": "g-enterotomy",
      "term": "enterotomia",
      "termEn": "enterotomy",
      "forms": [
        "enterotomii",
        "enterotomią",
        "enterotomie"
      ],
      "simplePl": "Operacyjne otwarcie jelita, by usunąć ciało obce, a potem zszycie ściany.",
      "fullPl": "Enterotomia to zabieg chirurgiczny polegający na nacięciu ściany jelita w celu usunięcia ciała obcego (zabawki, kości, skarpety), a następnie zszyciu ściany jelitowej. Wymaga narkozy i aseptyki. Jest jedynym leczeniem kuracyjnym mechanicznej obturacji jelita — same leki nie usuwają przeszkody. Ryzyko to dehisencja szwu i zapalenie otrzewnej.",
      "simpleEn": "Surgically opening the intestine to remove a foreign body, then suturing the wall.",
      "fullEn": "Enterotomy is a surgical procedure involving incision of the intestinal wall to remove a foreign body (toy, bone, sock), followed by suturing the intestinal wall. It requires anesthesia and asepsis. It is the only curative treatment for mechanical intestinal obstruction — drugs alone do not remove the blockage. Risks include suture dehiscence and peritonitis.",
      "source": null,
      "verified": false
    },
{
      "id": "g-obturation",
      "term": "obturacja",
      "termEn": "obstruction",
      "forms": [
        "obturacji",
        "obturacją",
        "obturacje",
        "obturacjach"
      ],
      "simplePl": "Mechaniczne zablokowanie światła jelita przez ciało obce — treść nie przechodzi.",
      "fullPl": "Obturacja to mechaniczne zamknięcie światła przewodu pokarmowego przez ciało obce (zabawkę, kość, skarpetę), które zatrzymuje pasaż treści pokarmowej. Powyżej przeszkody jelito rozszerza się, gromadząc płyn i gaz, a poniżej opróżnia się. Bez usunięcia przeszkody jelito niedokrwione obumiera, prowadząc do zapalenia otrzewnej. To stan nagły.",
      "simpleEn": "Mechanical blockage of the intestinal lumen by a foreign body — contents cannot pass.",
      "fullEn": "Obstruction is the mechanical closure of the gastrointestinal lumen by a foreign body (toy, bone, sock), which halts the passage of intestinal contents. Above the blockage the intestine distends, accumulating fluid and gas; below it empties. Without removing the blockage, the ischemic intestine dies, leading to peritonitis. This is an emergency.",
      "source": null,
      "verified": false
    },
{
      "id": "g-pica",
      "term": "pika",
      "termEn": "pica",
      "forms": [
        "piki",
        "piką",
        "pikę"
      ],
      "simplePl": "Zaburzenie polegające na zjadaniu rzeczy niejadalnych — u psów: zabawki, skarpetki, kamienie.",
      "fullPl": "Pika to zaburzenie zachowania polegające na chętnym połykaniu przedmiotów niejadalnych. U psów objawia się zjadaniem zabawek, skarpetek, kamieni, kawałków drewna — szczególnie u młodych i aktywnych ras, jak beagle czy labrador. Skutkiem są ciała obce w przewodzie pokarmowym i obturacja. Leczenie to zapobieganie: odpowiednie zabawki, nadzór, a u psów o silnej pice — miski na karmę z zabawką, by zaspokoić potrzebę żucia bez ryzyka.",
      "simpleEn": "A behavioral disorder of eating non-food items — in dogs: toys, socks, stones.",
      "fullEn": "Pica is a behavioral disorder consisting of the compulsive swallowing of non-food objects. In dogs it manifests as eating toys, socks, stones, pieces of wood — especially in young and active breeds like beagles or labradors. The consequence is gastrointestinal foreign bodies and obstruction. Treatment is prevention: appropriate toys, supervision, and for dogs with strong pica — puzzle feeders to satisfy the need to chew without risk.",
      "source": null,
      "verified": false
    },
{
      "id": "g-metaldehyd",
      "term": "metaldehyd",
      "termEn": "metaldehyde",
      "forms": [
        "metaldehydu",
        "metaldehydem",
        "metaldehydow"
      ],
      "simplePl": "Składnik trutki na ślimaki — silnie toksyczny dla psów i kotów, nie ma odtrutki. Powoduje drgnienia i drgawki.",
      "fullPl": "Metaldehyd to związek używany w trutkach na ślimaki i ślimaczki. U zwierząt domowych (psy, koty) wywołuje silne zatrucie: ślinotok, niepokój, drgnienia mięśniowe, a następnie drgawki i hipertermię. Nie istnieje odtrutka. Leczenie to dekontaminacja (wywołanie wymiotów, gdy niedawne i bezobjawowe) oraz wsparcie (płyny, chłodzenie). Kluczowa lekcja: kot nie jest małym psem — inny lek wymiotny (agonista alfa-2, nie apomorfina).",
      "simpleEn": "The active ingredient in slug bait — highly toxic to dogs and cats, with no antidote. Causes tremors and seizures.",
      "fullEn": "Metaldehyde is a compound used in slug and snail baits. In domestic animals (dogs, cats) it causes severe poisoning: salivation, anxiety, muscle tremors, then seizures and hyperthermia. There is no antidote. Treatment is decontamination (inducing emesis if recent and asymptomatic) and support (fluids, cooling). Key lesson: a cat is not a small dog — different emetic (alpha-2 agonist, not apomorphine).",
      "source": null,
      "verified": false
    },
{
      "id": "g-emeza",
      "term": "emeza",
      "termEn": "emesis",
      "forms": [
        "emezy",
        "emezą",
        "emezę"
      ],
      "simplePl": "Wywołanie wymiotów jako dekontaminacja — gdy trucizna niedawno połknięta i pacjent bez objawów. U kota inny lek niż u psa.",
      "fullPl": "Emeza to medyczne wywołanie wymiotów w celu usunięcia trucizny z żołądka. Wskazana, gdy spożycie było niedawne (<1–2 h) i pacjent jest bezobjawowy (bez drgnieć, bez objawów neurologicznych). Przeciwwskazana, gdy objawy już wystąpiły (ryzyko zachłyśnięcia) lub gdy toksyna jest żrąca. Różnica gatunkowa: u psa apomorfina, u kota agonista alfa-2 (ksylazyna, deksmedetomidyna) — apomorfina u kota jest nieskuteczna lub niebezpieczna.",
      "simpleEn": "Inducing vomiting as decontamination — when toxin was recently ingested and patient is asymptomatic. In cats a different drug than in dogs.",
      "fullEn": "Emesis is medically induced vomiting to remove a toxin from the stomach. Indicated when ingestion was recent (<1–2 h) and the patient is asymptomatic (no tremors, no neurological signs). Contraindicated when symptoms are already present (aspiration risk) or when the toxin is corrosive. Species difference: in dogs apomorphine, in cats an alpha-2 agonist (xylazine, dexmedetomidine) — apomorphine in cats is ineffective or dangerous.",
      "source": null,
      "verified": false
    },
{
      "id": "g-dekontaminacja",
      "term": "dekontaminacja",
      "termEn": "decontamination",
      "forms": [
        "dekontaminacji",
        "dekontaminacją",
        "dekontaminacje"
      ],
      "simplePl": "Usunięcie trucizny z organizmu — wywołanie wymiotów, płukanie żołądka, węgiel aktywny. Im szybciej, tym lepiej.",
      "fullPl": "Dekontaminacja to zbiór działań mających usunąć truciznę z organizmu, zanim się wchłonie: wywołanie wymiotów (emeza), płukanie żołądka, węgiel aktywny (ograniczona skuteczność przy metaldehydzie). Kluczowa zasada: czas jest lekiem — im wcześniej, tym skuteczniej. Gdy trucizna się wchłonie, dekontaminacja jest już bezcelowa i leczenie przechodzi na wsparcie (płyny, chłodzenie, kontrola drgawek).",
      "simpleEn": "Removing a toxin from the body — inducing vomiting, gastric lavage, activated charcoal. The sooner, the better.",
      "fullEn": "Decontamination is a set of measures to remove a toxin from the body before it is absorbed: inducing emesis, gastric lavage, activated charcoal (limited efficacy for metaldehyde). The key principle: time is the medicine — the earlier, the more effective. Once the toxin is absorbed, decontamination is futile and treatment shifts to support (fluids, cooling, seizure control).",
      "source": null,
      "verified": false
    },
{
      "id": "g-knemidokoptes",
      "term": "Knemidokoptes",
      "termEn": "Knemidokoptes",
      "forms": [
        "Knemidokoptesów",
        "Knemidokoptesem",
        "Knemidokoptesowi"
      ],
      "simplePl": "Roztocz drąży naskórek dzioba papug i wywołuje świerzb twarzowy — łuskowaty przerost dzioba o strukturze plastra miodu.",
      "fullPl": "Knemidokoptes pilae to roztocz drąży naskórek dzioba, woskówki i stóp papużek falistych i innych papug. Jego aktywność tworzy charakterystyczne suche, porowate skorupki o strukturze plastra miodu, a dziób rośnie krzywo. Zakażenie jest przewlekłe i postępuje powoli, ale bez leczenia deformuje dziób i utrudnia jedzenie. Leczy się je lekiem przeciwpasożytniczym (iwermektyna), a nie spiłowaniem ani antybiotykiem — to pasożyt, nie bakteria.",
      "simpleEn": "A mite that burrows into a parrot's beak skin and causes scaly face — crusty, honeycomb-like beak overgrowth.",
      "fullEn": "Knemidokoptes pilae is a mite that burrows into the epidermis of the beak, cere and feet of budgerigars and other parrots. Its activity produces characteristic dry, porous, honeycomb-textured crusts, and the beak grows crooked. The infestation is chronic and progresses slowly, but without treatment it deforms the beak and hinders eating. It is treated with an antiparasitic (ivermectin), not with trimming or an antibiotic — it is a parasite, not a bacterium.",
      "source": null,
      "verified": false
    },
{
      "id": "g-iwermektyna",
      "term": "iwermektyna",
      "termEn": "ivermectin",
      "forms": [
        "iwermektyny",
        "iwermektyną",
        "iwermektynie"
      ],
      "simplePl": "Lek przeciwpasożytniczy na roztocza i nicienie — u ptaków jedna kropla spot-on na kark.",
      "fullPl": "Iwermektyna to lek z grupy makrocyklicznych laktonów, działający na roztocza (Knemidokoptes, Sarcoptes) i nicienie. U ptaków podaje się ją jako spot-on — jedna kropla na skórę karku — i powtarza po 2 tygodniach, by złapać roztocza wylęgnięte z jaj. Ma szeroki margines bezpieczeństwa. Nie jest antybiotykiem — jej celem są pasożyty, nie bakterie, więc nie napędza oporności (AMR).",
      "simpleEn": "An antiparasitic drug against mites and nematodes — in birds, one spot-on drop on the neck.",
      "fullEn": "Ivermectin is a drug from the macrocyclic lactone class, acting on mites (Knemidokoptes, Sarcoptes) and nematodes. In birds it is given as a spot-on — one drop on nape skin — and repeated after 2 weeks to catch mites hatched from eggs. It has a wide safety margin. It is not an antibiotic — its targets are parasites, not bacteria, so it does not drive resistance (AMR).",
      "source": null,
      "verified": false
    },
{
      "id": "g-dziob",
      "term": "dziób",
      "termEn": "beak",
      "forms": [
        "dzioba",
        "dziobem",
        "dzioby",
        "dziobów"
      ],
      "simplePl": "Zrośnięty dziób ptaka z keratyny — u niektórych gatunków rośnie przez całe życie i wymaga ścierania lub spiłowania.",
      "fullPl": "Dziób ptaka to struktura z rogówki i keratyny, która u wielu gatunków (w tym papug) rośnie przez całe życie — jak zęby elodontyczne u gryzoni. W warunkach naturalnych ściera się jedzeniem i zabawą, ale w niewoli, przy niewłaściwej diecie lub chorobie (roztocza), przerośnie i wymaga spiłowania. Przerost rzadko jest „tylko mechaniczny” — najczęściej za nim stoi świerzb (Knemidokoptes) lub niedobór pokarmowy.",
      "simpleEn": "A bird's keratin beak — in some species it grows throughout life and requires wearing or trimming.",
      "fullEn": "A bird's beak is a structure of horn and keratin that in many species (including parrots) grows throughout life — like elodont teeth in rodents. In the wild it wears down through eating and play, but in captivity, with improper diet or disease (mites), it overgrows and needs trimming. Overgrowth is rarely “just mechanical” — most often it is driven by scaly face mites (Knemidokoptes) or a nutritional deficiency.",
      "source": null,
      "verified": false
    },
{
      "id": "g-zatrzymanie-jaja",
      "term": "zatrzymanie jaja",
      "termEn": "egg binding",
      "forms": [
        "zatrzymania jaja",
        "zatrzymaniem jaja",
        "zatrzymanie jaja"
      ],
      "simplePl": "Stan, w którym jajo utknęło w jajowodzie samicy ptaka i nie może zostać zniesione — zagraża życiu.",
      "fullPl": "Zatrzymanie jaja (dystocia) to stan nagły u samic ptaków, w którym jajo utknęło w jajowodzie. Najczęstsza przyczyna to hipokalcemia — niski wapń osłabia skurcze mięśni jajowodu. Leczenie zaczyna się od wapnia i wsparcia (ciepło, wilgoć, płyny), a operacja jest ostatecznością. Nigdy nie wyciągać jaja na siłę.",
      "simpleEn": "A condition in which an egg is stuck in a female bird's oviduct and cannot be laid — life-threatening.",
      "fullEn": "Egg binding (dystocia) is an emergency in female birds in which an egg is stuck in the oviduct. The most common cause is hypocalcemia — low calcium weakens the oviduct muscles. Treatment begins with calcium and support (warmth, humidity, fluids), and surgery is the last resort. The egg must never be pulled by force.",
      "source": null,
      "verified": false
    },
{
      "id": "g-hipokalcemia",
      "term": "hipokalcemia",
      "termEn": "hypocalcemia",
      "forms": [
        "hipokalcemii",
        "hipokalcemią",
        "hipokalcemie"
      ],
      "simplePl": "Niski poziom wapnia we krwi — osłabia skurcze mięśni, w tym jajowodu u ptaków.",
      "fullPl": "Hipokalcemia to niedobór wapnia we krwi, który osłabia skurcz mięśni gładkich. U samic ptaków oznacza, że jajowod nie ma siły wypchnąć jajo — i powstaje zatrzymanie jaja. Podanie wapnia często rozwiązuje problem bez operacji. Profilaktyka to wapń w diecie (kość morska, bloki mineralne).",
      "simpleEn": "Low blood calcium — weakens muscle contractions, including the oviduct in birds.",
      "fullEn": "Hypocalcemia is a deficiency of calcium in the blood that weakens smooth-muscle contractions. In female birds it means the oviduct lacks the force to push the egg out — and egg binding results. Giving calcium often resolves the problem without surgery. Prevention is dietary calcium (cuttlebone, mineral blocks).",
      "source": null,
      "verified": false
    },
{
      "id": "g-dystocia",
      "term": "dystocia",
      "termEn": "dystocia",
      "forms": [
        "dystocji",
        "dystocją",
        "dystocje"
      ],
      "simplePl": "Trudne znoszenie jaja lub poród — stan, w którym jajo lub młode utknęło.",
      "fullPl": "Dystocia to utrudnione znoszenie jaja u ptaków lub trudny poród u ssaków. U ptaków najczęściej oznacza zatrzymanie jaja — jajo utknęło w jajowodzie z powodu hipokalcemii lub wady anatomicznej. Leczenie jest schodkowe: wapń i wsparcie najpierw, pomoc ręczna, operacja na końcu.",
      "simpleEn": "Difficult egg-laying or birth — a condition in which the egg or young is stuck.",
      "fullEn": "Dystocia is difficult egg-laying in birds or difficult birth in mammals. In birds it most often means egg binding — the egg is stuck in the oviduct due to hypocalcemia or an anatomical defect. Treatment is stepwise: calcium and support first, manual assistance, surgery last.",
      "source": null,
      "verified": false
    },
  {
    "id": "g-insulinoma",
    "term": "insulinoma", termEn: "insulinoma",
    forms: ["insulinomu", "insulinomie", "insulinom"],
    simplePl: "Guz trzustki, który wydziela za dużo insuliny — cukier we krwi spada, zwierzę słabnie.",
    fullPl: "Insulinoma to guz komórek beta trzustki, które nieprzerwanie wydzielają insulinę niezależnie od poziomu glukozy. Efekt to hipoglikemia (niski cukier) — mózg głoduje, pojawia się osowiałość, drżenia, a wreszcie drgawki i utrata przytomności. Najczęstszy nowotwór fretki. Leczy się paliatywnie lekami podnoszącymi glukozę (prednizolon, diazoksyd); operacja to jedyna szansa na wyleczenie, ale bywa niemożliwa.",
    simpleEn: "A pancreatic tumor that secretes too much insulin — blood sugar drops, the animal weakens.",
    fullEn: "Insulinoma is a tumor of the beta cells of the pancreas that continuously secretes insulin regardless of glucose level. The result is hypoglycemia (low sugar) — the brain starves, with lethargy, tremors and finally seizures and collapse. The most common tumor in ferrets. It is managed palliatively with drugs that raise glucose (prednisolone, diazoxide); surgery is the only potential cure but is often not feasible.",
    "source": "https://en.wikipedia.org/wiki/Insulinoma",
    "verified": false
    },
  {
    "id": "g-hipoglikemia",
    "term": "hipoglikemia", termEn: "hypoglycemia",
    forms: ["hipoglikemię", "hipoglikemii"],
    simplePl: "Za niski poziom cukru we krwi — zwierzę słabnie, drży, może stracić przytomność.",
    fullPl: "Hipoglikemia to spadek glukozy we krwi poniżej normy. Mózg zależy od glukozy, więc jej brak daje objawy neurologiczne: osowiałość, ataksję, drżenia, ślinotok, a w skrajnych przypadkach drgawki i śpiączkę. U fretki najczęstszą przyczyną jest insulinoma; u innych zwierząt np. przedawkowanie insuliny lub głodówka. Pierwsza pomoc to podanie glukozy.",
    simpleEn: "Blood sugar too low — the animal weakens, trembles, may lose consciousness.",
    fullEn: "Hypoglycemia is a fall of blood glucose below normal. The brain depends on glucose, so its lack gives neurological signs: lethargy, ataxia, tremors, drooling, and in severe cases seizures and coma. In ferrets the most common cause is insulinoma; in other animals e.g. insulin overdose or fasting. First aid is giving glucose.",
    "source": "https://pl.wikipedia.org/wiki/Hipoglikemia",
    "verified": false
    },
  {
    "id": "g-prednisolone",
    "term": "prednizolon", termEn: "prednisolone",
    forms: ["prednizolonem", "prednizolonie", "prednizolonu"],
    simplePl: "Lek sterydowy, który m.in. podnosi cukier we krwi — dlatego pomaga przy insulinomie.",
    fullPl: "Prednizolon to glikokortykosteroid — steryd, który m.in. stymuluje glukoneogenezę (produkcję glukozy w wątrobie), podnosząc cukier we krwi. W insulinomie to lek pierwszego wyboru: zapobiega hipoglikemii, choć nie leczy guza. Długotrwale osłabia odporność i ma skutki uboczne, dlatego dawkę dobiera się do najmniejszej skutecznej.",
    simpleEn: "A steroid drug that, among other effects, raises blood sugar — that is why it helps in insulinoma.",
    fullEn: "Prednisolone is a glucocorticoid — a steroid that, among other effects, stimulates gluconeogenesis (glucose production in the liver), raising blood sugar. In insulinoma it is the first-line drug: it prevents hypoglycemia, though it does not cure the tumor. Long-term it weakens immunity and has side effects, so the dose is titrated to the lowest effective.",
    "source": "https://pl.wikipedia.org/wiki/Prednizolon",
    "verified": false
    },
  {
    "id": "g-diazoxide",
    "term": "diazoksyd", termEn: "diazoxide",
    forms: [],
    simplePl: "Lek hamujący uwalnianie insuliny — drugi wybór przy insulinomie, gdy prednizolon nie wystarcza.",
    fullPl: "Diazoksyd otwiera kanały potasowe w komórkach beta trzustki, co hamuje uwalnianie insuliny i tym samym podnosi glukozę we krwi. Stosuje się go w insulinomie, gdy prednizolon jest niewystarczający. Jest droższy i rzadziej pierwszego wyboru.",
    simpleEn: "A drug that inhibits insulin release — the second choice in insulinoma, when prednisolone is not enough.",
    fullEn: "Diazoxide opens potassium channels in the pancreatic beta cells, which inhibits insulin release and thereby raises blood glucose. It is used in insulinoma when prednisolone is insufficient. It is more expensive and rarely the first choice.",
    "source": "https://pl.wikipedia.org/wiki/Diazoksyd",
    "verified": false
    },
  {
    "id": "g-glukoneogeneza",
    "term": "glukoneogeneza", termEn: "gluconeogenesis",
    forms: ["glukoneogenezę", "glukoneogenezy"],
    simplePl: "Produkowanie glukozy w wątrobie z innych związków — sterydy to przyspieszają, więc podnoszą cukier.",
    fullPl: "Glukoneogeneza to synteza glukozy z niecukrowych prekursorów (np. aminokwasów) w wątrobie. Glikokortykosteroidy jak prednizolon stymulują ten szlak, dlatego podnoszą poziom glukozy we krwi — użyteczne w hipoglikemii insulinomu.",
    simpleEn: "Making glucose in the liver from other compounds — steroids speed this up, so they raise sugar.",
    fullEn: "Gluconeogenesis is the synthesis of glucose from non-sugar precursors (e.g. amino acids) in the liver. Glucocorticoids like prednisolone stimulate this pathway, which is why they raise blood glucose — useful in the hypoglycemia of insulinoma.",
    "source": "https://pl.wikipedia.org/wiki/Glukoneogeneza",
    "verified": false
    },
  {
    "id": "g-glukoza",
    "term": "glukoza", termEn: "glucose",
    forms: ["glukozę", "glukozy"],
    simplePl: "Cukier, który organizm zużywa na energię — zwłaszcza mózg.",
    fullPl: "Glukoza to podstawowy cukier, z którego organizm czerpie energię; mózg jest od niej całkowicie zależny. Jej poziom we krwi utrzymuje insulina (obniża) i glukagon oraz glukoneogeneza (podnoszą). Niedobór to hipoglikemia.",
    simpleEn: "The sugar the body burns for energy — especially the brain.",
    fullEn: "Glucose is the basic sugar the body burns for energy; the brain is entirely dependent on it. Its blood level is maintained by insulin (lowers) and glucagon plus gluconeogenesis (raise). Deficiency is hypoglycemia.",
    "source": "https://pl.wikipedia.org/wiki/Glukoza",
    "verified": false
    },
  {
    "id": "g-witamina-d3",
    "term": "witamina D3", termEn: "vitamin D3",
    forms: ["witaminy D3", "witaminę D3", "witaminie D3"],
    simplePl: "Witamina, która pozwala jelitom wchłaniać wapń — bez niej kości i pancerze miękną.",
    fullPl: "Witamina D3 (cholekalcyferol) umożliwia wchłanianie wapnia w jelicie. U gadów powstaje w skórze pod lampą UVB — bez UVB nie ma D3, bez D3 nie ma wchłaniania wapnia, więc kości i pancerz miękną (choroba metaboliczna kości). Suplementacja D3 zastępuje brak słońca/UVB.",
    simpleEn: "A vitamin that lets the gut absorb calcium — without it bones and shells soften.",
    fullEn: "Vitamin D3 (cholecalciferol) enables calcium absorption in the gut. In reptiles it is made in the skin under a UVB lamp — no UVB means no D3, no D3 means no calcium absorption, so bones and shell soften (metabolic bone disease). D3 supplementation substitutes for the lack of sun/UVB.",
    "source": "https://pl.wikipedia.org/wiki/Witamina_D",
    "verified": false
    },
  {
    "id": "g-cholekalcyferol",
    "term": "cholekalcyferol", termEn: "cholecalciferol",
    forms: [],
    simplePl: "Inna nazwa witaminy D3 — tej, która pozwala wchłaniać wapń.",
    fullPl: "Cholekalcyferol to chemiczna nazwa witaminy D3, powstającej w skórze pod promieniowaniem UVB. U gadów bez dostępu do słońca/UVB konieczna jest suplementacja.",
    simpleEn: "Another name for vitamin D3 — the one that lets the body absorb calcium.",
    fullEn: "Cholecalciferol is the chemical name of vitamin D3, made in the skin under UVB radiation. In reptiles without access to sun/UVB, supplementation is necessary.",
    "source": "https://pl.wikipedia.org/wiki/Witamina_D",
    "verified": false
    },
  {
    "id": "g-wapn",
    "term": "wapń", termEn: "calcium",
    forms: ["wapnia", "wapniem", "wapniu", "wapniowe", "wapniowy", "wapniowych"],
    simplePl: "Pierwiastek budujący kości i pancerze — przy jego braku miękną.",
    fullPl: "Wapń to minerał budujący kości, pancerze żółwi i muszle. Jego wchłanianie w jelicie zależy od witaminy D3, którą gady syntetyzują pod UVB. Niedobór wapnia lub witaminy D3 (często z braku UVB) prowadzi do choroby metabolicznej kości — mięknących kości i piramidowania pancerza.",
    simpleEn: "The element that builds bones and shells — its lack makes them soften.",
    fullEn: "Calcium is the mineral that builds bones, tortoise shells and eggshells. Its intestinal absorption depends on vitamin D3, which reptiles synthesize under UVB. A lack of calcium or vitamin D3 (often from no UVB) leads to metabolic bone disease — softening bones and shell pyramiding.",
    "source": null,
    "verified": false
    },
  {
    "id": "g-uvb",
    "term": "UVB", termEn: "UVB",
    forms: [],
    simplePl: "Rodzaj światła z lampy/słońca, pod którym gady produkują witaminę D3 — bez niego chorują na kości.",
    fullPl: "UVB to zakres promieniowania ultrafioletowego, który w skórze gadów napędza syntezę witaminy D3, a ta umożliwia wchłanianie wapnia. Bez lampy UVB w terrarium gady na diecie ubogiej w wapń zapadają na chorobę metaboliczną kości. To klucz elementu hodowli, nie dodatek.",
    simpleEn: "A kind of light from a lamp/sun, under which reptiles make vitamin D3 — without it their bones sicken.",
    fullEn: "UVB is the range of ultraviolet radiation that drives vitamin D3 synthesis in reptile skin, which in turn enables calcium absorption. Without a UVB lamp in the terrarium, reptiles on a calcium-poor diet develop metabolic bone disease. It is a key element of husbandry, not an accessory.",
    "source": null,
    "verified": false
    },
  {
    "id": "g-martwiktomia",
    "term": "martwiktomia", termEn: "debridement",
    forms: ["martwiktomię"],
    simplePl: "Wycięcie martwych tkanek z rany lub jamy ustnej, by odsłonić zdrową, gojącą się tkankę.",
    fullPl: "Martwiktomia (debridement) to usunięcie martwych i zanieczyszczonych tkanek z rany lub jamy ustnej (np. masy serowatej przy stomatitis węża). Martwa tkanka jest pożywką dla bakterii i blokuje dostęp leków; jej wycięcie odsłania ukrwioną, zdrową tkankę, która się zagoi. Zabieg poprzedza antyseptyk i antybiotyk.",
    simpleEn: "Cutting away dead tissue from a wound or mouth, to expose healthy, healing tissue.",
    fullEn: "Debridement is the removal of dead and contaminated tissue from a wound or the mouth (e.g. caseous material in snake stomatitis). Dead tissue feeds bacteria and blocks drugs from reaching the tissue; cutting it away exposes vascularized, healthy tissue that will heal. The procedure precedes antiseptic and antibiotic.",
    "source": "https://en.wikipedia.org/wiki/Debridement",
    "verified": false
    },
  {
    "id": "g-stomatitis",
    "term": "stomatitis", termEn: "stomatitis",
    forms: [],
    simplePl: "Zapalenie jamy ustnej — u węża nazywane „mouth rot”; bakteryjne, z masą serowatą w pysku.",
    fullPl: "Stomatitis (zapalenie jamy ustnej) to bakteryjne zapalenie śluzówki i tkanek jamy ustnej. U węży bywa nazywana „mouth rot” — w jamie gromadzi się serowata masa (caseous), pysk puchnie, zwierzę nie chce jeść. Często ze złej higieny i niewłaściwej temperatury terrarium. Leczy się oczyszczeniem (martwiktomią), antyseptykiem i antybiotykiem.",
    simpleEn: "Inflammation of the mouth — in snakes called “mouth rot”; bacterial, with a cheese-like mass in the mouth.",
    fullEn: "Stomatitis (oral inflammation) is a bacterial inflammation of the mouth lining and tissues. In snakes it is called “mouth rot” — a caseous mass gathers in the mouth, the mouth swells, the animal refuses food. Often from poor hygiene and wrong terrarium temperature. Treatment is cleaning (debridement), antiseptic, and antibiotic.",
    "source": "https://en.wikipedia.org/wiki/Stomatitis",
    "verified": false
    },
  {
    "id": "g-slinotok",
    "term": "ślinotok", termEn: "drooling",
    forms: ["ślinotokiem", "ślinotoku"],
    simplePl: "Nadmiar śliny — ślina leci z pyska, często sygnał bólu lub problemu w jamie ustnej.",
    fullPl: "Ślinotok (hypersalivation) to nadmierna produkcja lub wyciek śliny z pyska. U węży ze stomatitis ślina zanieczyszczona jest ropą i tkanką; u innych zwierząt ślinotok bywa objawem nudności, bólu w jamie ustnej lub zatrucia. Sam w sobie nie jest diagnozą, lecz sygnałem czegoś w pysku lub żołądku.",
    simpleEn: "Too much saliva — drool runs from the mouth, often a sign of pain or a mouth problem.",
    fullEn: "Drooling (hypersalivation) is excess production or flow of saliva from the mouth. In snakes with stomatitis the saliva is mixed with pus and tissue; in other animals drooling can be a sign of nausea, mouth pain, or poisoning. On its own it is not a diagnosis but a sign of something in the mouth or stomach.",
    "source": null,
    "verified": false
    },
  {
    "id": "g-zmiennocieplnosc",
    "term": "zmiennocieplność", termEn: "ectothermy",
    forms: ["zmiennocieplne", "zmiennocieplnego", "zmiennocieplnych"],
    simplePl: "Zwierzę uzależnione od otoczenia w utrzymaniu ciepła — dlatego terrarium musi mieć gradient temperatur.",
    fullPl: "Zmiennocieplność (ektotermia) oznacza, że temperatura ciała zwierzęcia zależy od otoczenia, nie z własnego metabolizmu. Węże i żółwie muszą wygrzewać się pod lampą, by trawić i zwalczać infekcje. Zbyt zimne terrarium spowalnia trawienie i odporność — dlatego stomatitis i choroby układu pokarmowego u gadów bywają kwestią hodowli, nie tylko patologii.",
    simpleEn: "An animal that depends on its surroundings for body heat — which is why the terrarium needs a temperature gradient.",
    fullEn: "Ectothermy means the animal's body temperature depends on the environment, not its own metabolism. Snakes and tortoises must bask under a lamp to digest and fight infection. A too-cold terrarium slows digestion and immunity — which is why stomatitis and gut disease in reptiles are often a husbandry problem, not only pathology.",
    "source": "https://pl.wikipedia.org/wiki/Zmiennocieplno%C5%9B%C4%87",
    "verified": false
    }
];


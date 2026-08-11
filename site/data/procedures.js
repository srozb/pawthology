// Zabiegi (kind=procedure), operacje (kind=surgery) i zalecenia dla opiekuna.
// Leki to NIE jedyny etap leczenia — zabiegi i zalecenia są równoległymi sekcjami.
// infoPl/infoEn — 3 akapity (intro / rola w grze / ograniczenia), jak w drugs.js.
// alternativeTo — identyfikator operacji, którą zabieg może zastąpić (np. szyna zamiast osteosyntezy).
export const procedures = [
  {
    id: "wound-clean-debride",
    minLevel: 1,
    kind: "procedure",
    image: "procedures/wound-clean-debride.webp",
    labelPl: "Oczyszczenie rany i martwiktomia",
    labelEn: "Wound cleaning and debridement",
    infoPl: "Oczyszczenie rany to pierwszy zabieg miejscowy - usuwa zanieczyszczenia, obce ciała i martwą tkankę, które inaczej działałyby pożywką dla bakterii. Martwiktomia (debridement) polega na wycięciu martwych krawędzi, by odsłonić zdrową, ukrwioną tkankę, która się zagoi.\n\nW grze to wymagany zabieg przy otarciu i ranie - sama podaż antyseptyku nie wystarczy, jeśli w ranie siedzi żwir czy martwa skóra. Zabieg wykonuje się przed nałożeniem antyseptyku i opatrunku.\n\nZabieg jest bolesny, dlatego przy większych ranach łączy się go z analgezją. Przy czystym, świeżym otarciu wystarczy delikatne płukanie solą - bez agresywnego debridementu.",
    infoEn: "Wound cleaning is the first local procedure — it removes debris, foreign bodies and dead tissue that would otherwise feed bacteria. Debridement means cutting away dead edges to expose healthy, vascularized tissue that will heal.\n\nIn the game it is the required procedure for an abrasion or a wound — antiseptic alone is not enough if grit or dead skin sits in the wound. The procedure is done before applying antiseptic and a dressing.\n\nThe procedure is painful, so larger wounds call for analgesia. For a clean, fresh abrasion gentle saline flushing is enough — without aggressive debridement.",
    wikiPl: "https://en.wikipedia.org/wiki/Debridement",
    wikiEn: "https://en.wikipedia.org/wiki/Debridement",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-PROC"]
  },
  {
    id: "ear-flush",
    minLevel: 1,
    kind: "procedure",
    image: "procedures/ear-flush.webp",
    labelPl: "Płukanie kanału słuchowego",
    labelEn: "Ear canal flush",
    infoPl: "Płukanie ucha to zabieg miejscowy przy zapaleniu ucha zewnętrznego - usuwa z kanału zalegającą wydzielinę, drożdżaki i resztki zapalne, których same krople nie rozpuszczą. Wykonuje się je ciepłym roztworem soli lub specjalnym płynem do uszu, ostrożnie, by nie uszkodzić błony bębenkowej.\n\nW grze to wymagany zabieg przy zapaleniu ucha z wydzieliną - krople działają na śluzówkę, ale najpierw trzeba usunąć masę, która ją pokrywa. Bez płukania krople nie dotrą do skóry kanału.\n\nZabieg wymaga wziernikowania i delikatności - u psa wrażliwego często dopiero po sedacji. Chlorheksydyny nie stosuje się do ucha (ototoksyczność).",
    infoEn: "Ear flushing is a local procedure for otitis externa — it removes the discharge, yeasts and inflammatory debris that drops alone will not dissolve. It is done with warm saline or a dedicated ear solution, carefully, to avoid damaging the eardrum.\n\nIn the game it is the required procedure when an ear discharge is present — drops act on the mucosa, but the mass coating it must be removed first. Without flushing the drops never reach the canal skin.\n\nThe procedure calls for otoscopy and gentleness — in a sensitive dog often only after sedation. Chlorhexidine is not used in the ear (ototoxicity).",
    wikiPl: "https://pl.wikipedia.org/wiki/Zapalenie_ucha_zewnętrznego",
    wikiEn: "https://en.wikipedia.org/wiki/Otitis_externa",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-PROC"]
  },
  {
    id: "fracture-stabilize-splint",
    minLevel: 2,
    kind: "procedure",
    image: "procedures/fracture-stabilize-splint.webp",
    labelPl: "Stabilizacja złamania (szyna/gips)",
    labelEn: "Fracture stabilization (splint/cast)",
    alternativeTo: ["fracture-osteosynthesis"],
    infoPl: "Stabilizacja zachowawcza polega na nastawieniu odłamów i unieruchomieniu kończyny szyną lub gipsem na czas zrostu. To alternatywa dla operacji, stosowana przy złamaniach prostych, stabilnych i u zwierząt, których stan nie pozwala na narkóz.\n\nW grze to dopuszczalna alternatywa dla osteosyntezy złamania - wybiera się ją LUB operację, nie obie naraz. Przy złamaniu prostym i małym pacjencie szyna bywa wystarczająca; przy przemieszczeniu lub dużym psie operacja jest bezpieczniejsza.\n\nWymaga ścisłego spokoju i kontroli RTG zrostu - szyna może się przesunąć lub odłamki się rozstąpić. Złe dopasowanie grozi odleżynami i niedokrwieniem.",
    infoEn: "Conservative stabilization means reducing the fragments and immobilizing the limb with a splint or cast for the duration of healing. It is the alternative to surgery, used for simple, stable fractures and for animals whose condition does not permit anesthesia.\n\nIn the game it is an allowed alternative to osteosynthesis of the fracture — one chooses it OR surgery, not both. For a simple fracture in a small patient a splint may suffice; for displacement or a large dog surgery is safer.\n\nIt demands strict rest and radiographic follow-up of the callus — the splint can shift or fragments can gap. Poor fitting threatens pressure sores and ischemia.",
    wikiPl: "https://pl.wikipedia.org/wiki/Z%C5%82amanie_ko%C5%9Bci",
    wikiEn: "https://en.wikipedia.org/wiki/Bone_fracture",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-PROC"]
  },
  {
    id: "incisor-trim-bur",
    minLevel: 1,
    kind: "procedure",
    image: "procedures/incisor-trim-bur.webp",
    labelPl: "Spiłowanie siekaczy frezem",
    labelEn: "Incisor trimming with a bur",
    infoPl: "Spiłowanie przerośniętych siekaczy to zabieg dentystyczny u gryzoni i królików, których zęby elodontyczne rosną całe życie. Frez dentystyczny (lub specjalne cążki) skraca koronę do prawidłowej długości, odbudowując zgryz i znosząc ból urazu wargi.\n\nW grze to wymagany zabieg przy przeroście siekaczy u królika - sam lek przeciwbólowy tylko maskuje objaw, nie usuwa przyczyny. Spiłowanie przywraca funkcję i zapobiega urazom tkanek miękkich.\n\nZabieg wykonuje się po sedacji/analgezji, delikatnie, by nie pękł ząb i nie uszkodzić miazgi. To rozwiązanie doraźne - nawrót wymaga kontroli diety i regularnego przycinania, czasem ekstrakcji.",
    infoEn: "Trimming overgrown incisors is a dental procedure in rodents and rabbits, whose elodont teeth grow throughout life. A dental bur (or special forceps) shortens the crown to correct length, restoring the bite and relieving the pain of soft-tissue trauma.\n\nIn the game it is the required procedure for incisor overgrowth in a rabbit — an analgesic drug alone only masks the sign and does not fix the cause. Trimming restores function and prevents further soft-tissue injury.\n\nThe procedure is done under sedation/analgesia, gently, so the tooth does not fracture and the pulp is not damaged. It is a temporary fix — recurrence demands diet control and regular trimming, sometimes extraction.",
    wikiPl: "https://en.wikipedia.org/wiki/Malocclusion",
    wikiEn: "https://en.wikipedia.org/wiki/Malocclusion",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-PROC"]
  },
  {
    id: "fracture-osteosynthesis",
    minLevel: 2,
    kind: "surgery",
    image: "procedures/fracture-osteosynthesis.webp",
    labelPl: "Osteosynteza złamania (operacja)",
    labelEn: "Fracture osteosynthesis (surgery)",
    infoPl: "Osteosynteza to operacyjne nastawienie i stabilizacja złamania przy pomocy implantów - płyty, śrub, prętów śródszpikowych lub drutu. Daje sztywną stabilizację odłamów, co pozwala wczesne obciążanie i skraca gojenie. Stosuje się ją przy złamaniach przemieszczonych, niestabilnych, wewnątrzstawowych i u dużych psów.\n\nW grze to jedna z dróg leczenia złamania - wybiera się ją LUB stabilizację zachowawczą (szynę). Operacja jest preferowana przy przemieszczeniu i dużym pacjencie; szyna przy złamaniu prostym, stabilnym. Obie drogi wymagają analgezji i kontroli zrostu.\n\nWymaga narkozy, warunków aseptyki i doświadczenia chirurga. Ryzyko: infekcja wokół implantu, zrost opóźniony, złamanie implantu. Dlatego nie każde złamanie kwalifikuje się do operacji.",
    infoEn: "Osteosynthesis is the surgical reduction and stabilization of a fracture with implants — plate, screws, intramedullary pin or wire. It gives rigid fragment fixation, allowing early loading and shortening healing. It is used for displaced, unstable, intra-articular fractures and in large dogs.\n\nIn the game it is one of the paths to treat a fracture — one chooses it OR conservative stabilization (a splint). Surgery is preferred for displacement and a large patient; a splint for a simple, stable fracture. Both paths demand analgesia and callus follow-up.\n\nIt requires anesthesia, aseptic conditions and an experienced surgeon. Risks: implant-site infection, delayed union, implant failure. Not every fracture qualifies for surgery.",
    wikiPl: "https://pl.wikipedia.org/wiki/Osteosynteza",
    wikiEn: "https://en.wikipedia.org/wiki/Osteosynthesis",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-PROC"]
  },
{
      "id": "enterotomy",
      "minLevel": 2,
      "kind": "surgery",      "image": "procedures/enterotomy.webp",
      "labelPl": "Enterotomia (operacja jelita)",
      "labelEn": "Enterotomy (intestinal surgery)",
      "infoPl": "Enterotomia to operacyjne otwarcie jelita w celu usunięcia ciała obcego, a następnie zszycie ściany jelitowej. Wymaga narkozy, warunków aseptyki i doświadczenia chirurga. Ryzyko: rozejście się szwu jelitowego (dehisencja), zapalenie otrzewnej, wyciek treści.\n\nW grze to jedyne leczenie kuracyjne obturacji — antybiotyk i płyny wspierają, ale nie usuwają przeszkody. Bez operacji ciało obce zostaje, a jelito niedokrwione obumiera.\n\nZabieg uczy, że w obturacji chirurgia jest leczeniem — czekanie i same leki to strata czasu, w którym jelito traci ukrwienie.",
      "infoEn": "Enterotomy is the surgical opening of the intestine to remove a foreign body, followed by suturing the intestinal wall. It requires anesthesia, aseptic conditions, and surgical experience. Risks: intestinal suture dehiscence, peritonitis, content leakage.\n\nIn the game it is the only curative treatment for obstruction — antibiotics and fluids support, but they do not remove the blockage. Without surgery the foreign body stays, and the ischemic intestine dies.\n\nThe procedure teaches that in obstruction, surgery is the treatment — waiting and drugs alone waste the time in which the intestine loses its blood supply.",
      "wikiPl": "https://en.wikipedia.org/wiki/Enterotomy",
      "wikiEn": "https://en.wikipedia.org/wiki/Enterotomy",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-PROC"
      ]
    },
{
      "id": "induce-emesis",
      "minLevel": 1,
      "kind": "procedure",      "image": "procedures/induce-emesis.webp",
      "labelPl": "Wydrenienie żołądka (wywołanie wymiotów)",
      "labelEn": "Induce emesis (gastric decontamination)",
      "infoPl": "Wywołanie wymiotów to dekontaminacja żołądkowa stosowana po niedawnym spożyciu toksyny, gdy pacjent jest bezobjawowy. Zasada: wskazane gdy spożycie było niedawne (<1–2 h) i pacjent nie ma drgnieć ani objawów neurologicznych. Przeciwwskazane gdy objawy już wystąpiły (ryzyko zachłyśnięcia) lub gdy toksyna jest żrąca.\n\nKluczowa różnica gatunkowa: u psa stosuje się apomorfinę, ale u kota jest ona nieskuteczna lub niebezpieczna. U kota używa się agonisty alfa-2 (ksylazyna, deksmedetomidyna). To jedna z najważniejszych lekcji toksykologii — kot nie jest małym psem.\n\nW grze to wymagany zabieg przy zatruciu metaldehydem bez objawów: decyzja o wywołaniu wymiotów jest leczeniem. Nie ma tu suwaka dawki — liczy się CZY wywołać, nie ile. Gdyby kot miał objawy, ten sam zabieg byłby przeciwwskazany.",
      "infoEn": "Inducing emesis is gastric decontamination used after recent toxin ingestion, when the patient is asymptomatic. The rule: indicated when ingestion was recent (<1–2 h) and the patient has no tremors or neurological signs. Contraindicated when symptoms are already present (aspiration risk) or when the toxin is corrosive.\n\nThe key species difference: in dogs, apomorphine is used, but in cats it is ineffective or dangerous. In cats, an alpha-2 agonist (xylazine, dexmedetomidine) is used. This is one of the most important toxicology lessons — a cat is not a small dog.\n\nIn the game this is the required procedure for asymptomatic metaldehyde toxicity: the decision to induce emesis IS the treatment. There is no dose slider here — what matters is WHETHER to induce, not how much. Had the cat shown symptoms, the same procedure would be contraindicated.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Wymioty",
      "wikiEn": "https://en.wikipedia.org/wiki/Emesis",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-PROC"
      ]
    },
{
      "id": "beak-trim",
      "minLevel": 1,
      "kind": "procedure",      "image": "procedures/beak-trim.webp",
      "labelPl": "Spiłowanie dzioba",
      "labelEn": "Beak trimming",
      "infoPl": "Spiłowanie przerośniętego dzioba to zabieg pielęgnacyjny u ptaków, którego dziób rośnie przez całe życie. Frez dentystyczny lub specjalne cążki skracają keratynową osłonkę do prawidłowej długości, przywracając domknięcie i funkcję.\n\nW grze to zabieg wspomagający przy świerzbie twarzowym — skrócenie dzioba przywraca jedzenie, ale nie usuwa roztoczy. Bez leku przeciwpasożytniczego dziób znów przerośnie, bo roztocza rosną dalej. Zawsze trzeba szukać przyczyny przerostu, a nie tylko go spiłowywać.\n\nZabieg wykonuje się delikatnie, by nie uszkodzić miazgi ani wywołać pęknięcia. U ptaków małych łatwo to zrobić bez sedacji, ale niektóre ptaki wymagają krótkiego uspokojenia.",
      "infoEn": "Trimming an overgrown beak is a grooming procedure in birds, whose beak grows throughout life. A dental bur or special clippers shorten the keratin sheath to correct length, restoring closure and function.\n\nIn the game it is a supportive procedure for scaly face mites — shortening the beak restores eating, but does not remove the mites. Without an antiparasitic the beak overgrows again, because the mites keep growing. One must always look for the cause of overgrowth, not just trim it.\n\nThe procedure is done gently, so the pulp is not damaged and the beak does not crack. In small birds it is easily done without sedation, though some birds need brief calming.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Dzi%C3%B3b",
      "wikiEn": "https://en.wikipedia.org/wiki/Beak",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-PROC"
      ]
    },
{
      "id": "wing-clip",
      "minLevel": 1,
      "kind": "procedure",      "image": "procedures/wing-clip.webp",
      "labelPl": "Przycinanie lotek",
      "labelEn": "Wing clipping",
      "infoPl": "Przycinanie lotek pierwszego rzędu to zabieg kosmetyczno-pielęgnacyjny na prośbę właściciela — skraca się kilka zewnętrznych piór lotnych, by ograniczyć lot bez pozbawiania ptaka równowagi. Nie leczy żadnej choroby.\n\nW grze to procedura opcjonalna — właściciel może o nią poprosić, ale nie jest ona częścią leczenia. Skraca się tylko lotki, nigdy nie pióra pokrywowe, i zawsze symetrycznie, by ptak nie tracił równowagi.\n\nZabieg nie jest bolesny (pióro jest martwe jak paznokień), ale wymaga ostrożności, by nie dotknąć żywego piora z krwawiącym trzpieniem.",
      "infoEn": "Clipping the primary flight feathers is a cosmetic-management procedure at the owner's request — a few outer flight feathers are shortened to limit flight without unbalancing the bird. It treats no disease.\n\nIn the game it is an optional procedure — the owner may request it, but it is not part of treatment. Only the flight feathers are clipped, never the covert feathers, and always symmetrically so the bird keeps its balance.\n\nThe procedure is not painful (a feather is dead like a fingernail), but requires care to avoid a growing blood feather with a bleeding shaft.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Lotki",
      "wikiEn": "https://en.wikipedia.org/wiki/Flight_feather",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-PROC"
      ]
    },
{
      "id": "egg-assistance",
      "minLevel": 2,
      "kind": "procedure",      "image": "procedures/egg-assistance.webp",
      "labelPl": "Pomoc przy znoszeniu jaja",
      "labelEn": "Egg assistance (manual delivery)",
      "infoPl": "Pomoc przy znoszeniu jaja polega na delikatnym ułatwieniu przejścia zatrzymanego jaja. Po podaniu wapnia i ogrzaniu ptaka, stosuje się lubrykację i łagodny ucisk, czasem owocentezę — ostrożne opróżnienie zawartości jaja, by zmniejszyć jego objętość i pozwolić mu przejść. To nie jest operacja. Nigdy nie wolno wyciągać jaja na siłę, bo grozi to rozerwaniem jajowodu i krwotokiem.\n\nW grze to właściwy zabieg przy zatrzymaniu jaja — wykonywany po wapniu i wsparciu. Bez wapnia sama pomoc jest ryzykowna, bo mięśnie jajowodu są zbyt słabe, by współpracować.\n\nZabieg uczy, że pomoc to nie siła — to delikatność po przygotowaniu pacjenta.",
      "infoEn": "Egg assistance means gently helping a stuck egg pass. After calcium and warming, lubrication and gentle pressure are applied, sometimes ovocentesis — carefully emptying the egg contents to reduce its volume and allow passage. This is not surgery. The egg must never be pulled by force, as this risks rupturing the oviduct and hemorrhage.\n\nIn the game it is the right procedure for egg binding — performed after calcium and support. Without calcium, assistance alone is risky, because the oviduct muscles are too weak to cooperate.\n\nThe procedure teaches that assistance is not force — it is gentleness after the patient is prepared.",
      "wikiPl": "https://en.wikipedia.org/wiki/Egg_binding",
      "wikiEn": "https://en.wikipedia.org/wiki/Egg_binding",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-PROC"
      ]
    },
{
      "id": "salpingotomy",
      "minLevel": 3,
      "kind": "surgery",      "image": "procedures/salpingotomy.webp",
      "labelPl": "Salpingotomia (operacja jajowodu)",
      "labelEn": "Salpingotomy (oviduct surgery)",
      "infoPl": "Salpingotomia to operacyjne usunięcie zatrzymanego jaja przez nacięcie jajowodu. To ostateczność, stosowana dopiero, gdy wapń, wsparcie i pomoc ręczna zawodzą. U ptaka o wadze 90 gramów operacja niesie wysokie ryzyko — narkoza, utrata krwi i stres mogą przeważyć nad problemem.\n\nW grze ta operacja jest przeciwwskazana we wczesnej prezentacji zatrzymania jaja. Skok do operacji, zanim spróbuje się wapnia i wsparcia, to błąd, który silnik ocenia jako R-PROC-CONTRA. Najpierw wapń, potem pomoc, a operacja tylko, gdy wszystko inne zawiedzie.\n\nTo uczy, że w medycynie ptaków nóż to ostatnia deska ratunku, nie pierwsza.",
      "infoEn": "Salpingotomy is the surgical removal of a stuck egg through an incision in the oviduct. It is the last resort, used only when calcium, support, and manual assistance fail. In a 90-gram bird surgery carries high risk — anesthesia, blood loss, and stress can outweigh the problem.\n\nIn the game this surgery is contraindicated in early presentation of egg binding. Rushing to surgery before trying calcium and support is a mistake the engine scores as R-PROC-CONTRA. First calcium, then assistance, and surgery only if everything else fails.\n\nThis teaches that in avian medicine the knife is the last resort, not the first.",
      "wikiPl": "https://en.wikipedia.org/wiki/Egg_binding",
      "wikiEn": "https://en.wikipedia.org/wiki/Egg_binding",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-PROC"
      ]
    }
];

export const recommendations = [
  {
    id: "wound-observation",
    labelPl: "Obserwacja rany w domu",
    labelEn: "Wound observation at home",
    infoPl: "Zalecenie obserwacji rany polega na codziennym oglądaniu opatrunku i rany przez opiekuna - pod kątem zaczerwienienia, obrzęku, ropy i rozchodzenia się brzegów. To wczesny system ostrzegania, który pozwala wcześnie wrócić, zanim drobny problem stanie się poważnym.\n\nW grze to właściwe zalecenie przy czystym otarciu - rana zagoi się sama, ale opiekun musi wiedzieć, kiedy sygnał alarmu uzasadnia powrót. Bez tego zalecenia właściciel może zignorować zakażenie, które rozwinie się za kilka dni.\n\nTo nie zastępuje kontroli u weterynarza przy pogorszeniu - to nauka, na co zwracać uwagę w domu.",
    infoEn: "Wound observation means the carer checks the dressing and wound daily — for redness, swelling, pus and gapping edges. It is an early-warning system that allows a prompt return before a small problem becomes a serious one.\n\nIn the game it is the right recommendation for a clean abrasion — the wound will heal on its own, but the carer must know which alarm sign justifies a return. Without it an owner may overlook an infection that develops over the following days.\n\nIt does not replace a veterinary visit on worsening — it teaches what to watch for at home.",
    wikiPl: "https://en.wikipedia.org/wiki/Wound_healing",
    wikiEn: "https://en.wikipedia.org/wiki/Wound_healing",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "recheck-if-recurrent",
    labelPl: "Kontrola, jeśli objawy wrócą",
    labelEn: "Recheck if symptoms recur",
    infoPl: "Zalecenie kontroli przy nawrocie polega na umówieniu powrotnej wizyty, jeśli objawy znikną po leczeniu, a potem wrócą. Zapalenie ucha, biegunka i infekcje skóry często nawracają, jeśli nie wyeliminowano czynnika sprawczego - nawrót to sygnał, że leczenie było objawowe, nie przyczynowe.\n\nW grze to właściwe zalecenie po leczeniu zapalenia ucha - krople zlikwidują stan, ale jeśli woda i ciepło wrócą, problem wróci. Opiekun ma wiedzieć, że powrót objawu to nie porażka, lecz wskazanie do pogłębienia diagnostyki.\n\nTo zalecenie zapobiega błędnemu kołu powtarzania tych samych leków bez szukania przyczyny.",
    infoEn: "A recheck-on-recurrence recommendation means booking a return visit if the signs resolve with treatment and then come back. Otitis, diarrhea and skin infections often recur when the underlying cause was not removed — recurrence is the signal that treatment was symptomatic, not causal.\n\nIn the game it is the right recommendation after otitis treatment — drops clear the inflammation, but if water and warmth return, so will the problem. The carer must know that a returning sign is not a failure but an indication to deepen the work-up.\n\nThis recommendation prevents the error of repeatedly dispensing the same drugs without seeking the cause.",
    wikiPl: "https://pl.wikipedia.org/wiki/Zapalenie_ucha_zewn%C4%99trznego",
    wikiEn: "https://en.wikipedia.org/wiki/Otitis_externa",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "rehydration-if-needed",
    labelPl: "Podaż płynów doustnie, jeśli biegunka się nasili",
    labelEn: "Oral fluids if diarrhea worsens",
    infoPl: "Zalecenie płynów doustnych uczy opiekuna podawać elektrolity, jeśli biegunka nasila się lub trwa - by zapobiec odwodnieniu, największemu ryzyku biegunki, zwłaszcza u młodych i małych zwierząt. Proste rozwiązanie (roztwór do nawadniania doustnego) ratuje sytuację, zanim odwodnienie stanie się krytyczne.\n\nW grze to właściwe zalecenie przy biegunce pasożytniczej - odrobaczenie ją zlikwiduje, ale w okresie przejściowym pacjent może tracić wodę. Opiekun musi wiedzieć, kiedy płyny to domowa first aid, a kiedy konieczna kroplówka w klinice.\n\nZalecenie uczy też, czego nie robić: nie podawać ludzkich leków na biegunkę, nie głodzić długo (jelito potrzebuje pasażu do regeneracji).",
    infoEn: "An oral-fluids recommendation teaches the carer to give electrolytes if diarrhea worsens or persists — to prevent dehydration, the biggest risk of diarrhea, above all in young and small animals. A simple measure (an oral rehydration solution) saves the situation before dehydration turns critical.\n\nIn the game it is the right recommendation for parasitic diarrhea — deworming will clear it, but in the transition the patient may lose water. The carer must know when fluids are home first aid and when an IV drip at the clinic is needed.\n\nThe recommendation also teaches what not to do: do not give human antidiarrheals, do not starve for long (the gut needs transit to recover).",
    wikiPl: "https://pl.wikipedia.org/wiki/Biegunka",
    wikiEn: "https://en.wikipedia.org/wiki/Diarrhea",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "recheck-fecal-2w",
    labelPl: "Kontrola kału za 2 tygodnie",
    labelEn: "Fecal recheck in 2 weeks",
    infoPl: "Kontrola kału po odrobaczeniu potwierdza skuteczność leczenia i wykryje przypadki, w których pasożyty przetrwały lub reinfekeowały. Wykonuje się ją około 2 tygodni po leczeniu - tyle trwa cykl wydalenia jaj po śmierci dorosłych form.\n\nW grze to właściwe zalecenie po leczeniu biegunki pasożytniczej - sam lek nie kończy sprawy, jeśli środowisko jest źródłem reinwestwacji. Kontrola kału zamyka pętlę leczenia i zapobiega przewlekłości.\n\nUczy też, że jeden ujemny wynik nie oznacza braku pasożytów - wydalanie jaj jest okresowe, dlatego przy silnym podejrzeniu powtarza się badanie.",
    infoEn: "A post-deworming fecal check confirms treatment success and catches cases where parasites survived or reinfected. It is done about 2 weeks after treatment — the time the egg-shedding cycle takes after the adults die.\n\nIn the game it is the right recommendation after treating parasitic diarrhea — the drug alone does not close the case if the environment is a source of reinfection. A fecal check closes the treatment loop and prevents chronification.\n\nIt also teaches that one negative result does not rule out parasites — egg shedding is intermittent, so the test is repeated on strong suspicion.",
    wikiPl: "https://pl.wikipedia.org/wiki/Kał",
    wikiEn: "https://en.wikipedia.org/wiki/Fecal_examination",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "strict-rest",
    labelPl: "Ścisły spokój do zrostu",
    labelEn: "Strict rest until union",
    infoPl: "Ścisły spokój to zalecenie ograniczenia ruchu na czas zrostu złamania - krótkie spacery na smyczy, bez biegania, skakania i zabaw. Pozwala odłomom zrosnąć się bez przesunięcia i chroni szynę lub implant przed obciążeniem, które by je zawiodło.\n\nW grze to wymagane zalecenie przy złamaniu - unieruchomienie szyną czy płytą nie ma sensu, jeśli pies biega. Bez spokoju odłamy się rozstępują, zrost opóźnia się lub wcale, i leczenie zachodzi na siebie.\n\nZalecenie uczy, że leczenie złamania to nie tylko zabieg i lek - to też dyscyplina opiekuna przez kilka tygodni. To najczęstszy powód niepowodzenia leczenia złamań.",
    infoEn: "Strict rest means restricting movement for the duration of fracture healing — short leash walks, no running, jumping or play. It lets the fragments unite without displacement and protects the splint or implant from loads that would fail them.\n\nIn the game it is a required recommendation for a fracture — immobilizing with a splint or plate is pointless if the dog runs. Without rest the fragments gap, union is delayed or fails, and the treatment unravels.\n\nThe recommendation teaches that fracture care is not only a procedure and a drug — it is also carer discipline over several weeks. It is the most common reason fracture treatment fails.",
    wikiPl: "https://pl.wikipedia.org/wiki/Kalus",
    wikiEn: "https://en.wikipedia.org/wiki/Bone_healing",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "recheck-radiograph",
    labelPl: "Kontrola RTG zrostu",
    labelEn: "Radiographic recheck of union",
    infoPl: "Kontrola RTG po leczeniu złamania ocenia zrost - czy odłamy się zrastają, czy pozycja utrzymana, czy implant trzyma. Wykonuje się ją w kilku tygodniach odstępu, bo zrost kostny widać na zdjęciu dopiero, gdy tworzy się kalus.\n\nW grze to wymagane zalecenie przy złamaniu - bez RTG nie wiadomo, czy leczenie działa. Kontrola wykryje rozstępy, opóźniony zrost lub zawiodły implant, zanim stanie się problemem klinicznym.\n\nUczy też, kiedy RTG nie jest potrzebny - proste złamanie, które dobrze się goi, nie wymaga nadmiernego naświetlania. Decyzję podejmuje się na podstawie poprzedniego obrazu i objawów.",
    infoEn: "A post-fracture radiographic recheck assesses union — whether fragments knit, whether position is held, whether the implant holds. It is done at intervals of several weeks, because bone union shows on the image only once callus forms.\n\nIn the game it is a required recommendation for a fracture — without an x-ray one cannot know whether treatment is working. The recheck detects gapping, delayed union or implant failure before it becomes a clinical problem.\n\nIt also teaches when an x-ray is not needed — a simple fracture healing well does not require excessive imaging. The decision rests on the prior image and the signs.",
    wikiPl: "https://pl.wikipedia.org/wiki/Kalus",
    wikiEn: "https://en.wikipedia.org/wiki/Bone_healing",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "treat-environment",
    labelPl: "Odrobaczanie środowiska",
    labelEn: "Environmental parasite control",
    infoPl: "Odrobaczanie środowiska to zalecenie dotyczące pcheł i pasożytów w domu - pchła spędza większość cyklu nie na zwierzęciu, lecz w dywanie, podłodze i legowisku. Samo potraktowanie zwierzęcia likwiduje dorosłe pchły, ale jaja i larwy w środowisku dają nawrót w 2–3 tygodnie.\n\nW grze to wymagane zalecenie przy zarobczeniu pchlim - lek na zwierzęciu to pół pracy, druga połowa to odkurzanie, pranie legowisk i oprysk środowiska regulatorem wzrostu owadów (IGR).\n\nUczy, że bez środowiska leczenie zawsze wraca - dlatego to zalecenie jest równoległe do leku, nie opcjonalne.",
    infoEn: "Environmental parasite control is the recommendation for fleas and household parasites — the flea spends most of its cycle not on the animal but in carpets, floors and bedding. Treating the animal alone kills adult fleas, but eggs and larvae in the environment cause a recurrence in 2–3 weeks.\n\nIn the game it is a required recommendation for a flea infestation — the drug on the animal is half the work; the other half is vacuuming, washing bedding and spraying the environment with an insect-growth regulator (IGR).\n\nIt teaches that without the environment the treatment always returns — so this recommendation runs parallel to the drug, not as an option.",
    wikiPl: "https://pl.wikipedia.org/wiki/Pch%C5%82y",
    wikiEn: "https://en.wikipedia.org/wiki/Flea",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "treat-all-pets",
    labelPl: "Leczenie wszystkich zwierząt w domu",
    labelEn: "Treat all pets in the household",
    infoPl: "Leczenie wszystkich zwierząt w domu to zalecenie przy pasożytach zewnętrznych i wewnętrznych - rezerwuarem reinfekcji są inne zwierzęta, które noszą pasożyta bezobjawowo. Traktując tylko chore zwierzę, leczy się jedno ogniwo łańcucha, a pozostałe zarobczą je na nowo.\n\nW grze to wymagane zalecenie przy zarobczeniu pchlim - w domu, w którym pojawił się jeden zarobczony, wszystkie psy i koty muszą dostać lek. Bez tego nawrót jest pewny.\n\nUczy zasadcy: w medycynie stada (a dom wielozwierzęcy to mini-stado) nie leczy się jednostki, lecz populacji.",
    infoEn: "Treating all pets in the household is the recommendation for external and internal parasites — the reservoir of reinfection is other animals carrying the parasite asymptomatically. Treating only the sick animal mends one link of the chain, while the rest reinfest it.\n\nIn the game it is a required recommendation for a flea infestation — in a household where one animal is infested, every dog and cat must receive the drug. Without it, recurrence is certain.\n\nIt teaches the principle: in herd medicine (and a multi-pet home is a mini-herd) one treats the population, not the individual.",
    wikiPl: "https://pl.wikipedia.org/wiki/Pch%C5%82y",
    wikiEn: "https://en.wikipedia.org/wiki/Flea",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "hay-diet",
    labelPl: "Dieta oparta na sianie",
    labelEn: "Hay-based diet",
    infoPl: "Dieta oparta na sianie to zalecenie zapobiegające przerostowi zębów u gryzoni i królików - żucie twardego, włóknistego siana ściera elodontyczne zęby w tempie ich wzrostu. Bez ścierania zęby przerastają, a królik przestaje jeść i chudnie.\n\nW grze to wymagane zalecenie po spiłowaniu siekaczy u królika - zabieg skraca korony, ale bez diety nawrót jest pewny. Siano musi stanowić większość racji, a ziarna i smakołyki margines.\n\nUczy, że u gatunków z zębami elodontycznymi dieta to leczenie i profilaktyka w jednym - brak siana to najczęstsza przyczyna problemów dentystycznych.",
    infoEn: "A hay-based diet is the recommendation that prevents tooth overgrowth in rodents and rabbits — chewing hard, fibrous hay wears the elodont teeth at the rate of their growth. Without wear the teeth overgrow, and the rabbit stops eating and loses weight.\n\nIn the game it is a required recommendation after trimming a rabbit's incisors — the procedure shortens the crowns, but without a diet change recurrence is certain. Hay must form the bulk of the ration, with grains and treats a marginal share.\n\nIt teaches that in species with elodont teeth diet is both treatment and prevention — a lack of hay is the most common cause of dental disease.",
    wikiPl: "https://pl.wikipedia.org/wiki/Kr%C3%B3lik_europejski",
    wikiEn: "https://en.wikipedia.org/wiki/Rabbit",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  },
  {
    id: "recheck-teeth-3m",
    labelPl: "Kontrola zębów za 3 miesiące",
    labelEn: "Dental recheck in 3 months",
    infoPl: "Kontrola zębów u królika po spiłowaniu siekaczy wyłapuje nawrót przerostu, zanim uszkodzi wargi i jamę ustną. Wykonuje się ją w kilku tygodniach do miesięcy odstępu, bo zęby elodontyczne rosną całe życie i przerost wraca, jeśli nie usunięto przyczyny.\n\nW grze to wymagane zalecenie przy malokluzji królika - spiłowanie jest rozwiązaniem doraźnym, kontrola zamyka pętlę leczenia i zapobiega urazom tkanek miękkich w przyszłości.\n\nUczy, że zabieg dentystyczny u gatunków elodontycznych rzadko kończy sprawę - to leczenie przewlekłe, wymagające rytmu kontroli.",
    infoEn: "A dental recheck in a rabbit after incisor trimming catches the recurrence of overgrowth before it injures the lips and mouth. It is done at intervals of weeks to months, because elodont teeth grow for life and overgrowth returns if the cause was not removed.\n\nIn the game it is a required recommendation for rabbit malocclusion — trimming is a temporary fix; the recheck closes the treatment loop and prevents soft-tissue injury in the future.\n\nIt teaches that a dental procedure in elodont species rarely ends the case — it is chronic care, demanding a rhythm of follow-up.",
    wikiPl: "https://en.wikipedia.org/wiki/Malocclusion",
    wikiEn: "https://en.wikipedia.org/wiki/Malocclusion",
    reviewStatus: "llm-audited",
    reviewDate: "2026-08-10",
    sources: ["S-MVM"],
    claimIds: ["C-RUB-REC"]
  }
  ,
  {
    id: "isolation-humidification",
    labelPl: "Izolacja i nawilżanie", labelEn: "Isolation and humidification",
    infoPl: "Zalecenie izolacji i nawilżania przy katarze kocim polega na odseparowaniu chorego kota od innych (wirus herpeswirusa jest zaraźliwy) i nawilżaniu dróg oddechowych - nawilżacz, parówka w łazience, ciepłe i wilgotne otoczenie. To ułatwia oddychanie i odkrztuszanie wydzieliny.\n\nW grze to właściwe zalecenie przy katarze kocim - bo leczenie jest wspomagające, a nie antybiotykowe. Izolacja chroni inne koty, a nawilżanie wspiera naturalne oczyszczanie dróg oddechowych.\n\nTo nie zastępuje kontroli, gdy kot przestaje jeść lub oddycha z trudem - to sygnał, by wrócić i rozważyć wtórne nadkażenie bakteryjne.",
    infoEn: "Isolation and humidification for feline viral rhinotracheitis means separating the sick cat from others (the herpesvirus is contagious) and humidifying the airways — a humidifier, steam in the bathroom, a warm moist environment. It eases breathing and the clearing of discharge.\n\nIn the game it is the right recommendation for feline viral rhinotracheitis — because treatment is supportive, not antibiotic. Isolation protects other cats, and humidification supports the natural clearance of the airways.\n\nIt does not replace a return visit when the cat stops eating or struggles to breathe — that is a signal to revisit and consider a secondary bacterial infection.",
    wikiPl: "https://pl.wikipedia.org/wiki/Zaka%C5%BCenie",
    wikiEn: "https://en.wikipedia.org/wiki/Cat_flu",
    reviewStatus: "draft", reviewDate: "—", sources: ["S-MVM"], claimIds: ["C-RUB-REC"]
  },
  {
    id: "tick-prevention",
    labelPl: "Profilaktyka kleszczowa", labelEn: "Tick prevention",
    infoPl: "Zalecenie profilaktyki kleszczowej polega na regularnym stosowaniu preparatów odstraszających lub zabijających kleszcze - spot-on, obroże, tablety - oraz na sprawdzaniu psa po każdym spacerze w lesie i łące, z usunięciem kleszczy jak najszybciej. Kleszcze przenoszą śmiertelne choroby: babeszjozę, erlichiozę, chorobę z Lyme.\n\nW grze to właściwe zalecenie przy babeszjozie - bo wyleczenie jednego epizodu nie chroni przed kolejnym, a prewencja jest skuteczniejsza i tańsza niż leczenie. Bez profilaktyki kleszczowej pies wraca z kolejnym spacerem z nowym zakażeniem.\n\nTo zalecenie uczy, że kleszcz to nie tylko swędzący punkcik - to wektor śmiertelnej choroby, a najlepsze leczenie to nie dopuścić do zakażenia.",
    infoEn: "Tick prevention means regular use of products that repel or kill ticks — spot-on, collars, tablets — and checking the dog after every walk in woods and meadows, removing ticks as fast as possible. Ticks carry lethal diseases: babesiosis, ehrlichiosis, Lyme disease.\n\nIn the game it is the right recommendation for babesiosis — because curing one episode does not protect from the next, and prevention is more effective and cheaper than treatment. Without tick prevention the dog returns from the next walk with a new infection.\n\nThis recommendation teaches that a tick is not just an itchy speck — it is the vector of a lethal disease, and the best treatment is never to let the infection happen.",
    wikiPl: "https://pl.wikipedia.org/wiki/Kleszcze",
    wikiEn: "https://en.wikipedia.org/wiki/Tick",
    reviewStatus: "draft", reviewDate: "—", sources: ["S-MVM"], claimIds: ["C-RUB-REC"]
  },
  {
    id: "increase-water-intake",
    labelPl: "Zwiększenie podaży wody", labelEn: "Increase water intake",
    infoPl: "Zalecenie zwiększenia podaży wody przy kociej kamicy i sterylnym zapaleniu pęcherza polega na przejściu na mokrą karmę, dodaniu fontanny wodnej i rozstawieniu kilku misek z wodą w domu. Koty piją mało z natury i mają skoncentrowany mocz - to sprzyja kryształom i podrażnieniu pęcherza. Więcej wody rozcieńcza mocz i chroni śluzówkę.\n\nW grze to właściwe zalecenie przy sterylnym zapaleniu - bo leczenie zaczyna się od zmiany środowiska moczu, a nie od antybiotyku. Mokra karma to najprostszy i najskuteczniejszy środek: zwiększa objętość moczu i zmniejsza stężenie kryształów.\n\nTo zalecenie uczy, że czasem najważniejszy lek to woda - a nie najmocniejszy antybiotyk z apteki.",
    infoEn: "Increasing water intake in feline lower urinary tract disease (FLUTD) means switching to wet food, adding a water fountain, and setting out several water bowls in the home. Cats drink little by nature and have concentrated urine — this favors crystals and bladder irritation. More water dilutes the urine and protects the mucosa.\n\nIn the game it is the right recommendation for FLUTD — because treatment begins with changing the urine environment, not with an antibiotic. Wet food is the simplest and most effective measure: it increases urine volume and lowers the concentration of crystals.\n\nThis recommendation teaches that sometimes the most important medicine is water — not the strongest antibiotic from the pharmacy.",
    wikiPl: "https://pl.wikipedia.org/wiki/Kamica_uk%C5%82adu_moczowego",
    wikiEn: "https://en.wikipedia.org/wiki/Feline_lower_urinary_tract_disease",
    reviewStatus: "draft", reviewDate: "—", sources: ["S-MVM"], claimIds: ["C-RUB-REC"]
  },
  {
    id: "stress-reduction",
    labelPl: "Redukcja stresu", labelEn: "Stress reduction",
    infoPl: "Zalecenie redukcji stresu przy sterylnym zapaleniu pęcherza polega na stabilnej rutynie domowej, zapewnieniu kotu miejsc do wspinania i ukrywania, osobnych kuwet i misek w wielokotnym domu, i ograniczeniu nagłych zmian (gość, remont, nowy zwierzak). Stres napędza sterylne zapalenie pęcherza u kotów - to choroba psychosomatyczna.\n\nW grze to właściwe zalecenie przy sterylnym zapaleniu - bo u wielu kotów to stres, a nie infekcja, utrzymuje objawy. Bez usunięcia źródła stresu antybiotyk i analgetyk dają tylko chwilową ulgę, a objawy wracają.\n\nTo zalecenie uczy, że środowisko jest lekiem - a choroba somatyczna może mieć przyczynę w otoczeniu, nie tylko w patogenie.",
    infoEn: "Stress reduction in FIC means a stable home routine, places for the cat to climb and hide, separate litter boxes and bowls in a multi-cat home, and limiting sudden changes (a guest, a renovation, a new pet). Stress drives sterile bladder inflammation in cats — it is a psychosomatic disease.\n\nIn the game it is the right recommendation for FIC — because in many cats it is stress, not infection, that sustains the signs. Without removing the source of stress, an antibiotic and an analgesic give only temporary relief, and the signs return.\n\nThis recommendation teaches that the environment is medicine — and that a somatic disease can have its cause in the surroundings, not only in a pathogen.",
    wikiPl: "https://pl.wikipedia.org/wiki/Stres",
    wikiEn: "https://en.wikipedia.org/wiki/Stress_(biology)",
    reviewStatus: "draft", reviewDate: "—", sources: ["S-MVM"], claimIds: ["C-RUB-REC"]
  },
{
      "id": "prevent-pica",
      "labelPl": "Zapobieganie połykaniu ciał obcych",
      "labelEn": "Foreign body prevention",
      "infoPl": "Zalecenie zapobiegania połykaniu ciał obcych uczy właściciela, by trzymał małe zabawki, skarpetki, sznurki i gumowe przedmioty poza zasięgiem psa. Należy nadzorować zabawę i wybierać zabawki odpowiednio duże, których pies nie połknie w całości. Młode psy poznają świat pyskiem — zapobieganie jest lepsze niż operacja.\n\nW grze to właściwe zalecenie po enterotomii — usunięcie ciała obcego kończy epizod, ale bez edukacji właściciela pies wraca z następnym. Odpowiednio dobrane zabawki i nadzór to najprostsza profilaktyka.\n\nZalecenie uczy, że zapobieganie to najtańsze leczenie — i że pies, który wszystko bierze do pyska, potrzebuje nadzoru, nie tylko operacji w retrospect.",
      "infoEn": "The foreign-body-prevention recommendation teaches the owner to keep small toys, socks, strings, and rubber objects out of the dog's reach. Play should be supervised, and toys chosen large enough that the dog cannot swallow them whole. Young dogs explore the world with their mouths — prevention is better than surgery.\n\nIn the game it is the right recommendation after enterotomy — removing the foreign body ends the episode, but without owner education the dog returns with the next one. Appropriately sized toys and supervision are the simplest prevention.\n\nThe recommendation teaches that prevention is the cheapest treatment — and that a dog who puts everything in its mouth needs supervision, not just surgery in retrospect.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Zabawka",
      "wikiEn": "https://en.wikipedia.org/wiki/Dog_toy",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-REC"
      ]
    },
{
      "id": "observe-toxicity",
      "labelPl": "Obserwacja 24h po dekontaminacji",
      "labelEn": "24h observation post-decontamination",
      "infoPl": "Po wywołaniu wymiotów pacjent wymaga obserwacji przez 24 godziny. Metaldehyd może się częściowo wchłonąć mimo dekontaminacji — trzeba czujnie obserwować, czy nie pojawią się drgnienia, ślinotok lub hipertermia. Gdy objawy się pojawią, pacjent wraca natychmiast na płyny dożylne i opiekę wspomagającą.\n\nW grze to właściwe zalecenie przy zatruciu metaldehydem — dekontaminacja to pierwszy krok, ale nie gwarancja. Obserwacja zamyka pętlę bezpieczeństwa i wychwytuje pacjentów, u których trucizna zdążyła się częściowo wchłonąć.\n\nTo zalecenie uczy, że dekontaminacja to nie koniec — to początek. Bez obserwacji właściciel może zignorować pierwsze drgnienie, które oznacza, że trucizna jednak się wchłonęła.",
      "infoEn": "After inducing emesis, the patient requires observation for 24 hours. Metaldehyde may partially absorb despite decontamination — one must watch closely for tremors, salivation or hyperthermia. If symptoms appear, the patient returns immediately for IV fluids and supportive care.\n\nIn the game this is the right recommendation for metaldehyde toxicity — decontamination is the first step, but not a guarantee. Observation closes the safety loop and catches patients where the toxin was partially absorbed.\n\nThis recommendation teaches that decontamination is not the end — it is the beginning. Without observation, the owner may overlook the first tremor, which means the toxin was absorbed after all.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Metaldehyd",
      "wikiEn": "https://en.wikipedia.org/wiki/Metaldehyde",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-REC"
      ]
    },
{
      "id": "calcium-supplementation",
      "labelPl": "Suplementacja wapnia w diecie",
      "labelEn": "Calcium supplementation in diet",
      "infoPl": "Zalecenie suplementacji wapnia w diecie samicy ptaka polega na zapewnieniu stałego źródła wapnia — kości morskiej (sepia), bloków mineralnych lub preparatów wapniowych w wodzie. Hipokalcemia jest najczęstszą przyczyną zatrzymania jaja: bez wapnia mięśnie jajowodu nie mają siły wypchnąć jajo.\n\nW grze to właściwe zalecenie po leczeniu zatrzymania jaja — by zapobiec nawrotom. Samica, która znosi jaja bez odpowiedniej podaży wapnia, ryzykuje kolejne zatrzymanie.\n\nZalecenie uczy też, by ograniczyć ciągłe znoszenie jaj: zmniejszenie godzin światła, usunięcie bodźców gniazdowych, przesunięcie klatki. Mniej jaj to mniej ryzyka.",
      "infoEn": "Calcium supplementation in the diet of a female bird means providing a constant calcium source — cuttlebone (sepia), mineral blocks, or calcium preparations in water. Hypocalcemia is the most common cause of egg binding: without calcium the oviduct muscles lack the force to push the egg out.\n\nIn the game it is the right recommendation after treating egg binding — to prevent recurrence. A hen that lays eggs without adequate calcium intake risks another binding.\n\nThe recommendation also teaches limiting chronic egg-laying: reducing daylight hours, removing nesting stimuli, rearranging the cage. Fewer eggs mean less risk.",
      "wikiPl": "https://pl.wikipedia.org/wiki/Wap%C5%84",
      "wikiEn": "https://en.wikipedia.org/wiki/Calcium",
      "reviewStatus": "llm-audited",
      "reviewDate": "2026-08-11",
      "sources": [
        "S-MVM"
      ],
      "claimIds": [
        "C-RUB-REC"
      ]
    }
];

# Vikoušek a kouzelný svět — 3.0.0

Lesní údolí podle výtvarné předlohy: skutečný výškový svět, pěší výprava k zámku a jednoduchý čarovný let. React 19, TypeScript, react-three-fiber 9, Three.js 0.180, Vite a Vercel.

## Nové v 3.0

- Lesní mapa má 400 × 550 herních metrů. Hlavní klikatá cesta měří přibližně 713 metrů, zámek stojí na terase 95 metrů nad vstupem. Věže dosahují přibližně 136 metrů a okolní hřebeny přesahují letovou hladinu 140 metrů.
- Spojitý terén s údolím, svahy, horní zahradou a roklí. Hlavní most má vyrovnané nájezdy, tři menší mosty umožňují boční průzkum přes vodní ramena.
- Čtyři velké kaskády na východním svahu s navazujícími vodními plochami, upraveným dnem, skalami a vodní mlhou. Malý vodopád zůstává vstupem do původní tajné jeskyně.
- Nový zámek s pěti věžemi, růžovými střechami, okny, římsami a zahradními záhony.
- Měkčí koruny stromů a kameny, válcové kmeny, jemnější povrchy, sedm oblých modelů lesních zvířátek, zaoblený vlk a oblečení, podrobnější prameny vlasů. Vikoušek má v běžném světě přibližně 1,8 metru.
- Jemná záře světel a kouzel v podrobné grafice, barevné skalní svahy a mlha do dálky. Vzdálené koruny mají méně trojúhelníků; úsporný režim vynechává obrazové efekty. Automatické snížení kvality při dlouhodobě pomalém vykreslování zůstává.
- Pohyb, pomoc vlka, mapa, letové souboje, bezpečné přistávání, intro a výšky předmětů jsou přizpůsobeny novému světu. Let a návrat na zem nevyžadují ovládání výšky.
- Příběh nadále vyžaduje 10 diamantů, tři svatyně a osvobození 13 příběhových strážců. Dobrovolná zvířátka, zahrádky, stavění a tajemství zůstávají. Poušť si zachovává vlastní hranice i původní letovou hladinu 40 metrů.
- Staré lesní souřadnice se při načtení jednou převedou. Sesbírané věci a postup zůstanou. Interiér jeskyně a stavby na tvořivé louce zůstávají na svých vlastních souřadnicích.

## Ověření a rozsah

`npm test` ověřuje 115 scénářů včetně skutečného průchodu kolizní mapou obou světů, souboje samotným mečem, dokončení příběhu, migrace uložených pozic, výšek, přistání a mezí modelů. Lesní simulační trasa po regionálních zastávkách trvá přibližně 615 herních sekund; nejde o měření prvního hraní dítětem.

`npm run build` provádí kontrolu TypeScriptu a produkční sestavení. Prohlížečová kontrola pokrývá hlavní scenérie a mobilní rozložení. Fyzický iPhone/iPad, Safari a hraní dítětem jsou stále nutné k ověření výkonu a obtížnosti.

Výsledkem je stylizovaná hra vykreslovaná v reálném čase. Nejde o filmový render ani o zaručenou procentní shodu s referenční AI ilustrací. Domky a zámek jsou venkovní scenérie; jejich interiéry nejsou nové herní prostory. Hory vymezují mapu, nejsou dalším neomezeným světem. Uložení zůstává místní v prohlížeči.

## Spuštění

```sh
npm ci
npm test
npm run build
npm run dev
```

Zvukové efekty, původní hudba, česká hlasová pomoc a podrobná grafika jsou při prvním spuštění zapnuté. Uložené preference se respektují. Prohlížeč odemkne zvuk až po klepnutí. Přepínače zvuku, hudby, hlasu a grafiky jsou v pauze.

## Oba světy

Každý má vlastní mapu, deset diamantů, tři probouzená místa, třináct příběhových strážců, dvě fáze závěrečného souboje a truhlici. Dobrovolná tajemství a tři letové oblouky neblokují dokončení. Vysoké hory ohraničují všechny strany nad letovou hladinou. Chodit lze i mimo cesty a přes mírné kopce. Let má jedinou hladinu 40 m, automaticky mířené zlaté koule a bezpečné přistávání.

**Les:** vodopádová jeskyně, věneček, tři světla pro draka Auriho, vlk odhalující průchod, rozkvétající příroda a závěrečné setkání s Aurim. Osm pojmenovaných scenérií. Kravička, panda, modrý kamarád, prasátko, ovečka, zajíček a kočička.

**Poušť:** duny, palmové oázy, pyramida, barevné skály, větrná brána, tábor a sluneční chrám. Obnovené oázy vrátí vodu a květiny. Odměnou je Sluneční srdce. Noví velbloudi, pouštní lišky a skarabeové mají stejnou voxelovou mřížku 0,115 m jako lesní zvířátka.

V každém světě zůstává 70 putujících pozemních a 498 vzdušných obyvatel. Vedlejší souboje dovolují jen dva současné útoky. Začátek každého dobrodružství má přeskočitelný minutový živý 3D průlet; pak čeká na tlačítko Hrát. Pokračování uložené hry intro neopakuje.

Na bezpečné tvořivé louce v lese lze stavět na 18 × 18 polí, do osmi kostek výšky a do 600 kostek celkem. Pět materiálů, guma, krok zpátky a obrázková předloha domečku. Lesní poklad odemkne hvězdnou kostku. Vlk, zvířátka a Auri navštěvují výtvor. Stavění nemění terén dobrodružství.

## Ovládání a zvuk

Na dotykové obrazovce: levé kolečko pro pohyb, meč pro úder či střelu, skok a LET/DOLE. Podržený meč opakovaně vyšle silný úder. Tažením po volném obrázku otáčíš pohled. Pauza ukrývá mapu, nastavení a návod.

Klávesnice: WASD nebo šipky, J meč, mezerník skok, K kouzlo, F chůze/let, Q/C otočení kamery, R pohled na sever, E interakce, M mapa, Escape pauza. Myší klikneš pro meč nebo táhneš pro kameru.

Při první návštěvě jsou efekty, hudba, hlasová pomoc a podrobná grafika zapnuté. Dříve uložené preference se respektují. Prohlížeč odemkne zvuk až po prvním klepnutí či stisku klávesy. Při pomalém vykreslování se může automaticky zapnout úsporná grafika. Hudba, efekty a hlasová pomoc mají vlastní přepínače.

## Ukládání a kompatibilita

Staré adresy a klíče úložiště zůstávají funkční: `vicky-forest-save-v1`, `vicky-desert-save-v1`, `vicky-creative-meadow-v1`, `vicky-forest-reward-v1` a `vicky-desert-reward-v1`. Lesní uložení bez pole `level` je stále kompatibilní. Změna názvu hry nemaže postup ani stavby. Každý svět se ukládá samostatně v daném prohlížeči; mezi zařízeními se postup nesynchronizuje.


## Grafická ukázka 3.0.1 — začátek Kouzelného lesa

Samostatná výtvarná zkouška pro vstupní cestu a jeskynní vodopád: zaoblená kamenná dlažba, prostorové papradiny a květy, tráva, drobné listy v korunách, mechové kameny, členitější skalní kulisa a voda s proudy, pěnou, odlesky a jemnou tříští. Nové rostliny jsou instancované; úsporné nastavení omezuje jejich počet. Terén, kolize, souřadnice cílů a ukládání se nemění. Druhý level používá původní vodní materiál.

Tato ukázka stále používá WebGLRenderer. Přechod na WebGPU není součástí této první výtvarné zkoušky. Před ním je potřeba převést vlastní shadery a postprocessing a porovnat výkon na skutečných zařízeních.


## Výběr postavy 3.0.2

V hlavním menu si dítě vybere Vikouška nebo slepici. Nová originální 3D slepice má velké oči, červený hřebínek, oranžový krk, zelenomodré peří a zakřivený ocas podle dodané vizuální reference. Má vlastní animace běhu, hlavy, křídel, skoku, letu a meče. Zvolená postava funguje v obou světech, v intru i na tvořivé louce. Volba se ukládá samostatně pod `vikousek-character-v1`; nemění uložený příběh, stavbu, rychlost, sílu ani kolize.

Aktuální náhled testovací větve: https://vicky-carovny-svet-git-upgrade-forest-art-slice-balazmarek-2201.vercel.app/

## Finální výtvarná a herní úprava lesa 3.1.0

Celá hlavní trasa nyní sdílí kamennou dlažbu, prostorové květiny, trávu a kapradiny. Drobné dekorace se vykreslují v okolních buňkách, zatímco vzdálený les používá jednodušší geometrii. Tři původní rodiny stromů a mechový kámen jsou vlastní modely GLB (glTF 2.0), dohromady 346 144 bajtů. Modely mají normalizované měřítko, počátek u země a dvě úrovně detailu; kolize a původní souřadnice cílů zůstávají autoritou. Při selhání stahování modelů zůstává jednoduchá místní náhradní geometrie. Zdroj modelů je v `scripts/forest-assets.mjs`; `npm run assets:build` je přegeneruje, `npm run test:assets` kontroluje strukturu a rozpočty. Žádné placené ani cizí modely.

Všechny hlavní vodopády používají proudy, pěnu a odlesky. Kamenné břehy, drobné zídky a opěry zámku doplňují kompozici. Oblaka mají zaoblené siluety. Vikoušek a vlk mají měkčí tvary; lesní skřítek a kostěný strážce mají nové prostorové modely s pohyblivými končetinami. Kamera kontroluje také kmeny, při změně rozehrané hry se správně přemístí. Simulace má vlastní frame hook oddělený od kamery.

Na zemi zahajuje útok jen jeden příběhový strážce nebo jedno okolní zvířátko; ve vzduchu mohou varovat nejvýše dva útočníci. Příběhoví strážci mají nejméně 1,1 s přípravu, po zranění je 2,2 s ochrany. Počty obyvatel, diamanty, svatyně, souboje s finálním strážcem, stavby, uložený postup i druhý level zůstávají zachovány. HUD má oddělené malé skupiny v horních rozích.

### Renderer a místní ověřování

Dětská testovací verze zůstává na **WebGL2**. `qa/engine-check.html` je samostatná vývojová zkouška WebGPURendereru a vody v TSL; `?backend=webgl` ověří jeho WebGL backend. Oba backendy vykreslí nové GLB modely a vodu. Současné efekty založené na `onBeforeCompile`, GLSL a EffectComposer však nemají automatickou shodu, proto se WebGPU nepřepíná do hry. Výsledek není benchmark celé hry ani doklad rychlejšího WebGPU. WebAssembly není přidáno.

`qa/playtest.html?qa=1` nabízí místní kontrolní stanoviště bez změn skutečných uložených her. Obě QA stránky jsou určeny vývojovému serveru a nejsou produkčními vstupními stránkami. `?qa=1` v hlavní hře zapíná pouze opt-in textový výpis FPS a počtů vykreslení. Běžná dětská adresa jej neobsahuje.

Cílová mobilní rychlost je stabilních 30 FPS; skutečný iPhone/iPad se Safari a delší zahřívání musí potvrdit test na zařízení. Responzivní náhled na stolním Chrome není náhradou tohoto měření. Po této verzi se mají řešit chyby a zkušenosti z dětského hraní, nikoli přidávat další povinné úkoly.

## Kamarádi 3.2.0

Každé osvobozené zvířátko zůstává natrvalo kamarádem. Sbírka má deset míst: sedm lesních zvířátek a tři pouštní (velbloud, pouštní liška, skarabeus). Ukládá se samostatně pod `vikousek-friends-v1`, takže ji nesmaže dokončení příběhu, restart levelu ani nové dobrodružství.

- První osvobození každého druhu ohlásí cedulka „Nový kamarád" a český hlas. Další zvířátka téhož druhu jen zvyšují počet v albu.
- Album Kamarádi je v hlavním menu i v pauze. Chybějící kamarádi jsou vidět jako siluety s otazníkem.
- Lesní kamarádi se trvale procházejí po tvořivé louce kolem stavební plochy. Dřívější tři návštěvníci stavby (zajíček, ovečka, kočička) přicházejí k postavené stavbě stejně jako dříve.
- Pouštní kamarádi jsou zatím jen v albu; na louku nechodí.

Příběh, souboje, počty obyvatel ani uložené hry se nemění. Verze 3.2.0 ověřovala 126 scénářů. Cedulka byla v prohlížeči ověřena přímým voláním herní logiky, ne skutečným soubojem; hraní dítětem na telefonu zůstává nutné.

## Dárky od kamarádů 3.3.0

Kamarádi nosí na tvořivou louku nové kostky, takže dobrodružství přímo rozšiřuje stavění.

| Kostka | Jak ji dítě získá |
| :--- | :--- |
| 💧 Voda | 1 kamarád |
| 🧱 Cihla | 2 kamarádi |
| ☁️ Mráček | 3 kamarádi |
| 🔮 Kouzlo | 5 kamarádů |
| 🪙 Zlato | 7 kamarádů |
| ☀️ Slunce | poklad Zlaté pouště |
| ⭐ Hvězda | Auriho poklad (beze změny) |

- Počítá se počet různých druhů v albu, ne počet osvobozených zvířátek.
- Cedulka „Nový kamarád" ukáže i darovanou kostku a český hlas ji pojmenuje.
- Paleta ukazuje jen odemčené kostky a jeden zabalený dárek s počtem chybějících kamarádů. Album říká, kolik kamarádů chybí do dalšího dárku.
- Na telefonu má paleta šest kostek v řadě, nejvýše dvě řady.
- Sluneční kostka se odemkne i hráčům, kteří poušť dokončili dříve. Dříve uložené stavby zůstávají platné.

Verze 3.3.0 ověřovala 128 scénářů. Paleta byla v prohlížeči zkontrolována na počítači a v mobilní šířce na výšku i na šířku s předvyplněnou sbírkou; skutečný telefon a hraní dítětem zůstávají nutné.

## Rychlý start, dotykové ovládání a otřesy 3.4.0

**Rychlý start**
- Tlačítko „Hrát hned" na úvodním filmu spustí hru okamžitě, bez mezikroku „Připravená?".
- Úvodní film se přehraje jen při první návštěvě každého světa (`vikousek-intro-seen-v1`). Další nové hry začínají rovnou hraním; film je dál dostupný tlačítkem „Úvodní film" v menu.
- Když film doběhne sám, dál čeká na tlačítko Hrát. Jeho poslední záběr stál 2,6 m od dvou kmenů uvnitř korun; nový stojí na cestě s 5 m volného místa.
- Návod začíná čtyřmi obrázkovými kartami a jednou radou. Původní podrobný text a klávesy zůstaly pod „Podrobný návod pro rodiče".

**Dotykové ovládání**
- Na dotykových zařízeních spouští joystick celý levý dolní roh (40 % šířky, 44 % výšky). Kroužek se objeví pod palcem a následuje ho, když palec ujede. Na počítači s myší se nic nemění.
- Telefony s podporou vibrací (Android) krátce zavibrují při zásahu, zranění, diamantu, osvobození, svatyni a výhře. iOS Safari vibrace nepodporuje.

**Dojem ze hry**
- Kamera se krátce zachvěje při osvobození, silném úderu, rozbití kořene, svatyni, proměně strážce, výhře, dopadu a jemně při diamantu. Otřes vždy do půl sekundy odezní.
- Otřesy i vibrace se vypnou, když má zařízení zapnuté omezení pohybu.

`npm test` ověřuje 130 scénářů. V prohlížeči byl ověřen návod, okamžitý start, druhý start bez filmu a plovoucí joystick simulovaným dotykem v mobilní šířce. Otřes kamery, vibrace a skutečný dotyk na telefonu ověřeny nebyly.

## Počasí a atmosféra 3.5.0

Les teď žije počasím. Vše je jen ozdoba: kolize, příběh, souboje ani uložené hry se nemění.

- **Jemný déšť** padá jen pod nejtěžšími mraky, asi minutu z každých pěti. Poprvé zhruba po minutě a čtvrt hraní. Neprší v poušti, v jeskyni, v menu, v úvodním filmu ani na tvořivé louce. K dešti patří tichý šum.
- **Duha** se objeví nad cestou před Vikouškem, když se déšť vyčasí a svítí slunce, a zůstane necelou minutu. Po výhře se malá duha vždy rozklene nad pokladem.
- **Večerní světlušky**: za denního světla poletuje kolem hrdinky šedesát světýlek jako dřív; za šera jich přibude čtyřicet, zvětší se a dostanou měkkou zář. Platí i v poušti.
- Na slabších zařízeních padá méně než polovina kapek.

`npm test` ověřuje 132 scénářů. V prohlížeči na počítači byl na stránce `qa/playtest.html` s ručně posunutým herním časem vidět déšť, duha nad lesem, světlušky za šera, malá duha nad pokladem a poušť bez deště. Neověřeno: zvuk deště poslechem, mobilní šířka na výšku, rychlost na skutečném telefonu a přirozený průběh počasí při běžném hraní bez posunu času.

## Obloha, barvy a drobné efekty 3.6.0

První krok ke krásnější grafice. Vše je jen ozdoba: kolize, terén, příběh, souboje ani uložené hry se nemění.

- **Obloha s hloubkou** (les): místo jedné barvy se nebe nad hlavou prohlubuje do modré, za šera do fialové a pod mraky šedne. U slunce je měkká záře. Obzor má dál barvu mlhy, takže se do něj vzdálené hory rozplývají jako dřív.
- **Pohádkové barvy** (jen podrobná grafika): o něco sytější obraz a jemné ztmavení k rohům. Bez rozostření.
- **Drobné částice**: prach od nohou při běhu a kroužek prachu po doskoku (podle povrchu: cesta, tráva, písek, kámen), šplíchance kapek na zemi za deště, jiskřičky nad diamanty a probuzenými svatyněmi, pyl ve slunci a padající lístky v lese. Nejvýše 240 částic najednou, v úsporné grafice polovina.
- **Déšť**: kapky těsně před kamerou se už nekreslí, takže nepůsobí jako tlusté bílé čáry.

`npm test` ověřuje 134 scénářů. V prohlížeči na počítači byla na stránce `qa/playtest.html` vidět obloha ve dne, za šera, při letu i v úsporné grafice, sytější barvy, prach od nohou a déšť bez tlustých čar. Neověřeno: šplíchance, jiskřičky, pyl a lístky nebyly na snímcích spolehlivě rozeznat; prach v poušti a v jeskyni; mobilní šířka a rychlost na skutečném telefonu. Skutečně členitější terén a nové modely tato verze nepřináší.

## Rozkvetlý les 3.7.0

První level se přibližuje pohádkové předloze: cesta lemovaná květy, teplé světlo a lucerny. Jen Kouzelný les; poušť se nemění. Vše je ozdoba: kolize, terén, příběh, souboje ani uložené hry se nemění.

- **Květinové lemy**: přes jedenáct tisíc kvítků v sedmi barvách ve shlucích podél celé cesty a na osmi loukách, s trsy trávy. Jemně se vlní ve větru, za deště víc. Nerostou na dlažbě, ve vodě, na stavební ploše, u diamantů, svatyní ani u pokladu.
- **Úspora**: květy jsou jeden malý model kreslený po dlaždicích 32 m; dlaždice dál než 105 m (v úsporné grafice 70 m) se nekreslí. Úsporná grafika má asi šestinu květů.
- **Lucerny**: každá lucerna u cesty má teplou záři, ve dne sotva znatelnou, za šera a pod mraky silnější.
- **Okvětní lístky** poletují lesem spolu s listím.
- **Teplejší barvy** v podrobné grafice.

`npm test` ověřuje 135 scénářů. V prohlížeči na počítači byly na stránce `qa/playtest.html` vidět květy u vstupu ve dne i za šera, záře luceren, pohled z letu a úsporná grafika; konzole bez chyb. Neověřeno: rychlost (měření FPS se na QA stránce tentokrát nenačetlo), mobilní šířka a skutečný telefon, květy na vzdálenějších částech cesty a na loukách zblízka, vlnění v pohybu. Předloze se tato verze blíží barvami a hustotou květů, ne úrovní modelů, postav ani osvětlení.

## Světlo, poklady a kvetoucí koruny 3.8.0

Další krok k pohádkové předloze, jen v Kouzelném lese. Vše je ozdoba: kolize, terén, příběh, souboje ani uložené hry se nemění.

- **Kvetoucí koruny**: asi dva z pěti stromů do 16 m od cesty mají v koruně růžové, bílé nebo fialkové květy.
- **Mech a popínavky**: stromy u cesty mají mechový polštář u paty; na těch nejbližších se po kmeni vine kvetoucí popínavka.
- **Sluneční paprsky**: mezi kmeny padají jemné pruhy světla. Naklánějí se podle slunce, stojí na místě a mizí pod mraky, za deště, za šera a při letu.
- **Diamanty** mají měkkou modrou záři a sloupek světla, takže jsou vidět z dálky.
- **Poklad** jiskří zlatě; **meč** při každém švihu odhazuje zlaté jiskry (světelná stopa meče byla už dřív).
- Úsporná grafika má asi šestinu ozdob korun, bez popínavek a méně paprsků.

`npm test` ověřuje 136 scénářů. V prohlížeči na počítači byly na stránce `qa/playtest.html` vidět květy v korunách, záře a sloupek světla diamantu a úsporná grafika; konzole bez chyb. Paprsky byly napoprvé příliš silné a zakrývaly výhled, proto jsou teď velmi jemné – po ztlumení jsem je na snímku spolehlivě nerozeznal. Neověřeno: jiskry meče a pokladu, mech a popínavky zblízka, rychlost (měření FPS se nenačetlo), mobilní šířka a skutečný telefon.

Z předlohy dál chybí: členitější terén, oblé postavy, nové modely stromů, zámek na skále s vodopády a kamenný most, odlesky na vodě.

## Zámek na skále a kamenný most 3.9.0

Jen Kouzelný les. Vše je ozdoba: kolize, terén, příběh, souboje ani uložené hry se nemění.

- **Skalní stěna za zámkem**: za Auriho zámkem se zvedá rozeklaná skála se zelenými čepicemi a dvěma vodopády s mlhou u paty. Stojí celá za hranicí světa, kam se nedá dojít.
- **Praporky**: na pěti věžích zámku vlají růžové a zlaté praporky.
- **Kamenný most**: most přes rokli má po stranách kamenné zídky, pod mostovkou tři kamenné oblouky a v rozích čtyři lucerny se září. Dřevěná mostovka i zábradlí zůstaly, šířka pro chůzi je stejná.

`npm test` ověřuje 137 scénářů. V prohlížeči na počítači byly na stránce `qa/playtest.html` vidět skála s oběma vodopády z letu, vodopád ze země, kamenné zídky a lucerny mostu; konzole bez chyb. Na stolním počítači v panelu prohlížeče ukázalo měření u mostu 81 FPS při 347 voláních vykreslení a 1,7 milionu trojúhelníků – to nic neříká o telefonu. Neověřeno: praporky a oblouky pod mostem jsem na snímcích nerozeznal, mlha u vodopádů zblízka, mobilní šířka a skutečný telefon. Stávající čtyři vodopády v údolí, vesnička a model zámku se neměnily.

## Oblejší postavy 3.10.0

Vikoušek, vlk a dráček Auri mají měkčí, pohádkovější tvary. Postavy jsou společné pro les i poušť, takže se změna projeví v obou světech. Pohyb, animace, kolize, souboje ani uložené hry se nemění.

- **Vikoušek**: ruce, nohy a trup jsou zaoblené téměř do válečků, hlava je o 14 % větší a oči o něco větší.
- **Vlk**: zaoblené tělo, tlapky a čenich, hlava o 12 % větší.
- **Auri**: tělo z oblých tvarů místo kostek, světlé bříško, velké přátelské oči a nozdry.
- Slepičí hrdinka, osvobozená zvířátka a strážci se neměnili.

`npm test` ověřuje 137 scénářů (beze změny; tvar postav testy nepokrývají). V prohlížeči na počítači byly na stránce `qa/playtest.html` vidět Vikoušek a vlk zepředu a Auri u pokladu; konzole bez chyb. Okno aplikace nebylo při kontrole otevřené, proto byly snímky pořízeny ručně spouštěným vykreslováním bez běžící hry – animace chůze, útoku a letu s novými tvary tedy ověřeny nebyly. Neověřeno také: postavy v poušti, mobilní šířka a skutečný telefon. Srst, vlasy z pramenů navíc ani nové modely zvířátek tato verze nepřináší.

## Členitější terén 3.11.0

Jen Kouzelný les. Lesní půda mimo cestu už není hladká: zvlní ji kopečky a prohlubně o šířce několika metrů a výšce do 3 m.

- **Co se mění**: jen výška země. Hrdinka, vlk, zvířátka, stromy, květy i kamera ji sledují automaticky.
- **Co zůstává**: kam se dá dojít. Sklon chůzi v této hře nikdy neblokoval a všech 3 697 stromů a skal stojí přesně tam, kde stály (rozmístění se dál řídí původním terénem). Uložené hry proto nepotřebují žádný převod.
- **Kde zůstává rovina**: cesta a pruh 4 m kolem ní, diamanty, svatyně, poklad, osm luk, stanoviště strážců, domečky a jejich pěšiny, jeskyně, tvořivá louka, most, vodopády a zámek.

`npm test` ověřuje 138 scénářů. Před změnou a po ní bylo porovnáno 24 339 bodů celé mapy: průchodnost se nezměnila v žádném z nich, výška ve třech čtvrtinách, nejvýše o 2,9 m. V prohlížeči na počítači byly na stránce `qa/playtest.html` vidět zvlněná půda mimo cestu se stromy správně na zemi a rovná cesta se svahem po straně. Okno aplikace nebylo otevřené, snímky jsou ze stojící scény – chůze přes kopečky, chování kamery ve svahu a zvířátka v pohybu ověřeny nebyly. Neověřeno také: drobné stavby mimo cestu (vyhlídky, kruhy kamenů na mýtinách) na nové půdě, mobilní šířka a skutečný telefon. Terasy, skalní stěny a rokle, které by chůzi omezovaly, tato verze nepřidává.

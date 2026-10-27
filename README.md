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

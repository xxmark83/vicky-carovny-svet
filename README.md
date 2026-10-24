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

`npm test` ověřuje 115 scénářů včetně skutečného průchodu kolizní mapou obou světů, souboje samotným mečem, dokončení příběhu, migrace uložených pozic, výšek, přistání a mezí modelů. Lesní simulační trasa po regionálních zastávkách trvá přibližně 414 herních sekund; nejde o měření prvního hraní dítětem.

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


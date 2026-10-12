# Vikoušek a kouzelný svět · 2.3

Dvě hratelná 3D dobrodružství: **Kouzelný les** a **Zlatá poušť**. React, TypeScript, Three.js/react-three-fiber a Vite. Hra běží v prohlížeči bez účtu a backendu.

- Hra: https://vicky-carovny-svet.vercel.app/
- Zdrojový kód: https://github.com/xxmark83/vicky-carovny-svet

## Nové ve verzi 2.3

Celá hra má české texty, návody, názvy zvířátek a příběhy. Hrdinka se jmenuje Vikoušek, při přímém oslovení „Vikoušku“. Nové jméno je i v menu, názvu stránky a na tričku.

Zlatý meč má vlastní zvuk švihu, silného úderu a střely. Dopad, cinknutí štítu, rozbití kořene či pečeti a rozpadnutí kletby znějí odlišně. Osvobození doprovází veselá stylizovaná odpověď daného zvířátka. Zvuky vznikají přímo pomocí Web Audio; nejde o nahrávky skutečných zvířat ani převzaté zvukové efekty.

Zvukové události používají samostatnou frontu: úder už nepřepíše zásah a osvobození. Plošný útok slučuje stejné zvuky, aby dvanáct zvířátek nespustilo dvanáct stejných fanfár najednou. Krátké obálky a kompresor omezují přebuzení. Hudba mírně ustoupí efektům a výrazněji vyprávění.

Vyprávění vybírá výhradně český systémový hlas, přednostně dostupný hlas v zařízení. Čeká i na opožděné načtení seznamu hlasů. Intro představuje zvířátka; při hraní zazní příběhové okamžiky, první a poslední diamant a krátká pomoc vlka. Každý běžný zásah ani diamant nekomentuje. Při pauze a změně světa se řeč zastaví. Pokud český hlas není dostupný, nastavení to vysvětlí a pokyny zůstávají na obrazovce. Konkrétní zabarvení hlasu závisí na zařízení; nejde o studiově namluvenou vypravěčku.

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

## Spuštění a ověření

```sh
npm ci
npm test
npm run build
npm run dev
```

109 automatických testů ověřuje oba světy, dokončení příběhu, pohyb, let, stavění, ukládání a nové zvukové události i výběr českého hlasu. Produkční build je úspěšný. V Chrome byla navíc měřena skutečná syntéza 33 zvukových scénářů, samostatné přepínače hudby a efektů a ztišení hudby při řeči.

Mobilní rozměry v prohlížeči ověřují rozložení, nenahrazují fyzický iPhone/iPad ani zkoušku dítětem. Cílových 5–10 minut prvního hraní je nutné ověřit s Vikouškem. Grafika je stylizované procedurální voxelové 3D; nelze slíbit měřitelnou procentní shodu s referenční ilustrací.

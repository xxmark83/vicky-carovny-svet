# VICKY A ČAROVNÝ SVET

Hrateľný **level 1 — Čarovný les**. React 19, TypeScript, Three.js/react-three-fiber, Vite. Bez backendu alebo API kľúčov.

- Hra: https://vicky-carovny-svet.vercel.app/
- Zdroj: https://github.com/xxmark83/vicky-carovny-svet

## Verzia 1.7 — rozprávkové údolie a pohorie

Schválené grafické body 1–4 a horské hranice, stále iba level 1. Vicky má jemnejšie tvarované oblečenie a ruky, upravené oči, uši a krk, súvislý cop z polygonálnych prameňov s modrou gumičkou a štíhlejší zlatý pixelový meč. Vlk má členitú srsť, líca, špicaté uši, oči s odleskom, samostatné labky a huňatý chvost; používa pôvodné stabilné nasledovanie a krokový rytmus.

Osem existujúcich čistiniek dopĺňajú asymetrické skupiny kvetov, machové kamene, lavičky, paprade, veľké huby a ružové stromy. Koruny stromov sú nepravidelnejšie a majú bočné vetvy. Úvodné údolie má pozvoľnejší nástup svahu. Vodopád nad pôvodnou jaskyňou má tri kaskády, členitú skalu a animovanú penu. Rieka, potok a jazierko používajú zlúčené vodné plochy s pohybom lesku; most má zavesené lanové spoje. Voda je štylizovaná, bez nákladných odrazov celej scény.

Svetlo má výraznejší rozdiel medzi slnkom a tieňom, teplé svietiace lampáše a lúče ukotvené pri čistinkách. Dlhší dohľad a farebný opar umožňujú vnímať pohorie počas letu. Zachovaný je plynulý cyklus rána, dňa, večera a oblačnosti.

Kamera je bližšie za Vicky, s osobitným záberom pre výšku/šírku obrazovky a let. Pri stromoch nemení sama zvolený smer; kmeň, lístie a kvety medzi kamerou a hrdinkou sa dierujú. Pri skalách sa priblíži a pri svahoch zdvihne nad viditeľné schody terénu. Chodidlá Vicky a labky vlka sa pri chôdzi zarovnávajú k viditeľnému povrchu; na moste k doskám.

Pôvodné skladané štvorcové pyramídy nahradilo súvislé členité pohorie: širšie predhorie s ihličnanmi, skalné doliny, hrebeň približne 75–115 m a nepravidelný sneh na najvyšších miestach. Pohorie obopína všetky strany aj rohy, nad spoločnou letovou hladinou 40 m. Herná plocha a jej hranice zostali rovnaké.

Príbeh, uloženia, 10 diamantov, 3 svätyne, 13 príbehových strážcov a finále ostávajú. Nové protivnícke modely z bodu 5, hlasové repliky a vzdelávací obsah nie sú súčasťou tohto balíka.

## Verzia 1.6 — živé postavy a zlatý meč

Schválené body 1, 2 a 4; stále iba level 1. Vicky má pohľad očí, žmurkanie, úsmev, prekvapenie a odhodlaný výraz. Beh vychádza z prejdenej vzdialenosti; trojdielny cop s modrou gumičkou reaguje na zrýchlenie a otáčanie. Pristátie vytvorí krátky obláčik a vlk sa poteší. Úvodná kamera je nad terénom, aby svah nezakrýval hrdinku.

Sedem putujúcich druhov sa správa odlišne: kravička vopred označí smer a rozbehne sa; panda pomaly otáča predný štít; modrý kamarát vystrelí pomalú viditeľnú guľu; prasiatko kľučkuje a krátko vyrazí; ovečka vytvorí preskočiteľnú vlnu; zajačik sa pohybuje v poskokoch a vyskočí dopredu; mačička obieha a skočí. Rozbehy nemenia smer po varovaní. Naraz sa rezervujú najviac dva útočné sloty. Zvieratká držia odstup od Vicky, krídla sa hýbu a vzdušné skupinky putujú za spoločnými cieľmi. Po odkliatí nasleduje päťsekundový úsmev, srdiečko a oslava, potom zvieratko odíde v kúzle. Uložené odkliatie zostáva trvalé; animácia sa po načítaní neopakuje.

**Ťukni = bežný úder. Podrž = automatický silný zlatý úder každých 1,05 s.** Prvý úder príde ihneď; zlatý sa spustí sám, netreba časovať pustenie. Rovnaké tlačidlo má kruhový ukazovateľ nabíjania, zlaté iskry, väčší dosah a pomoc s mierením. Zlatý úder prelomí pandin predný štít; finálny strážca stále vyžaduje tri korene. Vo vzduchu vyšle väčšiu silnejšiu guľu. Pauza, strata dotyku a zmena letu rozpracované nabíjanie zrušia. Otáčanie kamery nezačne úder pri krátkom potiahnutí. Nepribudlo žiadne herné tlačidlo, povinnosť, level, hlasové rozprávanie ani vzdelávací obsah.

## Základ verzie 1.5 — svet z kociek


Stále sa rozvíja iba prvý level. Príbeh Auriho a povinné dokončenie ostávajú: **10 diamantov, 3 svätyne, 13 príbehových strážcov, tri korene v druhej fáze strážcu pokladu a truhlica**. Jaskyňa, venček, letové oblúky a ďalšie súboje sú dobrovoľné.

- Nová hra začína preskočiteľným **14-sekundovým introm**: z roztrúsených kociek sa poskladá lesná miniatúra a postupne všetkých desať typov protivníkov, každý s názvom. Potom hra čaká na veľké tlačidlo **Hrať**. Čas úlohy ani nepriatelia počas intra nebežia. Pokračovanie rozhranej hry intro neopakuje. Samostatný komponent `LevelIntro` je pripravený na rozšírenie pri budúcich leveloch; ďalšie levely teraz nevznikli.
- Plocha mapy narástla **presne o 25 %**: zo 140 × 346 na **175 × 346 m**. Šesť nových bočných čistiniek obsahuje spadnuté stromy, škvrnité huby, kamenné kruhy, veľké paprade, terasy a lampáše. Povinné predmety ostali na pôvodných miestach. Lesom možno chodiť do strán, cez svahy a cez most.
- **83 protivníkov na zemi**: 13 pôvodných príbehových strážcov a 70 voľne putujúcich zvieratiek. Sedem typov zo súboru `kostickovy-3d.zip` má každý desať nových pozemných kusov: kravička, panda, modrý kamarát, prasiatko, ovečka, zajačik a mačička. Pri požadovanom minime všetkých druhov je počet vyšší než +350 % oproti pôvodným 13.
- **498 protivníkov vo vzduchu**: šesťnásobok celkového počtu pozemných, teda o 500 % viac. Z každého importovaného typu je 71 alebo 72 kusov. Všetci sa simulujú a pohybujú po ohraničenej mape; vzdialené a neviditeľné modely sa nevykresľujú. Putujúce pozemné zvieratká hľadajú priechod okolo kmeňov a cez most. Pôvodní príbehoví strážcovia ostávajú pri svojich oblastiach, aby zostali jasné väzby na svätyne.
- Let má **jednu spoločnú výšku 40 m**. Prepínač vezme Vicky hore alebo bezpečne pristane na najbližšej voľnej zemi. Žiadne tlačidlá výšky. Meč počas letu vystreľuje zlaté gule s automatickým mierením na blízke vzdušné zvieratká; zásahy majú skutočné herné účinky. Vzdušné útoky môžu Vicky zraniť, pozemné na ňu vo vzduchu nedosiahnu.
- Najviac dvaja najbližší dobrovoľní protivníci naraz pripravujú útok s viditeľným varovaním. Pri svätyniach, štarte, truhlici a blízkom príbehovom boji ďalšie pozemné zvieratká neútočia. Nie je potrebné poraziť všetkých 581 postavičiek.
- Horský okraj zavedený vo verzii 1.5 je vo verzii 1.7 nahradený súvislým členitým pohorím nad letovou hladinou. Hranice blokujú chôdzu aj let. Kamera zostáva vnútri okraja mapy.
- Jemný šesťminútový cyklus **ráno – deň – večer**, samostatné plynulé zmeny oblačnosti až po zamračenie, viditeľné slnko, zmena farby oblohy a hmly, pohyblivé smerové svetlo a tiene. Les sa nemení na nečitateľnú nočnú tmu. Pauza zastaví herný čas aj cyklus.
- Vlk sleduje vyhladený smer pohybu Vicky, nie prudké otočenia pri útoku. Má pomalší dobeh, pásmo zastavenia a krokovú animáciu odvodenú zo skutočne prejdenej vzdialenosti. Hľadanie cesty cez rieku používa most aj pri dlhom návrate.
- Detský HUD: hore iba srdiečka, diamanty, svätyne a pauza. Dole joystick, veľký meč, skok a let; počas letu skok zmizne. Pohľad sa otáča potiahnutím po voľnej scéne. Mapa, zvuk, hudba, pomoc, nastavenia a reštart sú v pauze. Vzdelávacie vysvetlenia zostávajú na budúci upgrade.

## Ovládanie

| Akcia | Počítač | Dotyk |
|---|---|---|
| Pohyb | WASD / šípky | ľavý joystick |
| Meč / vzdušná streľba | J / klik; podržanie nabije zlatý úder | ťuknúť / podržať veľký meč |
| Skok na zemi | medzerník | SKOK |
| Zlaté kúzlo, voliteľná skratka | K | základné ovládanie ho nevyžaduje |
| Zem / jedna letová hladina | F | LET / DOLE |
| Pohľad | ťahanie myšou, Q / C, R sever | potiahnuť po scéne |
| Svätyňa, jaskyňa, vlk, truhlica | E | kontextové zlaté tlačidlo |
| Mapa / pauza | M / Esc | pauza → mapa |

Postup sa ukladá v tomto prehliadači. Staré pozície verzie 1 ostávajú kompatibilné; stará výška letu sa pri načítaní prevedie na spoločnú hladinu. Nové voliteľné pole si pamätá aj odkliate putujúce zvieratká. Po neúspechu sa pokračuje od svätyne; hlavný postup ostáva.

## Lokálne spustenie a overenie

Node.js 22.12+ alebo 24+, npm:

```
npm ci
npm run dev
npm test
npm run build
```

53 automatických testov kontroluje celú cestu po skutočnej kolíznej mape až po víťazstvo, hlavné súboje, uloženia, voľný pohyb, pevnú letovú hladinu, strely, počty druhov, nové čistinky, hranice, počasie, intro aj stabilný dobeh vlka. Automatický priechod trvá približne **224 herných sekúnd**, aj iba s mečom bez klávesnicového kúzla. To nie je meranie prvého hrania dieťaťa; priemer 5–10 minút treba potvrdiť používateľským hraním.

Grafika používa zdieľané geometrie a instancie pre zvieratká, orezanie mimo pohľadu, priestorové bunky pre kolízie, zlúčené viditeľné povrchy terénu a automatickú úspornú kvalitu. Úsporný les má približne 55 tisíc dekoračných kociek namiesto 178 tisíc detailných. Three.js tvorí veľký samostatný balík; build na jeho veľkosť upozorňuje.

## Nasadenie a limity

Vercel automaticky zostaví aktualizácie vetvy `main`: `npm run build`, výstup `dist`.

Vicky a zvieratká sú procedurálne kockové modely; nejde o detailné profesionálne modely z referenčného obrázka. Zvieratká zo ZIP sú prerobené na 3D povrchové kocky s veľkosťou 0,115 m. Overenie mobilných rozmerov v Chrome nenahrádza fyzické hranie na iPhone/iPad v Safari. Na starších zariadeniach treba používať úspornú grafiku; stabilné FPS na každom zariadení nie sú zaručené. Intro zatiaľ pomenúva postavičky textom, bez nahovoreného vzdelávacieho výkladu.

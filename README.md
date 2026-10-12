## Verzia 2.0 — tvorivá lúka, živšie zvieratká a skalné scenérie

Stále jediný level **Čarovný les**: 10 diamantov, 3 svätyne, rovnaký príbeh a finále.

- **Tvorivá lúka pri úvode**: 18 × 18 polí, do 8 kociek na výšku, najviac 600 kociek. Tráva, drevo, kameň, ružové a kvetinové kocky. Vstup tlačidlom v hlavnom menu alebo pri lúke počas chôdze. Dobrodružstvo pri stavaní odpočíva; hráčka sa vráti na pôvodné voľné miesto.
- Klik/tap na zem položí kocku, na vrch alebo bok existujúcej pridá susednú. Priehľadný náhľad, guma, 50 krokov histórie, otočenie kamery po 45° a priblíženie. Kocky potrebujú spojenie so zemou; po odstránení opory sa odpojené vrátia do košíka (jedným krokom späť sa obnoví celá časť).
- Stavba sa samostatne ukladá do `vicky-creative-meadow-v1` v localStorage každých 500 ms po zmene a pri odchode/skrytí stránky. Zostane pri reštarte aj víťazstve. História krokov sa zachová počas otvorenej hry, neukladá sa medzi obnoveniami stránky. Pri zlyhaní úložiska sa zobrazí upozornenie. Stavba nie je synchronizovaná medzi zariadeniami.
- Lesné zvieratká sa pohybujú mimo bezpečnej lúky. Nové kocky blokujú chôdzu pri zemi; pristávanie hľadá voľný stĺpec, neprechádza cez strechu. Predmety, hlavná cesta a príbeh ležia mimo stavebného pozemku.
- Sedem druhov má spoločné efektívne animácie nôh a vlastné blízke gestá: kravička skláňa hlavu, panda zdvíha ruky, zajačik skáče a hýbe uškami, mačička kýva chvostom. Zásah rozhýbe telo/hlavu, oslobodené zvieratko sa poteší a roamingové potom odbehne. Priestorové voxelové telá, počty obyvateľov a pravidlá súbojov zostávajú zachované.
- Vodopád má nepravidelné skalné vrstvy, tri podopreté kaskády, mokré brehy, paprade a penu na troch úrovniach. Horské ohraničenie má erózne žľaby, skalné ramená, sedlá a výraznejšie skalné steny. Vrcholy naďalej prevyšujú letovú hladinu.
- Responzívne stavebné ovládanie: veľké tlačidlá, mobil na výšku/šírku a tablet. Nepoužíva nové knižnice, externé modely ani platené služby.

Overenie: 82 automatických testov vrátane dvoch úplných prejdení príbehu, build a vizuálne/funkčné skúšky v Chrome. Rozmery telefónu/tabletu sú simulované; fyzický iPhone/iPad a Safari neboli overené. Grafika je štylizované procedurálne 3D, nie reprodukcia referenčnej ilustrácie. Stavanie sa týka tvorivej lúky; terén celého lesa sa nekopá ani neprestavuje.

---

# VICKY A ČAROVNÝ SVET

Hrateľný **level 1 — Čarovný les**. React 19, TypeScript, Three.js/react-three-fiber, Vite. Bez backendu alebo API kľúčov.

- Hra: https://vicky-carovny-svet.vercel.app/
- Zdroj: https://github.com/xxmark83/vicky-carovny-svet

## Verzia 1.8 — tri zážitky a priestorové zvieratká

Stále iba level 1. Vlk pri vodopáde dôjde k tajnému miestu: listový záves sa rozostúpi a zlaté labky ukážu vstup do pôvodnej jaskyne. Odhalenie je dobrovoľné a zapamätá sa v uložení. Pri obnovení sa záves znovu nezatvára; objavené staršie tajomstvo ho otvorí automaticky.

Každá prebudená svätyňa vyšle rozširujúci sa svetelný kruh, rozkvitnú okolité kvety a priletia farebné motýle. Rozžiari sa aj povrch terénu a blízke stromy. Vlna trvá osem sekúnd, kvety a jemné svetlo ostávajú. Uložená svätyňa neopakuje celú animáciu po každom načítaní.

Po troch svetlách Auri pri pozemnom príchode k finále krátko pristane vedľa Vicky. Osemsekundové stretnutie zahŕňa zostup, približne štyri sekundy pri zemi, zlaté iskry, reakciu vlka a odlet. Hráčka sa môže hýbať, otáčať kameru aj pokračovať; návšteva nie je ďalšou podmienkou truhlice. Krátke bezpečné okolie pristátia zabráni prerušeniu stretnutia útokom. Pri vzlietnutí Vicky Auri rovno odlieta. Stretnutie sa pamätá v uložení.

Sedem zvieratiek má nové skutočne priestorové telá na pôvodnej mriežke 0,115 m: kravička so štyrmi kopytami, rohmi, škvrnami a chvostom; panda s bruškom a oddelenými labami; modrý kamarát, prasiatko, huňatá ovečka, zajačik s dlhými ušami a mačička s chvostom. Sú rozpoznateľné spredu aj zboku. Používajú ich putujúce pozemné aj vzdušné kusy, príbehové zvieracie stráže aj skladané intro. Krídla, odlišné útoky a pôvodné počty ostali.

Zlatá stopa sa skladá zo skutočných polôh čepele počas švihu. Pri odkliatí odletujú fialové kocky zo zvieracieho objemu a zostáva usmievavé zvieratko so srdiečkom a krátkou oslavou. Chôdza zvieratiek má drobný pohyb jednotlivých nôh; susedné živé zvieratká si držia odstup. Naraz stále útočia najviac dvaja dobrovoľní protivníci. Kontextové hladkanie vlka sa počas blízkeho putujúceho súboja skryje.

Kamera je mierne cez plece, aby Vicky nezakrývala cieľ. Autorské kvety a oblúky pri kamere používajú rovnaké dierovanie ako lístie. Nevznikli nové tlačidlá ani povinné zbery. Skryté steny zvieracích kociek sa nevykresľujú: jeden nový model má približne 1 600–2 300 trojuholníkov. Intro používa uzavreté povrchové kocky, aby sa postavičky správne skladali.

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

## Upgrade 1.9 — hrdinka, scenérie, pomoc a finále

- Vicky má jemnejšiu tvár a oči, otvorenejšiu ofinu, výraznú modrú gumičku, pokojnejší krok a plynulé ohýbanie lakťov. Pri diamante sa poteší rukou, pri svätyni ju zdvihne a pri čuchajúcom alebo pomáhajúcom vlkovi sa obzrie. Pohyb, útok a let majú prednosť pred gestami.
- Tri ručne komponované miesta: mostík pri vodopáde s kvetinovými brehmi, rozkvitnutá lúka prvej svätyne a ružová záhrada smerom k hradu. Jemná lokálna hmla preberá aktuálnu farbu slnka; tráva má sviežejšiu zelenú. Dekorácia nemení kolíznu mapu; mostík má výšku chodidiel podľa svojho povrchu.
- Po 12 sekundách nečinnosti alebo 35 sekundách bez priblíženia k cieľu sa v pokojnom priestore krátko ukáže pomoc. Zlaté labky a vlk používajú priechodnú trasu vrátane mosta cez rieku. Pomoc sa počas blízkeho súboja, pristávania a príbehových momentov stiahne a opakuje sa najskôr po 32 sekundách. Pri svätyni a truhlici vysvetlí správne tlačidlo. Predmety pri priblížení jemne pulzujú. Hlasová pomoc je voliteľná v pauze, predvolene vypnutá, funguje len s dostupným miestnym slovenským alebo českým systémovým hlasom. Nevyžaduje mikrofón ani externú hlasovú službu.
- Strážca rozlišuje úder, vlnu, štít a príležitosť na zásah ikonou, farbou aj krátkou vetou. Po útoku sa na 1,7–2 sekundy otvorí; po zlomení posledného koreňa na 2,8 sekundy. Žiariace kryštály a spojenia ukazujú korene štítu. Záverečná oslava Vicky, vlka a Auriho sprevádza trojsekundové rozkvitnutie čistinky.
- Hlavné menu používa sviežu lesnú zelenú, zlatý zaoblený názov, ružové veľké Hrať a jednoduchšie detské prvky. Mobilný pohľad v menu umiestňuje hrdinku vyššie nad text. Pauza a výsledkové obrazovky nadväzujú rovnakými farbami. Pohladenie vlka má malú zrozumiteľnú ikonu dolu, nezakrýva postavu.
- Stále ide len o level 1. Desať diamantov, tri svätyne, 13 príbehových strážcov, 70 putujúcich pozemných a 498 vzdušných obyvateľov, letová hladina, horské hranice aj staré uloženia zostávajú kompatibilné.

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

71 automatických testov kontroluje celú cestu po skutočnej kolíznej mape až po víťazstvo, hlavné súboje, uloženia, voľný pohyb, pevnú letovú hladinu, strely, počty druhov, nové čistinky, hranice, počasie, intro aj stabilný dobeh vlka. Automatický priechod trvá približne **224 herných sekúnd**, aj iba s mečom bez klávesnicového kúzla. To nie je meranie prvého hrania dieťaťa; priemer 5–10 minút treba potvrdiť používateľským hraním.

Grafika používa zdieľané geometrie a instancie pre zvieratká, orezanie mimo pohľadu, priestorové bunky pre kolízie, zlúčené viditeľné povrchy terénu a automatickú úspornú kvalitu. Úsporný les má približne 55 tisíc dekoračných kociek namiesto 178 tisíc detailných. Three.js tvorí veľký samostatný balík; build na jeho veľkosť upozorňuje.

## Nasadenie a limity

Vercel automaticky zostaví aktualizácie vetvy `main`: `npm run build`, výstup `dist`.

Vicky a zvieratká sú procedurálne kockové modely; nejde o detailné profesionálne modely z referenčného obrázka. Druhy a farebnosť zvieratiek vychádzajú z dodaného ZIP; od verzie 1.8 majú nové priestorové telá z kociek veľkosti 0,115 m. Overenie mobilných rozmerov v Chrome nenahrádza fyzické hranie na iPhone/iPad v Safari. Na starších zariadeniach treba používať úspornú grafiku; stabilné FPS na každom zariadení nie sú zaručené. Intro zatiaľ pomenúva postavičky textom, bez nahovoreného vzdelávacieho výkladu.

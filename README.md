# VICKY A ČAROVNÝ SVET

Hrateľný 3D **level 1 — Čarovný les**, React 19 + TypeScript + Three.js/react-three-fiber + Vite. Bez backendu a API kľúčov.

- Hra: https://vicky-carovny-svet.vercel.app/
- Repozitár: https://github.com/xxmark83/vicky-carovny-svet

## Verzia 1.4 — Vicky je hrdinka

Celý balík A + B + C upravuje stále ten istý prvý level. Povinným cieľom zostáva **10 diamantov, 3 svätyne, 13 vyslobodených strážcov a truhlica**. Mapa má hranice 140 × 346 m; chôdza zostáva o 40 % rýchlejšia (3,64 m/s), let má 10 m/s. Po lese možno voľne odbočiť, stúpať a klesať. Rieku na zemi prekračuje drevený most.

**A — postavy a ovládanie.** Vicky má samostatné kolená, ružové tenisky so šnúrkami, mäkšiu tvár, žmurkanie, tri animácie švihu, beh, let, náklon, dopad a radostnú oslavu. Dlhý svetlohnedý cop s modrou gumičkou sa pohybuje po prameňoch. Biele tričko má vpredu aj vzadu VICKY a srdce. Kamera hľadá priechod medzi kmeňmi a vegetáciu, ktorá zakrýva postavu, dočasne stenčí bodkovaným prekrytím. Otočná minimapa ukazuje smer kamery; citlivosť je v pauze.

Kravička označí smer, zamkne ho a rozbehne sa; po rozbehu zostane chvíľu omráčená. Panda má čelný štít a slabší chrbát. Kostlivec drží odstup a strieľa viditeľné pomalé strely, ktoré meč zruší. Modrý strážca vyšle rastúcu preskočiteľnú vlnu. Zelená príšerka útočí zblízka. Varovania zodpovedajú smeru alebo dosahu útoku. Vlk hľadá cestu okolo kmeňov a cez most, vyčuchá vodopád, pomáha v boji, čaká pri lete a dá sa pohladkať. Po dlhom lete dobehne po zemi.

**B — objavovanie a atmosféra.** Osem čistiniek má vlastné komponované prvky: Kvetinový vŕšok, Brezový háj, Jazierko svetlušiek, Machové korene, Strieborná čistinka, Slnečná vyhliadka, Hubové údolie a Ružová záhrada. Okolie čistiniek mení farby stromov; dopĺňajú ho nápisy, kvetinové oblúky, brezy, lekná, korene, slnečnice, lavička a huby. Motýle, svetlušky, jemný pohyb listov, lúče, hmla a teplé svetlo svätýň oživujú les.

Za vodopádom je malá preskúmateľná jaskyňa so svietiacimi hubami a **dobrovoľným kvetinovým venčekom** pre Vicky. Hlavná úloha nevyžaduje jej návštevu. Tri krátke Auriho odkazy pri odbočkách a reakcie Vicky dopĺňajú príbeh; nezastavujú pohyb ani nevyžadujú čakanie. Voliteľný syntetizovaný zvuk obsahuje potok podľa vzdialenosti, vietor, vtáky, kroky tráva/drevo/kameň, jemné mávanie krídel a bojové efekty. Hudba a zvuky majú samostatné prepínače a spoločnú hlasitosť. Pauza ich stíši.

**C — let a finále.** Vicky za sebou necháva krátku zlatú stopu. Tri dobrovoľné vzdušné oblúky odmenia prieskum svetlejšou iskrou; nepridávajú povinné diamanty. Značka pod Vicky a text ukazujú voľnú alebo blokovanú zem. Počas letu ani pristávania nemožno zbierať alebo bojovať. V jaskyni sa lietať nedá.

Strážca pokladu má dve fázy. Po polovici zdravia ho chráni viditeľný štít napájaný tromi koreňmi. Vicky musí korene zlomiť; až potom strážca prijíma ďalšie zásahy. Vlk označuje miesto mimo jeho kruhu. Po otvorení truhlice oslavujú Vicky, vlk aj Auri; sedemsekundovú oslavu možno preskočiť. Výsledok ukáže aj dobrovoľné objavy.

Staré uložené pozície verzie 1 ostávajú kompatibilné. Pribudlo uloženie jaskyne, venčeka, oblúkov, navštívených čistiniek a fázy strážcu. Nová vegetácia neuväzní starú pozíciu v kmeni: hra vyhľadá blízke voľné miesto.

## Ovládanie

| Akcia | Počítač | Dotyk |
|---|---|---|
| Pohyb | WASD / šípky | ľavý joystick |
| Meč | J / klik do scény | zlaté tlačidlo |
| Skok | medzerník | šípka hore |
| Kúzlo | K; obnova 12 s | iskry |
| Chôdza / let | F | Vzlietnuť / Pristáť |
| Výška počas letu | medzerník / Shift | držať hore / dole |
| Kamera | Q / C, T / G sklon pri lete, R sever | ťahať plochu KAMERA |
| Interakcia | E | tlačidlo pri svätyni, jaskyni, vlkovi alebo truhlici |
| Mapa / pauza | M / Esc | horné ikony |

Svätyne obnovujú zdravie, kúzlo a miesto návratu. Jahody dopĺňajú zdravie. Pri neúspechu zostávajú diamanty, svätyne, tajomstvá a vyslobodení strážcovia; preživší strážcovia sa obnovia. Postup sa automaticky ukladá iba v tomto prehliadači.

## Build a overenie

Node.js 22.12+ alebo 24+ a npm:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Vercel: `npm run build`, výstup `dist/`, bez premenných prostredia. Commity hlavnej vetvy sa automaticky nasadzujú. `qa.html` slúžil len na lokálne checkpointy pri vývoji a nie je v repozitári ani nasadení.

**Overené v 1.4:** produkčný build a 32 automatizovaných testov vrátane celej pešej trasy cez skutočné kolízie a bežné vstupy až po víťazstvo, rozdielnych nepriateľov, druhej fázy, jaskyne, oblúkov, letu, návratu vlka cez most a starých uložených pozícií. Simulovaný priechod má približne **6 min 25 s herného času**; nejde o meraný priemer prvých ľudských hraní. Cieľ pre prvé hranie zostáva 5–10 minút, podľa skúmania a súbojov.

Ručne v Chrome: pohladenie vlka, jaskyňa/venček/návrat, vzlet, držanie výškových tlačidiel, pristátie, zásah koreňa, otvorenie truhlice/víťazstvo, mapa, úsporný režim, zvukové prepínače a citlivosť. Kontrolované responzívne rozmery **390 × 844, 844 × 390 a 820 × 1180**. Záverečné situácie v prehliadači používajú lokálne testovacie checkpointy; celú trasu prechádza automatizovaný test. Rozmery viewportu nenahrádzajú fyzické zariadenie.

**Neoverené:** fyzický iPhone/iPad, Safari, reálny multidotyk a meranie FPS, pamäte či zahrievania na zariadení. Výkon sa preto negarantuje. Úsporný režim je predvolený pri dotykovom zariadení (DPR 1, bez tieňov a antialiasingu). Detailný režim má DPR max. 1,5 a tiene 2048 px. Pri opakovanom poklese pod 28 FPS sa zapne úsporný režim. Instancie, zdieľané geometrie, hmla a limit častíc znižujú záťaž. Fyzické profilovanie zostáva ďalším krokom.

## Referencie a súkromie

Vzhľad vychádza zo zadania a obrázka „Vicky a kouzelný svět plný dobrodružství“. Pôvodné fotografie Vicky a meča nie sú v pracovnom priestore dostupné a **nie sú súčasťou repozitára ani nasadenia**. Ide o pôvodný zjednodušený procedurálny model, nie realistický portrét. Kravička, panda a modrý strážca sú adaptované motívy z používateľom poskytnutej hry `kostickovy-3d.zip`, prevedené do malých 3D povrchových kociek 0,115 m. ZIP ani ostatné levely nepublikujeme. Percentuálnu zhodu s ilustráciou nemožno objektívne potvrdiť: modely, materiály a filmové svetlo sú stále jednoduchšie. Všetko v hre je skutočná interaktívna 3D scéna.

Bez analytiky, reklám, nákupov a vzdialeného ukladania. Zvuk vzniká lokálne cez Web Audio po interakcii. Fonty sú z Google Fonts so systémovou náhradou. Vymazanie dát prehliadača odstráni lokálny postup.

## Hlavné súbory

- `game.ts`, `combat.ts`, `companion.ts`, `navigation.ts`: hra, odlišné súboje a navigácia vlka.
- `map.ts`, `terrain.ts`, `Ground.tsx`: hranice, výšky a povrchový terén.
- `Hero.tsx`, `Sword.tsx`, `creatures.ts`, `CombatVisuals.tsx`: Vicky, meč, strážcovia a varovania.
- `Scene.tsx`, `Forest.tsx`, `Scenery.tsx`, `world.ts`, `Voxel.tsx`: kamera, les, osem scenérií, jaskyňa, Auri a efekty.
- `App.tsx`, `MapView.tsx`, `Audio.ts`, `style.css`: rozhranie, mapa a zvuk.
- `game.test.ts`: 32 testov vrátane dokončenia levelu.
- `UPGRADE_PLAN.md`: stav balíka a odporúčané ďalšie zlepšenia iba pre level 1.

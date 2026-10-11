# VICKY A ČAROVNÝ SVET

Jeden kompletný hrateľný 3D level **Čarovný les**. React 19, TypeScript, Three.js a react-three-fiber, Vite. Bez backendu a bez API kľúčov.

## Upgrade 1.2 — Auri a tri svetlá

Prvý level má výrazne hustejší farebný les s pixelovými textúrami, členitými terasami, rozmanitými korunami, kríkmi a kvetinovou podrastou. Les je rozdelený na 28 m úseky a bloky sa kreslia pomocou zdieľaných instancií; úsporný režim znižuje detail podrastu a korún. Herná kamera je nižšie a bližšie k Vicky. Priehľady odhaľujú nový animovaný vodopád, potok, ružový hrad a pôvodného fialového draka Auriho.

Vicky pomáha Aurimu vrátiť svetlo do troch svätýň. Príbeh sprevádzajú osobné reakcie Vicky a nový portrét v rozhraní. Postava má väčšie oči, dlhý cop s modrou gumičkou, biele tričko VICKY so srdcom, fialové nohavice a ružové tenisky. Vlk sa drží po jej boku, aby nezakrýval Vicky v nízkej kamere. Zelené štvornohé príšerky, zelení humanoidi, kostlivci s rebrami a korunovaný kostlivý strážca nahradili pôvodné jednoduché tiene. Útoky a ciele zostávajú čitateľné; nejde o ďalší level.

Uložený postup verzie 1 ostáva kompatibilný. Ak nová hustejšia vegetácia prekryje starú uloženú polohu, hra postavu presunie na najbližšie voľné miesto a zachová diamanty, svätyne aj porazených nepriateľov.

## Upgrade 1.1 — Živý les

Stále iba prvý level, rovnaká mapa a ciele. Paprade, huby, korene, machové kmene, lampáše a kamenné brány dopĺňajú instancovaný les. Jemné lúče a nízka hmla sú bez postprocessingu. Tri svätyne majú názvy, vlastné príbehové odkazy, svetelný stĺp a obnovujú kúzlo lesa. Prehľad svätýň je priamo v HUD.

Plynulé otáčanie Vicky a kamery, rozbeh a zastavenie pohybu, mŕtva zóna joysticku, dvojdielna animácia copu, samostatné nohy vlka a reakcie na diamanty/nebezpečenstvo. Meč má zlatý oblúk, zásahy odtláčajú malé tiene a zranenie sa ukazuje jemným červeným okrajom.

Strážca strieda úder (dosah 2,8 m, varovanie 1,05 s) a zlatú vlnu (5,5 m, varovanie 1,4 s). Kruhy zobrazujú skutočný dosah; odíď z kruhu alebo načasuj skok. Bežný zásah strážcu nepreruší, aby nebolo možné zrušiť každý útok držaním meča. Samostatný ukazovateľ zdravia a text pri útoku pomáhajú s orientáciou.

Po otvorení pokladu nasleduje päťsekundová oslava: plynulé veko, zlaté častice, obiehajúca kamera, poskakujúca Vicky a vlk, potom výsledok. Oslavu možno preskočiť. Staré uložené pozície verzie 1 ostávajú kompatibilné.

Ak detailná grafika po úvodnom zahriatí počas dvoch po sebe nasledujúcich trojsekundových okien klesá pod 28 FPS, hra automaticky zapne úspornú grafiku. Nastavenie možno zmeniť v pauze. Ide o jednoduchú ochranu plynulosti; výkon na fyzickom iPhone/iPade nebol meraný.

Ďalšie zlepšenia iba pre level 1 sú v [UPGRADE_PLAN.md](UPGRADE_PLAN.md).

## Zahrať si

1. Pozbieraj **10 diamantov** na ceste a v lesných odbočkách.
2. Vysloboď **13 zakliatych strážcov**, vrátane veľkého strážcu pri poklade.
3. Prebuď **3 svätyne** po porazení tieňov v ich okolí. Doplňujú zdravie a ukladajú miesto návratu.
4. Na konci lesa otvor zlatú truhlicu. Pri svätyniach aj truhlici použi **E** alebo tlačidlo na obrazovke.

Bežné prvé hranie je navrhnuté približne na **5–10 minút**, podľa objavovania a súbojov. Automatizovaný test s navigáciou po najkratších trasách dokončil level za približne 4 min 35 s herného času.

### Ovládanie

| Akcia | Počítač | Dotyk |
|---|---|---|
| Pohyb | WASD alebo šípky | ľavý virtuálny joystick |
| Útok | J alebo klik do scény | zlaté tlačidlo meča |
| Skok | medzerník | tlačidlo so šípkou |
| Zlaté kúzlo | K | tlačidlo iskier; obnova 12 s |
| Interakcia | E | tlačidlo pri svätyni / truhlici |
| Mapa | M alebo ikona mapy | ikona mapy |
| Pauza | Esc alebo ikona pauzy | ikona pauzy |

Kúzlo zasiahne okolitých nepriateľov a na chvíľu ochráni Vicky. Nepriatelia pred zásahom ukazujú oranžový kruh; odskoč alebo zaútoč. Vlk sprevádza Vicky a pomáha v boji. Ružové jahody obnovujú zdravie. Pri neúspechu možno pokračovať od poslednej svätyne; získané diamanty, prebudené svätyne a porazení nepriatelia zostávajú.

## Spustenie a build

Vyžaduje Node.js 22.12+ alebo 24+ a npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Výstup je v `dist/`. Vercel rozpozná Vite; konfigurácia je v `vercel.json`. Build command `npm run build`, output directory `dist`, žiadne premenné prostredia. Po pripojení repozitára sa nové commity na hlavnej vetve automaticky nasadzujú.

## Mobil a výkon

Responzívne rozhranie pre iPhone/iPad v Safari a pre moderné prehliadače. Dotykový joystick podporuje pointer capture a súbežné dotyky s tlačidlami. Safe-area okraje a dynamická výška viewportu. Na dotykových zariadeniach je predvolene úsporná grafika: DPR 1, bez tieňov a antialiasingu. Detailná grafika je v pauze; jej DPR je obmedzené na 1,5 a tiene na 1024 px. Scéna používa zdieľané geometrie a instancované bloky, hmlu a obmedzený počet častíc. Rozšírenie na celú obrazovku závisí od prehliadača; na iPhone sa dá použiť Pridať na plochu.

**Overené:** produkčný build, 15 automatizovaných testov logiky vrátane celého prejdenia levelu, striedania útokov strážcu, preskočenia vlny, kompatibility uloženého postupu a oslavy. V Chrome desktop a rozmeroch 390 × 844, 844 × 390 a 820 × 1180 overené ovládanie joystickom, rýchle ťuknutie na kúzlo, prebudenie svätyne a otvorenie truhlice s víťazstvom. Záverečné situácie v prehliadači boli spustené z lokálnych testovacích checkpointov; celý level prechádza automatizovaný test cez skutočnú kolíznu mapu a bežné vstupy. **Neoverené:** fyzický iPhone/iPad, Safari a meranie FPS na skutočných mobilných zariadeniach. Konkrétnu snímkovú frekvenciu preto negarantujeme.

## Vizuálne referencie a súkromie

Svetlohnedý dlhý cop s modrou gumičkou a zlatý pixelový meč vychádzajú zo zadania používateľa; pôvodné fotografie nie sú v tomto pracovnom priestore dostupné. **Fotografie nie sú súčasťou projektu ani nasadenia.** Model Vicky je pôvodná zjednodušená voxelová postava s bielym tričkom VICKY, animovaným copom a končatinami. Scéna a modely sú vytvorené procedurálne; nejde o realistický portrét. V upgrade 1.2 bol vizuálnou referenciou priložený obrázok „Vicky a kouzelný svět plný dobrodružství“. Používa sa jeho farebnosť, hustota prírody, scenéria a motívy postáv. Obrázok ani fotografie sa neposielajú do verejného repozitára. Percentuálnu grafickú zhodu nemožno objektívne potvrdiť; procedurálne modely sú stále jednoduchšie než na referencii. Všetko viditeľné v hre je skutočná 3D scéna.

Bez analytiky, reklám, nákupov, vzdialenej databázy alebo odosielania postupu. Postup sa ukladá iba do `localStorage` daného prehliadača; v súkromnom režime alebo po vymazaní dát môže zmiznúť. Zvuky sú voliteľné, syntetizované cez Web Audio; aktivujú sa po kliknutí. Fonty sa načítavajú z Google Fonts s lokálnou systémovou náhradou.

## Súbory

- `game.ts` — deterministická mapa, kolízie, súboje, ciele, ukladanie a víťazstvo.
- `Scene.tsx` — Vicky, vlk, nepriatelia, kamera, rieka, svätyne, truhlica a častice.
- `Forest.tsx`, `world.ts`, `Voxel.tsx` — hustý instancovaný les, textúry, terasy, vodopád, hrady a animovaný Auri.
- `App.tsx`, `style.css` — responzívne rozhranie, klávesnica, joystick, pauza a mapa.
- `game.test.ts` — kolízie, súboje, postup, návrat, dotykové kliknutia a celý level.

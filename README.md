# VICKY A ČAROVNÝ SVET

Jeden kompletný hrateľný 3D level **Čarovný les**. React 19, TypeScript, Three.js a react-three-fiber, Vite. Bez backendu a bez API kľúčov.

## Zahrať si

1. Pozbieraj **10 diamantov** na ceste a v lesných odbočkách.
2. Vysloboď **13 lesných tieňov**, vrátane veľkého strážcu pri poklade.
3. Prebuď **3 svätyne** po porazení tieňov v ich okolí. Doplňujú zdravie a ukladajú miesto návratu.
4. Na konci lesa otvor zlatú truhlicu. Pri svätyniach aj truhlici použi **E** alebo tlačidlo na obrazovke.

Bežné prvé hranie je navrhnuté približne na **5–10 minút**, podľa objavovania a súbojov. Automatizovaný test s navigáciou po najkratších trasách dokončil level za približne 4 min 33 s herného času.

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

**Overené:** produkčný build, sedem automatizovaných testov logiky vrátane celého prejdenia levelu, Chrome desktop a rozmer 390 × 844, ovládanie joystickom, mapa, pauza, kúzlo a obnovenie uloženého postupu. **Neoverené:** fyzický iPhone/iPad, Safari a meranie FPS na skutočných mobilných zariadeniach. Konkrétnu snímkovú frekvenciu preto negarantujeme.

## Vizuálne referencie a súkromie

Pôvodné fotografie boli použité pri návrhu svetlohnedého dlhého copu s modrou gumičkou a zlatého pixelového meča. **Fotografie nie sú súčasťou projektu ani nasadenia.** Model Vicky je pôvodná zjednodušená voxelová postava s bielym tričkom VICKY, animovaným copom a končatinami. Scéna a modely sú vytvorené procedurálne; nejde o realistický portrét. Posledné generované obrázky z referenčného rozhovoru neboli cez prenos dostupné, preto nemožno tvrdiť presnú zhodu s nimi. Všetko viditeľné v hre je skutočná 3D scéna.

Bez analytiky, reklám, nákupov, vzdialenej databázy alebo odosielania postupu. Postup sa ukladá iba do `localStorage` daného prehliadača; v súkromnom režime alebo po vymazaní dát môže zmiznúť. Zvuky sú voliteľné, syntetizované cez Web Audio; aktivujú sa po kliknutí. Fonty sa načítavajú z Google Fonts s lokálnou systémovou náhradou.

## Súbory

- `game.ts` — deterministická mapa, kolízie, súboje, ciele, ukladanie a víťazstvo.
- `Scene.tsx` — instancovaný les, Vicky, vlk, nepriatelia, rieka, svätyne, truhlica a častice.
- `App.tsx`, `style.css` — responzívne rozhranie, klávesnica, joystick, pauza a mapa.
- `game.test.ts` — kolízie, súboje, postup, návrat, dotykové kliknutia a celý level.

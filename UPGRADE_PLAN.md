# Čarovný les — stav upgradu 1.4 a ďalší krok

Stále iba **level 1**. Počet povinných cieľov sa nemení: 10 diamantov, tri svätyne, 13 strážcov a truhlica. Chôdza ostáva +40 %, mapa ohraničená a let dobrovoľný.

## Balík A + B + C je implementovaný

| Balík | Dodané zmeny | Odhad prínosu |
|---|---|---:|
| A — postavy a ovládanie | Vicky s kolenami, výrazmi, prameňovým copom, tromi švihmi, letom a dopadom; kamera, otočná minimapa a citlivosť; odlišné útoky šiestich typov strážcov; navigácia, čuchanie a pohladenie vlka | 10/10 |
| B — objavovanie a atmosféra | Osem komponovaných čistiniek, brezové/pestré okolie, jaskyňa s voliteľným venčekom, tri Auriho odkazy, motýle, pohyb lístia, svetlo a syntetizovaná zvuková atmosféra | 9/10 |
| C — let a finále | Zlatá stopa, tri dobrovoľné oblúky, označenie pristátia, dvojfázový strážca so štítom/tri korene, bezpečné miesto od vlka, spoločná oslava a výsledok objavovania | 9/10 |

**Celkový očakávaný prínos: 9/10.** Je to návrhové hodnotenie prínosu, nie objektívne skóre hry ani meranie zhody s obrázkom.

Produkčný build a 32 testov prešli. Automatizovaný peší priechod končí víťazstvom približne za 6:25 herného času. Prvé ľudské hranie zatiaľ nemá nameraný priemer. Responzívne rozhranie a vybrané akcie boli overené v Chrome v rozmeroch telefónu a tabletu. Fyzické iOS profilovanie nemožno nahradiť zmenou rozmeru okna; zostáva otvorené.

## Čo by malo nasledovať — stále level 1

| Poradie | Upgrade | Konkrétny výsledok | Prínos |
|---|---|---|---:|
| 1 | Skutočný iPhone/iPad a hranie Vicky | Prejsť celý level v Safari, zmerať FPS/pamäť/zahrievanie, overiť dva súčasné dotyky a čas prvého hrania; upraviť obtiažnosť podľa výsledku | 10/10 |
| 2 | Výraznejší model Vicky | Ručne pripravený animovaný 3D model, pramenitejšie vlasy, kvalitnejšia tvár, ohyb lakťov a presnejší kontakt chodidiel so svahom | 10/10 |
| 3 | Živé scenérie a materiály | Animované listy aj na dekoratívnych stromoch, lepší vodopád a priehľadná voda, jaskynné kryštály, vlastné zvuky prostredia a viac vrstiev svetla pri zachovaní výkonu | 9/10 |
| 4 | Čitateľnejšie súboje | Samostatné animácie prípravy/zásahu pre každého strážcu, odozva štítu, silnejšie odlíšenie zásahu a odrazenia strely, priateľskejšie nastavenie obtiažnosti | 9/10 |
| 5 | Viac osobnosti vlka a Auriho | Sadnutie, poskočenie, pohladenie s presnejším dotykom, krátke Auriho pristátia pri odbočkách a finále s vlastnou animáciou | 8/10 |

Tieto ďalšie body nie sú súčasťou publikovanej verzie 1.4. Nepridávajú nový level, ekonomiku, obchod ani povinné zbieranie navyše.

## Grafické a testovacie limity

Vicky, vlk a prostredie zostávajú procedurálne modely. Švihy sú animácie častí modelu; nejde o motion capture ani plnú kostrovú animáciu. Vegetácia pri zakrytí postavy používa bodkované stenčenie, nie fyzikálne priehľadné listy. Hudba a zvuky sú jednoduché syntetizované vrstvy. Úsporný režim nemá dynamické tiene. Percentuálna zhoda s referenčnou ilustráciou nemá poctivú metódu merania. Safari a fyzický iPhone/iPad zostávajú neoverené.

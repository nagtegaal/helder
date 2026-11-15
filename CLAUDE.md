# Helder — werkafspraken voor Claude

Helder is Stefans eigen theme + kaartbibliotheek voor Home Assistant: één set design-tokens, eigen Lit/TypeScript-kaarten
en restyling van Home Assistants eigen pagina's. Lees bij elke sessie eerst `docs/design.md` (de specificatie en het
besluitenlog). Die is leidend; wijkt de code ervan af, meld het.

## Communicatie
- Altijd Nederlands, beknopt en technisch precies. Code, identifiers en commit-messages in het Engels.
- Stel eerst alle nodige vragen voordat je code schrijft; neem nooit stilzwijgend een default aan.
- Elk besluit dat Stefan neemt, komt in het besluitenlog van `docs/design.md` (datum + besluit), in dezelfde commit.

## Werkwijze per gesprek
- Eén gesprek per kaart. Werk op een branch `kaart/<naam>`; merge naar `main` pas na Stefans akkoord op de screenshots.
- Het fundament (`src/tokens`, `src/core`, `src/ui`, de build) wijzig je alleen in een fundamentgesprek, niet vanuit
  een kaartgesprek. Heeft een kaart iets nieuws van het fundament nodig: stel het voor en wacht.
- Verifieer visueel: licht én donker, breedtes 152, 211, 360 en 520 px, plus de staten `unavailable`, `unknown` en
  ontbrekende entity. Stuur de screenshots mee.

## Home Assistant
- HA is bereikbaar via de Home Assistant-tools (lezen, dashboards, themes) en de Claude Code-app in HA
  (bestanden, `deploy.sh`). Vraag altijd toestemming vóór een wijziging in HA, en maak eerst een backup.
- Paden in HA: bundle + fonts in `/config/www/helder/`, theme in `/config/themes/helder.yaml`, geladen via
  `frontend: extra_module_url`. Fonts horen in `/config/www/`, nooit in `themes/`.
- Ga uit van de nieuwste HA-versie; zoek actuele documentatie op (developers.home-assistant.io) vóór je API's gebruikt.
- Het Fluvy-theme mag niet actief zijn tijdens het testen van Helder (Fluvy restylet HA's pagina's alleen onder zijn eigen theme).

## Code
- Fluvy (GPL-3.0) is inspiratie voor de architectuur; neem geen code letterlijk over.
- Geen literal kleuren of maten in kaarten: alleen `var(--helder-*)`.
- Een `unavailable` / `unknown` / ontbrekende entity verandert nooit de grootte of opbouw van een kaart, alleen de kleuren.

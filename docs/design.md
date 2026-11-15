# Helder — specificatie

Status: **concept** — het fundament (gesprek 0) is nog niet gebouwd. Open punten staan onderaan.

## 1. Doel en scope
- Eén ontwerp voor heel Home Assistant: dashboards (eigen kaarten) én HA's eigen pagina's (sidebar, instellingen,
  dialogen).
- Alleen voor eigen gebruik; privé-repo, geen HACS-distributie.
- Kanttekening: HA's eigen pagina's restylen gaat deels via styles in HA's shadow DOM. Dat kan breken bij een
  HA-release; reken op onderhoud na elke maandelijkse update.

## 2. Naamgeving
| Wat | Vorm |
| --- | --- |
| Theme | `helder` (`themes/helder.yaml`) |
| Kaart-tag | `helder-<naam>-card` → `type: custom:helder-<naam>-card` |
| CSS-variabelen | `--helder-<groep>-<naam>` (bijv. `--helder-color-accent`, `--helder-radius-card`) |
| Bundle | `/config/www/helder/helder.js?v=<versie>` |

## 3. Ontwerp
- **Stijl:** glas — doorschijnende kaarten met achtergrond-blur, lichte randen en diepte.
- **Modi:** licht en donker, volgt de systeeminstelling van het apparaat (HA-theme met `modes: light` / `dark`).
- **Font:** Open Sans (self-hosted variable font) via de bestaande `theme-font-loader.js`
  (`/config/www/theme-font-loader.js`, geladen via `frontend: extra_module_url` in `configuration.yaml`; ook
  gerefereerd in `themes/bronxx.yaml` en `bright_and_brilliant.yaml`).
- **Eenheden:** `rem` met 14 px als basis.
- **Apparaten:** iPhone, iPad, Mac (Safari) en desktop.
- **Achtergrond:** een aantal subtiele cirkelvormige radiale verlopen die overlopen in de paginakleur; in licht een
  warme lichte basiskleur, in donker een warme donkere basis.
- **Glas:** Apple-glas: 1 px lichte rand met highlight aan de bovenkant, plus achtergrond-blur.
- **Kleurgebruik:** per kaart instelbaar in de visuele editor: één accentkleur, of statuskleuren per domein
  (licht aan = amber, verwarmen = oranje, rolluik = accent).
- Accenttint, blur, transparantie, radius en schaduw: zie open punten (keuze via `mockup/glass.html`).

## 4. Architectuur
```
src/
  tokens/        tokens.ts (licht/donker) → build genereert themes/helder.yaml én de CSS-variabelen
  core/          base-card.ts (basisklasse), entity.ts, actions.ts, format.ts, register.ts
  ui/            gedeelde onderdelen (head, readout, toggle, slider, …) + styles/*.css
  shell/         restyling van HA's eigen pagina's
  cards/<naam>/  <naam>-card.ts (+ onderdelen)
  index.ts       entry: registreert kaarten en shell
docs/design.md   deze specificatie
deploy/deploy.sh uitrol naar HA
```
- TypeScript + Lit 3 (meegebundeld, niet die van HA lenen), Vite, één ES-module `helder.js`.
- Build draait in de Claude-werkomgeving; uitrol via `deploy.sh` in de Claude Code-app in HA.

### Contract van de basisklasse
- Levert `hass`, `config`, gemeten breedte, entity-resolutie, acties (`tap`/`hold`, standaard more-info), formattering.
- Kaart implementeert alleen `renderCard()`; validatie in `setConfig` (gooit een fout → HA toont foutkaart).
- `getGridOptions()` voor de sections-view; `getCardSize()` voor masonry (1 = 50 px).
- `getStubConfig()` voor de kaartkiezer; registratie in `window.customCards`.
- Staten: `unavailable`, `unknown` en ontbrekend veranderen nooit grootte of opbouw — waarden tonen `—`, bediening
  uitgeschakeld, alleen kleuren wijzigen. Attributen kunnen `null` of afwezig zijn.
- Optimistische UI: eerst de weergave, dan de service-call; sliders versturen bij loslaten.
- Breedte: werkt van 152 px (halve sectie) tot 520 px zonder afkappen; geen vaste breedtes.
- Alleen tokens (`var(--helder-*)`), nooit literal kleuren.

## 5. Kaarten
| Kaart | Status | Notities |
| --- | --- | --- |
| Rolluiken (`helder-cover-card`) | gepland | Brel/MotionBlinds; entity-ids `cover.rolluik_<beneden\|boven>_<voorzijde\|achterzijde>_…`. Naam, positie in %, horizontale slider, knoppen open/stop/dicht, presets (naam + positie, bijv. Gesloten 0 %, Ventileren 10 %, Halfopen 50 %, Open 100 %) instelbaar in de visuele editor |
| Klimaat (`helder-climate-card`) | gepland | Huidige temperatuur, doeltemperatuur met −/+, modus. Presets (label + temperatuur, bijv. Uit, Eco 16 °C, Comfort 19 °C) instelbaar in de visuele editor |
| Verlichting / schakelaars (`helder-light-card`, `helder-switch-card`) | gepland | Aan/uit met helderheidsslider |

## 6. Open punten
- [ ] Accenttint: blauw, groenblauw, indigo of oranje `#ff6d00` (zie mockup)
- [ ] Glasparameters: blur en transparantie (presets subtiel 12 px / 55 %, middel 20 px / 40 %, sterk 32 px / 25 %)
- [ ] Radius kaart (6, 10, 14, 18, 22 of 28 px; knopradius afgeleid)
- [ ] Diepte: alleen rand, alleen schaduw, of rand + schaduw
- [ ] Werking van `theme-font-loader.js` (§3) lezen en bepalen hoe `helder.yaml` hem aanstuurt
- [x] Visuele editor per kaart: ja (zie besluitenlog)
- [ ] Package manager en Node-versie
- [ ] Welke HA-pagina's eerst restylen
- [ ] Indeling kaarten (één kaart per domein of varianten)

## 7. Besluitenlog
| Datum | Besluit |
| --- | --- |
| 2026-11-15 | Eigen JS-kaarten (Lit/TypeScript), architectuur in lagen geïnspireerd op Fluvy, zonder Python-integratie |
| 2026-11-15 | Privé-repo `nagtegaal/helder`; build in Claude-werkomgeving; uitrol via Claude Code-app in HA |
| 2026-11-15 | Scope: dashboards én HA's eigen pagina's |
| 2026-11-15 | Naam `helder` voor repo, theme, tag-prefix en CSS-variabelen |
| 2026-11-15 | Stijl glas; licht + donker volgt systeem; font Open Sans |
| 2026-11-15 | Eerste kaarten: rolluiken, klimaat, verlichting/schakelaars |
| 2026-11-15 | Kleurgebruik (één accent of statuskleuren per domein) wordt een optie in de visuele editor van elke kaart, ook toekomstige; kaarten krijgen dus een visuele editor |
| 2026-11-15 | Accentkandidaten in de mockup: blauw, groenblauw, indigo en oranje `#ff6d00` |
| 2026-11-15 | Achtergrond: subtiele cirkelvormige radiale verlopen die overlopen in een warme lichte paginakleur |
| 2026-11-15 | Randen: Apple-glas (1 px lichte rand met highlight bovenaan) |
| 2026-11-15 | Glas: drie presets (subtiel / middel / sterk) plus schuifjes in de mockup; schaduw, rand of beide als variant |
| 2026-11-15 | Mockup als losse HTML-pagina (`mockup/glass.html`), licht + donker, breedtes 152/211/360/520 px, met unavailable-staten en echte namen/standen uit HA |
| 2026-11-15 | Rolluikkaart: horizontale slider; presets (naam + positie) instelbaar in de visuele editor |
| 2026-11-15 | Klimaatkaart: presets (label + temperatuur) instelbaar in de visuele editor |
| 2026-11-15 | Lichtkaart: aan/uit met helderheidsslider |
| 2026-11-15 | Claude mag de hele HA-installatie lezen (alleen lezen; wijzigen blijft na toestemming) |
| 2026-11-15 | Geen vetgedrukte tekst in kaarten: alle kaarttekst normaal gewicht (400), grote readouts licht (300) |
| 2026-11-15 | Fundamentwerk in deze thread op branch `claude/project-thread-ganvgt`; merge naar `main` na akkoord |

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
- **Font:** Open Sans (self-hosted variable font) via de bestaande `theme-font-loader.js`.
- **Eenheden:** `rem` met 14 px als basis.
- **Apparaten:** iPhone, iPad, Mac (Safari) en desktop.
- Kleuren, blur, transparantie, radius en schaduw: zie open punten (vast te leggen na de mockup).

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
| Rolluiken (`helder-cover-card`) | gepland | Brel/MotionBlinds; entity-ids `cover.rolluik_<beneden\|boven>_<voorzijde\|achterzijde>_…` |
| Klimaat (`helder-climate-card`) | gepland | |
| Verlichting / schakelaars (`helder-light-card`, `helder-switch-card`) | gepland | |

## 6. Open punten
- [ ] Accentkleur(en) en palet (licht + donker)
- [ ] Glasparameters: blur, transparantie, randen, schaduw, radius
- [ ] Visuele editor per kaart (`getConfigForm`) of alleen YAML
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

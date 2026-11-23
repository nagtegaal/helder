# Helder — specificatie

Status: **in aanbouw** — het fundament (gesprek 0) wordt gebouwd. Open punten staan onderaan.

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
- **Font:** Hind (zelfde font als het bronxx-theme; self-hosted woff2, Latin-subset, gewichten 300–700, OFL-licentie)
  in `/config/www/helder/fonts/`. Kaarten gebruiken alleen 300 en 400; 500–700 zijn er voor HA's eigen pagina's.
  `helder.js` laadt het font zelf (`@font-face` in `document.head`, familienaam `Helder Hind`); Helder hangt niet af van de bestaande
  `theme-font-loader.js` (die blijft voor de andere themes).
- **Eenheden:** `rem` met 14 px als basis.
- **Lettergroottes:** gelijk aan het bronxx-theme. Dat zet zelf geen groottes, dus = HA's eigen schaal
  (`--ha-font-size-*`): xs 10, s 12, m 14, l 16, xl 20, 2xl 24, 3xl 28 px. `--helder-font-size-*` verwijst naar
  die HA-variabelen (volgt `--ha-font-size-scale`), met dezelfde maat in rem als fallback. Kaart: naam m, secundair s,
  waarde l, grote uitlezing 3xl.
- **Apparaten:** iPhone, iPad, Mac (Safari) en desktop.
- **Achtergrond:** een aantal subtiele cirkelvormige radiale verlopen die overlopen in de paginakleur; in licht een
  warme lichte basiskleur, in donker een warme donkere basis.
- **Glas:** Apple-glas: 1 px lichte rand met highlight aan de bovenkant, plus achtergrond-blur.
- **Kleurgebruik:** per kaart instelbaar in de visuele editor: één accentkleur, of statuskleuren per domein
  (licht aan = amber, verwarmen = oranje, rolluik = accent).
- **Standaardwaarden** (allemaal aan te passen op de instellingenpagina): accent oranje `#ff6d00`; verlopen
  volgen het accent, basiskleur volgt de verlopen; glas middel (blur 20 px, vulling 40 %); glans zacht (0,45);
  radius 18 px; diepte rand + schaduw; kleurgebruik statuskleur per domein.

## 4. Architectuur
```
src/
  tokens/        tokens.ts (licht/donker) → build genereert themes/helder.yaml én de CSS-variabelen
  core/          base-card.ts (basisklasse), entity.ts, actions.ts, format.ts, register.ts
  ui/            gedeelde onderdelen (head, readout, toggle, slider, …) + styles/*.css
  settings/      instellingenpagina (panel_custom) + opslag en live toepassen van de thema-instellingen
  shell/         restyling van HA's eigen pagina's
  cards/<naam>/  <naam>-card.ts (+ onderdelen)
  index.ts       entry: registreert kaarten en shell
dev/             testomgeving met nep-HA (harness.html, fake-ha.ts, demo-card.ts; niet in de bundle)
scripts/         gen-theme.ts (themes/helder.yaml uit de tokens), postbuild.ts
docs/design.md   deze specificatie
deploy/          deploy.sh (uitrol naar HA met backup) + configuration.yaml.snippet
```
- TypeScript + Lit 3 (meegebundeld, niet die van HA lenen), Vite, één ES-module `helder.js`.
- Build draait in de Claude-werkomgeving; uitrol via `deploy.sh` in de Claude Code-app in HA.
- `dist/helder.js` is een kleine vaste loader die `helder.<hash>.js` importeert: `extra_module_url` en
  `panel_custom` hoeven nooit te veranderen en een browser draait nooit een verouderde bundle.
- `computeTokens(settings, mode)` in `src/tokens/tokens.ts` is de enige bron van alle `--helder-*`-waarden: de
  build maakt er `themes/helder.yaml` (standaardwaarden) van, de bundle past er live de opgeslagen instellingen mee
  toe (stylesheet met `!important` op `html`). HA's eigen variabelen (primaire kleur, kaartachtergrond, pagina-
  achtergrond, font) worden alleen overschreven zolang het theme `helder` actief is (marker `--helder-theme-active`).

### Instellingenpagina
- Eigen pagina "Helder" in de zijbalk via `panel_custom` in `configuration.yaml` (geen Python-integratie);
  het element zit in `helder.js`. Alleen zichtbaar voor admins (`require_admin: true`).
- Opslag centraal voor alle gebruikers en apparaten via HA's frontend-opslag: `frontend/set_system_data`
  (alleen admin), `frontend/get_system_data` en `frontend/subscribe_system_data` (iedereen), sleutel `helder`.
  Bron: `homeassistant/components/frontend/storage.py` (gecontroleerd in 2026.11.1).
- De bundle leest de instellingen bij het laden, abonneert zich op wijzigingen en zet de waarden live als
  `--helder-*`-variabelen. `themes/helder.yaml` bevat de standaardwaarden, zodat alles ook zonder opgeslagen
  instellingen werkt.
- Instelbaar: accentkleur, verloopkleur en basiskleur (elk apart voor licht en donker), glas (blur, vulling),
  glans, radius, diepte, standaard kleurgebruik, verminderde transparantie. Kleuren uit het vaste palet
  (kleuren, licht, grijs) of een eigen kleur via kleurenwiel met hexveld en voorbeeld in licht en donker.
- Het kleurgebruik in de kaarteditor staat standaard op de waarde van de instellingenpagina; een kaart kan
  daarvan afwijken.

### Contract van de basisklasse
- Levert `hass`, `config`, gemeten breedte, entity-resolutie, acties (`tap`/`hold`, standaard more-info), formattering.
- Kaart implementeert alleen `renderCard()`; validatie in `setConfig` (gooit een fout → HA toont foutkaart).
- `getGridOptions()` voor de sections-view; `getCardSize()` voor masonry (1 = 50 px).
- `getStubConfig()` voor de kaartkiezer; registratie in `window.customCards`.
- Staten: `unavailable`, `unknown` en ontbrekend veranderen nooit grootte of opbouw — waarden tonen `—`, bediening
  uitgeschakeld, alleen kleuren wijzigen. Attributen kunnen `null` of afwezig zijn.
- Optimistische UI via `perform(key, value, call)` + `pendingValue(key, actual)`: de nieuwe waarde staat direct
  in beeld en pulseert tot HA de entity bijwerkt (max. 15 s); bij een fout veert hij terug, schudt de kaart en toont
  de tweede regel 2,5 s "Mislukt, teruggezet". Sliders versturen bij loslaten.
- Kaarteditor via `HelderBaseEditor` (HA's `ha-form`); het veld Kleurgebruik zit er automatisch in.
- Breedte: werkt van 152 px (halve sectie) tot 520 px zonder afkappen; geen vaste breedtes.
- Alleen tokens (`var(--helder-*)`), nooit literal kleuren.

## 5. Kaarten
| Kaart | Status | Notities |
| --- | --- | --- |
| Rolluiken (`helder-cover-card`) | gepland | Brel/MotionBlinds; entity-ids `cover.rolluik_<beneden\|boven>_<voorzijde\|achterzijde>_…`. Naam, positie in %, horizontale slider, knoppen open/stop/dicht, presets (naam + positie, bijv. Gesloten 0 %, Ventileren 10 %, Halfopen 50 %, Open 100 %) instelbaar in de visuele editor |
| Klimaat (`helder-climate-card`) | gepland | Huidige temperatuur, doeltemperatuur met −/+, modus. Presets (label + temperatuur, bijv. Uit, Eco 16 °C, Comfort 19 °C) instelbaar in de visuele editor |
| Verlichting / schakelaars (`helder-light-card`, `helder-switch-card`) | gepland | Aan/uit met helderheidsslider |

## 6. Open punten
- [x] Accenttint, glas, radius, diepte, glans: standaardwaarden in §3, instelbaar op de instellingenpagina
- [x] Font: eigen loader in `helder.js` (§3)
- [x] Visuele editor per kaart: ja
- [x] Package manager en Node-versie: pnpm, Node 22 LTS
- [x] HA-pagina's eerst restylen: zijbalk, kopbalk, more-info-dialoog
- [x] Indeling kaarten: één kaart per domein
- [x] `frontend/*_system_data` bestaat in HA 2026.11.1 (gecontroleerd in `frontend/storage.py` van die tag)
- [ ] Blur-prestaties meten op iPhone 12 Pro Max
- [ ] Eerste uitrol in HA (backup, `configuration.yaml`, herstart): wacht op toestemming
- [ ] Shell: zijbalk, kopbalk, more-info-dialoog restylen

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
| 2026-11-15 | Klimaatkaart: zolang de verwarming actief verwarmt (`hvac_action: heating`), toont de kaart een lichte rode gloed vanaf de bovenrand richting het midden (token `--helder-heat-glow`) |
| 2026-11-15 | Lichtkaart: een brandende lamp krijgt een gloed vanaf de bovenrand in de echte lampkleur (`rgb_color`), sterkte schaalt mee met de helderheid; zonder kleur valt hij terug op de statuskleur |
| 2026-11-15 | Rolluikstand niet als vlak in de kaartachtergrond tonen (voorstel afgewezen) |
| 2026-11-15 | Bij `prefers-reduced-transparency: reduce` wordt het glas bijna dekkend (vulling 94 %, geen blur) |
| 2026-11-15 | Bezig-staat (pulserende waarde tot HA bevestigt, terugveren bij mislukken): eerst los voorbeeld in de mockup, nog niet besloten |
| 2026-11-15 | Rolluikkaart op smalle breedte (152 px): presets als één knop met keuzemenu, met zichtbaar pijltje en rand zodat het meteen als dropdown herkenbaar is |
| 2026-11-15 | Prestaties blur later meten op het oudste apparaat (iPhone 12 Pro Max); iPad is niet oud |
| 2026-11-16 | Alle thema-instellingen worden configureerbaar op een eigen instellingenpagina in HA (fundament, deze thread) |
| 2026-11-16 | Instellingen gelden centraal voor alle gebruikers en apparaten |
| 2026-11-16 | Alleen admins zien en wijzigen de instellingenpagina |
| 2026-11-16 | Accentkleur en achtergrondkleur los en onafhankelijk van elkaar te kiezen uit alle kleuren |
| 2026-11-16 | Achtergrond: verloopkleur en basiskleur allebei instelbaar, elk apart voor licht en donker |
| 2026-11-16 | Palet uitgebreid met twaalf lichte kleuren (perzik t/m zand) naast 21 kleuren en 5 grijzen |
| 2026-11-16 | Vrije kleurkiezer met kleurenwiel, hexveld en voorbeeld in licht en donker |
| 2026-11-16 | Kleurgebruik in de kaarteditor volgt standaard de instellingenpagina; per kaart te overschrijven |
| 2026-11-16 | Standaardaccent oranje `#ff6d00`; verlopen volgen standaard het accent, basiskleur volgt de verlopen |
| 2026-11-16 | Standaardglas middel (blur 20 px, vulling 40 %), glans zacht (0,45), radius 18 px, diepte rand + schaduw |
| 2026-11-16 | Standaard kleurgebruik: statuskleur per domein |
| 2026-11-16 | Bezig-staat goedgekeurd: komt in de basisklasse (puls tot HA bevestigt, terugveren + melding bij mislukken) |
| 2026-11-16 | Eigen container `helder-swipe-card` voor vegen tussen kaarten |
| 2026-11-16 | pnpm en Node 22 LTS |
| 2026-11-16 | HA-pagina's restylen in volgorde: zijbalk, kopbalk, more-info-dialoog |
| 2026-11-16 | Eén kaart per domein (geen varianten per kaart) |
| 2026-11-16 | Open Sans variable woff2 (Latin) met OFL in `/config/www/helder/fonts/` |
| 2026-11-16 | Wijzigingen aan `configuration.yaml` (`extra_module_url`, `panel_custom`) alleen na backup en expliciete toestemming |
| 2026-11-16 | Uitrol via `deploy/deploy.sh` in de Claude Code-app in HA |
| 2026-11-16 | Standaardtheme mag tijdelijk wisselen (weg van Fluvy) om Helder te testen, na toestemming |
| 2026-11-16 | Claude beslist voorlopig zoveel mogelijk zelf; eigen besluiten staan hieronder gemarkeerd met *(Claude)* |
| 2026-11-16 | *(Claude)* `helder.js` laadt Open Sans zelf; geen afhankelijkheid van `theme-font-loader.js` |
| 2026-11-16 | *(Claude)* De gebouwde bundle (`dist/`) wordt meegecommit, zodat HA kan uitrollen zonder Node |
| 2026-11-16 | *(Claude)* Instellingen worden toegepast via een geïnjecteerde stylesheet met `!important` op `html`, zodat ze HA's inline theme-variabelen overstijgen |
| 2026-11-16 | *(Claude)* Instellingenpagina werkt met een concept + live voorbeeld; pas "Opslaan" zet het voor iedereen door |
| 2026-11-16 | *(Claude)* Vaste loader `helder.js` die een bundle met contenthash importeert (geen `?v=` in `configuration.yaml`) |
| 2026-11-16 | *(Claude)* `deploy.sh` wijzigt `configuration.yaml` nooit; het controleert en toont de benodigde regels |
| 2026-11-16 | *(Claude)* `helder-swipe-card` wordt gebouwd in een eigen kaartgesprek, niet in het fundament |
| 2026-11-15 | Fundamentwerk in deze thread op branch `claude/project-thread-ganvgt`; merge naar `main` na akkoord |
| 2026-11-23 | Lettergroottes gelijk aan bronxx-theme = HA's standaardschaal (10/12/14/16/20/24/28 px); `--helder-font-size-*` volgt `--ha-font-size-*` |
| 2026-11-23 | Font Hind (zoals bronxx) i.p.v. Open Sans; static woff2 300–700 met OFL in `/config/www/helder/fonts/` |
| 2026-11-23 | *(Claude)* `helder.js` leest het actuele bundle-hash uit `VERSION` (no-store), zodat een gecachte loader nooit een oude bundle laadt |

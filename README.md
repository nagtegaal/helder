# Helder

Eigen theme en kaartbibliotheek voor Home Assistant: één set design-tokens voor licht en donker, eigen
Lit/TypeScript-kaarten en restyling van Home Assistants eigen pagina's.

- Specificatie en besluitenlog: [`docs/design.md`](docs/design.md)
- Werkafspraken: [`CLAUDE.md`](CLAUDE.md)

## Bouwen
```sh
pnpm install
pnpm build        # typecheck + dist/ (helder.js loader, helder.<hash>.js, fonts) + themes/helder.yaml
pnpm dev          # testomgeving met nep-HA → dev-dist/
python3 -m http.server 8765   # open http://localhost:8765/dev/harness.html?view=cards|panel&mode=light|dark
```
`dist/` en `themes/helder.yaml` worden meegecommit, zodat HA kan uitrollen zonder Node.

## Uitrollen naar HA
In de Claude Code-app in HA, vanuit een checkout van deze repo: `./deploy/deploy.sh` (maakt eerst een backup in
`/config/backups/helder/`). Eenmalig: de regels uit `deploy/configuration.yaml.snippet` in `configuration.yaml`
zetten en HA herstarten.

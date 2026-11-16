#!/usr/bin/env bash
# Deploys a built Helder (dist/ + themes/helder.yaml) into Home Assistant's config folder.
# Run inside HA (Claude Code app / terminal) from a checkout of this repo:  ./deploy/deploy.sh [config-dir]
# - Backs up the current Helder files first (config/backups/helder/<timestamp>.tar.gz).
# - Never edits configuration.yaml; it only checks it and prints the snippet when something is missing.
# - Afterwards: reload themes (Developer tools > YAML > Themes) and refresh the browser. A restart is only needed
#   the first time (extra_module_url and panel_custom are read at startup).
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="${1:-}"
if [[ -z "$CONFIG" ]]; then
  for c in /config /homeassistant; do [[ -f "$c/configuration.yaml" ]] && CONFIG="$c" && break; done
fi
[[ -n "$CONFIG" && -f "$CONFIG/configuration.yaml" ]] || { echo "configuration.yaml not found; pass the config dir" >&2; exit 1; }
[[ -f "$SRC/dist/helder.js" ]] || { echo "dist/helder.js missing; run 'pnpm build' first" >&2; exit 1; }

WWW="$CONFIG/www/helder"
TS="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$CONFIG/backups/helder"
if [[ -d "$WWW" || -f "$CONFIG/themes/helder.yaml" ]]; then
  tar -czf "$CONFIG/backups/helder/$TS.tar.gz" -C "$CONFIG" \
    $( [[ -d "$WWW" ]] && echo www/helder ) $( [[ -f "$CONFIG/themes/helder.yaml" ]] && echo themes/helder.yaml )
  echo "backup: backups/helder/$TS.tar.gz"
fi

mkdir -p "$WWW/fonts" "$CONFIG/themes"
cp "$SRC"/dist/helder.*.js "$WWW/"
cp "$SRC/dist/fonts/"* "$WWW/fonts/"
cp "$SRC/dist/VERSION" "$WWW/VERSION"
cp "$SRC/themes/helder.yaml" "$CONFIG/themes/helder.yaml"
# the loader goes last, so browsers never import a bundle that is not there yet
cp "$SRC/dist/helder.js" "$WWW/helder.js"

# keep the current bundle and the previous one (open tabs may still import it)
CURRENT="$(sed -n "s|^import './\(helder\.[0-9a-f]*\.js\)';|\1|p" "$WWW/helder.js")"
ls -t "$WWW"/helder.*.js 2>/dev/null | grep -v "/$CURRENT$" | tail -n +2 | xargs -r rm -f || true

echo "deployed Helder $(cat "$WWW/VERSION") to $WWW"

missing=0
grep -q "/local/helder/helder.js" "$CONFIG/configuration.yaml" || missing=1
grep -q "helder-settings-panel" "$CONFIG/configuration.yaml" || missing=1
if [[ $missing == 1 ]]; then
  echo
  echo "configuration.yaml does not load Helder yet. Add this (with a backup first), then restart HA:"
  cat "$SRC/deploy/configuration.yaml.snippet"
fi

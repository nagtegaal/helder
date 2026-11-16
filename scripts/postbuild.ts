// After `vite build`: give the bundle a content hash, write the stable loader `helder.js` that imports it
// (so HA's extra_module_url never has to change and browsers never run a stale bundle), copy the font and its
// licence, and regenerate themes/helder.yaml.
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { themeYaml } from './gen-theme';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const bundlePath = join(dist, 'helder-bundle.js');
const hash = createHash('sha256').update(readFileSync(bundlePath)).digest('hex').slice(0, 10);
const bundleName = `helder.${hash}.js`;
renameSync(bundlePath, join(dist, bundleName));
writeFileSync(
  join(dist, 'helder.js'),
  `// Helder ${pkg.version}: stable entry for frontend.extra_module_url and panel_custom.module_url.\nimport './${bundleName}';\n`,
);

const require = createRequire(import.meta.url);
const fontPkg = dirname(require.resolve('@fontsource-variable/open-sans/package.json'));
mkdirSync(join(dist, 'fonts'), { recursive: true });
copyFileSync(join(fontPkg, 'files/open-sans-latin-wght-normal.woff2'), join(dist, 'fonts/open-sans-latin-wght-normal.woff2'));
copyFileSync(join(fontPkg, 'LICENSE'), join(dist, 'fonts/OFL.txt'));

writeFileSync(join(root, 'themes/helder.yaml'), themeYaml());
writeFileSync(join(dist, 'VERSION'), `${pkg.version} ${hash}\n`);
console.log(`dist/${bundleName} + helder.js loader, fonts, themes/helder.yaml`);

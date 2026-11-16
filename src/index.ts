// Entry point of helder.js (loaded on every page via `frontend: extra_module_url`, and as the settings panel's module).
import { loadFont } from './core/font';
import { startThemeRuntime } from './settings/apply';
import './settings/panel';

declare const __HELDER_VERSION__: string;

loadFont();
startThemeRuntime();

// Cards register themselves here once they exist (one thread per card):
// import './cards/cover/cover-card';

console.info(`%c HELDER %c ${__HELDER_VERSION__} `, 'background:#ff6d00;color:#fff;border-radius:3px 0 0 3px', 'background:#2a221c;color:#fff;border-radius:0 3px 3px 0');

import browser from 'browser-sync';
import { createRequire } from 'module';

const packageJson = createRequire(import.meta.url)('../package.json');
const pluginsJson = createRequire(import.meta.url)('../plugins.json');
const pathsJson = createRequire(import.meta.url)('./gulp.json');

export const { dependencies, name, version } = packageJson;
export const isIterableArray = (array) =>
  Array.isArray(array) && !!array.length;
export const isProd = process.env.MODE === 'PROD';
export const baseDir = isProd ? pathsJson.dir.prod : pathsJson.dir.dev;
export const paths = pathsJson;
export const plugins = pluginsJson;
export const browserSync = browser.create();

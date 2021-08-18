const browserSync = require('browser-sync').create();
const paths = require('./gulp.json');
const plugins = require('../plugins.json');
const { name, version, dependencies } = require('../package.json');

const isIterableArray = (array) => Array.isArray(array) && !!array.length;
const isProd = process.env.MODE === 'PROD';
const baseDir = isProd ? paths.dir.prod : paths.dir.dev;

module.exports = {
  name,
  version: `v${version}`,
  dependencies,
  paths,
  plugins,
  isIterableArray,
  baseDir,
  browserSync,
  isProd,
};

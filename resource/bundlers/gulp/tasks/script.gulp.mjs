import { dest, src } from 'gulp';
import babel from 'gulp-babel';
import clone from 'gulp-clone';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import merge from 'merge-stream';
import webpackStream from 'webpack-stream';

import { baseDir, browserSync, isProd, paths } from './utils.mjs';

/* -------------------------------------------------------------------------- */
/*                       JavaScript Compile with Webpack                      */
/* -------------------------------------------------------------------------- */
export async function scriptWebpack() {
  src('./src/js/index.js')
    .pipe(
      webpackStream({
        mode: isProd ? 'production' : 'development',
        entry: {
          main: './src/js/index.js',
        },
        output: {
          filename: '[name].bundle.js',
        },
      })
    )
    .pipe(dest(`${baseDir}/js`));
}

/* -------------------------------------------------------------------------- */
/*                             JavaScript Compile                             */
/* -------------------------------------------------------------------------- */

export default async function script() {
  /* ------------------------------ Theme script ------------------------------ */
  const sourceStream = src(paths.script.src);
  const jsStream = sourceStream
    .pipe(clone())
    .pipe(sourcemaps.init())
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(concat('main.js'))
    .pipe(replace(/^(export|import).*/gm, ''))
    .pipe(babel());

  const compressedStream = jsStream
    .pipe(clone())
    .pipe(uglify())
    .pipe(rename('main.min.js'));

  return merge(jsStream, compressedStream)
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${baseDir}/${paths.script.dest}`))
    .on('end', () => {
      browserSync.browserSync;
    });
}

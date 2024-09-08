import { sass } from '@mr-hope/gulp-sass';
import { dest, src } from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import clone from 'gulp-clone';
import gulpIf from 'gulp-if';
import rename from 'gulp-rename';
import rtlcss from 'gulp-rtlcss';
import sourcemaps from 'gulp-sourcemaps';
import merge from 'merge-stream';

import { baseDir, browserSync, paths } from './utils.mjs';

function getOption(outputStyle) {
  return {
    outputStyle,
    precision: 5, // rounding of css color values, etc..
  };
}

/* -------------------------------------------------------------------------- */
/*                                SCSS Compile                                */
/* -------------------------------------------------------------------------- */
export default async function style() {
  const sourcemapsStream = src(paths.style.src).pipe(sourcemaps.init());

  const expandedStream = sourcemapsStream
    .pipe(clone())
    .pipe(sass(getOption('expanded')).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }));

  const compressedStream = sourcemapsStream
    .pipe(clone())
    .pipe(sass(getOption('compressed')).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }));

  const ltrCompressedStream = compressedStream
    .pipe(clone())
    .pipe(rename({ suffix: '.min' }));

  const rtlExpandedStream = expandedStream
    .pipe(clone())
    .pipe(gulpIf(paths.rtl, rtlcss()))
    .pipe(gulpIf(paths.rtl, rename({ suffix: '-rtl' })));

  const rtlCompressedStream = compressedStream
    .pipe(clone())
    .pipe(gulpIf(paths.rtl, rtlcss()))
    .pipe(gulpIf(paths.rtl, rename({ suffix: '-rtl.min' })));

  return merge(
    expandedStream,
    ltrCompressedStream,
    rtlExpandedStream,
    rtlCompressedStream
  )
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${baseDir}/${paths.style.dest}`))
    .pipe(browserSync.stream());
}

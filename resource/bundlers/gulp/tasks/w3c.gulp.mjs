import ansi from 'ansi';
import { src } from 'gulp';
import w3cjs from 'gulp-w3cjs';
import through from 'through2';
import { argv } from 'yargs';

import { baseDir, paths } from './utils';

const cursor = ansi(process.stdout);

/* -------------------------------------------------------------------------- */
/*                           w3c validation for HTML                          */
/* -------------------------------------------------------------------------- */
export default async function w3c(done) {
  let htmlfiles = `${baseDir}/${paths.pug.dest}/**/*.html`;
  if (argv.html) {
    htmlfiles = `${paths.dir.dev}/${argv.html}.html`;
    cursor.hex('#00ffff').bold();
    console.log('html: ', htmlfiles);
    cursor.reset();
  }

  return src(htmlfiles)
    .pipe(w3cjs())
    .pipe(
      through.obj((file, enc, cb) => {
        console.log({
          url: file.history[0],
          ...(!file.w3cjs.success ? { ...file.w3cjs } : {}),
        });
        cb();
      })
    )
    .pipe(w3cjs.reporter())
    .on('end', done);
}

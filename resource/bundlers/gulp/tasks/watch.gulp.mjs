import { series, watch } from 'gulp';

import { compilePug } from './pug.gulp.mjs';
import script, { scriptWebpack } from './script.gulp.mjs';
import style from './style.gulp.mjs';
import { baseDir, browserSync, paths } from './utils.mjs';

/* -------------------------------------------------------------------------- */
/*                                   Watcher                                  */
/* -------------------------------------------------------------------------- */
export default async function watchAll() {
  browserSync.init({
    server: { baseDir },
    port: 3000,
    open: true,
    notify: false,
    middleware: compilePug,
  });

  function updating(done) {
    browserSync.reload();
    done();
  }

  watch(paths.pug.src.all, series(updating));
  watch(paths.style.src, series(style));
  watch(paths.script.src, series(script));
  watch(['./src/assets/js/index.js'], series(scriptWebpack));
  watch(
    paths.watch.map((dir) => `${paths.dir.dev}/${dir}`),
    series(updating)
  );
}

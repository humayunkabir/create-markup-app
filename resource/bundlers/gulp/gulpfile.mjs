import { parallel, series, task } from 'gulp';

import assets from './tasks/assets.gulp.mjs';
import { buildPush, buildStatic } from './tasks/build.gulp.mjs';
import clean, { cleanBuild, cleanLive } from './tasks/clean.gulp.mjs';
import plugin from './tasks/plugins.gulp.mjs';
import product from './tasks/product.gulp.mjs';
import pugTask from './tasks/pug.gulp.mjs';
import script, { scriptWebpack } from './tasks/script.gulp.mjs';
import style from './tasks/style.gulp.mjs';
import watchAll from './tasks/watch.gulp.mjs';

/* -------------------------------------------------------------------------- */
/*                                   Compile                                  */
/* -------------------------------------------------------------------------- */
async function compile() {
  parallel(style, script, scriptWebpack, plugin, assets);
}
task('compile:all', parallel(compile, pugTask));

/* -------------------------------------------------------------------------- */
/*                                   Deploy                                   */
/* -------------------------------------------------------------------------- */
task('build', series(cleanBuild, buildStatic, 'compile:all'));
task('build:test', series('build', watchAll));
task('live', series(cleanLive, 'build', buildPush));

/* -------------------------------------------------------------------------- */
/*                         Run development environment                        */
/* -------------------------------------------------------------------------- */
task('default', series(clean, compile, watchAll));

/* -------------------------------------------------------------------------- */
/*                                   Product                                  */
/* -------------------------------------------------------------------------- */
task('product:make', series('compile:all', product));

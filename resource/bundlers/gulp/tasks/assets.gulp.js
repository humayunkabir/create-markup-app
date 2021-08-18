const gulp = require('gulp');
const { paths, baseDir } = require('./utils');

/* -------------------------------------------------------------------------- */
/*                                   Assets                                   */
/* -------------------------------------------------------------------------- */
gulp.task('assets', () =>
  gulp.src(paths.assets.src).pipe(gulp.dest(`${baseDir}/${paths.assets.dest}`))
);

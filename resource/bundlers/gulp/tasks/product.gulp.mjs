import { dest, src } from 'gulp';
import zip from 'gulp-zip';
import { createRequire } from 'module';
import { name, version } from './utils.mjs';

const paths = createRequire(import.meta.url)('./gulp.json');

/* -------------------------------------------------------------------------- */
/*                                Make Product                                */
/* -------------------------------------------------------------------------- */
export default async function product() {
  src(paths.product.paths, {
    base: './',
  })
    .pipe(zip(`releases/${name}-${version}.zip`))
    .pipe(dest('./'));
}

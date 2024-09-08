import { dest, src } from 'gulp';
import { paths, version } from './utils.mjs';

/* -------------------------------------------------------------------------- */
/*                                    Build                                   */
/* -------------------------------------------------------------------------- */
export async function buildStatic() {
  src(
    paths.watch.map((dir) => `${dir}/**/*`),
    {
      cwd: paths.dir.dev,
      base: `./${paths.dir.dev}`,
    }
  ).pipe(dest(paths.dir.prod));
}

export async function buildPush() {
  src('**/*', {
    cwd: paths.dir.prod,
    base: `./${paths.dir.prod}`,
  }).pipe(dest(`live/${version}`));
}

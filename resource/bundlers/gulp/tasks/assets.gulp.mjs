import { dest, src } from 'gulp';
import { baseDir, paths } from './utils.mjs';

/* -------------------------------------------------------------------------- */
/*                                   Assets                                   */
/* -------------------------------------------------------------------------- */
export default async function assets() {
  src(paths.assets.src).pipe(dest(`${baseDir}/${paths.assets.dest}`));
}

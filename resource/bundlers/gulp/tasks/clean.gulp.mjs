import { deleteAsync } from 'del';

import { baseDir, paths, version } from './utils.mjs';

/* -------------------------------------------------------------------------- */
/*                                    Clean                                   */
/* -------------------------------------------------------------------------- */
export default async function clean() {
  await deleteAsync([
    `${baseDir}/${paths.style.dest}/**/*.*`,
    `${baseDir}/${paths.script.dest}/**/*.*`,
    `${baseDir}/**/*.html`,
  ]);
}

export async function cleanBuild() {
  await deleteAsync(paths.dir.prod);
}

export async function cleanLive() {
  await deleteAsync(`live/${version}`);
}

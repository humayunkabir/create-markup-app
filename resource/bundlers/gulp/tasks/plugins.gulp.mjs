import { deleteSync } from 'del';
import { dest, src } from 'gulp';

import { baseDir, dependencies, isIterableArray, plugins } from './utils.mjs';

/* -------------------------------------------------------------------------- */
/*                                   plugin                                   */
/* -------------------------------------------------------------------------- */
// Move plugin css and js files from node_modules to public folder

async function pluginTemp() {
  const modules = Object.keys(dependencies).map((key) => `${key}/**/*`);

  return src(modules, { cwd: 'node_modules', base: './node_modules' }).pipe(
    dest('temp')
  );
}

async function pluginMove() {
  const promises = [];
  const addToPromises = (src, dest) =>
    promises.push(
      new Promise((resolve, reject) => {
        src(src)
          .pipe(dest(dest))
          .on('end', (err) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          });
      })
    );

  Object.keys(plugins).forEach((plugin) => {
    const { src, dest } = plugins[plugin];

    if (typeof src === 'object') {
      if (isIterableArray(src)) {
        src.forEach((file) => {
          addToPromises(
            `./node_modules/${plugin}/${file}`,
            `${baseDir}/plugins/${dest}`
          );
        });
      } else {
        const destDirectories = Object.keys(src);
        destDirectories.forEach((dir) => {
          if (isIterableArray(plugins[plugin].src[dir])) {
            plugins[plugin].src[dir].forEach((file) => {
              addToPromises(
                `./node_modules/${plugin}/${file}`,
                `${baseDir}/plugins/${dest}/${dir}`
              );
            });
          } else {
            addToPromises(
              `./node_modules/${plugin}/${plugins[plugin].src[dir]}`,
              `${baseDir}/plugins/${dest}/${dir}`
            );
          }
        });
      }
    } else {
      addToPromises(
        `./node_modules/${plugin}/${src}`,
        `${baseDir}/plugins/${dest}`
      );
    }
  });
  return Promise.all(promises);
}

async function pluginClean() {
  const directories = Object.keys(plugins).map(
    (plugin) => `${baseDir}/plugins/${plugins[plugin].dest}`
  );
  const targetedDirectories = [...directories, 'temp'];

  return deleteSync(targetedDirectories);
}

export default async function plugin() {
  series(pluginClean, pluginMove);
}

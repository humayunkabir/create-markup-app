const gulp = require('gulp');
const del = require('del');

const { dependencies, plugins, baseDir, isIterableArray } = require('./utils');

/* -------------------------------------------------------------------------- */
/*                                   plugin                                   */
/* -------------------------------------------------------------------------- */
// Move plugin css and js files from node_modules to public folder

gulp.task('plugin:temp', () => {
  const modules = Object.keys(dependencies).map((key) => `${key}/**/*`);

  return gulp
    .src(modules, { cwd: 'node_modules', base: './node_modules' })
    .pipe(gulp.dest('temp'));
});

gulp.task('plugin:move', () => {
  const promises = [];
  const addToPromises = (src, dest) =>
    promises.push(
      new Promise((resolve, reject) => {
        gulp
          .src(src)
          .pipe(gulp.dest(dest))
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
});

gulp.task('plugin:clean', () => {
  const directories = Object.keys(plugins).map(
    (plugin) => `${baseDir}/plugins/${plugins[plugin].dest}`
  );
  const targetedDirectories = [...directories, 'temp'];

  return del(targetedDirectories);
});

gulp.task('plugin', gulp.series('plugin:clean', 'plugin:move'));

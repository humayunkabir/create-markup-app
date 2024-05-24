import fs from 'fs';
import { projectInstall } from 'pkg-install';
import getBundler from '../configuration/bundler.js';
import getDependencies from '../configuration/dependencies.js';
import plugins from '../configuration/plugins.js';

const installPackages = async (options) => {
  const bundler = await getBundler(options.bundler.toLowerCase());
  const packageJson = JSON.stringify(
    {
      name: options.name,
      version: '0.1.0',
      description: 'Powered by create-markup',
      license: 'MIT',
      ...bundler,
      dependencies: getDependencies(options),
      keywords: ['create-markup', 'cli'],
      browserslist: ['last 5 version'],
    },
    null,
    2
  );

  fs.writeFileSync(`${options.targetDir}/package.json`, packageJson);

  if (options.bundler === 'Gulp') {
    fs.writeFileSync(
      `${options.targetDir}/plugins.json`,
      JSON.stringify(plugins, null, 2)
    );
  }

  const { stdout } = await projectInstall({
    prefer: options.packageManager,
    cwd: options.targetDir,
  });

  console.log(stdout);
};

export default installPackages;

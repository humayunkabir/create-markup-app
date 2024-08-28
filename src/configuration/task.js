import copyTemplateFiles from '../util/copy.js';
import initGit from '../util/git.js';
import installPackages from '../util/install.js';

export default function getTaskList(options) {
  return [
    {
      title: 'Copying project files',
      async task() {
        await copyTemplateFiles({
          source: `${options.sourceDir}/project`,
          target: options.targetDir,
        });
      },
    },
    {
      title: 'Copying script files',
      async task() {
        await copyTemplateFiles({
          source: `${options.sourceDir}/script/${options.script.toLowerCase()}`,
          target: `${options.targetDir}/src/${options.script.toLowerCase()}`,
        });
      },
    },
    {
      title: 'Copying style files',
      async task() {
        await copyTemplateFiles({
          source: `${options.sourceDir}/style/${options.style.toLowerCase()}`,
          target: `${options.targetDir}/src/${options.style.toLowerCase()}`,
        });
      },
    },
    {
      title: 'Copying template files',
      async task() {
        await copyTemplateFiles({
          source: `${
            options.sourceDir
          }/template-engine/${options.templatingEngine.toLowerCase()}`,
          target: `${options.targetDir}/src`,
        });
      },
    },
    {
      title: 'Copying bundler files',
      async task() {
        await copyTemplateFiles({
          source: `${
            options.sourceDir
          }/bundlers/${options.bundler.toLowerCase()}`,
          target: options.targetDir,
        });
      },
    },
    {
      title: 'Initializing Git',
      async task() {
        await initGit(options.targetDir);
      },
      enabled() {
        return options.git;
      },
    },
    {
      title: 'Installing dependencies',
      async task() {
        await installPackages(options);
      },
      skip() {
        return !options.install
          ? 'Pass --install to automatically install dependencies'
          : undefined;
      },
      enabled() {
        return options.install;
      },
    },
  ];
}

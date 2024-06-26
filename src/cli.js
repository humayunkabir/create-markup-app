import arg from 'arg';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createProject } from './main.js';
import getQuestion from './questions.js';

function parseArgumentIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '--template': String,
      '--templatingEngine': String,
      '--cssFramework': String,
      '--packageManager': String,
      '--bundler': String,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
      '-t': '--template',
      '-e': '--templatingEngine',
      '-cf': '--cssFramework',
      '-p': '--packageManager',
      '-b': '--bundler',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    name: args._[0],
    skipPrompts: args['--yes'],
    git: args['--git'],
    templatingEngine: args['--templatingEngine'],
    cssFramework: args['--cssFramework'],
    style: args['--style'],
    script: args['--script'],
    packageManager: args['--packageManager'],
    install: args['--install'] || true,
    bundler: args['--bundler'],
  };
}

async function promptForMissingOptions(options) {
  const defaultOptions = {
    name: options.name || 'markup',
    git: true,
    script: 'JS',
    style: 'SCSS',
    templatingEngine: 'Pug',
    cssFramework: 'Bootstrap',
    packageManager: 'yarn',
    install: true,
    bundler: 'Gulp',
  };

  if (options.skipPrompts) {
    return defaultOptions;
  }

  const { skipPrompts } = await inquirer.prompt(getQuestion('skipPrompts'));

  if (skipPrompts) {
    return defaultOptions;
  }

  const answers = await inquirer.prompt(
    [
      'name',
      'script',
      'templatingEngine',
      'bundler',
      'cssFramework',
      'style',
      'packageManager',
      'git',
      'install',
    ]
      .map((name) => !options[name] && getQuestion(name))
      .filter((question) => question)
  );

  return {
    ...options,
    ...answers,
  };
}

export async function cli(args) {
  const time = Date.now();
  let options = parseArgumentIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
  console.log(
    `Total time required for ${chalk.cyanBright.bold(
      options.packageManager
    )} is ${chalk.yellow.bold(Date.now() - time)}ms`
  );
}

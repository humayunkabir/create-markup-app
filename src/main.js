import chalk from 'chalk';
import fs from 'fs';
import Listr from 'listr';
import path from 'path';
import { promisify } from 'util';
import getTaskList from './configuration/task.js';
const access = promisify(fs.access);

export async function createProject(options) {
  console.log(chalk.green(`Creating project ${options.name}`));
  options = {
    ...options,
    targetDir: options.targetDir || process.cwd() + '/' + options.name,
  };

  const currentFileUrl = import.meta.url;
  const sourceDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../resource'
  );

  options.sourceDir = sourceDir;

  try {
    await access(sourceDir, fs.constants.R_OK);
  } catch (err) {
    console.error(`${chalk.red.bold('ERROR')} Invalid template name`);
    process.exit(1);
  }

  const tasks = new Listr(getTaskList(options));
  await tasks.run();

  console.log(
    chalk.redBright(`
    ▄████████    ▄████████    ▄████████    ▄████████     ███        ▄████████           
    ███    ███   ███    ███   ███    ███   ███    ███ ▀█████████▄   ███    ███          
    ███    █▀    ███    ███   ███    █▀    ███    ███    ▀███▀▀██   ███    █▀           
    ███         ▄███▄▄▄▄██▀  ▄███▄▄▄       ███    ███     ███   ▀  ▄███▄▄▄              
    ███        ▀▀███▀▀▀▀▀   ▀▀███▀▀▀     ▀███████████     ███     ▀▀███▀▀▀              
    ███    █▄  ▀███████████   ███    █▄    ███    ███     ███       ███    █▄           
    ███    ███   ███    ███   ███    ███   ███    ███     ███       ███    ███          
    ████████▀    ███    ███   ██████████   ███    █▀     ▄████▀     ██████████          
                 ███    ███                                                             
       ▄▄▄▄███▄▄▄▄      ▄████████    ▄████████    ▄█   ▄█▄ ███    █▄     ▄███████▄      
     ▄██▀▀▀███▀▀▀██▄   ███    ███   ███    ███   ███ ▄███▀ ███    ███   ███    ███      
     ███   ███   ███   ███    ███   ███    ███   ███▐██▀   ███    ███   ███    ███      
     ███   ███   ███   ███    ███  ▄███▄▄▄▄██▀  ▄█████▀    ███    ███   ███    ███      
     ███   ███   ███ ▀███████████ ▀▀███▀▀▀▀▀   ▀▀█████▄    ███    ███ ▀█████████▀       
     ███   ███   ███   ███    ███ ▀███████████   ███▐██▄   ███    ███   ███             
     ███   ███   ███   ███    ███   ███    ███   ███ ▀███▄ ███    ███   ███             
      ▀█   ███   █▀    ███    █▀    ███    ███   ███   ▀█▀ ████████▀   ▄████▀           
                                        ███    ███   ▀                                  
                          ▄████████    ▄███████▄    ▄███████▄                           
                         ███    ███   ███    ███   ███    ███                           
                         ███    ███   ███    ███   ███    ███                           
                         ███    ███   ███    ███   ███    ███                           
                       ▀███████████ ▀█████████▀  ▀█████████▀                            
                         ███    ███   ███          ███                                  
                         ███    ███   ███          ███                                  
                         ███    █▀   ▄████▀       ▄████▀                                
  `)
  );

  console.log(`
${chalk.green.bold('DONE')} ${options.name} Ready 🔥
  `);

  console.log(
    chalk.yellow.bold(
      `\ncd ${options.name} && ${options.packageManager} start\n`
    )
  );

  return true;
}

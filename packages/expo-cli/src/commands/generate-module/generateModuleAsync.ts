import { CommandOptions } from 'commander';
import fse from 'fs-extra';
import path from 'path';

import CommandError from '../../CommandError';
import configureModule from './configureModule';
import fetchTemplate from './fetchTemplate';
import promptQuestionsAsync from './promptQuestionsAsync';

export default async function generateModuleAsync(
  newModuleProjectDir: string,
  options: CommandOptions & { template?: string }
) {
  const newModulePathFromArgv = newModuleProjectDir && path.resolve(newModuleProjectDir);
  const newModuleName = newModulePathFromArgv && path.basename(newModulePathFromArgv);
  const newModuleParentPath = newModulePathFromArgv
    ? path.dirname(newModulePathFromArgv)
    : process.cwd();

  const configuration = await promptQuestionsAsync(newModuleName);
  const newModulePath = path.resolve(newModuleParentPath, configuration.npmModuleName);
  if (fse.existsSync(newModulePath)) {
    throw new CommandError('MODULE_ALREADY_EXISTS', `Module '${newModulePath}' already exists!`);
  }

  await fetchTemplate(newModulePath, options.template);

  await configureModule(newModulePath, configuration);
}

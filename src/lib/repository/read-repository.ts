import process from 'process';

import fs from 'fs-extra';

import { Deps } from '../utils/ioc';

import { gitLog } from './git-log';

export async function readRepository({ config }: Deps, pathToRepo: string) {
  const repo = config.repositories.find(({ path }) => path === pathToRepo);

  if (!repo || !fs.existsSync(pathToRepo))
    throw new Error(`Couldn't find repository at path ${pathToRepo}`);

  process.chdir(pathToRepo);

  return gitLog(repo);
}

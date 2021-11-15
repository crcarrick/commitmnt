import process from 'process';

import fs from 'fs-extra';

import { getCommits } from '../git/get-commits';
import { Deps } from '../utils/ioc';

export async function readRepository(pathToRepo: string, { config }: Deps) {
  const repo = config.repositories.find(({ path }) => path === pathToRepo);

  if (!repo || !fs.existsSync(pathToRepo)) {
    throw new Error(`Couldn't find repository at path ${pathToRepo}`);
  }

  process.chdir(pathToRepo);

  return getCommits('');
}

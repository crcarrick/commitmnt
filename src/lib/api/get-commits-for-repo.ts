import process from 'process';

import fs from 'fs-extra';

import { getCommits } from '../git/get-commits';
import { Repository } from '../types';
import { Deps } from '../utils/ioc';

export async function getCommitsForRepo({ cache, config }: Deps, repoPath: string) {
  const repo = config.repositories.find(({ path }) => path === repoPath);
  const cached = await cache.get<Repository>(repoPath);

  if (!repo || !fs.existsSync(repoPath)) {
    throw new Error(`Couldn't find repository at path ${repoPath}`);
  }

  // cd into the repo
  process.chdir(repoPath);

  const commits = getCommits({ author: repo.identifier, after: cached.last });
}

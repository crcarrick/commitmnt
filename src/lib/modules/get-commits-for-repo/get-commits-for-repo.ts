import fs from 'fs-extra';

import { Deps, Repository } from '../../types';
import git from '../../utils/git';

import { getCommits } from './helpers/get-commits';

/**
 * Gets a list of commit dates for a given repo
 *
 * @param repo the repository object to lookup commits from
 * @returns the list of commit dates
 *
 * @category Public API Module
 */
export async function getCommitsForRepo({ cache }: Deps, repo: Repository) {
  const cached = await cache.get<Repository>(repo.path);

  if (!repo || !fs.existsSync(repo.path)) {
    throw new Error(`Couldn't find repository at path ${repo.path}`);
  }

  process.chdir(repo.path);

  await git('stash');
  await git(`checkout ${repo.branch}`);

  return getCommits({ author: repo.author, after: cached?.after });
}

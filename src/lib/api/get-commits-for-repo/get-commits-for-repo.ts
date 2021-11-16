import fs from 'fs-extra';

import { Deps, Repository } from '../../types';
import { getCommits } from '../../utils/get-commits';

/**
 * Gets a list of commit dates for a given repo
 *
 * @param repo the repository object to lookup commits from
 * @returns the list of commit dates
 *
 * @category Public API
 */
export async function getCommitsForRepo({ cache }: Deps, repo: Repository) {
  const cached = await cache.get<Repository>(repo.path);

  if (!repo || !fs.existsSync(repo.path)) {
    throw new Error(`Couldn't find repository at path ${repo.path}`);
  }

  process.chdir(repo.path);

  return getCommits({ author: repo.author, after: cached?.after });
}

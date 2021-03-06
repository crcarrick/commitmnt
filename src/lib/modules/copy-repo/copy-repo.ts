import path from 'path';

import { Deps, Repository } from '../../types';
import * as git from '../../utils/git';
import { copyCommitsToRepo } from '../copy-commits-to-repo';
import { getCommitsForRepo } from '../get-commits-for-repo';

/**
 * Helper function that represents the copy operation for a single repo.
 * Uses {@link getCommitsForRepo} & {@link copyCommitsToRepo} together
 * to copy commits from a list of repositories.
 *
 * @param repo the repository to copy
 * @returns the number of commits copied
 *
 * @category Public API Module
 */
export async function copyRepo(deps: Deps, repo: Repository) {
  const dates = await getCommitsForRepo(deps, repo);

  if (dates.length > 0) {
    const total = await copyCommitsToRepo(deps, dates);

    await deps.cache.set<Repository>(repo.path, { ...repo, after: dates[dates.length - 1] });
    await git.add();
    await git.commit({ message: `cache updates for ${path.basename(repo.path)}` });
    await git.push();

    return total;
  }

  return 0;
}

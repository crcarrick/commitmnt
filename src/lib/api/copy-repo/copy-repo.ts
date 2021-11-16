import { Deps, Repository } from '../../types';
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
 */
export async function copyRepo(deps: Deps, repo: Repository) {
  const dates = await getCommitsForRepo(deps, repo);
  const total = await copyCommitsToRepo(deps, dates);

  if (dates.length > 0) {
    await deps.cache.set<Repository>(repo.path, { ...repo, after: dates[dates.length - 1] });
  }

  return total;
}

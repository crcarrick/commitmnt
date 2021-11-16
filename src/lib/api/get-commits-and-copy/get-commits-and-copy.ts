import { Deps, Repository } from '../../types';
import { copyCommitsToRepo } from '../copy-commits-to-repo';
import { getCommitsForRepo } from '../get-commits-for-repo';

/**
 * Uses {@link getCommitsForRepo} & {@link copyCommitsToRepo} together
 * to copy commits from a list of repositories
 *
 * @category Public API
 */
export async function getCommitsAndCopy(deps: Deps) {
  const { cache, config, spinner } = deps;

  let totalCommits = 0;

  spinner.text = 'Reading repositories...';

  for (const repo of config.repositories) {
    spinner.text = `Reading repositories... (${repo.path})`;
    const dates = await getCommitsForRepo(deps, repo);

    spinner.text = `Copying commits... (${repo.path})`;
    const total = await copyCommitsToRepo(deps, dates);

    totalCommits += total;

    if (dates.length) {
      cache.set<Repository>(repo.path, { ...repo, after: dates[dates.length - 1] });
    }
  }

  spinner.succeed(`Success!  Wrote commits to local repository... (${totalCommits})`);
}

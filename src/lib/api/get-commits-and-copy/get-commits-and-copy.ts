import { Deps, Repository } from '../../types';
import { copyCommitsToRepo } from '../copy-commits-to-repo';
import { getCommitsForRepo } from '../get-commits-for-repo';

export async function getCommitsAndCopy(deps: Deps) {
  const { cache, config, spinner } = deps;

  let totalCommits = 0;

  spinner.start('Reading repositories...');

  for (const repo of config.repositories) {
    spinner.text = `Reading repositories... (${repo.path})`;

    const commits = await getCommitsForRepo(deps, repo);

    spinner.text = `Copying commits... (${repo.path})`;

    const total = await copyCommitsToRepo(deps, commits);

    spinner.text = `Saving data for next time...`;

    totalCommits += total;
    cache.set<Repository>(repo.path, { ...repo, after: commits[commits.length - 1] });
  }

  spinner.succeed(`Success!  Wrote ${totalCommits} commits to local repository!`);
}

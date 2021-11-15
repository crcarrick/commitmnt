import { git } from '../utils/git';

import { doCommit } from './do-commit';

type DoCommitsArgs = {
  commits: Array<string>;
  max: number;
  branch: string;
};

export async function doCommits({ commits, max, branch }: DoCommitsArgs) {
  const upstream = `origin ${branch}`;

  let doneCommits = 0;
  let totalCommits = 0;

  for (const commit of commits) {
    if (doneCommits >= max) {
      await git.push({ upstream });

      doneCommits = 0;
    }

    await doCommit({ commit });

    doneCommits += 1;
    totalCommits += 1;
  }

  await git.push({ upstream });

  return totalCommits;
}

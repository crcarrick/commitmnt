import { exec } from '../utils/exec';

import { doCommit } from './do-commit';

export async function doCommits(commits: Array<string>, max: number, branch: string) {
  const pushCommand = `git push -u origin ${branch}`;

  let doneCommits = 0;
  let totalCommits = 0;

  for (const commit of commits) {
    if (doneCommits >= max) {
      await exec(pushCommand);

      doneCommits = 0;
    }

    await doCommit(commit);

    doneCommits += 1;
    totalCommits += 1;
  }

  await exec(pushCommand);

  return totalCommits;
}

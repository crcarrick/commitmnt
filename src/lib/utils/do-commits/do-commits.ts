import { doCommit } from '../do-commit';
import { git } from '../git';

export async function doCommits({
  commits,
  max,
  branch,
}: {
  commits: Array<string>;
  max: number;
  branch: string;
}) {
  const upstream = `origin ${branch}`;

  let doneCommits = 0;
  let totalCommits = 0;

  for (const commit of commits) {
    if (doneCommits >= max) {
      await git.push({ upstream });

      doneCommits = 0;
    }

    await doCommit({ date: commit });

    doneCommits += 1;
    totalCommits += 1;
  }

  await git.push({ upstream });

  return totalCommits;
}

import { doCommit } from '../do-commit';
import * as git from '../git';

/**
 * Commits a series of changes on specified dates
 *
 * @param dates the list of dates
 * @param max the maximum number of commits before pushing to github
 * @param branch the git branch to commit to
 * @returns the total number of commits pushed
 */
export async function doCommits({
  dates,
  max,
  branch,
}: {
  dates: Array<string>;
  max: number;
  branch: string;
}) {
  const upstream = `origin ${branch}`;

  let doneCommits = 0;
  let totalCommits = 0;

  for (const date of dates) {
    if (doneCommits >= max) {
      await git.push({ upstream });

      doneCommits = 0;
    }

    await doCommit({ date });

    doneCommits += 1;
    totalCommits += 1;
  }

  await git.push({ upstream });

  return totalCommits;
}

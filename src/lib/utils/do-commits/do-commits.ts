import { doCommit } from '../do-commit';
import * as git from '../git';

/**
 * Commits a series of changes on specified dates
 * and pushes them to the remote
 *
 * @param dates the list of dates
 * @param max the maximum number of commits before pushing to github
 * @returns the total number of commits pushed
 */
export async function doCommits({ dates, max }: { dates: Array<string>; max: number }) {
  let doneCommits = 0;
  let totalCommits = 0;

  for (const date of dates) {
    if (doneCommits >= max) {
      await git.push();

      doneCommits = 0;
    }

    await doCommit({ date });

    doneCommits += 1;
    totalCommits += 1;
  }

  await git.push();

  return totalCommits;
}

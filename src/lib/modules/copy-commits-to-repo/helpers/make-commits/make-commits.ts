import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { exec } from '../../../../utils/exec';
import * as git from '../../../../utils/git';

/**
 * Commits a series of changes on specified dates
 * and pushes them to the remote
 *
 * @param dates the list of dates
 * @param max the maximum number of commits before pushing to github
 * @returns the total number of commits pushed
 *
 * @category Public API Module Helper
 */
export async function makeCommits({ dates, max }: { dates: Array<string>; max: number }) {
  let doneCommits = 0;
  let totalCommits = 0;

  for (const date of dates) {
    if (doneCommits >= max) {
      await git.push();

      doneCommits = 0;
    }

    const formatted = format(parseISO(date), 'yyyy-MM-dd HH:mm:ss');

    await exec(`echo "${uuidv4()}" > foo.txt`);
    await git.add();
    await git.commit({ date: formatted, message: formatted });

    doneCommits += 1;
    totalCommits += 1;
  }

  if (totalCommits > 0) await git.push();

  return totalCommits;
}

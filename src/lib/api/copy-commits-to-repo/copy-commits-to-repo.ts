import { Deps } from '../../types';
import { doCommits } from '../../utils/do-commits';

/**
 * @internal
 *
 * Constant that specifies the maximum number of commits to do
 * before pushing to github.  The github activity graph seems to
 * behave strangely when you push a huge number of commits all at once
 */
export const MAX_COMMITS_PER_PUSH = 400;

/**
 * Creates commits in the current repo for a list of specified dates
 *
 * @param dates the dates to commit on
 * @returns the number of commits copied
 *
 * @category Public API
 */
export async function copyCommitsToRepo({ rootDir }: Deps, dates: Array<string>) {
  process.chdir(rootDir);

  return doCommits({ dates, max: MAX_COMMITS_PER_PUSH });
}

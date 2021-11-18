import { compareAsc, parseISO } from 'date-fns';

import * as git from '../../../../utils/git';

/**
 * Get a list of commits from the current working directory
 *
 * @param after the date to begin the list from
 * @param author some identifying string used to filter by commit author
 * @returns the list of commits
 *
 * @category Public API Module Helper
 */
export async function getCommits({ after, author }: { after?: string; author?: string } = {}) {
  // eslint-disable-next-line no-useless-escape
  const output = await git.log({ after, author, pretty: `format:"\"%aI\""` });

  const commits = output.stdout
    .split('\n')
    .filter(Boolean)
    .sort((a, b) => compareAsc(parseISO(a), parseISO(b)))
    .slice(after ? 1 : 0);

  return commits;
}

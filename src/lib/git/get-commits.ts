import { compareAsc, parseISO } from 'date-fns';

import { git, LogArgs } from '../utils/git';

export async function getCommits({ after, author }: LogArgs) {
  const output = await git.log({ after, author, pretty: 'format:""%aI""' });

  const commits = output.stdout
    .split('\n')
    .sort((a, b) => compareAsc(parseISO(a), parseISO(b)))
    .slice(after ? 1 : 0);

  return commits;
}

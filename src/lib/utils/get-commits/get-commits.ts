import { compareAsc, parseISO } from 'date-fns';

import { git } from '../git';

export async function getCommits({ after, author }: { after?: string; author?: string }) {
  const output = await git.log({ after, author, pretty: 'format:""%aI""' });

  const commits = output.stdout
    .split('\n')
    .sort((a, b) => compareAsc(parseISO(a), parseISO(b)))
    .slice(after ? 1 : 0);

  return commits;
}

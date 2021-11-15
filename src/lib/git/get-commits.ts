import { compareAsc, parseISO } from 'date-fns';

import { exec } from '../utils/exec';

export async function getCommits(author: string, after?: string) {
  const afterArg = after ? `--after="${after}"` : '';

  // eslint-disable-next-line no-useless-escape
  const command = `git log --author="${author}" ${afterArg} --pretty=format:"\"%aI\""`;

  const output = await exec(command);

  const commits = output.stdout
    .split('\n')
    .sort((a, b) => compareAsc(parseISO(a), parseISO(b)))
    .slice(after ? 1 : 0);

  return commits;
}

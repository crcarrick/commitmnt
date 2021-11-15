import { compareAsc, parseISO } from 'date-fns';

import { Repository } from '../config';
import { exec } from '../utils/exec';

export async function gitLog(repo: Repository) {
  const after = repo.last ? `--after="${repo.last}"` : '';

  // eslint-disable-next-line no-useless-escape
  const command = `git log --author="${repo.identifier}" ${after} --pretty=format:"\"%aI\""`;

  const output = await exec(command);

  const commits = output.stdout.split('\n').sort((a, b) => compareAsc(parseISO(a), parseISO(b)));

  return after ? commits.slice(1) : commits;
}

import process from 'process';

import { compareAsc, parseISO } from 'date-fns';
import fs from 'fs-extra';

import { Repository } from '../config';
import { exec } from '../utils/exec';
import { Deps } from '../utils/ioc';

export async function gitLog(repo: Repository) {
  const after = repo.last ? `--after="${repo.last}"` : '';

  // eslint-disable-next-line no-useless-escape
  const command = `git log --author="${repo.identifier}" ${after} --pretty=format:"\"%aI\""`;

  const output = await exec(command);

  const commits = output.stdout.split('\n').sort((a, b) => compareAsc(parseISO(a), parseISO(b)));

  return after ? commits.slice(1) : commits;
}

export async function readRepository({ config }: Deps, pathToRepo: string) {
  const repo = config.repositories.find(({ path }) => path === pathToRepo);

  if (!repo || !fs.existsSync(pathToRepo))
    throw new Error(`Couldn't find repository at path ${pathToRepo}`);

  process.chdir(pathToRepo);

  return gitLog(repo);
}

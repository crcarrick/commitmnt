/**
 * Be careful about moving this file because it heavily relies on __dirname
 */

import path from 'path';

import chalk from 'chalk';
import { format, subDays } from 'date-fns';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

import { exec } from '../../../lib/utils/exec';
import { add as gitAdd, commit as gitCommit } from '../../../lib/utils/git';
import { config } from '../config';

import { getTestRepoNames, initRepo, TestDir } from './misc';

function generateCommitDates(num: number) {
  return new Array(num)
    .fill(new Date())
    .map((date, idx) => format(subDays(date, num - idx), 'yyyy-MM-dd HH:mm:ss'));
}

function isFresh() {
  return getTestRepoNames().every((repo) => !fs.existsSync(path.resolve(repo, '.git')));
}

async function seedTestRepos() {
  for (const repo of getTestRepoNames()) {
    process.chdir(repo);

    await initRepo(repo);

    for (const date of generateCommitDates(config.git.test.commitsPerRepo)) {
      await exec(`echo "${uuidv4()}" > foo.txt`);
      await gitAdd();
      await gitCommit({ date, message: date });
    }
  }

  process.chdir(TestDir.Root);
}

export async function setupSandbox() {
  if (isFresh()) {
    console.warn(chalk.red('\n\nSeeding the test repositories.. this might take a while..'));

    await fs.mkdir(TestDir.Sandbox);
    await Promise.all([
      fs.mkdir(TestDir.Local),
      fs.mkdir(TestDir.Remote),
      ...getTestRepoNames().map((repo) => fs.mkdir(repo)),
    ]);
    await seedTestRepos();

    console.log(chalk.green('All done!\n'));
  }

  await initRepo(TestDir.Local);
  await initRepo(TestDir.Remote);
}

export async function teardownSandbox() {
  await fs.emptyDir(TestDir.Local);
  await fs.emptyDir(TestDir.Remote);
}

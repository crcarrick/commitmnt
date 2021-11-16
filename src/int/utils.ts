/**
 * This file has to stay at the root of the integration test folder because it heavily relies on __dirname
 */

import path from 'path';

import chalk from 'chalk';
import { format, subDays } from 'date-fns';
import fs from 'fs-extra';

import { exec } from '../lib/utils/exec';
import git, { add as gitAdd, commit as gitCommit } from '../lib/utils/git';

import { config } from './config';

const SANDBOX_DIR = path.resolve(__dirname, config.sandbox.name);
const REMOTE_DIR = path.resolve(SANDBOX_DIR, config.git.remote.name);
const LOCAL_DIR = path.resolve(SANDBOX_DIR, config.git.local.name);

function getTestRepos() {
  return new Array(config.git.test.numRepos)
    .fill(null)
    .map((_, idx) => path.resolve(SANDBOX_DIR, `${config.git.test.prefix}_${idx + 1}`));
}

function isFresh() {
  return getTestRepos().every((repo) => !fs.existsSync(path.resolve(repo, '.git')));
}

function generateDates(num: number) {
  return new Array(num)
    .fill(new Date())
    .map((date, idx) => format(subDays(date, num - idx), 'yyyy-MM-dd HH:mm:ss'));
}

async function seedTestRepos() {
  for (const repo of getTestRepos()) {
    process.chdir(repo);

    await exec('touch foo.txt');
    await git('init');
    await git('checkout -B main');

    for (const date of generateDates(config.git.test.commitsPerRepo)) {
      await exec(`echo "${date}" > foo.txt`);
      await gitAdd();
      await gitCommit({ date, message: date });
    }
  }

  process.chdir(__dirname);
}

async function initRemote() {
  process.chdir(REMOTE_DIR);
  await git('init');
  await git('checkout -B main');
  process.chdir(__dirname);
}

export async function setupSandbox() {
  if (isFresh()) {
    console.warn(chalk.red('\n\nSeeding the test repositories.. this might take a while..'));

    await fs.mkdir(SANDBOX_DIR);
    await Promise.all([
      fs.mkdir(LOCAL_DIR),
      fs.mkdir(REMOTE_DIR),
      ...getTestRepos().map((repo) => fs.mkdir(repo)),
    ]);
    await initRemote();
    await seedTestRepos();

    console.log(chalk.green('All done!\n'));
  }
}

export async function teardownSandbox() {
  process.chdir(__dirname);

  await fs.rm(SANDBOX_DIR, { recursive: true, force: true });
}

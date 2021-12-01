/**
 * Be careful about moving this file because it heavily relies on __dirname
 */

import path from 'path';

import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import { v4 as uuidv4 } from 'uuid';

import { exec } from '../../../lib/utils/exec';
import { add as gitAdd, commit as gitCommit } from '../../../lib/utils/git';

import { commitDates, initRepo, mockRepos, seedTestRepos, testDirs, testRepos } from './misc';

async function makeSandboxRepos() {
  if (!fs.existsSync(testDirs.sandbox)) await fs.mkdir(testDirs.sandbox);

  return Promise.all(
    [...Object.values(testRepos), ...mockRepos].map((repo) => {
      if (fs.existsSync(repo.path)) return Promise.resolve();

      return fs.mkdir(repo.path);
    })
  );
}

async function seedMockRepos() {
  const toSeed = mockRepos.filter((repo) => !fs.existsSync(path.resolve(repo.path, '.git')));

  if (toSeed.length === 0) return;

  const spinner = ora();

  spinner.start(chalk.blue('Seeding the mock repositories... this might take a while...'));

  for (const repo of toSeed) {
    await initRepo(repo);

    process.chdir(repo.path);

    for (const date of commitDates) {
      await exec(`echo "${uuidv4()}" > foo.txt`);
      await gitAdd();
      await gitCommit({ date, message: date });
    }
  }

  spinner.succeed(chalk.green(`Seeded ${mockRepos.length} repositories!`));

  process.chdir(testDirs.root);
}

export async function setupSandbox() {
  await makeSandboxRepos();
  await seedMockRepos();
  await seedTestRepos();
}

export async function teardownSandbox() {
  for (const repo of Object.values(testRepos)) {
    await fs.emptyDir(repo.path);
  }
}

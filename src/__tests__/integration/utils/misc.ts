import path from 'path';

import { formatISO, subDays } from 'date-fns';

import { Repository } from '../../../lib/types';
import git from '../../../lib/utils/git';
import { config } from '../config';

export const testDirs = {
  get root() {
    return path.resolve(__dirname, '..');
  },
  get sandbox() {
    return path.resolve(this.root, config.sandbox);
  },
  get local() {
    return path.resolve(this.sandbox, config.git.local);
  },
  get remote() {
    return path.resolve(this.sandbox, config.git.remote);
  },
} as const;

function createRepo(dir: string): Repository {
  return {
    author: config.git.author,
    branch: config.git.branch,
    path: dir,
  };
}

export const commitDates = new Array<Date>(config.git.mock.commitsPerRepo)
  .fill(new Date())
  .map((date, idx) => {
    date.setHours(0, 0, 0, 0);

    return formatISO(subDays(date, config.git.mock.commitsPerRepo - idx));
  });

export const testRepos = {
  local: createRepo(testDirs.local),
  remote: createRepo(testDirs.remote),
};
export const mockRepos = new Array(config.git.mock.numRepos)
  .fill(null)
  .map((_, idx) =>
    createRepo(path.resolve(testDirs.sandbox, `${config.git.mock.prefix}_${idx + 1}`))
  );

export async function initRepo(repo: Repository, { bare }: { bare?: boolean } = {}) {
  process.chdir(repo.path);

  await git(`init ${bare ? '--bare' : ''}`);
  await git(`config user.name "${config.git.author}"`);
  await git('config user.email "foo@bar.com');

  if (bare) {
    await git(`symbolic-ref HEAD refs/heads/${repo.branch}`);
  } else {
    await git(`checkout -B ${repo.branch}`);
  }

  process.chdir(testDirs.root);
}

export async function seedTestRepos() {
  // This is a bit different.  Here we are going to create a --bare {remote}
  // and then clone it to {local}
  await initRepo(testRepos.remote, { bare: true });

  process.chdir(testDirs.sandbox);
  await git(`clone ${testRepos.remote.path} ${testRepos.local.path}`);

  process.chdir(testRepos.local.path);
  await git(`checkout -B ${config.git.branch}`);
}

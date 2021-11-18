import path from 'path';

import git from '../../../lib/utils/git';
import { config } from '../config';

export const TestDir = {
  get Root() {
    return path.resolve(__dirname, '..');
  },
  get Sandbox() {
    return path.resolve(this.Root, config.sandbox.name);
  },
  get Local() {
    return path.resolve(this.Sandbox, config.git.local.name);
  },
  get Remote() {
    return path.resolve(this.Sandbox, config.git.remote.name);
  },
} as const;

export function getTestRepoNames() {
  return new Array(config.git.test.numRepos)
    .fill(null)
    .map((_, idx) => path.resolve(TestDir.Sandbox, `${config.git.test.prefix}_${idx + 1}`));
}

export async function initRepo(dir: string) {
  process.chdir(dir);

  await git('init');
  await git('config user.name "Foo Bar"');
  await git('config user.email "foo@bar.com');
  await git('checkout -B main');

  process.chdir(TestDir.Root);
}

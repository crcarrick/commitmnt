import fs from 'fs-extra';

import * as git from '../../../lib/utils/git';

import { initRepo, TestDir } from './misc';

export async function resetTestDirs() {
  for (const dir of [TestDir.Local, TestDir.Remote]) {
    await fs.emptyDir(dir);
    await initRepo(dir);
  }
}

export async function getTestDirCommits(
  dir: keyof typeof TestDir,
  { after, author }: { after?: string; author?: string } = {}
) {
  process.chdir(dir);

  const commits = await git.log({ after, author });

  process.chdir(TestDir.Root);

  return commits;
}

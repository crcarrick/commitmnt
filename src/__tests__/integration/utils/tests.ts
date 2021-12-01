import { compareAsc, parseISO } from 'date-fns';
import fs from 'fs-extra';

import { Repository } from '../../../lib/types';
import * as git from '../../../lib/utils/git';

import { seedTestRepos, testDirs, testRepos } from './misc';

export async function resetTestRepos() {
  for (const repo of Object.values(testRepos)) {
    await fs.emptyDir(repo.path);
  }

  await seedTestRepos();
}

// FIXME: this is dumb.  i'm essentially just reimplementing the `getCommits` helper from `getCommitsForRepo`
//        need to figure out some way to compartmentalize this functionality without like.. using pieces of the
//        library to help test the library (which seems wrong somehow)
export async function getRepoCommits(
  repo: Repository,
  { after, author }: { after?: string; author?: string } = {}
) {
  process.chdir(repo.path);

  const log = await git.log({ after, author, pretty: `format:""%aI""` });

  process.chdir(testDirs.root);

  return log.stdout
    .split('\n')
    .filter(Boolean)
    .sort((a, b) => compareAsc(parseISO(a), parseISO(b)))
    .slice(after ? 1 : 0);
}

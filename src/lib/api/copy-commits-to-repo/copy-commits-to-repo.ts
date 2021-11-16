import { Deps } from '../../types';
import { doCommits } from '../../utils';

/* 
  pushing a repo with several thousand commits to github all at once
  causes github to do some weird stuff with the activity graph
 **/
const MAX_COMMITS_PER_PUSH = 400;

export async function copyCommitsToRepo({ config }: Deps, commits: Array<string>) {
  process.chdir('./');

  return doCommits({ commits, max: MAX_COMMITS_PER_PUSH, branch: config.branch });
}

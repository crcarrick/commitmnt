import { Deps } from '../../types';
import { copyRepo } from '../copy-repo';

/**
 * Uses {@link copyRepo} to copy all the repositories from the config
 *
 * @category Public API Module
 */
export async function getCommitsAndCopy(deps: Deps) {
  const { config, spinner } = deps;

  spinner.start('Reading repositories...');

  let total = 0;

  for (const repo of config.repositories) {
    total += await copyRepo(deps, repo);
  }

  spinner.succeed(`Success!  Wrote commits to local repository... (${total})`);
}

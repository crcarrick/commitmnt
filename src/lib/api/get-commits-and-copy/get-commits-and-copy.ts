import { Deps } from '../../types';
import { copyRepo } from '../copy-repo';

/**
 * Uses {@link copyRepo} to copy all the repositories from the `config`
 * in parallel
 *
 * @category Public API
 */
export async function getCommitsAndCopy(deps: Deps) {
  const { config, spinner } = deps;

  spinner.start('Reading repositories...');

  const copies: Array<Promise<number>> = config.repositories.map((repo) => copyRepo(deps, repo));
  const total = (await Promise.all(copies)).reduce((a, b) => a + b);

  spinner.succeed(`Success!  Wrote commits to local repository... (${total})`);
}

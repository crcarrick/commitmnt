/** @module Main */

import ora from 'ora';

import { copyCommitsToRepo, copyRepo, getCommitsAndCopy, getCommitsForRepo } from './modules';
import { Config, Deps } from './types';
import { Cache, createInjector } from './utils';

/**
 * Default configuration object
 */
const defaultConfig: Config = {
  branch: 'main',
  repositories: [],
  rootDir: process.cwd(),
};

/**
 * Initialize a cache and set of functions that can be utilized to copy
 * commits from some repository to another repository.  These are the same
 * functions used under the hood of the main `cmytment()` function.  They are being
 * exposed here so that a user with a more specific use case
 * (eg. filtering the commits in some way before copying them) can do that if they desire.
 *
 * @param config subset of {@link Config} fields
 * @returns a {@link Cache} instance, and the initialized {@link getCommitsForRepo} {@link copyRepo} {@link copyCommitsToRepo} functions
 *
 * @category Public API
 */
export async function initCmytment(config: Pick<Config, 'branch' | 'rootDir'>) {
  const cache = new Cache(config.rootDir);

  const inject = createInjector<Deps>({
    cache,
    config: {
      ...defaultConfig,
      ...config,
    },
    spinner: ora(),
  });

  return {
    cache,
    copyCommitsToRepo,
    copyRepo,
    getCommitsForRepo: inject(getCommitsForRepo),
  };
}

/**
 * Accepts a config and copys commits from the
 * given repositories into the current repository
 *
 * @param options.quiet silences the console output / spinner
 *
 * @category Public API
 */
export async function cmytment(config: Config, options?: { quiet: boolean }) {
  const cache = new Cache(config.rootDir);

  const inject = createInjector<Deps>({
    cache,
    config: {
      ...defaultConfig,
      ...config,
    },
    spinner: ora({ isSilent: options?.quiet }),
  });

  const main = inject(getCommitsAndCopy);

  await main();
}

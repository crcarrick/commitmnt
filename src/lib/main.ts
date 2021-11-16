/** @module Main */

import ora from 'ora';

import { copyCommitsToRepo, getCommitsAndCopy, getCommitsForRepo } from './api';
import { Config } from './types';
import { Cache } from './utils/cache';
import { createInjector } from './utils/ioc';

const defaultConfig: Config = {
  branch: 'main',
  repositories: [],
};

/**
 * Initialize a cache and set of functions that can be utilized to copy
 * commits from some repository to another repository.  These are the same
 * functions used under the hook of the default export.  They are being
 * exposed here so that a user with a more specific use case
 * (eg. filtering the commits in some way) can do that if they desire.
 *
 * @param config configuration object that requires a subset of {@link Config} fields
 * @returns a cache instance, and the initialized {@link getCommitsForRepo} {@link copyCommitsToRepo} functions
 *
 * @category Public API
 */
export function initCmytment(config: Pick<Config, 'branch'>) {
  const cache = new Cache();

  const inject = createInjector({
    cache,
    config: {
      ...defaultConfig,
      config,
    },
    spinner: ora(),
  });

  return {
    cache,
    copyCommitsToRepo: inject(copyCommitsToRepo),
    getCommitsForRepo: inject(getCommitsForRepo),
  };
}

/**
 * Primary export which accepts a config and copys commits from the
 * given repositories into the current repository
 *
 * @param config configuration object
 *
 * @category Public API
 */
export default async function cmytment(config: Config) {
  const cache = new Cache();

  const inject = createInjector({
    cache,
    config: {
      ...defaultConfig,
      config,
    },
    spinner: ora(),
  });

  const main = inject(getCommitsAndCopy);

  await main();
}

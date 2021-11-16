/** @module Main */

import ora from 'ora';

import { copyCommitsToRepo, copyRepo, getCommitsAndCopy, getCommitsForRepo } from './api';
import { Config } from './types';
import { Cache } from './utils/cache';
import { createInjector } from './utils/ioc';

/**
 * Default configuration object
 */
const defaultConfig: Pick<Config, 'branch' | 'repositories'> = {
  branch: 'main',
  repositories: [],
};

/**
 * Initialize a cache and set of functions that can be utilized to copy
 * commits from some repository to another repository.  These are the same
 * functions used under the hood of the main `cmytment()` function.  They are being
 * exposed here so that a user with a more specific use case
 * (eg. filtering the commits in some way before copying them) can do that if they desire.
 *
 * @param config configuration object that requires a subset of {@link Config} fields
 * @returns a cache instance, and the initialized {@link getCommitsForRepo} {@link copyRepo} {@link copyCommitsToRepo} functions
 *
 * @category Public API
 */
export async function initCmytment(config: Pick<Config, 'branch' | 'remote'>) {
  const cache = new Cache();

  const inject = createInjector({
    cache,
    config: {
      ...defaultConfig,
      ...config,
    },
    rootDir: process.cwd(),
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
 * @param config configuration object
 *
 * @category Public API
 */
export async function cmytment(config: Config) {
  const cache = new Cache();

  const inject = createInjector({
    cache,
    config: {
      ...defaultConfig,
      ...config,
    },
    rootDir: process.cwd(),
    spinner: ora(),
  });

  const main = inject(getCommitsAndCopy);

  await main();
}

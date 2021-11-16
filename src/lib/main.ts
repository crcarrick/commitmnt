import ora from 'ora';

import { copyCommitsToRepo, getCommitsAndCopy, getCommitsForRepo } from './api';
import { Config } from './types';
import { Cache } from './utils/cache';
import { createInjector } from './utils/ioc';

const defaultConfig: Config = {
  branch: 'main',
  repositories: [],
};

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

export default async function cmytment(config: Pick<Config, 'branch' | 'repositories'>) {
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

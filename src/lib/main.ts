import 'reflect-metadata';

import { Cache } from './cache';
import { Config } from './config';
import { readRepository } from './repository';
import { createInjector } from './utils/ioc';

const defaultConfig: Config = {
  repositories: [],
};

export default function initCmytment(config = defaultConfig) {
  const cache = new Cache(config.cachePath);

  const inject = createInjector({ cache, config });

  return {
    cache,
    readRepository: inject(readRepository),
  };
}

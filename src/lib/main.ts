import { doCommit, doCommits, getCommits } from './git';
import { Config } from './types';
import { Cache } from './utils/cache';
// import { createInjector } from './utils/ioc';

type ConfigArg = Pick<Config, 'repositories'>;

const defaultConfig: Config = {
  gitBranch: 'main',
  maxCommitsPerPush: 400,
  repositories: [],
};

export default function initCmytment(config: ConfigArg) {
  const merged: Config = { ...defaultConfig, ...config };

  const cache = new Cache(merged.cachePath);

  // const inject = createInjector({
  //   cache,
  //   config: {
  //     ...defaultConfig,
  //     ...config,
  //   },
  // });

  return {
    cache,
    doCommit,
    doCommits,
    getCommits,
  };
}

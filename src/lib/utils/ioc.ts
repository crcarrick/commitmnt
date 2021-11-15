import { Config } from '../types';
import { Cache } from '../utils/cache';

type SpreadArgs = Array<unknown>;

export type Deps = {
  cache: Cache;
  config: Config;
};

export function createInjector(deps: Deps) {
  return function inject<ArgsT extends SpreadArgs, ReturnT>(
    fn: (deps: Deps, ...args: ArgsT) => ReturnT
  ) {
    return (...args: ArgsT) => fn(deps, ...args);
  };
}

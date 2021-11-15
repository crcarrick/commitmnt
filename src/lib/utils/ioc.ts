import { Cache } from '../cache';
import { Config } from '../config';

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

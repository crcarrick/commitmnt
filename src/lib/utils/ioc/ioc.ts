type SpreadArgs = Array<unknown>;

export function createInjector<DepsT>(deps: DepsT) {
  return function inject<ArgsT extends SpreadArgs, ReturnT>(
    fn: (deps: DepsT, ...args: ArgsT) => ReturnT
  ) {
    return (...args: ArgsT) => fn(deps, ...args);
  };
}

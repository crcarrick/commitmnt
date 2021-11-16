/**
 * @internal
 *
 * Takes a list of dependencies and creates a function
 * that will inject those dependencies into whatever function
 * it is passed
 *
 * @param deps the list of dependencies
 * @returns the injector function
 */
export function createInjector<DepsT>(deps: DepsT) {
  return function inject<ArgsT extends Array<unknown>, ReturnT>(
    fn: (deps: DepsT, ...args: ArgsT) => ReturnT
  ) {
    return (...args: ArgsT) => fn(deps, ...args);
  };
}

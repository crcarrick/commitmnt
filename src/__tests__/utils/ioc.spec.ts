import { Cache } from '../../lib/utils/cache';
import { createInjector, Deps } from '../../lib/utils/ioc';

jest.mock('../../lib/utils/cache');

describe('createInjector', () => {
  const cache = new Cache();
  const config = { repositories: [] };
  const inject = createInjector({ cache, config });

  it('creates an injector function', () => {
    expect(typeof inject).toBe('function');
  });

  describe('inject', () => {
    it('wraps the passed fn and calls it with the specified dependencies', () => {
      const fn = jest.fn((deps: Deps) => ({ ...deps }));
      const injected = jest.fn(inject(fn));
      const result = injected();

      expect(fn).toHaveBeenCalledWith(expect.objectContaining({ cache, config }));
      expect(result).toStrictEqual({ cache, config });
    });
  });
});

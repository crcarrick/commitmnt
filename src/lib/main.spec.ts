import { mocked } from 'ts-jest/utils';

import { getCommitsAndCopy } from './api';
import { cmytment, initCmytment } from './main';
import { Cache } from './utils/cache';
import { createInjector } from './utils/ioc';

jest.mock('ora');
jest.mock('./api');
jest.mock('./utils/cache');
// :D
jest.mock('./utils/ioc', () => ({
  createInjector: jest.fn(() => jest.fn((fn) => jest.fn(() => fn()))),
}));

const mocks = {
  Cache: mocked(Cache),
  createInjector: mocked(createInjector),
  getCommitsAndCopy: mocked(getCommitsAndCopy),
};

afterEach(() => {
  mocks.Cache.mockReset();
  mocks.createInjector.mockClear();
});

describe('cmytment', () => {
  const config = { branch: 'main', repositories: [], rootDir: '' };

  it('creates a cache', async () => {
    await cmytment(config);

    expect(mocks.Cache.mock.calls).toHaveLength(1);
  });

  it('creates an injector', async () => {
    await cmytment(config);

    expect(mocks.createInjector).toHaveBeenCalledWith(
      expect.objectContaining({
        cache: expect.any(Cache),
        config: expect.objectContaining(config),
      })
    );
  });

  it('calls the main function', async () => {
    await cmytment(config);

    expect(mocks.getCommitsAndCopy).toHaveBeenCalled();
  });
});

describe('initCmytment', () => {
  const config = { branch: 'main' };

  it('creates a cache', async () => {
    await initCmytment(config);

    expect(mocks.Cache).toHaveBeenCalled();
  });

  it('creates an injector', async () => {
    await initCmytment(config);

    expect(mocks.createInjector).toHaveBeenCalledWith(
      expect.objectContaining({
        cache: expect.any(Cache),
        config: expect.objectContaining(config),
      })
    );
  });

  it('returns the initialized library api', async () => {
    const { cache, copyCommitsToRepo, copyRepo, getCommitsForRepo } = await initCmytment(config);

    expect(cache).toStrictEqual(expect.any(Cache));
    expect(copyCommitsToRepo).toStrictEqual(expect.any(Function));
    expect(copyRepo).toStrictEqual(expect.any(Function));
    expect(getCommitsForRepo).toStrictEqual(expect.any(Function));
  });
});

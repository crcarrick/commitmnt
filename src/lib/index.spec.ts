import { mocked } from 'ts-jest/utils';

import { getCommitsAndCopy } from './modules/get-commits-and-copy';
import { Cache } from './utils/cache';
import { createInjector } from './utils/ioc';

import { commitment, initCommitment } from './index';

jest.mock('ora');
jest.mock('./modules/get-commits-and-copy');
jest.mock('./utils/cache');
jest.mock('./utils/cd');
jest.mock('./utils/ioc', () => ({
  createInjector: jest.fn(() => jest.fn((fn) => jest.fn(() => fn()))),
}));

const mocks = {
  Cache: mocked(Cache),
  createInjector: mocked(createInjector),
  getCommitsAndCopy: mocked(getCommitsAndCopy),
};

describe('commitment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const config = { branch: 'main', repositories: [], rootDir: '' };

  it('creates a cache', async () => {
    await commitment(config);

    expect(mocks.Cache.mock.calls).toHaveLength(1);
  });

  it('creates an injector', async () => {
    await commitment(config);

    expect(createInjector).toHaveBeenCalledWith(
      expect.objectContaining({
        cache: expect.any(Cache),
        config: expect.objectContaining(config),
      })
    );
  });

  it('calls the main function', async () => {
    await commitment(config);

    expect(getCommitsAndCopy).toHaveBeenCalled();
  });
});

describe('initCommitment', () => {
  const config = { branch: 'main', rootDir: '' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a cache', async () => {
    await initCommitment(config);

    expect(Cache).toHaveBeenCalled();
  });

  it('creates an injector', async () => {
    await initCommitment(config);

    expect(createInjector).toHaveBeenCalledWith(
      expect.objectContaining({
        cache: expect.any(Cache),
        config: expect.objectContaining(config),
      })
    );
  });

  it('returns the initialized library api', async () => {
    const { cache, copyCommitsToRepo, copyRepo, getCommitsForRepo } = await initCommitment(config);

    expect(cache).toStrictEqual(expect.any(Cache));
    expect(copyCommitsToRepo).toStrictEqual(expect.any(Function));
    expect(copyRepo).toStrictEqual(expect.any(Function));
    expect(getCommitsForRepo).toStrictEqual(expect.any(Function));
  });
});

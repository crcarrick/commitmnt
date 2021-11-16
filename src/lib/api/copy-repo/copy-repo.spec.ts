import ora from 'ora';
import { mocked } from 'ts-jest/utils';

import { Config, Deps } from '../../types';
import { Cache } from '../../utils/cache';
import { copyCommitsToRepo } from '../copy-commits-to-repo';
import { getCommitsForRepo } from '../get-commits-for-repo';

import { copyRepo } from './copy-repo';

jest.mock('ora');
jest.mock('../copy-commits-to-repo');
jest.mock('../get-commits-for-repo');
jest.mock('../../utils/cache');

const mocks = {
  cache: mocked(new Cache()),
  copyCommitsToRepo: mocked(copyCommitsToRepo),
  getCommitsForRepo: mocked(getCommitsForRepo),
};

describe('copyRepo', () => {
  const repo = { author: 'Foo Bar', branch: 'main', path: '/foo/bar' };

  const config: Config = {
    branch: 'main',
    remote: 'https://github.com/foo/bar',
    repositories: [repo],
  };
  const cache = mocks.cache;
  const rootDir = '/foo/bar';

  const deps: Deps = {
    config,
    cache,
    rootDir,
    spinner: ora(),
  };

  beforeEach(() => {
    mocks.getCommitsForRepo.mockResolvedValueOnce([]);
  });

  it('uses getCommitsForRepo to read each repository', async () => {
    await copyRepo(deps, repo);

    expect(mocks.getCommitsForRepo).toHaveBeenCalledWith(deps, repo);
  });

  it('uses copyCommitsToRepo to copy commits to the current repository', async () => {
    await copyRepo(deps, repo);

    expect(mocks.copyCommitsToRepo).toHaveBeenCalledWith(expect.objectContaining(deps), []);
  });

  it('writes the correct data to the cache', async () => {
    mocks.getCommitsForRepo.mockReset();
    mocks.getCommitsForRepo.mockResolvedValueOnce(['foo', 'bar']);

    await copyRepo(deps, repo);

    expect(cache.set).toHaveBeenCalledWith(repo.path, expect.objectContaining({ after: 'bar' }));
  });

  it(`doesn't write to the cache when no dates are returned`, async () => {
    mocks.cache.set.mockClear();

    await copyRepo(deps, repo);

    expect(cache.set).not.toHaveBeenCalled();
  });
});

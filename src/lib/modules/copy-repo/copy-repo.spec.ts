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
jest.mock('../../utils/git');

const mocks = {
  cache: mocked(new Cache()),
  copyCommitsToRepo: mocked(copyCommitsToRepo),
  getCommitsForRepo: mocked(getCommitsForRepo),
};

const repo = { author: 'Foo Bar', branch: 'main', path: '/foo/bar' };

const config: Config = {
  branch: 'main',
  repositories: [repo],
  rootDir: '/foo/bar',
};
const cache = mocks.cache;

const deps: Deps = {
  config,
  cache,
  spinner: ora(),
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('when commit dates are returned', () => {
  const commits = ['foo', 'bar'];

  beforeEach(() => {
    mocks.getCommitsForRepo.mockResolvedValueOnce(commits);
  });

  it('reads each repository', async () => {
    await copyRepo(deps, repo);

    expect(getCommitsForRepo).toHaveBeenCalledWith(deps, repo);
  });

  it('copies commits to the current repository', async () => {
    await copyRepo(deps, repo);

    expect(copyCommitsToRepo).toHaveBeenCalledWith(
      expect.objectContaining(deps),
      expect.arrayContaining(commits)
    );
  });

  it('writes the correct data to the cache', async () => {
    await copyRepo(deps, repo);

    expect(cache.set).toHaveBeenCalledWith(
      repo.path,
      expect.objectContaining({ after: commits[commits.length - 1] })
    );
  });
});

describe('when no dates are returned', () => {
  beforeEach(() => {
    mocks.getCommitsForRepo.mockResolvedValueOnce([]);
  });

  it(`doesn't copy commits to the current directory`, async () => {
    await copyRepo(deps, repo);

    expect(copyCommitsToRepo).not.toHaveBeenCalled();
  });

  it(`doesn't write to the cache`, async () => {
    await copyRepo(deps, repo);

    expect(cache.set).not.toHaveBeenCalled();
  });

  it('returns 0', async () => {
    const result = await copyRepo(deps, repo);

    expect(result).toBe(0);
  });
});

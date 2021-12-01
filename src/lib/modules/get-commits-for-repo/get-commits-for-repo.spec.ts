import fs from 'fs-extra';
import ora from 'ora';
import { mocked } from 'ts-jest/utils';

import { Config, Deps, Repository } from '../../types';
import { Cache } from '../../utils/cache';

import { getCommitsForRepo } from './get-commits-for-repo';
import { getCommits } from './helpers/get-commits';

jest.mock('fs-extra');
jest.mock('ora');
jest.mock('../../utils/cache');
jest.mock('../../utils/git');
jest.mock('./helpers/get-commits');

const mocks = {
  fs: mocked(fs),
};

const config: Config = {
  branch: 'main',
  repositories: [],
  rootDir: '/foo/bar',
};
const cache = new Cache();

const deps: Deps = {
  config,
  cache,
  spinner: ora(),
};
const repo: Repository = {
  author: 'Foo Bar',
  branch: 'main',
  path: '/foo/bar',
};

beforeAll(() => {
  jest.spyOn(process, 'chdir').mockImplementation();
});

beforeEach(() => {
  mocks.fs.existsSync.mockReturnValue(true);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('retrieves the repo info from the cache', async () => {
  await getCommitsForRepo(deps, repo);

  expect(cache.get).toHaveBeenCalledWith(repo.path);
});

it(`throws if the repo or repo path don't exist`, async () => {
  mocks.fs.existsSync.mockReset();
  mocks.fs.existsSync.mockReturnValueOnce(false);

  await expect(getCommitsForRepo(deps, repo)).rejects.toThrowError(
    `Couldn't find repository at path ${repo.path}`
  );
});

it('changes directory to the repo directory', async () => {
  await getCommitsForRepo(deps, repo);

  expect(process.chdir).toHaveBeenCalledWith(repo.path);
});

it('gets the commits', async () => {
  mocked(cache).get.mockResolvedValueOnce({ after: 'foo' });

  await getCommitsForRepo(deps, repo);

  expect(getCommits).toHaveBeenCalledWith(
    expect.objectContaining({
      author: repo.author,
      after: 'foo',
    })
  );
});

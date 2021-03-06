import ora from 'ora';

import { Config, Deps } from '../../types';
import { Cache } from '../../utils/cache';
import { ChangeDirectory } from '../../utils/cd';

import { copyCommitsToRepo, MAX_COMMITS_PER_PUSH } from './copy-commits-to-repo';
import { makeCommits } from './helpers/make-commits';

jest.mock('ora');
jest.mock('../../utils/cache');
jest.mock('../../utils/cd');
jest.mock('./helpers/make-commits');

const dates = ['foo', 'bar'];
const config: Config = {
  branch: 'main',
  repositories: [],
  rootDir: '/foo/bar',
};
const cache = new Cache();
const cd = new ChangeDirectory();

const deps: Deps = {
  cache,
  cd,
  config,
  spinner: ora(),
};

beforeAll(() => {
  jest.spyOn(process, 'chdir').mockImplementation();
});

afterEach(() => {
  jest.resetAllMocks();
});

it('changes directory to the root dir', async () => {
  await copyCommitsToRepo(deps, dates);

  expect(cd.go).toHaveBeenCalledWith(config.rootDir);
});

it('makes the commits', async () => {
  await copyCommitsToRepo(deps, dates);

  expect(makeCommits).toHaveBeenCalledWith(
    expect.objectContaining({ branch: config.branch, dates, max: MAX_COMMITS_PER_PUSH })
  );
});

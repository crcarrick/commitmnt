import ora from 'ora';
import { mocked } from 'ts-jest/utils';

import { Config, Deps, Repository } from '../../types';
import { Cache } from '../../utils/cache';
import { ChangeDirectory } from '../../utils/cd';
import { copyRepo } from '../copy-repo';

import { getCommitsAndCopy } from './get-commits-and-copy';

jest.mock('ora', () => () => ({
  start: jest.fn(),
  succeed: jest.fn(),
}));
jest.mock('../copy-repo');
jest.mock('../../utils/cache');
jest.mock('../../utils/cd');

const mocks = {
  copyRepo: mocked(copyRepo),
};

const repositories: Array<Repository> = [
  { author: 'Foo Bar', branch: 'main', path: '/foo/bar' },
  { author: 'Foo Bar', branch: 'main', path: '/foo/bar' },
  { author: 'Foo Bar', branch: 'main', path: '/foo/bar' },
  { author: 'Foo Bar', branch: 'main', path: '/foo/bar' },
];
const config: Config = {
  branch: 'main',
  repositories,
  rootDir: '/foo/bar',
};
const cache = new Cache();
const cd = new ChangeDirectory();
const spinner = ora();

const deps: Deps = {
  cache,
  cd,
  config,
  spinner,
};

const commitsPerRepo = 2;

beforeEach(() => {
  mocks.copyRepo.mockResolvedValue(commitsPerRepo);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('starts the spinner', async () => {
  await getCommitsAndCopy(deps);

  expect(spinner.start).toHaveBeenCalled();
});

it('uses copyRepo to read each repository', async () => {
  await getCommitsAndCopy(deps);

  expect(copyRepo).toHaveBeenCalledTimes(repositories.length);
});

it('stops the spinner and prints the total', async () => {
  await getCommitsAndCopy(deps);

  expect(spinner.succeed).toHaveBeenCalledWith(
    expect.stringContaining(`${commitsPerRepo * repositories.length}`)
  );
});

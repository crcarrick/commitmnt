import ora from 'ora';

import { Config, Deps } from '../../types';
import { Cache } from '../../utils/cache';

import { copyCommitsToRepo, MAX_COMMITS_PER_PUSH } from './copy-commits-to-repo';
import { makeCommits } from './helpers/make-commits';

jest.mock('ora');
jest.mock('../../utils/cache');
jest.mock('./helpers/make-commits');

describe('copyCommitsToRepo', () => {
  const dates = ['foo', 'bar'];
  const config: Config = {
    branch: '',
    repositories: [],
    rootDir: '/foo/bar',
  };
  const cache = new Cache();

  const deps: Deps = {
    config,
    cache,
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

    expect(process.chdir).toHaveBeenCalledWith(config.rootDir);
  });

  it('makes the commits', async () => {
    await copyCommitsToRepo(deps, dates);

    expect(makeCommits).toHaveBeenCalledWith(
      expect.objectContaining({ dates, max: MAX_COMMITS_PER_PUSH })
    );
  });
});

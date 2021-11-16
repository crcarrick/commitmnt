import ora from 'ora';

import { Config, Deps } from '../../types';
import { Cache } from '../../utils/cache';
import { doCommits } from '../../utils/do-commits';

import { copyCommitsToRepo, MAX_COMMITS_PER_PUSH } from './copy-commits-to-repo';

jest.mock('ora');
jest.mock('../../utils/cache');
jest.mock('../../utils/do-commits');

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

  beforeEach(() => {
    jest.spyOn(process, 'chdir').mockImplementationOnce(() => undefined);
  });

  it('changes directory to the root dir', async () => {
    await copyCommitsToRepo(deps, dates);

    expect(process.chdir).toHaveBeenCalledWith(config.rootDir);
  });

  it('calls doCommits', async () => {
    await copyCommitsToRepo(deps, dates);

    expect(doCommits).toHaveBeenCalledWith(
      expect.objectContaining({ dates, max: MAX_COMMITS_PER_PUSH })
    );
  });
});

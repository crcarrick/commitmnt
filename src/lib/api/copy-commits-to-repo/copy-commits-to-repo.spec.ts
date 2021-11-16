import process from 'process';

import ora from 'ora';

import { Deps } from '../../types';
import { Cache } from '../../utils/cache';
import { doCommits } from '../../utils/do-commits';

import { copyCommitsToRepo, MAX_COMMITS_PER_PUSH } from './copy-commits-to-repo';

jest.mock('ora');
jest.mock('../../utils/cache');
jest.mock('../../utils/do-commits');

describe('copyCommitsToRepo', () => {
  const dates = ['foo', 'bar'];
  const config = {
    branch: '',
    remote: '',
    repositories: [],
  };
  const cache = new Cache();
  const rootDir = '/foo/bar';

  const deps: Deps = {
    config,
    cache,
    rootDir,
    spinner: ora(),
  };

  beforeEach(() => {
    jest.spyOn(process, 'chdir').mockImplementationOnce(() => undefined);
  });

  it('changes directory to the root dir', async () => {
    await copyCommitsToRepo(deps, dates);

    expect(process.chdir).toHaveBeenCalledWith(rootDir);
  });

  it('calls doCommits', async () => {
    await copyCommitsToRepo(deps, dates);

    expect(doCommits).toHaveBeenCalledWith(
      expect.objectContaining({ dates, max: MAX_COMMITS_PER_PUSH })
    );
  });
});

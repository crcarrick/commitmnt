import { mocked } from 'ts-jest/utils';

import { doCommit } from '../../lib/git/do-commit';
import { doCommits } from '../../lib/git/do-commits';
import { git } from '../../lib/utils/git';

jest.mock('../../lib/git/do-commit');
jest.mock('../../lib/utils/exec');
jest.mock('../../lib/utils/git');

const mockedDoCommit = mocked(doCommit);
const mockedGit = mocked(git);

describe('doCommits', () => {
  const commits = [
    '2021-11-12T00:00:00+0:00',
    '2021-11-13T00:00:00+0:00',
    '2021-11-14T00:00:00+0:00',
    '2021-11-15T00:00:00+0:00',
  ];

  afterEach(() => {
    mockedGit.push.mockReset();
  });

  it('calls doCommit for every commit in the list', async () => {
    await doCommits({ commits, max: 400, branch: 'foo' });

    expect(mockedDoCommit).toHaveBeenCalledTimes(commits.length);
  });

  it('creates the correct number of commits', async () => {
    const result = await doCommits({ commits, max: 400, branch: 'foo' });

    expect(result).toBe(commits.length);
  });

  it('pushes to the correct branch', async () => {
    await doCommits({ commits, max: 400, branch: 'foo' });

    expect(git.push).toHaveBeenCalledWith(expect.objectContaining({ upstream: 'origin foo' }));
    expect(git.push).toHaveBeenCalledTimes(1);
  });

  it('pushes when it reaches the max commits, then continues', async () => {
    await doCommits({ commits, max: 2, branch: 'foo' });

    expect(git.push).toHaveBeenCalledTimes(2);
  });
});

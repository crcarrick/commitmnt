import { mocked } from 'ts-jest/utils';

import { doCommit } from '../../lib/git/do-commit';
import { doCommits } from '../../lib/git/do-commits';
import { exec } from '../../lib/utils/exec';

jest.mock('../../lib/git/do-commit');
jest.mock('../../lib/utils/exec');

const mockedDoCommit = mocked(doCommit);
const mockedExec = mocked(exec);

describe('doCommits', () => {
  const commits = [
    '2021-11-12T00:00:00+0:00',
    '2021-11-13T00:00:00+0:00',
    '2021-11-14T00:00:00+0:00',
    '2021-11-15T00:00:00+0:00',
  ];

  afterEach(() => {
    mockedExec.mockReset();
  });

  it('calls doCommit for every commit in the list', async () => {
    await doCommits(commits, 400, 'foo');

    expect(mockedDoCommit).toHaveBeenCalledTimes(commits.length);
  });

  it('creates the correct number of commits', async () => {
    const result = await doCommits(commits, 400, 'foo');

    expect(result).toBe(commits.length);
  });

  it('pushes to the correct branch', async () => {
    await doCommits(commits, 400, 'foo');

    expect(mockedExec).toHaveBeenCalledWith('git push -u origin foo');
    expect(mockedExec).toHaveBeenCalledTimes(1);
  });

  it('pushes when it reaches the max commits, then continues', async () => {
    await doCommits(commits, 2, 'foo');

    expect(mockedExec).toHaveBeenCalledTimes(2);
  });
});

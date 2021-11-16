import { mocked } from 'ts-jest/utils';

import { doCommit } from '../do-commit';
import * as git from '../git';

import { doCommits } from './do-commits';

jest.mock('../do-commit');
jest.mock('../exec');
jest.mock('../git');

const mockedDoCommit = mocked(doCommit);
const mockedGit = mocked(git);

describe('doCommits', () => {
  const dates = [
    '2021-11-12T00:00:00+0:00',
    '2021-11-13T00:00:00+0:00',
    '2021-11-14T00:00:00+0:00',
    '2021-11-15T00:00:00+0:00',
  ];

  afterEach(() => {
    mockedGit.push.mockReset();
  });

  it('calls doCommit for every commit in the list', async () => {
    await doCommits({ dates, max: 400 });

    expect(mockedDoCommit).toHaveBeenCalledTimes(dates.length);
  });

  it('creates the correct number of commits', async () => {
    const result = await doCommits({ dates, max: 400 });

    expect(result).toBe(dates.length);
  });

  it('pushes to the correct branch', async () => {
    await doCommits({ dates, max: 400 });

    expect(git.push).toHaveBeenCalledTimes(1);
  });

  it('pushes when it reaches the max commits, then continues', async () => {
    await doCommits({ dates, max: 2 });

    expect(git.push).toHaveBeenCalledTimes(2);
  });
});

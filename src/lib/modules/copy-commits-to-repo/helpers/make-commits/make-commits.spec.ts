import * as datefns from 'date-fns';
import { mocked } from 'ts-jest/utils';

import { exec } from '../../../../utils/exec';
import * as git from '../../../../utils/git';
import { MAX_COMMITS_PER_PUSH } from '../../copy-commits-to-repo';

import { makeCommits } from './make-commits';

jest.mock('date-fns');
jest.mock('../../../../utils/exec');
jest.mock('../../../../utils/git');

const mocks = {
  datefns: mocked(datefns),
  exec: mocked(exec),
  git: mocked(git),
};

describe('makeCommits', () => {
  const dates = [
    '2021-11-12T00:00:00+0:00',
    '2021-11-13T00:00:00+0:00',
    '2021-11-14T00:00:00+0:00',
    '2021-11-15T00:00:00+0:00',
  ];

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('makes a commit for every date in the list', async () => {
    await makeCommits({ dates, max: MAX_COMMITS_PER_PUSH });

    expect(git.commit).toHaveBeenCalledTimes(dates.length);
  });

  it('changes a dummy file (foo.txt) in order to have something to commit', async () => {
    await makeCommits({ dates, max: MAX_COMMITS_PER_PUSH });

    expect(exec).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`echo.*>.*foo.txt`)));
  });

  it('uses file foo.txt by default', async () => {
    await makeCommits({ dates, max: MAX_COMMITS_PER_PUSH });

    expect(exec).toHaveBeenCalledWith(expect.stringContaining('foo.txt'));
  });

  it('git adds the changes to the dummy file', async () => {
    await makeCommits({ dates, max: MAX_COMMITS_PER_PUSH });

    expect(git.add).toHaveBeenCalled();
  });

  it('commits the changes backdated to the commit date', async () => {
    mocks.datefns.format.mockReturnValueOnce(dates[0]);

    await makeCommits({ dates, max: MAX_COMMITS_PER_PUSH });

    expect(git.commit).toHaveBeenCalledWith(
      expect.objectContaining({ date: dates[0], message: dates[0] })
    );
  });

  it('creates the correct number of commits', async () => {
    const result = await makeCommits({ dates, max: MAX_COMMITS_PER_PUSH });

    expect(result).toBe(dates.length);
  });

  it('pushes to the correct branch', async () => {
    await makeCommits({ dates, max: MAX_COMMITS_PER_PUSH });

    expect(git.push).toHaveBeenCalledTimes(1);
  });

  it('pushes when it reaches the max commits, then continues', async () => {
    await makeCommits({ dates, max: 2 });

    expect(git.push).toHaveBeenCalledTimes(2);
  });
});

import * as datefns from 'date-fns';
import { mocked } from 'ts-jest/utils';

import { exec } from '../exec';
import { git } from '../git';

import { doCommit } from './do-commit';

jest.mock('../exec');
jest.mock('../git');

const mockedExec = mocked(exec);

jest.mock('date-fns');
jest.mock('uuid');

describe('doCommit', () => {
  const commit = '2021-11-14T00:00:00+0:00';
  const file = 'foo.txt';

  it('changes a dummy file in order to have something to commit', async () => {
    await doCommit({ commit, file });

    expect(mockedExec).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`echo.*>.*${file}`)));
  });

  it('git adds the changes to the dummy file', async () => {
    jest.spyOn(git, 'add');

    await doCommit({ commit, file });

    expect(git.add).toHaveBeenCalledWith(expect.objectContaining({ files: file }));
  });

  it('commits the changes backdated to the commit date', async () => {
    jest.spyOn(datefns, 'format').mockReturnValueOnce(commit);
    jest.spyOn(git, 'commit');

    await doCommit({ commit, file });

    expect(git.commit).toHaveBeenCalledWith(
      expect.objectContaining({ date: commit, message: commit })
    );
  });
});

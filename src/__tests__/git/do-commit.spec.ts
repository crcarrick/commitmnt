import * as datefns from 'date-fns';
import { mocked } from 'ts-jest/utils';

import { doCommit } from '../../lib/git/do-commit';
import { exec } from '../../lib/utils/exec';
import { git } from '../../lib/utils/git';

jest.mock('../../lib/utils/exec');
jest.mock('../../lib/utils/git');

const mockedExec = mocked(exec);

jest.mock('date-fns');
jest.mock('uuid');

describe('doCommit', () => {
  const commit = '2021-11-14T00:00:00+0:00';
  const filename = 'foo.txt';

  it('changes a dummy file in order to have something to commit', async () => {
    await doCommit({ commit, filename });

    expect(mockedExec).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`echo.*>.*${filename}`))
    );
  });

  it('git adds the changes to the dummy file', async () => {
    jest.spyOn(git, 'add');

    await doCommit({ commit, filename });

    expect(git.add).toHaveBeenCalledWith(expect.objectContaining({ files: filename }));
  });

  it('commits the changes backdated to the commit date', async () => {
    jest.spyOn(datefns, 'format').mockReturnValueOnce(commit);
    jest.spyOn(git, 'commit');

    await doCommit({ commit, filename });

    expect(git.commit).toHaveBeenCalledWith(
      expect.objectContaining({ date: commit, message: commit })
    );
  });
});

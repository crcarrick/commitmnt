import * as datefns from 'date-fns';
import { mocked } from 'ts-jest/utils';

import { exec } from '../exec';
import * as git from '../git';

import { doCommit } from './do-commit';

jest.mock('date-fns');
jest.mock('uuid');
jest.mock('../exec');
jest.mock('../git');

const mocks = { exec: mocked(exec) };

describe('doCommit', () => {
  const date = '2021-11-14T00:00:00+0:00';
  const file = 'foo.txt';

  it('changes a dummy file in order to have something to commit', async () => {
    await doCommit({ date, file });

    expect(mocks.exec).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`echo.*>.*${file}`)));
  });

  it('git adds the changes to the dummy file', async () => {
    jest.spyOn(git, 'add');

    await doCommit({ date, file });

    expect(git.add).toHaveBeenCalledWith(expect.objectContaining({ files: file }));
  });

  it('commits the changes backdated to the commit date', async () => {
    jest.spyOn(datefns, 'format').mockReturnValueOnce(date);
    jest.spyOn(git, 'commit');

    await doCommit({ date, file });

    expect(git.commit).toHaveBeenCalledWith(expect.objectContaining({ date, message: date }));
  });
});

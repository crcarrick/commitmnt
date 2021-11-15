import { mocked } from 'ts-jest/utils';

import { getCommits } from '../../lib/git/get-commits';
import { exec } from '../../lib/utils/exec';

jest.mock('../../lib/utils/exec');

const mockedExec = mocked(exec);

describe('getCommits', () => {
  const author = 'Foo Bar';
  const commits = ['2021-11-14T00:00:00+0:00', '2021-11-15T00:00:00+0:00'];

  beforeEach(() => {
    mockedExec.mockImplementationOnce(() =>
      Promise.resolve({ stdout: commits.join('\n'), stderr: '' })
    );
  });

  it('creates a log command', async () => {
    await getCommits({ author });

    expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining('git log'));
  });

  it('selects a specific author', async () => {
    await getCommits({ author });

    expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining(`--author="${author}"`));
  });

  describe('`after` param', () => {
    it('selects all commits', async () => {
      const result = await getCommits({ author });

      expect(mockedExec).not.toHaveBeenCalledWith(expect.stringContaining('--after'));
      expect(result.length).toBe(commits.length);
    });

    it('selects commits after a specified date', async () => {
      const result = await getCommits({ author, after: commits[0] });

      expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining(`--after="${commits[0]}"`));
      expect(result.length).toStrictEqual(commits.length - 1);
    });
  });
});

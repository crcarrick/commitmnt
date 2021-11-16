import { mocked } from 'ts-jest/utils';

import { exec } from '../exec';

import { getCommits } from './get-commits';

jest.mock('../exec');

const mocks = { exec: mocked(exec) };

// TODO: Refactor to use the `git` client
describe('getCommits', () => {
  const author = 'Foo Bar';
  const commits = ['2021-11-14T00:00:00+0:00', '2021-11-15T00:00:00+0:00'];

  beforeEach(() => {
    mocks.exec.mockImplementationOnce(() =>
      Promise.resolve({ stdout: commits.join('\n'), stderr: '' })
    );
  });

  it('creates a log command', async () => {
    await getCommits({ author });

    expect(mocks.exec).toHaveBeenCalledWith(expect.stringContaining('git log'));
  });

  it('selects a specific author', async () => {
    await getCommits({ author });

    expect(mocks.exec).toHaveBeenCalledWith(expect.stringContaining(`--author="${author}"`));
  });

  describe('`after` param', () => {
    it('selects all commits', async () => {
      const result = await getCommits({ author });

      expect(mocks.exec).not.toHaveBeenCalledWith(expect.stringContaining('--after'));
      expect(result.length).toBe(commits.length);
    });

    it('selects commits after a specified date', async () => {
      const result = await getCommits({ author, after: commits[0] });

      expect(mocks.exec).toHaveBeenCalledWith(expect.stringContaining(`--after="${commits[0]}"`));
      expect(result.length).toStrictEqual(commits.length - 1);
    });
  });
});

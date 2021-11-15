import { mocked } from 'ts-jest/utils';

import { Repository } from '../config';
import { exec } from '../utils/exec';

import { gitLog } from './git-log';

jest.mock('../utils/exec');

const mockedExec = mocked(exec);

describe('git-log', () => {
  let repo: Repository;

  describe('gitLog', () => {
    const commits = ['2021-11-15T00:00:00+0:00', '2021-11-14T00:00:00+0:00'];

    beforeAll(() => {
      mockedExec.mockImplementation(() =>
        Promise.resolve({ stdout: commits.join('\n'), stderr: '' })
      );
    });

    beforeEach(() => {
      repo = {
        name: 'foo',
        path: './foo',
        identifier: 'foo',
      };
    });

    it('creates a log command', async () => {
      await gitLog(repo);

      expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining('git log'));
      expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining('--author="foo"'));
    });

    it('does not create log command with --after when repo.last is undefined', async () => {
      await gitLog(repo);

      expect(mockedExec).not.toHaveBeenCalledWith(expect.stringContaining('--after'));
    });

    it('creates a log command with --after when repo.last is defined', async () => {
      await gitLog({ ...repo, last: 'foo' });

      expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining('--after="foo"'));
    });

    it('returns all the commits when repo.last is undefined', async () => {
      const result = await gitLog(repo);

      expect(result.length).toBe(commits.length);
    });

    it('chops off the first commit when repo.last is defined', async () => {
      const result = await gitLog({ ...repo, last: 'foo' });

      expect(result.length).toStrictEqual(commits.length - 1);
    });
  });
});

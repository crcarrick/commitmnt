import process from 'process';

import fs from 'fs-extra';
import { mocked } from 'ts-jest/utils';

import { Cache } from '../cache';
import { Repository } from '../config';
import { exec } from '../utils/exec';
import { Deps } from '../utils/ioc';

import * as allReadRepository from './read-repository';

jest.mock('../cache');
jest.mock('../utils/exec');

const mockedExec = mocked(exec);

const { gitLog, readRepository } = allReadRepository;

describe('read-repository', () => {
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

  describe('readRepository', () => {
    let mockDeps: Deps;
    let pathToRepo: string;

    beforeEach(() => {
      mockDeps = {
        cache: new Cache(),
        config: {
          repositories: [
            {
              name: 'foo',
              path: './foo',
              identifier: 'foo',
            },
          ],
        },
      };
      pathToRepo = mockDeps.config.repositories[0].path;
    });

    it('throws when repositories does not contain requested repository', async () => {
      await expect(readRepository(mockDeps, './bar')).rejects.toThrowError(
        `Couldn't find repository at path ./bar`
      );
    });

    it('throws when repo directory does not exist', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

      await expect(readRepository(mockDeps, pathToRepo)).rejects.toThrowError(
        `Couldn't find repository at path ./foo`
      );
      expect(fs.existsSync).toHaveBeenCalled();
    });

    it('changes directory to the repo directory and then calls gitLog', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
      jest.spyOn(process, 'chdir').mockImplementationOnce(jest.fn());

      const result = await readRepository(mockDeps, pathToRepo);

      expect(process.chdir).toHaveBeenCalledWith(pathToRepo);
      expect(result).toBeTruthy();
    });
  });
});

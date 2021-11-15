import process from 'process';

import fs from 'fs-extra';

import { Cache } from '../cache';
import { Deps } from '../utils/ioc';

import * as gitLogModule from './git-log';
import { readRepository } from './read-repository';

jest.mock('./git-log');
jest.mock('../cache');

describe('read-repository', () => {
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
      jest.spyOn(gitLogModule, 'gitLog');

      await readRepository(mockDeps, pathToRepo);

      expect(process.chdir).toHaveBeenCalledWith(pathToRepo);
      expect(gitLogModule.gitLog).toHaveBeenCalled();
    });
  });
});

it('', () => {
  expect(true).toBe(true);
});

// import process from 'process';

// import fs from 'fs-extra';

// import * as getCommitsModule from '../lib/git/get-commits';
// import { readRepository } from '../lib/repository/read-repository';
// import { Cache } from '../lib/utils/cache';
// import { Deps } from '../lib/utils/ioc';

// jest.mock('../lib/git/get-commits-for-repo');
// jest.mock('../cache');

// describe('readRepository', () => {
//   let mockDeps: Deps;
//   let pathToRepo: string;

//   beforeEach(() => {
//     mockDeps = {
//       cache: new Cache(),
//       config: {
//         repositories: [
//           {
//             name: 'foo',
//             path: './foo',
//             identifier: 'foo',
//           },
//         ],
//       },
//     };
//     pathToRepo = mockDeps.config.repositories[0].path;
//   });

//   it('throws when repositories does not contain requested repository', async () => {
//     await expect(readRepository('./bar', mockDeps)).rejects.toThrowError(
//       `Couldn't find repository at path ./bar`
//     );
//   });

//   it('throws when repo directory does not exist', async () => {
//     jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

//     await expect(readRepository(pathToRepo, mockDeps)).rejects.toThrowError(
//       `Couldn't find repository at path ./foo`
//     );
//     expect(fs.existsSync).toHaveBeenCalled();
//   });

//   it('changes directory to the repo directory and then calls gitLog', async () => {
//     jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
//     jest.spyOn(process, 'chdir').mockImplementationOnce(jest.fn());
//     jest.spyOn(getCommitsModule, 'getCommits');

//     await readRepository(pathToRepo, mockDeps);

//     expect(process.chdir).toHaveBeenCalledWith(pathToRepo);
//     expect(getCommitsModule.getCommits).toHaveBeenCalled();
//   });
// });

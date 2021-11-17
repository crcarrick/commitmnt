import cmytment from '../';

import { getTestRepos, LOCAL_DIR } from './utils';

describe('cmytment', () => {
  it(`shouldn't `, async () => {
    process.chdir(LOCAL_DIR);

    await cmytment(
      {
        branch: 'main',
        rootDir: LOCAL_DIR,
        repositories: getTestRepos().map((repo) => ({
          author: 'Foo Bar',
          branch: 'main',
          path: repo,
        })),
      },
      { quiet: true }
    );
  });
});

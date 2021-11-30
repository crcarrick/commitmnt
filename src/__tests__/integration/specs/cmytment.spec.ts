import { cmytment } from '../../../lib/index';
import { mockRepos, testDirs } from '../utils/misc';

beforeEach(async () => {
  await cmytment(
    {
      branch: 'main',
      rootDir: testDirs.local,
      repositories: mockRepos,
    },
    { quiet: true }
  );
});

it('', async () => {
  expect(true).toBe(true);
});

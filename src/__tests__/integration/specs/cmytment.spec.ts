import { cmytment } from '../../../lib/index';
import { mockRepos, testDirs, testRepos } from '../utils/misc';
import { getRepoCommits, resetTestRepos } from '../utils/tests';

let localCommits: Array<string>;
let mockCommits1: Array<string>;
let mockCommits2: Array<string>;
let remoteCommits: Array<string>;

beforeAll(async () => {
  await cmytment(
    {
      branch: 'main',
      rootDir: testDirs.local,
      repositories: mockRepos,
    },
    { quiet: true }
  );

  localCommits = await getRepoCommits(testRepos.local);
  mockCommits1 = await getRepoCommits(mockRepos[0]);
  mockCommits2 = await getRepoCommits(mockRepos[1]);
  remoteCommits = await getRepoCommits(testRepos.remote);
});

afterAll(async () => {
  await resetTestRepos();
});

it('creates the correct number of commits in the local repo', async () => {
  expect(localCommits.length).toBe(mockCommits1.length + mockCommits2.length);
});

it('creates commits on the correct dates in the local repo', async () => {
  expect(localCommits.sort()).toStrictEqual([...mockCommits1, ...mockCommits2].sort());
});

it('pushes the commits to the remote', async () => {
  expect(localCommits).toStrictEqual(remoteCommits);
});

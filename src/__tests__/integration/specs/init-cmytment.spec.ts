import { initCmytment } from '../../../lib/index';
import { commitDates, mockRepos, testDirs, testRepos } from '../utils/misc';
import { getRepoCommits, resetTestRepos } from '../utils/tests';

let cmytment: Awaited<ReturnType<typeof initCmytment>>;

beforeEach(async () => {
  cmytment = await initCmytment({
    branch: 'main',
    rootDir: testDirs.local,
  });
});

afterEach(async () => {
  await resetTestRepos();
});

describe('getCommitsForRepo', () => {
  it('can get commits from a repo', async () => {
    const commits = await cmytment.getCommitsForRepo(mockRepos[0]);

    expect(commits).toStrictEqual(commitDates);
  });
});

describe('copyCommitsToRepo', () => {
  it('can copy a list of commits to a repo and return the number of commits copied', async () => {
    const result = await cmytment.copyCommitsToRepo(commitDates);
    const localCommits = await getRepoCommits(testRepos.local);

    expect(result).toBe(commitDates.length);
    expect(localCommits).toStrictEqual(commitDates);
  });
});

describe('copyRepo', () => {
  it('can copy a repo and return the number of commits copied', async () => {
    const result = await cmytment.copyRepo(mockRepos[0]);
    const localCommits = await getRepoCommits(testRepos.local);
    const mockCommits = await getRepoCommits(mockRepos[0]);

    expect(result).toBe(commitDates.length);
    expect(localCommits).toStrictEqual(mockCommits);
  });
});

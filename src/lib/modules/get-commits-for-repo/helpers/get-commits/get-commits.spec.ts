import { mocked } from 'ts-jest/utils';

import * as git from '../../../../utils/git';

import { getCommits } from './get-commits';

jest.mock('../../../../utils/git');

const mocks = { git: mocked(git) };

const author = 'Foo Bar';
const commits = ['2021-11-14T00:00:00+0:00', '2021-11-15T00:00:00+0:00'];

beforeEach(() => {
  mocks.git.log.mockResolvedValue({ stdout: commits.join('\n'), stderr: '' });
});

afterEach(() => {
  jest.resetAllMocks();
});

it('creates a log command', async () => {
  await getCommits();

  expect(git.log).toHaveBeenCalled();
});

it('always passes a format', async () => {
  await getCommits();

  expect(git.log).toHaveBeenCalledWith(expect.objectContaining({ pretty: expect.any(String) }));
});

it('selects a specific author', async () => {
  await getCommits({ author });

  expect(git.log).toHaveBeenCalledWith(expect.objectContaining({ author }));
});

it('selects commits after a specified date', async () => {
  const result = await getCommits({ after: commits[0] });

  expect(git.log).toHaveBeenCalledWith(expect.objectContaining({ after: commits[0] }));
  expect(result).toHaveLength(commits.length - 1);
});

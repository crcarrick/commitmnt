import cp from 'child_process';

import { mocked } from 'ts-jest/utils';

import { exec } from './exec';

jest.mock('child_process');

const mocks = { cp: mocked(cp) };

function mockExec({ callbackWithError = false } = {}) {
  mocks.cp.exec.mockImplementationOnce((_, __, callback) => {
    if (callback) callback(callbackWithError ? new Error() : null, '', '');

    return new cp.ChildProcess();
  });
}

const command = 'foo';

beforeEach(() => {
  mockExec();
});

afterEach(() => {
  jest.resetAllMocks();
});

it('wraps the child_process exec fn in a promise and calls it', async () => {
  await exec(command);

  expect(cp.exec).toHaveBeenCalledWith(command, expect.anything(), expect.anything());
});

it('returns stdout and stderr', async () => {
  const result = await exec(command);

  expect(Object.keys(result)).toStrictEqual(['stdout', 'stderr']);
});

it('throws if child_process exec calls back with an error', async () => {
  mocks.cp.exec.mockReset();
  mockExec({ callbackWithError: true });

  await expect(exec(command)).rejects.toThrowError();
});

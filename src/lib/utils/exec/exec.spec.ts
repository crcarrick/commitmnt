import cp from 'child_process';

import { mocked } from 'ts-jest/utils';

import { exec } from './exec';

const mocks = { cp: mocked(cp) };

function createExecSpy(callbackWithError = false) {
  return jest
    .spyOn(cp, 'exec')
    .mockImplementationOnce(
      (
        _: string,
        __: cp.ExecOptions,
        callback:
          | ((error: cp.ExecException | null, stdout: string, stderr: string) => void)
          | undefined
      ): cp.ChildProcess => {
        if (callback) callback(callbackWithError ? new Error() : null, '', '');

        return new cp.ChildProcess();
      }
    );
}

describe('exec', () => {
  const command = 'foo';

  it('wraps the child_process exec fn in a promise and calls it', async () => {
    createExecSpy();

    await exec(command);

    expect(mocks.cp.exec).toHaveBeenCalledWith(command, expect.anything(), expect.anything());
  });

  it('returns stdout and stderr', async () => {
    createExecSpy();

    const result = await exec(command);

    expect(Object.keys(result)).toStrictEqual(['stdout', 'stderr']);
  });

  it('throws if child_process exec calls back with an error', async () => {
    createExecSpy(true);

    await expect(exec(command)).rejects.toThrowError();
  });
});

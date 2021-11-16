import cp from 'child_process';

/**
 * @internal
 *
 * Promise wrapper around `child_process.exec` because `util.promisify(child_process.exec)` returned
 * a chainable `Promise` type that we don't need
 *
 * @param command the command to execute
 * @returns the output of the executed command
 */
export const exec = (command: string): Promise<{ stdout: string; stderr: string }> =>
  new Promise((resolve, reject) => {
    cp.exec(command, {}, (err, stdout, stderr) => {
      if (err) reject(err);

      resolve({ stdout, stderr });
    });
  });

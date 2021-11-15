import cp from 'child_process';

export const exec = (command: string): Promise<{ stdout: string; stderr: string }> =>
  new Promise((resolve, reject) => {
    cp.exec(command, (err, stdout, stderr) => {
      if (err) reject(err);

      resolve({ stdout, stderr });
    });
  });

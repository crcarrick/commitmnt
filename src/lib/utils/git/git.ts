import { exec } from '../exec';

async function add(addArgs?: { files: string | Array<string> }) {
  let files = addArgs?.files || '.';

  if (Array.isArray(files)) files = files.join(' ');

  return exec(`git add ${files}`);
}

async function commit({ date, message }: { date?: string; message: string }) {
  let command = `git commit -m "${message}" `;

  if (date) command += `--date="${date}"`;

  return exec(command.trim());
}

async function log(logArgs?: {
  after?: string;
  author?: string;
  before?: string;
  pretty?: string;
}) {
  let command = `git log `;

  if (logArgs?.after) command += `--after="${logArgs?.after}" `;
  if (logArgs?.author) command += `--author="${logArgs?.author}" `;
  if (logArgs?.before) command += `--before="${logArgs?.before}" `;
  if (logArgs?.pretty) command += `--pretty=${logArgs?.pretty}`;

  return exec(command.trim());
}

async function push(pushArgs?: { upstream?: string }) {
  let command = `git push `;

  if (pushArgs?.upstream) command += `-u ${pushArgs.upstream}`;

  return exec(command.trim());
}

export const git = {
  add,
  commit,
  log,
  push,
};

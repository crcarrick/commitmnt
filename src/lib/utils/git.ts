import { exec } from './exec';

export type AddArgs = {
  files: string | Array<string>;
};

async function add({ files }: AddArgs) {
  if (Array.isArray(files)) files = files.join(' ');

  return exec(`git add ${files}`);
}

export type CommitArgs = {
  date?: string;
  message: string;
};

async function commit({ date, message }: CommitArgs) {
  let command = `git commit -m "${message}" `;

  if (date) command += `--date="${date}"`;

  return exec(command.trim());
}

export type LogArgs = {
  after?: string;
  author?: string;
  before?: string;
  pretty?: string;
};

async function log(logArgs?: LogArgs) {
  let command = `git log `;

  if (logArgs?.after) command += `--after="${logArgs?.after}" `;
  if (logArgs?.author) command += `--author="${logArgs?.author}" `;
  if (logArgs?.before) command += `--before="${logArgs?.before}" `;
  if (logArgs?.pretty) command += `--pretty=${logArgs?.pretty}`;

  return exec(command.trim());
}

export type PushArgs = {
  upstream?: string;
};

async function push(pushArgs?: PushArgs) {
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

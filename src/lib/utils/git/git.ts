import { exec } from '../exec';

/**
 * Runs `git add`
 *
 * @param files the files to stage
 * @returns the output of the executed command
 *
 * @category Git Wrapper
 */
export async function add(addArgs?: { files: string | Array<string> }) {
  let files = addArgs?.files || '.';

  if (Array.isArray(files)) files = files.join(' ');

  return exec(`git add ${files}`);
}

/**
 * Runs `git commit`
 *
 * @param date the --date arg
 * @param message the --message arg
 * @returns the output of the executed command
 *
 * @category Git Wrapper
 */
export async function commit({ date, message }: { date?: string; message: string }) {
  let command = `git commit -m "${message}" `;

  if (date) command += `--date="${date}"`;

  return exec(command.trim());
}

/**
 * Runs `git log`
 *
 * @param after the --after arg
 * @param author the --author arg
 * @param before the --before arg
 * @param pretty the --pretty arg
 * @param misc any misc text to append to the command
 * @returns the output of the executed command
 *
 * @category Git Wrapper
 */
export async function log(logArgs?: {
  after?: string;
  author?: string;
  before?: string;
  pretty?: string;
}) {
  let command = 'git log ';

  if (logArgs?.after) command += `--after="${logArgs.after}" `;
  if (logArgs?.author) command += `--author="${logArgs.author}" `;
  if (logArgs?.before) command += `--before="${logArgs.before}" `;
  if (logArgs?.pretty) command += `--pretty=${logArgs.pretty} `;

  return exec(command.trim());
}

/**
 * Runs `git` + whatever you want
 *
 * @param command the command to run
 * @returns the output of the executed command
 *
 * @category Git Wrapper
 */
export async function misc(command: string) {
  return exec(`git ${command}`);
}

/**
 * Runs `git push`
 *
 * @param upstream the --set-upstream arg
 * @returns the output of the executed command
 *
 * @category Git Wrapper
 */
export async function push(pushArgs?: { upstream?: string }) {
  let command = 'git push ';

  if (pushArgs?.upstream) command += `-u ${pushArgs.upstream}`;

  return exec(command.trim());
}

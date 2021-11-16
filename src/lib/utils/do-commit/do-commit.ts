import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { exec } from '../exec';
import * as git from '../git';

/**
 * Commits a change to a file on a specified date
 *
 * @param commit the date of the commit
 * @param file the file to change
 */
export async function doCommit({ date, file = 'foo.txt' }: { date: string; file?: string }) {
  const formatted = format(parseISO(date), 'yyyy-MM-dd HH:mm:ss');

  await exec(`echo "${uuidv4()}" > ${file}`);

  await git.add({ files: file });
  await git.commit({ date: formatted, message: formatted });
}

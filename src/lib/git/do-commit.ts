import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { exec } from '../utils/exec';

export async function doCommit(commit: string, filename = 'foo.txt') {
  const formatted = format(parseISO(commit), 'yyyy-MM-dd HH:mm:ss');

  await exec(`echo "${uuidv4()}" > ${filename}`);
  await exec(`git add ${filename}`);
  await exec(`git commit --date "${formatted}" -m "${formatted}"`);
}

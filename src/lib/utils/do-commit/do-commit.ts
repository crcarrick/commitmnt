import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { exec } from '../exec';
import { git } from '../git';

export async function doCommit({ commit, file = 'foo.txt' }: { commit: string; file?: string }) {
  const formatted = format(parseISO(commit), 'yyyy-MM-dd HH:mm:ss');

  await exec(`echo "${uuidv4()}" > ${file}`);

  await git.add({ files: file });
  await git.commit({ date: formatted, message: formatted });
}

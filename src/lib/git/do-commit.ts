import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { exec } from '../utils/exec';
import { git } from '../utils/git';

type DoCommitArgs = {
  commit: string;
  filename?: string;
};

export async function doCommit({ commit, filename = 'foo.txt' }: DoCommitArgs) {
  const formatted = format(parseISO(commit), 'yyyy-MM-dd HH:mm:ss');

  await exec(`echo "${uuidv4()}" > ${filename}`);

  await git.add({ files: filename });
  await git.commit({ date: formatted, message: formatted });
}

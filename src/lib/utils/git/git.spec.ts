import { exec } from '../exec';

import * as git from './git';

jest.mock('../exec');

describe('git', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('add', () => {
    const files = 'foo bar';

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('adds everything by default', async () => {
      await git.add();

      expect(exec).toHaveBeenCalledWith('git add .');
    });

    it('adds a string of files', async () => {
      await git.add({ files });

      expect(exec).toHaveBeenCalledWith(`git add ${files}`);
    });

    it('adds an array of files', async () => {
      await git.add({ files: files.split(' ') });

      expect(exec).toHaveBeenCalledWith(`git add ${files}`);
    });
  });

  describe('commit', () => {
    const message = 'foo';

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('commits with a message', async () => {
      await git.commit({ message });

      expect(exec).toHaveBeenCalledWith(`git commit -m "${message}"`);
    });

    it('commits with a date', async () => {
      const date = 'foo';

      await git.commit({ message, date });

      expect(exec).toHaveBeenCalledWith(`git commit -m "${message}" --date="${date}"`);
    });
  });

  describe('log', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('logs', async () => {
      await git.log();

      expect(exec).toHaveBeenCalledWith('git log');
    });

    it('logs with an after', async () => {
      const after = 'foo';

      await git.log({ after });

      expect(exec).toHaveBeenCalledWith(`git log --after="${after}"`);
    });

    it('logs with an author', async () => {
      const author = 'foo';

      await git.log({ author });

      expect(exec).toHaveBeenCalledWith(`git log --author="${author}"`);
    });

    it('logs with a before', async () => {
      const before = 'foo';

      await git.log({ before });

      expect(exec).toHaveBeenCalledWith(`git log --before="${before}"`);
    });

    it('logs with a pretty format', async () => {
      const pretty = 'foo';

      await git.log({ pretty });

      expect(exec).toHaveBeenCalledWith(`git log --pretty=${pretty}`);
    });

    it('logs with many options', async () => {
      const after = 'foo';
      const author = 'foo';
      const before = 'foo';
      const pretty = 'foo';

      await git.log({ after, author, before, pretty });

      expect(exec).toHaveBeenCalledWith(expect.stringContaining(`--after="${after}"`));
      expect(exec).toHaveBeenCalledWith(expect.stringContaining(`--author="${author}"`));
      expect(exec).toHaveBeenCalledWith(expect.stringContaining(`--before="${before}"`));
      expect(exec).toHaveBeenCalledWith(expect.stringContaining(`--pretty=${pretty}`));
    });
  });

  describe('misc', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('accepts any git command and runs it', async () => {
      await git.misc('pull');

      expect(exec).toHaveBeenCalledWith('git pull');
    });
  });

  describe('push', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('pushes', async () => {
      await git.push();

      expect(exec).toHaveBeenCalledWith('git push');
    });

    it('pushes with an upstream', async () => {
      const upstream = 'origin foo';

      await git.push({ upstream });

      expect(exec).toHaveBeenCalledWith(`git push -u ${upstream}`);
    });
  });
});

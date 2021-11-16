import { mocked } from 'ts-jest/utils';

import { exec } from '../exec';

import * as git from './git';

jest.mock('../exec');

const mockedExec = mocked(exec);

describe('git', () => {
  describe('add', () => {
    const files = 'foo bar';

    beforeEach(() => {
      mockedExec.mockReset();
    });

    it('adds everything by default', async () => {
      await git.add();

      expect(mockedExec).toHaveBeenCalledWith('git add .');
    });

    it('adds a string of files', async () => {
      await git.add({ files });

      expect(mockedExec).toHaveBeenCalledWith(`git add ${files}`);
    });

    it('adds an array of files', async () => {
      await git.add({ files: files.split(' ') });

      expect(mockedExec).toHaveBeenCalledWith(`git add ${files}`);
    });
  });

  describe('commit', () => {
    const message = 'foo';

    beforeEach(() => {
      mockedExec.mockReset();
    });

    it('commits with a message', async () => {
      await git.commit({ message });

      expect(mockedExec).toHaveBeenCalledWith(`git commit -m "${message}"`);
    });

    it('commits with a date', async () => {
      const date = 'foo';

      await git.commit({ message, date });

      expect(mockedExec).toHaveBeenCalledWith(`git commit -m "${message}" --date="${date}"`);
    });
  });

  describe('log', () => {
    beforeEach(() => {
      mockedExec.mockReset();
    });

    it('logs', async () => {
      await git.log();

      expect(mockedExec).toHaveBeenCalledWith('git log');
    });

    it('logs with an after', async () => {
      const after = 'foo';

      await git.log({ after });

      expect(mockedExec).toHaveBeenCalledWith(`git log --after="${after}"`);
    });

    it('logs with an author', async () => {
      const author = 'foo';

      await git.log({ author });

      expect(mockedExec).toHaveBeenCalledWith(`git log --author="${author}"`);
    });

    it('logs with a before', async () => {
      const before = 'foo';

      await git.log({ before });

      expect(mockedExec).toHaveBeenCalledWith(`git log --before="${before}"`);
    });

    it('logs with a pretty format', async () => {
      const pretty = 'foo';

      await git.log({ pretty });

      expect(mockedExec).toHaveBeenCalledWith(`git log --pretty=${pretty}`);
    });

    it('logs with many options', async () => {
      const after = 'foo';
      const author = 'foo';
      const before = 'foo';
      const pretty = 'foo';

      await git.log({ after, author, before, pretty });

      expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining(`--after="${after}"`));
      expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining(`--author="${author}"`));
      expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining(`--before="${before}"`));
      expect(mockedExec).toHaveBeenCalledWith(expect.stringContaining(`--pretty=${pretty}`));
    });
  });

  describe('push', () => {
    beforeEach(() => {
      mockedExec.mockReset();
    });

    it('pushes', async () => {
      await git.push();

      expect(mockedExec).toHaveBeenCalledWith('git push');
    });

    it('pushes with an upstream', async () => {
      const upstream = 'origin foo';

      await git.push({ upstream });

      expect(mockedExec).toHaveBeenCalledWith(`git push -u ${upstream}`);
    });
  });
});

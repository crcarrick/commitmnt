import { mocked } from 'ts-jest/utils';

import { exec } from '../exec';

import * as git from './git';

jest.mock('../exec');

const mocks = { exec: mocked(exec) };

describe('git', () => {
  describe('add', () => {
    const files = 'foo bar';

    beforeEach(() => {
      mocks.exec.mockReset();
    });

    it('adds everything by default', async () => {
      await git.add();

      expect(mocks.exec).toHaveBeenCalledWith('git add .');
    });

    it('adds a string of files', async () => {
      await git.add({ files });

      expect(mocks.exec).toHaveBeenCalledWith(`git add ${files}`);
    });

    it('adds an array of files', async () => {
      await git.add({ files: files.split(' ') });

      expect(mocks.exec).toHaveBeenCalledWith(`git add ${files}`);
    });
  });

  describe('commit', () => {
    const message = 'foo';

    beforeEach(() => {
      mocks.exec.mockReset();
    });

    it('commits with a message', async () => {
      await git.commit({ message });

      expect(mocks.exec).toHaveBeenCalledWith(`git commit -m "${message}"`);
    });

    it('commits with a date', async () => {
      const date = 'foo';

      await git.commit({ message, date });

      expect(mocks.exec).toHaveBeenCalledWith(`git commit -m "${message}" --date="${date}"`);
    });
  });

  describe('log', () => {
    beforeEach(() => {
      mocks.exec.mockReset();
    });

    it('logs', async () => {
      await git.log();

      expect(mocks.exec).toHaveBeenCalledWith('git log');
    });

    it('logs with an after', async () => {
      const after = 'foo';

      await git.log({ after });

      expect(mocks.exec).toHaveBeenCalledWith(`git log --after="${after}"`);
    });

    it('logs with an author', async () => {
      const author = 'foo';

      await git.log({ author });

      expect(mocks.exec).toHaveBeenCalledWith(`git log --author="${author}"`);
    });

    it('logs with a before', async () => {
      const before = 'foo';

      await git.log({ before });

      expect(mocks.exec).toHaveBeenCalledWith(`git log --before="${before}"`);
    });

    it('logs with a pretty format', async () => {
      const pretty = 'foo';

      await git.log({ pretty });

      expect(mocks.exec).toHaveBeenCalledWith(`git log --pretty=${pretty}`);
    });

    it('logs with many options', async () => {
      const after = 'foo';
      const author = 'foo';
      const before = 'foo';
      const pretty = 'foo';

      await git.log({ after, author, before, pretty });

      expect(mocks.exec).toHaveBeenCalledWith(expect.stringContaining(`--after="${after}"`));
      expect(mocks.exec).toHaveBeenCalledWith(expect.stringContaining(`--author="${author}"`));
      expect(mocks.exec).toHaveBeenCalledWith(expect.stringContaining(`--before="${before}"`));
      expect(mocks.exec).toHaveBeenCalledWith(expect.stringContaining(`--pretty=${pretty}`));
    });
  });

  describe('push', () => {
    beforeEach(() => {
      mocks.exec.mockReset();
    });

    it('pushes', async () => {
      await git.push();

      expect(mocks.exec).toHaveBeenCalledWith('git push');
    });

    it('pushes with an upstream', async () => {
      const upstream = 'origin foo';

      await git.push({ upstream });

      expect(mocks.exec).toHaveBeenCalledWith(`git push -u ${upstream}`);
    });
  });
});

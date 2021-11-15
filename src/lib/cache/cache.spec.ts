/* eslint-disable import/order */

// mock-fs needs to come before fs here so that the fs api
// will be mocked before fs-extra wraps it
import mockFilesystem from 'mock-fs';
import fs from 'fs-extra';

import { Cache } from './cache';

// these are kind like half unit half "integration" tests i guess
describe('Cache', () => {
  beforeEach(async () => {
    mockFilesystem({});
  });

  afterEach(() => {
    mockFilesystem.restore();
  });

  it(`creates ./cache directory if it doesn't exist`, () => {
    new Cache();

    expect(fs.existsSync('./.cache')).toBe(true);
  });

  it(`creates custom directory if it doesn't exist`, () => {
    const dir = './foo';

    new Cache(dir);

    expect(fs.existsSync(dir)).toBe(true);
  });

  it('sets a value in the cache for a key', async () => {
    const cache = new Cache();

    const key = 'foo';
    const val = { foo: 'bar' };

    await cache.set(key, val);

    const file = cache.getPath(key);

    expect(fs.existsSync(file)).toBe(true);
    expect(fs.readJsonSync(file)).toStrictEqual(val);
  });

  it('gets a value from the cache for a key', async () => {
    const cache = new Cache();

    const key = 'foo';
    const val = { foo: 'bar' };

    const file = cache.getPath(key);

    mockFilesystem.restore();
    mockFilesystem({ [file]: JSON.stringify(val) });

    const result = await cache.get(key);

    expect(result).toStrictEqual(val);
  });
});

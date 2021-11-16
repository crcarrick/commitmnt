// eslint-disable-next-line import/order
import mockFilesystem from 'mock-fs';
import { existsSync } from 'fs';
import fs from 'fs/promises';

import { Cache } from './cache';

describe('Cache', () => {
  const key = 'foo';
  const val = { foo: 'bar' };

  let cache: Cache;

  beforeEach(() => {
    mockFilesystem({});

    cache = new Cache();
  });

  afterEach(() => {
    mockFilesystem.restore();
  });

  it(`creates ./cache directory if it doesn't exist`, () => {
    expect(existsSync('./.cache')).toBe(true);
  });

  it(`creates custom directory if it doesn't exist`, () => {
    const dir = './foo';

    new Cache(dir);

    expect(existsSync(dir)).toBe(true);
  });

  it('sets a value in the cache for a key', async () => {
    await cache.set(key, val);

    const file = cache.getPath(key);

    const result = await fs.readFile(file, 'utf8');

    expect(existsSync(file)).toBe(true);
    expect(JSON.parse(result)).toStrictEqual(val);
  });

  it('gets a value from the cache for a key', async () => {
    const file = cache.getPath(key);

    mockFilesystem.restore();
    mockFilesystem({ [file]: JSON.stringify(val) });

    const result = await cache.get(key);

    expect(result).toStrictEqual(val);
  });

  it('get returns undefined if key does not exist in the cache', async () => {
    const result = await cache.get(key);

    expect(result).toBeUndefined();
  });
});

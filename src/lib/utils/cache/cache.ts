import crypto from 'crypto';
import path from 'path';

import fs from 'fs-extra';

/**
 * Very simple cache class that uses the filesystem
 */
export class Cache {
  dir = path.join(process.cwd(), '.cache');

  /**
   * @param dir the directory to use in the filesystem
   * @constructor
   */
  constructor(dir?: string) {
    if (dir) this.dir = path.join(process.cwd(), dir);

    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }
  }

  /**
   * Gets a value from the cache
   *
   * @param key the cache key to lookup
   * @template R the type of the return value
   * @returns the value for `key` as json or null if key doesn't exist
   */
  async get<R>(key: string): Promise<R | void> {
    const file = this.getPath(key);

    if (!fs.existsSync(file)) return;

    return fs.readJson(this.getPath(key), { throws: false });
  }

  /**
   * Sets a value to the cache
   *
   * @param key the cache key to set the value at
   * @param value the value to set
   * @template R the type of the value
   */
  async set<R>(key: string, val: R) {
    const file = this.getPath(key);

    return fs.writeJson(file, val);
  }

  /**
   * Gets the path to a file for a given key
   *
   * @param key the cache key to get the path for
   * @returns the path
   */
  getPath(key: string) {
    return path.join(this.dir, this.hash(key));
  }

  /**
   * Hashes a given key
   *
   * @param key the cache key to hash
   * @returns the hashed key
   */
  private hash(key: string) {
    return crypto.createHash('md5').update(key).digest('hex');
  }
}

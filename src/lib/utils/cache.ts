import crypto from 'crypto';
import path from 'path';

import fs from 'fs-extra';
export class Cache {
  dir = './.cache';
  paths: Array<string> = [];

  constructor(dir?: string) {
    if (dir) this.dir = dir;

    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    } else {
      this.paths = fs.readdirSync(this.dir);
    }
  }

  async get<R>(key: string): Promise<R> {
    return fs.readJson(this.getPath(key));
  }

  async set(key: string, val: unknown) {
    const filename = this.getPath(key);

    this.paths = [...this.paths, filename];

    return fs.writeJson(filename, val);
  }

  getPath(key: string) {
    return path.join(this.dir, this.hash(key));
  }

  private hash(key: string) {
    return crypto.createHash('md5').update(key).digest('hex');
  }
}

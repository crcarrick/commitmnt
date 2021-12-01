/** @module Types */

import { Ora } from 'ora';

import { Cache } from './utils/cache';
import { ChangeDirectory } from './utils/cd';

export interface Config {
  branch: string;
  repositories: Array<Pick<Repository, 'author' | 'branch' | 'path'>>;
  rootDir: string;
}

/** @internal */
export interface Deps {
  cache: Cache;
  cd: ChangeDirectory;
  config: Config;
  spinner: Ora;
}

export interface Repository {
  author: string;
  branch: string;
  path: string;
  after?: string;
}

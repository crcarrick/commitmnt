/** @module Types */

import { Ora } from 'ora';

import { Cache } from './utils/cache';

export interface Config {
  branch: string;
  remote: string;
  repositories: Array<Pick<Repository, 'author' | 'branch' | 'path'>>;
}

/** @internal */
export interface Deps {
  cache: Cache;
  config: Config;
  rootDir: string;
  spinner: Ora;
}

export interface Repository {
  author: string;
  branch: string;
  path: string;
  after?: string;
}

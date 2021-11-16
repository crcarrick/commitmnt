/** @module Types */

import { Ora } from 'ora';

import { Cache } from './utils/cache';

export interface Config {
  branch: string;
  repositories: Array<Pick<Repository, 'author' | 'branch' | 'path'>>;
}

/** @internal */
export interface Deps {
  cache: Cache;
  config: Config;
  spinner: Ora;
}

export interface Repository {
  author: string;
  branch: string;
  path: string;
  after?: string;
}

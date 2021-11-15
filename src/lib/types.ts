export interface Config {
  cachePath?: string;
  gitBranch?: string;
  maxCommitsPerPush?: number;
  repositories: Array<Pick<Repository, 'name' | 'path' | 'identifier'>>;
}

export interface Repository {
  name: string;
  path: string;
  identifier: string;
  last?: string;
}

export interface CacheRepository extends Repository {
  last: string;
}

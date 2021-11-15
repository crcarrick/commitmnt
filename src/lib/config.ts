export interface Repository {
  name: string;
  path: string;
  identifier: string;
  last?: string;
}

export interface Config {
  cachePath?: string;
  repositories: Array<Repository>;
}

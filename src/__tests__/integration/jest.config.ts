import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  name: 'int',
  displayName: 'integration',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/**/*?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  globalSetup: '<rootDir>/jest.globalSetup.ts',
  globalTeardown: '<rootDir>/jest.globalTeardown.ts',
  maxWorkers: 1,
};

export default config;

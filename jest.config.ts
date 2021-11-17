import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  projects: ['<rootDir>/src/lib', '<rootDir>/src/__tests__/integration'],
};

export default config;

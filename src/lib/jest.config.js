module.exports = {
  name: 'unit',
  displayName: 'unit',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/**/*?(*.)+(spec|test).+(ts|tsx|js)'],
  collectCoverageFrom: [
    '<rootDir>/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/**/index.ts',
    '!<rootDir>/**/*.d.ts',
    '!<rootDir>/**/jest.config.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: -10,
    },
  },
  coverageDirectory: '<rootDir>/../../coverage',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

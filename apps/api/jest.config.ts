import type { Config } from 'jest';

const config: Config = {
  displayName: 'api',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '../tsconfig.json' }],
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.spec.(t|j)s', '!**/node_modules/**'],
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '@outtask/shared-types': '<rootDir>/../../libs/shared-types/src/index.ts',
    '@outtask/jobs': '<rootDir>/../../libs/jobs/src/index.ts',
  },
};

export default config;

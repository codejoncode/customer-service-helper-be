import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['<rootDir>/src/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
}

export default config;
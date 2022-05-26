import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  injectGlobals: false,
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts']
}
export default config

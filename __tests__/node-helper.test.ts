/* eslint-disable node/no-process-env -- Use internal */
import { getEnvironmentVariable, readFileAsync } from '../src/node-helper'
import { generateRandomString } from './util'

const mockFileData = `test\n is\n spec.`
jest.mock('fs', () => ({
  readFile: jest.fn((_path, _opt, cb) => {
    cb(null, mockFileData)
  })
}))

describe('node-helper.ts', () => {
  describe('getEnvironmentVariable()', () => {
    const envKey = 'FOO'
    const storedEnv = { ...process.env }
    beforeEach(() => {
      jest.resetModules()
      process.env = { ...storedEnv }
      delete process.env[envKey]
    })
    afterEach(() => (process.env = { ...storedEnv }))

    test.each(['', undefined])('throws RangeError if env is %s', (v) => {
      // Arrange
      process.env[envKey] = v
      // Act & Assert
      expect(() => getEnvironmentVariable(envKey)).toThrowError()
    })
    test('returns the same value as process.env', () => {
      // Arrange
      const envValue = generateRandomString(10)
      process.env[envKey] = envValue
      // Act & Assert
      expect(getEnvironmentVariable(envKey)).toBe(envValue)
    })
  })
  describe('readFileAsync()', () => {
    test('resolve value', async () => {
      const value = await readFileAsync('foo', 'utf-8')
      expect(value).toBe(mockFileData)
    })
  })
})

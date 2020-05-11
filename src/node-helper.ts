import { readFile } from 'fs'
import { promisify } from 'util'

export const readFileAsync = promisify(readFile)

/**
 * Gets the string value from process.env.
 * @param key Environment key
 * @throws {RangeError} Not found process.env[key] or process.env[key] is falsy value.
 */
export const getEnvironmentVariable = (key: string): string => {
  // eslint-disable-next-line node/no-process-env
  const value = process.env[key]
  if (!value)
    throw new RangeError(`${key} is not set in an environment variable.`)
  return value
}

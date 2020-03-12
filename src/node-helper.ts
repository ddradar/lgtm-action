import { readFile } from 'fs'
import { promisify } from 'util'

export const readFileAsync = promisify(readFile)

export const getEnvironmentVariable = (key: string): string => {
  // eslint-disable-next-line no-process-env
  const value = process.env[key]
  if (!value)
    throw new RangeError(`${key} is not set in an environment variable.`)
  return value
}

import { getInput } from '@actions/core'
import { load as yamlLoad } from 'js-yaml'
import { join as pathJoin } from 'path'
import { mocked } from 'ts-jest/utils'

import { getGithubStatus, getInputParams } from '../src/input-helper'
import { getEnvironmentVariable, readFileAsync } from '../src/node-helper'
import { generateRandomString as random } from './util'

jest.mock('@actions/core')
jest.mock('../src/node-helper', () => ({
  ...jest.requireActual<{ readFileAsync: typeof readFileAsync }>(
    '../src/node-helper'
  ),
  getEnvironmentVariable: jest.fn()
}))

describe('input-helper.ts', () => {
  describe('getGithubStatus()', () => {
    test('throws error if "GITHUB_REPOSITORY" is not owner/name', () => {
      // Arrange
      mocked(getEnvironmentVariable).mockImplementation((key) => key)
      // Assert & Act
      expect(() => getGithubStatus()).toThrowError(/GITHUB_REPOSITORY/)
    })
    test('returns same value as environment variable', () => {
      // Arrange
      const eventName = random(8)
      const repository = `${random(8)}/${random(8)}`
      mocked(getEnvironmentVariable).mockImplementation((key) =>
        key === 'GITHUB_EVENT_NAME'
          ? eventName
          : key === 'GITHUB_REPOSITORY'
          ? repository
          : key
      )
      // Assert
      const githubStatus = getGithubStatus()
      // Act
      expect(githubStatus.eventName).toBe(eventName)
      expect(githubStatus.repository).toBe(repository)
    })
  })
  describe('getInputParams()', () => {
    const createMockedGetInput = (
      token: string,
      imageUrl: string,
      searchPattern?: string | undefined
    ) => (name: string): string =>
      name === 'token'
        ? token
        : name === 'image-url'
        ? imageUrl
        : name === 'search-pattern'
        ? searchPattern ?? ''
        : ''

    test('returns getInput() values', () => {
      // Arrange
      const token = random(10)
      const imageUrl = random(30)
      const searchPattern = '^LGTM$\n^lgtm$'
      mocked(getInput).mockImplementation(
        createMockedGetInput(token, imageUrl, searchPattern)
      )

      // Act
      const params = getInputParams()

      // Assert
      expect(params.token).toBe(token)
      expect(params.imageUrl).toBe(imageUrl)
      expect(params.searchPattern).toStrictEqual([/^LGTM$/m, /^lgtm$/m])
    })
    test('returns default if searchPattern is not set', () => {
      // Arrange
      const token = random(10)
      const imageUrl = random(30)
      mocked(getInput).mockImplementation(createMockedGetInput(token, imageUrl))

      // Act
      const params = getInputParams()

      // Assert
      expect(params.token).toBe(token)
      expect(params.imageUrl).toBe(imageUrl)
      expect(params.searchPattern).toStrictEqual([/^(lgtm|LGTM)$/m])
    })
    test('uses all input parameters defined action.yml', async () => {
      // Arrange
      // Load action.yml settings
      const yamlText = await readFileAsync(
        pathJoin(__dirname, '..', 'action.yml'),
        'utf8'
      )
      const actionSettings = yamlLoad(yamlText) as {
        inputs: Record<string, { required?: boolean }>
      }
      const expectedInputs = Object.entries(
        actionSettings.inputs
      ).map(([key, { required }]) => [key, required ? { required } : undefined])
      mocked(getInput).mockReturnValue('1\n2\n3')

      // Act
      getInputParams()

      // Assert
      expect(getInput).toHaveBeenCalledTimes(expectedInputs.length)
      for (const [key, value] of expectedInputs) {
        expect(getInput).toHaveBeenCalledWith(key, value)
      }
    })
  })
})

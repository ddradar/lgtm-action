import { getInput } from '@actions/core'
import { readFile } from 'fs'
import { safeLoad as yamlLoad } from 'js-yaml'
import { join as pathJoin } from 'path'
import { mocked } from 'ts-jest/utils'
import { promisify } from 'util'

import { getGithubStatus, getInputParams } from '../src/input-helper'
import EnvProvider from './env-provider'
import { generateRandomString } from './util'

const readFileAsync = promisify(readFile)
jest.mock('@actions/core')

describe('input-helper.ts', () => {
  describe('getGithubStatus()', () => {
    const envProvider = new EnvProvider(
      'GITHUB_EVENT_NAME',
      'GITHUB_REPOSITORY'
    )
    beforeEach(() => {
      jest.resetModules()
      envProvider.load()
    })
    afterEach(() => envProvider.reset())
    test('throws error if "GITHUB_EVENT_NAME" is not set', () => {
      // Arrange
      process.env.GITHUB_EVENT_NAME = undefined
      process.env.GITHUB_REPOSITORY = 'owner/repo'
      // Assert & Act
      expect(() => getGithubStatus()).toThrowError(/GITHUB_EVENT_NAME/)
    })
    test('throws error if "GITHUB_REPOSITORY" is not set', () => {
      // Arrange
      process.env.GITHUB_EVENT_NAME = 'event_name'
      process.env.GITHUB_REPOSITORY = undefined
      // Assert & Act
      expect(() => getGithubStatus()).toThrowError(/GITHUB_REPOSITORY/)
    })
    test('throws error if "GITHUB_REPOSITORY" is not owner/name', () => {
      // Arrange
      process.env.GITHUB_EVENT_NAME = 'event_name'
      process.env.GITHUB_REPOSITORY = 'foo'
      // Assert & Act
      expect(() => getGithubStatus()).toThrowError(/GITHUB_REPOSITORY/)
    })
    test('returns same value as environment variable', () => {
      const random = (): string => generateRandomString(8)
      // Arrange
      const eventName = random()
      const repository = `${random()}/${random()}`
      process.env.GITHUB_EVENT_NAME = eventName
      process.env.GITHUB_REPOSITORY = repository
      // Assert
      const githubStatus = getGithubStatus()
      // Act
      expect(githubStatus.eventName).toBe(eventName)
      expect(githubStatus.repository).toBe(repository)
    })
  })
  describe('getInputParams()', () => {
    test('returns getInput() values', () => {
      // Arrange
      const token = generateRandomString(10)
      const imageUrl = generateRandomString(30)
      const searchPattern = '^LGTM$\n^lgtm$'
      mocked(getInput).mockImplementation((name) =>
        name === 'token'
          ? token
          : name === 'image-url'
          ? imageUrl
          : name === 'search-pattern'
          ? searchPattern
          : ''
      )

      // Act
      const params = getInputParams()

      // Arrange
      expect(params.token).toBe(token)
      expect(params.imageUrl).toBe(imageUrl)
      expect(params.searchPattern).toStrictEqual([/^LGTM$/m, /^lgtm$/m])
    })
    test('returns default if searchPattern is not set', () => {
      // Arrange
      const token = generateRandomString(10)
      const imageUrl = generateRandomString(30)
      mocked(getInput).mockImplementation((name) =>
        name === 'token' ? token : name === 'image-url' ? imageUrl : ''
      )

      // Act
      const params = getInputParams()

      // Arrange
      expect(params.token).toBe(token)
      expect(params.imageUrl).toBe(imageUrl)
      expect(params.searchPattern).toStrictEqual([/^(lgtm|LGTM)$/m])
    })
    test('uses all input parameters', async () => {
      // Arrange
      // Load action.yml settings
      const yamlText = await readFileAsync(
        pathJoin(__dirname, '..', 'action.yml'),
        'utf8'
      )
      const actionSettings = yamlLoad(yamlText)
      const expectedInputs = Object.keys(actionSettings.inputs)

      // Act
      getInputParams()

      // Assert
      expect(getInput).toHaveBeenCalledTimes(expectedInputs.length)
      for (const key of expectedInputs) {
        if (actionSettings.inputs[key].required) {
          expect(getInput).toHaveBeenCalledWith(key, { required: true })
        } else {
          expect(getInput).toHaveBeenCalledWith(key)
        }
      }
    })
  })
})

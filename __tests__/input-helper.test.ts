import { getInput } from '@actions/core'
import { readFileSync } from 'fs'
import { load as yamlLoad } from 'js-yaml'
import { join as pathJoin } from 'path'
import { mocked } from 'ts-jest/utils'

import { getInputParams } from '../src/input-helper'
import { generateRandomString as random } from './util'

jest.mock('@actions/core')

describe('input-helper.ts', () => {
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
    beforeEach(() => mocked(getInput).mockReset())

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
    test('uses all input parameters defined by action.yml', () => {
      // Arrange
      // Load action.yml settings
      const path = pathJoin(__dirname, '..', 'action.yml')
      const yamlText = readFileSync(path, 'utf8')
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

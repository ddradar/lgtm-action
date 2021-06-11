import { getInput, getMultilineInput } from '@actions/core'
import { mocked } from 'ts-jest/utils'

import { getInputParams } from '../src/input-helper'
import { generateRandomString as random } from './util'

jest.mock('@actions/core')

describe('input-helper.ts', () => {
  describe('getInputParams()', () => {
    const createMockedGetInput =
      (token: string, imageUrl: string) =>
      (name: string): string =>
        name === 'token' ? token : name === 'image-url' ? imageUrl : ''
    beforeEach(() => {
      mocked(getInput).mockReset()
      mocked(getMultilineInput).mockReset()
    })

    test('returns getInput() values', () => {
      // Arrange
      const token = random(10)
      const imageUrl = random(30)
      mocked(getInput).mockImplementation(createMockedGetInput(token, imageUrl))
      mocked(getMultilineInput).mockReturnValue(['^LGTM$', '^lgtm$'])

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
      mocked(getMultilineInput).mockReturnValue([])

      // Act
      const params = getInputParams()

      // Assert
      expect(params.token).toBe(token)
      expect(params.imageUrl).toBe(imageUrl)
      expect(params.searchPattern).toStrictEqual([/^(lgtm|LGTM)$/m])
    })
  })
})

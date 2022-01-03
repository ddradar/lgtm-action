import { getInput, getMultilineInput } from '@actions/core'

import { getInputParams } from '../src/input-helper'
import { generateRandomString as random } from './util'

jest.mock('@actions/core')

describe('input-helper.ts', () => {
  describe('getInputParams()', () => {
    const mockGetInput = (token: string, imageUrl: string) =>
      jest
        .mocked(getInput)
        .mockImplementation((name) =>
          name === 'token' ? token : name === 'image-url' ? imageUrl : ''
        )
    beforeEach(() => {
      jest.mocked(getInput).mockReset()
      jest.mocked(getMultilineInput).mockReset()
    })

    test('returns getInput() values', () => {
      // Arrange
      const token = random(10)
      const imageUrl = random(30)
      mockGetInput(token, imageUrl)
      jest.mocked(getMultilineInput).mockReturnValue(['^LGTM$', '^lgtm$'])

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
      mockGetInput(token, imageUrl)
      jest.mocked(getMultilineInput).mockReturnValue([])

      // Act
      const params = getInputParams()

      // Assert
      expect(params.token).toBe(token)
      expect(params.imageUrl).toBe(imageUrl)
      expect(params.searchPattern).toStrictEqual([/^(lgtm|LGTM)$/m])
    })
  })
})

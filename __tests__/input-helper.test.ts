import { getInput } from '@actions/core'
import { readFile } from 'fs'
import { safeLoad as yamlLoad } from 'js-yaml'
import { join as pathJoin } from 'path'
import { mocked } from 'ts-jest/utils'
import { promisify } from 'util'

import { getInputParams } from '../src/input-helper'
import { generateRandomString } from './util'

const readFileAsync = promisify(readFile)
jest.mock('@actions/core')

describe('input-helper.ts', () => {
  describe('getInputParams()', () => {
    test('returns getInput() values', () => {
      // Arrange
      const token = generateRandomString(10)
      const imageUrl = generateRandomString(30)
      mocked(getInput).mockImplementation((name) =>
        name === 'token'
          ? token
          : name === 'image-url'
          ? imageUrl
          : generateRandomString(10)
      )

      // Act
      const params = getInputParams()

      // Arrange
      expect(params.token).toBe(token)
      expect(params.imageUrl).toBe(imageUrl)
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

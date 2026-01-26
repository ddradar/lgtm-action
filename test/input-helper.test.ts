import type { TestContext } from 'node:test'
import { before, beforeEach, mock, suite, test } from 'node:test'

import type { getInput, getMultilineInput } from '@actions/core'

import { generateRandomString } from './util.ts'

await suite('input-helper.ts', async () => {
  let getInputParams: typeof import('../src/input-helper.ts').getInputParams

  // Mocks
  const getInputMock = mock.fn<typeof getInput>()
  const getMultilineInputMock = mock.fn<typeof getMultilineInput>()

  before(async () => {
    mock.module('@actions/core', {
      namedExports: {
        getInput: getInputMock,
        getMultilineInput: getMultilineInputMock,
      },
    })

    getInputParams = (await import('../src/input-helper.ts')).getInputParams
  })

  await suite('getInputParams()', async () => {
    const mockGetInput = (token: string, imageUrl: string) =>
      getInputMock.mock.mockImplementation((name) =>
        name === 'token' ? token : name === 'image-url' ? imageUrl : ''
      )
    beforeEach(() => {
      getInputMock.mock.resetCalls()
      getMultilineInputMock.mock.resetCalls()
    })

    await test('returns getInput() values', (t: TestContext) => {
      // Arrange
      const token = generateRandomString(10)
      const imageUrl = generateRandomString(30)
      mockGetInput(token, imageUrl)
      getMultilineInputMock.mock.mockImplementation(() => ['^LGTM$', '^lgtm$'])

      // Act
      const params = getInputParams()

      // Assert
      t.assert.strictEqual(params.token, token)
      t.assert.strictEqual(params.imageUrl, imageUrl)
      t.assert.deepEqual(params.searchPattern, [/^LGTM$/m, /^lgtm$/m])
    })
    await test('returns default if searchPattern is not set', (t: TestContext) => {
      // Arrange
      const token = generateRandomString(10)
      const imageUrl = generateRandomString(30)
      mockGetInput(token, imageUrl)
      getMultilineInputMock.mock.mockImplementation(() => [])

      // Act
      const params = getInputParams()

      // Assert
      t.assert.strictEqual(params.token, token)
      t.assert.strictEqual(params.imageUrl, imageUrl)
      t.assert.deepEqual(params.searchPattern, [/^(lgtm|LGTM)$/m])
    })
  })
})

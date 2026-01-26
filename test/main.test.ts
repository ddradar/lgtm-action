import type { TestContext } from 'node:test'
import { before, beforeEach, mock, suite, test } from 'node:test'

import type { debug, info, setFailed, warning } from '@actions/core'

import { getEventWebhook, isSupportedEvent } from '../src/event.ts'
import type { getInputParams } from '../src/input-helper.ts'
import type { sendCommentAsync } from '../src/send-comment.ts'

await suite('main.ts', async () => {
  let run: typeof import('../src/main.ts').run

  // Mocks
  const searchPattern = [/^(lgtm|LGTM)$/m]
  const debugMock = mock.fn<typeof debug>()
  const infoMock = mock.fn<typeof info>()
  const warningMock = mock.fn<typeof warning>()
  const setFailedMock = mock.fn<typeof setFailed>()
  const isSupportedEventMock = mock.fn<typeof isSupportedEvent>(
    (_): _ is 'issue_comment' | 'pull_request_review' => true
  )
  const getEventWebhookMock = mock.fn<typeof getEventWebhook>()
  const getInputParamsMock = mock.fn<typeof getInputParams>(() => ({
    token: 'token',
    imageUrl: 'imageUrl',
    searchPattern,
  }))
  const sendCommentAsyncMock = mock.fn<typeof sendCommentAsync>()

  before(async () => {
    mock.module('@actions/core', {
      namedExports: {
        debug: debugMock,
        info: infoMock,
        warning: warningMock,
        setFailed: setFailedMock,
      },
    })
    mock.module('@actions/github', {
      namedExports: {
        context: {
          eventName: 'event_name',
          repo: { owner: 'owner', repo: 'repo' },
        },
      },
    })
    mock.module('../src/event.ts', {
      namedExports: {
        isSupportedEvent: isSupportedEventMock,
        getEventWebhook: getEventWebhookMock,
      },
    })
    mock.module('../src/input-helper.ts', {
      namedExports: { getInputParams: getInputParamsMock },
    })
    mock.module('../src/send-comment.ts', {
      namedExports: { sendCommentAsync: sendCommentAsyncMock },
    })

    run = (await import('../src/main.ts')).run
  })

  await suite('run()', async () => {
    const issueNumber = 1
    beforeEach(() => {
      debugMock.mock.resetCalls()
      infoMock.mock.resetCalls()
      warningMock.mock.resetCalls()
      setFailedMock.mock.resetCalls()
      getInputParamsMock.mock.resetCalls()
      getEventWebhookMock.mock.resetCalls()
      sendCommentAsyncMock.mock.resetCalls()
    })

    await test('ends with warning if isSupportedEvent() is false', async (t: TestContext) => {
      // Arrange
      isSupportedEventMock.mock.mockImplementationOnce(
        (_): _ is 'issue_comment' | 'pull_request_review' => false
      )

      // Act
      await run()

      // Assert
      t.assert.strictEqual(warningMock.mock.callCount(), 1)
      t.assert.strictEqual(getInputParamsMock.mock.callCount(), 0)
      t.assert.strictEqual(setFailedMock.mock.callCount(), 0)
      t.assert.strictEqual(sendCommentAsyncMock.mock.callCount(), 0)
    })

    const nullOrEmptyCases: (string | null)[] = [null, '']
    for (const comment of nullOrEmptyCases) {
      await test(`never calls sendCommentAsync if comment is "${comment}"`, async (t: TestContext) => {
        // Arrange
        getEventWebhookMock.mock.mockImplementationOnce(() => ({
          comment,
          issueNumber,
        }))

        // Act
        await run()

        // Assert
        t.assert.strictEqual(getInputParamsMock.mock.callCount(), 1)
        t.assert.strictEqual(infoMock.mock.callCount(), 1)
        t.assert.strictEqual(
          infoMock.mock.calls[0].arguments[0],
          'Comment is null or empty.'
        )
        t.assert.strictEqual(setFailedMock.mock.callCount(), 0)
        t.assert.strictEqual(sendCommentAsyncMock.mock.callCount(), 0)
      })
    }

    const notMatchCases = ['foo', 'not lgtm']
    for (const comment of notMatchCases) {
      await test(`never calls sendCommentAsync if comment does not match pattern: "${comment}"`, async (t: TestContext) => {
        // Arrange
        t.assert.doesNotMatch(comment, searchPattern[0])
        getEventWebhookMock.mock.mockImplementationOnce(() => ({
          comment,
          issueNumber,
        }))

        // Act
        await run()

        // Assert
        t.assert.strictEqual(getInputParamsMock.mock.callCount(), 1)
        t.assert.strictEqual(infoMock.mock.callCount(), 1)
        t.assert.strictEqual(
          infoMock.mock.calls[0].arguments[0],
          'Comment does not match pattern.'
        )
        t.assert.strictEqual(setFailedMock.mock.callCount(), 0)
        t.assert.strictEqual(sendCommentAsyncMock.mock.callCount(), 0)
      })
    }

    const matchCases = ['LGTM', 'lgtm', 'this is multi-line\nlgtm']
    for (const comment of matchCases) {
      await test(`calls sendCommentAsync if comment is "${comment}"`, async (t: TestContext) => {
        // Arrange
        t.assert.match(comment, searchPattern[0])
        getEventWebhookMock.mock.mockImplementationOnce(() => ({
          comment,
          issueNumber,
        }))

        // Act
        await run()

        // Assert
        t.assert.strictEqual(getInputParamsMock.mock.callCount(), 1)
        t.assert.strictEqual(
          infoMock.mock.calls[0].arguments[0],
          `Comment matches pattern: ${searchPattern[0]}`
        )
        t.assert.strictEqual(setFailedMock.mock.callCount(), 0)
        t.assert.strictEqual(sendCommentAsyncMock.mock.callCount(), 1)
        t.assert.deepEqual(sendCommentAsyncMock.mock.calls[0].arguments, [
          'token',
          'owner',
          'repo',
          1,
          '![LGTM](imageUrl)',
        ])
      })
    }

    const errors = [new Error('Some error'), 'Some error string']
    for (const error of errors) {
      await test(`calls core.setFailed() when throws "${error}"`, async (t: TestContext) => {
        // Arrange
        getInputParamsMock.mock.mockImplementationOnce(() => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw error
        })

        // Act
        await run()

        // Assert
        t.assert.strictEqual(getEventWebhookMock.mock.callCount(), 0)
        t.assert.strictEqual(sendCommentAsyncMock.mock.callCount(), 0)
        t.assert.strictEqual(setFailedMock.mock.callCount(), 1)
        t.assert.strictEqual(setFailedMock.mock.calls[0].arguments[0], error)
      })
    }
  })
})

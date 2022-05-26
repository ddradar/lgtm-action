import { info, setFailed, warning } from '@actions/core'
import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { getEventWebhook, isSupportedEvent } from '../src/event'
import { getInputParams } from '../src/input-helper'
import { run } from '../src/main'
import { sendCommentAsync } from '../src/send-comment'

jest.mock('@actions/core')
jest.mock('@actions/github', () => ({
  context: {
    eventName: 'event_name',
    repo: { owner: 'owner', repo: 'repo' }
  }
}))
jest.mock('../src/event')
jest.mock('../src/input-helper')
jest.mock('../src/send-comment')

describe('main.ts', () => {
  describe('run()', () => {
    beforeEach(() => {
      jest.mocked(getInputParams).mockReturnValue({
        token: 'token',
        imageUrl: 'imageUrl',
        searchPattern: [/^(lgtm|LGTM)$/m]
      })
    })

    test('ends with warning if isSupportedEvent() is false', async () => {
      // Arrange
      jest.mocked(isSupportedEvent).mockReturnValue(false)

      // Act
      await run()

      // Assert
      expect(warning).toHaveBeenCalledTimes(1)
      expect(getInputParams).not.toHaveBeenCalled()
      expect(setFailed).not.toHaveBeenCalled()
      expect(sendCommentAsync).not.toHaveBeenCalled()
    })

    test('ends with Failed if error', async () => {
      // Arrange
      const error = new Error()
      jest.mocked(isSupportedEvent).mockReturnValue(true)
      jest.mocked(getInputParams).mockImplementation(() => {
        throw error
      })

      // Act
      await run()

      // Assert
      expect(warning).not.toHaveBeenCalled()
      expect(getInputParams).toHaveBeenCalled()
      expect(setFailed).toHaveBeenCalledWith(error)
      expect(sendCommentAsync).not.toHaveBeenCalled()
    })

    test.each([null, ''])(
      'never calls sendCommentAsync if comment is "%s"',
      async (comment) => {
        // Arrange
        jest.mocked(isSupportedEvent).mockReturnValue(true)
        jest
          .mocked(getEventWebhook)
          .mockReturnValue({ comment, issueNumber: 1 })
        // Act
        await run()
        // Assert
        expect(getInputParams).toHaveBeenCalledTimes(1)
        expect(info).toHaveBeenCalledTimes(1)
        expect(info).toHaveBeenCalledWith('Comment is null or empty.')
        expect(setFailed).not.toHaveBeenCalled()
        expect(sendCommentAsync).not.toHaveBeenCalled()
      }
    )
    test.each(['foo', 'not lgtm'])(
      'never calls sendCommentAsync if comment does not match pattern.',
      async (comment) => {
        // Arrange
        jest.mocked(isSupportedEvent).mockReturnValue(true)
        jest
          .mocked(getEventWebhook)
          .mockReturnValue({ comment, issueNumber: 1 })
        // Act
        await run()
        // Assert
        expect(getInputParams).toHaveBeenCalledTimes(1)
        expect(info).toHaveBeenCalledTimes(1)
        expect(info).toHaveBeenCalledWith('Comment does not match pattern.')
        expect(setFailed).not.toHaveBeenCalled()
        expect(sendCommentAsync).not.toHaveBeenCalled()
      }
    )
    test.each(['LGTM', 'lgtm', 'this is multi-line\nlgtm'])(
      'calls sendCommentAsync if comment is "%s"',
      async (comment) => {
        // Arrange
        jest.mocked(isSupportedEvent).mockReturnValue(true)
        jest
          .mocked(getEventWebhook)
          .mockReturnValue({ comment, issueNumber: 1 })
        // Act
        await run()
        // Assert
        expect(getInputParams).toHaveBeenCalledTimes(1)
        expect(info).toHaveBeenCalledWith(
          'Comment matches pattern: /^(lgtm|LGTM)$/m'
        )
        expect(setFailed).not.toHaveBeenCalled()
        expect(sendCommentAsync).toHaveBeenCalledTimes(1)
        expect(sendCommentAsync).toHaveBeenCalledWith(
          'token',
          'owner',
          'repo',
          1,
          '![LGTM](imageUrl)'
        )
      }
    )
  })
})

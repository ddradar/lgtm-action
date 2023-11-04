import { info, setFailed, warning } from '@actions/core'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { getEventWebhook, isSupportedEvent } from '../src/event.js'
import { getInputParams } from '../src/input-helper.js'
import { run } from '../src/main.js'
import { sendCommentAsync } from '../src/send-comment.js'

vi.mock('@actions/core')
vi.mock('@actions/github', () => ({
  context: {
    eventName: 'event_name',
    repo: { owner: 'owner', repo: 'repo' }
  }
}))
vi.mock('../src/event')
vi.mock('../src/input-helper')
vi.mock('../src/send-comment')

describe('main.ts', () => {
  describe('run()', () => {
    beforeEach(() => {
      vi.mocked(info).mockClear()
      vi.mocked(warning).mockClear()
      vi.mocked(setFailed).mockClear()

      vi.mocked(getInputParams).mockClear()
      vi.mocked(getInputParams).mockReturnValue({
        token: 'token',
        imageUrl: 'imageUrl',
        searchPattern: [/^(lgtm|LGTM)$/m]
      })
    })

    test('ends with warning if isSupportedEvent() is false', async () => {
      // Arrange
      vi.mocked(isSupportedEvent).mockReturnValue(false)

      // Act
      await run()

      // Assert
      expect(warning).toHaveBeenCalledTimes(1)
      expect(getInputParams).not.toHaveBeenCalled()
      expect(setFailed).not.toHaveBeenCalled()
      expect(sendCommentAsync).not.toHaveBeenCalled()
    })

    test.each([null, ''])(
      'never calls sendCommentAsync if comment is "%s"',
      async (comment) => {
        // Arrange
        vi.mocked(isSupportedEvent).mockReturnValue(true)
        vi.mocked(getEventWebhook).mockReturnValue({ comment, issueNumber: 1 })

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
        vi.mocked(isSupportedEvent).mockReturnValue(true)
        vi.mocked(getEventWebhook).mockReturnValue({ comment, issueNumber: 1 })
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
        vi.mocked(sendCommentAsync).mockClear()
        vi.mocked(isSupportedEvent).mockReturnValue(true)
        vi.mocked(getEventWebhook).mockReturnValue({ comment, issueNumber: 1 })

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

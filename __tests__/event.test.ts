import { readFileSync } from 'fs'
import { mocked } from 'ts-jest/utils'

import { getEventWebhook, isSupportedEvent } from '../src/event'
import EnvProvider from './env-provider'

jest.mock('fs')

describe('event.ts', () => {
  describe('isSupportedEvent()', () => {
    test.each(['issue_comment', 'pull_request_review'])(
      'returns true if eventName is "%s"',
      (eventName) => {
        // Act
        const result = isSupportedEvent(eventName)

        // Assert
        expect(result).toBe(true)
      }
    )
    test.each([undefined, null, '', 'foo'])(
      'returns false if eventName is "%s"',
      (eventName) => {
        // Act
        const result = isSupportedEvent(eventName)

        // Assert
        expect(result).toBe(false)
      }
    )
  })
  describe('getEventWebhookAsync()', () => {
    const mockedFs = mocked(readFileSync)
    const envProvider = new EnvProvider('GITHUB_EVENT_PATH')
    const mockJsonData = {
      comment: {
        body: 'comment.body'
      },
      issue: {
        number: 9
      },
      review: {
        body: 'review.body'
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      pull_request: {
        number: 10
      }
    }

    beforeEach(() => {
      jest.resetModules()

      envProvider.load()

      mockedFs.mockReset()
      mockedFs.mockImplementation(() => JSON.stringify(mockJsonData))
    })
    afterEach(() => envProvider.reset())

    test('throws Error if GITHUB_EVENT_PATH not set', async () => {
      // Act & Assert
      expect(() => getEventWebhook('issue_comment')).toThrow(
        /GITHUB_EVENT_PATH/
      )
    })
    test('returns issue number & comment if "issue_comment" event', async () => {
      // Arrange
      process.env.GITHUB_EVENT_PATH = 'foo'
      // Act
      const webhook = getEventWebhook('issue_comment')
      // Assert
      expect(webhook).toStrictEqual({
        comment: mockJsonData.comment.body,
        issueNumber: mockJsonData.issue.number
      })
    })
    test('returns pull request number & review comment if "pull_request_review" event', async () => {
      // Arrange
      process.env.GITHUB_EVENT_PATH = 'foo'
      // Act
      const webhook = getEventWebhook('pull_request_review')
      // Assert
      expect(webhook).toStrictEqual({
        comment: mockJsonData.review.body,
        issueNumber: mockJsonData.pull_request.number
      })
    })
  })
})

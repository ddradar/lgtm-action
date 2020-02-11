import { readFileSync } from 'fs'
import { mocked } from 'ts-jest/utils'

import { getEventWebhook, isSupportedEvent } from '../src/event'

jest.mock('fs')
const mockedFs = mocked(readFileSync)

describe('event.ts', () => {
  const oldEnv = process.env
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
    // clear cache
    jest.resetModules()

    // load process.env except used for testing
    process.env = { ...oldEnv }
    const keys = ['GITHUB_EVENT_PATH']
    keys.forEach((key) => delete process.env[key])

    mockedFs.mockReset()
    mockedFs.mockImplementation(() => JSON.stringify(mockJsonData))
  })

  describe('isSupportedEvent()', () => {
    test.each(['issue_comment', 'pull_request_review'])(
      'returns true if supported event',
      (eventName) => {
        // Act
        const result = isSupportedEvent(eventName)

        // Assert
        expect(result).toBe(true)
      }
    )
    test.each([undefined, null, '', 'foo'])(
      'returns false if not supported event',
      (eventName) => {
        // Act
        const result = isSupportedEvent(eventName)

        // Assert
        expect(result).toBe(false)
      }
    )
  })
  describe('getEventWebhookAsync()', () => {
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

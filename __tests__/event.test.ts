import { mocked } from 'ts-jest/utils'

import { getEventWebhook, isSupportedEvent } from '../src/event'
import { readFileAsync } from '../src/node-helper'

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
jest.mock('../src/node-helper')
mocked(readFileAsync).mockResolvedValue(JSON.stringify(mockJsonData))

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
    test('returns issue number & comment if "issue_comment" event', async () => {
      // Arrange
      // Act
      const webhook = await getEventWebhook('issue_comment')
      // Assert
      expect(webhook).toStrictEqual({
        comment: mockJsonData.comment.body,
        issueNumber: mockJsonData.issue.number
      })
    })
    test('returns pull request number & review comment if "pull_request_review" event', async () => {
      // Arrange
      // Act
      const webhook = await getEventWebhook('pull_request_review')
      // Assert
      expect(webhook).toStrictEqual({
        comment: mockJsonData.review.body,
        issueNumber: mockJsonData.pull_request.number
      })
    })
  })
})

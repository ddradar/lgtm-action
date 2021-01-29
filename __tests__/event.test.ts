import { mocked } from 'ts-jest/utils'

import { getEventWebhook, isSupportedEvent } from '../src/event'
import { readFileAsync } from '../src/node-helper'

jest.mock('../src/node-helper')

describe('event.ts', () => {
  describe('isSupportedEvent', () => {
    test.each(['issue_comment', 'pull_request_review'])(
      '("%s") returns true',
      (eventName) => expect(isSupportedEvent(eventName)).toBe(true)
    )
    test.each(['', 'foo'])('("%s") returns false', (eventName) =>
      expect(isSupportedEvent(eventName)).toBe(false)
    )
  })

  describe('getEventWebhookAsync', () => {
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
      pull_request: {
        number: 10
      }
    }
    beforeAll(() =>
      mocked(readFileAsync).mockResolvedValue(JSON.stringify(mockJsonData))
    )

    test('("issue_comment") returns issue number & comment', async () => {
      // Arrange - Act
      const webhook = await getEventWebhook('issue_comment')
      // Assert
      expect(webhook).toStrictEqual({
        comment: mockJsonData.comment.body,
        issueNumber: mockJsonData.issue.number
      })
    })
    test('("pull_request_review") returns pull request number & review comment', async () => {
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

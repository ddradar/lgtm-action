import { describe, expect, test, vi } from 'vitest'

import { getEventWebhook, isSupportedEvent } from '../src/event.js'

vi.mock('@actions/github', () => ({
  context: {
    payload: {
      comment: { body: 'comment.body' },
      issue: { number: 9 },
      review: { body: 'review.body' },
      pull_request: { number: 10 },
    },
  },
}))

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

  describe('getEventWebhook', () => {
    test('("issue_comment") returns issue number & comment', () => {
      // Arrange - Act
      const webhook = getEventWebhook('issue_comment')
      // Assert
      expect(webhook).toStrictEqual({ comment: 'comment.body', issueNumber: 9 })
    })
    test('("pull_request_review") returns pull request number & review comment', () => {
      // Arrange - Act
      const webhook = getEventWebhook('pull_request_review')
      // Assert
      expect(webhook).toStrictEqual({ comment: 'review.body', issueNumber: 10 })
    })
  })
})

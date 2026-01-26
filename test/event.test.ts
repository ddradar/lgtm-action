import type { TestContext } from 'node:test'
import { before, mock, suite, test } from 'node:test'

import type { context } from '@actions/github'

await suite('event.ts', async () => {
  let isSupportedEvent: typeof import('../src/event.ts').isSupportedEvent
  let getEventWebhook: typeof import('../src/event.ts').getEventWebhook

  const payload = {
    comment: { body: 'comment.body' },
    issue: { number: 9 },
    review: { body: 'review.body' },
    pull_request: { number: 10 },
  }

  before(async () => {
    mock.module('@actions/github', {
      namedExports: {
        context: { payload } as unknown as typeof context,
      },
    })

    const eventModule = await import('../src/event.ts')
    isSupportedEvent = eventModule.isSupportedEvent
    getEventWebhook = eventModule.getEventWebhook
  })

  await suite('isSupportedEvent', async () => {
    const testCases: [string, boolean][] = [
      ['issue_comment', true],
      ['pull_request_review', true],
      ['', false],
      ['foo', false],
    ]
    for (const [eventName, expected] of testCases) {
      await test(`("${eventName}") returns ${expected}`, (t: TestContext) => {
        t.assert.strictEqual(isSupportedEvent(eventName), expected)
      })
    }
  })

  await suite('getEventWebhook', async () => {
    await test('("issue_comment") returns issue number & comment', (t: TestContext) => {
      // Arrange - Act
      const webhook = getEventWebhook('issue_comment')
      // Assert
      t.assert.deepEqual(webhook, {
        comment: payload.comment.body,
        issueNumber: payload.issue.number,
      })
    })

    await test('("pull_request_review") returns pull request number & review comment', (t: TestContext) => {
      // Arrange - Act
      const webhook = getEventWebhook('pull_request_review')
      // Assert
      t.assert.deepEqual(webhook, {
        comment: payload.review.body,
        issueNumber: payload.pull_request.number,
      })
    })
  })
})

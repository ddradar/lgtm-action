import type { TestContext } from 'node:test'
import { before, beforeEach, mock, suite, test } from 'node:test'

import type { getOctokit } from '@actions/github'

import { generateRandomString } from './util.ts'

await suite('send-comment.ts', async () => {
  let sendCommentAsync: typeof import('../src/send-comment.ts').sendCommentAsync

  // Mocks
  const createCommentMock =
    mock.fn<ReturnType<typeof getOctokit>['rest']['issues']['createComment']>()
  const getOctokitMock = mock.fn<typeof getOctokit>(
    () =>
      ({
        rest: { issues: { createComment: createCommentMock } },
      }) as unknown as ReturnType<typeof getOctokit>
  )

  before(async () => {
    mock.module('@actions/github', {
      namedExports: { getOctokit: getOctokitMock },
    })
    sendCommentAsync = (await import('../src/send-comment.ts')).sendCommentAsync
  })

  beforeEach(() => {
    getOctokitMock.mock.resetCalls()
    createCommentMock.mock.resetCalls()
  })

  await suite('sendCommentAsync', async () => {
    await test('calls Octokit.issues.createComment', async (t: TestContext) => {
      // Arrange
      const token = generateRandomString(30)
      const owner = generateRandomString(5)
      const repo = generateRandomString(5)
      const issueNumber = Math.random()
      const comment = generateRandomString(30)

      // Act
      await sendCommentAsync(token, owner, repo, issueNumber, comment)

      // Assert
      t.assert.strictEqual(getOctokitMock.mock.callCount(), 1)
      t.assert.strictEqual(getOctokitMock.mock.calls[0].arguments[0], token)
      t.assert.strictEqual(createCommentMock.mock.callCount(), 1)
      t.assert.deepEqual(createCommentMock.mock.calls[0].arguments, [
        { owner, repo, issue_number: issueNumber, body: comment },
      ])
    })
  })
})

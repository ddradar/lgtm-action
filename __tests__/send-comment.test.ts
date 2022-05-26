import { getOctokit } from '@actions/github'
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test
} from '@jest/globals'

import { sendCommentAsync } from '../src/send-comment'
import { generateRandomString } from './util'

jest.mock('@actions/github')

describe('send-comment.ts', () => {
  beforeAll(() => {
    jest.mocked(getOctokit).mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mock
      { rest: { issues: { createComment: jest.fn() } } } as any
    )
  })
  beforeEach(() => {
    jest.mocked(getOctokit).mockClear()
  })

  describe('sendCommentAsync', () => {
    test('calls Octokit.issues.createComment', async () => {
      // Arrange
      const token = generateRandomString(30)
      const owner = generateRandomString(5)
      const repo = generateRandomString(5)
      const issueNumber = Math.random()
      const comment = generateRandomString(30)

      // Act
      await sendCommentAsync(token, owner, repo, issueNumber, comment)

      // Assert
      expect(jest.mocked(getOctokit)).toHaveBeenCalledTimes(1)
      expect(jest.mocked(getOctokit)).toHaveBeenCalledWith(token)
      const octokit = jest.mocked(getOctokit).mock.results[0]
        ?.value as ReturnType<typeof getOctokit>
      expect(octokit.rest.issues.createComment).toHaveBeenCalledTimes(1)
      expect(octokit.rest.issues.createComment).toHaveBeenCalledWith({
        owner,
        repo,
        issue_number: issueNumber,
        body: comment
      })
    })
  })
})

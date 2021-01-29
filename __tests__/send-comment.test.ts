import { Octokit } from '@octokit/rest'
import { mocked } from 'ts-jest/utils'

import { sendCommentAsync } from '../src/send-comment'
import { generateRandomString } from './util'

jest.mock('@octokit/rest')

describe('send-comment.ts', () => {
  beforeAll(() =>
    mocked(Octokit).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mock
      () => ({ issues: { createComment: jest.fn() } } as any)
    )
  )
  beforeEach(() => mocked(Octokit).mockClear())

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
      const mockedInstance = mocked(Octokit).mock.results[0].value as Octokit
      expect(mocked(Octokit)).toHaveBeenCalledTimes(1)
      expect(mocked(Octokit)).toHaveBeenCalledWith({ auth: `token ${token}` })
      expect(mockedInstance.issues.createComment).toHaveBeenCalledTimes(1)
      expect(mockedInstance.issues.createComment).toHaveBeenCalledWith({
        owner,
        repo,
        issue_number: issueNumber,
        body: comment
      })
    })
  })
})

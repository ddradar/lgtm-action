import { Octokit } from '@octokit/rest'
import { sendCommentAsync } from '../src/send-comment'
import { mocked } from 'ts-jest/utils'
import { generateRandomString } from './util'

jest.mock('@octokit/rest')
const mockedOctokit = mocked(Octokit)

describe('send-comment.ts', () => {
  beforeEach(() => {
    mockedOctokit.mockReset()
    mockedOctokit.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => ({ issues: { createComment: jest.fn() } } as any)
    )
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
      const mockedInstance = mockedOctokit.mock.results[0].value as Octokit
      expect(mockedOctokit).toHaveBeenCalledTimes(1)
      expect(mockedOctokit).toHaveBeenCalledWith({ auth: `token ${token}` })
      expect(mockedInstance.issues.createComment).toHaveBeenCalledTimes(1)
      expect(mockedInstance.issues.createComment).toHaveBeenCalledWith({
        owner,
        repo,
        // eslint-disable-next-line @typescript-eslint/camelcase
        issue_number: issueNumber,
        body: comment
      })
    })
  })
})

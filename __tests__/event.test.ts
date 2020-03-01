import { getEventWebhook, isSupportedEvent } from '../src/event'
import EnvProvider from './env-provider'

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
jest.mock('fs', () => ({
  readFile: jest.fn((_path, _opt, cb) => {
    cb(null, JSON.stringify(mockJsonData))
  })
}))

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
    const envProvider = new EnvProvider('GITHUB_EVENT_PATH')
    beforeEach(() => {
      jest.resetModules()
      envProvider.load()
    })
    afterEach(() => envProvider.reset())

    test('throws Error if GITHUB_EVENT_PATH not set', async () => {
      // Act & Assert
      await expect(getEventWebhook('issue_comment')).rejects.toThrow(
        /GITHUB_EVENT_PATH/
      )
    })
    test('returns issue number & comment if "issue_comment" event', async () => {
      // Arrange
      process.env.GITHUB_EVENT_PATH = 'foo'
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
      process.env.GITHUB_EVENT_PATH = 'foo'
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

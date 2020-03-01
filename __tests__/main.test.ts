import * as core from '@actions/core'
import { mocked } from 'ts-jest/utils'

import { getEventWebhook, isSupportedEvent } from '../src/event'
import { getInputParams } from '../src/input-helper'
import { run } from '../src/main'
import { sendCommentAsync } from '../src/send-comment'
import EnvProvider from './env-provider'

jest.mock('@actions/core')
jest.mock('../src/event')
jest.mock('../src/input-helper')
jest.mock('../src/send-comment')

describe('main.ts', () => {
  describe('run()', () => {
    const envProvider = new EnvProvider(
      'GITHUB_EVENT_PATH',
      'GITHUB_REPOSITORY'
    )

    beforeEach(() => {
      jest.resetAllMocks()
      jest.resetModules()

      envProvider.load()

      mocked(getInputParams).mockReturnValue({
        token: 'token',
        imageUrl: 'imageUrl',
        searchPattern: [/^(lgtm|LGTM)$/m]
      })
    })
    afterEach(() => envProvider.reset())

    test('ends with warning if isSupportedEvent() is false', async () => {
      // Arrange
      mocked(isSupportedEvent).mockReturnValue(false)
      // Act
      await run()
      // Assert
      expect(core.warning).toHaveBeenCalledTimes(1)
      expect(getInputParams).not.toHaveBeenCalled()
      expect(core.setFailed).not.toHaveBeenCalled()
      expect(sendCommentAsync).not.toHaveBeenCalled()
    })
    test('fails if GITHUB_REPOSITORY is not set', async () => {
      // Arrange
      mocked(isSupportedEvent).mockReturnValue(true)
      // Act
      await run()
      // Assert
      expect(core.setFailed).toHaveBeenCalledTimes(1)
      expect(getInputParams).not.toHaveBeenCalled()
      expect(sendCommentAsync).not.toHaveBeenCalled()
    })
    test.each([null, '', 'not lgtm'])(
      'never calls sendCommentAsync if comment is "%s"',
      async (comment) => {
        // Arrange
        process.env.GITHUB_EVENT_NAME = 'event_name'
        process.env.GITHUB_REPOSITORY = 'owner/repo'
        mocked(isSupportedEvent).mockReturnValue(true)
        mocked(getEventWebhook).mockResolvedValue({
          comment,
          issueNumber: 1
        })
        // Act
        await run()
        // Assert
        expect(getInputParams).toHaveBeenCalledTimes(1)
        expect(core.info).toHaveBeenCalledTimes(1)
        expect(core.info).toHaveBeenCalledWith(
          'Comment does not match pattern.'
        )
        expect(core.setFailed).not.toHaveBeenCalled()
        expect(sendCommentAsync).not.toHaveBeenCalled()
      }
    )
    test.each(['LGTM', 'lgtm', 'this is multi-line\nlgtm'])(
      'calls sendCommentAsync if comment is "%s"',
      async (comment) => {
        // Arrange
        process.env.GITHUB_REPOSITORY = 'owner/repo'
        mocked(isSupportedEvent).mockReturnValue(true)
        mocked(getEventWebhook).mockResolvedValue({
          comment,
          issueNumber: 1
        })
        // Act
        await run()
        // Assert
        expect(getInputParams).toHaveBeenCalledTimes(1)
        expect(core.info).not.toHaveBeenCalled()
        expect(core.setFailed).not.toHaveBeenCalled()
        expect(sendCommentAsync).toHaveBeenCalledTimes(1)
        expect(sendCommentAsync).toHaveBeenCalledWith(
          'token',
          'owner',
          'repo',
          1,
          '![LGTM](imageUrl)'
        )
      }
    )
  })
})

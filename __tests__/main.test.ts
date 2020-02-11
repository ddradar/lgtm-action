import * as core from '@actions/core'
import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'
import { mocked } from 'ts-jest/utils'

import { getEventWebhook, isSupportedEvent } from '../src/event'
import { run } from '../src/main'
import { sendCommentAsync } from '../src/send-comment'

jest.mock('@actions/core')
jest.mock('../src/event')
jest.mock('../src/send-comment')

describe('main.ts', () => {
  const oldEnv = process.env

  beforeEach(() => {
    jest.resetAllMocks()
    // clear cache
    jest.resetModules()

    // load process.env except used for testing
    process.env = { ...oldEnv }
    const keys = ['GITHUB_EVENT_PATH', 'GITHUB_REPOSITORY']
    keys.forEach((key) => delete process.env[key])

    mocked(core.getInput).mockImplementation((name) => name)
  })

  afterEach(() => {
    // restore process.env
    process.env = oldEnv
  })

  describe('run()', () => {
    test('ends with warning if isSupportedEvent() is false', async () => {
      // Arrange
      mocked(isSupportedEvent).mockReturnValue(false)
      // Act
      await run()
      // Assert
      expect(core.warning).toHaveBeenCalledTimes(1)
      expect(core.getInput).not.toHaveBeenCalled()
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
      expect(core.getInput).not.toHaveBeenCalled()
      expect(sendCommentAsync).not.toHaveBeenCalled()
    })
    test.each([null, '', 'not lgtm'])(
      'never calls sendCommentAsync if comment is not LGTM',
      async (comment) => {
        // Arrange
        process.env.GITHUB_EVENT_NAME = 'event_name'
        process.env.GITHUB_REPOSITORY = 'owner/repo'
        mocked(isSupportedEvent).mockReturnValue(true)
        mocked(getEventWebhook).mockReturnValue({
          comment,
          issueNumber: 1
        })
        // Act
        await run()
        // Assert
        expect(core.getInput).toHaveBeenCalledTimes(2)
        expect(core.info).toHaveBeenCalledTimes(1)
        expect(core.info).toHaveBeenCalledWith('Comment is not LGTM.')
        expect(core.setFailed).not.toHaveBeenCalled()
        expect(sendCommentAsync).not.toHaveBeenCalled()
      }
    )
    test.each(['LGTM', 'lgtm'])(
      'calls sendCommentAsync if comment is LGTM',
      async (comment) => {
        // Arrange
        process.env.GITHUB_REPOSITORY = 'owner/repo'
        mocked(isSupportedEvent).mockReturnValue(true)
        mocked(getEventWebhook).mockReturnValue({
          comment,
          issueNumber: 1
        })
        // Act
        await run()
        // Assert
        expect(core.getInput).toHaveBeenCalledTimes(2)
        expect(core.info).not.toHaveBeenCalled()
        expect(core.setFailed).not.toHaveBeenCalled()
        expect(sendCommentAsync).toHaveBeenCalledTimes(1)
        expect(sendCommentAsync).toHaveBeenCalledWith(
          'token',
          'owner',
          'repo',
          1,
          '![LGTM](image-url)'
        )
      }
    )
    test('uses all input parameters', async () => {
      // Arrange
      process.env.GITHUB_REPOSITORY = 'owner/repo'
      mocked(isSupportedEvent).mockReturnValue(true)
      mocked(getEventWebhook).mockReturnValue({
        comment: 'foo',
        issueNumber: 1
      })
      // Load action.yml settings
      const yamlText = readFileSync(
        path.join(__dirname, '..', 'action.yml'),
        'utf8'
      )
      const actionSettings = yaml.safeLoad(yamlText)
      const expectedInputs = Object.keys(actionSettings.inputs)
      // Act
      await run()
      // Assert
      expect(core.getInput).toHaveBeenCalledTimes(expectedInputs.length)
      for (const key of expectedInputs) {
        if (actionSettings.inputs[key].required) {
          expect(core.getInput).toHaveBeenCalledWith(key, { required: true })
        } else {
          expect(core.getInput).toHaveBeenCalledWith(key)
        }
      }
    })
  })
})

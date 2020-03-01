import * as core from '@actions/core'

import { getEventWebhook, isSupportedEvent } from './event'
import { getInputParams } from './input-helper'
import { sendCommentAsync } from './send-comment'

export async function run(): Promise<void> {
  try {
    const eventName = process.env.GITHUB_EVENT_NAME
    if (!isSupportedEvent(eventName)) {
      core.warning(`Not supported Event: ${eventName}`)
      return
    }
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error(
        'GITHUB_REPOSITORY is not set in an environment variable. This package only works with GitHub Actions.'
      )
    }
    const { token, imageUrl, searchPattern } = getInputParams()
    const repoOwner = process.env.GITHUB_REPOSITORY.split('/')[0]
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]

    const { comment, issueNumber } = await getEventWebhook(eventName)
    if (
      comment === null ||
      !searchPattern.some((regexp) => regexp.test(comment))
    ) {
      core.info('Comment does not match pattern.')
      return
    }

    await sendCommentAsync(
      token,
      repoOwner,
      repoName,
      issueNumber,
      `![LGTM](${imageUrl})`
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

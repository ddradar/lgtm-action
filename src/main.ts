import * as core from '@actions/core'

import { getEventWebhook, isSupportedEvent } from './event'
import { getGithubStatus, getInputParams } from './input-helper'
import { sendCommentAsync } from './send-comment'

/** main entry */
export async function run(): Promise<void> {
  const { eventName, repository } = getGithubStatus()
  if (!isSupportedEvent(eventName)) {
    core.warning(`Not supported Event: ${eventName}`)
    return
  }
  const { token, imageUrl, searchPattern } = getInputParams()
  const repoOwner = repository.split('/')[0]
  const repoName = repository.split('/')[1]

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
}

run().catch((e) => core.setFailed(e.message))

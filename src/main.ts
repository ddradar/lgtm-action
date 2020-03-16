import * as core from '@actions/core'

import { getEventWebhook, isSupportedEvent } from './event'
import { getGithubStatus, getInputParams } from './input-helper'
import { sendCommentAsync } from './send-comment'

/** main entry */
export async function run(): Promise<void> {
  const { eventName, repository } = getGithubStatus()
  core.debug(`status: { eventName: ${eventName}, repository: ${repository} }`)
  if (!isSupportedEvent(eventName)) {
    core.warning(`Not supported Event: ${eventName}`)
    return
  }
  const { token, imageUrl, searchPattern } = getInputParams()
  const repoOwner = repository.split('/')[0]
  const repoName = repository.split('/')[1]

  const { comment, issueNumber } = await getEventWebhook(eventName)
  core.debug(`webhook: { comment: ${comment}, issueNumber: ${issueNumber} }`)
  if (!comment) {
    core.info('Comment is null or empty.')
    return
  }

  for (const regexp of searchPattern) {
    if (regexp.test(comment)) {
      core.info(`Comment matches pattern: ${regexp}`)
      await sendCommentAsync(
        token,
        repoOwner,
        repoName,
        issueNumber,
        `![LGTM](${imageUrl})`
      )
      return
    }
  }

  core.info('Comment does not match pattern.')
}

run().catch((e) => core.setFailed(e.message))

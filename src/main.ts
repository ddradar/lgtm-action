import * as core from '@actions/core'
import { context } from '@actions/github'

import { getEventWebhook, isSupportedEvent } from './event'
import { getInputParams } from './input-helper'
import { sendCommentAsync } from './send-comment'

/** main entry */
export async function run(): Promise<void> {
  const eventName = context.eventName
  const { owner, repo } = context.repo
  core.debug(
    `status: { eventName: ${eventName}, repository: ${owner}/${repo} }`
  )
  if (!isSupportedEvent(eventName)) {
    core.warning(`Not supported Event: ${eventName}`)
    return
  }
  const { token, imageUrl, searchPattern } = getInputParams()

  const { comment, issueNumber } = getEventWebhook(eventName)
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
        owner,
        repo,
        issueNumber,
        `![LGTM](${imageUrl})`
      )
      return
    }
  }

  core.info('Comment does not match pattern.')
}

/* istanbul ignore next */
run().catch((e) => core.setFailed(e.message))

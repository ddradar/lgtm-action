import { debug, info, setFailed, warning } from '@actions/core'
import { context } from '@actions/github'

import { getEventWebhook, isSupportedEvent } from './event'
import { getInputParams } from './input-helper'
import { sendCommentAsync } from './send-comment'

/** main entry */
export async function run(): Promise<void> {
  const eventName = context.eventName
  const { owner, repo } = context.repo
  debug(`status: { eventName: ${eventName}, repository: ${owner}/${repo} }`)
  if (!isSupportedEvent(eventName)) {
    warning(`Not supported Event: ${eventName}`)
    return
  }
  const { token, imageUrl, searchPattern } = getInputParams()

  const { comment, issueNumber } = getEventWebhook(eventName)
  debug(`webhook: { comment: ${comment}, issueNumber: ${issueNumber} }`)
  if (!comment) {
    info('Comment is null or empty.')
    return
  }

  for (const regexp of searchPattern) {
    if (regexp.test(comment)) {
      info(`Comment matches pattern: ${regexp}`)
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

  info('Comment does not match pattern.')
}

/* istanbul ignore next */
run().catch((e) => setFailed(e instanceof Error ? e : `${e}`))

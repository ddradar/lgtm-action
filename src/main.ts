import { debug, info, setFailed, warning } from '@actions/core'
import { context } from '@actions/github'

import { getEventWebhook, isSupportedEvent } from './event.js'
import { getInputParams } from './input-helper.js'
import { sendCommentAsync } from './send-comment.js'

/** Main entry */
export async function run(): Promise<void> {
  // Get action context & input params
  const event = context.eventName
  const { owner, repo } = context.repo
  debug(`context: { eventName: "${event}", repository: "${owner}/${repo}" }`)
  if (!isSupportedEvent(event)) {
    warning(`Not supported Event: ${event}`)
    return
  }
  const { token, imageUrl, searchPattern } = getInputParams()

  // Get event webhook
  const { comment, issueNumber } = getEventWebhook(event)
  debug(`webhook: { comment: "${comment}", issueNumber: ${issueNumber} }`)
  if (!comment) {
    info('Comment is null or empty.')
    return
  }

  for (const regexp of searchPattern) {
    if (regexp.test(comment)) {
      info(`Comment matches pattern: ${regexp}`)
      const body = `![LGTM](${imageUrl})`
      await sendCommentAsync(token, owner, repo, issueNumber, body)
      return
    }
  }

  info('Comment does not match pattern.')
}

run().catch((e) => setFailed(e instanceof Error ? e : `${e}`))

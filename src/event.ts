import { getEnvironmentVariable, readFileAsync } from './node-helper'

type SupportedEvent = 'issue_comment' | 'pull_request_review'
const supportedEvent: Set<string> = new Set<SupportedEvent>([
  'issue_comment',
  'pull_request_review'
])

/** Returns true if this action supports event.
 * @param eventName event name.
 */
export const isSupportedEvent = (
  eventName: string
): eventName is SupportedEvent => supportedEvent.has(eventName)

/** Gets event info from stored webfook JSON.
 * @param eventName Fooked event name
 */
export const getEventWebhook = async (
  eventName: SupportedEvent
): Promise<{
  /** comment body */
  comment: string | null
  /** issue or pull request number */
  issueNumber: number
}> => {
  const eventJsonPath = getEnvironmentVariable('GITHUB_EVENT_PATH')
  const jsonString = await readFileAsync(eventJsonPath, 'utf-8')
  const webhookObject = JSON.parse(jsonString)
  switch (eventName) {
    case 'issue_comment': // https://developer.github.com/v3/activity/events/types/#issuecommentevent
      return {
        comment: webhookObject.comment.body,
        issueNumber: webhookObject.issue.number
      }
    case 'pull_request_review': // https://developer.github.com/v3/activity/events/types/#pullrequestreviewevent
      return {
        comment: webhookObject.review.body,
        issueNumber: webhookObject.pull_request.number
      }
  }
}

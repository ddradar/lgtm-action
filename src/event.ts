import { getEnvironmentVariable, readFileAsync } from './node-helper'

const supportedEvent = new Set([
  'issue_comment',
  'pull_request_review'
] as const)
type SupportedEvent = typeof supportedEvent extends Iterable<infer U>
  ? U
  : never

/** Returns true if this action supports event.
 * @param eventName event name.
 */
export function isSupportedEvent(
  eventName: string
): eventName is SupportedEvent {
  return (supportedEvent as ReadonlySet<string>).has(eventName)
}

type EventWebhook = {
  /** comment body */
  comment: string | null
  /** issue or pull request number */
  issueNumber: number
}

/** Gets event info from stored webfook JSON.
 * @param eventName Fooked event name
 */
export async function getEventWebhook(
  eventName: SupportedEvent
): Promise<EventWebhook> {
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

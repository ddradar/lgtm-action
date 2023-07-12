import { context } from '@actions/github'
import type {
  IssueCommentEvent,
  PullRequestReviewEvent
} from '@octokit/webhooks-types'

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

interface EventWebhook {
  /** comment body */
  comment: string | null
  /** issue or pull request number */
  issueNumber: number
}

/** Gets event info from stored webfook JSON.
 * @param eventName Fooked event name
 */
export function getEventWebhook(eventName: SupportedEvent): EventWebhook {
  switch (eventName) {
    case 'issue_comment': {
      const payload = context.payload as IssueCommentEvent
      return {
        comment: payload.comment.body,
        issueNumber: payload.issue.number
      }
    }
    case 'pull_request_review': {
      const payload = context.payload as PullRequestReviewEvent
      return {
        comment: payload.review.body,
        issueNumber: payload.pull_request.number
      }
    }
  }
}

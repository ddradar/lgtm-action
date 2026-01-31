import { context } from '@actions/github'
import type { webhooks } from '@octokit/openapi-webhooks-types'

const supportedEvent = new Set([
  'issue_comment',
  'pull_request_review',
] as const)
type SupportedEvent =
  typeof supportedEvent extends Iterable<infer U> ? U : never

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

type IssueCommentPayload =
  webhooks['issue-comment-created']['post']['requestBody']['content']['application/json']
type PullRequestReviewPayload =
  webhooks['pull-request-review-submitted']['post']['requestBody']['content']['application/json']

/** Gets event info from stored webfook JSON.
 * @param eventName Fooked event name
 */
export function getEventWebhook(eventName: SupportedEvent): EventWebhook {
  switch (eventName) {
    case 'issue_comment': {
      const payload = context.payload as IssueCommentPayload
      return {
        comment: payload.comment.body,
        issueNumber: payload.issue.number,
      }
    }
    case 'pull_request_review': {
      const payload = context.payload as PullRequestReviewPayload
      return {
        comment: payload.review.body,
        issueNumber: payload.pull_request.number,
      }
    }
  }
}

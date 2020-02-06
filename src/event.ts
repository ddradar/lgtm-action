import fs from 'fs'

type SupportedEvent = 'issue_comment' | 'pull_request_review'
const supportedEvent: SupportedEvent[] = [
  'issue_comment',
  'pull_request_review'
]

export const isSupportedEvent = (
  eventName: string | null | undefined
): eventName is SupportedEvent =>
  !!eventName && (supportedEvent as string[]).includes(eventName)

export const getEventWebhook = (
  eventName: SupportedEvent
): {
  comment: string | null
  issueNumber: number
} => {
  if (!process.env.GITHUB_EVENT_PATH) {
    throw new Error(
      'GITHUB_EVENT_PATH is not set in an environment variable. This package only works with GitHub Actions.'
    )
  }
  const jsonString = fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf-8')
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

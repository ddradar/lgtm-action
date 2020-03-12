import { getEnvironmentVariable, readFileAsync } from './node-helper'

type SupportedEvent = 'issue_comment' | 'pull_request_review'
const supportedEvent: Set<string> = new Set<SupportedEvent>([
  'issue_comment',
  'pull_request_review'
])

export const isSupportedEvent = (
  eventName: string | null | undefined
): eventName is SupportedEvent => !!eventName && supportedEvent.has(eventName)

export const getEventWebhook = async (
  eventName: SupportedEvent
): Promise<{
  comment: string | null
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

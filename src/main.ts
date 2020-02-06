import * as core from '@actions/core'
import { isSupportedEvent, getEventWebhook } from './event'
import { sendCommentAsync } from './send-comment'

const isLGTM = (comment: string | null): boolean =>
  !!comment && comment.toLowerCase() === 'lgtm'

async function run(): Promise<void> {
  try {
    const eventName = process.env.GITHUB_EVENT_NAME
    if (!isSupportedEvent(eventName)) {
      core.warning(`Not supported Event: ${eventName}`)
      return
    }
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error(
        'GITHUB_REPOSITORY is not set in an environment variable. This package only works with GitHub Actions.'
      )
    }
    const token = core.getInput('token', { required: true })
    const imageUrl = core.getInput('image-url', { required: true })
    const repoOwner = process.env.GITHUB_REPOSITORY.split('/')[0]
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]

    const hook = await getEventWebhook(eventName)
    if (!isLGTM(hook.comment)) {
      core.info('Comment is not LGTM.')
      return
    }

    await sendCommentAsync(
      token,
      repoOwner,
      repoName,
      hook.issueNumber,
      `![LGTM](${imageUrl})`
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

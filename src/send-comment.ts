import { getOctokit } from '@actions/github'

/**
 * Send comment to https://github.com/{owner}/{repo}/(issues|pull)/{issueNumber} asynchronously.
 * @param token auth token.
 * @param owner Owner name.
 * @param repo Repository name.
 * @param issueNumber issue or pull request number that you want to send comment.
 * @param comment Comment body to send (Markdown text)
 */
export async function sendCommentAsync(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  comment: string
): Promise<void> {
  const octokit = getOctokit(token)
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: comment,
  })
}

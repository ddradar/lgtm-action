import { Octokit } from '@octokit/rest'

/**
 * Send comment to https://github.com/{owner}/{repo}/(issues|pull)/{issueNumber} asynchronously.
 * @param token auth token.
 * @param owner Owner name.
 * @param repo Repository name.
 * @param issueNumber issue or pull request number that you want to send comment.
 * @param comment Comment body to send (Markdown text)
 */
export const sendCommentAsync = async (
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  comment: string
): Promise<void> => {
  const auth = `token ${token}`
  const octokit = new Octokit({ auth })
  await octokit.issues.createComment({
    owner,
    repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    issue_number: issueNumber,
    body: comment
  })
}

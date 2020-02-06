import { Octokit } from '@octokit/rest'

export const sendCommentAsync = async (
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  comment: string
): Promise<void> => {
  const octokit = new Octokit({
    auth: `token ${token}`
  })
  await octokit.issues.createComment({
    owner,
    repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    issue_number: issueNumber,
    body: comment
  })
}

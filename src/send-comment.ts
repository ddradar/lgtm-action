import { Octokit } from '@octokit/rest'

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

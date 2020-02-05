import { Octokit } from '@octokit/rest'

export const sendCommentAsync = async (
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  comment: string
) => {
  const octokit = new Octokit({
    auth: `token ${token}`
  })
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: comment
  })
}

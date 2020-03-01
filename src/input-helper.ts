import { getInput } from '@actions/core'

type GithubStatus = {
  eventName: string
  repository: string
}

export const getGithubStatus = (): GithubStatus => {
  const eventName = process.env.GITHUB_EVENT_NAME
  if (!eventName)
    throw new Error('GITHUB_EVENT_NAME is not set in an environment variable.')
  const repository = process.env.GITHUB_REPOSITORY
  if (!repository)
    throw new Error('GITHUB_REPOSITORY is not set in an environment variable.')
  if (!/^.+\/.*$/.test(repository))
    throw new Error('GITHUB_REPOSITORY is not match pattern owner/name.')
  return { eventName, repository }
}

type InputParameter = {
  token: string
  imageUrl: string
  searchPattern: RegExp[]
}

export const getInputParams = (): InputParameter => ({
  token: getInput('token', { required: true }),
  imageUrl: getInput('image-url', { required: true }),
  searchPattern: (getInput('search-pattern') || '^(lgtm|LGTM)$')
    .split('\n')
    .filter((x) => x !== '')
    .map((x) => new RegExp(x, 'm'))
})

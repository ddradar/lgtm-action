import { getInput } from '@actions/core'

import { getEnvironmentVariable } from './node-helper'

type GithubStatus = {
  eventName: string
  repository: string
}

export const getGithubStatus = (): GithubStatus => {
  const eventName = getEnvironmentVariable('GITHUB_EVENT_NAME')
  const repository = getEnvironmentVariable('GITHUB_REPOSITORY')
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

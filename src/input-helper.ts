import { getInput } from '@actions/core'

import { getEnvironmentVariable } from './node-helper'

type GithubStatus = {
  /** Event name that hooked this action */
  eventName: string
  /** Repository name like 'owner/repo' */
  repository: string
}

/** Gets runner environments from environment variables.
 * @throws {Error} env['GITHUB_REPOSITORY'] is not match pattern owner/name.
 */
export const getGithubStatus = (): GithubStatus => {
  const eventName = getEnvironmentVariable('GITHUB_EVENT_NAME')
  const repository = getEnvironmentVariable('GITHUB_REPOSITORY')
  if (!/^.+\/.*$/.test(repository))
    throw new Error('GITHUB_REPOSITORY is not match pattern owner/name.')
  return { eventName, repository }
}

type InputParameter = {
  /** Your GitHub Token */
  token: string
  /** Image URL path */
  imageUrl: string
  /** Regexp pattern this action reacts
   * @default ^(lgtm|LGTM)$
   */
  searchPattern: RegExp[]
}

/** Gets the value of inputs. */
export const getInputParams = (): InputParameter => ({
  token: getInput('token', undefined),
  imageUrl: getInput('image-url', { required: true }),
  searchPattern: (getInput('search-pattern', undefined) || '^(lgtm|LGTM)$')
    .split('\n')
    .filter((x) => x !== '')
    .map((x) => new RegExp(x, 'm'))
})

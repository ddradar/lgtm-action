import { getInput } from '@actions/core'

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
export function getInputParams(): InputParameter {
  return {
    token: getInput('token', undefined),
    imageUrl: getInput('image-url', { required: true }),
    searchPattern: (getInput('search-pattern', undefined) || '^(lgtm|LGTM)$')
      .split('\n')
      .filter((x) => x !== '')
      .map((x) => new RegExp(x, 'm'))
  }
}

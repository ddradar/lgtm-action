import { getInput, getMultilineInput } from '@actions/core'

interface InputParameter {
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
  const token = getInput('token')
  const imageUrl = getInput('image-url', { required: true })
  const pattern = getMultilineInput('search-pattern')
  return {
    token,
    imageUrl,
    searchPattern: pattern.length
      ? pattern.map((x) => new RegExp(x, 'm'))
      : [/^(lgtm|LGTM)$/m],
  }
}

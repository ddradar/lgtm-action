import { getInput } from '@actions/core'

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

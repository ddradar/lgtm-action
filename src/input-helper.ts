import { getInput } from '@actions/core'

type InputParameter = {
  token: string
  imageUrl: string
}

export const getInputParams = (): InputParameter => ({
  token: getInput('token', { required: true }),
  imageUrl: getInput('image-url', { required: true })
})

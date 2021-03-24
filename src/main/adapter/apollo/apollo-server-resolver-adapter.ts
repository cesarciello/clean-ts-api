import { Controller, HttpResponse } from '@/presentation/protocols'
import { UserInputError, AuthenticationError, ForbiddenError, ApolloError } from 'apollo-server-express'

const httpResponseCases = {
  200: (response: HttpResponse) => {
    return response.body
  },
  204: (response: HttpResponse) => {
    return response.body
  },
  400: (response: HttpResponse) => {
    throw new UserInputError(response.body.message)
  },
  401: (response: HttpResponse) => {
    throw new AuthenticationError(response.body.message)
  },
  403: (response: HttpResponse) => {
    throw new ForbiddenError(response.body.message)
  },
  500: (response: HttpResponse) => {
    throw new ApolloError(response.body.message)
  }
}

export const adaptResover = async (controller: Controller, args?: any, context?: any): Promise<any> => {
  const request = { ...(args || {}), accountId: context?.req?.accountId }
  const httpResponse = await controller.handle(request)
  return httpResponseCases[httpResponse.statusCode](httpResponse)
}

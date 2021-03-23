import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { GraphQLError } from 'graphql'

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    } else if (checkError(error, 'ApolloError')) {
      response.http.status = 500
    } else if (checkError(error, 'UserInputError')) {
      response.http.status = 400
    } else {
      response.http.status = 500
    }
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

export default (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [{
      requestDidStart: () => ({
        willSendResponse: ({ response, errors }) => handleErrors(response, errors)
      })
    }]
  })
  server.applyMiddleware({ app })
}

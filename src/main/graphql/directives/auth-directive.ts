import { makeAuthMiddleWare } from '@/main/factories/middlewares'
import { GraphQLField, defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor, ForbiddenError } from 'apollo-server-express'

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): any {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async (parents, args, context, info) => {
      const resquest = {
        accessToken: context?.req?.headers?.['x-access-token'],
        ...(context?.req?.headers || {})
      }
      const httpResponse = await makeAuthMiddleWare().handle(resquest)
      if (httpResponse.statusCode === 200) {
        Object.assign(args, httpResponse.body)
        return resolve.call(this, parents, args, context, info)
      } else {
        throw new ForbiddenError(httpResponse.body.message)
      }
    }
  }
}

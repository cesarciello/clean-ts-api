import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpResponse, HttpResquest, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
  }
}

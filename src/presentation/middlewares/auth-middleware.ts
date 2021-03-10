import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, okRequest } from '../helpers/http/http-helper'
import { HttpResponse, HttpResquest, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.loadByToken(accessToken)
      if (account) {
        return okRequest({ accountId: account.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}

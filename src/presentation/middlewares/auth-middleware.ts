import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '@/domain/usecases/account'
import { HttpResponse, HttpResquest, Middleware } from '../protocols'
import { forbidden, okRequest, serverError } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest?.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.loadByToken(accessToken, this.role)
        if (account) {
          return okRequest({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}

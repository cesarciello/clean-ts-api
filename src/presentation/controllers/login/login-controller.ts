import { Authentication } from '@/domain/usecases/account'
import { badResquest, okRequest, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badResquest(error)
      }
      const { email, password } = httpRequest.body
      const authentication = await this.authentication.auth({ email, password })
      if (!authentication) {
        return unauthorized()
      }

      return okRequest(authentication)
    } catch (error) {
      return serverError(error)
    }
  }
}

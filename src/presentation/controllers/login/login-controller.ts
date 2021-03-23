import { Authentication } from '@/domain/usecases/account'
import { badResquest, okRequest, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badResquest(error)
      }
      const { email, password } = request
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

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}

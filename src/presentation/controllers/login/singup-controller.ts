import { AddAccount, Authentication } from '@/domain/usecases/account'
import { EmailInUseError } from '@/presentation/errors'
import { badResquest, forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badResquest(error)
      }
      const { name, email, password } = request
      const hasAccount = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!hasAccount) {
        return forbidden(new EmailInUseError())
      }
      const authentication = await this.authentication.auth({ email, password })
      return okRequest(authentication)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}

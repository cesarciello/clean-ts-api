import { EmailInUseError } from '../../../errors'
import { Validation } from '../../../protocols/validation'
import { AddAccount } from '../../../../domain/usecases/account/add-account'
import { Authentication } from '../../../../domain/usecases/account/authentication'
import { Controller, HttpResponse, HttpResquest } from '../../../protocols'
import { badResquest, forbidden, okRequest, serverError } from '../../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badResquest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const authentication = await this.authentication.auth({ email, password })
      return okRequest(authentication)
    } catch (error) {
      return serverError(error)
    }
  }
}

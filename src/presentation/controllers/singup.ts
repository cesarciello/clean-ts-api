import { HttpResponse, HttpResquest, EmailValidator, Controller } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badResquest, serverError } from '../helpers/http-helper'
import { AddAccount } from '../../domain/usescases/add-account'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emaiValidaror: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emaiValidaror
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpResquest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badResquest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badResquest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badResquest(new InvalidParamError('email'))
      }
      this.addAccount.add({
        name,
        email,
        password
      })
    } catch (error) {
      return serverError()
    }
  }
}

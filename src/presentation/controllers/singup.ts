import { HttpResponse, HttpResquest, EmailValidator, Controller } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badResquest, serverError } from '../helpers/http-helper'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emaiValidaror: EmailValidator) {
    this.emailValidator = emaiValidaror
  }

  handle(httpRequest: HttpResquest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badResquest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badResquest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badResquest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}

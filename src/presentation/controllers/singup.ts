import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpResponse, HttpResquest } from '../protocols/http'
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
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badResquest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}

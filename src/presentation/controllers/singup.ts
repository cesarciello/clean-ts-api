import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badResquest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpResponse, HttpResquest } from '../protocols/http'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emaiValidaror: EmailValidator) {
    this.emailValidator = emaiValidaror
  }

  handle(httpRequest: HttpResquest): HttpResponse {
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
  }
}

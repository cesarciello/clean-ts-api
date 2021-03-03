import { InvalidParamError, MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import { Controller, HttpResponse, HttpResquest } from '../../protocols'
import { EmailValidator } from '../singup/singup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badResquest(new MissingParamError(field))
      }
    }

    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValidEmail) {
      return badResquest(new InvalidParamError('email'))
    }
    return new Promise(resolve => resolve(null))
  }
}

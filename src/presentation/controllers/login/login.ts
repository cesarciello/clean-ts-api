import { InvalidParamError, MissingParamError } from '../../errors'
import { badResquest, serverError } from '../../helpers/http-helper'
import { Controller, HttpResponse, HttpResquest } from '../../protocols'
import { EmailValidator } from '../singup/singup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const { email } = httpRequest.body
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badResquest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badResquest(new InvalidParamError('email'))
      }

      return new Promise(resolve => resolve(null))
    } catch (error) {
      return serverError(error)
    }

  }
}

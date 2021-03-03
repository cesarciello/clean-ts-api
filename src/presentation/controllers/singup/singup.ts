import { InvalidParamError, MissingParamError } from '../../errors'
import { badResquest, okRequest, serverError } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validator/validation'
import { EmailValidator, AddAccount, Controller, HttpResponse, HttpResquest } from './singup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(emaiValidaror: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emaiValidaror
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)

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
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return okRequest(account)
    } catch (error) {
      return serverError(error)
    }
  }
}

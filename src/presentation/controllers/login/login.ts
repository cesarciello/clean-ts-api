import { Authentication } from '../../../domain/usecases/authentication'
import { badResquest, okRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validator/validation'
import { Controller, HttpResponse, HttpResquest } from '../../protocols'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badResquest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }

      return okRequest({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}

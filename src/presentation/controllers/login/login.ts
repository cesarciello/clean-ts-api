import { MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import { Controller, HttpResponse, HttpResquest } from '../../protocols'

export class LoginController implements Controller {
  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badResquest(new MissingParamError(field))
      }
    }
    return new Promise(resolve => resolve(null))
  }
}

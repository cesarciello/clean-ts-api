import { MissingParamError } from '../errors/missing-param-error'
import { badResquest } from '../helpers/http-helper'
import { HttpResponse, HttpResquest } from '../protocols/http'
export class SignUpController {
  handle(httpRequest: HttpResquest): HttpResponse {
    const requiredFields = ['name', 'email']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badResquest(new MissingParamError(field))
      }
    }
  }
}

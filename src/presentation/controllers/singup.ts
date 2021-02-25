import { MissingParamError } from '../errors/missing-param-error'
import { badResquest } from '../helpers/http-helper'
import { HttpResponse, HttpResquest } from '../protocols/http'
export class SignUpController {
  handle(httpRequest: HttpResquest): HttpResponse {
    if (!httpRequest.body.name) {
      return badResquest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      return badResquest(new MissingParamError('email'))
    }
  }
}

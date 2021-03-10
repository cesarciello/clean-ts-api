import { badResquest } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpResquest } from '../../../protocols'
import { Validation } from '../../../protocols/validation'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    const validationError = this.validation.validate(httpRequest.body)
    if (validationError) {
      return badResquest(validationError)
    }
    return null
  }
}

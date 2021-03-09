import { Controller, HttpResponse, HttpResquest } from '../../../protocols'
import { Validation } from '../../../protocols/validation'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return null
  }
}

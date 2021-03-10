import { AddSurvey } from '../../../../domain/usecases/add-survey'
import { badResquest, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpResquest } from '../../../protocols'
import { Validation } from '../../../protocols/validation'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const validationError = this.validation.validate(body)
      if (validationError) {
        return badResquest(validationError)
      }
      await this.addSurvey.add(body)
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}

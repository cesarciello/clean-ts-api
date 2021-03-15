import { Validation } from '../../../protocols/validation'
import { AddSurvey } from '../../../../domain/usecases/add-survey'
import { Controller, HttpResponse, HttpResquest } from '../../../protocols'
import { badResquest, noContent, serverError } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const { question, answers } = httpRequest.body
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badResquest(validationError)
      }
      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

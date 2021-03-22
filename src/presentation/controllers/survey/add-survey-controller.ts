import { AddSurvey } from '@/domain/usecases/survey'
import { Validation } from '@/presentation/protocols/validation'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'
import { badResquest, noContent, serverError } from '@/presentation/helpers/http/http-helper'

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

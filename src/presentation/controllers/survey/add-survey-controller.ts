import { AddSurvey } from '@/domain/usecases/survey'
import { Validation } from '@/presentation/protocols/validation'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { badResquest, noContent, serverError } from '@/presentation/helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const { question, answers } = request
      const validationError = this.validation.validate(request)
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

export namespace AddSurveyController {
  export type Request = {
    question: string
    answers: Answer[]
  }

  type Answer = {
    image?: string
    answer: string
  }
}

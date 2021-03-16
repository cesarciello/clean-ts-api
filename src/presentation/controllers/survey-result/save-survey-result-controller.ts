import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new MissingParamError('surveyId'))
      }
      if (survey.answers.filter((answerSurvey) => answerSurvey.answer === answer).length === 0) {
        return forbidden(new InvalidParamError('answer'))
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}

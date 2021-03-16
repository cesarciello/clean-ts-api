import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const { params: { surveyId }, body: { answer }, accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new MissingParamError('surveyId'))
      }
      if (survey.answers.filter((answerSurvey) => answerSurvey.answer === answer).length === 0) {
        return forbidden(new InvalidParamError('answer'))
      }
      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })
      return okRequest(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

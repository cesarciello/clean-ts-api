import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const { params: { surveyId }, accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('survey id'))
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
      return okRequest(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

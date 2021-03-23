import { LoadSurveyResult } from '@/domain/usecases/survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { CheckSurveyById } from '@/domain/usecases/survey'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle(httpRequest: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = httpRequest
      const hasSurvey = await this.checkSurveyById.checkById(surveyId)
      if (!hasSurvey) {
        return forbidden(new InvalidParamError('survey id'))
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
      return okRequest(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}

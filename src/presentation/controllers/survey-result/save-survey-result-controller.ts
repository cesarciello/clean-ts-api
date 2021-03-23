import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request
      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId)
      if (!answers.length) {
        return forbidden(new MissingParamError('surveyId'))
      } else if (!answers.includes(answer)) {
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

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
    answer: string
  }
}

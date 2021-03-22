import { LoadSurveys } from '@/domain/usecases/survey'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'
import { noContent, okRequest, serverError } from '@/presentation/helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest.accountId)
      if (surveys.length === 0) {
        return noContent()
      }
      return okRequest(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}

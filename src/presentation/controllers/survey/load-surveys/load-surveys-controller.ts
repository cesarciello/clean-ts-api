import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { noContent, okRequest, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpResquest } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (surveys.length === 0) {
        return noContent()
      }
      return okRequest(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}

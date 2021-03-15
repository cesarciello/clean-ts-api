import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { okRequest } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpResquest } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    return okRequest(surveys)
  }
}

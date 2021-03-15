import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { Controller, HttpResponse, HttpResquest } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return null
  }
}

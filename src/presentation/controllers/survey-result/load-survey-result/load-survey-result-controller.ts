import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    const { params: { surveyId } } = httpRequest
    await this.loadSurveyById.loadById(surveyId)
    return null
  }
}

import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { unauthorized } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) { }

  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) {
      return unauthorized()
    }
    return null
  }
}

import { LoadSurveys } from '@/domain/usecases/survey'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { noContent, okRequest, serverError } from '@/presentation/helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) { }

  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      if (surveys.length === 0) {
        return noContent()
      }
      return okRequest(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}

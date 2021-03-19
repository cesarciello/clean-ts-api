import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(private readonly loadSurveyResultsRepository: LoadSurveyResultRepository) { }

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultsRepository.loadBySurveyId(surveyId)
    return surveyResult
  }
}

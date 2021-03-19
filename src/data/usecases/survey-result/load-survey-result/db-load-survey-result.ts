import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultsRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load(surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultsRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => ({ ...answer, count: 0, percent: 0 }))
      }
    }
    return surveyResult
  }
}

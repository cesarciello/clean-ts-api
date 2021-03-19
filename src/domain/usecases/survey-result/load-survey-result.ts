import { SurveyResultModel } from '../../models/survey-result'

export interface SaveSurveyResult {
  save: (surveyId: string) => Promise<SurveyResultModel>
}

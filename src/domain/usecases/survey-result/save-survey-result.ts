import { SurveyResultModel } from '../../models/survey-result'

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

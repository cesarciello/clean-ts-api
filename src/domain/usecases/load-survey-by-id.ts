import { SurveyModel } from '../models/survey'

export interface LoadSurveyByID {
  loadById: () => SurveyModel[]
}

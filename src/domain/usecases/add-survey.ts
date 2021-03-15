import { SurveyAnswer } from '../models/survey'

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

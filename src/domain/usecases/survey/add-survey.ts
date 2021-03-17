import { SurveyAnswer } from '../../models/survey'

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}

export type AddSurveyParams = {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

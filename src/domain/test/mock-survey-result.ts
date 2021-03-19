import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_surveyID',
  question: 'any_question',
  date: new Date(),
  answers: [
    {
      answer: 'any_answer',
      count: 2,
      percent: 40
    },
    {
      answer: 'any_answer',
      count: 3,
      percent: 60
    }
  ]
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
  surveyId: 'any_surveyID'
})

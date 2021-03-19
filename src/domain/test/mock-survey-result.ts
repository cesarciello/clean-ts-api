import { SurveyModel } from '../models/survey'
import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_surveyId',
  question: 'any_question',
  date: new Date(),
  answers: [
    {
      answer: 'any_answer',
      count: 0,
      percent: 0
    },
    {
      answer: 'any_answer',
      count: 0,
      percent: 0
    }
  ]
})
export const mockSurveyToParseSurveyAnResult = (): SurveyModel => (
  {
    id: 'any_surveyId',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer'
      },
      {
        answer: 'any_answer'
      }
    ],
    date: new Date()
  })

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
  surveyId: 'any_surveyID'
})

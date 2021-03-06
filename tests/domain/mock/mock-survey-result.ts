import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_surveyId',
  question: 'any_question',
  date: new Date(),
  answers: [
    {
      answer: 'any_answer',
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false
    },
    {
      answer: 'any_answer',
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false
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

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
  surveyId: 'any_surveyID'
})

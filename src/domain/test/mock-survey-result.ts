import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
  id: 'any_id',
  surveyId: 'any_surveyID'
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
  surveyId: 'any_surveyID'
})

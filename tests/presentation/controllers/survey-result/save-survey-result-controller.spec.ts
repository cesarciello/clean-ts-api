import MockDate from 'mockdate'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadAnswersBySurveyStub, mockSaveSurveyResultStub } from '@/tests/presentation/mock'
import { mockSurveyResultModel } from '@/tests/domain/mock'

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const mockRequest: SaveSurveyResultController.Request = {
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  accountId: 'any_accountId'
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = mockLoadAnswersBySurveyStub()
  const saveSurveyResultStub = mockSaveSurveyResultStub()
  const sut = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)
  return {
    sut,
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyresultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers')
    await sut.handle(mockRequest)
    expect(loadAnswersSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('should return 403 with LoadAnswersBySurvey returns []', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockResolvedValueOnce([] as LoadAnswersBySurvey.Result)
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(forbidden(new MissingParamError('surveyId')))
  })

  test('should return 500 with LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      surveyId: 'any_survey_id',
      answer: 'wrong_answer',
      accountId: 'any_accountId'
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest)
    expect(saveSpy).toHaveBeenCalledWith({ ...mockRequest, date: new Date() })
  })

  test('should return 500 with SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(okRequest(mockSurveyResultModel()))
  })
})

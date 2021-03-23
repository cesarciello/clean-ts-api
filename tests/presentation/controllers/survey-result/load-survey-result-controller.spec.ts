
import MockDate from 'mockdate'
import { CheckSurveyById } from '@/domain/usecases/survey'
import { LoadSurveyResult } from '@/domain/usecases/survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result'
import { forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { mockSurveyResultModel } from '@/tests/domain/mock'
import { mockCheckSurveyByIdStub, mockLoadSurveyResult } from '@/tests/presentation/mock'

const mockRequest: LoadSurveyResultController.Request = {
  surveyId: 'any_survey_id',
  accountId: 'any_accountId'
}

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = mockCheckSurveyByIdStub()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(checkSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    checkSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')
    await sut.handle(mockRequest)
    expect(checkByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('should return 403 if CheckSurveyById return false', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockResolvedValueOnce(false)
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('survey id')))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(okRequest(mockSurveyResultModel()))
  })

  test('should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id', 'any_accountId')
  })
})

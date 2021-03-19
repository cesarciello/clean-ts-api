import { HttpResquest } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyByIdStub, mockLoadSurveyResult } from '@/presentation/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

const mockRequest: HttpResquest = {
  params: {
    surveyId: 'any_survey_id'
  },
  accountId: 'any_accountId'
}

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyByIdStub()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResultController', () => {
  test('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('should return 403 if LoadSurveyById return null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('survey id')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })
})

import MockDate from 'mockdate'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockSurveyResultModel, mockSurveyToParseSurveyAnResult } from '@/domain/test'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should calls LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_surveyId', 'any_accountId')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_surveyId', 'any_accountId')
  })

  test('should return survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_surveyId', 'any_accountId')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('should calls LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load('any_surveyId', 'any_accountId')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('should return SurveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockResolvedValueOnce(mockSurveyToParseSurveyAnResult())
    const surveyResult = await sut.load('any_surveyId', 'any_accountId')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('should throws if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_surveyId', 'any_accountId')
    await expect(promise).rejects.toThrow(new Error())
  })
})

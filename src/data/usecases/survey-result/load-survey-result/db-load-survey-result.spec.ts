import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@/data/test'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockSurveyResultModel } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult', () => {
  test('should calls LoadSurveyResultRepository with correct value', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_surveyId')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('should should return survey result on success', async () => {
    const { sut } = makeSut() //
    const surveyResult = await sut.load('any_surveyId')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('should throws if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_surveyId')
    await expect(promise).rejects.toThrow(new Error())
  })
})

import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const mockSaveSurveyResultData = mockSaveSurveyResultParams()
    await sut.save(mockSaveSurveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultData)
  })

  test('should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const mockSaveSurveyResultData = mockSaveSurveyResultParams()
    await sut.save(mockSaveSurveyResultData)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(mockSaveSurveyResultData.surveyId, mockSaveSurveyResultData.accountId)
  })

  test('should throws if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const mockSaveSurveyResultData = mockSaveSurveyResultParams()
    const promise = sut.save(mockSaveSurveyResultData)
    await expect(promise).rejects.toThrow(new Error())
  })

  test('should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const mockSaveSurveyResultData = mockSaveSurveyResultParams()
    const promise = sut.save(mockSaveSurveyResultData)
    await expect(promise).rejects.toThrow(new Error())
  })
})

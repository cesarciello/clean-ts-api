import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSaveSurveyResultRepository } from '@/data/test'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
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
    const fakeSaveSurveyResultData = mockSaveSurveyResultParams()
    await sut.save(fakeSaveSurveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(fakeSaveSurveyResultData)
  })

  test('should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const fakeSaveSurveyResultData = mockSaveSurveyResultParams()
    const promise = sut.save(fakeSaveSurveyResultData)
    await expect(promise).rejects.toThrow(new Error())
  })
})

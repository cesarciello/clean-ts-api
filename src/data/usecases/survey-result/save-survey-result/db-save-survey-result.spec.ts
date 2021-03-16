import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'

const makeFakeSurveyResultData = (): SurveyResultModel => ({
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
  id: 'any_id',
  surveyId: 'any_surveyID'
})

const makeFakeSaveSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
  surveyId: 'any_surveyID'
})

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResultData()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
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
    const fakeSaveSurveyResultData = makeFakeSaveSurveyResultData()
    await sut.save(fakeSaveSurveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(fakeSaveSurveyResultData)
  })

  test('should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeSaveSurveyResultData())
    expect(surveyResult).toEqual(makeFakeSurveyResultData())
  })

  test('should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const fakeSaveSurveyResultData = makeFakeSaveSurveyResultData()
    const promise = sut.save(fakeSaveSurveyResultData)
    await expect(promise).rejects.toThrow(new Error())
  })
})

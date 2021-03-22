import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { mockSurveyModelList } from '@/domain/test'
import { mockLoadSurveysRepository } from '@/data/test'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'

const mockAccountId = (): string => 'any_accountId'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should calls LoadSurveysRepository with correct value', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    const accountId = mockAccountId()
    await sut.load(accountId)
    expect(loadAllSpy).toHaveBeenCalledWith(accountId)
  })

  test('should return an Array of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load(mockAccountId())
    expect(surveys).toEqual(mockSurveyModelList())
  })

  test('should throws if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = sut.load(mockAccountId())
    await expect(promise).rejects.toThrow()
  })
})

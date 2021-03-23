import { mockCheckSurveyByIdStub } from '@/tests/presentation/mock'
import { DbCheckSurveyById } from '@/data/usecases/survey'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdStub()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)
  return {
    sut,
    checkSurveyByIdRepositoryStub
  }
}

describe('DbCheckSurveyById', () => {
  test('should calls CheckSurveyByIdRepository with correct values', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
    await sut.checkById('any_id')
    expect(checkByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return an survey on success', async () => {
    const { sut } = makeSut()
    const hasSurvey = await sut.checkById('any_id')
    expect(hasSurvey).toEqual(true)
  })

  test('should throws if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockRejectedValueOnce(new Error())
    const promise = sut.checkById('any_id')
    await expect(promise).rejects.toThrow()
  })
})

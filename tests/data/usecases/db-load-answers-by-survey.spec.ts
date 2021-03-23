import { mockSurveyModel } from '../../domain/mock'
import { mockLoadSurveyByIdRepository } from '../mock'
import { DbLoadAnswersBySurvey } from '@/data/usecases/survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadAnswersBySurvey', () => {
  test('should calls LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadAnswers('any_id')
    expect(loadAnswersSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return answers on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = mockSurveyModel()
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual([surveyResponse.answers[0].answer, surveyResponse.answers[1].answer])
  })

  test('should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockResolvedValueOnce(null)
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual([])
  })

  test('should throws if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})

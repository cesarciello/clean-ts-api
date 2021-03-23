import { mockSurveyModel } from '../../domain/mock'
import { mockLoadAnswersBySurveyRepository } from '../mock'
import { DbLoadAnswersBySurvey } from '@/data/usecases/survey'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)
  return {
    sut,
    loadAnswersBySurveyRepositoryStub
  }
}

describe('DbLoadAnswersBySurvey', () => {
  test('should calls LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
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
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockResolvedValueOnce([])
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual([])
  })

  test('should throws if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockRejectedValueOnce(new Error())
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})

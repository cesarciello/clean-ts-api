import { HttpResquest } from '@/presentation/protocols'
import { mockLoadSurveyByIdStub } from '@/presentation/test'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveyResultController } from './load-survey-result-controller'

const mockRequest: HttpResquest = {
  params: {
    surveyId: 'any_survey_id'
  },
  accountId: 'any_accountId'
}

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyByIdStub()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResultController', () => {
  test('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })
})

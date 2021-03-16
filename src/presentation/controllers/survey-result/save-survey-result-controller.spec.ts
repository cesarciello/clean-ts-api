import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models/survey'
import { HttpResquest } from '@/presentation/protocols'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeFakeSurvey: SurveyModel = {
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
}

const makeFakeRequest: HttpResquest = {
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_accountId'
}

const makeFakeSurveyResult = (): SurveyResultModel => ({
  accountId: 'valid_accountId',
  answer: 'valid_answer',
  date: new Date(),
  id: 'valid_id',
  surveyId: 'valid_surveyID'
})

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdStub()
  const saveSurveyResultStub = makeSaveSurveyResultStub()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyresultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('should return 403 with LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest)
    expect(httpResponse).toEqual(forbidden(new MissingParamError('surveyId')))
  })

  test('should return 500 with LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const { params, body, accountId } = makeFakeRequest
    const saveSurveyResult = Object.assign({}, body, params, { accountId }, { date: new Date() })
    await sut.handle(makeFakeRequest)
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResult)
  })

  test('should return 500 with SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest)
    expect(httpResponse).toEqual(okRequest(makeFakeSurveyResult()))
  })
})

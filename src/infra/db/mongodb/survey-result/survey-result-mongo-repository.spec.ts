import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeFakeSaveSurveyData = (accountId: string, surveyId: string, answer: string): SaveSurveyResultModel => ({
  accountId,
  answer,
  date: new Date(),
  surveyId
})

const makeAccount = async (): Promise<string> => {
  const { ops: [{ _id }] } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return _id
}

const makeSurvey = async (): Promise<any> => {
  const { ops: [survey] } = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'other_answer'
      }
    ],
    date: new Date()
  })
  return survey
}

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

describe('SurveyResult Mongo Reposotory', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })
  describe('save SurveyResult', () => {
    test('should insert new surveyResult if there is no data with accountId and surveyId', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await makeAccount()
      const surveyResult = await sut.save(makeFakeSaveSurveyData(accountId, survey._id, survey.answers[0].answer))
      console.log(surveyResult)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
})

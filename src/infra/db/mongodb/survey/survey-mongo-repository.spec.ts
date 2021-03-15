import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}
const makeFakeSurveyData: AddSurveyModel = {
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
}

let surveyCollection: Collection

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  describe('add survey', () => {
    test('should add an survey on success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurveyData)
      const surveyFind = await surveyCollection.findOne({ question: 'any_question' })
      expect(surveyFind).toBeTruthy()
    })
  })

  describe('loadAll survey', () => {
    test('should return list of all surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertOne(makeFakeSurveyData)
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(1)
      expect(surveys[0].question).toBe('any_question')
    })
  })
})

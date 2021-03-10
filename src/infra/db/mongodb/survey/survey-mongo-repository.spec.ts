import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}
const makeFakeSurveyData = {
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }
  ]
}

let accountCollection: Collection

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('survey')
    await accountCollection.deleteMany({})
  })

  test('should add an survey on success', async () => {
    const sut = makeSut()
    await sut.add(makeFakeSurveyData)
    const surveyFind = await accountCollection.findOne({ question: 'any_question' })
    expect(surveyFind).toBeTruthy()
  })
})

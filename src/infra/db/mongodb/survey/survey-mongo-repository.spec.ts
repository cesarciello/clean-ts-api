import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
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

    test('should return empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys).toEqual([])
    })
  })

  describe('loadById survey', () => {
    test('should return surveys on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(makeFakeSurveyData)
      const { ops: [{ _id }] } = res
      console.log(_id)
      const surveys = await sut.loadById(_id)
      expect(surveys.question).toBe('any_question')
    })

    test('should return null if no exist survey with provided id', async () => {
      const sut = makeSut()
      const surveys = await sut.loadById('any_id')
      expect(surveys).toEqual(null)
    })
  })
})

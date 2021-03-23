import { Collection, ObjectId } from 'mongodb'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mock'

const makeAccount = async (): Promise<string> => {
  const { ops: [{ _id }] } = await accountCollection.insertOne(mockAddAccountParams())
  return _id
}

const makeSurveyResult = async (surveyId: string, accountId: string, answer: string): Promise<SurveyResultModel> => {
  const { ops: [surveyResult] } = await surveyResultCollection.insertOne({
    surveyId: new ObjectId(surveyId),
    accountId: new ObjectId(accountId),
    answer,
    date: new Date()
  })
  return MongoHelper.map(surveyResult)
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

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
    surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('add survey', () => {
    test('should add an survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const surveyFind = await surveyCollection.findOne({ question: 'any_question' })
      expect(surveyFind).toBeTruthy()
    })
  })

  describe('loadAll survey', () => {
    test('should return list of all surveys on success', async () => {
      const accountId = await makeAccount()
      const sut = makeSut()
      const { ops: [survey] } = await surveyCollection.insertMany([mockAddSurveyParams(), mockAddSurveyParams()])
      await makeSurveyResult(survey._id, accountId, survey.answers[0].answer)
      const surveys = await sut.loadAll(accountId)

      console.log(surveys)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe('any_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('should return empty list', async () => {
      const accountId = await makeAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys).toEqual([])
    })
  })

  describe('loadById survey', () => {
    test('should return surveys on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const { ops: [{ _id }] } = res
      const survey = await sut.loadById(_id)
      expect(survey.id).toBeTruthy()
      expect(survey.question).toBe('any_question')
    })

    test('should return null if no exist survey with provided id', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(new ObjectId().toHexString())
      expect(survey).toEqual(null)
    })
  })

  describe('checkById survey', () => {
    test('should return true if exist survey', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const { ops: [{ _id }] } = res
      const hasSurvey = await sut.checkById(_id)
      expect(hasSurvey).toBe(true)
    })

    test('should return false if no exist survey with provided id', async () => {
      const sut = makeSut()
      const survey = await sut.checkById(new ObjectId().toHexString())
      expect(survey).toEqual(false)
    })
  })

  describe('loadAnswers survey', () => {
    test('should load answers on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const { ops: [{ _id }] } = res
      const hasSurvey = await sut.loadAnswers(_id)
      expect(hasSurvey).toEqual(['any_answer'])
    })

    test('should return false if no exist survey with provided id', async () => {
      const sut = makeSut()
      const survey = await sut.loadAnswers(new ObjectId().toHexString())
      expect(survey).toEqual([])
    })
  })
})

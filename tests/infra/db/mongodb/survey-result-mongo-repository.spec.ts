import { Collection, ObjectId } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result'
import { mockAddAccountParams, mockSurveyModel } from '@/tests/domain/mock'

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeFakeSaveSurveyData = (accountId: string, surveyId: string, answer: string): SaveSurveyResultParams => ({
  accountId,
  answer,
  date: new Date(),
  surveyId
})

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

const makeSurvey = async (): Promise<SurveyModel> => {
  const { ops: [survey] } = await surveyCollection.insertOne(mockSurveyModel())
  return MongoHelper.map(survey)
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
      await sut.save(makeFakeSaveSurveyData(accountId, survey.id, survey.answers[0].answer))
      const saveResult = await surveyResultCollection.findOne({
        accountId,
        surveyId: survey.id
      })
      expect(saveResult).toBeTruthy()
    })

    test('should update surveyResult if there is data with accountId and surveyId', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await makeAccount()
      await makeSurveyResult(survey.id, accountId, survey.answers[0].answer)
      await sut.save(makeFakeSaveSurveyData(accountId, survey.id, survey.answers[1].answer))
      const saveResult = await surveyResultCollection.find({
        accountId,
        surveyId: survey.id
      }).toArray()
      expect(saveResult).toBeTruthy()
      expect(saveResult.length).toEqual(1)
    })
  })

  describe('load by SurveyId', () => {
    test('should load survey result', async () => {
      const sut = makeSut()
      const accountId = await makeAccount()
      const survey = await makeSurvey()
      const saveResult = await sut.loadBySurveyId(survey.id, accountId)
      expect(saveResult).toBeNull()
    })

    test('should load survey result', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await makeAccount()
      const accountId2 = await makeAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: survey.date
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[0].answer,
          date: survey.date
        }
      ])
      const saveResult = await sut.loadBySurveyId(survey.id, accountId)
      expect(saveResult).toBeTruthy()
      expect(saveResult.surveyId).toEqual(survey.id)
      expect(saveResult.answers[0].count).toBe(2)
      expect(saveResult.answers[0].percent).toBe(100)
      expect(saveResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(saveResult.answers[1].count).toBe(0)
      expect(saveResult.answers[1].percent).toBe(0)
      expect(saveResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('should load survey result 2', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await makeAccount()
      const accountId2 = await makeAccount()
      const accountId3 = await makeAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: survey.date
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[0].answer,
          date: survey.date
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId3),
          answer: survey.answers[1].answer,
          date: survey.date
        }
      ])
      const saveResult = await sut.loadBySurveyId(survey.id, accountId2)
      expect(saveResult).toBeTruthy()
      expect(saveResult.surveyId).toEqual(survey.id)
      expect(saveResult.answers[0].count).toBe(2)
      expect(saveResult.answers[0].percent).toBe(67)
      expect(saveResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(saveResult.answers[1].count).toBe(1)
      expect(saveResult.answers[1].percent).toBe(33)
      expect(saveResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('should load survey result 3', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await makeAccount()
      const accountId2 = await makeAccount()
      const accountId3 = await makeAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: survey.date
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: survey.date
        }
      ])
      const saveResult = await sut.loadBySurveyId(survey.id, accountId3)
      expect(saveResult).toBeTruthy()
      expect(saveResult.surveyId).toEqual(survey.id)
      expect(saveResult.answers[0].count).toBe(1)
      expect(saveResult.answers[0].percent).toBe(50)
      expect(saveResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(saveResult.answers[1].count).toBe(1)
      expect(saveResult.answers[1].percent).toBe(50)
      expect(saveResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })
  })
})

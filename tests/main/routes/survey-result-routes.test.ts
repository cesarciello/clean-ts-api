import app from '@/main/config/app'
import env from '@/main/config/env'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { AccountModel } from '@/domain/models/account'

const makeFakeAccount = async (): Promise<AccountModel & { accessToken: string }> => {
  const { ops: [account] } = await accountCollection.insertOne({
    name: 'Gabriel Maddox',
    email: 'maddox.gab@gmail.com',
    password: 'any_password'
  })
  const accessToken = sign({ id: account._id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: account._id }, { $set: { accessToken } })
  const parsedAccount = MongoHelper.map(account)
  return {
    ...parsedAccount,
    accessToken
  }
}

const makeFakeSurvey = async (): Promise<SurveyModel> => {
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
  return MongoHelper.map(survey)
}

const makeFakeSurveyResult = async (surveyId: string, accountId: string, answer: string): Promise<SurveyResultModel> => {
  const { ops: [surveyResult] } = await surveyResultCollection.insertOne({
    surveyId,
    accountId,
    answer,
    date: new Date()
  })
  return MongoHelper.map(surveyResult)
}

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

describe('Survey Result Routes', () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('should returns 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answers: ''
        })
        .expect(403)
    })

    test('should returns 200 on save survey result success', async () => {
      const account = await makeFakeAccount()
      const survey = await makeFakeSurvey()
      await makeFakeSurveyResult(survey.id, account.id, survey.answers[0].answer)

      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', account.accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('should returns 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('should returns 200 on load survey result success', async () => {
      const account = await makeFakeAccount()
      const survey = await makeFakeSurvey()
      await makeFakeSurveyResult(survey.id, account.id, survey.answers[0].answer)

      await request(app)
        .get(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', account.accessToken)
        .expect(200)
    })
  })
})

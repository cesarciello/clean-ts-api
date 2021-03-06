import app from '@/main/config/app'
import env from '@/main/config/env'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { mockAddSurveyParams } from '../../domain/mock'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Gabriel Maddox',
    email: 'maddox.gab@gmail.com',
    password: 'any_password',
    role: 'admin'
  })
  const { ops: [{ _id }] } = res
  const accessToken = sign({ id: _id }, env.jwtSecret)
  await accountCollection.updateOne({ _id }, { $set: { accessToken } })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('POST /survey', () => {
    test('should returns 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            }
          ]
        })
        .expect(403)
    })

    test('should returns 204 on add survey success', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /survey', () => {
    test('should returns 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('should returns 200 on load surveys success', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertOne(mockAddSurveyParams())
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})

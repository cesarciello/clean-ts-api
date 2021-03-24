import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { ApolloServer, gql } from 'apollo-server-express'
import { makeApolloServer } from './helpers'
import { createTestClient } from 'apollo-server-integration-testing'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'

let surveyCollection: Collection
let accountCollection: Collection
let apolloServer: ApolloServer
let surveyResultCollection: Collection

const makeFakeAccount = async (): Promise<{ accessToken: string, id: string }> => {
  const { ops: [account] } = await accountCollection.insertOne({
    name: 'Gabriel Maddox',
    email: 'maddox.gab@gmail.com',
    password: 'any_password'
  })
  const accessToken = sign({ id: account._id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: account._id }, { $set: { accessToken } })
  const parsedAccount = MongoHelper.map(account)
  return {
    id: parsedAccount.id,
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

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    await surveyResultCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('Survey Result Query', () => {
    const surveyResultQuery = gql`
      query surveyResult($surveyId: String!) {
        surveyResult(surveyId: $surveyId) {
          surveyId,
          question,
          answers {
            image,
            answer,
            count,
            percent,
            isCurrentAccountAnswer
          },
          date
        }
      }
    `
    test('should return an Surveys', async () => {
      const account = await makeFakeAccount()
      const survey = await makeFakeSurvey()
      await makeFakeSurveyResult(survey.id, account.id, survey.answers[0].answer)

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': account.accessToken
          }
        }
      })
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: survey.id.toString()
        }
      })
      console.log(JSON.stringify(res))
      expect(res.data.surveyResult.surveyId).toBeTruthy()
      expect(res.data.surveyResult.question).toBe('any_question')
      expect(res.data.surveyResult.answers).toEqual([
        {
          image: 'any_image',
          answer: 'any_answer',
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true
        },
        {
          image: null,
          answer: 'other_answer',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })

    test('should return an AccessDeniedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: new ObjectId().toHexString().toString()
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access Denied')
    })
  })
})

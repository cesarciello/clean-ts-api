import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { ApolloServer, gql } from 'apollo-server-express'
import { makeApolloServer } from './helpers'
import { createTestClient } from 'apollo-server-integration-testing'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
      query login ($email: String!, $password: String!){
        login(email: $email, password: $password) {
          accessToken,
          name
        }
      }
    `
    test('should return an Account on  valid credentials', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Gabriel Maddox',
        email: 'maddox.gab@gmail.com',
        password
      })
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: 'maddox.gab@gmail.com',
          password: '123'
        }
      })
      expect(res.data.login.accessToken).toBeTruthy()
      expect(res.data.login.name).toBe('Gabriel Maddox')
    })

    test('should return an UnauthorizesError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: 'maddox.gab@gmail.com',
          password: '123'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SingUp Mutation', () => {
    const singupMutation = gql`
      mutation singup ($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!){
        login(name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          accessToken,
          name
        }
      }
    `
    test('should return an Account on  valid credentials', async () => {
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(singupMutation, {
        variables: {
          name: 'Gabriel Maddox',
          email: 'maddox.gab@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })
      expect(res.data.singup.accessToken).toBeTruthy()
      expect(res.data.singup.name).toBe('Gabriel Maddox')
    })
  })
})

import { hash } from 'bcrypt'
import app from '@/main/config/app'
import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('POST /singup', () => {
    test('should returns 200 on singup', async () => {
      app.post('/test_cors', (req, res) => {
        res.send()
      })
      await request(app)
        .post('/api/singup')
        .send({
          name: 'Cesar Ciello',
          email: 'cesar.ciello@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('should returns 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Gabriel Maddox',
        email: 'maddox.gab@gmail.com',
        password
      })
      app.post('/test_cors', (req, res) => {
        res.send()
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'maddox.gab@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('should returns 401 on invalid credentials login', async () => {
      app.post('/test_cors', (req, res) => {
        res.send()
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'maddox.gab@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})

import request from 'supertest'
import app from '../config/app'

describe('Singup Routes', () => {
  test('should returns an account on success', async () => {
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

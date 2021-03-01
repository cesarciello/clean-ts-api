import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('should cors is enable', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})

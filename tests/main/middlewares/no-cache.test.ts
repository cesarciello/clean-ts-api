import request from 'supertest'
import app from '@/main/config/app'
import { noCache } from '@/main/middlewares'

describe('noCache Middleware', () => {
  test('should disable cache', async () => {
    app.post('/test_noCache', noCache, (req, res) => {
      res.send()
    })
    await request(app)
      .post('/test_noCache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})

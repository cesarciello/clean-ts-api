import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpResquest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

describe('Auth MiddleWare', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const httpResquest: HttpResquest = {
      headers: {}
    }
    const httpReponse = await sut.handle(httpResquest)
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })
})

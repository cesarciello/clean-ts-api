import { HttpResquest } from '../protocols'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { mockAccountByTokenRepository } from '@/data/test'
import { forbidden, okRequest, serverError } from '../helpers/http/http-helper'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockAccountByTokenRepository()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

const mockResquest = (): HttpResquest => (
  {
    headers: {
      'x-access-token': 'any_token'
    }
  }
)

describe('Auth MiddleWare', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest = mockResquest()
    delete httpRequest.headers
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    const httpRequest = mockResquest()
    await sut.handle(httpRequest)
    expect(loadByTokenSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(null)
    const httpRequest = mockResquest()
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const httpRequest = mockResquest()
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()
    const httpRequest = mockResquest()
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(okRequest({ accountId: 'any_id' }))
  })
})

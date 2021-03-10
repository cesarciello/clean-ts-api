import { AccessDeniedError } from '../errors'
import { HttpResquest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { forbidden, okRequest, serverError } from '../helpers/http/http-helper'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

const makeFakeResquest = (): HttpResquest => (
  {
    headers: {
      'x-access-token': 'any_token'
    }
  }
)

const makeFakeAccount = (): AccountModel => (
  {
    id: 'any_id',
    email: 'any_mail@mail.com',
    name: 'any_name',
    password: 'hash_password'
  }
)

describe('Auth MiddleWare', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeResquest()
    delete httpRequest.headers
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    const httpRequest = makeFakeResquest()
    await sut.handle(httpRequest)
    expect(loadByTokenSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(null)
    const httpRequest = makeFakeResquest()
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = makeFakeResquest()
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeResquest()
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(okRequest({ accountId: 'any_id' }))
  })
})

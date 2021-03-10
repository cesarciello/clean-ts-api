import { AccessDeniedError } from '../errors'
import { HttpResquest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../helpers/http/http-helper'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'any_id',
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'hash_password'
      }
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
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

describe('Auth MiddleWare', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeResquest()
    delete httpRequest.headers
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct values', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    const httpRequest = makeFakeResquest()
    await sut.handle(httpRequest)
    expect(loadByTokenSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'])
  })

  test('should call LoadAccountByToken with correct values', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(null)
    const httpRequest = makeFakeResquest()
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })
})

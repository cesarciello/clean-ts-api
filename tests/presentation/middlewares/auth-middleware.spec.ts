import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares'
import { LoadAccountByToken } from '@/domain/usecases/account'
import { mockAccountByTokenRepository } from '../../data/mock'
import { forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'

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

const mockResquest = (): AuthMiddleware.Request => (
  {
    accessToken: 'any_token'
  }
)

describe('Auth MiddleWare', () => {
  test('should return 403 if no access-token provided', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle({})
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    const resquest = mockResquest()
    await sut.handle(resquest)
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(null)
    const httpReponse = await sut.handle(mockResquest())
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const httpReponse = await sut.handle(mockResquest())
    expect(httpReponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if LoadAccountByToken return an account', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(mockResquest())
    expect(httpReponse).toEqual(okRequest({ accountId: 'any_id' }))
  })
})

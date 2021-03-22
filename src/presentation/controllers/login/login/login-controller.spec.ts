import { LoginController } from './login-controller'
import { HttpResquest } from '@/presentation/protocols'
import { mockAuthenticationParams } from '@/domain/test'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'
import { mockAuthentication, mockValidation } from '@/presentation/test'
import { Authentication } from '@/domain/usecases/account/authentication'
import { badResquest, okRequest, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const mockRequest = (): HttpResquest => ({ body: mockAuthenticationParams() })

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('LoginContorller', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_mail@mail.com', password: 'any_password' })
  })

  test('should return 401 if Authentication fails', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if Authentication aceept', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(okRequest({ accessToken: 'any_token', name: 'any_name' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpResquest = mockRequest()
    await sut.handle(httpResquest)
    expect(validateSpy).toHaveBeenCalledWith(httpResquest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badResquest(new MissingParamError('any_param')))
  })
})

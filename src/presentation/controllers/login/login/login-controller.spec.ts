import { Authentication, AuthenticationData } from '../../../../domain/usecases/account/authentication'
import { MissingParamError } from '../../../errors'
import { badResquest, okRequest, serverError, unauthorized } from '../../../helpers/http/http-helper'
import { Validation } from '../../../protocols/validation'
import { HttpResquest } from '../../../protocols'
import { LoginController } from './login-controller'

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeAccountRequest = (): HttpResquest => (
  {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
)

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authenticationData: AuthenticationData): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
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
    await sut.handle(makeAccountRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  test('should return 401 if Authentication fails', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeAccountRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeAccountRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if Authentication aceept', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeAccountRequest())
    expect(httpResponse).toEqual(okRequest({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpResquest = makeAccountRequest()
    await sut.handle(httpResquest)
    expect(validateSpy).toHaveBeenCalledWith(httpResquest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const httpResponse = await sut.handle(makeAccountRequest())
    expect(httpResponse).toEqual(badResquest(new MissingParamError('any_param')))
  })
})

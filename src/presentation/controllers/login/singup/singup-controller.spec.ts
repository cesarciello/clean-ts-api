import { SignUpController } from './singup-controller'
import { HttpResquest } from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { mockAddAccountWithConfirmationParams } from '@/domain/test'
import { Authentication } from '@/domain/usecases/account/authentication'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { mockAddAccount, mockAuthentication, mockValidation } from '@/presentation/test'
import { badResquest, forbidden, okRequest, serverError } from '@/presentation/helpers/http/http-helper'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const mockRequest = (): HttpResquest => ({ body: mockAddAccountWithConfirmationParams() })

describe('SingUp Controller', () => {
  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new ServerError(null)))
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
  })

  test('should return 200 if valid data is provide', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(okRequest({ accessToken: 'any_token' }))
  })

  test('should return 403 if addAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
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

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_mail@mail.com', password: 'any_password' })
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

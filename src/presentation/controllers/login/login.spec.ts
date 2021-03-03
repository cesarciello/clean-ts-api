import { InvalidParamError, MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import { HttpResquest } from '../../protocols'
import { EmailValidator } from '../singup/singup-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeAccountRequest = (): HttpResquest => (
  {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
)

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('LoginContorller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeAccountRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badResquest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeAccountRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badResquest(new MissingParamError('password')))
  })

  test('should EmailValidator calls if corretct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeAccountRequest()
    await sut.handle(httpRequest)
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeAccountRequest())
    expect(httpResponse).toEqual(badResquest(new InvalidParamError('email')))
  })
})

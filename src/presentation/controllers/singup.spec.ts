import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { SignUpController } from './singup'
import { EmailValidator } from '../protocols'
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SingUp Controller', () => {
  test('should return 400 is no name is provide', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponde = sut.handle(httpRequest)
    expect(httpResponde.statusCode).toBe(400)
    expect(httpResponde.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 is no email is provide', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponde = sut.handle(httpRequest)
    expect(httpResponde.statusCode).toBe(400)
    expect(httpResponde.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 is no password is provide', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponde = sut.handle(httpRequest)
    expect(httpResponde.statusCode).toBe(400)
    expect(httpResponde.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 is no passwordConfirmation is provide', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponde = sut.handle(httpRequest)
    expect(httpResponde.statusCode).toBe(400)
    expect(httpResponde.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 is invalid email is provide', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponde = sut.handle(httpRequest)
    expect(httpResponde.statusCode).toBe(400)
    expect(httpResponde.body).toEqual(new InvalidParamError('email'))
  })

  test('should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new ServerError()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponde = sut.handle(httpRequest)
    expect(httpResponde.statusCode).toBe(500)
    expect(httpResponde.body).toEqual(new ServerError())
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
})

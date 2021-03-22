import { InvalidParamError, ServerError } from '@/presentation/errors'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { EmailValidation } from '@/validation/validator'
import { mockEmailValidatorStub } from '../mock'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const mockInput = (): any => (
  {
    email: 'any_mail@mail.com'
  }
)

describe('EmailValidation', () => {
  test('should return an error if invalid email is provide', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(mockInput())
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should throws if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new ServerError(null) })
    expect(sut.validate).toThrow()
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate(mockInput())
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
})

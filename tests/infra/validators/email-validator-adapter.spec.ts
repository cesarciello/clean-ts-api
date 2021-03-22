import validator from 'validator'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

jest.mock('validator', () => ({
  isEmail(email: string): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter()

describe('EmailValidator Adapter', () => {
  test('should returns false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_mail@mail.com')
    expect(isValid).toBe(false)
  })

  test('should returns true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_mail@mail.com')
    expect(isValid).toBe(true)
  })

  test('should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid_mail@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid_mail@mail.com')
  })
})

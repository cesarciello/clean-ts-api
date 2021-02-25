import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(email: string): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_mail@mail.com')
    expect(isValid).toBe(false)
  })

  test('should returns true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_mail@mail.com')
    expect(isValid).toBe(true)
  })
})

import { ComparesFiledsValidation } from '../../presentation/helpers/validator/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validator/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validator/required-field-validation'
import { Validation } from '../../presentation/helpers/validator/validation'
import { ValidationComposite } from '../../presentation/helpers/validator/validation-composite'
import { EmailValidator } from '../../presentation/protocols/email-validator'
import { makeSingupValidation } from './sigup-validation'

jest.mock('../../presentation/helpers/validator/validation-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SingupValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSingupValidation()
    const validations: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new ComparesFiledsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

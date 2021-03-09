import { makeLoginValidation } from './login-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helpers/validator'

jest.mock('../../../../presentation/helpers/validator/validation-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

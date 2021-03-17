import { mockEmailValidatorStub } from '@/validation/test'
import { Validation } from '@/presentation/protocols/validation'
import { makeLoginValidation } from './login-validation-factory'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validator'

jest.mock('../../../../../validation/validator/validation-composite')

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

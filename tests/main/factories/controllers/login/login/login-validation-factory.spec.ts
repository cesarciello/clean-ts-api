import { Validation } from '@/presentation/protocols/validation'
import { makeLoginValidation } from '@/main/factories/controllers/login'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validator'
import { mockEmailValidatorStub } from '@/tests/validation/mock'

jest.mock('@/validation/validator/validation-composite')

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

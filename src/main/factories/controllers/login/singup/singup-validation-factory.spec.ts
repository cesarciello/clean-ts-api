import { mockEmailValidatorStub } from '@/validation/test'
import { Validation } from '@/presentation/protocols/validation'
import { makeSingupValidation } from './sigup-validation-factory'
import { ComparesFiledsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validator'

jest.mock('../../../../../validation/validator/validation-composite')

describe('SingupValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSingupValidation()
    const validations: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new ComparesFiledsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

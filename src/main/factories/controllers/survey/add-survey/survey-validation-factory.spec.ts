import { makeAddSuveyValidation } from './add-survey-validation-factory'
import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validator'

jest.mock('../../../../../validation/validator/validation-composite')

describe('AddSuveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSuveyValidation()
    const validations: Validation[] = []
    const requiredFields = ['question', 'answers']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

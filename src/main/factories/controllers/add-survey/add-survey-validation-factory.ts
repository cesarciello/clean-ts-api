import { Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validator'

export const makeAddSuveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['question', 'answers']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}

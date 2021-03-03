import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from '../../presentation/helpers/validator/required-field-validation'
import { Validation } from '../../presentation/helpers/validator/validation'
import { ValidationComposite } from '../../presentation/helpers/validator/validation-composite'

export const makeSingupValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}

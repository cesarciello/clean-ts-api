import { EmailValidation } from '../../../presentation/helpers/validator/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validator/required-field-validation'
import { Validation } from '../../../presentation/helpers/validator/validation'
import { ValidationComposite } from '../../../presentation/helpers/validator/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}

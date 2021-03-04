import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class ComparesFiledsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldNameToCompare: string

  constructor(fieldName: string, fieldNameToCompare: string) {
    this.fieldName = fieldName
    this.fieldNameToCompare = fieldNameToCompare
  }

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare)
    }
  }
}

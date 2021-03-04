import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

interface SutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('name')
  return {
    sut
  }
}

const makeFakeInput = (): any => (
  {
    email: 'any_mail@mail.com'
  }
)

describe('RequiredFieldValidation', () => {
  test('should return an MissingParamError if no provide field', () => {
    const { sut } = makeSut()
    const error = sut.validate(makeFakeInput())
    expect(error).toEqual(new MissingParamError('name'))
  })
})

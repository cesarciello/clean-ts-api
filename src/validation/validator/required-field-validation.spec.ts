import { MissingParamError } from '@/presentation/errors'
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

describe('RequiredFieldValidation', () => {
  test('should return an MissingParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      email: 'any_mail@mail.com'
    })
    expect(error).toEqual(new MissingParamError('name'))
  })

  test('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      name: 'any_name'
    })
    expect(error).toBeFalsy()
  })
})

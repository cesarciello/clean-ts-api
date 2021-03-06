import { InvalidParamError } from '@/presentation/errors'
import { ComparesFiledsValidation } from '@/validation/validator'

type SutTypes = {
  sut: ComparesFiledsValidation
}

const makeSut = (): SutTypes => {
  const sut = new ComparesFiledsValidation('field', 'fieldValidation')
  return {
    sut
  }
}

describe('ComparesFiledsValidation', () => {
  test('should return an InvalidParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      field: '123',
      fieldValidation: '1234'
    })
    expect(error).toEqual(new InvalidParamError('fieldValidation'))
  })

  test('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      field: '123',
      fieldValidation: '123'
    })
    expect(error).toBeFalsy()
  })
})

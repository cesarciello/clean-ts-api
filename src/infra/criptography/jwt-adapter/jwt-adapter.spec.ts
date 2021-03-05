import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const makeSut = (): JwtAdapter => {
  const secretKey = 'secret'
  const sut = new JwtAdapter(secretKey)
  return sut
}

describe('JwtAdapter', () => {
  test('should call sing with correct values', async () => {
    const sut = makeSut()
    const singSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})

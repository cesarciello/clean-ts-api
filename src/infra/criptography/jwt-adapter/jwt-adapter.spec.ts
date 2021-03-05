import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign(value: Object, secretKey: string): string {
    return 'any_jwt'
  }
}))

const makeSut = (): JwtAdapter => {
  const secretKey = 'secret'
  const sut = new JwtAdapter(secretKey)
  return sut
}

describe('JwtAdapter', () => {
  test('should calls sing with correct values', async () => {
    const sut = makeSut()
    const singSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('should return a token on sign success', async () => {
    const sut = makeSut()
    const token = await sut.encrypt('any_id')
    expect(token).toBe('any_jwt')
  })
})

import { BCryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('BCryptAdapter', () => {
  test('should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})

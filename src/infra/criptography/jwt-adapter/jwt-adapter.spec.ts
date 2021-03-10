import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign(value: Object, secretKey: string): Promise<string> {
    return 'any_jwt'
  },
  async verify(value: Object, secretKey: string): Promise<string> {
    return 'any_value'
  }
}))

const makeSut = (): JwtAdapter => {
  const secretKey = 'secret'
  const sut = new JwtAdapter(secretKey)
  return sut
}

describe('JwtAdapter', () => {
  describe('sing()', () => {
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

    test('should throws if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('should calls verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('should return a value on verify success', async () => {
      const sut = makeSut()
      const token = await sut.decrypt('any_token')
      expect(token).toBe('any_value')
    })
  })
})

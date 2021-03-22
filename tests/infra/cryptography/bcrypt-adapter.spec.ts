import bcrypt from 'bcrypt'
import { BCryptAdapter } from '@/infra/criptography'

jest.mock('bcrypt', () => ({
  async hash(data: any, saltOrRounds: string): Promise<string> {
    return Promise.resolve('hashed_value')
  },
  async compare(valeu: string, hash: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const salt = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCryptAdapter', () => {
  describe('hash()', () => {
    test('should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('should return a valid hash on hash function success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hashed_value')
    })

    test('should throws if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('should return true when values compare is true', async () => {
      const sut = makeSut()
      const compare = await sut.compare('any_value', 'hashed_value')
      expect(compare).toBe(true)
    })

    test('should return false when values compare is false', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)
      const compare = await sut.compare('any_value', 'hashed_value')
      expect(compare).toBe(false)
    })

    test('should throws if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error())
      const promise = sut.compare('any_value', 'hashed_value')
      await expect(promise).rejects.toThrow()
    })
  })
})

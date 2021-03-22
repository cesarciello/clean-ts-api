import { mockAccountModel } from '@/domain/test'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { mockAccountByTokenRepository, mockDecrypter } from '@/data/test'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositorySub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositorySub = mockAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositorySub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositorySub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return null if Decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySub } = makeSut()
    const loadByTokentSpy = jest.spyOn(loadAccountByTokenRepositorySub, 'loadByToken')
    await sut.loadByToken('any_token', 'any_role')
    expect(loadByTokentSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('should return null if LoadAccountByTokenRepository return null', async () => {
    const { sut, loadAccountByTokenRepositorySub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySub, 'loadByToken').mockReturnValueOnce(null)
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('should return account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })

  test('should throws if Decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('should throws if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySub, 'loadByToken').mockRejectedValueOnce(new Error())
    const promise = sut.loadByToken('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})

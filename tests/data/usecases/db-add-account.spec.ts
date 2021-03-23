import { mockAddAccountParams } from '../../domain/mock'
import { mockAddAccountRepository, mockCheckAccountByEmailRepository, mockHasher } from '../mock'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { DbAddAccount } from '@/data/usecases/account/db-add-account'
import { AddAccountRepository, CheckAccountByEmailRepository } from '@/data/protocols/db/account'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, checkAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecases', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAddAccountParams())
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  test('should throws if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('should throws if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return true on success', async () => {
    const { sut } = makeSut()
    const hasAccount = await sut.add(mockAddAccountParams())
    expect(hasAccount).toEqual(true)
  })

  test('should return false if addAccountRepositoryStub return false', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(false)
    const hasAccount = await sut.add(mockAddAccountParams())
    expect(hasAccount).toEqual(false)
  })

  test('should return false if CheckAccountByEmailRepository not return null', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail').mockResolvedValueOnce(true)
    const hasAccount = await sut.add(mockAddAccountParams())
    expect(hasAccount).toBeFalsy()
  })

  test('should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    const spyLoad = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
    const accountData = mockAddAccountParams()
    await sut.add(mockAddAccountParams())
    expect(spyLoad).toHaveBeenCalledWith(accountData.email)
  })
})

import { DbAuthentication } from './db-authentication'
import { mockAuthenticationParams } from '@/domain/test'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'

type SutTypes = {
  sut: DbAuthentication
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('Db Authentication', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const spyLoad = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const authenticationData = mockAuthenticationParams()
    await sut.auth(authenticationData)
    expect(spyLoad).toHaveBeenCalledWith(authenticationData.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const authenticationData = mockAuthenticationParams()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const authenticationData = mockAuthenticationParams()
    const accessToken = await sut.auth(authenticationData)
    expect(accessToken).toBeNull()
  })

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const spyComapare = jest.spyOn(hashComparerStub, 'compare')
    const authenticationData = mockAuthenticationParams()
    await sut.auth(authenticationData)
    expect(spyComapare).toHaveBeenCalledWith('any_password', 'hash_password')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const authenticationData = mockAuthenticationParams()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const authenticationData = mockAuthenticationParams()
    const accessToken = await sut.auth(authenticationData)
    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const spyGenerate = jest.spyOn(encrypterStub, 'encrypt')
    const authenticationData = mockAuthenticationParams()
    await sut.auth(authenticationData)
    expect(spyGenerate).toHaveBeenCalledWith('any_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const authenticationData = mockAuthenticationParams()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })

  test('should return a token on success', async () => {
    const { sut } = makeSut()
    const authenticationData = mockAuthenticationParams()
    const accessToken = await sut.auth(authenticationData)
    expect(accessToken).toBe('any_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const spyUpdate = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const authenticationData = mockAuthenticationParams()
    await sut.auth(authenticationData)
    expect(spyUpdate).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    const authenticationData = mockAuthenticationParams()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })
})

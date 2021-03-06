import { mockAuthenticationParams } from '../../domain/mock'
import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '../mock'
import { DbAuthentication } from '@/data/usecases/account'
import { HashComparer, Encrypter } from '@/data/protocols/criptography'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols/db/account'

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
    const auth = await sut.auth(authenticationData)
    expect(auth).toBeNull()
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
    const auth = await sut.auth(authenticationData)
    expect(auth).toBeNull()
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

  test('should return a Authentication Result on success', async () => {
    const { sut } = makeSut()
    const authenticationData = mockAuthenticationParams()
    const auth = await sut.auth(authenticationData)
    expect(auth).toEqual({ accessToken: 'any_token', name: 'any_name' })
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

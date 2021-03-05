import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../../../domain/models/account'
import { HashComparer } from '../../protocols/criptograpy/hash-comparer'
import { AuthenticationData } from '../../../domain/usecases/authentication'
import { Encrypter } from '../../protocols/criptograpy/encrypter'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

interface SutTypes {
  sut: DbAuthentication
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'any_id',
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'hash_password'
      }
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(valeu: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

const makeFakeAuthData = (): AuthenticationData => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

describe('Db Authentication', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const spyLoad = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const authenticationData = makeFakeAuthData()
    await sut.auth(authenticationData)
    expect(spyLoad).toHaveBeenCalledWith(authenticationData.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authenticationData = makeFakeAuthData()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const authenticationData = makeFakeAuthData()
    const accessToken = await sut.auth(authenticationData)
    expect(accessToken).toBeNull()
  })

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const spyComapare = jest.spyOn(hashComparerStub, 'compare')
    const authenticationData = makeFakeAuthData()
    await sut.auth(authenticationData)
    expect(spyComapare).toHaveBeenCalledWith('any_password', 'hash_password')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authenticationData = makeFakeAuthData()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const authenticationData = makeFakeAuthData()
    const accessToken = await sut.auth(authenticationData)
    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const spyGenerate = jest.spyOn(encrypterStub, 'encrypt')
    const authenticationData = makeFakeAuthData()
    await sut.auth(authenticationData)
    expect(spyGenerate).toHaveBeenCalledWith('any_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authenticationData = makeFakeAuthData()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })

  test('should return a token on success', async () => {
    const { sut } = makeSut()
    const authenticationData = makeFakeAuthData()
    const accessToken = await sut.auth(authenticationData)
    expect(accessToken).toBe('any_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const spyUpdate = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const authenticationData = makeFakeAuthData()
    await sut.auth(authenticationData)
    expect(spyUpdate).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authenticationData = makeFakeAuthData()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })
})

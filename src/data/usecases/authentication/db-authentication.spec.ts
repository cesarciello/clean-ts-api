import { AccountModel } from '../../../domain/models/account'
import { AuthenticationData } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptograpy/hash-comparer'
import { TokenGenerator } from '../../protocols/criptograpy/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeSut = (): SutTypes => {
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}

const makeFakeAuthData = (): AuthenticationData => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

describe('Db Authentication', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const spyLoad = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const authenticationData = makeFakeAuthData()
    await sut.auth(authenticationData)
    expect(spyLoad).toHaveBeenCalledWith(authenticationData.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authenticationData = makeFakeAuthData()
    const authPromise = sut.auth(authenticationData)
    await expect(authPromise).rejects.toEqual(new Error())
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
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

  test('should call TokenGenarator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const spyGenerate = jest.spyOn(tokenGeneratorStub, 'generate')
    const authenticationData = makeFakeAuthData()
    await sut.auth(authenticationData)
    expect(spyGenerate).toHaveBeenCalledWith('any_id')
  })
})

import { Decrypter } from '../../protocols/criptograpy/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositorySub: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
  }
)

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositorySub = makeLoadAccountByTokenRepository()
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
})

import { HashComparer } from '../../protocols/criptograpy/hash-comparer'
import { Encrypter } from '../../protocols/criptograpy/encrypter'
import { Authentication, AuthenticationData } from '../../../domain/usecases/authentication'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor(
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
    loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth(authenticationData: AuthenticationData): Promise<string> {
    const { email, password } = authenticationData
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      const isPasswordEqual = await this.hashComparer.compare(password, account.password)
      if (isPasswordEqual) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}

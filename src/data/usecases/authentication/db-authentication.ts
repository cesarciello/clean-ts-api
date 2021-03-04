import { HashComparer } from '../../protocols/criptograpy/hash-comparer'
import { TokenGenerator } from '../../protocols/criptograpy/token-generator'
import { Authentication, AuthenticationData } from '../../../domain/usecases/authentication'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor(
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
    loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth(authenticationData: AuthenticationData): Promise<string> {
    const { email, password } = authenticationData
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      const isPasswordEqual = await this.hashComparer.compare(password, account.password)
      if (isPasswordEqual) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}

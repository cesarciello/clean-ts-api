import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
  }

  async auth(authenticationData: AuthenticationParams): Promise<string> {
    const { email, password } = authenticationData
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
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

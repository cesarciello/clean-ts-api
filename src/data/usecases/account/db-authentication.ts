import { AuthenticationModel } from '@/domain/models/authentication'
import { Encrypter, HashComparer } from '@/data/protocols/criptography'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols/db/account'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
  }

  async auth(authenticationData: AuthenticationParams): Promise<AuthenticationModel> {
    const { email, password } = authenticationData
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (account) {
      const isPasswordEqual = await this.hashComparer.compare(password, account.password)
      if (isPasswordEqual) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return {
          name: account.name,
          accessToken
        }
      }
    }
    return null
  }
}

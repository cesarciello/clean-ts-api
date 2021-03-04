import { Authentication, AuthenticationData } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptograpy/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth(authenticationData: AuthenticationData): Promise<string> {
    const { email } = authenticationData
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      await this.hashComparer.compare(authenticationData.password, account.password)
    }
    return null
  }
}

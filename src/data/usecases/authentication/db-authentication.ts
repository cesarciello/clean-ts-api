import { Authentication, AuthenticationData } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth(authenticationData: AuthenticationData): Promise<string> {
    const { email } = authenticationData
    await this.loadAccountByEmailRepository.load(email)
    return new Promise(resolve => resolve(null))
  }
}

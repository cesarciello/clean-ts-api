import { AccountModel } from '@/domain/models/account'
import { Decrypter } from '@/data/protocols/criptography'
import { LoadAccountByToken } from '@/domain/usecases/account'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
    let token: string
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
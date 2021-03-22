import { AccountModel } from '@/domain/models/account'
import { Hasher } from '@/data/protocols/criptography'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db/account'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
  }

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const hasAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (hasAccount) {
      return null
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}

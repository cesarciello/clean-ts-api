import { AccountModel } from '@/domain/models/account'
import { Hasher } from '@/data/protocols/criptograpy/hasher'
import { AddAccount, AddAccountModel } from '@/domain/usecases/account/add-account'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hasAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (hasAccount) {
      return null
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return new Promise(resolve => resolve(account))
  }
}

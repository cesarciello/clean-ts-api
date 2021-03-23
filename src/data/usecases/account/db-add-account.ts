import { AddAccount } from '@/domain/usecases/account'
import { Hasher } from '@/data/protocols/criptography'
import { AddAccountRepository, CheckAccountByEmailRepository } from '@/data/protocols/db/account'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {
  }

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const hasAccount = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)
    let createdAccount = false
    if (!hasAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      createdAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return createdAccount
  }
}

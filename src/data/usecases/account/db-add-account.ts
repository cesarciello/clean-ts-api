import { AddAccount } from '@/domain/usecases/account'
import { Hasher } from '@/data/protocols/criptography'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db/account'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
  }

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    let createdAccount = false
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      createdAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return createdAccount
  }
}

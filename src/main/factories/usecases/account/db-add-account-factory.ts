import { DbAddAccount } from '@/data/usecases/account'
import { AddAccount } from '@/domain/usecases/account'
import { makeBcryptAdapter } from '@/main/factories/adapters'
import { AccountMongoRepository } from '@/infra/db/mongodb/account'

export const makeDbAddAccount = (): AddAccount => {
  const addAccountRepository = new AccountMongoRepository()
  return new DbAddAccount(makeBcryptAdapter(), addAccountRepository, addAccountRepository)
}

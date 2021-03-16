import { AddAccount } from '@/domain/usecases/account/add-account'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { makeBcryptAdapter } from '@/main/factories/adapters/bcrypt/bcrypt-adapter-factory'

export const makeDbAddAccount = (): AddAccount => {
  const addAccountRepository = new AccountMongoRepository()
  return new DbAddAccount(makeBcryptAdapter(), addAccountRepository, addAccountRepository)
}

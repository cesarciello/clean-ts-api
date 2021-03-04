import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../../presentation/controllers/singup/singup'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSingupValidation } from './sigup-validation'

export const makeSingupController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const singupController = new SignUpController(dbAddAccount, makeSingupValidation())
  return new LogControllerDecorator(singupController, logMongoRepository)
}

import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const secret = env.jwtSecret
  const logMongoRepository = new LogMongoRepository()
  const loginValidation = makeLoginValidation()
  const bcryptAdapter = new BCryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(secret)
  const accountMongoRepository = new AccountMongoRepository()
  const authentication = new DbAuthentication(bcryptAdapter, jwtAdapter, accountMongoRepository, accountMongoRepository)
  const singupController = new LoginController(authentication, loginValidation)
  return new LogControllerDecorator(singupController, logMongoRepository)
}

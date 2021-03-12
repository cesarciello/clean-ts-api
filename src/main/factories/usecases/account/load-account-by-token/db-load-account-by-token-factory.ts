import env from '../../../../config/env'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { LoadAccountByToken } from '../../../../../domain/usecases/load-account-by-token'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { DbLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token'

export const makeDbAddALoadAccountByToken = (): LoadAccountByToken => {
  return new DbLoadAccountByToken(new JwtAdapter(env.jwtSecret), new AccountMongoRepository())
}

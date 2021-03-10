import { DbAuthentication } from '../../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../../domain/usecases/authentication'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../../config/env'
import { makeBcryptAdapter } from '../../../adapters/bcrypt/bcrypt-adapter-factory'

export const makeDbAuthentication = (): Authentication => {
  const secret = env.jwtSecret
  const jwtAdapter = new JwtAdapter(secret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(makeBcryptAdapter(), jwtAdapter, accountMongoRepository, accountMongoRepository)
}

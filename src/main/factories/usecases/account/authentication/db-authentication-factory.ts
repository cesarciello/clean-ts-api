import env from '@/main/config/env'
import { Authentication } from '@/domain/usecases/authentication'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'
import { makeBcryptAdapter } from '@/main/factories/adapters/bcrypt/bcrypt-adapter-factory'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAuthentication = (): Authentication => {
  const secret = env.jwtSecret
  const jwtAdapter = new JwtAdapter(secret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(makeBcryptAdapter(), jwtAdapter, accountMongoRepository, accountMongoRepository)
}

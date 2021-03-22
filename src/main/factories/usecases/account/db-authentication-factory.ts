import env from '@/main/config/env'
import { JwtAdapter } from '@/infra/criptography'
import { Authentication } from '@/domain/usecases/account'
import { DbAuthentication } from '@/data/usecases/account'
import { makeBcryptAdapter } from '@/main/factories/adapters'
import { AccountMongoRepository } from '@/infra/db/mongodb/account'

export const makeDbAuthentication = (): Authentication => {
  const secret = env.jwtSecret
  const jwtAdapter = new JwtAdapter(secret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(makeBcryptAdapter(), jwtAdapter, accountMongoRepository, accountMongoRepository)
}

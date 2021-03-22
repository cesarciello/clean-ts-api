import env from '@/main/config/env'
import { JwtAdapter } from '@/infra/criptography'
import { LoadAccountByToken } from '@/domain/usecases/account'
import { DbLoadAccountByToken } from '@/data/usecases/account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account'

export const makeDbAddALoadAccountByToken = (): LoadAccountByToken => {
  return new DbLoadAccountByToken(new JwtAdapter(env.jwtSecret), new AccountMongoRepository())
}

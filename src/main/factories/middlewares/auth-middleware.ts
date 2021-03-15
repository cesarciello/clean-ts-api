import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { makeDbAddALoadAccountByToken } from '@/main/factories/usecases/account/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleWare = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbAddALoadAccountByToken(), role)
}

import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares'
import { makeDbAddALoadAccountByToken } from '@/main/factories/usecases/account'

export const makeAuthMiddleWare = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbAddALoadAccountByToken(), role)
}

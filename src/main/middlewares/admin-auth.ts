import { adaptMiddleware } from '@/main/adapter/express/express-middleware-adapter'
import { makeAuthMiddleWare } from '@/main/factories/middlewares/auth-middleware'

export const adminAuth = adaptMiddleware(makeAuthMiddleWare('admin'))

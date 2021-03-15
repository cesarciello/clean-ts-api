import { adaptMiddleware } from '@/main/adapter/express/express-middleware-adapter'
import { makeAuthMiddleWare } from '@/main/factories/middlewares/auth-middleware'

export const auth = adaptMiddleware(makeAuthMiddleWare())
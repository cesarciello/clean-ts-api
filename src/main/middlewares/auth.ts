import { adaptMiddleware } from '../adapter/express/express-middleware-adapter'
import { makeAuthMiddleWare } from '../factories/middlewares/auth-middleware'

export const auth = adaptMiddleware(makeAuthMiddleWare())

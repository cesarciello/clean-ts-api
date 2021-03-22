import { adaptMiddleware } from '@/main/adapter/express'
import { makeAuthMiddleWare } from '@/main/factories/middlewares'

export const auth = adaptMiddleware(makeAuthMiddleWare())

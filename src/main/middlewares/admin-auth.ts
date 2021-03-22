import { adaptMiddleware } from '@/main/adapter/express'
import { makeAuthMiddleWare } from '@/main/factories/middlewares'

export const adminAuth = adaptMiddleware(makeAuthMiddleWare('admin'))

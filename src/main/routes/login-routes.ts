import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express'
import { makeLoginController, makeSingupController } from '@/main/factories/controllers/login'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}

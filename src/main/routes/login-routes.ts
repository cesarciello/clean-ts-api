import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express/express-route-adapter'
import { makeSingupController } from '@/main/factories/controllers/login/singup/singup-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}

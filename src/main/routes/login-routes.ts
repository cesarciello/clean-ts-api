import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeSingupController } from '../factories/controllers/login/singup/singup-controller-factory'
import { makeLoginController } from '../factories/controllers/login/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}

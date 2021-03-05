import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeSingupController } from '../factories/singup/singup-factory'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}

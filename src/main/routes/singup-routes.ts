import { Router } from 'express'
import { adaptRoute } from '../adapter/express-route-adapter'
import { makeSingupController } from '../factories/singup/singup'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingupController()))
}

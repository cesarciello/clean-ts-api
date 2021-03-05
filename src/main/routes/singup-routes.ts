import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeSingupController } from '../factories/singup/singup-factory'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingupController()))
}

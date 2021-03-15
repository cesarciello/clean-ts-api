import { Router } from 'express'
import { adaptMiddleware } from '../adapter/express/express-middleware-adapter'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleWare } from '../factories/middlewares/auth-middleware'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleWare('admin'))
  const auth = adaptMiddleware(makeAuthMiddleWare())

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}

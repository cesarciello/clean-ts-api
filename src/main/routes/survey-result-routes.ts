import { Router } from 'express'
import { auth } from '@/main/middlewares/auth'
import { adaptRoute } from '@/main/adapter/express/express-route-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '../factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
}

import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapter/express'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '../factories/controllers/survey-result'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
}

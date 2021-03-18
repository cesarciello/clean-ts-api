import { loginPath, singUpPath, surveysPath, saveSurveyResultPath } from './paths'
import { loginParams, accountSchema, errorSchema, surveySchema, surveyAnswerSchema, surveysSchema, singUpParams, addSurveyParams, saveSurveyResultParams, surveyResultSchema } from './schemas'
import { unauthorizedRequest, serverErrorRequest, badRequest, forbbidenRequest } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Clean archthure API in Node.Js use TypeScript',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    {
      name: 'Login'
    },
    {
      name: 'Survey'
    }
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveysPath,
    '/surveys/{surveyId}/results': saveSurveyResultPath,
    '/singup': singUpPath
  },
  schemas: {
    account: accountSchema,
    loginParams,
    error: errorSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    singUpParams,
    addSurveyParams,
    saveSurveyResultParams,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-access-token'
      }
    },
    badRequest,
    serverErrorRequest,
    unauthorizedRequest,
    forbbidenRequest
  }
}

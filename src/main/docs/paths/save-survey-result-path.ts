import { serverErrorRequest, forbbidenRequest } from '../components'

export const saveSurveyResultPath = {
  put: {
    security: [{ ApiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'API add or update a result to a survey',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyResultParams'
          }
        }
      }
    },
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        schema: {
          type: 'string'
        },
        required: true
      }
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      500: serverErrorRequest,
      403: forbbidenRequest
    }
  },
  get: {
    security: [{ ApiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'API load a result to a survey by your id',
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        schema: {
          type: 'string'
        },
        required: true
      }
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      500: serverErrorRequest,
      403: forbbidenRequest
    }
  }
}

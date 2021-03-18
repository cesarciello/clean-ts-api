import { serverErrorRequest, forbbidenRequest } from '../components'

export const surveysPath = {
  get: {
    security: [{ ApiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'API to list all surveys',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      500: serverErrorRequest,
      403: forbbidenRequest
    }
  },
  post: {
    security: [{ ApiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'API to add a new survey',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Success'
      },
      500: serverErrorRequest,
      403: forbbidenRequest
    }
  }
}

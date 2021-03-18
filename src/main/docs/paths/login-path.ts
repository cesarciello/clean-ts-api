import { unauthorizedRequest, serverErrorRequest, badRequest } from '../components'

export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API para autenticar usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: badRequest,
      500: serverErrorRequest,
      401: unauthorizedRequest
    }
  }
}

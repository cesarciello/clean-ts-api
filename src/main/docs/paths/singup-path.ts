import { unauthorizedRequest, serverErrorRequest, badRequest } from '../components'

export const singUpPath = {
  post: {
    tags: ['Login'],
    summary: 'API para cadastrar o usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/singUpParams'
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

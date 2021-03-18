export const unauthorizedRequest = {
  description: 'No permission Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}

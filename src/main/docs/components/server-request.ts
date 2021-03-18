export const serverErrorRequest = {
  description: 'Server Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}

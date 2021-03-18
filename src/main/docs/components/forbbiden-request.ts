export const forbbidenRequest = {
  description: 'No Access',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}

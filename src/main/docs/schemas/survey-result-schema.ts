export const surveyResultSchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string'
    },
    date: {
      type: 'string'
    },
    surveyId: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultsAnswer'
      }
    }
  }
}

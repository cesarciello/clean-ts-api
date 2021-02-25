import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'

export const badResquest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

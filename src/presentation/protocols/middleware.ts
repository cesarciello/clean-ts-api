import { HttpResponse, HttpResquest } from './http'

export interface Middleware {
  handle: (httpRequest: HttpResquest) => Promise<HttpResponse>
}

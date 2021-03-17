import { Express } from 'express'
import { bodyParser, contentType, cors } from '../middlewares'
import { noCache } from '../middlewares/no-cache'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(noCache)
}

import { Express } from 'express'
import swaggerConfig from '../docs'
import { serve, setup } from 'swagger-ui-express'
import { noCache } from '../middlewares'

export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerConfig))
}

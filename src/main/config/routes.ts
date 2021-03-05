import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import * as path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const pathRoutes = path.join(__dirname, '/..', '/routes')
  readdirSync(pathRoutes).map(async (file) => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}

import express, { Express } from 'express'
import * as path from 'path'

export default (app: Express): void => {
  const pathStatic = path.join(__dirname, '/../..', '/static')
  app.use('/static', express.static(pathStatic))
}

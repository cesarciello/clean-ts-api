import { Router } from 'express'

export default (router: Router): void => {
  router.post('/singup', (req, res) => {
    res.json({ ok: 'ok' })
  })
}

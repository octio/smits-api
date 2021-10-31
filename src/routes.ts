import { Router } from 'express'

export function getRoutes() {
  const router = Router()

  router.use('/', (_, res) => res.send('Hello, world!'))

  return router
}

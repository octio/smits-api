import { Router } from 'express'

import db from '@core/database/client'

import { makeAuthenticate } from './authenticate'

export function getRoutes() {
  const authentication = makeAuthenticate(db)

  const router = Router()

  router.route('/authentication').post(authentication)

  return router
}

import { Router } from 'express'

import db from '@core/database/client'

import { makeAuthenticate } from './authenticate'
import { sendEmail } from './email-service'

export function getRoutes() {
  const authentication = makeAuthenticate(db, sendEmail)

  const router = Router()

  router.route('/authentication').post(authentication)

  return router
}

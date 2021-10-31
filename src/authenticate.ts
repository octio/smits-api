/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { Secret, SignOptions, sign } from 'jsonwebtoken'
import * as yup from 'yup'

import { PrismaClient } from '.prisma/client'
import { validate } from '@core/validation'

const tokenOptions = { expiresIn: process.env.APP_TOKEN_EXPIRES_DAY }

const Authenticate = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório')
})

export const makeAuthenticate =
  (db: PrismaClient) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = await validate(req.body, Authenticate)
      const foundUser = await db.user.findUnique({
        where: { email }
      })

      const user = foundUser || (await db.user.create({ data: { email } }))

      const token = generateToken(
        user.email,
        process.env.AUTH_SECRET || 'secret',
        tokenOptions
      )

      await db.user.update({ data: { token }, where: { email } })

      res.send({ token })
    } catch (e) {
      next(e)
    }
  }

function generateToken(
  email: string,
  secret: Secret,
  options: SignOptions
): string {
  const data = { email }
  const token = sign({ data }, secret, options)
  return token
}

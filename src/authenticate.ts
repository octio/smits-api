/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { Secret, SignOptions, sign } from 'jsonwebtoken'
import nodemailer from 'nodemailer'
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

      const emailInput = {
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>'
      }
      await sendEmail(emailInput)

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

type SendMailInput = {
  from: string
  to: string
  subject: string
  text: string
  html?: string
}

async function sendEmail({ from, to, subject, text, html }: SendMailInput) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST!,
    port: process.env.EMAIL_PORT,
    secure: process.env.SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  })

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

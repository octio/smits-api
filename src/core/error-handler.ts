/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Response, Request, NextFunction } from 'express'
import { ValidationError } from 'yup'

import { CustomError } from '@core/errors'
import logger from '@core/logger'

const INTERNAL_MESSAGE =
  'Ocorreu um problema interno. Por favor, contate um administrador.'

function isInternalError(code: number): boolean {
  return code === 500
}

export default function errorHandler(
  err: CustomError,
  _: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ValidationError) {
    const errors = err.inner.map((e) => ({ [e.path!]: e.errors }))

    res.status(400).json({
      status: 400,
      message: 'Erro de validação',
      errors
    })

    logger.error(
      JSON.stringify({
        stack: err.stack,
        status: 400,
        message: 'Erro de validação',
        errors
      })
    )

    return
  }

  if (!err.code || isInternalError(err.code)) {
    res.status(500).json({
      status: 500,
      message: INTERNAL_MESSAGE
    })

    logger.error(JSON.stringify(err.stack))

    return
  }

  const formattedError = {
    name: err.name,
    message: err.message,
    errors: err.errors,
    code: err.code,
    stack: err.stack
  }

  const errorText = JSON.stringify(formattedError)

  logger.error(errorText)

  res.status(err.code).json({
    message: err.message,
    errors: err.errors
  })

  next()
}

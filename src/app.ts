import cors from 'cors'
import express from 'express'

import errorHandler from '@core/error-handler'
import { getRoutes } from './routes'

class App {
  public express: express.Application

  public constructor() {
    this.express = express()

    this.middlewares()
    this.routes()
    this.errorHandler()
  }

  private middlewares(): void {
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(cors({ exposedHeaders: ['Location', 'filename'] }))
  }

  private routes(): void {
    this.express.use('/pagamento/v1', getRoutes())
  }

  private errorHandler(): void {
    this.express.use(errorHandler)
  }
}

export default new App().express

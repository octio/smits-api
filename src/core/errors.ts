type ErrorOptions = {
  message?: string
  errors?: string[]
}

export abstract class CustomError extends Error {
  name: string
  code: number
  message: string
  isOperational: boolean
  errors?: string[]

  constructor(options: ErrorOptions = {}) {
    super()
    this.name = this.constructor.name
    this.code = 401
    this.message = options.message || 'Something went wrong'
    this.isOperational = true
    this.errors = options.errors
  }
}

export class AuthenticationError extends CustomError {
  constructor(options: ErrorOptions = {}) {
    super()
    this.name = this.constructor.name
    this.code = 422
    this.message = options.message || 'Usuário ou senha inválidos'
    this.isOperational = true
    this.errors = options.errors
  }
}

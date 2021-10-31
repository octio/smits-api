declare namespace Express {
  export interface Request {
    decoded: {
      data: {
        id: number
        name: string
        email: string
      }
    }
  }
}

import * as jwt from 'jsonwebtoken'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { config } from 'dotenv'

config()

const jwtSecret: jwt.Secret = process.env.JWT_SECRET as string

const jwtOptions: jwt.SignOptions = {
  expiresIn: '7d'
}

const createToken = (id: string, displayName: string, profileUrl: string, email?: string): string => {
  const payload = {
    id,
    displayName,
    profileUrl,
    email
  }

  const token = jwt.sign(payload, jwtSecret, jwtOptions)

  return token
}

const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['token'] as string

  try {
    const payload = jwt.verify(token, jwtSecret, jwtOptions)

    if (payload['email'] === undefined) {
      throw new Error()
    }

    req.user = payload

    next()
  } catch (e) {
    res.status(403).end()
  }
}

const verifyTokenWithoutEmail: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['token'] as string

  try {
    const payload = jwt.verify(token, jwtSecret, jwtOptions)
    req.user = payload

    next()
  } catch (e) {
    res.status(403).end()
  }
}

export { createToken, verifyToken, verifyTokenWithoutEmail }

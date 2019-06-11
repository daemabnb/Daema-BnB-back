import { Request, Response, NextFunction, RequestHandler } from 'express'
import DB, { UserDocument } from '../../model/index'
import mailer from '../../util/mailer'
import * as redis from '../../util/redis'
import { getRequest } from '../../util/request'
import { createToken } from '../../util/jwt'

const db: DB = new DB()

const postAuthemail: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body

  try {
    const authNum = await mailer(email)

    await redis.addAuthWaitingList(email, authNum)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}

const getSigninFacebook: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.body
    const uri = `https://graph.facebook.com/me?fields=id,name,link&access_token=${accessToken}`

    const response = await getRequest(uri)
    const responseBody = await response.json()
    const { id, name, profileUrl } = responseBody

    const user = await db.findUserById(id) as UserDocument

    if (user) {
      const token = createToken(user.profileId, user.displayName, user.profileId, user.email)

      res.status(200).json({
        token,
        isAdmin: user.isAdmin
      }).end()

      return
    }

    const token = createToken(id, name, profileUrl)

    res.status(201).json({ token }).end()
  } catch (error) {
    next(error)
  }
}

const postSignup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { email, authNum } = req.body

  try {
    const savedAuthNum = await redis.getSaleAuthNumber(email)

    if (authNum !== savedAuthNum) {
      res.status(405).end()
      return
    }

    const { id, displayName, profileUrl } = req.user

    await db.createUser({
      profileId: id,
      displayName,
      email,
      profileUrl
    })

    const token = createToken(id, displayName, profileUrl, email)

    res.status(201).json({ token }).end()
  } catch (e) {
    next(e)
  }
}

export { postAuthemail, getSigninFacebook, postSignup }

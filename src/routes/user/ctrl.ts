import { Request, Response, NextFunction, RequestHandler } from 'express'
import DB, { UserDocument } from '../../model/index'
import mailer from '../../util/mailer'
import * as redis from '../../util/redis'
import passport from '../../util/passport'
import { createToken } from '../../util/jwt'
import logger from '../../util/logger'

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

const getSigninFacebook: RequestHandler = passport.authenticate('facebook', {
  session: false,
  scope: ['public_profile', 'user_link']
})

const signinFacebookCallback: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('facebook', {
    session: false
  }, (err, user, info) => {
    logger.info(JSON.stringify(info))

    if (err) {
      next(err)
    }

    const { id, displayName, profileUrl, email } = info
    const token = createToken(id, displayName, profileUrl, email)

    if (user === true) {
      return res.status(200).json({ token }).end()
    }

    res.status(201).json({ token }).end()

  })(req, res, next)
}

const postSignup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { email, authNum } = req.body

  try {
    const savedAuthNum = await redis.getAuthNumber(email)

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

export { postAuthemail, getSigninFacebook, signinFacebookCallback, postSignup }

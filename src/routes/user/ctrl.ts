import * as express from 'express'
import mailer from '../../util/mailer'
import * as redis from '../../util/redis'
import passport from '../../util/passport'
import logger from '../../util/logger'

const postAuthemail = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  const { email } = req.body

  try {
    const authNum = await mailer(email)

    await redis.addAuthWaitingList(email, authNum)

    res.status(201).end()
  } catch (e) {
    next(e)
  }
}

const getSigninFacebook = passport.authenticate('facebook', {
  session: false,
  scope: ['public_profile', 'user_link']
})

const signinFacebookCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  passport.authenticate('facebook', {
    session: false
  }, (err, user, info) => {
    if (err) {
      next(err)
    }

    if (user === true) {
      logger.info(info)
      return res.status(200).json(info).end()
    }

    res.status(201).json(info).end()
  })(req, res, next)
}

export { postAuthemail, getSigninFacebook, signinFacebookCallback }

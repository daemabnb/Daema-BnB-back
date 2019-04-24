import * as passport from 'passport'
import { Strategy } from 'passport-facebook'
import { config } from 'dotenv'
import { User, UserFormat } from '../model/user'

config()

const facebookOptions = {
  clientID: process.env.FACEBOOK_CLIENT_ID as string,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
  callbackURL: '/user/signin/facebook/callback'
}

const facebookStrategy = new Strategy(facebookOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const user: UserFormat = await User.findOne().where('id').exec() as UserFormat

    if (user) {
      const { email, displayName, isAdmin } = user
      const userInfo = {
        email,
        displayName,
        isAdmin,
        accessToken: accessToken
      }

      done(null, true, userInfo)
    } else {
      done(null, false, accessToken)
    }
  } catch (e) {
    done(e, null)
  }
})

passport.use(facebookStrategy)

export default passport

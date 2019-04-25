import * as passport from 'passport'
import { Strategy } from 'passport-facebook'
import { config } from 'dotenv'
import { User, UserFormat } from '../model/user'

config()

class UserInfo {
  id: string
  displayName: string
  profileUrl: string
  accessToken: string
  isAdmin?: boolean
  email?: string

  constructor(id: string, displayName: string, profileUrl: string, accessToken: string, isAdmin?: boolean, email?: string) {
    this.id = id
    this.displayName = displayName
    this.profileUrl = profileUrl
    this.accessToken = accessToken
    this.isAdmin = isAdmin
    this.email = email
  }
}

const facebookOptions = {
  clientID: process.env.FACEBOOK_CLIENT_ID as string,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
  callbackURL: '/user/signin/facebook/callback'
}

const facebookStrategy = new Strategy(facebookOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const user: UserFormat = await User.findOne().where('id').exec() as UserFormat

    if (user) {
      const { id, email, profileUrl, displayName, isAdmin } = user
      const userInfo = new UserInfo(id, displayName, profileUrl, accessToken, isAdmin, email)

      done(null, true, userInfo)
    } else {
      const { id, displayName, profileUrl } = profile
      const userInfo = new UserInfo(id, displayName, profileUrl as string, accessToken)

      done(null, false, userInfo)
    }
  } catch (e) {
    done(e, null)
  }
})

passport.use(facebookStrategy)

export default passport
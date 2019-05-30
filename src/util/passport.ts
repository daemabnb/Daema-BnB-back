import * as passport from 'passport'
import { Strategy } from 'passport-facebook'
import { clientID, clientSecret, facebookCallback } from '../config'
import { User, UserDocument } from '../model/user'

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
  clientID,
  clientSecret,
  callbackURL: facebookCallback
}

const facebookStrategy = new Strategy(facebookOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const user: UserDocument = await User.findOne({ id: profile.id }).exec() as UserDocument

    if (user) {
      const { id, email, profileUrl, displayName, isAdmin } = user
      const userInfo = new UserInfo(id, displayName, profileUrl, accessToken, isAdmin, email)

      done(null, true, userInfo)
    } else {
      const { id, displayName, profileUrl } = profile
      const userInfo = new UserInfo(id, displayName, profileUrl as string, accessToken, false)

      done(null, false, userInfo)
    }
  } catch (e) {
    done(e, null)
  }
})

passport.use(facebookStrategy)

export default passport

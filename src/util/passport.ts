import * as passport from 'passport'
import { Strategy } from 'passport-facebook'

const facebookStrategy = new Strategy({
  clientID: '856575621215696',
  clientSecret: '094dea82ccbec5780ce891ca5eca963a',
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile)
  done(null, profile)
})

passport.use(facebookStrategy)

export default passport

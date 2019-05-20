import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyTokenWithoutEmail } from '../../util/jwt'

const userRouter: Router = Router()

userRouter.post('/authemail', ctrl.postAuthemail)
  .get('/signin/facebook', ctrl.getSigninFacebook)
  .get('/signin/facebook/callback', ctrl.signinFacebookCallback)
  .post('/signup', verifyTokenWithoutEmail, ctrl.postSignup)

export default userRouter

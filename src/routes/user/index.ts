import { Router } from 'express'
import * as ctrl from './ctrl'

const userRouter: Router = Router()

userRouter.post('/authemail', ctrl.postAuthemail)
  .get('/signin/facebook', ctrl.getSigninFacebook)
  .get('/signin/facebook/callback', ctrl.signinFacebookCallback)

export default userRouter

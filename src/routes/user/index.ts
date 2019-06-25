import { Router } from 'express'
import * as ctrl from './ctrl'
import { verifyToken, verifyTokenWithoutEmail } from '../../util/jwt'

const userRouter: Router = Router()

userRouter.get('/', verifyToken, ctrl.getUser)
  .post('/authemail', verifyTokenWithoutEmail, ctrl.postAuthemail)
  .post('/signin/facebook', ctrl.getSigninFacebook)
  .post('/signup', verifyTokenWithoutEmail, ctrl.postSignup)

export default userRouter

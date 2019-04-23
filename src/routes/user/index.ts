import { Router } from 'express'
import * as ctrl from './ctrl'
import passport from '../../util/passport'

const userRouter: Router = Router()

userRouter.post('/authemail', ctrl.postAuthemail)
  .post('/signin', passport.authenticate('facebook'))

export default userRouter

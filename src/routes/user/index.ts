import { Router } from 'express'
import * as ctrl from './ctrl'

const userRouter: Router = Router()

userRouter.post('/authemail', ctrl.postAuthemail)

export default userRouter

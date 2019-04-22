import { Router } from 'express'
import userRouter from './user/index'

const router: Router = Router()

router.use('/user', userRouter)

export default router

import { Router } from 'express'
import userRouter from './user/index'
import saleRouter from './sale/index'

const router: Router = Router()

router.use('/user', userRouter)
  .use('/sale', saleRouter)

export default router
